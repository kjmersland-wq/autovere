import { Lock, Route, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useAuth } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";
import { useRouterState } from "@tanstack/react-router";

import { useLocale, useTr } from "@/lib/i18n";
import { tripPassPrice } from "@/lib/pricing-i18n";
import { checkoutReturnUrl, PRICE_IDS } from "@/lib/stripe";
import { regionFromPath } from "@/lib/trip-data";

/**
 * Soft paywall for route exports. Free visitors can preview everything on
 * screen; taking the route on the road (GPX/KML, turn-by-turn PDF, send-to-car)
 * requires the one-time 14-day Trip Pass or any active subscription.
 */
export function ExportPaywallModal({
  open,
  onOpenChange,
  title,
  description,
  primaryLabel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  primaryLabel?: string;
}) {
  const tr = useTr();
  const locale = useLocale();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Same price the pricing page shows for this language/region — never a hardcoded one.
  const price = tripPassPrice(locale, regionFromPath(pathname));
  const { user, openAuth } = useAuth();
  const { openCheckout, isOpen, checkoutElement } = useStripeCheckout();

  const startCheckout = (priceId: string) => {
    if (!user) {
      openAuth("signup");
      toast.info(tr("Sign up or log in to unlock exports"));
      return;
    }
    void trackEvent("pro_upgrade_clicked", { source: "export-paywall", priceId });
    onOpenChange(false);
    openCheckout({ priceId, returnUrl: checkoutReturnUrl() });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-2xl bg-primary/15">
              <Route className="size-6 text-primary" />
            </div>
            <DialogTitle className="text-center text-2xl">
              {title ?? tr("Take this route on the road")}
            </DialogTitle>
            <DialogDescription className="text-center text-base leading-relaxed">
              {description ??
                tr(
                  "Export turn-by-turn toll gates, charging stops, and direct official vignette links to your phone or navigation unit.",
                )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-3">
            <Button
              size="lg"
              className="w-full font-semibold"
              onClick={() => startCheckout(PRICE_IDS.tripPass)}
            >
              <Sparkles className="size-4" />
              {primaryLabel ?? `${tr("Get 14-Day Trip Pass")} · ${price}`}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full font-semibold"
              onClick={() => startCheckout(PRICE_IDS.proYearly)}
            >
              {tr("Upgrade to Annual Pro")} · €39/{tr("year")}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="size-3" />
              {tr("One-time payment. No subscription required for Trip Pass.")}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {isOpen && checkoutElement}
    </>
  );
}
