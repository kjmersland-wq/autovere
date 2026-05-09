import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  getAppBaseUrl,
  getStripe,
  getStripePriceId,
  localizePath,
  sanitizeInternalPath,
  sanitizeLocale,
  toStripeLocale,
} from '../_shared/stripe.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('unauthenticated');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error('unauthenticated');

    const { interval, locale, returnPath } = await req.json();
    const chosenInterval = interval === 'year' ? 'year' : 'month';
    const selectedLocale = sanitizeLocale(locale);
    const priceId = getStripePriceId(chosenInterval);

    const stripe = getStripe();
    const appBaseUrl = getAppBaseUrl(req);
    const fallbackPricingPath = localizePath('/pricing', selectedLocale);
    const safeReturnPath = sanitizeInternalPath(returnPath, fallbackPricingPath);
    const localizedReturnPath = localizePath(safeReturnPath, selectedLocale);

    const { data: existing } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const customerId = existing?.stripe_customer_id
      ? String(existing.stripe_customer_id)
      : (
          await stripe.customers.create({
            email: user.email ?? undefined,
            metadata: { supabase_user_id: user.id },
          })
        ).id;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      locale: toStripeLocale(selectedLocale),
      metadata: {
        supabase_user_id: user.id,
        locale: selectedLocale,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          locale: selectedLocale,
        },
      },
      success_url: `${appBaseUrl}${localizedReturnPath}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appBaseUrl}${localizedReturnPath}?checkout=canceled`,
    });

    if (!session.url) throw new Error('session_creation_failed');

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('create-stripe-checkout failed', error);
    return new Response(JSON.stringify({ error: 'Unable to start checkout. Please try again.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
