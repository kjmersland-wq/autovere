import { useCallback, useState } from "react";
import { toast } from "sonner";

import { initializePaddle, getPaddlePriceId } from "@/lib/paddle";
import { checkoutSuccessUrl, PAYMENT_PLANS, type PaymentProductKey } from "@/lib/payment-plans";
import { useAuth } from "@/lib/auth";
import { PURCHASES_ENABLED } from "@/lib/purchases";

export function usePaddleCheckout() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const openCheckout = useCallback(
    async (opts: { productKey: PaymentProductKey }) => {
      if (!user || !PURCHASES_ENABLED) return;
      setLoading(true);
      try {
        await initializePaddle();
        const plan = PAYMENT_PLANS[opts.productKey];
        const paddlePriceId = await getPaddlePriceId(plan.priceId);
        window.Paddle.Checkout.open({
          items: [{ priceId: paddlePriceId, quantity: 1 }],
          customer: user.email ? { email: user.email } : undefined,
          customData: { userId: user.id },
          settings: {
            displayMode: "overlay",
            successUrl: checkoutSuccessUrl(),
            allowLogout: false,
            variant: "one-page",
          },
        });
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Checkout could not be opened.");
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  return { openCheckout, loading };
}
