import { useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useStripeCheckout() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const getInvokeErrorMessage = async (error: unknown) => {
    if (!error || typeof error !== "object") return null;
    const maybeError = error as { context?: Response; message?: string };
    if (maybeError.context instanceof Response) {
      try {
        const body = await maybeError.context.clone().json() as unknown;
        if (body && typeof body === "object") {
          const responseBody = body as { error?: unknown; message?: unknown };
          if (typeof responseBody.error === "string" && responseBody.error.trim().length > 0) {
            return responseBody.error;
          }
          if (typeof responseBody.message === "string" && responseBody.message.trim().length > 0) {
            return responseBody.message;
          }
        }
      } catch {
        // fall through to message
      }
    }
    return maybeError.message ?? null;
  };

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
        const invokeErrorMessage = await getInvokeErrorMessage(error);
        throw new Error(invokeErrorMessage ?? "Checkout function failed");
      }
      if (!data?.url) throw new Error("No checkout URL returned");
      window.location.href = data.url;
    } catch (e) {
      console.error("[useStripeCheckout] checkout failed:", e);
      toast.error(t("pages.pricing.checkout_error"));
    } finally {
      setLoading(false);
    }
  };

  return { openCheckout, loading };
}
