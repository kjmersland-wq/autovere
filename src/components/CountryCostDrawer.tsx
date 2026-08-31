import { useState } from "react";
import { BadgeCheck, ChevronDown, ExternalLink, Fuel, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  COST_GROUPS,
  COUNTRY_COSTS,
  COUNTRY_COUNT,
  type CostGroupKey,
  type CountryCost,
} from "@/lib/country-costs";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Props = {
  defaultGroup?: CostGroupKey;
  onPlanRoute?: (country: CountryCost) => void;
};

export function CountryCostDrawer({ defaultGroup = "western", onPlanRoute }: Props) {
  const [open, setOpen] = useState(false);
  const [group, setGroup] = useState<CostGroupKey>(defaultGroup);
  const t = useT();
  const countries = COUNTRY_COSTS[group];

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
      <div className="glass-panel overflow-hidden rounded-2xl">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-7"
        >
          <span>
            <span className="block text-lg font-semibold sm:text-xl">
              {t.drawer.title}
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              {t.drawer.subtitle(COUNTRY_COUNT)}
            </span>
          </span>
          <ChevronDown
            className={cn("size-5 shrink-0 text-primary transition-transform", open && "rotate-180")}
          />
        </button>

        {open && (
          <div className="border-t border-border px-5 pb-7 pt-5 sm:px-7">
            <div className="flex flex-wrap gap-2">
              {COST_GROUPS.map((g) => (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setGroup(g.key)}
                  aria-pressed={group === g.key}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    group === g.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background/50 text-foreground/85 hover:bg-background/70",
                  )}
                >
                  {t.drawer.groups[g.key]}
                </button>
              ))}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {countries.map((c) => (
                <article
                  key={c.key}
                  className="flex flex-col rounded-xl border border-border bg-background/40 p-5"
                >
                  <header className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2 text-base font-semibold">
                      <span aria-hidden>{c.flag}</span>
                      {c.name}
                    </h3>
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
                      {c.tollSystem}
                    </span>
                  </header>

                  <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <Stat icon={<Fuel className="size-3.5" />} label={t.drawer.petrol} value={`${c.currency}${c.petrol.toFixed(2)}/L`} />
                    <Stat icon={<Fuel className="size-3.5" />} label={t.drawer.diesel} value={`${c.currency}${c.diesel.toFixed(2)}/L`} />
                    <Stat icon={<Zap className="size-3.5" />} label={t.drawer.fastDc} value={`${c.currency}${c.charging.toFixed(2)}/kWh`} />
                  </dl>

                  <p className="mt-4 text-sm text-foreground/75">{c.tollNote}</p>

                  <a
                    href={c.portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    {c.portal.label}
                    {c.portal.verified && <BadgeCheck className="size-4 text-[var(--teal,currentColor)]" />}
                    <ExternalLink className="size-3.5" />
                  </a>

                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4 w-full border-border bg-background/50"
                    onClick={() => onPlanRoute?.(c)}
                  >
                    {t.drawer.planRoute(c.name)}
                  </Button>
                </article>
              ))}
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              {t.drawer.disclaimer}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/40 px-2 py-2">
      <dt className="flex items-center justify-center gap-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}
