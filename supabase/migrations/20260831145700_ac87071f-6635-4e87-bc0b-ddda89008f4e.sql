-- Roles
create type public.app_role as enum ('admin', 'moderator', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create policy "Users can view own roles"
on public.user_roles for select
to authenticated
using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.has_role(auth.uid(), 'admin')
$$;

-- Traffic log
create table public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  region text,
  locale text,
  country text,
  city text,
  referrer text,
  device text,
  session_id text,
  created_at timestamptz not null default now()
);

grant insert on public.page_views to anon, authenticated;
grant select on public.page_views to authenticated;
grant all on public.page_views to service_role;

alter table public.page_views enable row level security;

create policy "Anyone can record a page view"
on public.page_views for insert
to anon, authenticated
with check (true);

create policy "Admins can read page views"
on public.page_views for select
to authenticated
using (public.is_admin());

create index page_views_created_at_idx on public.page_views (created_at desc);
create index page_views_country_idx on public.page_views (country);

-- Admin visibility into subscriptions
create policy "Admins can view all subscriptions"
on public.subscriptions for select
to authenticated
using (public.is_admin());