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

type StripeMode = 'test' | 'live';

type CheckoutRequest = {
  interval?: 'month' | 'year';
  locale?: string;
  returnPath?: string;
  expectedMode?: StripeMode;
};

type ApiErrorCode =
  | 'unauthenticated'
  | 'invalid_request'
  | 'stripe_not_configured'
  | 'stripe_env_mismatch'
  | 'stripe_price_missing'
  | 'stripe_price_inactive'
  | 'stripe_request_failed'
  | 'checkout_session_failed'
  | 'unexpected_error';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const getSecretMode = (): StripeMode => {
  const key = Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) throw new Error('STRIPE_SECRET_KEY is not configured');
  return key.startsWith('sk_test_') ? 'test' : 'live';
};

const fail = (
  requestId: string,
  status: number,
  code: ApiErrorCode,
  message: string,
  details?: string
) => json(status, { error: { code, message, details, requestId } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const requestId = crypto.randomUUID();

  try {
    if (req.method !== 'POST') {
      return fail(requestId, 405, 'invalid_request', 'Method not allowed.');
    }

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return fail(requestId, 401, 'unauthenticated', 'Authentication is required.');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return fail(requestId, 401, 'unauthenticated', 'Authentication is required.');
    }

    let body: CheckoutRequest;
    try {
      body = (await req.json()) as CheckoutRequest;
    } catch {
      return fail(requestId, 400, 'invalid_request', 'Request body must be valid JSON.');
    }

    const { interval, locale, returnPath, expectedMode } = body;
    const chosenInterval = interval === 'year' ? 'year' : 'month';
    const selectedLocale = sanitizeLocale(locale);
    if (interval && interval !== 'month' && interval !== 'year') {
      return fail(requestId, 400, 'invalid_request', 'Invalid billing interval.');
    }

    let secretMode: StripeMode;
    try {
      secretMode = getSecretMode();
    } catch (error) {
      console.error('create-stripe-checkout env error', { requestId, error });
      return fail(requestId, 500, 'stripe_not_configured', 'Billing configuration is incomplete.');
    }

    if (expectedMode && expectedMode !== secretMode) {
      console.error('create-stripe-checkout mode mismatch', {
        requestId,
        expectedMode,
        secretMode,
      });
      return fail(
        requestId,
        500,
        'stripe_env_mismatch',
        'Stripe test/live mode mismatch between client and server.',
        `client=${expectedMode}, server=${secretMode}`
      );
    }

    let priceId: string;
    try {
      priceId = getStripePriceId(chosenInterval);
    } catch (error) {
      console.error('create-stripe-checkout missing price env', {
        requestId,
        interval: chosenInterval,
        error,
      });
      return fail(requestId, 500, 'stripe_not_configured', 'Stripe price IDs are not configured.');
    }

    let stripe: ReturnType<typeof getStripe>;
    try {
      stripe = getStripe();
    } catch (error) {
      console.error('create-stripe-checkout stripe init failed', { requestId, error });
      return fail(requestId, 500, 'stripe_not_configured', 'Stripe is not configured correctly.');
    }

    let appBaseUrl: string;
    try {
      appBaseUrl = getAppBaseUrl(req);
    } catch (error) {
      console.error('create-stripe-checkout base url error', { requestId, error });
      return fail(requestId, 500, 'stripe_not_configured', 'Application base URL is not configured.');
    }

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

    try {
      const price = await stripe.prices.retrieve(priceId);
      if (!price || price.deleted) {
        return fail(
          requestId,
          400,
          'stripe_price_missing',
          'Configured Stripe price does not exist.',
          `priceId=${priceId}`
        );
      }
      if (!price.active) {
        return fail(
          requestId,
          400,
          'stripe_price_inactive',
          'Configured Stripe price is inactive.',
          `priceId=${priceId}`
        );
      }
    } catch (error) {
      const stripeError = error as { code?: string; message?: string; requestId?: string };
      if (stripeError?.code === 'resource_missing') {
        console.error('create-stripe-checkout missing stripe price', {
          requestId,
          priceId,
          stripeRequestId: stripeError.requestId,
          stripeError: stripeError.message,
        });
        return fail(
          requestId,
          400,
          'stripe_price_missing',
          'Configured Stripe price does not exist.',
          `priceId=${priceId}`
        );
      }
      console.error('create-stripe-checkout price validation failed', {
        requestId,
        priceId,
        stripeRequestId: stripeError?.requestId,
        stripeError: stripeError?.message,
      });
      return fail(requestId, 502, 'stripe_request_failed', 'Could not validate Stripe price configuration.');
    }

    let session: Awaited<ReturnType<typeof stripe.checkout.sessions.create>>;
    try {
      session = await stripe.checkout.sessions.create({
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
    } catch (error) {
      const stripeError = error as { message?: string; requestId?: string; code?: string };
      console.error('create-stripe-checkout session creation failed', {
        requestId,
        userId: user.id,
        interval: chosenInterval,
        locale: selectedLocale,
        priceId,
        stripeRequestId: stripeError?.requestId,
        stripeCode: stripeError?.code,
        stripeError: stripeError?.message,
      });
      return fail(requestId, 502, 'checkout_session_failed', 'Unable to create Stripe Checkout session.');
    }

    if (!session.url) {
      console.error('create-stripe-checkout session has no url', {
        requestId,
        userId: user.id,
        interval: chosenInterval,
        priceId,
      });
      return fail(requestId, 502, 'checkout_session_failed', 'Checkout session was created without a redirect URL.');
    }

    console.info('create-stripe-checkout success', {
      requestId,
      userId: user.id,
      interval: chosenInterval,
      locale: selectedLocale,
      returnPath: localizedReturnPath,
      priceId,
      mode: secretMode,
    });

    return json(200, { url: session.url, requestId });
  } catch (error) {
    console.error('create-stripe-checkout unexpected failure', { requestId, error });
    return fail(requestId, 500, 'unexpected_error', 'Unable to start checkout. Please try again.');
  }
});
