import { useMemo, useState } from "react";
import { Fuel, Map as MapIcon, Plus, Radar } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MAP_LAYERS,
  buildCampSpots,
  buildCorridorPois,
  buildFuelStops,
  corridorPolyline,
  pointAt,
  type LayerKey,
} from "@/lib/corridor-map";
import { detectMountainPasses, passStatus } from "@/lib/pass-intel";
import type { FerryCrossing, FuelKey, RegionKey, TripEstimate } from "@/lib/trip-data";

const STATUS_COLOR: Record<string, string> = {
  open: "#34d399",
  chains: "#fbbf24",
  seasonal: "#fbbf24",
  closed: "#f87171",
};

export function CorridorMap({
  region,
  trip,
  origin,
  destination,
  ferryCrossings,
  isMotorhome,
  fuel = "petrol",
  onAddStop,
}: {
  region: RegionKey;
  trip: TripEstimate;
  origin: string;
  destination: string;
  ferryCrossings: FerryCrossing[];
  isMotorhome: boolean;
  fuel?: FuelKey;
  onAddStop?: (name: string) => void;
}) {
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    ev: true,
    fuel: true,
    rv: isMotorhome,
    pass: true,
    ferry: true,
  });
  const [hover, setHover] = useState<string | null>(null);

  const from = origin || "Your start";
  const to = destination || "Your destination";

  const line = useMemo(() => corridorPolyline(`${from}|${to}|${trip.variant}`), [from, to, trip.variant]);

  const passes = useMemo(
    () =>
      detectMountainPasses(region, from, to).map((p) => {
        const st = passStatus(p);
        return {
          name: `${p.emoji} ${p.name}`,
          detail: `${p.elevation} · ${st.label}`,
          status: (st.status === "closed" ? "closed" : st.status === "open" ? "open" : "chains") as
            | "open"
            | "closed"
            | "chains",
        };
      }),
    [region, from, to],
  );

  const pois = useMemo(
    () =>
      buildCorridorPois({
        region,
        trip,
        origin: from,
        destination: to,
        ferryNames: ferryCrossings.map((f) => `⛴️ ${f.route}`),
        passes,
      }),
    [region, trip, from, to, ferryCrossings, passes],
  );

  const fuelStops = useMemo(
    () => buildFuelStops({ region, trip, origin: from, destination: to, fuel }),
    [region, trip, from, to, fuel],
  );

  const campSpots = useMemo(
    () => buildCampSpots({ region, trip, origin: from, destination: to }),
    [region, trip, from, to],
  );

  const path = line.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  const visible = pois.filter((p) => layers[p.layer]);

  const sourceGroups = useMemo(() => {
    const map = new Map<string, typeof fuelStops>();
    fuelStops.forEach((s) => {
      const list = map.get(s.source.key) ?? [];
      list.push(s);
      map.set(s.source.key, list);
    });
    return [...map.entries()];
  }, [fuelStops]);

  return (
    <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <MapIcon className="size-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">Corridor radar map</h3>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-[11px] font-medium text-primary">
          {trip.distanceLabel} corridor
        </span>
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        Live service radar along {from} → {to}. Toggle the layers you care about.
      </p>

      {/* Layer toggles */}
      <div className="mt-4 flex flex-wrap gap-2">
        {MAP_LAYERS.map((l) => {
          const on = layers[l.key];
          return (
            <button
              key={l.key}
              type="button"
              onClick={() => setLayers((prev) => ({ ...prev, [l.key]: !prev[l.key] }))}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                on
                  ? "border-primary/50 bg-primary/15 text-foreground"
                  : "border-border bg-background/40 text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={on}
            >
              <span
                className="size-2 rounded-full"
                style={{ background: on ? l.color : "transparent", boxShadow: on ? `0 0 8px ${l.color}` : "none", border: `1px solid ${l.color}` }}
              />
              <span>{l.emoji}</span>
              {l.label}
            </button>
          );
        })}
      </div>

      {/* Map canvas */}
      <div className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-[#070c18]">
        <svg viewBox="0 0 100 100" className="h-[320px] w-full sm:h-[420px]" preserveAspectRatio="none">
          <defs>
            <linearGradient id="corridor-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
            <pattern id="corridor-grid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M8 0H0V8" fill="none" stroke="rgba(148,163,184,0.10)" strokeWidth="0.25" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#corridor-grid)" />
          <path d={path} fill="none" stroke="url(#corridor-stroke)" strokeWidth="2.6" strokeLinecap="round" opacity="0.25" />
          <path d={path} fill="none" stroke="url(#corridor-stroke)" strokeWidth="1.1" strokeLinecap="round" />
          {visible.map((p) => {
            const pt = pointAt(line, p.progress);
            const color =
              p.layer === "pass"
                ? STATUS_COLOR[p.status ?? "open"]!
                : MAP_LAYERS.find((l) => l.key === p.layer)!.color;
            return (
              <circle
                key={p.id}
                cx={pt.x}
                cy={pt.y}
                r={hover === p.id ? 2.2 : 1.4}
                fill={color}
                stroke="#070c18"
                strokeWidth="0.5"
                onMouseEnter={() => setHover(p.id)}
                onMouseLeave={() => setHover(null)}
                className="cursor-pointer transition-all"
              />
            );
          })}
          <circle cx={line[0]!.x} cy={line[0]!.y} r="1.9" fill="#e2e8f0" />
          <circle cx={line[line.length - 1]!.x} cy={line[line.length - 1]!.y} r="1.9" fill="#f59e0b" />
        </svg>

        <span className="pointer-events-none absolute left-4 top-3 rounded-full bg-background/70 px-3 py-1 text-[11px] text-foreground/80">
          📍 {from}
        </span>
        <span className="pointer-events-none absolute bottom-3 right-4 rounded-full bg-background/70 px-3 py-1 text-[11px] text-foreground/80">
          🏁 {to}
        </span>
        {hover && (
          <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 rounded-xl border border-border bg-background/90 px-3 py-2 text-center text-xs shadow-lg">
            <p className="font-semibold">{pois.find((p) => p.id === hover)?.name}</p>
            <p className="text-foreground/70">
              {pois.find((p) => p.id === hover)?.detail} · {pois.find((p) => p.id === hover)?.atLabel} in
            </p>
          </div>
        )}
      </div>

      {/* Legend list */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visible.slice(0, 9).map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/40 px-3 py-2 text-xs"
          >
            <span className="truncate">
              {MAP_LAYERS.find((l) => l.key === p.layer)!.emoji} {p.name}
            </span>
            <span className="shrink-0 text-muted-foreground">{p.price ?? p.atLabel}</span>
          </div>
        ))}
      </div>

      {/* Fuel station price accordion */}
      <div className="mt-8">
        <div className="flex items-center gap-2">
          <Fuel className="size-5 text-primary" />
          <h4 className="text-base font-semibold tracking-tight">Fuel stops &amp; live prices along the route</h4>
        </div>
        <Accordion type="multiple" className="mt-3" defaultValue={sourceGroups.map(([k]) => k)}>
          {sourceGroups.map(([key, stops]) => {
            const source = stops[0]!.source;
            return (
              <AccordionItem key={key} value={key} className="border-border">
                <AccordionTrigger className="text-left">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{stops.length} stations</span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        source.key === "benchmark"
                          ? "border border-border bg-background/60 text-foreground/75"
                          : "border border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
                      )}
                    >
                      {source.key === "benchmark" ? "📊" : "🟢"} {source.badge}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {source.note}{" "}
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Source
                    </a>
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {stops.map((s) => (
                      <article key={s.id} className="rounded-2xl border border-border bg-background/40 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">⛽ {s.brand}</p>
                            <p className="text-xs text-muted-foreground">
                              {s.country} · {s.atLabel} along route
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-primary">{s.price}</p>
                            <p className="text-[11px] text-muted-foreground">{s.priceUnit}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {s.amenities.map((a) => (
                            <span
                              key={a}
                              className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                        <Button size="sm" variant="secondary" className="mt-4" onClick={() => onAddStop?.(s.name)}>
                          <Plus className="mr-1 size-3.5" /> Add as Refuel Stop
                        </Button>
                      </article>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>

      {/* Motorhome camping radar */}
      {isMotorhome && (
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <Radar className="size-5 text-primary" />
            <h4 className="text-base font-semibold tracking-tight">🚐 Motorhome &amp; camping radar</h4>
          </div>
          <p className="mt-1 text-sm text-foreground/70">
            Rated campsites, aires and service points along the active corridor — add any of them straight into your itinerary.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campSpots.map((c) => (
              <article key={c.id} className="rounded-2xl border border-border bg-background/40 p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <span className="shrink-0 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-300">
                    ★ {c.rating}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {c.kind} · {c.atLabel} along route
                </p>
                <p className="mt-2 text-sm font-medium text-primary">{c.price}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <Button size="sm" variant="secondary" className="mt-4" onClick={() => onAddStop?.(c.name)}>
                  <Plus className="mr-1 size-3.5" /> Add to itinerary
                </Button>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
