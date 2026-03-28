-- Mirror beta_sign_ups: allow anon/authenticated to update rows (e.g. future
-- upserts or edits) with the same permissive RLS shape.

grant update on table public.feature_ideas to anon, authenticated;

create policy "feature_ideas_update_anon_authenticated"
  on public.feature_ideas
  for update
  using (true)
  with check (true);
