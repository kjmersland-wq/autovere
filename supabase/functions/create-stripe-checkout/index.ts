import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  getBaseUrl,
  getStripe,
  getStripeModeFromPublishable,
  getStripeModeFromSecret,
  localizePath,
  parseLocaleFromPathname,
  resolveLocale,
  resolvePriceConfig,
} from '../_shared/stripe.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type CheckoutRequest = {
  priceId?: string;
  locale?: string;
  successPath?: string;
  cancelPath?: string;
  publishableKey?: string;
};

class ApiError extends Error {
  status: number;
  code: string;
  details?: Record<string, unknown>;

  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
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

    if (userError || !user) {
      throw new ApiError(401, 'auth_required', 'User must be signed in before checkout');
    }

    const body = (await req.json()) as CheckoutRequest;
    const referer = req.headers.get('referer') || '';
    const refererLocale = (() => {
      try {
        return parseLocaleFromPathname(new URL(referer).pathname);
      } catch {
        return 'en';
      }
    })();

    const locale = resolveLocale(body.locale || refererLocale);
    const requestedPriceId = body.priceId;
    if (!requestedPriceId) throw new ApiError(400, 'invalid_payload', 'priceId is required');

    const { logicalPriceId, stripePriceId } = resolvePriceConfig(requestedPriceId);
    const stripe = getStripe();
    const secretMode = getStripeModeFromSecret();
    const publishableMode = getStripeModeFromPublishable(body.publishableKey || null);
    if (publishableMode && publishableMode !== secretMode) {
      throw new ApiError(400, 'stripe_mode_mismatch', 'Publishable and secret Stripe keys are from different modes', {
        publishableMode,
        secretMode,
      });
    }

    const price = await stripe.prices.retrieve(stripePriceId, { expand: ['product'] });
    if (!price || !price.active || !price.recurring) {
      throw new ApiError(400, 'invalid_price', 'Stripe price is not an active recurring price', {
        stripePriceId,
        active: price?.active,
        recurring: !!price?.recurring,
      });
    }
    if (price.currency.toLowerCase() !== 'eur') {
      throw new ApiError(400, 'invalid_currency', 'Stripe price currency must be EUR', {
        stripePriceId,
        currency: price.currency,
      });
    }

    const baseUrl = getBaseUrl(req);
    const successPath = localizePath(body.successPath || '/success', locale);
    const cancelPath = localizePath(body.cancelPath || '/pricing', locale);
    const successUrl = new URL(successPath, baseUrl).toString();
    const cancelUrl = new URL(`${cancelPath}?checkout=cancelled`, baseUrl).toString();

    console.info('[create-stripe-checkout] incoming', {
      userId: user.id,
      email: user.email,
      locale,
      priceId: logicalPriceId,
      stripePriceId,
      successUrl,
      cancelUrl,
      mode: secretMode,
      interval: price.recurring.interval,
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: stripePriceId, quantity: 1 }],
      customer_email: user.email ?? undefined,
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        locale,
        logical_price_id: logicalPriceId,
      },
      subscription_data: {
        metadata: {
          user_id: user.id,
          locale,
          logical_price_id: logicalPriceId,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      locale: locale === 'no' ? 'nb' : (locale as any),
    });

    console.info('[create-stripe-checkout] session_created', {
      userId: user.id,
      sessionId: session.id,
      urlExists: !!session.url,
      customer: session.customer,
      subscription: session.subscription,
    });

    if (!session.url) {
      throw new ApiError(500, 'checkout_url_missing', 'Stripe did not return a checkout URL', { sessionId: session.id });
    }

    return json({
      sessionId: session.id,
      url: session.url,
      locale,
      mode: secretMode,
      logicalPriceId,
      stripePriceId,
      billingInterval: price.recurring.interval,
      currency: price.currency,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      console.error('[create-stripe-checkout] api_error', {
        code: err.code,
        message: err.message,
        details: err.details,
      });
      return json({ error: { code: err.code, message: err.message, details: err.details ?? null } }, err.status);
    }

    if (err instanceof Error) {
      console.error('[create-stripe-checkout] unexpected_error', { message: err.message, stack: err.stack });
      return json(
        {
          error: {
            code: 'checkout_session_failed',
            message: err.message || 'Failed to create Stripe checkout session',
          },
        },
        500,
      );
    }

    console.error('[create-stripe-checkout] unknown_error', err);
    return json({ error: { code: 'checkout_session_failed', message: 'Failed to create Stripe checkout session' } }, 500);
  }
});
