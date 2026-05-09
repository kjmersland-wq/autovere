import { createClient } from 'npm:@supabase/supabase-js@2';
import { getStripeMode, getStripePriceId, getStripeSiteUrl, stripeApiJson } from '../_shared/stripe.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CheckoutSessionResponse = { url: string | null };

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

    const { priceId, successPath, cancelPath } = await req.json();
    const stripePriceId = getStripePriceId(priceId);
    const siteUrl = getStripeSiteUrl();
    const normalizedSuccessPath = typeof successPath === 'string' && successPath.startsWith('/') ? successPath : '/pricing?checkout=success';
    const normalizedCancelPath = typeof cancelPath === 'string' && cancelPath.startsWith('/') ? cancelPath : '/pricing';

    console.info('[payments] create checkout session', {
      provider: 'stripe',
      endpoint: 'create-stripe-checkout',
      mode: getStripeMode(),
      priceId,
      stripePriceId,
      successPath: normalizedSuccessPath,
      cancelPath: normalizedCancelPath,
      userId: user.id,
    });

    const form = new URLSearchParams();
    form.set('mode', 'subscription');
    form.set('line_items[0][price]', stripePriceId);
    form.set('line_items[0][quantity]', '1');
    form.set('success_url', `${siteUrl}${normalizedSuccessPath}`);
    form.set('cancel_url', `${siteUrl}${normalizedCancelPath}`);
    form.set('client_reference_id', user.id);
    if (user.email) form.set('customer_email', user.email);
    form.set('allow_promotion_codes', 'true');
    form.set('subscription_data[metadata][user_id]', user.id);
    form.set('subscription_data[metadata][price_id]', priceId);

    const session = await stripeApiJson<CheckoutSessionResponse>('/checkout/sessions', {
      method: 'POST',
      body: form,
    });

    console.info('[payments] checkout redirect ready', {
      provider: 'stripe',
      endpoint: 'create-stripe-checkout',
      redirectUrl: session.url,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[payments] create checkout failed', error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
