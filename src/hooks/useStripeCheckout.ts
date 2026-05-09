import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getStripePublishableKey } from '@/lib/stripe';

type StripeCheckoutOptions = {
  priceId: 'premium_monthly' | 'premium_yearly';
  locale: string;
  successPath?: string;
  cancelPath?: string;
};

export type StripeCheckoutResult =
  | { ok: true }
  | {
      ok: false;
      code: string;
      message: string;
      details?: Record<string, unknown> | null;
    };

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);

  const openCheckout = async (options: StripeCheckoutOptions): Promise<StripeCheckoutResult> => {
    setLoading(true);
    const payload = {
      priceId: options.priceId,
      locale: options.locale,
      successPath: options.successPath || '/success',
      cancelPath: options.cancelPath || '/pricing',
      publishableKey: getStripePublishableKey(),
    };

    console.info('[checkout] click', {
      priceId: options.priceId,
      locale: options.locale,
      successPath: payload.successPath,
      cancelPath: payload.cancelPath,
    });
    console.info('[checkout] request_payload', payload);

    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: payload,
      });

      console.info('[checkout] api_response', {
        hasError: !!error,
        error,
        data,
      });

      if (error) {
        return {
          ok: false,
          code: 'checkout_request_failed',
          message: error.message || 'Checkout request failed',
        };
      }

      if (data?.error) {
        return {
          ok: false,
          code: data.error.code || 'checkout_session_failed',
          message: data.error.message || 'Checkout could not be opened. Please try again.',
          details: data.error.details || null,
        };
      }

      if (!data?.url) {
        return {
          ok: false,
          code: 'checkout_url_missing',
          message: 'Checkout URL was not returned by the server.',
        };
      }

      console.info('[checkout] redirect_start', {
        url: data.url,
        sessionId: data.sessionId,
      });

      window.location.assign(data.url);

      console.info('[checkout] redirect_invoked', {
        url: data.url,
      });

      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Checkout could not be opened. Please try again.';
      console.error('[checkout] redirect_failed', err);
      return {
        ok: false,
        code: 'checkout_unexpected_error',
        message,
      };
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
