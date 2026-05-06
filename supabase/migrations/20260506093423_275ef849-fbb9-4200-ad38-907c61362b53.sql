-- Standard role enum + table (safe pattern, separate from profiles)
do $$ begin
  create type public.app_role as enum ('admin', 'editor', 'user');
exception when duplicate_object then null; end $$;

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create policy "Users can read their own roles"
  on public.user_roles for select
  to authenticated
  using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

-- Suggestion queue
create table public.car_suggestions (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  name text not null,
  type text not null,
  why_it_fits text not null,
  fit_themes jsonb not null default '[]'::jsonb,
  confidence numeric not null default 0,
  status text not null default 'pending',
  source_signature text,
  reviewed_at timestamptz,
  reviewed_by uuid,
  created_at timestamptz not null default now()
);

alter table public.car_suggestions enable row level security;

create policy "Public can read approved suggestions"
  on public.car_suggestions for select
  to anon, authenticated
  using (status = 'approved');

create policy "Admins can read all suggestions"
  on public.car_suggestions for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update suggestions"
  on public.car_suggestions for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create index car_suggestions_status_idx on public.car_suggestions (status, created_at desc);