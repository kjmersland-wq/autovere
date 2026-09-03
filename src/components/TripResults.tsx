import { useMemo, useState } from "react";
import { ExternalLink, Mountain, Printer, Save, Share2, ShieldCheck, Ship } from "lucide-react";
import { toast } from "sonner";
import { tripTrackPoints } from "@/lib/trip-export";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { Switch } from "@/components/ui/switch";
import { PartnerOffers } from "@/components/PartnerOffers";

import { PoiLinks } from "@/components/PoiLinks";
import { RouteExportPanel } from "@/components/RouteExportPanel";
import { NorwayAutoPassCard, ScandiBridgeCard } from "@/components/ScandiTolls";
import { PassBorderIntel } from "@/components/PassBorderIntel";
import { CorridorMap } from "@/components/CorridorMap";
import { LezMonitor, MotorhomeClearanceRadar, TransponderSelector } from "@/components/ComplianceModules";
import { CurrencyPills } from "@/components/CurrencySelector";
import { PrintItinerary } from "@/components/PrintItinerary";
import {
  RATES_UPDATED,
  convert,
  currencyFromSymbol,
  formatCurrency,
  useMoney,
} from "@/lib/currency";
import { useLocale, useT, useTr } from "@/lib/i18n";
import { filterByCorridor } from "@/lib/corridor-filter";
import { cn } from "@/lib/utils";
import {
  ROUTE_VARIANTS,
  applyNetworkFilter,
  RV_POIS,
  SCENIC_HIGHLIGHTS,
  detectScandiBridges,
  evComparison,
  routeTouchesNorway,
  variantComparison,
  type EmissionBadge,
  type FerryCrossing,
  type FuelKey,
  type RegionKey,
  type RouteVariantKey,
  type TripEstimate,
} from "@/lib/trip-data";


function MetricCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div className={accent ? "glass-panel rounded-2xl border-primary/40 p-5" : "glass-panel rounded-2xl p-5"}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p
        className={
          accent
            ? "mt-2 text-4xl font-semibold tracking-tight text-primary sm:text-5xl"
            : "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
        }
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-foreground/70">{hint}</p>
    </div>
  );
}

function SubtotalBadge({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 text-sm">
      <span>{emoji}</span>
      <span className="text-foreground/75">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </span>
  );
}

function EvSavingsBanner({
  trip,
  vehicle,
  fuel,
}: {
  trip: TripEstimate;
  vehicle: "car" | "motorhome" | "motorcycle";
  fuel: FuelKey;
}) {
  const t = useT();
  const m = useMoney(trip.currency);
  const ev = evComparison(trip, vehicle, fuel);
  return (
    <div className="mt-5 rounded-2xl border border-emerald-400/30 bg-emerald-400/5 p-5">
      <p className="text-sm font-semibold">{t.map.evTitle}</p>
      <p className="mt-1 text-sm text-foreground/75">
        {ev.isElectric
          ? t.map.evAlready
          : t.map.evIntro(m.fmt(ev.fuelCost, 0), m.fmt(ev.evCost, 0))}
      </p>
      <p className="mt-3 flex flex-wrap items-center gap-2 text-sm font-semibold">
        <span
          className={cn(
            "rounded-full px-3 py-1",
            ev.saved >= 0 ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300",
          )}
        >
          {ev.saved >= 0
            ? t.map.evSaved(m.fmt(Math.abs(ev.saved), 0))
            : t.map.evCostlier(m.fmt(Math.abs(ev.saved), 0))}
        </span>
        <span className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs text-foreground/75">
          {t.map.evEnergy(`${ev.kwh} kWh`, `${ev.litres} L`)}
        </span>
      </p>
    </div>
  );
}

