import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: options.priceId,
          customerEmail: options.customerEmail,
          userId: options.userId,
          successUrl: options.successUrl || `${window.location.origin}/pricing?checkout=success`,
          cancelUrl: options.cancelUrl || `${window.location.origin}/pricing`,
        },
      });
      if (error) {
        // Extract the real server-side error message from the edge function response
        try {
          const body = await error.context?.json?.();
          console.error("[create-checkout] edge function error:", body);
        } catch {
          console.error("[create-checkout] error:", error.message);
        }
        throw error;
      }
      if (!data?.url) throw new Error("[create-checkout] no URL in response");
      window.location.href = data.url;
    } catch (e) {
      toast.error("Could not open checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
