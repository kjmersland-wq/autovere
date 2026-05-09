import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { getStripeJs, getStripePublishableKeyMode, validateStripeClientEnv } from '@/lib/stripe';
import { trackAnalyticsEvent } from '@/lib/analytics';

type CheckoutServerError = {
  error?: {
    code?: string;
    message?: string;
    details?: string;
    requestId?: string;
  };
};

type CheckoutResponse = {
  url?: string;
  sessionId?: string;
  requestId?: string;
};

const readInvokeErrorPayload = async (error: unknown): Promise<CheckoutServerError | null> => {
  const context = (error as { context?: { json?: () => Promise<unknown> } } | undefined)?.context;
  if (!context?.json) return null;
  try {
    const payload = await context.json();
    return (payload ?? null) as CheckoutServerError | null;
  } catch (parseError) {
    console.warn('Failed to parse checkout error payload', parseError);
    return null;
  }
};

const toUserMessage = (
  translate: (key: string, defaultValue?: string) => string,
  code?: string,
  fallback?: string
) => {
  if (code === 'unauthenticated') return translate('pages.pricing.checkout_errors.auth_required');
  if (code === 'stripe_env_mismatch') return translate('pages.pricing.checkout_errors.env_mismatch');
  if (code === 'stripe_price_missing') return translate('pages.pricing.checkout_errors.price_missing');
  if (code === 'stripe_price_inactive') return translate('pages.pricing.checkout_errors.price_inactive');
  if (code === 'stripe_currency_mismatch') return translate('pages.pricing.checkout_errors.currency_mismatch');
  if (code === 'stripe_not_configured') return translate('pages.pricing.checkout_errors.temporarily_unavailable');
  if (code === 'checkout_session_failed' || code === 'stripe_request_failed') {
    return translate('pages.pricing.checkout_errors.temporarily_unavailable');
  }
  return fallback || translate('pages.pricing.checkout_errors.generic');
};

export function useStripeCheckout() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openCheckout = async (options: {
    interval: 'month' | 'year';
    locale: string;
    returnPath: string;
  }) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      console.info('Stripe checkout button clicked', options);
      trackAnalyticsEvent('checkout_started', { interval: options.interval, locale: options.locale });

      const clientEnv = validateStripeClientEnv();
      if (!clientEnv.valid) {
        const message = t('pages.pricing.checkout_errors.missing_publishable_key');
        console.error('Stripe checkout blocked by missing client env', clientEnv);
        throw new Error(message);
      }

      const expectedMode = getStripePublishableKeyMode();
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          interval: options.interval,
          locale: options.locale,
          returnPath: options.returnPath,
          expectedMode,
        },
      });

      const response = (data ?? {}) as CheckoutResponse;
      console.info('Stripe checkout API response received', {
        requestId: response.requestId,
        hasUrl: Boolean(response.url),
        hasSessionId: Boolean(response.sessionId),
      });

      if (error) {
        const payload = await readInvokeErrorPayload(error);
        const code = payload?.error?.code;
        const details = payload?.error?.details;
        const requestId = payload?.error?.requestId;
        const message = toUserMessage((key, defaultValue) => t(key, defaultValue), code, payload?.error?.message);
        throw new Error(
          `${message}${requestId ? ` (request: ${requestId})` : ''}${details ? ` — ${details}` : ''}`
        );
      }

      if (!response.url || !response.sessionId) {
        console.error('Stripe checkout API returned invalid payload', response);
        throw new Error(t('pages.pricing.checkout_errors.invalid_response'));
      }

      const stripe = await getStripeJs();
      if (!stripe) {
        throw new Error(t('pages.pricing.checkout_errors.missing_publishable_key'));
      }

      const redirectResult = await stripe.redirectToCheckout({ sessionId: response.sessionId });
      if (redirectResult.error) {
        console.error('Stripe redirectToCheckout failed', {
          requestId: response.requestId,
          sessionId: response.sessionId,
          error: redirectResult.error,
        });
        if (response.url) {
          console.info('Falling back to direct Stripe checkout URL redirect', {
            requestId: response.requestId,
            url: response.url,
          });
          window.location.assign(response.url);
          return;
        }
        throw new Error(t('pages.pricing.checkout_errors.redirect_failed'));
      }

      console.info('Stripe redirectToCheckout initiated', {
        requestId: response.requestId,
        sessionId: response.sessionId,
      });
    } catch (error) {
      console.error('Stripe checkout launch failed', error);
      const message = error instanceof Error ? error.message : t('pages.pricing.checkout_errors.generic');
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading, errorMessage };
}
