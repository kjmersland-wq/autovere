import { Clock, Route as RouteIcon, Zap, BatteryCharging, TrendingDown, Check, ShieldCheck, ShieldAlert, ExternalLink, ChevronDown } from "lucide-react";
import { useState } from "react";
import { type CostLine, type Estimate, type VehicleType } from "@/lib/calc";
import type { TollConfidence } from "@/lib/tolls/types";
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

const savingsCopy = {
  en: { heading: "What would this trip cost in an EV?", smart: "Smart choice! You save an estimated {savings} on this trip compared with petrol/diesel.", evTotal: "Total price with an EV", compared: "vs.", fossil: "with", saved: "You save {savings} on this trip!", energy: "Lower fuel/charging cost", tolls: "Discounted tolls and environmental benefits", details: "See details for an EV", minutes: "Estimated charging time: +{time} minutes.", evTollSaving: (amount: string) => `EV toll saving: ${amount}` },
  de: { heading: "Was würde dieser Roadtrip mit einem E-Auto kosten?", smart: "Klug gewählt! Du sparst auf dieser Strecke schätzungsweise {savings} im Vergleich zu Benzin/Diesel.", evTotal: "Gesamtpreis mit E-Auto", compared: "vs.", fossil: "mit", saved: "Du sparst {savings} auf dieser Strecke!", energy: "Niedrigere Kraftstoff-/Ladekosten", tolls: "Vergünstigte Maut und Umweltvorteile", details: "Details zum E-Auto ansehen", minutes: "Geschätzte Ladezeit: +{time} Minuten.", evTollSaving: (amount: string) => `E-Auto-Mautersparnis: ${amount}` },
  no: { heading: "Hva om du kjørte elbil?", smart: "Smart valg! Du sparer anslagsvis {savings} på denne turen sammenlignet med bensin/diesel.", evTotal: "Totalpris med elbil", compared: "vs.", fossil: "med", saved: "Du sparer {savings} på denne turen!", energy: "Lavere drivstoff-/ladekostnad", tolls: "Rabatterte bompenger og miljøfordeler", details: "Se detaljer for elbil", minutes: "Beregnet ladetid: +{time} minutter.", evTollSaving: (amount: string) => `Du sparer ${amount} i bompenger med elbil på denne ruten.` },
  pl: { heading: "Ile kosztowałaby ta podróż samochodem elektrycznym?", smart: "Dobry wybór! Szacunkowo oszczędzasz {savings} w porównaniu z benzyną/dieslem.", evTotal: "Całkowity koszt z EV", compared: "vs.", fossil: "z", saved: "Oszczędzasz {savings} na tej trasie!", energy: "Niższy koszt paliwa/ładowania", tolls: "Niższe opłaty i korzyści środowiskowe", details: "Zobacz szczegóły dla EV", minutes: "Szacowany czas ładowania: +{time} minut.", evTollSaving: (amount: string) => `Oszczędność na opłatach z EV: ${amount}` },
  nl: { heading: "Wat zou deze rit kosten met een EV?", smart: "Slimme keuze! Je bespaart naar schatting {savings} op deze rit vergeleken met benzine/diesel.", evTotal: "Totale prijs met een EV", compared: "vs.", fossil: "met", saved: "Je bespaart {savings} op deze rit!", energy: "Lagere brandstof-/laadkosten", tolls: "Korting op tol en milieuvoordelen", details: "Bekijk EV-details", minutes: "Geschatte laadtijd: +{time} minuten.", evTollSaving: (amount: string) => `Tolbesparing met EV: ${amount}` },
  sv: { heading: "Vad skulle den här resan kosta med en elbil?", smart: "Smart val! Du sparar uppskattningsvis {savings} på den här resan jämfört med bensin/diesel.", evTotal: "Totalpris med elbil", compared: "jämfört med", fossil: "med", saved: "Du sparar {savings} på den här resan!", energy: "Lägre bränsle-/laddningskostnad", tolls: "Rabatterade vägavgifter och miljöfördelar", details: "Se detaljer för elbil", minutes: "Uppskattad laddningstid: +{time} minuter.", evTollSaving: (amount: string) => `Besparing på vägavgifter med elbil: ${amount}` },
  fr: { heading: "Combien coûterait ce trajet avec un véhicule électrique ?", smart: "Bon choix ! Vous économisez environ {savings} sur ce trajet par rapport à l'essence/diesel.", evTotal: "Prix total avec un véhicule électrique", compared: "contre", fossil: "avec", saved: "Vous économisez {savings} sur ce trajet !", energy: "Coût carburant/recharge plus faible", tolls: "Péages réduits et avantages environnementaux", details: "Voir les détails pour un véhicule électrique", minutes: "Temps de recharge estimé : +{time} minutes.", evTollSaving: (amount: string) => `Économie de péage avec un véhicule électrique : ${amount}` },
  da: { heading: "Hvad ville denne tur koste med en elbil?", smart: "Klogt valg! Du sparer anslået {savings} på denne tur sammenlignet med benzin/diesel.", evTotal: "Totalpris med elbil", compared: "vs.", fossil: "med", saved: "Du sparer {savings} på denne tur!", energy: "Lavere brændstof-/opladningsomkostning", tolls: "Rabatterede vejafgifter og miljøfordele", details: "Se detaljer for elbil", minutes: "Anslået opladningstid: +{time} minutter.", evTollSaving: (amount: string) => `Besparelse på vejafgifter med elbil: ${amount}` },
} as const;

