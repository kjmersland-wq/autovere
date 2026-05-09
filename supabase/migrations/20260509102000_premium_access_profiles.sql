create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_premium boolean not null default false,
  subscription_status text,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  plan_type text not null default 'free',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Service role can manage profiles"
  on public.profiles
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

alter table public.subscriptions
  add column if not exists plan_type text;

create or replace function public.subscription_is_premium(
  status_text text,
  period_end timestamptz
)
returns boolean
language sql
stable
as $$
  select (
    (coalesce(status_text, '') in ('active', 'trialing', 'past_due') and (period_end is null or period_end > now()))
    or (coalesce(status_text, '') = 'canceled' and period_end is not null and period_end > now())
  );
$$;

create or replace function public.sync_profile_from_subscription()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  computed_status text;
  computed_plan text;
  premium_active boolean;
begin
  computed_status := coalesce(new.subscription_status, new.status);
  premium_active := public.subscription_is_premium(computed_status, new.current_period_end);
  computed_plan := case
    when premium_active and coalesce(new.billing_interval, '') = 'month' then 'premium_monthly'
    when premium_active and coalesce(new.billing_interval, '') = 'year' then 'premium_yearly'
    when premium_active then 'premium'
    else 'free'
  end;

  update public.subscriptions
  set plan_type = computed_plan
  where id = new.id
    and coalesce(plan_type, '') is distinct from computed_plan;

  insert into public.profiles (
    id,
    is_premium,
    subscription_status,
    stripe_customer_id,
    stripe_subscription_id,
    current_period_end,
    plan_type,
    updated_at
  )
  values (
    new.user_id,
    premium_active,
    computed_status,
    new.stripe_customer_id,
    new.stripe_subscription_id,
    new.current_period_end,
    computed_plan,
    now()
  )
  on conflict (id) do update
  set
    is_premium = excluded.is_premium,
    subscription_status = excluded.subscription_status,
    stripe_customer_id = excluded.stripe_customer_id,
    stripe_subscription_id = excluded.stripe_subscription_id,
    current_period_end = excluded.current_period_end,
    plan_type = excluded.plan_type,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists trg_sync_profile_from_subscription on public.subscriptions;
create trigger trg_sync_profile_from_subscription
after insert or update of subscription_status, status, stripe_customer_id, stripe_subscription_id, current_period_end, billing_interval
on public.subscriptions
for each row
execute function public.sync_profile_from_subscription();

insert into public.profiles (id)
select u.id
from auth.users u
on conflict (id) do nothing;

with latest_subscription as (
  select distinct on (s.user_id)
    s.user_id,
    s.stripe_customer_id,
    s.stripe_subscription_id,
    coalesce(s.subscription_status, s.status) as subscription_status,
    s.current_period_end,
    s.billing_interval
  from public.subscriptions s
  order by s.user_id, s.updated_at desc nulls last, s.created_at desc nulls last
)
update public.profiles p
set
  stripe_customer_id = ls.stripe_customer_id,
  stripe_subscription_id = ls.stripe_subscription_id,
  subscription_status = ls.subscription_status,
  current_period_end = ls.current_period_end,
  is_premium = public.subscription_is_premium(ls.subscription_status, ls.current_period_end),
  plan_type = case
    when public.subscription_is_premium(ls.subscription_status, ls.current_period_end) and coalesce(ls.billing_interval, '') = 'month' then 'premium_monthly'
    when public.subscription_is_premium(ls.subscription_status, ls.current_period_end) and coalesce(ls.billing_interval, '') = 'year' then 'premium_yearly'
    when public.subscription_is_premium(ls.subscription_status, ls.current_period_end) then 'premium'
    else 'free'
  end,
  updated_at = now()
from latest_subscription ls
where p.id = ls.user_id;
