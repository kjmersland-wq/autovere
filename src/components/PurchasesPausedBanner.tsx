import { Info } from "lucide-react";
import { useRouterState } from "@tanstack/react-router";

import { PURCHASES_ENABLED, purchasesPausedMessage } from "@/lib/purchases";

/** Site-wide notice while purchases are paused. Hidden automatically when PURCHASES_ENABLED is true. */
export function PurchasesPausedBanner() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (PURCHASES_ENABLED) return null;
  const lang = pathname.split("/")[1] ?? "en";
  return (
    <div role="status" className="w-full border-b border-border bg-muted/60 px-4 py-2 text-center text-sm text-muted-foreground">
      <Info className="mr-1.5 inline size-4 -translate-y-px text-primary" />
      {purchasesPausedMessage(lang)}
    </div>
  );
}
