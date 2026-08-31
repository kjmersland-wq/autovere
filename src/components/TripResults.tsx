import { Download, Save, Share2, ShieldCheck } from "lucide-react";

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
    <div
      className={
        accent
          ? "glass-panel rounded-2xl border-primary/40 p-5"
          : "glass-panel rounded-2xl p-5"
      }
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p
        className={
          accent
            ? "mt-2 text-3xl font-semibold tracking-tight text-primary sm:text-4xl"
            : "mt-2 text-2xl font-semibold tracking-tight sm:text-3xl"
        }
      >
        {value}
      </p>
      <p className="mt-1 text-sm text-foreground/70">{hint}</p>
    </div>
  );
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
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        Your trip is ready
      </p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {origin || "Your start"} → {destination || "Your destination"}
      </h2>
      <p className="mt-2 max-w-2xl text-foreground/75">
        Here is everything you'll spend on the road — no surprises at the barrier, just a clear
        budget so you can enjoy the drive.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          accent
          label="Estimated Trip Budget"
          value={money(trip.currency, trip.budget)}
          hint="Tolls, energy and running costs"
        />
        <MetricCard
          label="Distance & Drive Time"
          value={trip.distanceLabel}
          hint={`${trip.driveTime} behind the wheel`}
        />
        <MetricCard
          label="Tolls & Vignettes"
          value={money(trip.currency, trip.tolls)}
          hint="Localized, checkpoint by checkpoint"
        />
        <MetricCard
          label={trip.energyLabel}
          value={money(trip.currency, trip.energyCost)}
          hint={`Approx. ${trip.energyAmount} for the route`}
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="glass-panel rounded-2xl p-5 sm:p-6">
          <h3 className="text-lg font-semibold tracking-tight">Country & state breakdown</h3>
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
                          <span className="text-sm font-semibold">
                            {money(trip.currency, line.amount)}
                          </span>
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
          <ul className="mt-4 grid gap-3">
            {trip.safety.tips.map((tip) => (
              <li
                key={tip}
                className="rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground/85"
              >
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button size="lg" className="font-semibold">
          <Download className="size-4" /> Download GPX File
        </Button>
        <Button size="lg" variant="secondary">
          <Save className="size-4" /> Save to My Garage
        </Button>
        <Button size="lg" variant="outline">
          <Share2 className="size-4" /> Share Road Trip
        </Button>
      </div>
    </section>
  );
}
