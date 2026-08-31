import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

type Tier = {
  id: "free" | "pro" | "fleet";
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
    cta: "Upgrade with Stripe",
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
    cta: "Upgrade with Stripe",
    features: [
      "Multi-country toll invoice consolidation",
      "Team routing with shared trip libraries",
      "Heavy vehicle profiles (>3.5 t) and axle-based tolls",
      "Driver assignment & cost centre exports (CSV)",
      "Priority support from KM TECH LABS",
    ],
  },
];

export function PricingTiers() {
  const { user, openAuth } = useAuth();
  const [cycle, setCycle] = useState<"monthly" | "yearly">("monthly");

  const upgrade = (tier: Tier) => {
    if (tier.id === "free") {
      toast.success("You're on the Free plan — plan away!");
      return;
    }
    if (!user) {
      openAuth("signup");
      toast.info("Create your account first, then we'll take you to secure checkout.");
      return;
    }
    toast.info("Secure Stripe checkout is being finalised — you'll be first in line.");
  };

  return (
    <div>
      <div className="mx-auto mb-10 flex w-fit items-center gap-1 rounded-full border border-border bg-background/50 p-1">
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
            {c === "monthly" ? "Monthly" : "Yearly · save 35%"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map((tier) => {
          const price = cycle === "yearly" && tier.yearly ? tier.yearly : tier.monthly;
          const unit = tier.id === "free" ? "forever" : cycle === "yearly" && tier.yearly ? "per year" : "per month";
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
                  <Sparkles className="size-3" /> Most loved
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
                <p className="mt-1 text-xs text-muted-foreground">€4.99/mo or €39/yr — cancel anytime.</p>
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
                variant={tier.id === "free" ? "outline" : "default"}
                onClick={() => upgrade(tier)}
              >
                {tier.cta}
              </Button>
            </article>
          );
        })}
      </div>

      <p className="mt-8 text-center text-xs text-muted-foreground">
        Prices in EUR incl. applicable VAT. Payments handled securely by Stripe. Cost estimates remain indicative —
        always verify with official toll portals.
      </p>
    </div>
  );
}