function replaceCopy(text: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((result, [key, value]) => result.replace(`{${key}}`, value), text);
}

export function EvSavingsCard({
  vehicle,
  evEstimate,
  fossilEstimate,
  fossilLabel,
  currency,
  onShowDetails,
}: {
  vehicle: VehicleType;
  evEstimate: Estimate;
  fossilEstimate: Estimate;
  fossilLabel: string;
  currency: CurrencyCode;
  onShowDetails: () => void;
}) {
  const { locale } = useLocale();
  const copy = savingsCopy[locale];
  const savings = Math.max(0, fossilEstimate.total - evEstimate.total);
  const energySavings = Math.max(0, fossilEstimate.energyCost - evEstimate.energyCost);
  const tollSavings = Math.max(0, fossilEstimate.tollCost - evEstimate.tollCost);
  const isEv = vehicle === "ev";

  return (
    <aside className="panel border-primary/60 panel-glow p-5">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
          <Zap className="size-5" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold text-primary">{isEv ? copy.smart.replace("{savings}", formatCurrency(savings, currency, locale)) : copy.heading}</h3>
          <p className="mt-3 text-sm leading-relaxed text-foreground">
            {copy.evTotal}: <strong>{formatCurrency(evEstimate.total, currency, locale)}</strong> {copy.compared} <strong>{formatCurrency(fossilEstimate.total, currency, locale)}</strong> {copy.fossil} {fossilLabel}.
          </p>
          <p className="mt-3 text-base font-bold text-primary">{replaceCopy(copy.saved, { savings: formatCurrency(savings, currency, locale) })}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <li>• {copy.energy}: {formatCurrency(energySavings, currency, locale)}</li>
            <li>• {copy.tolls}: {formatCurrency(tollSavings, currency, locale)}</li>
          </ul>
          {!isEv && evEstimate.ev && (
            <p className="mt-3 text-sm text-muted-foreground">{replaceCopy(copy.minutes, { time: String(evEstimate.ev.chargingMinutes) })}</p>
          )}
          {!isEv && <button type="button" onClick={onShowDetails} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/85">{copy.details}</button>}
        </div>
      </div>
    </aside>
  );
}

export function TradeoffBanner({ estimates, currency }: { estimates: Estimate[]; currency: CurrencyCode }) {
  const t = useT();
  const { locale } = useLocale();
  const fastest = estimates.find((e) => e.key === "fastest");
  const others = estimates.filter((e) => e.key !== "fastest");
  if (!fastest || !others.length) return null;
  const best = others.reduce((a, b) => (a.total <= b.total ? a : b));
  const saving = fastest.total - best.total;
  if (saving <= 1) return null;
  const extraMin = Math.max(0, best.durationMin - fastest.durationMin);
  const distanceDelta = best.distanceKm - fastest.distanceKm;
  const fuelDelta = fastest.energyCost - best.energyCost;
  const tollDelta = fastest.tollCost - best.tollCost;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border border-success/35 bg-success/10 px-4 py-3.5">
      <TrendingDown className="size-5 shrink-0 text-success" aria-hidden />
      <p className="text-sm font-semibold text-foreground">
        {t.tradeoff(
          t.duration(extraMin),
          t[best.key].toLowerCase(),
          formatCurrency(saving, currency, locale),
          formatCurrency(saving / Math.max(1, extraMin / 60), currency, locale),
        )}
      </p>
      <span className="numeric text-xs text-muted-foreground">
        {formatCurrency(saving / Math.max(1, extraMin / 60), currency, locale)} {t.earnedPerHour}
      </span>
      <span className="numeric w-full text-xs text-muted-foreground">
        {t.distance}: {distanceDelta >= 0 ? "+" : ""}{Math.round(distanceDelta)} km · {t.fuel}: {fuelDelta >= 0 ? "+" : ""}{formatCurrency(fuelDelta, currency, locale)} · {t.tolls}: {tollDelta >= 0 ? "+" : ""}{formatCurrency(tollDelta, currency, locale)}
      </span>
    </div>
  );
}

