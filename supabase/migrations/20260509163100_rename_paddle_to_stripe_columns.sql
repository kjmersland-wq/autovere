-- Rename legacy Paddle column names to provider-agnostic Stripe equivalents.
-- This is a non-destructive rename; existing rows are preserved.

alter table public.subscriptions
  rename column paddle_subscription_id to stripe_subscription_id;

alter table public.subscriptions
  rename column paddle_customer_id to stripe_customer_id;

alter index idx_subscriptions_paddle_id
  rename to idx_subscriptions_stripe_id;
