-- =====================================================================
-- Eric Fitness · Migration 0001 · profiles + videos (idempotent)
-- Run in Supabase → SQL Editor. Safe to re-run.
-- =====================================================================

-- ---------- profiles ----------
create table if not exists public.profiles (
  id                      uuid primary key references auth.users(id) on delete cascade,
  email                   text,
  full_name               text,
  avatar_url              text,
  is_premium              boolean not null default false,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  subscription_status     text,
  current_period_end      timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Idempotent column additions (in case the table already existed with fewer columns)
alter table public.profiles add column if not exists email text;
alter table public.profiles add column if not exists full_name text;
alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists is_premium boolean not null default false;
alter table public.profiles add column if not exists stripe_customer_id text;
alter table public.profiles add column if not exists stripe_subscription_id text;
alter table public.profiles add column if not exists subscription_status text;
alter table public.profiles add column if not exists current_period_end timestamptz;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

-- ---------- videos ----------
create table if not exists public.videos (
  id                uuid primary key default gen_random_uuid(),
  title             text not null,
  description       text,
  thumbnail_url     text,
  duration_seconds  int,
  category          text,
  provider          text not null default 'cloudflare' check (provider in ('cloudflare','youtube')),
  video_id          text not null,
  is_locked         boolean not null default true,
  position          int not null default 0,
  created_at        timestamptz not null default now()
);

alter table public.videos add column if not exists description text;
alter table public.videos add column if not exists thumbnail_url text;
alter table public.videos add column if not exists duration_seconds int;
alter table public.videos add column if not exists category text;
alter table public.videos add column if not exists provider text not null default 'cloudflare';
alter table public.videos add column if not exists video_id text;
alter table public.videos add column if not exists is_locked boolean not null default true;
alter table public.videos add column if not exists position int not null default 0;
alter table public.videos add column if not exists created_at timestamptz not null default now();

-- Enforce provider check if the column pre-existed without it
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'videos_provider_check'
  ) then
    alter table public.videos
      add constraint videos_provider_check check (provider in ('cloudflare','youtube'));
  end if;
end$$;

-- Drop any legacy NOT NULL column that predates this schema (e.g. a leftover
-- `cloudflare_id` from an older table version). We use `provider` + `video_id`
-- instead. Safe even if the column doesn't exist.
alter table public.videos drop column if exists cloudflare_id;

create index if not exists videos_position_idx on public.videos (position);
create index if not exists videos_is_locked_idx on public.videos (is_locked);

-- =====================================================================
-- Security definer helper: avoids recursion in RLS and keeps logic one place
-- =====================================================================
create or replace function public.is_active_premium(uid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select
       p.is_premium
       and (p.current_period_end is null or p.current_period_end > now())
     from public.profiles p
     where p.id = uid),
    false
  );
$$;

revoke all on function public.is_active_premium(uuid) from public;
grant execute on function public.is_active_premium(uuid) to authenticated, anon;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.videos  enable row level security;

-- ---------- profiles policies ----------
drop policy if exists "profiles_select_own"   on public.profiles;
drop policy if exists "profiles_update_own"   on public.profiles;
drop policy if exists "profiles_insert_self"  on public.profiles;

-- Users can read only their own profile
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Users can update only non-sensitive fields of their own profile.
-- is_premium, stripe_*, subscription_status, current_period_end MUST only be writable
-- by the service role (Stripe webhook). We enforce this via a trigger below.
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- Self-insert (normally handled by on_auth_user_created trigger, but allowed as fallback)
create policy "profiles_insert_self"
  on public.profiles for insert
  to authenticated
  with check (id = auth.uid());

-- Trigger: block non-service-role updates to premium/stripe fields
create or replace function public.profiles_guard_premium_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  is_service_role boolean := (current_setting('request.jwt.claims', true)::jsonb->>'role') = 'service_role';
begin
  if not is_service_role then
    if new.is_premium             is distinct from old.is_premium            then new.is_premium             := old.is_premium;             end if;
    if new.stripe_customer_id     is distinct from old.stripe_customer_id    then new.stripe_customer_id     := old.stripe_customer_id;     end if;
    if new.stripe_subscription_id is distinct from old.stripe_subscription_id then new.stripe_subscription_id := old.stripe_subscription_id; end if;
    if new.subscription_status    is distinct from old.subscription_status   then new.subscription_status    := old.subscription_status;    end if;
    if new.current_period_end     is distinct from old.current_period_end    then new.current_period_end     := old.current_period_end;     end if;
  end if;
  new.updated_at := now();
  return new;
end$$;

drop trigger if exists profiles_guard_premium on public.profiles;
create trigger profiles_guard_premium
  before update on public.profiles
  for each row execute function public.profiles_guard_premium_fields();

-- ---------- videos policies ----------
drop policy if exists "videos_select_unlocked_or_premium" on public.videos;
drop policy if exists "videos_modify_service_role_only"   on public.videos;

-- THE CORE GUARANTEE:
-- A row is returned by SELECT only if the video is unlocked OR the user has active premium.
-- Non-premium users literally cannot read the `video_id` field of locked videos via PostgREST.
create policy "videos_select_unlocked_or_premium"
  on public.videos for select
  to authenticated, anon
  using (
    is_locked = false
    or (auth.uid() is not null and public.is_active_premium(auth.uid()))
  );

-- No one with anon or authenticated role can write. Only service_role (via webhook / admin tools).
-- By omitting INSERT/UPDATE/DELETE policies and keeping RLS enabled, writes are implicitly denied.

-- =====================================================================
-- Auto-create profile on signup
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
