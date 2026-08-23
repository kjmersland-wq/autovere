import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Map as MapIcon, Navigation, Gauge, WifiOff, ShieldCheck, Sun, Moon } from "lucide-react";
import { TripForm, type DemoRoute, type TripFormState } from "@/components/TripForm";
import { ContactModal } from "@/components/ContactModal";
import { ShareModal } from "@/components/ShareModal";
import { FeatureHighlights } from "@/components/FeatureHighlights";
import { RouteMap } from "@/components/RouteMap";
import { Breakdown, RouteCard, TradeoffBanner } from "@/components/Comparison";
import { VignetteChecklist } from "@/components/VignetteChecklist";
import { NavigationSheet } from "@/components/NavigationSheet";
import { ScenicHighlights, type ScenicFilter } from "@/components/ScenicHighlights";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DEFAULT_TRIP, detectBorders, estimate, type Estimate } from "@/lib/calc";
import { fetchFastChargers, fetchMultiStopRoute, fetchScenicHighlights, type Charger, type Place, type RouteResult, type RouteVariantKey, type ScenicHighlight } from "@/lib/geo";
import {
  appleMapsUrl,
  buildGpx,
  buildKml,
  googleMapsUrl,
  routeWaypoints,
  shapingWaypoints,
  wazeUrl,
} from "@/lib/export";
import { useLocale, useT } from "@/lib/i18n";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";
import { useTheme } from "@/hooks/use-theme";
import { formatCurrency } from "@/lib/currency";
import { marketingCopy } from "@/lib/marketing-i18n";
import { chargerCopy } from "@/lib/charger-i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AutoVere — European Toll, Vignette & EV Charging Planner" },
      {
        name: "description",
        content:
          "Instantly compare fastest, toll-bypass and toll-free routes across Europe. Real fuel, charging, toll and vignette costs with official purchase links.",
      },
      { property: "og:title", content: "AutoVere — Know your real European road-trip cost" },
      {
        property: "og:description",
        content:
          "Deterministic toll, vignette, fuel and EV charging estimates for any European route. Free, instant, built on open data.",
      },
    ],
  }),
  component: Index,
});

const COLORS: Record<RouteVariantKey, string> = {
  fastest: "#7aa2f7",
  bypass: "#7fe7d6",
  tollfree: "#ffd166",
};

const VARIANTS: RouteVariantKey[] = ["fastest", "bypass", "tollfree"];

