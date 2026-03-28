-- One row per email: upserts from the landing page rely on this.
alter table public.beta_sign_ups
  add constraint beta_sign_ups_email_key unique (email);

-- Drop non-unique index replaced by unique constraint index.
drop index if exists public.beta_sign_ups_email_idx;

create policy "Allow anon and authenticated update on beta_sign_ups"
  on public.beta_sign_ups
  for update
  to anon, authenticated
  using (true)
  with check (true);
