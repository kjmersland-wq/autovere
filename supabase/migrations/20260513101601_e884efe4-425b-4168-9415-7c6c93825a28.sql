ALTER TABLE public.subscriptions RENAME COLUMN paddle_subscription_id TO stripe_subscription_id;
ALTER TABLE public.subscriptions RENAME COLUMN paddle_customer_id TO stripe_customer_id;
ALTER TABLE public.subscriptions RENAME CONSTRAINT subscriptions_paddle_subscription_id_key TO subscriptions_stripe_subscription_id_key;
ALTER TABLE public.subscriptions ALTER COLUMN environment SET DEFAULT 'test';