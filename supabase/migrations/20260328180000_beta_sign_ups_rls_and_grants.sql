-- Ensure PostgREST roles can write waitlist tables and RLS policies apply.
-- Fixes "new row violates row-level security policy" when INSERT/UPSERT runs
-- as the API role but policies were scoped in a way that didn't match, or
-- table privileges were missing.

grant usage on schema public to anon, authenticated;

grant insert, update on table public.beta_sign_ups to anon, authenticated;
grant insert on table public.feature_ideas to anon, authenticated;

drop policy if exists "Allow anon and authenticated insert on beta_sign_ups"
  on public.beta_sign_ups;

drop policy if exists "Allow anon and authenticated update on beta_sign_ups"
  on public.beta_sign_ups;

-- Omit TO so the policy applies to every role (per Postgres); API access is
-- still gated by GRANTs on anon/authenticated above.
create policy "beta_sign_ups_insert_anon_authenticated"
  on public.beta_sign_ups
  for insert
  with check (true);

create policy "beta_sign_ups_update_anon_authenticated"
  on public.beta_sign_ups
  for update
  using (true)
  with check (true);

drop policy if exists "Allow anon and authenticated insert on feature_ideas"
  on public.feature_ideas;

create policy "feature_ideas_insert_anon_authenticated"
  on public.feature_ideas
  for insert
  with check (true);
