import { createFileRoute } from "@tanstack/react-router";
import { AppLink as Link } from "@/components/AppLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Map as MapIcon, Navigation, Gauge, WifiOff, ShieldCheck, Check, ChevronDown, Sparkles, Zap, Tent, Coins } from "lucide-react";
import { TripForm, type DemoRoute, type TripFormState } from "@/components/TripForm";
import { ContactModal } from "@/components/ContactModal";
import { ShareModal } from "@/components/ShareModal";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { RouteMap } from "@/components/RouteMap";
import { SmartFuelCharging, SmartFuelChargingUpgrade } from "@/components/SmartFuelCharging";
import { MotorhomeCamping, MotorhomeCampingUpgrade } from "@/components/MotorhomeCamping";
import { Breakdown, EvSavingsCard, RouteCard, TradeoffBanner } from "@/components/Comparison";
import { VignetteChecklist } from "@/components/VignetteChecklist";
import { SafetyRegulations } from "@/components/SafetyRegulations";
import { NavigationSheet } from "@/components/NavigationSheet";
import { ScenicHighlights, type ScenicFilter } from "@/components/ScenicHighlights";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { countryLegs, DEFAULT_TRIP, detectBorders, estimate, type Estimate } from "@/lib/calc";
import { fetchNorwayStationCandidates, type NorwayStationCandidate } from "@/lib/tolls/providers/norway";
import { fetchFastChargers, fetchMotorhomeCamping, fetchMultiStopRoute, fetchScenicHighlights, fetchSmartFuelAndCharging, MOTORHOME_CATEGORIES, type Charger, type FuelStation, type MotorhomeCategory, type MotorhomePoi, type Place, type RouteResult, type RouteVariantKey, type ScenicHighlight, type SmartCharger } from "@/lib/geo";
import {
  appleMapsUrl,
  buildGpx,
  buildKml,
  googleMapsUrl,
  routeWaypoints,
  shapingWaypoints,
  wazeUrl,
} from "@/lib/export";
import { loginLabels, useLocale, useT } from "@/lib/i18n";
import { CURRENCIES, formatCurrency, type CurrencyCode } from "@/lib/currency";
import { exchangeRatesNote } from "@/lib/currency-i18n";
import { useCurrency } from "@/hooks/use-currency";
import { marketingCopy } from "@/lib/marketing-i18n";
import { partnerCopy } from "@/lib/partner-i18n";
import { getAccountCopy } from "@/lib/account-i18n";
import { chargerCopy } from "@/lib/charger-i18n";
import { smartFuelCopy } from "@/lib/smart-fuel-i18n";
import { motorhomeCopy } from "@/lib/motorhome-i18n";
import { openPrintReport } from "@/lib/print-report";
import { legalCopy as LEGAL_MODAL_COPY } from "@/lib/legal-i18n";

export const Route = createFileRoute("/{-$lang}/")({
  // No head() override here: the {-$lang} layout route already provides fully localized
  // title/description/og/twitter tags per language via seoCopy (see src/lib/seo.ts). A static
  // English-only override here would win over the layout's per-language copy for every visitor,
  // regardless of URL language — which is exactly the bug this route previously had.
  component: Index,
});

const COLORS: Record<RouteVariantKey, string> = {
  fastest: "#7aa2f7",
  bypass: "#7fe7d6",
  tollfree: "#ffd166",
};

const VARIANTS: RouteVariantKey[] = ["fastest", "bypass", "tollfree"];

function currencyDisplayName(code: CurrencyCode, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "currency" }).of(code) ?? code;
  } catch {
    return code;
  }
}

const SHARE_TEXT_SUFFIX = {
  en: "Open in navigation:",
  de: "In der Navigation öffnen:",
  nl: "Openen in navigatie:",
  no: "Åpne i navigasjon:",
  pl: "Otwórz w nawigacji:",
  sv: "Öppna i navigering:",
  fr: "Ouvrir dans la navigation :",
  da: "Åbn i navigation:",
} as const;

