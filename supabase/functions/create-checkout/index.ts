import { createClient } from 'npm:@supabase/supabase-js@2';
import { getStripeClient, getStripeEnvironment } from '../_shared/stripe.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    console.log('[create-checkout] step=start method=' + req.method);

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Not authenticated: missing Authorization header');
    console.log('[create-checkout] step=auth-header-present');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError) throw new Error(`Auth error: ${authError.message}`);
    if (!user) throw new Error('Not authenticated: getUser returned null');
    console.log('[create-checkout] step=user-authenticated userId=' + user.id);

    const body = await req.json();
    const { priceId, successUrl, cancelUrl } = body;
    console.log('[create-checkout] step=body-parsed priceId=' + priceId);

    const stripe = getStripeClient();
    const env = getStripeEnvironment();
    console.log('[create-checkout] step=stripe-init env=' + env);

    const envVarName = priceId === 'premium_monthly'
      ? 'STRIPE_PREMIUM_MONTHLY_PRICE_ID'
      : 'STRIPE_PREMIUM_YEARLY_PRICE_ID';
    const stripePriceId = Deno.env.get(envVarName);
    if (!stripePriceId) throw new Error(`Price not configured: ${envVarName} is unset`);
    console.log('[create-checkout] step=price-resolved stripePriceId=' + stripePriceId);

    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .eq('environment', env)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let stripeCustomerId: string;
    if (existingSub?.stripe_customer_id) {
      stripeCustomerId = existingSub.stripe_customer_id;
      console.log('[create-checkout] step=existing-customer id=' + stripeCustomerId);
    } else {
      console.log('[create-checkout] step=creating-customer email=' + user.email);
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;
      console.log('[create-checkout] step=customer-created id=' + stripeCustomerId);
    }

    console.log('[create-checkout] step=creating-session');
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [{ price: stripePriceId, quantity: 1 }],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: { userId: user.id, environment: env },
      },
      metadata: { userId: user.id, environment: env },
    });

    console.log('[create-checkout] step=done sessionId=' + session.id);
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[create-checkout] FAILED:', String(e));
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
