import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  getBaseUrl,
  getStripe,
  getStripeModeFromPublishable,
  getStripeModeFromSecret,
  localizePath,
  parseLocaleFromPathname,
  resolveLocale,
  type StripeMode,
} from '../_shared/stripe.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type PortalRequest = {
  locale?: string;
  publishableKey?: string;
  environment?: StripeMode;
};

class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: { code: 'method_not_allowed', message: 'Method not allowed' } }, 405);

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new ApiError(401, 'auth_required', 'Authorization is required');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) throw new ApiError(401, 'auth_required', 'User must be signed in');

    const body = (await req.json().catch(() => ({}))) as PortalRequest;
    const referer = req.headers.get('referer') || '';
    const refererLocale = (() => {
      try {
        return parseLocaleFromPathname(new URL(referer).pathname);
      } catch {
        return 'en';
      }
    })();

    const locale = resolveLocale(body.locale || refererLocale);
    const secretMode = getStripeModeFromSecret();
    const publishableMode = getStripeModeFromPublishable(body.publishableKey || null);
    if (publishableMode && publishableMode !== secretMode) {
      throw new ApiError(400, 'stripe_mode_mismatch', 'Publishable and secret Stripe keys are from different modes');
    }

    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id, stripe_subscription_id, environment')
      .eq('user_id', user.id)
      .eq('environment', secretMode)
      .not('stripe_customer_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (subError) throw new ApiError(500, 'subscription_lookup_failed', subError.message);
    if (!sub?.stripe_customer_id) throw new ApiError(404, 'subscription_not_found', 'No active Stripe customer found');

    const baseUrl = getBaseUrl(req);
    const returnUrl = new URL(`${localizePath('/pricing', locale)}?portal=return`, baseUrl).toString();

    console.info('[customer-portal] incoming', {
      userId: user.id,
      locale,
      mode: secretMode,
      stripeCustomerId: sub.stripe_customer_id,
      stripeSubscriptionId: sub.stripe_subscription_id,
      returnUrl,
    });

    const stripe = getStripe();
    const portal = await stripe.billingPortal.sessions.create({
      customer: sub.stripe_customer_id,
      return_url: returnUrl,
      locale: locale === 'no' ? 'nb' : (locale as any),
    });

    console.info('[customer-portal] created', {
      userId: user.id,
      stripeCustomerId: sub.stripe_customer_id,
      portalUrlExists: !!portal.url,
    });

    return json({ url: portal.url, mode: secretMode, locale });
  } catch (err) {
    if (err instanceof ApiError) {
      console.error('[customer-portal] api_error', { code: err.code, message: err.message });
      return json({ error: { code: err.code, message: err.message } }, err.status);
    }
    if (err instanceof Error) {
      console.error('[customer-portal] unexpected_error', { message: err.message, stack: err.stack });
      return json({ error: { code: 'portal_failed', message: err.message || 'Failed to create customer portal session' } }, 500);
    }
    console.error('[customer-portal] unknown_error', err);
    return json({ error: { code: 'portal_failed', message: 'Failed to create customer portal session' } }, 500);
  }
});
