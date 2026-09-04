-- One-time, single-email grant: gives erik_mersland@hotmail.com the same
-- Admin role as the owner, plus a complimentary AutoVere Pro "subscription"
-- that is not a real Stripe subscription and never causes a Stripe charge.
--
-- This does not open any general Admin registration path — it is the only
-- place in the codebase that grants the 'admin' role, and it is scoped to
-- this one email address. It relies on the account already existing in
-- auth.users; if it does not exist yet, both inserts safely match zero rows
-- and do nothing (this migration can be re-applied manually later if the
-- account is created after this runs).

insert into public.user_roles (user_id, role)
select id, 'admin'
from auth.users
where email = 'erik_mersland@hotmail.com'
on conflict (user_id, role) do nothing;

-- Synthetic subscription row: price_id = 'pro_monthly' grants the same Pro
-- tier used by real paying customers (see src/lib/stripe.ts tierForPriceId),
-- environment = 'live' matches production so the normal Pro-access read
-- path (src/hooks/useSubscription.ts) picks it up with no code changes.
-- current_period_end = null means it never expires. The 'admin_comp_'
-- prefix can never collide with a real Stripe id (those always start with
-- 'sub_'/'cus_'), which lets Admin's own financial reporting explicitly
-- exclude this row from MRR/ARR/ARPU/subscriber-count figures.
insert into public.subscriptions (
  user_id,
  stripe_subscription_id,
  stripe_customer_id,
  product_id,
  price_id,
  status,
  current_period_end,
  cancel_at_period_end,
  environment
)
select
  id,
  'admin_comp_' || id::text,
  'admin_comp_' || id::text,
  'admin_comp_pro',
  'pro_monthly',
  'active',
  null,
  false,
  'live'
from auth.users
where email = 'erik_mersland@hotmail.com'
on conflict (stripe_subscription_id) do nothing;
