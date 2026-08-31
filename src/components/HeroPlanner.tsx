import { useState } from "react";
import { MapPin, Route as RouteIcon } from "lucide-react";

import heroImage from "@/assets/hero-roadtrip.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { TripResults } from "@/components/TripResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  estimateTrip,
  FUELS,
  REGION_COPY,
  VEHICLES,
  type FuelKey,
  type RegionKey,
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
  const [vehicle, setVehicle] = useState<VehicleKey>("car");
  const [fuel, setFuel] = useState<FuelKey>("petrol");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [scenic, setScenic] = useState(true);
  const [avoidTolls, setAvoidTolls] = useState(false);
  const [ferries, setFerries] = useState(true);
  const [trip, setTrip] = useState<TripEstimate | null>(null);

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
              setTrip(estimateTrip(region, vehicle, fuel, avoidTolls, ferries, scenic));
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

            <p className="mt-4 text-xs text-muted-foreground">
              Tolls, vignettes, fuel &amp; charging, ferries — priced to the exact route.
            </p>
          </form>
        </div>
      </section>

      <div id="trip-results">
        {trip && <TripResults trip={trip} origin={origin} destination={destination} />}
      </div>
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