const LEGAL_MODAL_COPY = {
  no: {
    legalTitle: "Juridisk informasjon",
    privacyTitle: "Personvern",
    termsTitle: "Vilkår og ansvarsfraskrivelse",
    close: "Lukk",
    legal: [
      "Utviklet og driftes av: KM TECH LABS",
      "Sted: Kristiansand, Norge",
      "Organisasjonsnummer: 934 044 029",
      "E-post: contact@autovere.com",
      "Formål: Uavhengig ruteøkonomi, bompenge- og ladekalkulator for europeiske veier.",
    ],
    privacy: [
      "100 % lokal beregning på klientsiden i nettleseren.",
      "Ingen lagring eller sporing av din eksakte posisjonshistorikk.",
      "Ingen salg av data eller tredjeparts-annonsesporing. Fullt GDPR-kompatibel.",
    ],
    terms: [
      "Bompenge-, vignett-, lade- og drivstoffberegninger er veiledende estimater basert på åpne kilder (OpenStreetMap, OSRM, Overpass).",
      "Sjåføren er selv fullt ansvarlig for å overholde gjeldende skilting, fartsgrenser og offisielle takster.",
    ],
  },
  en: {
    legalTitle: "Legal Notice",
    privacyTitle: "Privacy Policy",
    termsTitle: "Terms & Disclaimer",
    close: "Close",
    legal: [
      "Developed and operated by: KM TECH LABS",
      "Location: Kristiansand, Norway",
      "Organization no.: 934 044 029",
      "Email: contact@autovere.com",
      "Purpose: Independent route cost, toll and charging calculator for European roads.",
    ],
    privacy: [
      "100% local calculation in the browser.",
      "No storage or tracking of your exact position history.",
      "No data resale or third-party ad tracking. Fully GDPR-compliant.",
    ],
    terms: [
      "Toll, vignette, charging and fuel estimates are indicative and based on open sources (OpenStreetMap, OSRM, Overpass).",
      "The driver is solely responsible for complying with current road signs, speed limits and official tariffs.",
    ],
  },
  de: {
    legalTitle: "Impressum",
    privacyTitle: "Datenschutzerklärung",
    termsTitle: "Allgemeine Geschäftsbedingungen",
    close: "Schließen",
    legal: [
      "Entwickelt und betrieben von: KM TECH LABS",
      "Ort: Kristiansand, Norwegen",
      "Organisationsnummer: 934 044 029",
      "E-Mail: contact@autovere.com",
      "Zweck: Unabhängiger Routen-, Maut- und Lade-Rechner für europäische Straßen.",
    ],
    privacy: [
      "100 % lokale Berechnung direkt im Browser.",
      "Keine Speicherung oder Verfolgung Ihrer genauen Standorthistorie.",
      "Kein Datenverkauf oder Tracking durch Drittanbieter. Vollständig DSGVO-konform.",
    ],
    terms: [
      "Maut-, Vignette-, Lade- und Kraftstoffschätzungen sind orientierende Berechnungen auf Basis offener Datenquellen (OpenStreetMap, OSRM, Overpass).",
      "Der Fahrer ist allein verantwortlich für die Einhaltung aktueller Beschilderung, Geschwindigkeitsbegrenzungen und offizieller Tarife.",
    ],
  },
  nl: {
    legalTitle: "Juridische informatie",
    privacyTitle: "Privacybeleid",
    termsTitle: "Voorwaarden en disclaimer",
    close: "Sluiten",
    legal: [
      "Ontwikkeld en beheerd door: KM TECH LABS",
      "Locatie: Kristiansand, Noorwegen",
      "Organisatienummer: 934 044 029",
      "E-mail: contact@autovere.com",
      "Doel: een onafhankelijke route-, tol- en laadcalculator voor Europese wegen.",
    ],
    privacy: [
      "Alle berekeningen worden lokaal in je browser uitgevoerd.",
      "We slaan je exacte locatiegeschiedenis niet op en volgen die niet.",
      "We verkopen geen gegevens en gebruiken geen tracking voor advertenties van derden.",
    ],
    terms: [
      "Schattingen voor tol, vignetten, laden en brandstof zijn indicatief en gebaseerd op open bronnen zoals OpenStreetMap, OSRM en Overpass.",
      "De bestuurder blijft zelf verantwoordelijk voor actuele verkeersborden, snelheidslimieten en officiële tarieven.",
    ],
  },
  pl: {
    legalTitle: "Nota prawna",
    privacyTitle: "Polityka prywatności",
    termsTitle: "Warunki i wyłączenie odpowiedzialności",
    close: "Zamknij",
    legal: [
      "Opracowane i prowadzone przez: KM TECH LABS",
      "Lokalizacja: Kristiansand, Norwegia",
      "Numer organizacji: 934 044 029",
      "E-mail: contact@autovere.com",
      "Cel: Niezależny kalkulator tras, opłat i ładowania dla europejskich dróg.",
    ],
    privacy: [
      "100% lokalne obliczenia w przeglądarce.",
      "Brak przechowywania ani śledzenia dokładnej historii położenia.",
      "Brak sprzedaży danych ani reklamowych śledzeń firm trzecich. W pełni zgodne z RODO.",
    ],
    terms: [
      "Szacunki opłat, winiet, ładowania i paliwa są orientacyjne i opierają się na otwartych źródłach (OpenStreetMap, OSRM, Overpass).",
      "Kierowca jest wyłącznie odpowiedzialny za przestrzeganie aktualnych znaków drogowych, limitów prędkości i oficjalnych stawek.",
    ],
  },
} as const;

