-- beta_sign_ups: beta waitlist
create table public.beta_sign_ups (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  first_name text not null,
  last_name text not null,
  email text not null,
  institution text
);

comment on table public.beta_sign_ups is 'Glow beta access sign-ups from the marketing site.';

create index beta_sign_ups_email_idx on public.beta_sign_ups (email);

alter table public.beta_sign_ups enable row level security;

create policy "Allow anon and authenticated insert on beta_sign_ups"
  on public.beta_sign_ups
  for insert
  to anon, authenticated
  with check (true);

-- feature_ideas: community idea submissions
create table public.feature_ideas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  idea text not null
);

comment on table public.feature_ideas is 'Feature ideas submitted from the marketing site.';

create index feature_ideas_email_idx on public.feature_ideas (email);

alter table public.feature_ideas enable row level security;

create policy "Allow anon and authenticated insert on feature_ideas"
  on public.feature_ideas
  for insert
  to anon, authenticated
  with check (true);
