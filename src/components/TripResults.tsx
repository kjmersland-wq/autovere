import { useState } from "react";
import { ExternalLink, Mountain, Save, Share2, ShieldCheck, Ship } from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { RouteExportPanel } from "@/components/RouteExportPanel";
import { NorwayAutoPassCard, ScandiBridgeCard } from "@/components/ScandiTolls";
import { PassBorderIntel } from "@/components/PassBorderIntel";
import { CorridorMap } from "@/components/CorridorMap";
import { cn } from "@/lib/utils";
import {
  money,
  ROUTE_VARIANTS,
  RV_POIS,
  SCENIC_HIGHLIGHTS,
  detectScandiBridges,
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

function SubtotalBadge({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 text-sm">
      <span>{emoji}</span>
      <span className="text-foreground/75">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </span>
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
  const [active, setActive] = useState<RouteVariantKey>("fastest");
  const [rvMode, setRvMode] = useState(isMotorhome);
  const highlights = SCENIC_HIGHLIGHTS[region];
  const rvPois = RV_POIS[region];
  const trip = trips[active];
  const comparison = variantComparison(trips.fastest, trip);
  const title = `${origin || "Your start"} → ${destination || "Your destination"}`;
  const showNorway = region === "eu" && routeTouchesNorway(origin, destination);
  const bridges = detectScandiBridges(region, origin, destination);


  const saveTrip = () => {
    try {
      const key = "autovere.savedTrips";
      const saved = JSON.parse(localStorage.getItem(key) ?? "[]");
      saved.unshift({
        id: Math.random().toString(36).slice(2, 10),
        name: title,
        origin: origin || "Your start",
        destination: destination || "Your destination",
        detail: `${trip.distanceLabel} · ${trip.driveTime} · ${money(trip.currency, trip.budget)} budget`,
        when: `Saved ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
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
      });
      localStorage.setItem(key, JSON.stringify(saved.slice(0, 20)));
      toast.success("Saved to My Garage — it's waiting whenever you're ready.");
    } catch {
      toast.error("Couldn't save this trip right now.");
    }
  };


  const shareTrip = async () => {
    const text = `${title} — ${trip.distanceLabel}, ${trip.driveTime}, ${money(trip.currency, trip.budget)} with AutoVere`;
    try {
      if (navigator.share) await navigator.share({ title: "AutoVere road trip", text, url: window.location.href });
      else {
        await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
        toast.success("Trip link copied — share the adventure.");
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Your trip is ready</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-2 max-w-2xl text-foreground/75">
        Here is everything you'll spend on the road — no surprises at the barrier, just a clear budget
        so you can enjoy the drive.
      </p>

      <div className="mt-8 grid gap-3">
        <div className="flex flex-wrap gap-2">
          {ROUTE_VARIANTS.map((v) => {
            const t = trips[v.key];
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
                  {v.emoji} {v.label}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {money(t.currency, t.tolls + t.ferries)} tolls · {t.driveTime} · {t.distanceLabel}
                </span>
              </button>
            );
          })}
        </div>
        <div className="glass-panel flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl px-5 py-4">
          <p className="text-sm text-foreground/80">
            {ROUTE_VARIANTS.find((v) => v.key === active)?.blurb}
          </p>
          {active !== "fastest" && (
            <span className="flex flex-wrap items-center gap-3 text-sm">
              <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary">
                Money saved: {comparison.savedLabel}
              </span>
              <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 font-semibold text-amber-300">
                Time added: {comparison.timeLabel}
              </span>
            </span>
          )}
        </div>
      </div>



      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          accent
          label="Total Trip Budget"
          value={money(trip.currency, trip.budget)}
          hint="Tolls, energy, ferries and running costs"
        />
        <MetricCard label="Distance" value={trip.distanceLabel} hint="Door to door, your chosen route" />
        <MetricCard label="Driving Time" value={trip.driveTime} hint="Moving time, breaks excluded" />
        <MetricCard
          label={trip.energyLabel}
          value={money(trip.currency, trip.energyCost)}
          hint={`Approx. ${trip.energyAmount} for the route`}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <SubtotalBadge emoji="🛣️" label="Tolls & Vignettes" value={money(trip.currency, trip.tolls)} />
        <SubtotalBadge emoji="⛽" label={`${trip.energyLabel}`} value={money(trip.currency, trip.energyCost)} />
        <SubtotalBadge emoji="⛴️" label="Ferries & Mountain Passes" value={money(trip.currency, trip.ferries)} />
      </div>

      {trip.discountNote && (
        <p className="mt-4 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground/85">
          🏍️ {trip.discountNote}
        </p>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <Button size="lg" variant="secondary" onClick={saveTrip}>
          <Save className="size-4" /> 💾 Save to My Garage
        </Button>
        <Button size="lg" variant="outline" onClick={shareTrip}>
          <Share2 className="size-4" /> 🔗 Share Trip
        </Button>
      </div>

      <RouteExportPanel trip={trip} origin={origin} destination={destination} />

      {showNorway && <NorwayAutoPassCard isMotorcycle={isMotorcycle} />}
      <ScandiBridgeCard bridges={bridges} isMotorcycle={isMotorcycle} />

      {ferryCrossings.length > 0 && (
        <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Ship className="size-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">⛴️ Ferry & marine crossings detected</h3>
          </div>
          <p className="mt-1 text-sm text-foreground/70">
            Your route touches water — here's every crossing with live-style timings and a direct link to
            the official booking desk.
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {ferryCrossings.map((f) => (
              <article key={f.id} className="rounded-2xl border border-border bg-background/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{f.corridor}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{f.route}</p>
                  </div>
                  {f.badge && (
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                      {f.badge}
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
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Duration</dt>
                    <dd className="mt-0.5 text-sm font-medium">{f.duration}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Frequency</dt>
                    <dd className="mt-0.5 text-sm font-medium">{f.frequency}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Indicative</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-primary">
                      {isMotorcycle && f.motoPrice ? f.motoPrice : f.price}
                    </dd>
                  </div>
                </dl>

                <p className="mt-4 text-sm text-foreground/80">{f.note}</p>

                <a
                  href={f.booking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20"
                >
                  Official booking · {f.booking.label}
                  <ExternalLink className="size-3.5" />
                </a>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold tracking-tight">Country & state breakdown</h3>
          <p className="mt-1 text-sm text-foreground/70">
            Every checkpoint itemised, with direct links to the official portals.
          </p>
          <Accordion type="single" collapsible className="mt-2">
            {trip.segments.map((segment) => (
              <AccordionItem key={segment.country} value={segment.country}>
                <AccordionTrigger className="text-left">
                  <span className="flex w-full items-center justify-between gap-4 pr-3">
                    <span className="font-medium">{segment.country}</span>
                    <span className="text-primary">{money(trip.currency, segment.total)}</span>
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
                          <span className="block text-sm font-medium">{line.place}</span>
                          <span className="block text-xs text-muted-foreground">{line.detail}</span>
                        </span>
                        <span className="flex items-center gap-2">
                          {line.badge && (
                            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary">
                              {line.badge}
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
                          <span className="text-sm font-semibold">{money(trip.currency, line.amount)}</span>
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
            <h3 className="text-lg font-semibold tracking-tight">🛡️ {trip.safety.title}</h3>
          </div>
          <div className="mt-4 grid gap-5">
            {trip.safety.sections.map((section) => (
              <div key={section.heading}>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {section.heading}
                </p>
                <ul className="mt-2 grid gap-2">
                  {section.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground/85"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {trip.vignette && (
        <div className="glass-panel mt-6 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight">🏷️ Smart Vignette Period Optimizer</h3>
            <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {trip.tripType === "return"
                ? `Return trip · ${trip.vignette.daysCovered} day${trip.vignette.daysCovered > 1 ? "s" : ""} covered`
                : "One-way transit · single leg"}
            </span>
          </div>

          <p className="mt-3 rounded-xl border border-primary/40 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            {trip.vignette.headline}
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
                    {v.exempt ? "Exempt" : `${v.currency}${v.cost.toFixed(2)}`}
                  </p>
                </div>

                <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Recommended: {v.recommendation}
                </p>
                {v.saved > 0 && (
                  <p className="mt-2 text-xs font-medium text-emerald-400">
                    💡 Saves {v.currency}{v.saved.toFixed(2)} vs the usual {v.baselineLabel} ({v.currency}
                    {v.baselineCost.toFixed(2)})
                  </p>
                )}
                <p className="mt-2 text-sm text-foreground/80">{v.note}</p>

                <a
                  href={v.portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-foreground/85 hover:border-primary/50 hover:text-primary"
                >
                  Buy at {v.portal.label}
                  <ExternalLink className="size-3" />
                </a>
              </article>
            ))}
          </div>

          <p className="mt-4 text-sm text-foreground/75">
            Optimised vignette cover for this route:{" "}
            <span className="font-semibold text-foreground">€{trip.vignette.total.toFixed(2)}</span>
            {trip.vignette.totalSaved > 0 && (
              <span className="text-emerald-400"> · €{trip.vignette.totalSaved.toFixed(2)} saved by smart tier selection</span>
            )}
            . Distance tolls and ferry tickets are charged per crossing
            {trip.tripType === "return" ? " and doubled for your return leg." : "."}
          </p>
        </div>
      )}


      <div className="glass-panel mt-6 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{trip.optimizer.title}</h3>
          <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {trip.optimizer.rangeLabel}
          </span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{trip.optimizer.bufferLabel}</p>

        {trip.optimizer.networks.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {trip.optimizer.networks.map((n) => (
              <span
                key={n}
                className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium text-foreground/85"
              >
                🔌 {n}
              </span>
            ))}
          </div>
        )}

        <ol className="mt-5 grid gap-3 md:grid-cols-2">
          {trip.optimizer.stops.map((stop, i) => (
            <li
              key={`${stop.name}-${i}`}
              className="rounded-xl border border-border bg-background/40 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold">
                  {i + 1}. {stop.name}
                </p>
                <span className="shrink-0 text-xs text-muted-foreground">at {stop.atLabel}</span>
              </div>
              <p className="mt-1 text-xs font-medium text-primary">{stop.power}</p>
              <p className="mt-2 text-sm text-foreground/80">{stop.note}</p>
              {stop.networks.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {stop.networks.map((n) => (
                    <span
                      key={n}
                      className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ol>

        {trip.optimizer.arbitrage.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Border fuel arbitrage
            </p>
            <ul className="mt-2 grid gap-2">
              {trip.optimizer.arbitrage.map((tip) => (
                <li
                  key={tip}
                  className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground/85"
                >
                  💡 Tip: {tip}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Long-stretch alerts (&gt;180 km without a verified station)
          </p>
          <ul className="mt-2 grid gap-2">
            {trip.optimizer.longStretch.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-foreground/90"
              >
                ⚠️ {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {emissionBadges.length > 0 && (
        <div className="mt-10">
          <h3 className="text-lg font-semibold tracking-tight">🌱 Environmental &amp; emission badge radar</h3>
          <p className="mt-1 text-sm text-foreground/70">
            Sort these before you leave home — badges are checked at the city boundary, not at the border.
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
                  Official info · {b.portalLabel}
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
        origin={origin}
        destination={destination}
        ferryCrossings={ferryCrossings}
        isMotorhome={isMotorhome}
        fuel={fuel}
        {...(onAddStop ? { onAddStop } : {})}
      />

      <PassBorderIntel
        region={region}
        origin={origin}
        destination={destination}
        vehicle={isMotorcycle ? "motorcycle" : isMotorhome ? "motorhome" : "car"}
        {...(onAddStop ? { onAddStop } : {})}
        onUseSmartBypass={() => setActive("smart")}
      />



      <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Mountain className="size-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">Scenic &amp; road trip highlights</h3>
          </div>
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-border bg-background/50 px-4 py-2 text-sm">
            <span className="text-foreground/85">🚐 Show RV campgrounds &amp; service areas</span>
            <Switch checked={rvMode} onCheckedChange={setRvMode} />
          </label>
        </div>
        <p className="mt-1 text-sm text-foreground/70">
          Viewpoints and iconic passes worth the detour along your corridor.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {highlights.map((h) => (
            <article key={h.id} className="rounded-2xl border border-border bg-background/40 p-5">
              <p className="text-sm font-semibold">
                {h.emoji} {h.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{h.where}</p>
              <p className="mt-2 text-sm text-foreground/80">{h.note}</p>
              <p className="mt-3 text-xs font-medium text-primary">Open: {h.season}</p>
              <Button
                size="sm"
                variant="secondary"
                className="mt-4"
                onClick={() => onAddStop?.(h.name)}
              >
                + Add as Stop
              </Button>
            </article>
          ))}
        </div>

        {rvMode && (
          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              🚐 RV campgrounds &amp; service areas along the corridor
            </p>
            <div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {rvPois.map((p) => (
                <article key={p.id} className="rounded-2xl border border-border bg-background/40 p-5">
                  <p className="text-sm font-semibold">
                    {p.emoji} {p.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{p.where}</p>
                  <p className="mt-2 text-sm text-foreground/80">{p.note}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.services.map((s) => (
                      <span
                        key={s}
                        className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-4"
                    onClick={() => onAddStop?.(p.name)}
                  >
                    + Add as Stop
                  </Button>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>

    </section>
  );
}
