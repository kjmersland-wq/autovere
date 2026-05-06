create table public.compare_insights (
  id uuid primary key default gen_random_uuid(),
  pair_key text not null unique,
  car_a_slug text not null,
  car_b_slug text not null,
  car_a_name text not null,
  car_b_name text not null,
  summary text not null,
  contrasts jsonb not null default '[]'::jsonb,
  videos jsonb not null default '[]'::jsonb,
  source_count integer not null default 0,
  refreshed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.compare_insights enable row level security;

create policy "Public can read compare insights"
  on public.compare_insights for select
  to anon, authenticated
  using (true);

create index compare_insights_refreshed_idx on public.compare_insights (refreshed_at desc);