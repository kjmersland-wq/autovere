create table public.editorial_pulse (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  dek text not null,
  body text not null,
  theme text not null,
  featured_slugs jsonb not null default '[]'::jsonb,
  status text not null default 'published',
  refreshed_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.editorial_pulse enable row level security;

create policy "Public can read published pulse"
  on public.editorial_pulse for select
  to anon, authenticated
  using (status = 'published');

create index editorial_pulse_refreshed_idx on public.editorial_pulse (refreshed_at desc);