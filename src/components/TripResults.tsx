import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Mountain, Printer, Save, Share2, ShieldCheck, Ship, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { renderShareCard } from "@/lib/share-image";
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
import { trackEvent } from "@/lib/analytics";
import { Switch } from "@/components/ui/switch";
import { PartnerOffers } from "@/components/PartnerOffers";

import { PoiLinks } from "@/components/PoiLinks";
import { RouteExportPanel } from "@/components/RouteExportPanel";
import { ExportPaywallModal } from "@/components/ExportPaywallModal";
import { TravelPartyStops } from "@/components/TravelPartyStops";
import { NorwayAutoPassCard, ScandiBridgeCard } from "@/components/ScandiTolls";
import { PassBorderIntel } from "@/components/PassBorderIntel";
import { CorridorMap } from "@/components/CorridorMap";
import { LezMonitor, MotorhomeClearanceRadar, TransponderSelector } from "@/components/ComplianceModules";
import { CurrencyPills } from "@/components/CurrencySelector";
import { PrintItinerary } from "@/components/PrintItinerary";
import {
  convert,
  currencyFromSymbol,
  formatCurrency,
  useMoney,
} from "@/lib/currency";
import { useLocale, useT, useTr } from "@/lib/i18n";
import { LocaleLink } from "@/components/LocaleLink";
import { prefixForCode } from "@/lib/locales";
import { tripPassPrice } from "@/lib/pricing-i18n";
import { PURCHASES_ENABLED } from "@/lib/purchases";
import { useSubscription } from "@/hooks/useSubscription";
import { filterByCorridor } from "@/lib/corridor-filter";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { RouteStopCard } from "@/components/RouteStopCard";
import { BorderAdvisories } from "@/components/BorderAdvisories";
import type { CorridorStop } from "@/lib/corridor-map";
import { corridorStopsAlongCorridor } from "@/lib/corridor-map";
import { getPlaceReviews, type PlaceReview } from "@/lib/place-reviews.functions";
import { getLiveCorridorPois } from "@/lib/poi.functions";
import { POI_GROUPS, POI_INTERESTS, poiLabel, type PoiInterestId } from "@/lib/poi-interests";
import {
  ROUTE_VARIANTS,
  applyNetworkFilter,
  ENGLISH_ONLY_POI_IDS,
  type EvChargingPoi,
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
  // "Print itinerary" anywhere on the page must open the dossier first —
  // printing the live page directly produced a blank sheet.
  useEffect(() => {
    const open = () => setPrinting(true);
    window.addEventListener("autovere:print", open);
    return () => window.removeEventListener("autovere:print", open);
  }, []);
  const [rvMode, setRvMode] = useState(isMotorhome);
  const [savePrompt, setSavePrompt] = useState(false);
  /** Operator picked interactively from the charging network pills. */
  const [netFilter, setNetFilter] = useState<string | null>(null);
  const { user, openAuth } = useAuth();
  const { hasAtLeast, isActive } = useSubscription();
  // Exports stay visible for everyone but open the Trip Pass paywall until
  // the visitor holds Trip Pass, Pro or Fleet access.
  const [exportPaywallOpen, setExportPaywallOpen] = useState(false);
  const [stopsPaywallOpen, setStopsPaywallOpen] = useState(false);
  const exportsLocked = !user || !(isActive && hasAtLeast("tripPass"));
  const stopsLocked = exportsLocked;
  const passPrice = tripPassPrice(locale, region);
  const challengeHref = locale === "en" ? "/challenge" : `/challenge/${prefixForCode(locale) ?? locale}`;
  const trip = trips[active];
  const optimizer = useMemo(
    () => applyNetworkFilter(trip.optimizer, netFilter ?? trip.optimizer.preferredNetwork ?? null),
    [trip.optimizer, netFilter],
  );
  // Everything "along the route" is filtered against the real polyline.
  const corridorCoords = trip.corridor?.coords;

  // Curated pan-European POIs (src/data/curated_pois_eu.json), lazily
  // loaded — same rationale as the EV charger/fuel station datasets.
  const curatedPoisQuery = useQuery({
    queryKey: ["curated-pois-eu"],
    queryFn: async () => (await import("@/data/curated_pois_eu.json")).default as CorridorStop[],
    staleTime: Number.POSITIVE_INFINITY,
    retry: 0,
  });
  const curatedPois = curatedPoisQuery.data ?? [];
  const [appliedStops, setAppliedStops] = useState<CorridorStop[]>([]);
  const [stopReviews, setStopReviews] = useState<Record<string, PlaceReview>>({});
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const fetchLivePois = useServerFn(getLiveCorridorPois);

  // Trip Pass/Pro/Fleet only — free visitors keep hitting the paywall.
  // Google Places is called on-demand for the visible candidates only
  // (capped below), never for the whole curated dataset.
  const handleApplyStops = async (selected: PoiInterestId[]) => {
    if (stopsLocked) {
      setStopsPaywallOpen(true);
      return;
    }
    const curated = corridorStopsAlongCorridor(curatedPois, corridorCoords, selected);
    let live: CorridorStop[] = [];
    if (corridorCoords?.length) {
      const step = Math.max(1, Math.floor(corridorCoords.length / 8));
      const samples = corridorCoords.filter((_, index) => index % step === 0).slice(0, 10);
      try {
        const result = await fetchLivePois({ data: { coords: samples, categories: selected } });
        live = corridorStopsAlongCorridor(result.stops, corridorCoords, selected);
      } catch {
        // Curated coverage remains available if the live source is temporarily unavailable.
      }
    }
    const merged = [...curated, ...live].filter((stop, index, all) => all.findIndex((candidate) => candidate.id === stop.id || (Math.abs(candidate.lat - stop.lat) < 0.0003 && Math.abs(candidate.lon - stop.lon) < 0.0003)) === index);
    const visible = merged.slice(0, 8);
    setAppliedStops(visible);
    setStopReviews({});
    if (!visible.length) return;
    setReviewsLoading(true);
    try {
      const reviews = await getPlaceReviews({
        data: { candidates: visible.map((s) => ({ id: s.id, name: s.name, lat: s.lat, lng: s.lon })) },
      });
      setStopReviews(Object.fromEntries(reviews.map((r) => [r.poiId, r])));
    } catch {
      // Never block the stop list on a review-fetch failure.
    } finally {
      setReviewsLoading(false);
    }
  };
  const showEnglishOnlyPois = locale === "en" || locale === "us";
  const isVisiblePoi = (id: string) => showEnglishOnlyPois || !ENGLISH_ONLY_POI_IDS.has(id);
  const highlights = filterByCorridor(SCENIC_HIGHLIGHTS[region], corridorCoords, 25).filter((p) => isVisiblePoi(p.id));
  const rvPois = filterByCorridor(RV_POIS[region], corridorCoords, 25).filter((p) => isVisiblePoi(p.id));
  // The charger dataset is ~13 MB, so it is only fetched for EV trips.
  const wantEvPois = showEnglishOnlyPois && fuel === "electric";
  const [evPoiData, setEvPoiData] = useState<Record<RegionKey, EvChargingPoi[]> | null>(null);
  useEffect(() => {
    if (!wantEvPois || evPoiData) return;
    let alive = true;
    void import("@/lib/ev-charging-pois").then((mod) => {
      if (alive) setEvPoiData(mod.EV_CHARGING_POIS);
    });
    return () => {
      alive = false;
    };
  }, [wantEvPois, evPoiData]);
  const evChargingPois = wantEvPois && evPoiData ? filterByCorridor(evPoiData[region], corridorCoords, 30) : [];
  const m = useMoney(trip.currency);
  const [people, setPeople] = useState(1);
  const [actualTolls, setActualTolls] = useState("");
  const [actualSent, setActualSent] = useState(false);
  const crossingCount = trip.corridor ? Math.max(trip.corridor.countries.length - 1, 0) : 0;
  const distUnit = trip.units === "imperial" ? "mi" : "km";
  const distValue = trip.units === "imperial" ? trip.distanceKm * 0.621371 : trip.distanceKm;
  const perUnit = distValue > 0 ? `${m.fmt(trip.budget / distValue, 2)}/${distUnit}` : "";
  // Honest spread: fuel prices move a few percent, and an AutoPASS tag takes about 20% off Norwegian gantries.
  const tollLow = trip.gantryPriced ? 0.8 : 0.9;
  const tollHigh = trip.gantryPriced ? 1 : 1.1;
  const budgetLow = trip.ferries + trip.tolls * tollLow + trip.energyCost * 0.93;
  const budgetHigh = trip.ferries + trip.tolls * tollHigh + trip.energyCost * 1.07;
  const budgetHint = `${t.flow.typical} ${m.fmt(budgetLow, 0)}–${m.fmt(budgetHigh, 0)} · ${perUnit}`;
  const tollsCheckedOn = trip.tollsAsOf
    ? new Date(trip.tollsAsOf).toLocaleDateString(locale === "no" ? "nb-NO" : "en-GB", { day: "numeric", month: "short", year: "numeric" })
    : null;
  // Trips over ~6 h of driving get an even split into days, each ending near a real point on the route.
  const dayStops = (() => {
    const coords = trip.corridor?.coords ?? [];
    const points = trip.corridor?.points ?? [];
    if (trip.driveHours <= 6 || coords.length < 2 || points.length === 0) return [];
    const days = Math.ceil(trip.driveHours / 5.5);
    const near = (p: [number, number]) =>
      points.reduce((best, q) => {
        const d = (q.lat - p[0]) ** 2 + (q.lon - p[1]) ** 2;
        return d < best.d ? { d, name: q.name } : best;
      }, { d: Infinity, name: "" }).name;
    return Array.from({ length: days }, (_, i) => {
      const end = coords[Math.min(coords.length - 1, Math.round(((i + 1) / days) * (coords.length - 1)))]!;
      return { n: i + 1, hours: (trip.driveHours / days).toFixed(1), place: i + 1 === days ? destination : near(end) };
    });
  })();
  const perPerson = people > 1 ? t.flow.perPerson(m.fmt(trip.budget / people, 0)) : null;
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
    void trackEvent("save_trip_clicked", { signedIn: Boolean(user), countries: trip.segments.length });
    if (!user) {
      setSavePrompt(true);
      return;
    }
    persistTrip();
  };




  const shareText = `${title} — ${trip.distanceLabel}, ${trip.driveTime}, ${m.fmt(trip.budget, 0)}${perPerson ? ` (${perPerson})` : ""} · AutoVere`;
  const shareVia = (channel: "whatsapp" | "sms") => {
    void trackEvent("share_trip_clicked", { channel, split: people > 1 });
    const body = encodeURIComponent(`${shareText}
${window.location.href}`);
    window.open(channel === "whatsapp" ? `https://wa.me/?text=${body}` : `sms:?&body=${body}`, "_blank", "noopener");
  };

  const shareTrip = async () => {
    const text = shareText;
    try {
      if (navigator.share) {
        // Phones: attach a picture with this trip's own price, so the chat message advertises the number.
        const image = await renderShareCard({
          title,
          total: m.fmt(trip.budget, 0),
          detail: `${trip.distanceLabel} · ${trip.driveTime}`,
          perPerson,
        });
        const files = image ? [new File([image], "autovere-trip.jpg", { type: "image/jpeg" })] : [];
        const withFile = files.length > 0 && navigator.canShare?.({ files });
        await navigator.share({
          title: `${title} · AutoVere`,
          text,
          url: window.location.href,
          ...(withFile ? { files } : {}),
        });
      } else {
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
          {isMotorhome
            ? `🚐 ${t.hero.vehicles.motorhome}`
            : isMotorcycle
              ? `🏍️ ${t.hero.vehicles.motorcycle}`
              : `🚗 ${t.hero.vehicles.car}`}
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
                  {m.fmt(variantTrip.tolls)} {t.results.tollsShort} · {variantTrip.driveTime} · {variantTrip.distanceLabel}
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



      <details className="glass-panel mt-6 rounded-2xl px-5 py-3">
        <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {t.results.displayCurrency} · {m.display}
        </summary>
        <p className="mt-3 text-xs text-foreground/70">
          {m.rateNote() || t.results.baseCurrencyNote} · {tr(m.ratesNote)}
        </p>
        <div className="mt-3">
          <CurrencyPills />
        </div>
      </details>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        <div className="col-span-2 lg:col-span-1">
          <MetricCard accent label={t.results.budget} value={m.fmt(trip.budget, 0)} hint={budgetHint} />
        </div>
        <MetricCard label={t.results.distance} value={trip.distanceLabel} hint={t.results.distanceHint} />
        <MetricCard label={t.results.driveTime} value={trip.driveTime} hint={t.results.driveTimeHint} />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-foreground/80">
        <span>👥 {t.flow.splitLabel}</span>
        <span className="inline-flex items-center rounded-full border border-border bg-background/50">
          <button
            type="button"
            onClick={() => setPeople((n) => Math.max(1, n - 1))}
            aria-label="−"
            className="px-3 py-1 hover:text-foreground disabled:opacity-40"
            disabled={people <= 1}
          >
            −
          </button>
          <span className="min-w-6 text-center font-semibold" aria-live="polite">
            {people}
          </span>
          <button
            type="button"
            onClick={() => setPeople((n) => Math.min(9, n + 1))}
            aria-label="+"
            className="px-3 py-1 hover:text-foreground"
          >
            +
          </button>
        </span>
        {perPerson && <span className="font-semibold text-primary">{perPerson}</span>}
      </div>

      {/* One trust line — the source and date behind the toll figures. */}
      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 text-xs font-medium text-muted-foreground">
        <ShieldCheck className="size-3.5 text-primary" />
        {t.flow.trustOfficial}
        {tollsCheckedOn ? ` · ${t.flow.trustChecked} ${tollsCheckedOn}` : ""}
      </p>
      {trip.gantryPriced && trip.ferries > 0 && (
        <p className="mt-2 text-center text-xs text-foreground/75">
          ⛴️ {t.flow.ferrySave(m.fmt(trip.ferries * 0.5, 0))}{" "}
          <a
            href="https://www.autopassferje.no"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            {t.flow.ferrySaveCta}
          </a>
        </p>
      )}

      {/* Instant clarity trio — the three answers every driver wants first. */}
      <div
        data-tour="results"
        className={`mt-6 grid grid-cols-2 gap-3 sm:gap-4 ${crossingCount > 0 ? "sm:grid-cols-3" : ""}`}
      >
        <div className="glass-panel rounded-2xl p-4 text-center sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">
            🛣️ {t.results.tollsBadge}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-primary sm:mt-3 sm:text-5xl lg:text-6xl">
            {m.fmt(trip.tolls, 0)}
          </p>
          <p className="mt-1 text-xs text-foreground/70 sm:mt-2 sm:text-sm">{t.results.tollsShort}</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 text-center sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">
            ⛽ {tr(trip.energyLabel)}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight sm:mt-3 sm:text-5xl lg:text-6xl">
            {m.fmt(trip.energyCost, 0)}
          </p>
          <p className="mt-1 text-xs text-foreground/70 sm:mt-2 sm:text-sm">{t.results.energyHint(trip.energyAmount)}</p>
        </div>
        {crossingCount > 0 && (
          <div className="glass-panel col-span-2 rounded-2xl p-4 text-center sm:col-span-1 sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.18em]">
              {t.intel.crossTitle}
            </p>
            <p className="mt-2 text-3xl font-semibold tracking-tight sm:mt-3 sm:text-5xl lg:text-6xl">{crossingCount}</p>
            <p className="mt-1 text-xs text-foreground/70 sm:mt-2 sm:text-sm">
              {trip.corridor?.countries.map((c) => tr(`${c.flag} ${c.country}`)).join(" · ")}
            </p>
          </div>
        )}
      </div>

      {/* Conversion moment: the visitor has just seen the number they came for. */}
      {exportsLocked && PURCHASES_ENABLED && (
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{t.flow.tripPassEyebrow}</p>
            <h3 className="mt-1 text-lg font-semibold tracking-tight">{t.flow.tripPassTitle}</h3>
            <p className="mt-1 text-sm text-foreground/75">{t.flow.tripPassBody}</p>
          </div>
          <div className="flex shrink-0 flex-col items-stretch gap-1.5 sm:items-end">
            <Button
              size="lg"
              className="font-semibold"
              onClick={() => {
                void trackEvent("trip_pass_cta_clicked", { region, signedIn: Boolean(user) });
                setExportPaywallOpen(true);
              }}
            >
              <Sparkles className="size-4" /> {t.flow.tripPassCta(passPrice)}
            </Button>
            <span className="text-center text-xs text-muted-foreground sm:text-right">{t.flow.tripPassNote}</span>
          </div>
        </div>
      )}

      {/* Calm, price-free nudge after the result; sits above the "next step" links. */}
      {exportsLocked && (
        <div className="glass-panel mt-4 flex flex-col gap-3 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground/75">
            {tr("Want the full breakdown and offline kit for this trip?")}
          </p>
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <LocaleLink to="/pricing">{tr("See Trip Pass & Pro")}</LocaleLink>
          </Button>
        </div>
      )}

      {/* Price basis — every number above traces back to a named open source. */}
      {trip.priceBasis && trip.priceBasis.countries.length > 0 && (
        <details className="glass-panel mt-4 rounded-2xl px-5 py-4 text-sm">
          <summary className="cursor-pointer select-none font-semibold text-foreground">
            🧾 {tr("Price basis")} ·{" "}
            <span className="font-normal text-foreground/75">
              {trip.priceBasis.consumptionLabel}
              {trip.priceBasis.consumptionFromDriver ? ` (${tr("your setting")})` : ` (${tr("class average")})`} ·{" "}
              {m.fmt(trip.priceBasis.perUnit, 2)}/{trip.priceBasis.unit} {tr("weighted along the route")}
            </span>
          </summary>
          <ul className="mt-3 space-y-2">
            {trip.priceBasis.countries.map((c) => (
              <li key={c.code} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-border/40 pt-2 first:border-t-0 first:pt-0">
                <span className="font-medium">
                  {c.flag} {c.country}
                  <span className="ml-2 text-xs text-muted-foreground">{c.distanceKm.toLocaleString("en-GB")} km</span>
                </span>
                <span className="text-right">
                  <span className="font-semibold">
                    {m.fmt(trip.priceBasis!.unit === "gal" ? c.price * 3.78541 : c.price, 2)}/{trip.priceBasis!.unit}
                  </span>
                  {c.local && <span className="ml-2 text-xs text-foreground/70">≈ {c.local}</span>}
                  <span className="block text-xs text-muted-foreground">
                    {c.sourceUrl ? (
                      <a href={c.sourceUrl} target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">
                        {tr(c.source)}
                      </a>
                    ) : (
                      tr(c.source)
                    )}{" "}
                    · {c.asOf} ·{" "}
                    <span className={c.live ? "text-primary" : ""}>{c.live ? tr("live") : tr("reference level")}</span>
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            {trip.gantryPriced
              ? `${tr("Norwegian tolls are priced gantry by gantry from Statens vegvesen's national register (standard rate, before AutoPASS tag discount).")} `
              : ""}
            {trip.priceBasis.fxNote ? `${tr(trip.priceBasis.fxNote)}. ` : ""}
            {tr("Total = tolls + ferries + energy. No hidden running-cost allowance.")}
          </p>
        </details>
      )}

      {evChargingPois.length > 0 && (
        <div className="glass-panel mt-6 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <h3 className="text-lg font-semibold tracking-tight">EV charging hubs along this route</h3>
          </div>
          <p className="mt-1 text-sm text-foreground/70">
            Reliable high-power stops near your corridor, so the charging part of the day feels calm and easy.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {evChargingPois.map((p) => (
              <article key={p.id} className="rounded-2xl border border-border bg-background/40 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{p.network}</p>
                <p className="mt-2 text-sm font-semibold">{p.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.where}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80">
                    {p.connectors}
                  </span>
                  <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80">
                    {p.power}
                  </span>
                  <span className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80">
                    {p.access}
                  </span>
                  {p.price && (
                    <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                      {p.price}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-sm text-foreground/80">{p.note}</p>
                <PoiLinks kind="ev" name={p.name} where={p.where} region={region} website={p.website} />
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
        <Button size="lg" variant="outline" onClick={() => shareVia("whatsapp")}>
          WhatsApp
        </Button>
        <Button size="lg" variant="outline" onClick={() => setPrinting(true)}>
          <Printer className="size-4" /> {tr("Export to PDF / Print itinerary")}
        </Button>
      </div>

      {dayStops.length > 1 && (
        <details className="glass-panel mt-4 rounded-2xl px-5 py-4 text-sm">
          <summary className="cursor-pointer select-none font-medium text-foreground/80">🛏️ {t.flow.dayTitle}</summary>
          <ul className="mt-3 space-y-1 text-foreground/80">
            {dayStops.map((d) => (
              <li key={d.n}>{t.flow.dayLine(d.n, d.hours, d.place)}</li>
            ))}
          </ul>
        </details>
      )}

      <details className="glass-panel mt-4 rounded-2xl px-5 py-4 text-sm">
        <summary className="cursor-pointer select-none font-medium text-foreground/80">🧾 {t.flow.actualTitle}</summary>
        {actualSent ? (
          <p className="mt-3 text-primary">{t.flow.actualThanks}</p>
        ) : (
          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const actual = Number(actualTolls.replace(",", "."));
              if (!Number.isFinite(actual) || actual < 0) return;
              void trackEvent("actual_cost_submitted", {
                route: title,
                actualTolls: actual,
                estimatedTolls: Math.round(trip.tolls),
                currency: trip.currency,
                gantryPriced: Boolean(trip.gantryPriced),
              });
              setActualSent(true);
            }}
          >
            <input
              inputMode="decimal"
              value={actualTolls}
              onChange={(e) => setActualTolls(e.target.value)}
              aria-label={t.flow.actualTitle}
              className="w-28 rounded-lg border border-border bg-background/60 px-3 py-2"
            />
            <span className="text-muted-foreground">{trip.currency}</span>
            <Button type="submit" size="sm" variant="secondary">
              {t.flow.actualCta}
            </Button>
          </form>
        )}
      </details>

      <RouteExportPanel
        trip={trip}
        origin={origin}
        destination={destination}
        locked={exportsLocked}
        onLockedAction={() => setExportPaywallOpen(true)}
      />
      <ExportPaywallModal open={exportPaywallOpen} onOpenChange={setExportPaywallOpen} />
      <ExportPaywallModal
        open={stopsPaywallOpen}
        onOpenChange={setStopsPaywallOpen}
        title={tr("Unlock Tailored Route Stops with Trip Pass")}
        description={tr(
          "Automatically inject curated family stops, scenic viewpoints, and local food recommendations matching your vehicle along your specific route corridor.",
        )}
        primaryLabel={t.flow.tripPassCta(passPrice)}
      />

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
                    <span className="font-medium">
                      {tr(segment.country)}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {trip.gantryPriced && segment.country.startsWith("🇳🇴") ? t.flow.verified : t.flow.estimated}
                      </span>
                    </span>
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
                          <span className="block text-sm font-medium">{tr(line.place)}</span>
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

      <TravelPartyStops onApply={handleApplyStops} />

      {appliedStops.length > 0 && (
        <div className="mt-6 grid gap-5">
          {POI_GROUPS.map((group) => {
            const items = appliedStops.filter(
              (s) => POI_INTERESTS.find((i) => i.id === s.category)?.group === group,
            );
            if (!items.length) return null;
            return (
              <div key={group}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {poiLabel(locale, group)}
                </p>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {items.map((stop) => (
                    <RouteStopCard
                      key={stop.id}
                      stop={stop}
                      region={region}
                      review={stopReviews[stop.id] ?? null}
                      reviewLoading={reviewsLoading && !stopReviews[stop.id]}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

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

      <BorderAdvisories countryCodes={trip.corridor?.countries.map((c) => c.code) ?? []} />


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
              <PoiLinks kind="pass" name={h.name} where={h.where} region={region} website={h.website} />
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
                  <PoiLinks kind="camp" name={p.name} where={p.where} region={region} website={p.website} />
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

      <div className="glass-panel mt-10 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">🏁 {t.flow.challengeTitle}</h3>
          <p className="mt-1 text-sm text-foreground/75">{t.flow.challengeBody}</p>
        </div>
        <Button variant="outline" asChild className="shrink-0">
          <a
            href={challengeHref}
            onClick={() => void trackEvent("challenge_cta_clicked", { region, origin, destination })}
          >
            {t.flow.challengeCta}
          </a>
        </Button>
      </div>

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
            <DialogTitle>{t.flow.saveTitle}</DialogTitle>
            <DialogDescription>{t.flow.saveBody}</DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-foreground/80">
            {t.flow.saveList.map((item, i) => (
              <li key={item}>
                {["🗺️", "🚐", "📥"][i]} {item}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setSavePrompt(false);
                openAuth("signup");
              }}
            >
              {t.flow.createAccount}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSavePrompt(false);
                openAuth("signin");
              }}
            >
              {t.header.signIn}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
