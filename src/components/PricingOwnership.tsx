import { Banknote, Wrench, Battery, Shield, TrendingUp, Sparkles } from "lucide-react";
import type { Car } from "@/data/cars";

// Heuristic ownership signals derived from car attributes — calm, directional, not pretending to be precise.
const ownershipFor = (car: Car) => {
  const tier = car.score >= 94 ? "Top-tier premium" : car.score >= 88 ? "Premium" : "Mid-premium";
  const stress =
    car.tag.toLowerCase().includes("winter") || car.climate.toLowerCase().includes("excellent")
      ? "Lower than average"
      : "Average";
  const value =
    car.score >= 94
      ? "Strong long-term — feels more premium than the price suggests."
      : "Fair — comfort and refinement justify the cost.";
  const charging = car.range
    ? "Daily charging at home covers most needs. Long trips reward planning, not anxiety."
    : "—";
  const insurance = car.type.toLowerCase().includes("performance") ? "Higher band" : "Standard premium band";
  const resale = car.score >= 94 ? "Expected to hold value well" : "Expected to depreciate gently";

  return { tier, stress, value, charging, insurance, resale };
};

export const PricingOwnership = ({ car }: { car: Car }) => {
  const o = ownershipFor(car);

  return (
    <section className="container pb-24">
      <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Pricing & ownership</div>
      <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 leading-tight max-w-3xl">
        What it really costs to live with the {car.name}.
      </h2>

      <div className="grid lg:grid-cols-[1fr_1.2fr] gap-6">
        {/* Pricing card */}
        <div className="glass rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-4">
              <Banknote className="w-3.5 h-3.5" /> Estimated pricing
            </div>
            <div className="text-5xl md:text-6xl font-bold tracking-tighter mb-2">
              {car.startingPrice ?? "—"}
            </div>
            <div className="text-sm text-muted-foreground mb-6">
              Starting price · regional estimate · before incentives
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Positioning</div>
                <div className="font-medium">{o.tier}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Ownership stress</div>
                <div className="font-medium">{o.stress}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Insurance</div>
                <div className="font-medium">{o.insurance}</div>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Resale outlook</div>
                <div className="font-medium">{o.resale}</div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border/40 text-[11px] text-muted-foreground leading-relaxed">
              AutoVere estimates use regional averages, not live dealer pricing. Final figures depend on country, options and incentives.
            </div>
          </div>
        </div>

        {/* AI value insights */}
        <div className="glass rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent">
            <Sparkles className="w-3.5 h-3.5" /> AI value insight
          </div>
          <p className="text-xl leading-relaxed">
            <span className="text-foreground font-medium">{o.value}</span>
          </p>

          <div className="grid sm:grid-cols-2 gap-5 pt-2">
            <div className="flex gap-3">
              <Battery className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">Charging life</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{o.charging}</div>
              </div>
            </div>
            <div className="flex gap-3">
              <Wrench className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">Maintenance</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  EV servicing is light — fewer moving parts, fewer surprise bills.
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Shield className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">Long-term confidence</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Software updates and battery warranties mean the car often improves after you buy it.
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <TrendingUp className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold mb-1">Comfort-to-price ratio</div>
                <div className="text-sm text-muted-foreground leading-relaxed">
                  Refinement and quietness rate above the price tier.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
