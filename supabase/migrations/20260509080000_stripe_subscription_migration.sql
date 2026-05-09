alter table public.subscriptions
  alter column paddle_subscription_id drop not null,
  alter column paddle_customer_id drop not null;

alter table public.subscriptions
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists billing_interval text,
  add column if not exists last_payment_error text;

create unique index if not exists idx_subscriptions_stripe_subscription_id
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create index if not exists idx_subscriptions_stripe_customer_id
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

create table if not exists public.stripe_webhook_events (
  id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;

create policy "Service role can manage stripe webhook events"
  on public.stripe_webhook_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

update public.subscriptions
set
  subscription_status = coalesce(subscription_status, status),
  stripe_subscription_id = coalesce(stripe_subscription_id, nullif(paddle_subscription_id, '')),
  stripe_customer_id = coalesce(stripe_customer_id, nullif(paddle_customer_id, ''))
where
  subscription_status is null
  or stripe_subscription_id is null
  or stripe_customer_id is null;

create or replace function public.has_active_subscription(
  user_uuid uuid,
  check_env text default null
)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1
    from public.subscriptions
    where user_id = user_uuid
      and (check_env is null or environment = check_env)
      and (
        (
          coalesce(subscription_status, status) in ('active', 'trialing', 'past_due')
          and (current_period_end is null or current_period_end > now())
        )
        or (
          coalesce(subscription_status, status) = 'canceled'
          and current_period_end > now()
        )
      )
  );
$$;
