DROP INDEX IF EXISTS public.subscriptions_paddle_subscription_id_key;
ALTER TABLE public.subscriptions ADD CONSTRAINT subscriptions_paddle_subscription_id_key UNIQUE (paddle_subscription_id);
ALTER TABLE public.subscriptions ALTER COLUMN stripe_subscription_id DROP NOT NULL;
ALTER TABLE public.subscriptions ALTER COLUMN stripe_customer_id DROP NOT NULL;
UPDATE public.subscriptions SET stripe_subscription_id = NULL WHERE stripe_subscription_id = '';
INSERT INTO public.subscriptions (user_id, provider, paddle_subscription_id, paddle_customer_id, product_id, price_id, status, current_period_start, current_period_end, cancel_at_period_end, environment) VALUES ('669d2362-7cb7-4fe3-92ec-949b7a5a4066','paddle','txn_01m4n6b066d7bbp3jcp7ykt5t8','ctm_01m4n6b04b6n14pd3q8jsycpw5','trip_pass','trip_pass','active','2026-10-11T09:58:15Z','2026-10-25T09:58:15Z',true,'sandbox') ON CONFLICT (paddle_subscription_id) DO NOTHING;