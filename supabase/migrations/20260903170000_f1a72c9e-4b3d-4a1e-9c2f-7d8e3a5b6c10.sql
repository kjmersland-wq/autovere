-- Persistent, single-row credential store for the confidential
-- /partners/in-car executive-preview login gate. Completely separate
-- from auth.users / user_roles — this is not part of the public
-- Supabase user-auth system. No RLS policies are defined, so only the
-- service-role key (trusted server functions) can ever read or write it.
create table public.in_car_admin_credentials (
  id smallint primary key default 1,
  email text not null,
  password_hash text not null,
  session_secret text not null,
  updated_at timestamptz not null default now(),
  constraint in_car_admin_credentials_singleton check (id = 1)
);

alter table public.in_car_admin_credentials enable row level security;

grant all on public.in_car_admin_credentials to service_role;
