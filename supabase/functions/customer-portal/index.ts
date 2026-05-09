import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  getAppBaseUrl,
  getStripe,
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

    const { locale, returnPath } = await req.json();
    const selectedLocale = sanitizeLocale(locale);

    const { data: sub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .not('stripe_customer_id', 'is', null)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub?.stripe_customer_id) {
      return new Response(JSON.stringify({ error: 'No active billing profile found.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const stripe = getStripe();
    const appBaseUrl = getAppBaseUrl(req);
    const fallbackPricingPath = localizePath('/pricing', selectedLocale);
    const safeReturnPath = sanitizeInternalPath(returnPath, fallbackPricingPath);
    const localizedReturnPath = localizePath(safeReturnPath, selectedLocale);

    const session = await stripe.billingPortal.sessions.create({
      customer: String(sub.stripe_customer_id),
      locale: toStripeLocale(selectedLocale),
      return_url: `${appBaseUrl}${localizedReturnPath}?portal=returned`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('customer-portal failed', error);
    return new Response(JSON.stringify({ error: 'Unable to open billing portal. Please try again.' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
