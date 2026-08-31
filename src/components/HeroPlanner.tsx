import { useMemo, useState } from "react";
import { Check, Gauge, MapPin, Route as RouteIcon, Tag } from "lucide-react";
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
} from "@/lib/trip-data";
import { cn } from "@/lib/utils";

export type { RegionKey };

type HeroPlannerProps = {
  region: RegionKey;
  title: string;
  subtitle: string;
  eyebrow?: string;
};

export function HeroPlanner({ region, title, subtitle, eyebrow }: HeroPlannerProps) {
  const copy = REGION_COPY[region];
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

  const runQuickRoute = (r: QuickRoute) => {
    setOrigin(r.origin);
    setDestination(r.destination);
    setActiveQuick(r.key);
    setStops([]);
    setTrip(estimateAllVariants(region, vehicle, fuel, avoidTolls, ferries, scenic));
    setFerryCrossings(ferries ? detectFerryCrossings(region, r.origin, r.destination) : []);
    setBadges(detectEmissionBadges(region, r.origin, r.destination));
    scrollToResults();
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
              setTrip(estimateAllVariants(region, vehicle, fuel, avoidTolls, ferries, scenic));
              setFerryCrossings(ferries ? detectFerryCrossings(region, origin, destination) : []);
              setBadges(detectEmissionBadges(region, origin, destination));
              requestAnimationFrame(() =>
                document.getElementById("trip-results")?.scrollIntoView({ behavior: "smooth" }),
              );
            }}
            className="glass-panel mt-9 rounded-2xl p-4 shadow-2xl sm:p-6"
          >
            <div className="flex flex-wrap gap-2">
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
                  {v.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
              <label className="relative block">
                <span className="sr-only">Origin</span>
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="h-12 border-border bg-background/60 pl-9 text-base placeholder:text-muted-foreground"
                  placeholder={copy.originHint}
                />
              </label>
              <label className="relative block">
                <span className="sr-only">Destination</span>
                <RouteIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-12 border-border bg-background/60 pl-9 text-base placeholder:text-muted-foreground"
                  placeholder={copy.destinationHint}
                />
              </label>
              <Button type="submit" size="lg" className="h-12 px-8 text-base font-semibold">
                Calculate My Trip Cost →
              </Button>
            </div>

            <div className="mt-5 grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
              <Toggle
                label="✨ Prefer scenic mountain & coastal bypasses"
                checked={scenic}
                onChange={setScenic}
              />
              <Toggle label="🚫 Avoid paid toll roads" checked={avoidTolls} onChange={setAvoidTolls} />
              <Toggle label="⛴️ Include ferry crossings" checked={ferries} onChange={setFerries} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-sm text-foreground/70">Fuel / Power type</span>
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
                  {f.label}
                </button>
              ))}
            </div>

            <div className="mt-6 border-t border-border pt-5">
              <span className="text-sm text-foreground/70">Popular cross-border routes</span>
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
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 grid gap-4 border-t border-border pt-5 lg:grid-cols-[1fr_auto]">
              <div>
                <span className="text-sm text-foreground/70">Transponder / toll tag</span>
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
                        <span className="font-medium">{t.label}</span>
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
                    Fuel &amp; consumption
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-72 border-border bg-card/95 backdrop-blur">
                  <p className="text-sm font-semibold">Fine-tune consumption</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Used to refine fuel &amp; charging estimates for your {vehicle}.
                  </p>
                  <label className="mt-4 block text-xs text-foreground/75">
                    Tank / battery size ({volumeUnit})
                    <Input
                      type="number"
                      min={1}
                      value={tankSize}
                      onChange={(e) => setTankSize(e.target.value)}
                      className="mt-1 h-10 border-border bg-background/60"
                    />
                  </label>
                  <label className="mt-3 block text-xs text-foreground/75">
                    Average consumption ({consumptionUnit})
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
                    Range per fill: ~{range} {defaults.units === "imperial" ? "miles" : "km"}
                  </p>
                </PopoverContent>
              </Popover>
            </div>

            <p className="mt-5 text-xs text-muted-foreground">
              Regional defaults: {defaults.units === "imperial" ? "Imperial (miles, gallons)" : "Metric (km, litres)"} ·{" "}
              {defaults.currencyCode} · {defaults.tollSystems.join(" · ")}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Tolls, vignettes, fuel &amp; charging, ferries — priced to the exact route.
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
            region={region}
            emissionBadges={badges}
            onAddStop={(name) => {
              if (stops.includes(name)) {
                toast.info(`${name} is already a stop on this trip.`);
                return;
              }
              const next = [...stops, name];
              setStops(next);
              setTrip(
                estimateAllVariants(region, vehicle, fuel, avoidTolls, ferries, scenic, next.length),
              );
              toast.success(`${name} added — trip re-routed via ${next.length} extra stop${next.length > 1 ? "s" : ""}.`);
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
