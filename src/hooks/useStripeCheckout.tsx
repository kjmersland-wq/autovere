import { useCallback, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import type { PaymentProductKey } from "@/lib/payment-plans";
import { useAuth } from "@/lib/auth";
import { PURCHASES_ENABLED } from "@/lib/purchases";

export function useStripeCheckout() {
  const { user } = useAuth();
  const [productKey, setProductKey] = useState<PaymentProductKey | null>(null);
  const openCheckout = useCallback((opts: { productKey: PaymentProductKey }) => {
    if (user && PURCHASES_ENABLED) setProductKey(opts.productKey);
  }, [user]);
  const closeCheckout = useCallback(() => setProductKey(null), []);
  const checkoutElement = productKey ? (
    <Dialog open onOpenChange={open => { if (!open) closeCheckout(); }}>
      <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto p-4 sm:p-6" aria-describedby={undefined}>
        <DialogHeader><DialogTitle>Secure checkout</DialogTitle></DialogHeader>
        <StripeEmbeddedCheckout key={productKey} productKey={productKey} />
      </DialogContent>
    </Dialog>
  ) : null;
  return { openCheckout, closeCheckout, isOpen: Boolean(productKey), checkoutElement };
}