create table public.car_insights (
  id uuid primary key default gen_random_uuid(),
  car_slug text not null unique,
  car_name text not null,
  headline text,
  feel text,
  strengths jsonb not null default '[]'::jsonb,
  criticisms jsonb not null default '[]'::jsonb,
  source_signature text,
  source_count integer not null default 0,
  refreshed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index idx_car_insights_slug on public.car_insights(car_slug);

alter table public.car_insights enable row level security;

create policy "Public can read car insights"
on public.car_insights
for select
to anon, authenticated
using (true);
