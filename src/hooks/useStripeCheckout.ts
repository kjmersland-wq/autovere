import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);

  const openCheckout = async (options: {
    interval: "month" | "year";
    customerEmail?: string;
    userId?: string;
    locale?: string;
  }) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-stripe-checkout", {
        body: {
          interval: options.interval,
          locale: options.locale,
        },
      });
      if (error || !data?.url) throw new Error("Could not create checkout session");
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