function Index() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const marketing = marketingCopy[locale];
  const legalCopy = LEGAL_MODAL_COPY[locale as keyof typeof LEGAL_MODAL_COPY] ?? LEGAL_MODAL_COPY.no;
  const [form, setForm] = useState<TripFormState>({
    from: null,
    stops: [],
    to: null,
    vehicle: "petrol",
    evRangeKm: 450,
    days: 10,
  });
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Partial<Record<RouteVariantKey, RouteResult>>>({});
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [scenicHighlights, setScenicHighlights] = useState<ScenicHighlight[]>([]);
  const [selectedScenicIds, setSelectedScenicIds] = useState<string[]>([]);
  const [scenicFilter, setScenicFilter] = useState<ScenicFilter>("all");
  const [selected, setSelected] = useState<RouteVariantKey>("bypass");
  const [submitted, setSubmitted] = useState<TripFormState | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");
  const [contactOpen, setContactOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

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
      if (input.vehicle === "ev") {
        try {
          found = await fetchFastChargers(map.fastest.coords);
        } catch {
          toast.warning(t.chargingUnavailable);
        }
      }
      setChargers(found);
      const scenic = await fetchScenicHighlights(map.fastest.coords, found);
      setScenicHighlights(scenic);
      setSelectedScenicIds([]);
      setScenicFilter("all");

      const trip = {
        ...DEFAULT_TRIP,
        vehicle: input.vehicle,
        days: input.days,
        evRangeKm: input.evRangeKm,
      };
      const next = VARIANTS.filter((v) => map[v]).map((v) => estimate(v, map[v]!, trip, found));
      setRoutes(map);
      setEstimates(next);
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

  const selectedEst = estimates.find((e) => e.key === selected) ?? estimates[0];
  const selectedRoute = selectedEst ? routes[selectedEst.key] : undefined;
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
      text: `${routeName} · ${formatCurrency(selectedEst.total, currency)} · Open in navigation:`,
      url: googleUrl,
    };
    if (navigator.share) await navigator.share(shareData);
    else await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
  }

  return (
    <main className="min-h-screen overflow-x-hidden pb-24 md:pb-0">
      <section className="hero-glow border-b border-border print-hidden">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:pt-16">
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
            <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="sr-only">{t.currency}</span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                className="rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-xs font-bold text-foreground outline-none focus:border-primary/60"
                aria-label={t.currency}
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="sr-only">{t.language}</span>
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
                className="rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-xs font-bold text-foreground outline-none focus:border-primary/60"
                aria-label={t.language}
              >
                <option value="en">🇬🇧 EN</option>
                <option value="de">🇩🇪 DE</option>
                <option value="nl">🇳🇱 NL</option>
                <option value="no">🇳🇴 NO</option>
                  <option value="pl">🇵🇱 PL</option>
              </select>
            </label>
            <button
              type="button"
              onClick={toggleTheme}
              className="rounded-lg border border-border bg-surface-raised p-2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
              title={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>

          <h1 className="mt-9 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-6xl">
            <span className="text-gradient">{t.heroTitle}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.heroSub}
          </p>

          <div className="mt-6 flex flex-wrap gap-2" aria-label="Corridor stats">
            <span className="rounded-full border border-border/60 bg-surface/70 px-3 py-2 text-xs font-semibold text-muted-foreground">⚡ {t.statEvHubs}</span>
            <span className="rounded-full border border-border/60 bg-surface/70 px-3 py-2 text-xs font-semibold text-muted-foreground">🛡️ {t.statTollSystems}</span>
            <span className="rounded-full border border-border/60 bg-surface/70 px-3 py-2 text-xs font-semibold text-muted-foreground">🏕️ {t.statScenicSpots}</span>
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
                theme={theme}
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
            <MapIcon className="size-3.5" /> Waypoints are injected so navigation apps follow the
            bypass and charging stops exactly.
          </p>

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
