import { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { StripeEmbeddedCheckout } from '@/components/StripeEmbeddedCheckout';
import { useAuth } from '@/lib/auth';
import { PURCHASES_ENABLED } from '@/lib/purchases';
import type { PaymentProductKey } from '@/lib/payment-plans';
export function useStripeCheckout() {
  const { user } = useAuth();
  const [productKey, setProductKey] = useState<PaymentProductKey | null>(null);
  const openCheckout = useCallback((opts: { productKey: PaymentProductKey }) => {
    if (user && PURCHASES_ENABLED) setProductKey(opts.productKey);
  }, [user]);
  const checkoutElement = <Dialog open={productKey !== null} onOpenChange={open => { if (!open) setProductKey(null); }}>
    <DialogContent className="max-h-[90dvh] max-w-3xl overflow-y-auto">
      <DialogHeader><DialogTitle>Secure checkout</DialogTitle><DialogDescription>AutoVere</DialogDescription></DialogHeader>
      {productKey && <StripeEmbeddedCheckout key={productKey} productKey={productKey} />}
    </DialogContent>
  </Dialog>;
  return { openCheckout, checkoutElement };
}
