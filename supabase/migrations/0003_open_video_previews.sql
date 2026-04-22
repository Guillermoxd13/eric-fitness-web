-- =====================================================================
-- Eric Fitness · Migration 0003 · open video previews
-- All users can now SEE every video card (title, thumbnail, duration…).
-- Only the /api/video/[id]/signed-url endpoint grants playback and it
-- enforces premium access for locked videos on the server.
-- Run in Supabase → SQL Editor. Safe to re-run.
-- =====================================================================

-- Replace the restrictive SELECT policy with an open one.
drop policy if exists "videos_select_unlocked_or_premium" on public.videos;
drop policy if exists "videos_select_all_authenticated"   on public.videos;

create policy "videos_select_all_authenticated"
  on public.videos for select
  to authenticated, anon
  using (true);

-- Safety net: drop any stray permissive policy accidentally created from the
-- Supabase Table Editor templates. If you re-add one from the dashboard, the
-- same OR-combination bug comes back.
drop policy if exists "Videos públicos"                 on public.videos;
drop policy if exists "Enable read access for all users" on public.videos;

-- NOTE: writes remain implicitly denied (no INSERT/UPDATE/DELETE policy exists
-- for anon/authenticated). Only the service_role (webhook / admin tools) can
-- modify videos.
