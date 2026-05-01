-- =====================================================================
-- Eric Fitness · Migration 0006 · admin role en profiles
-- Añade columna is_admin a profiles + extiende el trigger guard para
-- que solo el service_role pueda modificarla. Tras correr la migración,
-- marca a los admins manualmente con UPDATE en el SQL Editor.
-- =====================================================================

alter table public.profiles
  add column if not exists is_admin boolean not null default false;

create index if not exists profiles_is_admin_idx on public.profiles (is_admin) where is_admin = true;

-- Reescribimos la función guard para incluir is_admin junto a los demás
-- campos sensibles. Idéntica lógica que en 0001 + el nuevo campo.
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
    if new.is_admin               is distinct from old.is_admin              then new.is_admin               := old.is_admin;               end if;
    if new.is_premium             is distinct from old.is_premium            then new.is_premium             := old.is_premium;             end if;
    if new.stripe_customer_id     is distinct from old.stripe_customer_id    then new.stripe_customer_id     := old.stripe_customer_id;     end if;
    if new.stripe_subscription_id is distinct from old.stripe_subscription_id then new.stripe_subscription_id := old.stripe_subscription_id; end if;
    if new.subscription_status    is distinct from old.subscription_status   then new.subscription_status    := old.subscription_status;    end if;
    if new.current_period_end     is distinct from old.current_period_end    then new.current_period_end     := old.current_period_end;     end if;
  end if;
  new.updated_at := now();
  return new;
end$$;

-- Marca a Guillermo como admin (su UID, ya está en BD desde el backfill).
-- Si quieres añadir más admins después, copia esta línea con su UID.
update public.profiles
  set is_admin = true
  where id = '34da574f-df5b-4f19-b0ca-fa912507ac4b';

-- Verificación
select id, email, is_admin from public.profiles where is_admin = true;
