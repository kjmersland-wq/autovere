import { createClient } from 'npm:@supabase/supabase-js@2';
import { getStripeMode, getStripeSiteUrl, stripeApiJson } from '../_shared/stripe.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PortalSessionResponse = { url: string };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Not authenticated');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { returnPath } = await req.json().catch(() => ({ returnPath: '/pricing' }));
    const normalizedReturnPath = typeof returnPath === 'string' && returnPath.startsWith('/') ? returnPath : '/pricing';

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .eq('environment', getStripeMode())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!subscription?.stripe_customer_id) throw new Error('No Stripe customer found');

    console.info('[payments] create portal session', {
      provider: 'stripe',
      endpoint: 'customer-portal',
      mode: getStripeMode(),
      returnPath: normalizedReturnPath,
      userId: user.id,
    });

    const form = new URLSearchParams();
    form.set('customer', subscription.stripe_customer_id);
    form.set('return_url', `${getStripeSiteUrl()}${normalizedReturnPath}`);

    const session = await stripeApiJson<PortalSessionResponse>('/billing_portal/sessions', {
      method: 'POST',
      body: form,
    });

    console.info('[payments] portal redirect ready', {
      provider: 'stripe',
      endpoint: 'customer-portal',
      redirectUrl: session.url,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[payments] create portal failed', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