const CONFIDENCE_TONE: Record<TollConfidence, string> = {
  high: "bg-success/15 text-success",
  medium: "bg-primary/15 text-primary",
  low: "bg-muted text-muted-foreground",
  estimated: "bg-destructive/12 text-destructive",
};

function ConfidenceBadge({ confidence }: { confidence: TollConfidence }) {
  const t = useT();
  const label =
    confidence === "high" ? t.confidenceHigh : confidence === "medium" ? t.confidenceMedium : confidence === "low" ? t.confidenceLow : t.confidenceEstimated;
  const Icon = confidence === "estimated" ? ShieldAlert : ShieldCheck;
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide", CONFIDENCE_TONE[confidence])}>
      <Icon className="size-3" aria-hidden /> {label}
    </span>
  );
}

function Line({ label, detail, amount, currency, source }: { label: string; detail: string; amount: number; currency: CurrencyCode; source?: CostLine | undefined }) {
  const t = useT();
  const { locale } = useLocale();
  const [open, setOpen] = useState(false);
  const isNorway = source?.country === "NO";
  const hasBreakdown = !!source?.breakdown?.length;
  return (
    <div className="py-1.5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate text-sm font-medium text-foreground">{label}</p>
            {source && <ConfidenceBadge confidence={source.confidence} />}
          </div>
          <p className="truncate text-xs text-muted-foreground">{dynamicText(detail, locale)}</p>
        </div>
        <span className="numeric shrink-0 text-sm font-semibold text-foreground">
          {formatCurrency(amount, currency, locale)}
        </span>
      </div>
      {source && (
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {hasBreakdown && (
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex items-center gap-1 text-muted-foreground underline decoration-dotted underline-offset-2 hover:text-foreground"
            >
              <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} aria-hidden />
              {t.seeBreakdown}
            </button>
          )}
          {source.sourceUrl && !isNorway && (
            <a
              href={source.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="size-3" aria-hidden /> {t.tollSource}: {source.source}
            </a>
          )}
          {isNorway && source.externalLink && (
            <a
              href={source.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 font-bold text-primary-foreground hover:bg-primary/90"
            >
              <ExternalLink className="size-3" aria-hidden /> {t.bomkalkCta}
            </a>
          )}
        </div>
      )}
      {/* NOK is hardcoded here because Norway is currently the only provider that populates
          `breakdown` — revisit if a second native-currency breakdown is ever added. */}
      {open && hasBreakdown && (
        <ul className="mt-1.5 space-y-0.5 rounded-lg bg-muted/40 px-2.5 py-2">
          {source!.breakdown!.map((b, i) => (
            <li key={i} className="numeric flex items-center justify-between text-xs text-muted-foreground">
              <span className="truncate pr-2">{b.label}</span>
              <span className="shrink-0">{Math.round(b.amount)} NOK</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function RouteCard({
  est,
  selected,
  onSelect,
  cheapest,
  currency,
}: {
  est: Estimate;
  selected: boolean;
  onSelect: () => void;
  cheapest: boolean;
  currency: CurrencyCode;
}) {
  const t = useT();
  const { locale } = useLocale();
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
          {formatCurrency(est.total, currency, locale)}
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
  const savingsLocaleCopy = savingsCopy[locale];
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
          <Line key={i} label={l.label} detail={l.detail} amount={l.amount} currency={currency} source={l} />
        ))}
        <Line
          label={est.ev ? t.charging : t.fuel}
          detail={est.ev ? `${Math.round(est.ev.energyKwh)} kWh` : t.estimatedConsumption}
          amount={est.energyCost}
          currency={currency}
        />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-primary/8 px-3.5 py-3.5">
        <span className="text-sm font-bold uppercase tracking-wider text-foreground">
          {t.total}
        </span>
        <span className="numeric text-2xl font-extrabold text-primary">{formatCurrency(est.total, currency, locale)}</span>
      </div>
      {est.ev && est.tollSavings && est.tollSavings > 0 && (
        <p className="mt-3 text-xs font-semibold text-success">
          {savingsLocaleCopy.evTollSaving(formatCurrency(est.tollSavings, currency, locale))}
        </p>
      )}
    </div>
  );
}
