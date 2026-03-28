-- beta_sign_ups and feature_ideas: writable only via service_role on the server
-- (PostgREST with the secret key bypasses RLS). Anon/authenticated cannot read
-- or write these tables through the public API.

drop policy if exists "Allow anon and authenticated insert on beta_sign_ups"
  on public.beta_sign_ups;

drop policy if exists "Allow anon and authenticated update on beta_sign_ups"
  on public.beta_sign_ups;

drop policy if exists "beta_sign_ups_insert_anon_authenticated"
  on public.beta_sign_ups;

drop policy if exists "beta_sign_ups_update_anon_authenticated"
  on public.beta_sign_ups;

drop policy if exists "Allow anon and authenticated insert on feature_ideas"
  on public.feature_ideas;

drop policy if exists "feature_ideas_insert_anon_authenticated"
  on public.feature_ideas;

drop policy if exists "feature_ideas_update_anon_authenticated"
  on public.feature_ideas;

revoke all on table public.beta_sign_ups from anon, authenticated;
revoke all on table public.feature_ideas from anon, authenticated;

drop function if exists public.upsert_beta_signup(text, text, text, text);

-- One row per email for upserts from the landing page (matches beta_sign_ups).
alter table public.feature_ideas
  add constraint feature_ideas_email_key unique (email);

drop index if exists public.feature_ideas_email_idx;
