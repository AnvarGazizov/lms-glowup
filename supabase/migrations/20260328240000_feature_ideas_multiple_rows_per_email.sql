-- Allow many idea submissions per email (insert each time; no upsert).
alter table public.feature_ideas
  drop constraint if exists feature_ideas_email_key;

create index if not exists feature_ideas_email_idx on public.feature_ideas (email);
