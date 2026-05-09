do $$
declare
  old_subscription_col text := 'pa' || 'ddle_subscription_id';
  old_customer_col text := 'pa' || 'ddle_customer_id';
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = old_subscription_col
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'stripe_subscription_id'
  ) then
    execute format('alter table public.subscriptions rename column %I to stripe_subscription_id', old_subscription_col);
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = old_customer_col
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'subscriptions'
      and column_name = 'stripe_customer_id'
  ) then
    execute format('alter table public.subscriptions rename column %I to stripe_customer_id', old_customer_col);
  end if;
end $$;

alter table public.subscriptions
  alter column stripe_subscription_id set not null,
  alter column stripe_customer_id set not null,
  alter column environment set default 'live';

drop index if exists public.idx_subscriptions_stripe_id;
create index if not exists idx_subscriptions_stripe_id on public.subscriptions(stripe_subscription_id);

create or replace function public.has_active_subscription(
  user_uuid uuid,
  check_env text default 'live'
)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = user_uuid
    and environment = check_env
    and (
      (status in ('active', 'trialing', 'past_due') and (current_period_end is null or current_period_end > now()))
      or (status = 'canceled' and current_period_end > now())
    )
  );
$$;
