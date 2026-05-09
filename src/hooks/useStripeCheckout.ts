import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { detectLegacyPaymentRuntime, logPaymentDiagnostic } from "@/lib/payments";

const CHECKOUT_ENDPOINT = "create-stripe-checkout";

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);

  const openCheckout = async (options: {
    priceId: string;
    successPath?: string;
    cancelPath?: string;
  }) => {
    setLoading(true);
    try {
      detectLegacyPaymentRuntime();
      logPaymentDiagnostic("checkout-session-request", {
        endpoint: CHECKOUT_ENDPOINT,
        priceId: options.priceId,
        successPath: options.successPath,
        cancelPath: options.cancelPath,
      });

      const { data, error } = await supabase.functions.invoke(CHECKOUT_ENDPOINT, {
        body: {
          priceId: options.priceId,
          successPath: options.successPath,
          cancelPath: options.cancelPath,
        },
      });

      if (error || !data?.url) {
        throw error ?? new Error("Checkout session URL missing");
      }

      logPaymentDiagnostic("checkout-session-redirect", {
        endpoint: CHECKOUT_ENDPOINT,
        redirectUrl: data.url,
      });

      window.location.assign(data.url as string);
    } catch (error) {
      console.error(error);
      toast.error("Could not open checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading, checkoutEndpoint: CHECKOUT_ENDPOINT };
}
