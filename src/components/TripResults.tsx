import { ExternalLink, Download, Save, Share2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { money, type TripEstimate } from "@/lib/trip-data";

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

function buildGpx(trip: TripEstimate, origin: string, destination: string) {
  const wpts = trip.segments
    .flatMap((s) => s.lines)
    .map(
      (l, i) =>
        `  <wpt lat="${(46 + i * 0.35).toFixed(4)}" lon="${(9 + i * 0.4).toFixed(4)}">\n    <name>${l.place.replace(/&/g, "&amp;")}</name>\n    <desc>${l.detail.replace(/&/g, "&amp;")}</desc>\n  </wpt>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="AutoVere" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${origin || "Start"} to ${destination || "Destination"}</name>
    <desc>${trip.distanceLabel} - ${trip.driveTime} - budget ${money(trip.currency, trip.budget)}</desc>
  </metadata>
${wpts}
</gpx>`;
}

export function TripResults({
  trip,
  origin,
  destination,
}: {
  trip: TripEstimate;
  origin: string;
  destination: string;
}) {
  const title = `${origin || "Your start"} → ${destination || "Your destination"}`;

  const exportGpx = () => {
    const blob = new Blob([buildGpx(trip, origin, destination)], { type: "application/gpx+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autovere-${(origin || "trip").toLowerCase().replace(/\W+/g, "-")}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("GPX exported — load it straight into your sat-nav.");
  };

  const saveTrip = () => {
    try {
      const key = "autovere.savedTrips";
      const saved = JSON.parse(localStorage.getItem(key) ?? "[]");
      saved.unshift({
        name: title,
        detail: `${trip.distanceLabel} · ${trip.driveTime} · ${money(trip.currency, trip.budget)} budget`,
        when: `Saved ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`,
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
        <Button size="lg" className="font-semibold" onClick={exportGpx}>
          <Download className="size-4" /> 📥 Export GPX
        </Button>
        <Button size="lg" variant="secondary" onClick={saveTrip}>
          <Save className="size-4" /> 💾 Save to My Garage
        </Button>
        <Button size="lg" variant="outline" onClick={shareTrip}>
          <Share2 className="size-4" /> 🔗 Share Trip
        </Button>
      </div>

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

    </section>
  );
}
