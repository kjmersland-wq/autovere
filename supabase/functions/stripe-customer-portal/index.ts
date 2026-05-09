import { createClient } from 'npm:@supabase/supabase-js@2';
import { getSiteUrl, getStripeClient } from '../_shared/stripe.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PortalRequest = {
  returnPath?: string;
};

type SubscriptionPortalRow = {
  stripe_customer_id: string | null;
};

const getServiceClient = (authHeader?: string) =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    authHeader ? { global: { headers: { Authorization: authHeader } } } : undefined,
  );

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers: corsHeaders });

  const requestId = crypto.randomUUID();

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Not authenticated');

    const authClient = getServiceClient(authHeader);
    const serviceClient = getServiceClient();
    const stripe = getStripeClient();

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();
    if (userError || !user) throw new Error('Not authenticated');

    const payload = (await req.json().catch(() => ({}))) as PortalRequest;

    const { data: sub, error: subError } = await serviceClient
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle<SubscriptionPortalRow>();
    if (subError) throw subError;
    if (!sub?.stripe_customer_id) throw new Error('No Stripe customer found');

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: `${getSiteUrl()}${payload.returnPath ?? '/pricing'}`,
    });

    console.info('[stripe-customer-portal] created', {
      requestId,
      userId: user.id,
      stripeCustomerId: sub.stripe_customer_id,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('[stripe-customer-portal] failed', {
      requestId,
      error: String(error),
    });
    return new Response(JSON.stringify({ error: 'Customer portal session creation failed', requestId }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