export function TripResults({
  trips,
  origin,
  destination,
  ferryCrossings,
  isMotorcycle,
  emissionBadges = [],
  region = "eu",
  isMotorhome = false,
  fuel = "petrol",
  onAddStop,
}: {
  trips: Record<RouteVariantKey, TripEstimate>;
  origin: string;
  destination: string;
  ferryCrossings: FerryCrossing[];
  isMotorcycle: boolean;
  emissionBadges?: EmissionBadge[];
  region?: RegionKey;
  isMotorhome?: boolean;
  fuel?: FuelKey;
  onAddStop?: (name: string) => void;
}) {
  const t = useT();
  const tr = useTr();
  const locale = useLocale();
  const [active, setActive] = useState<RouteVariantKey>("fastest");
  const [printing, setPrinting] = useState(false);
  const [rvMode, setRvMode] = useState(isMotorhome);
  const [savePrompt, setSavePrompt] = useState(false);
  /** Operator picked interactively from the charging network pills. */
  const [netFilter, setNetFilter] = useState<string | null>(null);
  const { user, openAuth } = useAuth();
  const trip = trips[active];
  const optimizer = useMemo(
    () => applyNetworkFilter(trip.optimizer, netFilter ?? trip.optimizer.preferredNetwork ?? null),
    [trip.optimizer, netFilter],
  );
  // Everything "along the route" is filtered against the real polyline.
  const corridorCoords = trip.corridor?.coords;
  const highlights = filterByCorridor(SCENIC_HIGHLIGHTS[region], corridorCoords, 25);
  const rvPois = filterByCorridor(RV_POIS[region], corridorCoords, 25);
  const m = useMoney(trip.currency);
  const nativePrice = (value: number, symbol: string) =>
    formatCurrency(convert(value, currencyFromSymbol(symbol), m.display), m.display, { decimals: 2 });
  const comparison = variantComparison(trips.fastest, trip);
  const title = `${origin || t.results.yourStart} → ${destination || t.results.yourDestination}`;
  const showNorway = region === "eu" && routeTouchesNorway(origin, destination);
  const bridges = region === "eu" ? detectScandiBridges(corridorCoords) : [];


  const persistTrip = () => {
    try {
      const key = "autovere.savedTrips";
      const saved = JSON.parse(localStorage.getItem(key) ?? "[]");
      saved.unshift({
        id: Math.random().toString(36).slice(2, 10),
        name: title,
        origin: origin || t.results.yourStart,
        destination: destination || t.results.yourDestination,
        detail: `${trip.distanceLabel} · ${trip.driveTime} · ${m.fmt(trip.budget, 0)} ${t.results.budgetWord}`,
        when: t.results.savedOn(new Date().toLocaleDateString(locale === "no" ? "nb-NO" : locale === "pl" ? "pl-PL" : "en-GB", { day: "numeric", month: "short" })),
        distanceLabel: trip.distanceLabel,
        driveTime: trip.driveTime,
        budget: trip.budget,
        currency: trip.currency,
        tolls: trip.tolls,
        ferries: trip.ferries,
        energyCost: trip.energyCost,
        stops: trip.segments
          .flatMap((s) => s.lines)
          .map((l) => ({ place: l.place, detail: l.detail })),
        points: trip.corridor?.points ?? [],
        coords: tripTrackPoints(trip),
        countries: trip.corridor?.countries.map((c) => `${c.flag} ${c.country}`) ?? [],
      });
      localStorage.setItem(key, JSON.stringify(saved.slice(0, 20)));
      toast.success(t.results.savedToast);
    } catch {
      toast.error(t.results.saveError);
    }
  };

  const saveTrip = () => {
    if (!user) {
      setSavePrompt(true);
      return;
    }
    persistTrip();
  };




  const shareTrip = async () => {
    const text = `${title} — ${trip.distanceLabel}, ${trip.driveTime}, ${m.fmt(trip.budget, 0)} · AutoVere`;
    try {
      if (navigator.share) await navigator.share({ title: "AutoVere road trip", text, url: window.location.href });
      else {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        toast.success(t.results.shareToast);
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{t.results.eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {isMotorhome ? "🚐 Motorhome" : isMotorcycle ? "🏍️ Motorcycle" : "🚗 Car"}
        </span>
      </div>
      <p className="mt-2 max-w-2xl text-foreground/75">
        {t.results.intro}
      </p>

      <div className="mt-8 grid gap-3">
        <div className="flex flex-wrap gap-2">
          {ROUTE_VARIANTS.map((v) => {
            const variantTrip = trips[v.key];
            const on = active === v.key;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => setActive(v.key)}
                aria-pressed={on}
                className={cn(
                  "flex-1 min-w-[200px] rounded-2xl border px-4 py-3 text-left transition-colors",
                  on
                    ? "border-primary bg-primary/15 text-foreground"
                    : "border-border bg-background/40 text-foreground/75 hover:border-primary/50 hover:bg-background/60",
                )}
              >
                <span className="block text-sm font-semibold">
                  {v.emoji} {t.results.variants[v.key].label}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {m.fmt(variantTrip.tolls + variantTrip.ferries)} {t.results.tollsShort} · {variantTrip.driveTime} · {variantTrip.distanceLabel}
                </span>
              </button>
            );
          })}
        </div>
        <div className="glass-panel flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl px-5 py-4">
          <p className="text-sm text-foreground/80">
            {t.results.variants[active].blurb}
          </p>
          {active !== "fastest" && (
            <span className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary">
                {t.results.saved}: {comparison.savedLabel}
              </span>
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-semibold text-amber-300">
                {t.results.timeAdded}: {comparison.timeLabel}
              </span>
            </span>
          )}
        </div>
      </div>



      <div className="glass-panel mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t.results.displayCurrency}
          </p>
          <p className="mt-1 text-xs text-foreground/70">
            {m.rateNote() || t.results.baseCurrencyNote} · {RATES_UPDATED}
          </p>
        </div>
        <CurrencyPills />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          accent
          label={t.results.budget}
          value={m.fmt(trip.budget, 0)}
          hint={t.results.budgetHint}
        />
        <MetricCard label={t.results.distance} value={trip.distanceLabel} hint={t.results.distanceHint} />
        <MetricCard label={t.results.driveTime} value={trip.driveTime} hint={t.results.driveTimeHint} />
        <MetricCard
          label={trip.energyLabel}
          value={m.fmt(trip.energyCost)}
          hint={t.results.energyHint(trip.energyAmount)}
        />
      </div>

      {/* Instant clarity trio — the three answers every driver wants first. */}
      <div data-tour="results" className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="glass-panel rounded-2xl p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            🛣️ {t.results.tollsBadge}
          </p>
          <p className="mt-3 text-5xl font-semibold tracking-tight text-primary sm:text-6xl">
            {m.fmt(trip.tolls, 0)}
          </p>
          <p className="mt-2 text-sm text-foreground/70">{t.results.tollsShort}</p>
        </div>
        <div className="glass-panel rounded-2xl p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            ⛽ {trip.energyLabel}
          </p>
          <p className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
            {m.fmt(trip.energyCost, 0)}
          </p>
          <p className="mt-2 text-sm text-foreground/70">{t.results.energyHint(trip.energyAmount)}</p>
        </div>
        <div className="glass-panel rounded-2xl p-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t.intel.crossTitle}
          </p>
          <p className="mt-3 text-5xl font-semibold tracking-tight sm:text-6xl">
            {trip.corridor ? Math.max(trip.corridor.countries.length - 1, 0) : 0}
          </p>
          <p className="mt-2 text-sm text-foreground/70">
            {trip.corridor && trip.corridor.countries.length > 0
              ? trip.corridor.countries.map((c) => `${c.flag} ${c.country}`).join(" · ")
              : t.results.exempt}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <SubtotalBadge emoji="🛣️" label={t.results.tollsBadge} value={m.fmt(trip.tolls)} />
        <SubtotalBadge emoji="⛽" label={`${trip.energyLabel}`} value={m.fmt(trip.energyCost)} />
        <SubtotalBadge emoji="⛴️" label={t.results.ferriesBadge} value={m.fmt(trip.ferries)} />
      </div>

      {(region === "us" || region === "ca") && (
        <EvSavingsBanner
          trip={trip}
          vehicle={isMotorhome ? "motorhome" : isMotorcycle ? "motorcycle" : "car"}
          fuel={fuel}
        />
      )}

      {trip.discountNote && (
        <p className="mt-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground/85">
          🏍️ {trip.discountNote}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" variant="secondary" onClick={saveTrip}>
          <Save className="size-4" /> {t.results.save}
        </Button>
        <Button size="lg" variant="outline" onClick={shareTrip}>
          <Share2 className="size-4" /> {t.results.share}
        </Button>
        <Button size="lg" variant="outline" onClick={() => setPrinting(true)}>
          <Printer className="size-4" /> {tr("Export to PDF / Print itinerary")}
        </Button>
      </div>

      <RouteExportPanel trip={trip} origin={origin} destination={destination} />

      {showNorway && <NorwayAutoPassCard isMotorcycle={isMotorcycle} />}
      <ScandiBridgeCard bridges={bridges} isMotorcycle={isMotorcycle} />

      {ferryCrossings.length > 0 && (
        <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Ship className="size-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">{t.results.ferryTitle}</h3>
          </div>
          <p className="mt-1 text-sm text-foreground/70">
            {t.results.ferryIntro}
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {ferryCrossings.map((f) => (
              <article key={f.id} className="rounded-2xl border border-border bg-background/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{tr(f.corridor)}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{f.route}</p>
                  </div>
                  {f.badge && (
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                      {tr(f.badge)}
                    </span>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {f.operators.map((op) => (
                    <span
                      key={op}
                      className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                    >
                      {op}
                    </span>
                  ))}
                </div>

                <dl className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t.results.duration}</dt>
                    <dd className="mt-0.5 text-sm font-medium">{tr(f.duration)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t.results.frequency}</dt>
                    <dd className="mt-0.5 text-sm font-medium">{tr(f.frequency)}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{t.results.indicative}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-primary">
                      {tr(isMotorcycle && f.motoPrice ? f.motoPrice : f.price)}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-sm text-foreground/80">{tr(f.note)}</p>

                <PoiLinks
                  kind="ferry"
                  name={f.route}
                  where={f.corridor}
                  region={region}
                  booking={f.booking.url}
                />

                <a
                  href={f.booking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
                >
                  {t.results.officialBooking} · {f.booking.label}
                  <ExternalLink className="size-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold tracking-tight">{t.results.breakdown}</h3>
          <p className="mt-1 text-sm text-foreground/70">
            {t.results.breakdownIntro}
          </p>
          {trip.corridor && (
            <div className="mt-3 rounded-xl border border-border bg-background/40 p-3 text-xs">
              <p className="font-medium text-foreground/90">
                {trip.corridor.countries
                  .map((c) => `${c.flag} ${c.country} · ${c.distanceLabel}`)
                  .join("  →  ")}
              </p>
              {trip.corridor.borders.length > 0 && (
                <ul className="mt-2 grid gap-1 text-muted-foreground">
                  {trip.corridor.borders.map((b) => (
                    <li key={b}>🛂 {b}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          <Accordion type="single" collapsible className="mt-2">
            {trip.segments.map((segment) => (
              <AccordionItem key={segment.country} value={segment.country}>
                <AccordionTrigger className="text-left">
                  <span className="flex w-full items-center justify-between gap-4 pr-3">
                    <span className="font-medium">{tr(segment.country)}</span>
                    <span className="text-primary">{m.fmt(segment.total)}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="grid gap-3">
                    {segment.lines.map((line) => (
                      <li
                        key={line.place}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-background/40 px-4 py-3"
                      >
                        <span>
                          <span className="block text-sm font-medium">{line.place}</span>
                          <span className="block text-xs text-muted-foreground">{tr(line.detail)}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          {line.badge && (
                            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                              {tr(line.badge)}
                            </span>
                          )}
                          {line.portal && (
                            <a
                              href={line.portal.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-primary/40 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                            >
                              {line.portal.label}
                              <ExternalLink className="size-3" />
                            </a>
                          )}

                        </span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">🛡️ {tr(trip.safety.title)}</h3>
          </div>
          <div className="mt-4 grid gap-5">
            {trip.safety.sections.map((section) => (
              <div key={section.heading}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {tr(section.heading)}
                </p>
                <ul className="mt-2 grid gap-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground/85"
                    >
                      {tr(item)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {trip.vignette && (
        <div className="glass-panel mt-6 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{t.results.vignetteTitle}</h3>
            <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {trip.tripType === "return"
                ? t.results.returnBadge(trip.vignette.daysCovered)
                : t.results.onewayBadge}
            </span>
          </div>

          <p className="mt-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            {tr(trip.vignette.headline)}
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {trip.vignette.items.map((v) => (
              <article key={v.code} className="rounded-2xl border border-border bg-background/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {v.flag} {v.country}
                    </p>
                    <p className="text-xs text-muted-foreground">{v.system}</p>
                  </div>
                  <p className="text-right text-sm font-semibold text-primary">
                    {v.exempt ? t.results.exempt : nativePrice(v.cost, v.currency)}
                  </p>
                </div>

                <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {t.results.recommended}: {tr(v.recommendation)}
                </p>
                {v.saved > 0 && (
                  <p className="mt-2 text-xs font-medium text-emerald-400">
                    💡 {t.results.savesVs(nativePrice(v.saved, v.currency), `${v.baselineLabel} (${nativePrice(v.baselineCost, v.currency)})`)}
                  </p>
                )}
                <p className="mt-2 text-sm text-foreground/80">{tr(v.note)}</p>

                <a
                  href={v.portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/85 hover:border-primary/50 hover:text-primary"
                >
                  {t.results.buyAt} {v.portal.label}
                  <ExternalLink className="size-3" />
                </a>
              </article>
            ))}
          </div>

          <p className="mt-4 text-sm text-foreground/75">
            {t.results.vignetteTotal}{" "}
            <span className="font-semibold text-foreground">
              {formatCurrency(convert(trip.vignette.total, "EUR", m.display), m.display)}
            </span>
            {trip.vignette.totalSaved > 0 && (
              <span className="text-emerald-400">
                {" "}· {formatCurrency(convert(trip.vignette.totalSaved, "EUR", m.display), m.display)}{" "}
                {t.results.vignetteSaved}
              </span>
            )}
            . {t.results.vignetteTail(trip.tripType === "return")}
          </p>
        </div>
      )}


      <div className="glass-panel mt-6 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{tr(optimizer.title)}</h3>
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {tr(optimizer.rangeLabel)}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{tr(optimizer.bufferLabel)}</p>

        {optimizer.preferredNetwork && (
          <p className="mt-2 text-sm font-medium text-primary">
            ⭐ {tr("Preferred network")}: {optimizer.preferredNetwork}
          </p>
        )}

        {optimizer.networks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {optimizer.networks.map((n) => {
              const isPreferred =
                !!optimizer.preferredNetwork &&
                n.toLowerCase().includes(optimizer.preferredNetwork.toLowerCase());
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={isPreferred}
                  onClick={() => setNetFilter(isPreferred ? null : n)}
                  className={
                    isPreferred
                      ? "rounded-full border border-primary bg-primary/15 px-3 py-1 text-xs font-semibold text-primary"
                      : "rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium text-foreground/85 transition-colors hover:border-primary/50 hover:text-primary"
                  }
                >
                  🔌 {n}
                </button>
              );
            })}
          </div>
        )}

        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {optimizer.stops.map((stop, i) => (
            <li
              key={`${stop.name}-${i}`}
              className={
                stop.preferred
                  ? "rounded-xl border border-primary/60 bg-primary/10 p-4"
                  : "rounded-xl border border-border bg-background/40 p-4"
              }
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">
                  {i + 1}. {stop.name}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">{t.results.at} {stop.atLabel}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-primary">
                {tr(stop.power)}
                {stop.kwhNeeded ? ` · ~${stop.kwhNeeded} kWh` : ""}
                {stop.preferred && optimizer.preferredNetwork
                  ? ` · ⭐ ${optimizer.preferredNetwork}`
                  : ""}
                {stop.fallback ? ` · ↩️ ${tr("Nearest high-power CCS hub")}` : ""}
              </p>
              {stop.pricePerKwh ? (
                <p className="mt-1 text-xs font-semibold text-foreground/80">
                  ~{formatCurrency(convert(stop.pricePerKwh, "EUR", m.display), m.display, { decimals: 2 })} / kWh
                </p>
              ) : null}
              <p className="mt-2 text-sm text-foreground/80">{tr(stop.note)}</p>
              {stop.networks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {stop.networks.map((n) => {
                    const isPreferred =
                      !!optimizer.preferredNetwork &&
                      n.toLowerCase().includes(optimizer.preferredNetwork.toLowerCase());
                    return (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setNetFilter(isPreferred ? null : n)}
                        className={
                          isPreferred
                            ? "rounded-full border border-primary bg-primary/20 px-2.5 py-0.5 text-[11px] font-semibold text-primary"
                            : "rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80 transition-colors hover:border-primary/50 hover:text-primary"
                        }
                      >
                        {isPreferred ? "⭐ " : ""}{n}
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ol>

        {trip.optimizer.arbitrage.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t.results.arbitrage}
            </p>
            <ul className="mt-2 grid gap-2">
              {trip.optimizer.arbitrage.map((tip) => (
                <li
                  key={tip}
                  className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground/85"
                >
                  💡 {t.results.tip}: {tr(tip)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t.results.longStretch}
          </p>
          <ul className="mt-2 grid gap-2">
            {trip.optimizer.longStretch.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-foreground/90"
              >
                ⚠️ {tr(item)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {emissionBadges.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold tracking-tight">{t.results.badgeRadar}</h3>
          <p className="mt-1 text-sm text-foreground/70">
            {t.results.badgeRadarIntro}
          </p>
          <div className="mt-4 grid gap-3 lg:grid-cols-2">
            {emissionBadges.map((b) => (
              <article
                key={b.id}
                className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5"
              >
                <p className="text-sm font-semibold">
                  {b.flag} {b.title}
                </p>
                <p className="mt-2 text-sm text-foreground/80">{b.body}</p>
                <a
                  href={b.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                >
                  {t.results.officialInfo} · {b.portalLabel}
                  <ExternalLink className="size-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      )}

      <CorridorMap
        region={region}
        trip={trip}
        trips={trips}
        activeVariant={active}
        onVariantChange={setActive}
        vehicle={isMotorhome ? "motorhome" : isMotorcycle ? "motorcycle" : "car"}
        origin={origin}
        destination={destination}
        ferryCrossings={ferryCrossings}
        isMotorhome={isMotorhome}
        fuel={fuel}
        {...(onAddStop ? { onAddStop } : {})}
      />

      {isMotorhome && <MotorhomeClearanceRadar region={region} />}

      <LezMonitor
        region={region}
        origin={origin}
        destination={destination}
        isMotorcycle={isMotorcycle}
      />

      <TransponderSelector region={region} trip={trip} />

      <PassBorderIntel
        region={region}
        origin={origin}
        destination={destination}
        vehicle={isMotorcycle ? "motorcycle" : isMotorhome ? "motorhome" : "car"}
        {...(corridorCoords ? { coords: corridorCoords } : {})}
        countryCodes={trip.corridor?.countries.map((c) => c.code) ?? []}
        countryNames={trip.corridor?.countries.map((c) => c.country) ?? []}
        {...(onAddStop ? { onAddStop } : {})}
        onUseSmartBypass={() => setActive("smart")}
      />



      {(highlights.length > 0 || rvPois.length > 0) && (
      <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Mountain className="size-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">{t.results.scenicTitle}</h3>
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 text-sm">
            <span className="text-foreground/85">{t.results.rvToggle}</span>
            <Switch checked={rvMode} onCheckedChange={setRvMode} />
          </label>
        </div>
        <p className="mt-1 text-sm text-foreground/70">
          {t.results.scenicIntro}
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => (
            <article key={h.id} className="rounded-2xl border border-border bg-background/40 p-5">
              <p className="text-sm font-semibold">
                {h.emoji} {h.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{tr(h.where)}</p>
              <p className="mt-2 text-sm text-foreground/80">{tr(h.note)}</p>
              <p className="mt-3 text-xs font-medium text-primary">{t.results.open}: {tr(h.season)}</p>
              <PoiLinks kind="pass" name={h.name} where={h.where} region={region} />
              <Button
                size="sm"
                variant="secondary"
                className="mt-3"
                onClick={() => onAddStop?.(h.name)}
              >
                {t.results.addStop}
              </Button>
            </article>
          ))}
        </div>

        {rvMode && (
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t.results.rvTitle}
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rvPois.map((p) => (
                <article key={p.id} className="rounded-2xl border border-border bg-background/40 p-5">
                  <p className="text-sm font-semibold">
                    {p.emoji} {p.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{tr(p.where)}</p>
                  <p className="mt-2 text-sm text-foreground/80">{tr(p.note)}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                      >
                        {tr(s)}
                      </span>
                    ))}
                  </div>
                  <PoiLinks kind="camp" name={p.name} where={p.where} region={region} />
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-3"
                    onClick={() => onAddStop?.(p.name)}
                  >
                    {t.results.addStop}
                  </Button>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
      )}

      <PartnerOffers vehicle={isMotorcycle ? "motorcycle" : isMotorhome ? "motorhome" : "car"} />

      {printing && (
        <PrintItinerary
          trip={trip}
          origin={origin}
          destination={destination}
          vehicle={isMotorcycle ? "motorcycle" : isMotorhome ? "motorhome" : "car"}
          fuel={fuel}
          region={region}
          onClose={() => setPrinting(false)}
        />
      )}

      <Dialog open={savePrompt} onOpenChange={setSavePrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {locale === "no" ? "Lagre turen i Min Garasje" : "Save this trip to My Garage"}
            </DialogTitle>
            <DialogDescription>
              {locale === "no"
                ? "Opprett en gratis konto for å lagre ruter, egne kjøretøyprofiler (bil, MC, bobil) og låse opp GPX-eksport for offline navigasjon."
                : "Create a free account to save routes, build custom vehicle profiles (car, motorcycle, camper) and unlock offline GPX export."}
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-foreground/80">
            <li>🗺️ {locale === "no" ? "Alle beregnede turer samlet ett sted" : "Every calculated trip in one place"}</li>
            <li>🚐 {locale === "no" ? "Kjøretøyprofiler med tank, høyde og bompengebrikke" : "Vehicle profiles with tank, height and toll tags"}</li>
            <li>📥 {locale === "no" ? "GPX-eksport for offline navigasjon" : "GPX export for offline navigation"}</li>
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setSavePrompt(false);
                openAuth("signup");
              }}
            >
              {locale === "no" ? "Opprett gratis konto" : "Create free account"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSavePrompt(false);
                openAuth("signin");
              }}
            >
              {locale === "no" ? "Logg inn" : "Sign in"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
