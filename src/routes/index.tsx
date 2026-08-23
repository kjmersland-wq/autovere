import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Download, Map as MapIcon, Navigation, Apple, Gauge, WifiOff, ShieldCheck } from "lucide-react";
import { TripForm, type TripFormState } from "@/components/TripForm";
import { RouteMap } from "@/components/RouteMap";
import { Breakdown, RouteCard, TradeoffBanner } from "@/components/Comparison";
import { VignetteChecklist } from "@/components/VignetteChecklist";
import { Button } from "@/components/ui/button";
import { DEFAULT_TRIP, detectBorders, estimate, type Estimate } from "@/lib/calc";
import { fetchFastChargers, fetchRoute, type Charger, type RouteResult, type RouteVariantKey } from "@/lib/geo";
import {
  appleMapsUrl,
  buildGpx,
  chargerWaypoints,
  downloadGpx,
  googleMapsUrl,
  shapingWaypoints,
} from "@/lib/export";
import { useT } from "@/lib/i18n";
import { CURRENCIES, type CurrencyCode } from "@/lib/currency";

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

function Index() {
  const t = useT();
  const [form, setForm] = useState<TripFormState>({
    from: null,
    to: null,
    vehicle: "petrol",
    evRangeKm: 450,
    days: 10,
  });
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState<Partial<Record<RouteVariantKey, RouteResult>>>({});
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [selected, setSelected] = useState<RouteVariantKey>("bypass");
  const [submitted, setSubmitted] = useState<TripFormState | null>(null);
  const [currency, setCurrency] = useState<CurrencyCode>("EUR");

  const run = useCallback(async () => {
    const { from, to } = form;
    if (!from || !to) return;
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        VARIANTS.map((v) => fetchRoute(from, to, v)),
      );
      const map: Partial<Record<RouteVariantKey, RouteResult>> = {};
      VARIANTS.forEach((v, i) => {
        const r = results[i];
        if (r?.status === "fulfilled") map[v] = r.value;
      });
      if (!map.fastest) throw new Error("No drivable route between these places.");

      let found: Charger[] = [];
      if (form.vehicle === "ev") {
        try {
          found = await fetchFastChargers(map.fastest.coords);
        } catch {
          toast.warning("Charging network data is temporarily unavailable.");
        }
      }
      setChargers(found);

      const trip = {
        ...DEFAULT_TRIP,
        vehicle: form.vehicle,
        days: form.days,
        evRangeKm: form.evRangeKm,
      };
      const next = VARIANTS.filter((v) => map[v]).map((v) => estimate(v, map[v]!, trip, found));
      setRoutes(map);
      setEstimates(next);
      setSubmitted(form);
      const cheapest = next.reduce((a, b) => (a.total <= b.total ? a : b));
      setSelected(cheapest.key);
      toast.success(`${next.length} routes compared — cheapest: ${cheapest.title}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Calculation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [form]);

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

  function openGoogle() {
    if (!submitted?.from || !submitted.to || !selectedRoute) return;
    const via = evStops.length
      ? evStops.map((s) => [s.lat, s.lon] as [number, number])
      : shapingWaypoints(selectedRoute.coords, selectedEst?.key === "fastest" ? 2 : 5);
    window.open(googleMapsUrl(submitted.from, submitted.to, via), "_blank", "noopener");
  }

  function openApple() {
    if (!submitted?.from || !submitted.to) return;
    window.open(appleMapsUrl(submitted.from, submitted.to), "_blank", "noopener");
  }

  function exportGpx() {
    if (!submitted?.from || !submitted.to || !selectedRoute || !selectedEst) return;
    const gpx = buildGpx({
      name: `AutoVere — ${submitted.from.name} → ${submitted.to.name} (${selectedEst.title})`,
      coords: selectedRoute.coords,
      waypoints: [
        { lat: submitted.from.lat, lon: submitted.from.lon, name: submitted.from.name },
        ...chargerWaypoints(evStops),
        { lat: submitted.to.lat, lon: submitted.to.lon, name: submitted.to.name },
      ],
    });
    downloadGpx(
      `autovere-${submitted.from.name}-${submitted.to.name}.gpx`.toLowerCase().replace(/\s+/g, "-"),
      gpx,
    );
    toast.success("GPX downloaded — import it into your in-car GPS.");
  }

  return (
    <main className="min-h-screen">
      <section className="hero-glow border-b border-border">
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
              <span className="sr-only">Currency</span>
              <select
                value={currency}
                onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
                className="rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-xs font-bold text-foreground outline-none focus:border-primary/60"
                aria-label="Currency"
              >
                {CURRENCIES.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <h1 className="mt-9 max-w-3xl text-4xl font-extrabold leading-[1.08] sm:text-6xl">
            <span className="text-gradient">{t.heroTitle}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {t.heroSub}
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-2">
              <Gauge className="size-4 text-primary" /> Instant deterministic maths
            </span>
            <span className="flex items-center gap-2">
              <WifiOff className="size-4 text-primary" /> Installable & works offline
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" /> Official portals only
            </span>
          </div>

          <div className="mt-9">
            <TripForm state={form} setState={setForm} onSubmit={run} loading={loading} />
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

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Button size="lg" className="h-13 rounded-xl font-bold" onClick={openGoogle}>
              <Navigation className="size-5" /> {t.openGoogle}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="h-13 rounded-xl font-bold"
              onClick={openApple}
            >
              <Apple className="size-5" /> {t.openApple}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-13 rounded-xl font-bold"
              onClick={exportGpx}
            >
              <Download className="size-5" /> {t.downloadGpx}
            </Button>
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
        </section>
      )}

      <footer className="border-t border-border py-8">
        <div className="mx-auto max-w-6xl px-5 text-xs leading-relaxed text-muted-foreground">
          <p className="font-semibold text-foreground">AutoVere · autovere.com</p>
          <p className="mt-2 max-w-3xl">
            Routing and map data © OpenStreetMap contributors, routed via the public OSRM service.
            Toll, vignette and energy figures are indicative averages for passenger cars and are
            calculated on your device. Always confirm prices on the official portals linked above.
          </p>
        </div>
      </footer>
    </main>
  );
}
