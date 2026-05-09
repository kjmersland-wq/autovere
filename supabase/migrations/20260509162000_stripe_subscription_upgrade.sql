-- Stripe production migration while preserving existing subscriptions table.

alter table public.subscriptions
  alter column paddle_subscription_id drop not null,
  alter column paddle_customer_id drop not null,
  alter column product_id drop not null,
  alter column price_id drop not null;

alter table public.subscriptions
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text,
  add column if not exists billing_interval text;

do $$ begin
  alter table public.subscriptions
    add constraint subscriptions_stripe_subscription_id_key unique (stripe_subscription_id);
exception
  when duplicate_object then null;
end $$;

create index if not exists idx_subscriptions_stripe_id on public.subscriptions(stripe_subscription_id);
create index if not exists idx_subscriptions_environment_status on public.subscriptions(environment, status);

create table if not exists public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  payload jsonb,
  received_at timestamptz not null default now()
);

alter table public.stripe_webhook_events enable row level security;

do $$ begin
  create policy "Service role can manage stripe webhook events"
    on public.stripe_webhook_events
    for all
    using (auth.role() = 'service_role')
    with check (auth.role() = 'service_role');
exception
  when duplicate_object then null;
end $$;

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
      (
        status in ('active', 'trialing', 'past_due')
        and (current_period_end is null or current_period_end > now())
      )
      or (status = 'canceled' and current_period_end > now())
    )
  );
$$;
