import { useState } from "react";
<parameter name="supabase">import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);

  const openCheckout = async (options: {
    priceId: string;
    customerEmail?: string;
    userId?: string;
    successUrl?: string;
    cancelUrl?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          priceId: options.priceId,
          successUrl: options.successUrl || `${window.location.origin}/pricing?checkout=success`,
          cancelUrl: options.cancelUrl || `${window.location.origin}/pricing`,
          customerEmail: options.customerEmail,
          userId: options.userId,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");

      // Redirect to Stripe checkout
      window.location.href = data.url;
    } catch (e) {
      console.error(e);
      toast.error("Could not open checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
