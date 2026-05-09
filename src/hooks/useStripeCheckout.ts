import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getStripePublishableKeyMode } from '@/lib/stripe';

type CheckoutServerError = {
  error?: {
    code?: string;
    message?: string;
    details?: string;
    requestId?: string;
  };
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

const toUserMessage = (code?: string, fallback?: string) => {
  if (code === 'unauthenticated') return 'Please sign in again, then retry checkout.';
  if (code === 'stripe_env_mismatch') return 'Billing configuration mismatch (test/live). Please contact support.';
  if (code === 'stripe_price_missing') return 'Stripe plan is not configured correctly. Please contact support.';
  if (code === 'stripe_price_inactive') return 'This subscription plan is currently unavailable.';
  if (code === 'stripe_currency_mismatch') return 'Billing is configured with a non-EUR Stripe price. Please contact support.';
  if (code === 'stripe_not_configured') return 'Billing is temporarily unavailable. Please try again later.';
  return fallback || 'Could not open checkout. Please try again.';
};

export function useStripeCheckout() {
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
      const expectedMode = getStripePublishableKeyMode();
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          interval: options.interval,
          locale: options.locale,
          returnPath: options.returnPath,
          expectedMode,
        },
      });

      if (error) {
        const payload = await readInvokeErrorPayload(error);
        const code = payload?.error?.code;
        const details = payload?.error?.details;
        const requestId = payload?.error?.requestId;
        const message = toUserMessage(code, payload?.error?.message);
        throw new Error(
          `${message}${requestId ? ` (request: ${requestId})` : ''}${details ? ` — ${details}` : ''}`
        );
      }

      if (!data?.url) {
        throw new Error('Checkout URL was not returned by the server.');
      }

      window.location.assign(data.url as string);
    } catch (error) {
      console.error('Stripe checkout launch failed', error);
      const message = error instanceof Error ? error.message : 'Could not open checkout. Please try again.';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading, errorMessage };
}
