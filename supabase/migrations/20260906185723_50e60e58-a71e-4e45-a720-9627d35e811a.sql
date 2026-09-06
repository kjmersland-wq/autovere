alter table public.page_views add column if not exists visitor_id text;
alter table public.page_views add column if not exists user_id uuid;

create index if not exists page_views_visitor_id_idx on public.page_views (visitor_id);
create index if not exists page_views_user_id_idx on public.page_views (user_id);

create table if not exists public.product_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  path text,
  region text,
  locale text,
  country text,
  city text,
  device text,
  session_id text,
  visitor_id text,
  user_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

grant insert on public.product_events to anon;
grant select, insert on public.product_events to authenticated;
grant all on public.product_events to service_role;
grant usage on schema public to anon, authenticated;

alter table public.product_events enable row level security;

drop policy if exists "Anyone can record a product event" on public.product_events;
create policy "Anyone can record a product event"
  on public.product_events for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Admins can read product events" on public.product_events;
create policy "Admins can read product events"
  on public.product_events for select
  to authenticated
  using (public.is_admin());

create index if not exists product_events_created_at_idx on public.product_events (created_at desc);
create index if not exists product_events_event_name_idx on public.product_events (event_name);
create index if not exists product_events_visitor_id_idx on public.product_events (visitor_id);
create index if not exists product_events_user_id_idx on public.product_events (user_id);