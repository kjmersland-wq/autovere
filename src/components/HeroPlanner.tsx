import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDown,
  ArrowUp,
  Check,
  Gauge,
  GripVertical,
  MapPin,
  Plus,
  Route as RouteIcon,
  Tag,
  X,
} from "lucide-react";
import { toast } from "sonner";

import heroImage from "@/assets/hero-roadtrip.jpg";
import { CountryCostDrawer } from "@/components/CountryCostDrawer";

import { SiteHeader } from "@/components/SiteHeader";
import { StateExplorer } from "@/components/StateExplorer";
import { TripResults } from "@/components/TripResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { DURATION_OPTIONS, type TripType } from "@/lib/vignette-optimizer";
import {
  detectEmissionBadges,
  detectFerryCrossings,
  estimateAllVariants,
  FUELS,
  QUICK_ROUTES,
  REGION_COPY,
  REGION_DEFAULTS,
  TRANSPONDERS,
  VEHICLES,
  type FuelKey,
  type QuickRoute,
  type RegionKey,
  type EmissionBadge,
  type FerryCrossing,
  type RouteVariantKey,
  type TransponderKey,
  type TripEstimate,
  type VehicleKey,
  type VehicleProfile,
} from "@/lib/trip-data";
import { loadActiveVehicle, parseNumber } from "@/lib/garage";
import { getRouteGeo, type RouteGeo } from "@/lib/route-geo.functions";
import { getEnergyPrices, type EnergyPrices } from "@/lib/energy-prices.functions";
import { PlaceAutocomplete, type PlaceHit } from "@/components/PlaceAutocomplete";
import { useLocale, useT, useTr } from "@/lib/i18n";
import { regionStrings } from "@/lib/region-i18n";
import { cn } from "@/lib/utils";


export type { RegionKey };

type HeroPlannerProps = {
  region: RegionKey;
  title: string;
  subtitle: string;
  eyebrow?: string;
};

