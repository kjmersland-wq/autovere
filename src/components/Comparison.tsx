import { Clock, Route as RouteIcon, Zap, BatteryCharging, TrendingDown, Check } from "lucide-react";
import { type Estimate } from "@/lib/calc";
import { formatCurrency, type CurrencyCode } from "@/lib/currency";
import { FLAGS } from "@/lib/countries";
import { countryName, dynamicText, useLocale, useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { RouteVariantKey } from "@/lib/geo";

const ACCENT: Record<RouteVariantKey, string> = {
  fastest: "text-route-fast",
  bypass: "text-route-bypass",
  tollfree: "text-route-free",
};

const DOT: Record<RouteVariantKey, string> = {
  fastest: "bg-route-fast",
  bypass: "bg-route-bypass",
  tollfree: "bg-route-free",
};

export function TradeoffBanner({ estimates, currency }: { estimates: Estimate[]; currency: CurrencyCode }) {
  const t = useT();
  const fastest = estimates.find((e) => e.key === "fastest");
  const others = estimates.filter((e) => e.key !== "fastest");
  if (!fastest || !others.length) return null;
  const best = others.reduce((a, b) => (a.total <= b.total ? a : b));
  const saving = fastest.total - best.total;
  if (saving <= 1) return null;
  const extraMin = Math.max(0, best.durationMin - fastest.durationMin);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-success/35 bg-success/10 px-4 py-3.5">
      <TrendingDown className="size-5 shrink-0 text-success" aria-hidden />
      <p className="text-sm font-semibold text-foreground">
        {t.tradeoff(
          t.duration(extraMin),
          t[best.key].toLowerCase(),
          formatCurrency(saving, currency),
          formatCurrency(saving / Math.max(1, extraMin / 60), currency),
        )}
      </p>
      <span className="numeric text-xs text-muted-foreground">
        {formatCurrency(saving / Math.max(1, extraMin / 60), currency)} {t.earnedPerHour}
      </span>
    </div>
  );
}

function Line({ label, detail, amount, currency }: { label: string; detail: string; amount: number; currency: CurrencyCode }) {
  const { locale } = useLocale();
  return (
    <div className="flex items-start justify-between gap-3 py-1.5">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{dynamicText(detail, locale)}</p>
      </div>
      <span className="numeric shrink-0 text-sm font-semibold text-foreground">
        {formatCurrency(amount, currency)}
      </span>
    </div>
  );
}

export function RouteCard({
  est,
  selected,
  onSelect,
  cheapest,
}: {
  est: Estimate;
  selected: boolean;
  onSelect: () => void;
  cheapest: boolean;
  currency: CurrencyCode;
}) {
  const t = useT();
  const isEv = !!est.ev;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "panel w-full p-5 text-left transition-all",
        selected ? "border-primary/60 panel-glow" : "hover:border-primary/30",
      )}
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className={cn("size-2.5 rounded-full", DOT[est.key])} aria-hidden />
          <h3 className={cn("text-base font-bold", ACCENT[est.key])}>{t[est.key]}</h3>
        </div>
        {cheapest && (
          <span className="rounded-full bg-success/15 px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-success">
            {t.cheapest}
          </span>
        )}
        {selected && !cheapest && (
          <span className="flex items-center gap-1 text-[0.65rem] font-bold uppercase tracking-wider text-primary">
            <Check className="size-3.5" /> {t.selected}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <span className="numeric text-3xl font-extrabold tracking-tight text-foreground">
          {formatCurrency(est.total, currency)}
        </span>
        <div className="flex gap-4 text-right text-xs text-muted-foreground">
          <span className="numeric flex items-center gap-1.5">
            <RouteIcon className="size-3.5" /> {Math.round(est.distanceKm)} km
          </span>
          <span className="numeric flex items-center gap-1.5">
            <Clock className="size-3.5" /> {t.duration(est.durationMin)}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2 border-t border-border pt-3">
        <Line
          label={isEv ? t.charging : t.fuel}
          detail={
            isEv
              ? `${Math.round(est.ev!.energyKwh)} kWh at corridor prices`
              : t.pumpPrices
          }
          amount={est.energyCost}
          currency={currency}
        />
        <Line
          label={t.tolls}
          detail={
            est.tollLines.length
              ? est.tollLines.map((l) => FLAGS[l.country ?? ""] ?? "").join(" ")
              : t.noTolls
          }
          amount={est.tollCost}
          currency={currency}
        />
        <Line
          label={t.vignettes}
          detail={
            est.vignetteLines.length
              ? est.vignetteLines.map((l) => FLAGS[l.country ?? ""] ?? "").join(" ")
              : t.noVignettes
          }
          amount={est.vignetteCost}
          currency={currency}
        />
      </div>

      {isEv && (
        <div className="mt-3 flex items-center gap-4 rounded-lg bg-primary/8 px-3 py-2 text-xs">
          <span className="numeric flex items-center gap-1.5 font-semibold text-primary">
            <Zap className="size-3.5" /> {est.ev!.stopCount} {t.chargingStops.toLowerCase()}
          </span>
          <span className="numeric flex items-center gap-1.5 text-muted-foreground">
            <BatteryCharging className="size-3.5" /> {t.duration(est.ev!.chargingMinutes)}{" "}
            {t.chargingTime.toLowerCase()}
          </span>
        </div>
      )}
    </button>
  );
}

export function Breakdown({ est, currency }: { est: Estimate; currency: CurrencyCode }) {
  const t = useT();
  const { locale } = useLocale();
  return (
    <div className="panel p-5">
      <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
        {t.fullBreakdown}: {t[est.key]}
      </h3>

      <div className="mt-4 space-y-1">
        {est.legs.map((l) => (
          <div key={l.code} className="flex items-center justify-between py-1 text-sm">
            <span className="flex items-center gap-2 text-foreground">
              <span aria-hidden>{FLAGS[l.code]}</span> {countryName(l.code, locale, l.name)}
            </span>
            <span className="numeric text-muted-foreground">{Math.round(l.km)} km</span>
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1 border-t border-border pt-3">
        {[...est.tollLines, ...est.vignetteLines].map((l, i) => (
          <Line key={i} label={l.label} detail={l.detail} amount={l.amount} currency={currency} />
        ))}
        <Line
          label={est.ev ? t.charging : t.fuel}
          detail={est.ev ? `${Math.round(est.ev.energyKwh)} kWh` : t.estimatedConsumption}
          amount={est.energyCost}
          currency={currency}
        />
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          {t.total}
        </span>
        <span className="numeric text-2xl font-extrabold text-primary">{formatCurrency(est.total, currency)}</span>
      </div>
    </div>
  );
}
