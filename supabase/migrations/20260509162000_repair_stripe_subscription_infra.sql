-- Stripe subscription infrastructure repair + hardening

-- 1) Ensure subscriptions table supports Stripe identifiers while remaining backward compatible.
alter table public.subscriptions
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists subscription_status text,
  add column if not exists billing_interval text;

alter table public.subscriptions
  alter column paddle_subscription_id drop not null,
  alter column paddle_customer_id drop not null;

update public.subscriptions
set subscription_status = status
where subscription_status is null;

create unique index if not exists uq_subscriptions_stripe_customer_id
  on public.subscriptions (stripe_customer_id)
  where stripe_customer_id is not null;

create unique index if not exists uq_subscriptions_stripe_subscription_id
  on public.subscriptions (stripe_subscription_id)
  where stripe_subscription_id is not null;

create index if not exists idx_subscriptions_user_env_status
  on public.subscriptions (user_id, environment, status);

alter table public.subscriptions
  drop constraint if exists subscriptions_billing_interval_check;

alter table public.subscriptions
  add constraint subscriptions_billing_interval_check
  check (
    billing_interval is null
    or billing_interval in ('day', 'week', 'month', 'year')
  );

-- 2) Durable, idempotent webhook persistence for Stripe events.
create table if not exists public.stripe_webhook_events (
  id bigserial primary key,
  event_id text not null unique,
  event_type text not null,
  livemode boolean not null default false,
  user_id uuid references auth.users(id) on delete set null,
  payload jsonb not null,
  processed boolean not null default false,
  processed_at timestamptz,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_stripe_webhook_events_created_at
  on public.stripe_webhook_events (created_at desc);

create index if not exists idx_stripe_webhook_events_processed
  on public.stripe_webhook_events (processed, created_at desc);

create index if not exists idx_stripe_webhook_events_user_id
  on public.stripe_webhook_events (user_id);

alter table public.stripe_webhook_events enable row level security;

drop policy if exists "Service role can manage stripe webhook events" on public.stripe_webhook_events;
create policy "Service role can manage stripe webhook events"
  on public.stripe_webhook_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Users can read own stripe webhook events" on public.stripe_webhook_events;
create policy "Users can read own stripe webhook events"
  on public.stripe_webhook_events
  for select
  to authenticated
  using (auth.uid() = user_id);

-- 3) Ensure subscriptions RLS remains correct for webhook writes and user reads.
drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription"
  on public.subscriptions
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Service role can manage subscriptions" on public.subscriptions;
create policy "Service role can manage subscriptions"
  on public.subscriptions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

-- 4) Entitlement resolution should reflect Stripe status semantics too.
create or replace function public.has_active_subscription(
  user_uuid uuid,
  check_env text default 'live'
)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.subscriptions
    where user_id = user_uuid
      and environment = check_env
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
