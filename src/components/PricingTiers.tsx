import { useState } from "react";
import { Check, ExternalLink, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/i18n";
import { getStripeEnvironment, PRICE_IDS, type PlanTier } from "@/lib/stripe";
import { cn } from "@/lib/utils";
import { createPortalSession } from "@/utils/payments.functions";

type Tier = {
  id: PlanTier;
  name: string;
  emoji: string;
  tagline: string;
  monthly: string;
  yearly?: string;
  cta: string;
  highlight?: boolean;
  features: string[];
};

export const TIERS: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Everything you need for a first honest estimate.",
    monthly: "€0",
    cta: "Start planning free",
    features: [
      "Basic toll, vignette and fuel cost calculations",
      "OSRM routing across Europe, the USA and Canada",
      "One vehicle profile",
      "Country & state cost explorer",
      "Share a trip link",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "For the traveller who lives for the next pass.",
    monthly: "€4.99",
    yearly: "€39",
    cta: "Upgrade to Pro",
    highlight: true,
    features: [
      "Multi-vehicle garage (car, motorhome, motorcycle)",
      "GPX & KML export to Garmin, TomTom and CarPlay",
      "Real-time mountain pass & ferry alerts",
      "Offline turn-by-turn itinerary and print packs",
      "Motorcycle toll discounts & rider safety radar",
      "Unlimited saved adventures",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Fleet",
    emoji: "🚛",
    tagline: "Cross-border operations, consolidated.",
    monthly: "€19",
    cta: "Upgrade to Business",
    features: [
      "Multi-country toll invoice consolidation",
      "Team routing with shared trip libraries",
      "Heavy vehicle profiles (>3.5 t) and axle-based tolls",
      "Driver assignment & cost centre exports (CSV)",
      "Priority support from KM TECH LABS",
    ],
  },
];


export const TIERS_PL: Tier[] = [
  {
    id: "free",
    name: "Free",
    emoji: "🧭",
    tagline: "Wszystko, czego potrzebujesz do pierwszej uczciwej wyceny.",
    monthly: "0 €",
    cta: "Zacznij planować za darmo",
    features: [
      "Podstawowe wyliczenia opłat drogowych, winiet i paliwa",
      "Trasowanie OSRM w Europie, USA i Kanadzie",
      "Jeden profil pojazdu",
      "Przeglądarka kosztów według krajów i stanów",
      "Udostępnianie linku do podróży",
    ],
  },
  {
    id: "pro",
    name: "AutoVere Pro",
    emoji: "✨",
    tagline: "Dla podróżnika, który żyje kolejną przełęczą.",
    monthly: "4,99 €",
    yearly: "39 €",
    cta: "Przejdź na Pro",
    highlight: true,
    features: [
      "Garaż wielu pojazdów (samochód, kamper, motocykl)",
      "Eksport GPX i KML do Garmin, TomTom i CarPlay",
      "Alerty o przełęczach i promach w czasie rzeczywistym",
      "Trasa offline krok po kroku i pakiety do druku",
      "Zniżki motocyklowe i radar bezpieczeństwa kierowcy",
      "Nieograniczona liczba zapisanych podróży",
    ],
  },
  {
    id: "fleet",
    name: "AutoVere Business / Flota",
    emoji: "🚛",
    tagline: "Operacje transgraniczne w jednym miejscu.",
    monthly: "19 €",
    cta: "Przejdź na Business",
    features: [
      "Konsolidacja faktur za opłaty drogowe z wielu krajów",
      "Trasowanie zespołowe ze wspólną biblioteką podróży",
      "Profile pojazdów ciężkich (>3,5 t) i opłaty według osi",
      "Przypisanie kierowców i eksport centrów kosztów (CSV)",
      "Priorytetowe wsparcie od KM TECH LABS",
    ],
  },
];

const PRICING_COPY = {
  en: {
    onPlan: "You're on",
    retrying: " — payment retrying",
    until: (d: string) => `Access stays open until ${d}.`,
    renews: (d: string) => `Renews ${d}.`,
    active: "Active subscription.",
    manage: "Manage billing",
    monthly: "Monthly",
    yearly: "Yearly · save 35%",
    forever: "forever",
    perYear: "per year",
    perMonth: "per month",
    mostLoved: "Most loved",
    proFine: "€4.99/mo or €39/yr — cancel anytime.",
    current: "Your current plan",
    switch: "Switch plan in billing portal",
    foot: "Prices in EUR incl. applicable VAT. Payments and tax handled securely by Stripe. Cost estimates remain indicative — always verify with official toll portals.",
    checkout: "Secure checkout",
    freeToast: "You're on the Free plan — plan away!",
    signupToast: "Create your account first, then we'll take you straight to secure checkout.",
    portalError: "Could not open the billing portal.",
  },
  pl: {
    onPlan: "Twój plan to",
    retrying: " — ponawiamy płatność",
    until: (d: string) => `Dostęp pozostaje otwarty do ${d}.`,
    renews: (d: string) => `Odnawia się ${d}.`,
    active: "Aktywna subskrypcja.",
    manage: "Zarządzaj płatnościami",
    monthly: "Miesięcznie",
    yearly: "Rocznie · oszczędzasz 35%",
    forever: "na zawsze",
    perYear: "rocznie",
    perMonth: "miesięcznie",
    mostLoved: "Najczęściej wybierany",
    proFine: "4,99 €/mies. lub 39 €/rok — anulujesz, kiedy chcesz.",
    current: "Twój obecny plan",
    switch: "Zmień plan w panelu płatności",
    foot: "Ceny w EUR z odpowiednim VAT. Płatności i podatki bezpiecznie obsługuje Stripe. Szacunki kosztów są orientacyjne — zawsze sprawdź je na oficjalnych portalach opłat drogowych.",
    checkout: "Bezpieczna płatność",
    freeToast: "Korzystasz z planu Free — planuj do woli!",
    signupToast: "Najpierw załóż konto, a potem przeniesiemy Cię prosto do bezpiecznej płatności.",
    portalError: "Nie udało się otworzyć panelu płatności.",
  },
} as const;

export function PricingTiers() {
  const locale = useLocale();
  const L = locale === "pl" ? PRICING_COPY.pl : PRICING_COPY.en;
  const tiers = locale === "pl" ? TIERS_PL : TIERS;
  const { user, openAuth } = useAuth();
  const { tier: currentTier, isActive, cancelAtPeriodEnd, periodEnd, pastDue } = useSubscription();
  const { openCheckout, closeCheckout, isOpen, checkoutElement } = useStripeCheckout();
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");
  const [portalLoading, setPortalLoading] = useState(false);

  const priceIdFor = (tier: Tier) =>
    tier.id === "fleet"
      ? PRICE_IDS.businessMonthly
      : cycle === "yearly"
        ? PRICE_IDS.proYearly
        : PRICE_IDS.proMonthly;

  const upgrade = (tier: Tier) => {
    if (tier.id === "free") {
      toast.success(L.freeToast);
      return;
    }
    if (!user) {
      openAuth("signup");
      toast.info(L.signupToast);
      return;
    }
    openCheckout({
      priceId: priceIdFor(tier),
      returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
    });
  };

  const manageBilling = async () => {
    setPortalLoading(true);
    try {
      const result = await createPortalSession({
        data: { returnUrl: `${window.location.origin}/pricing`, environment: getStripeEnvironment() },
      });
      if ("error" in result) throw new Error(result.error);
      window.open(result.url, "_blank", "noopener");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : L.portalError);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div>
      <PaymentTestModeBanner />

      {isActive && (
        <div className="glass-panel mx-auto mb-8 mt-6 flex max-w-2xl flex-col items-center gap-3 rounded-2xl p-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-medium">
              {L.onPlan} <span className="text-amber-300">{tiers.find((t) => t.id === currentTier)?.name}</span>
              {pastDue && L.retrying}
            </p>
            <p className="text-xs text-muted-foreground">
              {cancelAtPeriodEnd
                ? L.until(periodEnd?.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-GB") ?? "")
                : periodEnd
                  ? L.renews(periodEnd.toLocaleDateString(locale === "pl" ? "pl-PL" : "en-GB"))
                  : L.active}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={manageBilling} disabled={portalLoading}>
            {portalLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <ExternalLink className="mr-2 size-4" />}
            {L.manage}
          </Button>
        </div>
      )}

      <div className="mx-auto mb-10 mt-6 flex w-fit items-center gap-1 rounded-full border border-border bg-background/50 p-1">
        {(["monthly", "yearly"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCycle(c)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              cycle === c ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:text-foreground",
            )}
          >
            {c === "monthly" ? L.monthly : L.yearly}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => {
          const price = cycle === "yearly" && tier.yearly ? tier.yearly : tier.monthly;
          const unit = tier.id === "free" ? L.forever : cycle === "yearly" && tier.yearly ? L.perYear : L.perMonth;
          const isCurrent = isActive ? currentTier === tier.id : tier.id === "free";
          return (
            <article
              key={tier.id}
              className={cn(
                "glass-panel relative flex flex-col rounded-3xl p-6 sm:p-7",
                tier.highlight && "border-primary/50 ring-1 ring-primary/40",
              )}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  <Sparkles className="size-3" /> {L.mostLoved}
                </span>
              )}
              <h3 className="text-lg font-semibold tracking-tight">
                {tier.emoji} {tier.name}
              </h3>
              <p className="mt-1 text-sm text-foreground/70">{tier.tagline}</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="text-4xl font-semibold tracking-tight text-amber-300">{price}</span>
                <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{unit}</span>
              </p>
              {tier.id === "pro" && (
                <p className="mt-1 text-xs text-muted-foreground">{L.proFine}</p>
              )}
              <ul className="mt-6 grid flex-1 gap-3 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-foreground/85">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="mt-7 w-full"
                variant={tier.id === "free" || isCurrent ? "outline" : "default"}
                disabled={isCurrent && tier.id !== "free"}
                onClick={() => (isCurrent && tier.id !== "free" ? undefined : upgrade(tier))}
              >
                {isCurrent && tier.id !== "free" ? L.current : tier.cta}
              </Button>
              {isActive && !isCurrent && tier.id !== "free" && (
                <button
                  type="button"
                  onClick={manageBilling}
                  className="mt-2 text-xs text-muted-foreground underline-offset-4 hover:underline"
                >
                  {L.switch}
                </button>
              )}
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        {L.foot}
      </p>

      <Dialog open={isOpen} onOpenChange={(open) => !open && closeCheckout()}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{L.checkout}</DialogTitle>
          </DialogHeader>
          {checkoutElement}
        </DialogContent>
      </Dialog>
    </div>
  );
}
