import { Suspense, lazy, useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { Fuel, Map as MapIcon, Plus, Radar } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PoiLinks } from "@/components/PoiLinks";
import { cn } from "@/lib/utils";
import {
  MAP_LAYERS,
  buildCampSpots,
  buildCorridorPois,
  buildFuelStops,
  operatorColor,
  corridorPolyline,
  pointAt,
  type LayerKey,
} from "@/lib/corridor-map";
import { useT, useTr } from "@/lib/i18n";
import { getRouteGeo } from "@/lib/route-geo.functions";
import { poiMapUrl } from "@/lib/poi-links";
import { detectMountainPasses, passStatus } from "@/lib/pass-intel";
import {
  ROUTE_VARIANTS,
  evComparison,
  variantComparison,
  type FerryCrossing,
  type FuelKey,
  type RegionKey,
  type RouteVariantKey,
  type TripEstimate,
  type VehicleKey,
} from "@/lib/trip-data";
import { convert, currencyFromSymbol, formatCurrency, useMoney } from "@/lib/currency";

const LiveMap = lazy(() => import("@/components/LiveMap"));

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
  trips,
  activeVariant,
  onVariantChange,
  vehicle = "car",
}: {
  region: RegionKey;
  trip: TripEstimate;
  trips?: Record<RouteVariantKey, TripEstimate>;
  activeVariant?: RouteVariantKey;
  onVariantChange?: (v: RouteVariantKey) => void;
  vehicle?: VehicleKey;
  origin: string;
  destination: string;
  ferryCrossings: FerryCrossing[];
  isMotorhome: boolean;
  fuel?: FuelKey;
  onAddStop?: (name: string) => void;
}) {
  const t = useT();
  const tr = useTr();
  const m = useMoney(trip.currency);
  const ev = evComparison(trip, vehicle, fuel);
  const isElectric = fuel === "electric";
  const [layers, setLayers] = useState<Record<LayerKey, boolean>>({
    ev: true,
    fuel: !isElectric,
    rv: isMotorhome,
    pass: true,
    ferry: true,
    view: true,
  });
  const [hover, setHover] = useState<string | null>(null);

  const from = origin || t.map.yourStart;
  const to = destination || t.map.yourDestination;

  const line = useMemo(() => corridorPolyline(`${from}|${to}|${trip.variant}`), [from, to, trip.variant]);

  const passes = useMemo(
    () =>
      detectMountainPasses(trip.corridor?.coords).map((p) => {
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
    [trip.corridor?.coords],
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

  const routeFn = useServerFn(getRouteGeo);
  const geoQuery = useQuery({
    queryKey: ["route-geo", from, to],
    queryFn: () => routeFn({ data: { origin: from, destination: to } }),
    staleTime: 1000 * 60 * 60,
    retry: 0,
  });
  const geo = geoQuery.data ?? null;

  const liveMarkers = useMemo(() => {
    if (!geo) return [];
    const c = geo.coords;
    return pois
      .filter((p) => layers[p.layer])
      .map((p) => {
        const idx = Math.min(c.length - 1, Math.max(0, Math.round(p.progress * (c.length - 1))));
        const pos = c[idx]!;
        const layer = MAP_LAYERS.find((l) => l.key === p.layer)!;
        const power = p.layer === "ev" || p.layer === "fuel" ? (p.detail.split("·")[0] ?? "").trim() : "";
        return {
          id: p.id,
          lat: pos[0],
          lng: pos[1],
          color:
            p.layer === "pass"
              ? STATUS_COLOR[p.status ?? "open"]!
              : p.layer === "ev"
                ? operatorColor(p.name, layer.color)
                : layer.color,
          emoji: p.icon ?? layer.emoji,
          title: tr(p.name),
          subtitle: tr(p.detail),
          power: power ? tr(power) : undefined,
          distanceLabel: `${p.atLabel} ${t.map.alongRoute}`,
          priceLines:
            p.layer === "ev" && p.kwhEur
              ? [
                  `${tr("Est. rate")}: ${formatCurrency(convert(p.kwhEur, "EUR", m.display), m.display, { decimals: 2 })} / kWh`,
                ]
              : p.layer === "fuel" && p.petrolEur && p.dieselEur
                ? [
                    `${tr("Petrol 95")}: ${formatCurrency(convert(p.petrolEur, "EUR", m.display), m.display, { decimals: 2 })} / L`,
                    `${tr("Diesel")}: ${formatCurrency(convert(p.dieselEur, "EUR", m.display), m.display, { decimals: 2 })} / L`,
                  ]
                : undefined,
          mapUrl: poiMapUrl(p.name, `${from} ${to}`),
        };
      });
  }, [geo, pois, layers, tr, from, to, t, m.display]);

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
        <h3 className="text-lg font-semibold tracking-tight">{t.map.title}</h3>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-[11px] font-medium text-primary">
          {t.map.corridorBadge(trip.distanceLabel)}
        </span>
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        {t.map.intro(from, to)}
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
              {tr(l.label)}
            </button>
          );
        })}
      </div>

      {trips && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t.map.routesTitle}
          </p>
          <p className="mt-1 text-sm text-foreground/70">{t.map.routesIntro}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {ROUTE_VARIANTS.map((v) => {
              const vt = trips[v.key];
              const on = (activeVariant ?? trip.variant) === v.key;
              const cmp = variantComparison(trips.fastest, vt);
              const perHour =
                cmp.hoursAdded > 0.05 ? cmp.saved / cmp.hoursAdded : null;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => onVariantChange?.(v.key)}
                  aria-pressed={on}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-colors",
                    on
                      ? "border-primary bg-primary/15 shadow-[0_0_0_1px_rgba(245,158,11,0.25)]"
                      : "border-border bg-background/40 hover:border-primary/50 hover:bg-background/60",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">
                      {v.emoji} {t.results.variants[v.key].label}
                    </span>
                    {on && (
                      <span className="rounded-full border border-primary/50 bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {t.map.activeBadge}
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block text-xl font-semibold tracking-tight">
                    {m.fmt(vt.budget, 0)}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {m.fmt(vt.tolls + vt.ferries, 0)} {t.map.tollsShort} · {vt.driveTime} · {vt.distanceLabel}
                  </span>
                  {v.key !== "fastest" && (
                    <span className="mt-2 flex flex-wrap gap-1.5 text-[11px] font-medium">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5",
                          cmp.saved >= 0
                            ? "bg-emerald-400/15 text-emerald-300"
                            : "bg-rose-400/15 text-rose-300",
                        )}
                      >
                        {cmp.saved >= 0 ? t.map.saves : t.map.costsExtra} {m.fmt(Math.abs(cmp.saved), 0)}
                      </span>
                      <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-amber-300">
                        {cmp.timeLabel}
                      </span>
                    </span>
                  )}
                  {v.key !== "fastest" && perHour !== null && perHour > 0 && (
                    <span className="mt-2 block text-[11px] text-foreground/70">
                      💡 {t.map.perHour(m.fmt(perHour, 0))}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-2xl border border-teal/30 bg-teal/5 p-4">
            <p className="text-sm font-semibold">{t.map.evTitle}</p>
            <p className="mt-1 text-sm text-foreground/75">
              {ev.isElectric
                ? t.map.evAlready
                : t.map.evIntro(m.fmt(ev.fuelCost, 0), m.fmt(ev.evCost, 0))}
            </p>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold">
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
              <span className="rounded-full border border-border bg-background/50 px-3 py-1 text-foreground/75">
                {t.map.evEnergy(`${ev.kwh} kWh`, `${ev.litres} L`)}
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Map canvas */}
      {geo && geo.coords.length > 1 ? (
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-[#070c18]">
          <ClientOnly fallback={<div className="h-[320px] w-full animate-pulse bg-background/40 sm:h-[420px]" />}>
            <Suspense fallback={<div className="h-[320px] w-full animate-pulse bg-background/40 sm:h-[420px]" />}>
              <LiveMap
                coords={geo.coords}
                markers={liveMarkers}
                fromLabel={from}
                toLabel={to}
                openLabel={tr("Open in Google Maps")}
              />

            </Suspense>
          </ClientOnly>
        </div>
      ) : (
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
            <p className="font-semibold">{tr(pois.find((p) => p.id === hover)?.name ?? "")}</p>
            <p className="text-foreground/70">
              {tr(pois.find((p) => p.id === hover)?.detail ?? "")} ·{" "}
              {pois.find((p) => p.id === hover)?.atLabel} {t.map.tooltipIn}
            </p>
          </div>
        )}
      </div>
      )}
      {geoQuery.isLoading && (
        <p className="mt-2 text-[11px] text-muted-foreground">🛰️ {from} → {to}…</p>
      )}

      {/* Legend list */}
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {visible.slice(0, 12).map((p) => (
          <div
            key={p.id}
            className="rounded-xl border border-border bg-background/40 px-3 py-2 text-xs"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate">
                {p.icon ?? MAP_LAYERS.find((l) => l.key === p.layer)!.emoji} {tr(p.name)}
              </span>
              <span className="shrink-0 text-muted-foreground">{p.price ?? p.atLabel}</span>
            </div>
            <PoiLinks
              kind={p.layer === "rv" ? "camp" : p.layer === "view" ? "place" : p.layer}
              name={p.name}
              where={`${origin} ${destination}`}
              region={region}
              className="mt-2"
            />
          </div>
        ))}
      </div>

      {/* Fuel station price accordion — hidden entirely for electric vehicles */}
      {!isElectric && (
      <div className="mt-8">
        <div className="flex items-center gap-2">
          <Fuel className="size-5 text-primary" />
          <h4 className="text-base font-semibold tracking-tight">{t.map.fuelTitle}</h4>
        </div>
        <Accordion type="multiple" className="mt-3" defaultValue={sourceGroups.map(([k]) => k)}>
          {sourceGroups.map(([key, stops]) => {
            const source = stops[0]!.source;
            return (
              <AccordionItem key={key} value={key} className="border-border">
                <AccordionTrigger className="text-left">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-medium">{t.map.stations(stops.length)}</span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        source.key === "benchmark"
                          ? "border border-border bg-background/60 text-foreground/75"
                          : "border border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
                      )}
                    >
                      {source.key === "benchmark" ? "📊" : "🟢"} {tr(source.badge)}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3 text-xs text-muted-foreground">
                    {tr(source.note)}{" "}
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {t.map.source}
                    </a>
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    {stops.map((s) => (
                      <article key={s.id} className="rounded-2xl border border-border bg-background/40 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">⛽ {s.brand}</p>
                            <p className="text-xs text-muted-foreground">
                              {tr(s.country)} · {s.atLabel} {t.map.alongRoute}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-primary">
                              {formatCurrency(
                                convert(s.priceValue, currencyFromSymbol(s.priceSymbol), m.display),
                                m.display,
                                { decimals: 2 },
                              )}
                            </p>
                            <p className="text-[11px] text-muted-foreground">{tr(s.priceUnit)}</p>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {s.amenities.map((a) => (
                            <span
                              key={a}
                              className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                            >
                              {tr(a)}
                            </span>
                          ))}
                        </div>
                        <PoiLinks kind="fuel" name={s.name} where={s.country} region={region} />
                        <Button size="sm" variant="secondary" className="mt-3" onClick={() => onAddStop?.(s.name)}>
                          <Plus className="mr-1 size-3.5" /> {t.map.addRefuel}
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
      )}

      {/* Motorhome camping radar */}
      {isMotorhome && (
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <Radar className="size-5 text-primary" />
            <h4 className="text-base font-semibold tracking-tight">{t.map.campTitle}</h4>
          </div>
          <p className="mt-1 text-sm text-foreground/70">
            {t.map.campIntro}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {campSpots.map((c) => (
              <article key={c.id} className="rounded-2xl border border-border bg-background/40 p-5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold">{tr(c.name)}</p>
                  <span className="shrink-0 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[11px] text-amber-300">
                    ★ {c.rating}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tr(c.kind)} · {c.atLabel} {t.map.alongRoute}
                </p>
                <p className="mt-2 text-sm font-medium text-primary">{c.price}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.services.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                    >
                      {tr(s)}
                    </span>
                  ))}
                </div>
                <PoiLinks kind="camp" name={c.name} where={`${origin} ${destination}`} region={region} />
                <Button size="sm" variant="secondary" className="mt-3" onClick={() => onAddStop?.(c.name)}>
                  <Plus className="mr-1 size-3.5" /> {t.map.addItinerary}
                </Button>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
