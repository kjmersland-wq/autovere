-- Update subscriptions table to use Stripe instead of Paddle
alter table public.subscriptions drop constraint if exists subscriptions_paddle_subscription_id_key;
alter table public.subscriptions drop index if exists idx_subscriptions_paddle_id;

-- Rename Paddle columns to Stripe
alter table public.subscriptions rename column paddle_subscription_id to stripe_subscription_id;
alter table public.subscriptions rename column paddle_customer_id to stripe_customer_id;

-- Add unique constraint and index for Stripe
alter table public.subscriptions add constraint subscriptions_stripe_subscription_id_key unique (stripe_subscription_id);
create index idx_subscriptions_stripe_id on public.subscriptions(stripe_subscription_id);

-- Update the has_active_subscription function (already uses generic columns so no change needed)
-- It queries on user_id, environment, status, and current_period_end which are all still valid
