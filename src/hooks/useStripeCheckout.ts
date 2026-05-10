import { useState } from "react";
import { toast } from "sonner";

const STRIPE_CHECKOUT_URLS: Record<string, string | undefined> = {
  premium_monthly: import.meta.env.VITE_STRIPE_CHECKOUT_MONTHLY_URL as string | undefined,
  premium_yearly: import.meta.env.VITE_STRIPE_CHECKOUT_YEARLY_URL as string | undefined,
};

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);

  const openCheckout = async (options: {
    priceId: string;
    customerEmail?: string;
    userId?: string;
    successUrl?: string;
  }) => {
    setLoading(true);
    try {
      const checkoutBaseUrl = STRIPE_CHECKOUT_URLS[options.priceId];
      if (!checkoutBaseUrl) throw new Error(`Missing Stripe checkout URL for ${options.priceId}`);

      const checkoutUrl = new URL(checkoutBaseUrl);
      if (options.customerEmail) checkoutUrl.searchParams.set("prefilled_email", options.customerEmail);
      if (options.userId) checkoutUrl.searchParams.set("client_reference_id", options.userId);
      if (options.successUrl) checkoutUrl.searchParams.set("success_url", options.successUrl);

      window.location.assign(checkoutUrl.toString());
    } catch (e) {
      console.error(e);
      toast.error("Could not open checkout. Please try again.");
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