export function HeroPlanner({ region, title, subtitle, eyebrow }: HeroPlannerProps) {
  const t = useT();
  const tr = useTr();
  const locale = useLocale();
  const copy = REGION_COPY[region];
  const rs = regionStrings(locale, region);
  const originHint = rs.originHint;
  const destinationHint = rs.destinationHint;
  const defaults = REGION_DEFAULTS[region];
  const imperial = defaults.units === "imperial";
  const [vehicle, setVehicle] = useState<VehicleKey>("car");
  const [fuel, setFuel] = useState<FuelKey>("petrol");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [scenic, setScenic] = useState(true);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [ferries, setFerries] = useState(true);
  const [trip, setTrip] = useState<Record<RouteVariantKey, TripEstimate> | null>(null);
  const [ferryCrossings, setFerryCrossings] = useState<FerryCrossing[]>([]);
  const [badges, setBadges] = useState<EmissionBadge[]>([]);
  const [stops, setStops] = useState<string[]>([]);
  const [activeQuick, setActiveQuick] = useState<string | null>(null);
  const [tags, setTags] = useState<TransponderKey[]>([]);
  const [tankSize, setTankSize] = useState(imperial ? "16" : "60");
  const [consumption, setConsumption] = useState(imperial ? "28" : "7.4");
  const [waypoints, setWaypoints] = useState<{ id: string; value: string }[]>([]);
  const [geo, setGeo] = useState<RouteGeo | null>(null);
  const [originHit, setOriginHit] = useState<PlaceHit | null>(null);
  const [destinationHit, setDestinationHit] = useState<PlaceHit | null>(null);
  const [prices, setPrices] = useState<EnergyPrices | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [tripType, setTripType] = useState<TripType>("oneway");
  const [durationDays, setDurationDays] = useState(7);
  /** Consumption + charging preferences from the active vehicle in My Garage. */
  const [profile, setProfile] = useState<VehicleProfile | null>(null);

  useEffect(() => {
    const active = loadActiveVehicle();
    if (!active) return;
    setProfile({
      name: active.name,
      kwhPer100: active.kwhPer100 ?? parseNumber(active.consumption),
      batteryKwh: active.batteryKwh ?? parseNumber(active.tank),
      network: active.network,
    });
    if (active.fuel === "ev") setFuel("electric");
    setVehicle(active.kind === "motorcycle" ? "motorcycle" : active.kind === "motorhome" ? "motorhome" : "car");
  }, []);

  const viaCount = waypoints.filter((w) => w.value.trim()).length;

  const addWaypoint = () => {
    if (waypoints.length >= 3) {
      toast.info(t.hero.viaLimit);
      return;
    }
    setWaypoints((prev) => [...prev, { id: Math.random().toString(36).slice(2, 9), value: "" }]);
  };
  const updateWaypoint = (id: string, value: string) =>
    setWaypoints((prev) => prev.map((w) => (w.id === id ? { ...w, value } : w)));
  const removeWaypoint = (id: string) => setWaypoints((prev) => prev.filter((w) => w.id !== id));
  const moveWaypoint = (index: number, dir: -1 | 1) =>
    setWaypoints((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });

  const quickRoutes = useMemo(
    () => QUICK_ROUTES.filter((r) => r.regions.includes(region)),
    [region],
  );
  const transponders = useMemo(
    () => TRANSPONDERS.filter((t) => t.regions.includes(region)),
    [region],
  );

  const volumeUnit = fuel === "electric" ? "kWh" : imperial ? "gal" : "L";
  const consumptionUnit =
    fuel === "electric"
      ? imperial ? "kWh/100 mi" : "kWh/100 km"
      : imperial ? "mpg" : "L/100 km";

  const range = useMemo(() => {
    const t = Number(tankSize);
    const c = Number(consumption);
    if (!t || !c) return "—";
    if (imperial && fuel !== "electric") return Math.round(t * c);
    return Math.round((t / c) * 100);
  }, [tankSize, consumption, imperial, fuel]);

  const scrollToResults = () =>
    requestAnimationFrame(() =>
      document.getElementById("trip-results")?.scrollIntoView({ behavior: "smooth" }),
    );

  const effectiveDuration = tripType === "return" ? durationDays : 1;
  const routeFn = useServerFn(getRouteGeo);
  const pricesFn = useServerFn(getEnergyPrices);

  // Live fuel / kWh feed for the active region — refreshed on mount.
  useEffect(() => {
    let alive = true;
    pricesFn({ data: { region } })
      .then((p) => alive && setPrices(p))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [region, pricesFn]);

  /**
   * Resolve the real routed corridor first (OSRM polyline + reverse-geocoded
   * countries), then cost it. Only when geocoding fails do we fall back to the
   * generic regional sample.
   */
  const runCalculation = async (from: string, to: string, extra: number) => {
    setCalculating(true);
    let resolved: RouteGeo | null = null;
    if (from.trim().length > 1 && to.trim().length > 1) {
      try {
        const fromPoint =
          originHit && originHit.label === from
            ? { name: originHit.label, lat: originHit.lat, lng: originHit.lng }
            : undefined;
        const toPoint =
          destinationHit && destinationHit.label === to
            ? { name: destinationHit.label, lat: destinationHit.lat, lng: destinationHit.lng }
            : undefined;
        resolved = await routeFn({
          data: { origin: from, destination: to, ...(fromPoint && { fromPoint }), ...(toPoint && { toPoint }) },
        });
      } catch {
        resolved = null;
      }
    }
    setGeo(resolved);
    setTrip(
      estimateAllVariants(
        region,
        vehicle,
        fuel,
        avoidTolls,
        ferries,
        scenic,
        extra,
        tripType,
        effectiveDuration,
        resolved,
        prices,
        profile,
      ),
    );
    const places = resolved
      ? [
          ...resolved.countries.map((c) => c.country),
          ...resolved.samples.map((sp) => sp.place),
        ]
      : undefined;
    setFerryCrossings(ferries ? detectFerryCrossings(region, from, to, places) : []);
    setBadges(detectEmissionBadges(region, from, to, places));
    setCalculating(false);
    if (!resolved && from.trim() && to.trim()) {
      toast.error("Couldn't resolve those places — pick a suggestion from the dropdown and try again.");
    }
    scrollToResults();
  };

  const runQuickRoute = (r: QuickRoute) => {
    setOrigin(r.origin);
    setDestination(r.destination);
    setActiveQuick(r.key);
    setStops([]);
    void runCalculation(r.origin, r.destination, viaCount);
  };



  return (
    <>
      <section className="relative isolate w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Crossover SUV, adventure motorcycle and campervan parked at a coastal mountain overlook at dusk"
          width={1920}
          height={1088}
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
        />
        <div aria-hidden className="hero-overlay absolute inset-0 -z-10" />

        <SiteHeader region={region} />

        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 py-16 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow ?? copy.eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-foreground/80 sm:text-lg">{subtitle}</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStops([]);
              void runCalculation(origin, destination, viaCount);
            }}
            className="glass-panel mt-9 rounded-2xl p-4 shadow-2xl sm:p-6"
          >
            <div className="flex flex-wrap items-center gap-2">
              {VEHICLES.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => setVehicle(v.key)}
                  aria-pressed={vehicle === v.key}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    vehicle === v.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background/50 text-foreground/85 hover:bg-background/70",
                  )}
                >
                  <span>{v.emoji}</span>
                  {t.hero.vehicles[v.key]}
                </button>
              ))}

              <span aria-hidden className="mx-1 hidden h-6 w-px bg-border sm:block" />

              {([
                { key: "oneway" as const, emoji: "➡️", label: t.hero.oneway },
                { key: "return" as const, emoji: "🔁", label: t.hero.returnTrip },
              ]).map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTripType(t.key)}
                  aria-pressed={tripType === t.key}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    tripType === t.key
                      ? "border-primary bg-primary/15 text-foreground"
                      : "border-border bg-background/50 text-foreground/85 hover:bg-background/70",
                  )}
                >
                  <span>{t.emoji}</span>
                  {t.label}
                </button>
              ))}

              {tripType === "return" && (
                <label className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-1.5 text-sm">
                  <span className="text-foreground/75">{t.hero.duration}</span>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="rounded-md bg-transparent py-1 text-sm font-medium text-foreground outline-none"
                  >
                    {DURATION_OPTIONS.map((d) => (
                      <option key={d.days} value={d.days} className="bg-card text-foreground">
                        {d.label}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
              <PlaceAutocomplete
                value={origin}
                onValueChange={(v) => {
                  setOrigin(v);
                  setActiveQuick(null);
                }}
                onSelect={setOriginHit}
                region={region}
                ariaLabel={t.hero.origin}
                placeholder={originHint}
                icon={
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                }
              />
              <PlaceAutocomplete
                value={destination}
                onValueChange={(v) => {
                  setDestination(v);
                  setActiveQuick(null);
                }}
                onSelect={setDestinationHit}
                region={region}
                ariaLabel={t.hero.destination}
                placeholder={destinationHint}
                icon={
                  <RouteIcon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
                }
              />
              <Button
                type="submit"
                size="lg"
                disabled={calculating}
                className="h-12 px-8 text-base font-semibold"
              >
                {calculating ? "Analysing route…" : t.hero.submit}
              </Button>
            </div>

            <div className="mt-3 grid gap-2">
              {waypoints.map((w, i) => (
                <div key={w.id} className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5 rounded-lg border border-border bg-background/40 px-1.5 py-1">
                    <GripVertical className="size-4 text-muted-foreground" aria-hidden />
                    <button
                      type="button"
                      onClick={() => moveWaypoint(i, -1)}
                      aria-label={`Move via-stop ${i + 1} up`}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      disabled={i === 0}
                    >
                      <ArrowUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveWaypoint(i, 1)}
                      aria-label={`Move via-stop ${i + 1} down`}
                      className="rounded p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
                      disabled={i === waypoints.length - 1}
                    >
                      <ArrowDown className="size-3.5" />
                    </button>
                  </span>
                  <Input
                    value={w.value}
                    onChange={(e) => updateWaypoint(w.id, e.target.value)}
                    className="h-11 border-border bg-background/60 text-base placeholder:text-muted-foreground"
                    placeholder={t.hero.viaPlaceholder(i + 1)}
                  />
                  <button
                    type="button"
                    onClick={() => removeWaypoint(w.id)}
                    aria-label={`Remove via-stop ${i + 1}`}
                    className="rounded-lg border border-border bg-background/40 p-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={addWaypoint}
                  disabled={waypoints.length >= 3}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40"
                >
                  <Plus className="size-4" />
                  {t.hero.addVia}
                </button>
                <span className="text-xs text-muted-foreground">
                  {t.hero.viaHint}
                </span>
              </div>
            </div>


            <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
              <Toggle
                label={t.hero.scenic}
                checked={scenic}
                onChange={setScenic}
              />
              <Toggle label={t.hero.avoidTolls} checked={avoidTolls} onChange={setAvoidTolls} />
              <Toggle label={t.hero.ferries} checked={ferries} onChange={setFerries} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-foreground/70">{t.hero.fuelType}</span>
              {FUELS.map((f) => (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFuel(f.key)}
                  aria-pressed={fuel === f.key}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    fuel === f.key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background/50 text-foreground/85 hover:bg-background/70",
                  )}
                >
                  <span>{f.emoji}</span>
                  {t.hero.fuels[f.key]}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <span className="text-sm text-foreground/70">{t.hero.popularRoutes}</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {quickRoutes.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => runQuickRoute(r)}
                    title={r.via}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                      activeQuick === r.key
                        ? "border-primary bg-primary/15 text-foreground"
                        : "border-border bg-background/50 text-foreground/85 hover:bg-background/70",
                    )}
                  >
                    <span>{r.emoji}</span>
                    <span className="font-medium">{r.label}</span>
                    <span className="hidden text-xs text-muted-foreground sm:inline">{r.via}</span>
                    {r.evBadge && (
                      <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                        {r.evBadge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-border pt-5 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="text-sm text-foreground/70">{t.hero.transponder}</span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {transponders.map((t) => {
                    const on = tags.includes(t.key);
                    return (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() =>
                          setTags((prev) =>
                            prev.includes(t.key) ? prev.filter((k) => k !== t.key) : [...prev, t.key],
                          )
                        }
                        aria-pressed={on}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors",
                          on
                            ? "border-primary bg-primary/15 text-foreground"
                            : "border-border bg-background/50 text-foreground/85 hover:bg-background/70",
                        )}
                      >
                        {on ? <Check className="size-4 text-primary" /> : <Tag className="size-4 text-muted-foreground" />}
                        <span className="font-medium">{tr(t.label)}</span>
                        <span className="text-xs text-muted-foreground">{t.scope}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 self-end border-border bg-background/50"
                  >
                    <Gauge className="size-4" />
                    {t.hero.consumption}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 border-border bg-card/95 backdrop-blur">
                  <p className="text-sm font-semibold">{t.hero.fineTune}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.hero.fineTuneHint}
                  </p>
                  <label className="mt-4 block text-xs text-foreground/75">
                    {t.hero.tankSize} ({volumeUnit})
                    <Input
                      type="number"
                      min={1}
                      value={tankSize}
                      onChange={(e) => setTankSize(e.target.value)}
                      className="mt-1 h-10 border-border bg-background/60"
                    />
                  </label>
                  <label className="mt-3 block text-xs text-foreground/75">
                    {t.hero.avgConsumption} ({consumptionUnit})
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      value={consumption}
                      onChange={(e) => setConsumption(e.target.value)}
                      className="mt-1 h-10 border-border bg-background/60"
                    />
                  </label>
                  <p className="mt-3 text-xs text-muted-foreground">
                    {t.hero.rangePerFill}: ~{range} {defaults.units === "imperial" ? "miles" : "km"}
                  </p>
                </PopoverContent>
              </Popover>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              {t.hero.regionalDefaults}: {defaults.units === "imperial" ? t.hero.imperial : t.hero.metric} ·{" "}
              {defaults.currencyCode} · {rs.tollSystems.join(" · ")}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              {t.hero.footnote}
            </p>
          </form>
        </div>
      </section>

      <div id="trip-results">
        {trip && (
          <TripResults
            trips={trip}
            origin={origin}
            destination={destination}
            ferryCrossings={ferryCrossings}
            isMotorcycle={vehicle === "motorcycle"}
            isMotorhome={vehicle === "motorhome"}
            fuel={fuel}
            region={region}
            emissionBadges={badges}
            onAddStop={(name) => {
              if (stops.includes(name)) {
                toast.info(t.results.stopExists(name));
                return;
              }
              const next = [...stops, name];
              setStops(next);
              setTrip(
                estimateAllVariants(
                  region,
                  vehicle,
                  fuel,
                  avoidTolls,
                  ferries,
                  scenic,
                  next.length + viaCount,
                  tripType,
                  effectiveDuration,
                  geo,
                  prices,
                ),
              );
              toast.success(t.results.stopAdded(name, next.length));
            }}
          />
        )}
      </div>

      {(region === "us" || region === "ca") && (
        <StateExplorer
          region={region}
          onPlanRoute={(name) => {
            setDestination(name);
            setActiveQuick(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}

      <CountryCostDrawer
        defaultGroup={region === "us" ? "us" : region === "ca" ? "ca" : "western"}
        onPlanRoute={(c) => {
          setDestination(c.name);
          setActiveQuick(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

    </>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-3 text-sm">
      <span className="text-foreground/85">{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
