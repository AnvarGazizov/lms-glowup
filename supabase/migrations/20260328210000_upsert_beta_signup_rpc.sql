-- PostgREST upsert maps to INSERT ... ON CONFLICT DO UPDATE. With RLS enabled,
-- the UPDATE branch requires existing rows to be visible under SELECT policies.
-- A public SELECT on beta_sign_ups would leak all sign-ups, so we keep the
-- table unreadable via the API and perform the upsert inside SECURITY DEFINER.

create or replace function public.upsert_beta_signup(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_institution text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.beta_sign_ups (first_name, last_name, email, institution)
  values (
    trim(p_first_name),
    trim(p_last_name),
    trim(p_email),
    nullif(trim(p_institution), '')
  )
  on conflict (email) do update
    set first_name = excluded.first_name,
        last_name = excluded.last_name,
        institution = excluded.institution;
end;
$$;

revoke all on function public.upsert_beta_signup(text, text, text, text) from public;
grant execute on function public.upsert_beta_signup(text, text, text, text) to anon, authenticated;
