import { useEffect, useState } from "react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { checkoutReturnUrl, type PaymentProductKey } from "@/lib/payment-plans";
import { createCheckoutSession } from "@/utils/payments.functions";

export function StripeEmbeddedCheckout({ productKey }: { productKey: PaymentProductKey }) {
  const [secret, setSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const result = await createCheckoutSession({ data: { productKey, environment: getStripeEnvironment(), returnUrl: checkoutReturnUrl() } });
        if ("error" in result) throw new Error(result.error);
        if (active) setSecret(result.clientSecret);
      } catch (e) { if (active) setError(e instanceof Error ? e.message : "Payment form could not be loaded."); }
    })();
    return () => { active = false; };
  }, [productKey]);
  if (error) return <p role="alert" className="p-5 text-sm text-destructive">{error}</p>;
  if (!secret) return <div role="status" className="flex min-h-40 items-center justify-center"><Loader2 className="size-6 animate-spin text-primary" /></div>;
  return <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret: secret }}><EmbeddedCheckout /></EmbeddedCheckoutProvider>;
}