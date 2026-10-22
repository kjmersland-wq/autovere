import { useCallback, useState } from 'react';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { useServerFn } from '@tanstack/react-start';
import { getStripe, getStripeEnvironment } from '@/lib/stripe';
import { createCheckoutSession } from '@/utils/payments.functions';
import { PAYMENT_PLANS, checkoutSuccessUrl, type PaymentProductKey } from '@/lib/payment-plans';
export function StripeEmbeddedCheckout({ productKey }: { productKey: PaymentProductKey }) {
  const createSession = useServerFn(createCheckoutSession);
  const [error, setError] = useState<string | null>(null);
  const fetchClientSecret = useCallback(async () => {
    try {
      const result = await createSession({ data: { priceId: PAYMENT_PLANS[productKey].priceId, returnUrl: checkoutSuccessUrl(), environment: getStripeEnvironment() } });
      if ('error' in result) throw new Error(result.error);
      return result.clientSecret;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout could not be opened.');
      throw e;
    }
  }, [productKey, createSession]);
  if (error) return <p role="alert" className="p-6 text-center text-destructive">{error}</p>;
  return <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}><EmbeddedCheckout /></EmbeddedCheckoutProvider>;
}
