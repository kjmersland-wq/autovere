import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { openCreemCheckout, type CreemProductKey } from "@/lib/creem";

interface CheckoutOptions {
  /** Internal plan key, e.g. "tripPass". */
  productKey: CreemProductKey;
}

/**
 * Starts a Creem hosted checkout: the server creates the session and the
 * browser is redirected to Creem's checkout page. `isOpen` tracks that a
 * checkout was requested.
 */
export function useCreemCheckout() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const openCheckout = useCallback(
    (opts: CheckoutOptions) => {
      if (!user) return;
      setIsOpen(true);
      void openCreemCheckout({ productKey: opts.productKey })
        .catch((error) => {
          toast.error(error instanceof Error ? error.message : "Checkout could not be started.");
        })
        .finally(() => setIsOpen(false));
    },
    [user],
  );

  const closeCheckout = useCallback(() => setIsOpen(false), []);

  return { openCheckout, closeCheckout, isOpen };
}
