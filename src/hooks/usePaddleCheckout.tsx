import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/i18n";
import { openPaddleCheckout } from "@/lib/paddle";

interface CheckoutOptions {
  /** Internal lookup key, e.g. PRICE_IDS.tripPass. */
  priceId: string;
  returnUrl?: string;
}

/**
 * Opens the Paddle overlay checkout. Paddle renders its own modal, so there is
 * no element to mount — `isOpen` only tracks that a checkout was requested.
 */
export function usePaddleCheckout() {
  const { user } = useAuth();
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  const openCheckout = useCallback(
    (opts: CheckoutOptions) => {
      if (!user) return;
      setIsOpen(true);
      void openPaddleCheckout({
        lookupKey: opts.priceId,
        email: user.email ?? undefined,
        userId: user.id,
        locale,
      })
        .catch((error) => {
          toast.error(error instanceof Error ? error.message : "Checkout could not be started.");
        })
        .finally(() => setIsOpen(false));
    },
    [user, locale],
  );

  const closeCheckout = useCallback(() => setIsOpen(false), []);

  return { openCheckout, closeCheckout, isOpen };
}
