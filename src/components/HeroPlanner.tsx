import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Car, Caravan, Bike, MapPin, Route as RouteIcon } from "lucide-react";

import heroImage from "@/assets/hero-roadtrip.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type RegionKey = "eu" | "us" | "ca";

const REGIONS: { key: RegionKey; label: string; to: string }[] = [
  { key: "eu", label: "Europe", to: "/" },
  { key: "us", label: "USA", to: "/us" },
  { key: "ca", label: "Canada", to: "/ca" },
];

const VEHICLES = [
  { key: "car", label: "Car", icon: Car },
  { key: "motorhome", label: "Motorhome", icon: Caravan },
  { key: "motorcycle", label: "Motorcycle", icon: Bike },
] as const;

type HeroPlannerProps = {
  region: RegionKey;
  eyebrow: string;
  title: string;
  subtitle: string;
};

export function HeroPlanner({ region, eyebrow, title, subtitle }: HeroPlannerProps) {
  const [vehicle, setVehicle] = useState<string>("car");

  return (
    <section className="relative isolate min-h-[100svh] w-full overflow-hidden">
      <img
        src={heroImage}
        alt="Crossover SUV, adventure motorcycle and campervan parked at a coastal mountain overlook at dusk"
        width={1920}
        height={1088}
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
      />
      <div aria-hidden className="hero-overlay absolute inset-0 -z-10" />

      <div className="mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <span className="text-lg font-semibold tracking-tight">
            Auto<span className="text-primary">Vere</span>
          </span>
          <nav className="flex items-center gap-1 rounded-full border border-border bg-background/40 p-1 backdrop-blur-md">
            {REGIONS.map((r) => (
              <Link
                key={r.key}
                to={r.to}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm",
                  region === r.key
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                {r.label}
              </Link>
            ))}
          </nav>
        </header>

        <div className="flex flex-1 flex-col justify-center py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-foreground/80 sm:text-lg">{subtitle}</p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="glass-panel mt-9 rounded-2xl p-4 shadow-2xl sm:p-6"
          >
            <div className="flex flex-wrap gap-2">
              {VEHICLES.map((v) => {
                const Icon = v.icon;
                const active = vehicle === v.key;
                return (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => setVehicle(v.key)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background/50 text-foreground/85 hover:bg-background/70",
                    )}
                  >
                    <Icon className="size-4" />
                    {v.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <label className="relative block">
                <span className="sr-only">Start location</span>
                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-12 border-border bg-background/60 pl-9 text-base placeholder:text-muted-foreground"
                  placeholder="Start city"
                />
              </label>
              <label className="relative block">
                <span className="sr-only">Destination</span>
                <RouteIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-12 border-border bg-background/60 pl-9 text-base placeholder:text-muted-foreground"
                  placeholder="Destination city"
                />
              </label>
              <Button type="submit" size="lg" className="h-12 px-8 text-base font-semibold">
                Calculate trip cost
              </Button>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              Tolls, vignettes, fuel &amp; charging, ferries — priced to the exact route.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
