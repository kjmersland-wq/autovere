-- Paddle migration: add Paddle columns to subscriptions.
-- Stripe columns are kept untouched as legacy so existing subscribers keep access.

alter table public.subscriptions
  add column if not exists provider text not null default 'stripe';

alter table public.subscriptions
  add column if not exists paddle_customer_id text;

alter table public.subscriptions
  add column if not exists paddle_subscription_id text;

create unique index if not exists subscriptions_paddle_subscription_id_key
  on public.subscriptions (paddle_subscription_id)
  where paddle_subscription_id is not null;

comment on column public.subscriptions.stripe_subscription_id is
  'LEGACY: Stripe subscription/session id. Kept for historical access; new purchases use paddle_subscription_id.';
comment on column public.subscriptions.stripe_customer_id is
  'LEGACY: Stripe customer id. Kept for historical access; new purchases use paddle_customer_id.';