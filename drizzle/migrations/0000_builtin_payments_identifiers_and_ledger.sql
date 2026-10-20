ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS payment_subscription_id text;
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS payment_customer_id text;
UPDATE public.subscriptions SET payment_subscription_id = creem_subscription_id, payment_customer_id = creem_customer_id WHERE payment_subscription_id IS NULL AND creem_subscription_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_payment_subscription_env_idx ON public.subscriptions(payment_subscription_id, environment);
COMMENT ON COLUMN public.subscriptions.creem_subscription_id IS 'DEPRECATED: replaced by payment_subscription_id; retained for deployed-version compatibility and historical records';
COMMENT ON COLUMN public.subscriptions.creem_customer_id IS 'DEPRECATED: replaced by payment_customer_id; retained for deployed-version compatibility and historical records';
ALTER TABLE public.subscriptions ALTER COLUMN provider SET DEFAULT 'stripe';
CREATE TABLE public.payment_transactions (
 id text NOT NULL,
 environment text NOT NULL,
 user_id uuid,
 subscription_id text,
 customer_id text,
 customer_email text,
 price_id text,
 amount numeric NOT NULL DEFAULT 0,
 currency text NOT NULL DEFAULT 'EUR',
 status text NOT NULL,
 billed_at timestamptz NOT NULL,
 PRIMARY KEY (id, environment)
);
GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read payment transactions" ON public.payment_transactions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Users read own payment transactions" ON public.payment_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE TABLE public.payment_webhook_events (
 id text NOT NULL,
 environment text NOT NULL,
 event_created bigint NOT NULL,
 completed_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(id, environment)
);
GRANT ALL ON public.payment_webhook_events TO service_role;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;