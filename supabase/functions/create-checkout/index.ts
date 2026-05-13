import { createClient } from 'npm:@supabase/supabase-js@2';
import { getStripeClient, getStripeEnvironment } from '../_shared/stripe.ts';
import { corsHeaders, handleCors } from '../_shared/cors.ts';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    if (error.message.startsWith('Not authenticated')) return 'Not authenticated';
    if (error.message.startsWith('Auth error:')) return 'Authentication failed';
    if (error.message === 'Invalid priceId') return 'Invalid priceId';
    if (error.message === 'Missing checkout redirect URLs') return 'Missing checkout redirect URLs';
    if (error.message === 'Invalid checkout redirect URLs') return 'Invalid checkout redirect URLs';
    if (error.message.startsWith('Price not configured:')) return 'Checkout price is not configured';
  }
  return 'Checkout request failed';
};

Deno.serve(async (req) => {
  const preflight = handleCors(req);
  if (preflight) return preflight;
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
    if (priceId !== 'premium_monthly' && priceId !== 'premium_yearly') {
      throw new Error('Invalid priceId');
    }

    if (!successUrl || !cancelUrl) {
      throw new Error('Missing checkout redirect URLs');
    }
    let resolvedSuccessUrl: string;
    let resolvedCancelUrl: string;
    try {
      resolvedSuccessUrl = new URL(successUrl).toString();
      resolvedCancelUrl = new URL(cancelUrl).toString();
    } catch {
      throw new Error('Invalid checkout redirect URLs');
    }

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
      success_url: resolvedSuccessUrl,
      cancel_url: resolvedCancelUrl,
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
    const message = getErrorMessage(e);
    console.error('[create-checkout] FAILED:', e);
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
