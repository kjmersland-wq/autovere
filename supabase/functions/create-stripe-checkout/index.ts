import { createClient } from 'npm:@supabase/supabase-js@2';
import { getSiteUrl, getStripeClient, resolveStripePriceId } from '../_shared/stripe.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CheckoutRequest = {
  priceId: string;
  successPath?: string;
  cancelPath?: string;
  locale?: string;
};

type SubscriptionRow = {
  stripe_customer_id: string | null;
};

const getAuthClient = (authHeader: string) =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );

const getServiceClient = () =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  const requestId = crypto.randomUUID();

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Not authenticated');

    const authClient = getAuthClient(authHeader);
    const serviceClient = getServiceClient();
    const stripe = getStripeClient();

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');

    const payload = (await req.json()) as CheckoutRequest;
    if (!payload.priceId) throw new Error('priceId is required');

    const { data: existingSub, error: existingSubError } = await serviceClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle<SubscriptionRow>();
    if (existingSubError) throw existingSubError;

    let stripeCustomerId = existingSub?.stripe_customer_id ?? null;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      stripeCustomerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId ?? undefined,
      customer_email: stripeCustomerId ? undefined : user.email ?? undefined,
      client_reference_id: user.id,
      locale: payload.locale ?? 'auto',
      line_items: [{ price: resolveStripePriceId(payload.priceId), quantity: 1 }],
      allow_promotion_codes: true,
      metadata: {
        user_id: user.id,
        requested_plan: payload.priceId,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          requested_plan: payload.priceId,
        },
      },
      success_url: `${getSiteUrl()}${payload.successPath ?? '/success'}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getSiteUrl()}${payload.cancelPath ?? '/pricing'}?checkout=canceled`,
    });

    console.info('[create-stripe-checkout] created', {
      requestId,
      userId: user.id,
      stripeCustomerId,
      sessionId: session.id,
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('[create-stripe-checkout] failed', {
      requestId,
      error: String(error),
    });
    return new Response(JSON.stringify({ error: String(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