const WAYPOINT_NOTE_COPY = {
  en: "Waypoints are injected so navigation apps follow the bypass and charging stops exactly.",
  de: "Wegpunkte werden eingefügt, damit Navigations-Apps die Umgehungsroute und Ladestopps exakt befolgen.",
  nl: "Waypoints worden toegevoegd zodat navigatie-apps de omleiding en laadstops precies volgen.",
  no: "Veipunkter legges inn slik at navigasjonsapper følger omkjøringen og ladestoppene nøyaktig.",
  pl: "Punkty pośrednie są dodawane, aby aplikacje nawigacyjne dokładnie podążały objazdem i przystankami ładowania.",
  sv: "Waypoints läggs till så att navigeringsappar följer omvägen och laddstoppen exakt.",
  fr: "Des points de passage sont ajoutés pour que les applications de navigation suivent exactement l'itinéraire de contournement et les arrêts de recharge.",
  da: "Waypoints indsættes, så navigationsapps følger omkørslen og ladestoppene præcist.",
} as const;

function Index() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const marketing = marketingCopy[locale] ?? marketingCopy.en;
  const partnerNav = partnerCopy[locale] ?? partnerCopy.en;
  const accountCopy = getAccountCopy(locale);
  const legalCopy = LEGAL_MODAL_COPY[locale as keyof typeof LEGAL_MODAL_COPY] ?? LEGAL_MODAL_COPY.no;
  const [form, setForm] = useState<TripFormState>({
    from: null,
    stops: [],
    to: null,
    vehicle: "petrol",
    fuelType: "ICE",
    autoPass: false,
    evRangeKm: 450,
    days: 10,
    durationMode: "preset",
  });
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Partial<Record<RouteVariantKey, RouteResult>>>({});
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [evComparisonEstimates, setEvComparisonEstimates] = useState<Estimate[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [scenicHighlights, setScenicHighlights] = useState<ScenicHighlight[]>([]);
  const [selectedScenicIds, setSelectedScenicIds] = useState<string[]>([]);
  const [scenicFilter, setScenicFilter] = useState<ScenicFilter>("all");
  const [selected, setSelected] = useState<RouteVariantKey>("bypass");
  const [submitted, setSubmitted] = useState<TripFormState | null>(null);
  const { currency, setCurrency, ratesMeta } = useCurrency(locale);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [savingTrip, setSavingTrip] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const [proTier, setProTier] = useState<"pro" | "business" | null>(null);
  const [smartMaxKm, setSmartMaxKm] = useState(25);
  const [smartLoading, setSmartLoading] = useState(false);
  const [smartChargers, setSmartChargers] = useState<SmartCharger[]>([]);
  const [smartFuelStations, setSmartFuelStations] = useState<FuelStation[]>([]);
  const [motorhomeMaxKm, setMotorhomeMaxKm] = useState(25);
  const [motorhomeLoading, setMotorhomeLoading] = useState(false);
  const [motorhomePois, setMotorhomePois] = useState<MotorhomePoi[]>([]);
  const [motorhomeCategories, setMotorhomeCategories] = useState<Set<MotorhomeCategory>>(new Set(MOTORHOME_CATEGORIES));

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account")
      .then(async (response) => {
        if (!response.ok || cancelled) return;
        const body = (await response.json()) as { subscription?: { tier?: "pro" | "business" | null } | null };
        const tier = body.subscription?.tier ?? null;
        if (!cancelled && (tier === "pro" || tier === "business")) setProTier(tier);
      })
      .catch(() => {
        /* not logged in, or account status unavailable — header simply shows the normal sign-in link */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const proTierName = proTier === "business" ? marketingCopy[locale]?.plans[2]?.name : marketingCopy[locale]?.plans[1]?.name;

  const run = useCallback(async (input = form) => {
    const { from, to } = input;
    if (!from || !to) return;
    const points = [from, ...input.stops.filter((stop): stop is NonNullable<typeof stop> => !!stop), to];
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        VARIANTS.map((v) => fetchMultiStopRoute(points, v)),
      );
      const map: Partial<Record<RouteVariantKey, RouteResult>> = {};
      VARIANTS.forEach((v, i) => {
        const r = results[i];
        if (r?.status === "fulfilled") map[v] = r.value;
      });
      if (!map.fastest) throw new Error("No drivable route between these places.");

      let found: Charger[] = [];
      try {
        found = await fetchFastChargers(map.fastest.coords);
      } catch {
        if (input.vehicle === "ev") toast.warning(t.chargingUnavailable);
      }
      setChargers(found);
      const scenic = await fetchScenicHighlights(map.fastest.coords, found);
      setScenicHighlights(scenic);
      setSelectedScenicIds([]);
      setScenicFilter("all");

      // Real NVDB toll-station data only exists for Norway. One fetch (union bbox of every
      // route variant) is reused to match all three variants client-side — see
      // src/lib/tolls/providers/norway.ts. A failed/skipped fetch leaves this null, which makes
      // calc.ts fall back to an honestly-labelled estimate instead of a silent wrong number.
      let norwayStations: NorwayStationCandidate[] | null = null;
      const touchesNorway = Object.values(map).some((r) => r && countryLegs(r.coords).some((leg) => leg.code === "NO"));
      if (touchesNorway) {
        try {
          const unionCoords = Object.values(map).flatMap((r) => r?.coords ?? []);
          norwayStations = await fetchNorwayStationCandidates(unionCoords);
        } catch {
          norwayStations = null;
        }
      }

      const trip = {
        ...DEFAULT_TRIP,
        vehicle: input.vehicle,
        fuelType: input.fuelType,
        autoPass: input.autoPass,
        days: input.days,
        evRangeKm: input.evRangeKm,
      };
      const next = VARIANTS.filter((v) => map[v]).map((v) => estimate(v, map[v]!, trip, found, norwayStations));
      const comparisonTrip = { ...trip, vehicle: input.vehicle === "ev" ? "petrol" as const : "ev" as const, fuelType: input.vehicle === "ev" ? "ICE" as const : "EV" as const };
      const comparison = VARIANTS.filter((v) => map[v]).map((v) => estimate(v, map[v]!, comparisonTrip, found, norwayStations));
      setRoutes(map);
      setEstimates(next);
      setEvComparisonEstimates(comparison);
      setSubmitted(input);
      const cheapest = next.reduce((a, b) => (a.total <= b.total ? a : b));
      setSelected(cheapest.key);
      toast.success(t.routeCompared(next.length, t[cheapest.key]));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t.calculationFailed);
    } finally {
      setLoading(false);
    }
  }, [form]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("autovere-reopen-trip");
      if (!raw) return;
      sessionStorage.removeItem("autovere-reopen-trip");
      const trip = JSON.parse(raw) as { estimate?: { form?: TripFormState }; autoRun?: boolean };
      const savedForm = trip.estimate?.form;
      if (savedForm && savedForm.from && savedForm.to) {
        setForm(savedForm);
        // A saved trip's stored totals are a snapshot from when it was saved — repeating it
        // always recalculates against current data rather than reusing old prices.
        if (trip.autoRun !== false) void run(savedForm);
      }
    } catch {
      /* no reopened trip, or storage unavailable */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function saveTrip() {
    if (!submitted || !selectedEst) return;
    setSavingTrip(true);
    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${submitted.from?.name ?? "?"} → ${submitted.to?.name ?? "?"}`,
          fromPlace: submitted.from?.label ?? submitted.from?.name ?? null,
          toPlace: submitted.to?.label ?? submitted.to?.name ?? null,
          vehicleType: submitted.vehicle,
          currency,
          days: submitted.days,
          estimate: {
            form: submitted,
            summary: {
              [t.distance]: `${Math.round(selectedEst.distanceKm)} km`,
              [t.total]: formatCurrency(selectedEst.total, currency, locale),
              [t.tolls]: formatCurrency(selectedEst.tollCost, currency, locale),
              [t.vignettes]: formatCurrency(selectedEst.vignetteCost, currency, locale),
              [t.fuel]: formatCurrency(selectedEst.energyCost, currency, locale),
            },
          },
        }),
      });
      if (response.status === 401) {
        toast.error(t.signInToSave);
        return;
      }
      if (!response.ok) throw new Error("Save failed");
      toast.success(t.tripSaved);
    } catch {
      toast.error(t.tripSaveFailed);
    } finally {
      setSavingTrip(false);
    }
  }

  function printCurrentTrip() {
    if (!submitted || !selectedEst) return;
    openPrintReport({
      title: `${submitted.from?.name ?? "?"} → ${submitted.to?.name ?? "?"}`,
      subtitle: selectedEst.title,
      generatedAtLabel: new Intl.DateTimeFormat(locale, { dateStyle: "long", timeStyle: "short" }).format(new Date()),
      sections: [
        {
          heading: t.comparison,
          rows: [
            { label: t.distance, value: `${Math.round(selectedEst.distanceKm)} km` },
            { label: t.driveTime, value: t.duration(selectedEst.durationMin) },
            { label: t.vehicle, value: submitted.vehicle === "ev" ? t.ev : submitted.vehicle === "diesel" ? t.diesel : t.petrol },
            { label: t.tripDuration, value: `${submitted.days} ${submitted.days === 1 ? t.day : t.days}` },
          ],
        },
        {
          heading: t.total,
          rows: [
            { label: t.fuel, value: formatCurrency(selectedEst.energyCost, currency, locale) },
            { label: t.tolls, value: formatCurrency(selectedEst.tollCost, currency, locale) },
            { label: t.vignettes, value: formatCurrency(selectedEst.vignetteCost, currency, locale) },
            { label: t.total, value: formatCurrency(selectedEst.total, currency, locale) },
          ],
        },
        ...(evStops.length > 0
          ? [
              {
                heading: t.chargingStops,
                rows: evStops.map((stop, index) => ({ label: `${t.chargingStops} ${index + 1}`, value: stop.name ?? "—" })),
              },
            ]
          : []),
      ],
      disclaimer: t.footerDisclaimer,
    });
  }

  function runDemo(demo: DemoRoute) {
    const places = {
      "oslo-garda": { from: { id: "demo-oslo", name: "Oslo", label: "Oslo, Norway", lat: 59.9139, lon: 10.7522, country: "NO" }, to: { id: "demo-garda", name: "Lake Garda", label: "Lake Garda, Italy", lat: 45.604, lon: 10.654, country: "IT" } },
      "munich-split": { from: { id: "demo-munich", name: "Munich", label: "Munich, Germany", lat: 48.1351, lon: 11.582, country: "DE" }, to: { id: "demo-split", name: "Split", label: "Split, Croatia", lat: 43.5081, lon: 16.4402, country: "HR" } },
      "paris-nice": { from: { id: "demo-paris", name: "Paris", label: "Paris, France", lat: 48.8566, lon: 2.3522, country: "FR" }, to: { id: "demo-nice", name: "Nice", label: "Nice, France", lat: 43.7102, lon: 7.262, country: "FR" } },
    }[demo];
    if (!places) {
      toast.error(t.calculationFailed);
      return;
    }
    const next = { ...form, from: places.from, stops: [], to: places.to };
    setForm(next);
    void run(next);
  }

  function showEvDetails() {
    const next = {
      ...form,
      vehicle: "ev" as const,
      fuelType: "EV" as const,
      autoPass: form.from?.country === "NO" ? true : form.autoPass,
    };
    setForm(next);
    void run(next);
  }

  const selectedEst = estimates.find((e) => e.key === selected) ?? estimates[0];
  const comparisonEst = selectedEst
    ? evComparisonEstimates.find((e) => e.key === selectedEst.key)
    : undefined;
  const selectedRoute = selectedEst ? routes[selectedEst.key] : undefined;

  useEffect(() => {
    if (!proTier || !selectedRoute) {
      setSmartChargers([]);
      setSmartFuelStations([]);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    setSmartLoading(true);
    fetchSmartFuelAndCharging(selectedRoute.coords, smartMaxKm, controller.signal)
      .then(({ chargers: nearbyChargers, fuelStations }) => {
        if (cancelled) return;
        setSmartChargers(nearbyChargers);
        setSmartFuelStations(fuelStations);
      })
      .catch(() => {
        if (!cancelled) {
          setSmartChargers([]);
          setSmartFuelStations([]);
        }
      })
      .finally(() => {
        if (!cancelled) setSmartLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [proTier, selectedRoute, smartMaxKm]);

  useEffect(() => {
    if (!proTier || !selectedRoute || motorhomeCategories.size === 0) {
      setMotorhomePois([]);
      return;
    }
    let cancelled = false;
    const controller = new AbortController();
    setMotorhomeLoading(true);
    fetchMotorhomeCamping(selectedRoute.coords, motorhomeMaxKm, [...motorhomeCategories], controller.signal)
      .then((pois) => {
        if (!cancelled) setMotorhomePois(pois);
      })
      .catch(() => {
        if (!cancelled) setMotorhomePois([]);
      })
      .finally(() => {
        if (!cancelled) setMotorhomeLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [proTier, selectedRoute, motorhomeMaxKm, motorhomeCategories]);

  const cheapestKey = estimates.length
    ? estimates.reduce((a, b) => (a.total <= b.total ? a : b)).key
    : null;

  const borders = useMemo(
    () => (selectedRoute ? detectBorders(selectedRoute.coords) : []),
    [selectedRoute],
  );

  const mapRoutes = useMemo(
    () =>
      VARIANTS.filter((v) => routes[v]).map((v) => ({
        key: v,
        coords: routes[v]!.coords,
        color: COLORS[v],
        active: v === selected,
      })),
    [routes, selected],
  );

  const evStops = selectedEst?.ev?.stops ?? [];
  const selectedScenic = scenicHighlights.filter((highlight) => selectedScenicIds.includes(highlight.id));
  const visibleScenic = (scenicFilter === "all" ? scenicHighlights : scenicHighlights.filter((highlight) => highlight.category === scenicFilter)).slice(0, 8);
  const navigationVia = selectedRoute
    ? [
        ...(submitted?.stops.filter((stop): stop is NonNullable<typeof stop> => !!stop).map((stop) => [stop.lat, stop.lon] as [number, number]) ?? []),
        ...(evStops.length
          ? evStops.map((s) => [s.lat, s.lon] as [number, number])
          : shapingWaypoints(selectedRoute.coords, selectedEst?.key === "fastest" ? 2 : 5)),
        ...selectedScenic.map((highlight) => [highlight.lat, highlight.lon] as [number, number]),
      ].slice(0, 20)
    : [];
  const navigationWaypoints = selectedRoute
    ? routeWaypoints(
        selectedRoute.coords,
        evStops,
        borders,
        selectedEst?.vignetteLines.map((line) => line.country).filter((country): country is string => !!country) ?? [],
        selectedScenic.map((highlight) => ({ lat: highlight.lat, lon: highlight.lon, name: highlight.name })),
      )
    : [];
  const routeName = submitted?.from && submitted.to && selectedEst
    ? `AutoVere — ${submitted.from.name} → ${submitted.to.name} (${selectedEst.title})`
    : "AutoVere route";
  const googleUrl = submitted?.from && submitted.to
    ? googleMapsUrl(submitted.from, submitted.to, navigationVia)
    : "https://www.google.com/maps";
  const appleUrl = submitted?.from && submitted.to
    ? appleMapsUrl(submitted.from, submitted.to, navigationVia)
    : "https://maps.apple.com";
  const wazeLink = submitted?.to ? wazeUrl([submitted.to.lat, submitted.to.lon]) : "https://www.waze.com";
  const gpx = selectedRoute ? buildGpx({ name: routeName, coords: selectedRoute.coords, waypoints: navigationWaypoints }) : "";
  const kml = selectedRoute ? buildKml({ name: routeName, coords: selectedRoute.coords, waypoints: navigationWaypoints }) : "";

  async function shareRoute() {
    if (!selectedEst) return;
    const shareData = {
      title: routeName,
      text: `${routeName} · ${formatCurrency(selectedEst.total, currency, locale)} · ${SHARE_TEXT_SUFFIX[locale] ?? SHARE_TEXT_SUFFIX.en}`,
      url: googleUrl,
    };
    if (navigator.share) await navigator.share(shareData);
    else await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
  }

  return (
    <main className="bg-scenic min-h-screen overflow-x-hidden pb-24 md:pb-0">
      <section className="hero-glow border-b border-border print-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:pt-16">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
            <div className="flex items-center gap-3">
              <img src="/icons/icon-192.png" alt="" width={40} height={40} className="rounded-lg" />
              <div>
                <p className="font-display text-xl font-extrabold tracking-tight text-foreground">
                  {t.brand}
                </p>
                <p className="text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
                  {t.tagline}
                </p>
              </div>
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-2">
            <div className="relative">
              <span className="sr-only">{t.currency}</span>
              <button
                type="button"
                onClick={() => setCurrencyOpen((open) => !open)}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-xs font-bold text-foreground outline-none transition-colors hover:border-primary/60 focus:border-primary/60"
                aria-label={t.currency}
                aria-expanded={currencyOpen}
                aria-haspopup="listbox"
                title={exchangeRatesNote[locale]?.(ratesMeta.date ?? "—") ?? ""}
              >
                <Coins className="size-3.5 text-muted-foreground" aria-hidden />
                <span>{currency}</span>
                <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-popover p-1 shadow-[var(--shadow-elevated)]" role="listbox" aria-label={t.currency}>
                  {CURRENCIES.map((code) => (
                    <button
                      key={code}
                      type="button"
                      role="option"
                      aria-selected={currency === code}
                      onClick={() => {
                        setCurrency(code);
                        setCurrencyOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold transition-colors ${currency === code ? "bg-primary/12 text-primary" : "text-foreground hover:bg-accent"}`}
                    >
                      <span className="w-10 shrink-0 font-bold">{code}</span>
                      <span className="min-w-0 flex-1 truncate text-muted-foreground">{currencyDisplayName(code, locale)}</span>
                      {currency === code && <Check className="size-3.5 shrink-0" aria-hidden />}
                    </button>
                  ))}
                  {ratesMeta.date && (
                    <p className="border-t border-border px-2.5 pb-1 pt-2 text-[0.65rem] leading-snug text-muted-foreground">
                      {exchangeRatesNote[locale]?.(ratesMeta.date) ?? exchangeRatesNote.en(ratesMeta.date)}
                    </p>
                  )}
                </div>
              )}
            </div>
            <LanguageSwitcher />
            <Link
              to="/demo"
              className="flex items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-xs font-bold text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              <Sparkles className="size-3.5" /> {t.exploreDemo}
            </Link>
            {proTier ? (
              <Link
                to="/account"
                className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-2 text-xs font-bold text-primary transition-colors hover:border-primary/70 hover:bg-primary/15"
              >
                <Sparkles className="size-3.5" /> {accountCopy.title} · {proTierName}
              </Link>
            ) : (
              <Link
                to="/login"
                className="rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-2 text-xs font-bold text-primary transition-colors hover:border-primary/70 hover:bg-primary/15"
              >
                {loginLabels[locale]}
              </Link>
            )}
            </div>
          </div>

          <h1 className="mt-9 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-6xl">
            <span className="text-gradient">{t.heroTitle}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.heroSub}
          </p>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Corridor stats">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/70 px-3 py-2 text-xs font-semibold text-muted-foreground">
              <Zap className="size-3.5 text-primary" aria-hidden /> {t.statEvHubs}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/70 px-3 py-2 text-xs font-semibold text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden /> {t.statTollSystems}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/70 px-3 py-2 text-xs font-semibold text-muted-foreground">
              <Tent className="size-3.5 text-primary" aria-hidden /> {t.statScenicSpots}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-2">
              <Gauge className="size-4 text-primary" /> {t.badgeMath}
            </span>
            <span className="flex items-center gap-2">
              <WifiOff className="size-4 text-primary" /> {t.badgeOffline}
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" /> {t.badgeOfficial}
            </span>
          </div>

          <div className="mt-9">
            <div className="relative">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-teal-500/10 via-transparent to-cyan-500/10 blur-2xl" aria-hidden="true" />
              <TripForm state={form} setState={setForm} onSubmit={() => void run()} loading={loading} onDemo={runDemo} />
            </div>
            {estimates.length === 0 && <FeatureHighlights />}
          </div>
        </div>
      </section>

      {estimates.length > 0 && selectedEst && (
        <section className="mx-auto max-w-6xl px-5 py-10">
          <TradeoffBanner estimates={estimates} currency={currency} />

          <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
            <div className="panel h-[380px] overflow-hidden lg:h-[560px]">
              <RouteMap
                routes={mapRoutes}
                start={submitted?.from ? [submitted.from.lat, submitted.from.lon] : null}
                end={submitted?.to ? [submitted.to.lat, submitted.to.lon] : null}
                borders={borders}
                chargers={evStops.length ? evStops : chargers.slice(0, 40)}
                showChargers={submitted?.vehicle === "ev"}
                scenic={visibleScenic}
                onAddCharger={(charger) => {
                  const stop: Place = { id: `charger-${charger.id}`, name: charger.name, label: `${charger.name}, ${charger.operator ?? "EV charging"}`, lat: charger.lat, lon: charger.lon };
                  setForm((current) => current.stops.some((item) => item?.id === stop.id) ? current : { ...current, stops: [...current.stops, stop] });
                  toast.success(chargerCopy[locale].added);
                }}
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">
                {t.comparison}
              </h2>
              {estimates.map((e) => (
                <RouteCard
                  key={e.key}
                  est={e}
                  selected={e.key === selected}
                  cheapest={e.key === cheapestKey}
                  currency={currency}
                  onSelect={() => setSelected(e.key)}
                />
              ))}
              {selectedEst && comparisonEst && (
                <EvSavingsCard
                  vehicle={submitted?.vehicle ?? form.vehicle}
                  evEstimate={submitted?.vehicle === "ev" ? selectedEst : comparisonEst}
                  fossilEstimate={submitted?.vehicle === "ev" ? comparisonEst : selectedEst}
                  fossilLabel={submitted?.vehicle === "diesel" ? t.diesel : t.petrol}
                  currency={currency}
                  onShowDetails={showEvDetails}
                />
              )}
            </div>
          </div>

          <div className="mt-6">
            <NavigationSheet
              totalEur={selectedEst.total}
              currency={currency}
              googleUrl={googleUrl}
              appleUrl={appleUrl}
              wazeUrl={wazeLink}
              teslaUrl={googleUrl}
              gpx={gpx}
              kml={kml}
              onShare={shareRoute}
            />
          </div>
          <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <MapIcon className="size-3.5 shrink-0" /> {WAYPOINT_NOTE_COPY[locale] ?? WAYPOINT_NOTE_COPY.en}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" size="sm" disabled={savingTrip} onClick={saveTrip}>
              {savingTrip ? "…" : t.saveTrip}
            </Button>
            <Button variant="secondary" size="sm" onClick={printCurrentTrip}>
              {t.printReport}
            </Button>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <Breakdown est={selectedEst} currency={currency} />
            <VignetteChecklist
              est={selectedEst}
              days={submitted?.days ?? form.days}
              currency={currency}
              startCountry={submitted?.from?.country}
              endCountry={submitted?.to?.country}
            />
          </div>
          <div className="mt-8">
            {proTier ? (
              <SmartFuelCharging
                copy={smartFuelCopy[locale] ?? smartFuelCopy.en}
                locale={locale}
                currency={currency}
                chargers={smartChargers}
                fuelStations={smartFuelStations}
                loading={smartLoading}
                maxDistanceKm={smartMaxKm}
                onMaxDistanceChange={setSmartMaxKm}
                onAddStop={(stop) => {
                  setForm((current) => current.stops.some((item) => item?.id === stop.id) ? current : { ...current, stops: [...current.stops, stop] });
                  toast.success(chargerCopy[locale].added);
                }}
              />
            ) : (
              <SmartFuelChargingUpgrade copy={smartFuelCopy[locale] ?? smartFuelCopy.en} />
            )}
          </div>
          <div className="mt-8">
            {proTier ? (
              <MotorhomeCamping
                copy={motorhomeCopy[locale] ?? motorhomeCopy.en}
                pois={motorhomePois}
                loading={motorhomeLoading}
                maxDistanceKm={motorhomeMaxKm}
                onMaxDistanceChange={setMotorhomeMaxKm}
                selectedCategories={motorhomeCategories}
                onToggleCategory={(category) => setMotorhomeCategories((current) => {
                  const next = new Set(current);
                  if (next.has(category)) next.delete(category); else next.add(category);
                  return next;
                })}
                onSelectAll={() => setMotorhomeCategories(new Set(MOTORHOME_CATEGORIES))}
                onClearAll={() => setMotorhomeCategories(new Set())}
                onAddStop={(stop) => {
                  setForm((current) => current.stops.some((item) => item?.id === stop.id) ? current : { ...current, stops: [...current.stops, stop] });
                  toast.success(chargerCopy[locale].added);
                }}
              />
            ) : (
              <MotorhomeCampingUpgrade copy={motorhomeCopy[locale] ?? motorhomeCopy.en} />
            )}
          </div>
          <div className="mt-8">
            <SafetyRegulations countryCodes={selectedEst.legs.map((leg) => leg.code)} />
          </div>
          <ScenicHighlights
            highlights={scenicHighlights}
            filter={scenicFilter}
            onFilterChange={setScenicFilter}
            selectedIds={new Set(selectedScenicIds)}
            onToggle={(highlight) =>
              setSelectedScenicIds((ids) =>
                ids.includes(highlight.id) ? ids.filter((id) => id !== highlight.id) : [...ids, highlight.id],
              )
            }
          />
        </section>
      )}

      <footer className="border-t border-border py-8 print-hidden">
        <div className="mx-auto max-w-6xl px-5 text-xs leading-relaxed text-muted-foreground">
          <p className="font-semibold text-foreground">AutoVere · autovere.com</p>
          <p className="mt-2 font-medium text-foreground">{t.companyFooter}</p>
          <nav className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs" aria-label="Legal links">
            <Dialog open={legalOpen} onOpenChange={setLegalOpen}>
              <DialogTrigger asChild>
                <button type="button" className="text-left hover:text-foreground">{t.legalNotice}</button>
              </DialogTrigger>
              <DialogContent className="max-w-md border border-white/10 bg-surface/85 text-foreground shadow-[var(--shadow-elevated)] backdrop-blur-2xl sm:rounded-2xl">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-base font-semibold">{legalCopy.legalTitle}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {legalCopy.legal.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <button
                  type="button"
                  className="mt-4 text-left text-sm font-semibold text-primary transition-colors hover:text-foreground"
                  onClick={() => {
                    setLegalOpen(false);
                    setContactOpen(true);
                  }}
                >
                  {t.contactLink}
                </button>
                <DialogClose asChild>
                  <Button variant="secondary" size="sm" className="mt-5 w-full sm:w-auto">
                    {legalCopy.close}
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" className="text-left hover:text-foreground">{t.privacyPolicy}</button>
              </DialogTrigger>
              <DialogContent className="max-w-md border border-white/10 bg-surface/85 text-foreground shadow-[var(--shadow-elevated)] backdrop-blur-2xl sm:rounded-2xl">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-base font-semibold">{legalCopy.privacyTitle}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {legalCopy.privacy.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <DialogClose asChild>
                  <Button variant="secondary" size="sm" className="mt-5 w-full sm:w-auto">
                    {legalCopy.close}
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <button type="button" className="text-left hover:text-foreground">{t.termsDisclaimer}</button>
              </DialogTrigger>
              <DialogContent className="max-w-md border border-white/10 bg-surface/85 text-foreground shadow-[var(--shadow-elevated)] backdrop-blur-2xl sm:rounded-2xl">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-base font-semibold">{legalCopy.termsTitle}</DialogTitle>
                </DialogHeader>
                <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
                  {legalCopy.terms.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <DialogClose asChild>
                  <Button variant="secondary" size="sm" className="mt-5 w-full sm:w-auto">
                    {legalCopy.close}
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <button
              type="button"
              className="text-left hover:text-foreground"
              onClick={() => setContactOpen(true)}
            >
              {t.contactLink}
            </button>
            <ShareModal compact />
            <Link to="/pricing" className="hover:text-foreground">{marketing.pricingLink}</Link>
            <Link to="/faq" className="hover:text-foreground">{marketing.faqLink}</Link>
            <Link to="/demo" className="hover:text-foreground">{t.exploreDemo}</Link>
            <Link to="/partners" className="hover:text-foreground">{partnerNav.navLink}</Link>
          </nav>
          <p className="mt-2 max-w-3xl">
            {t.footerDisclaimer}
          </p>
        </div>
      </footer>
      <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
      {selectedEst && (
        <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-2 border-t border-border bg-background/95 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[var(--shadow-elevated)] backdrop-blur md:hidden print-hidden">
          <Button size="lg" className="min-h-11 rounded-xl font-bold" onClick={() => void run()} disabled={loading || !form.from || !form.to}>
            <Navigation className="size-4" /> Calculate
          </Button>
          <NavigationSheet
            totalEur={selectedEst.total}
            currency={currency}
            googleUrl={googleUrl}
            appleUrl={appleUrl}
            wazeUrl={wazeLink}
            teslaUrl={googleUrl}
            gpx={gpx}
            kml={kml}
            onShare={shareRoute}
          />
        </div>
      )}
    </main>
  );
}
