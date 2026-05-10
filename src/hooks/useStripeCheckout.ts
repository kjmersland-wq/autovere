import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError, FunctionsRelayError, FunctionsFetchError } from "@supabase/supabase-js";
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
      console.log("[create-checkout] invoking with priceId:", options.priceId);
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
        if (error instanceof FunctionsHttpError) {
          // Function ran but returned a non-2xx — read the actual error body
          try {
            const body = await error.context.json();
            console.error("[create-checkout] FunctionsHttpError status=" + error.context.status, body);
          } catch {
            console.error("[create-checkout] FunctionsHttpError (unreadable body):", error.message);
          }
        } else if (error instanceof FunctionsRelayError) {
          console.error("[create-checkout] FunctionsRelayError — function may not be deployed:", error.message);
        } else if (error instanceof FunctionsFetchError) {
          console.error("[create-checkout] FunctionsFetchError — network error:", error.message);
        } else {
          console.error("[create-checkout] unknown error:", error);
        }
        throw error;
      }

      console.log("[create-checkout] response:", data);
      if (!data?.url) throw new Error("[create-checkout] no URL in response: " + JSON.stringify(data));
      window.location.href = data.url;
    } catch (e) {
      toast.error("Could not open checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
