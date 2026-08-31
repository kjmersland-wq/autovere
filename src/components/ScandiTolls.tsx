import { ExternalLink, Landmark, Waypoints } from "lucide-react";

import {
  NORWAY_CITY_RINGS,
  NORWAY_HIGHWAY_SEGMENTS,
  NORWAY_PAYMENT_OPTIONS,
  type ScandiBridge,
} from "@/lib/trip-data";

const nok = (value: number) => `${value} NOK`;

function PortalLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
    >
      {label} <ExternalLink className="size-3" />
    </a>
  );
}

export function NorwayAutoPassCard({ isMotorcycle }: { isMotorcycle: boolean }) {
  return (
    <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Waypoints className="size-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">🇳🇴 Norwegian AutoPASS breakdown</h3>
        {isMotorcycle && (
          <span className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary">
            🏍️ Motorcycles: 0 NOK in every city ring
          </span>
        )}
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        Norway has no toll booths — every passing is read by a gantry and billed afterwards. Here is what
        your corridor costs, and how to pay it without an admin fee.
      </p>

      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        City toll rings
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {NORWAY_CITY_RINGS.map((ring) => (
          <div key={ring.id} className="rounded-2xl border border-border bg-background/40 p-4">
            <p className="text-sm font-semibold">
              {ring.emoji} {ring.city}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span
                className={
                  isMotorcycle
                    ? "rounded-full border border-primary/50 bg-primary/15 px-3 py-1 font-semibold text-primary"
                    : "rounded-full border border-border bg-background/60 px-3 py-1 text-foreground/70"
                }
              >
                🏍️ Motorcycle {nok(ring.motorcycle)}
                {isMotorcycle ? " — exempt" : ""}
              </span>
              <span
                className={
                  isMotorcycle
                    ? "rounded-full border border-border bg-background/60 px-3 py-1 text-foreground/70"
                    : "rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary"
                }
              >
                ⛽ Petrol / diesel {nok(ring.petrol)}
              </span>
              <span className="rounded-full border border-border bg-background/60 px-3 py-1 text-foreground/70">
                ⚡ EV {nok(ring.ev)}
              </span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{ring.note}</p>
            <PoiLinks kind="toll" name={`${ring.city} bomring`} where="Norway" region="eu" />
          </div>
        ))}
      </div>

      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        Main highway toll segments
      </p>
      <div className="mt-3 grid gap-2">
        {NORWAY_HIGHWAY_SEGMENTS.map((seg) => (
          <div
            key={seg.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-background/40 px-4 py-3"
          >
            <div className="min-w-[220px] flex-1">
              <p className="text-sm font-semibold">
                {seg.road} · {seg.stretch}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{seg.note}</p>
            </div>
            <div className="text-right text-sm">
              <p className="font-semibold">
                {isMotorcycle ? nok(seg.motorcycle) : nok(seg.car)}
              </p>
              <p className="text-xs text-muted-foreground">
                {isMotorcycle ? "Motorcycle rate" : "Car with AutoPASS tag"}
              </p>
            </div>
          </div>
        ))}
      </div>
      {isMotorcycle && (
        <p className="mt-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-foreground/85">
          🏍️ Two-wheelers are exempt from Norwegian toll rings and highway gantries — budget only for
          ferries and fuel.
        </p>
      )}

      <p className="mt-7 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        How to pay — AutoPASS vs EPASS24
      </p>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {NORWAY_PAYMENT_OPTIONS.map((opt) => (
          <div key={opt.id} className="rounded-2xl border border-border bg-background/40 p-4">
            <p className="text-sm font-semibold">{opt.title}</p>
            <span className="mt-2 inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
              {opt.badge}
            </span>
            <p className="mt-2 text-xs text-muted-foreground">{opt.body}</p>
            <div className="mt-3">
              <PortalLink label={opt.portalLabel} url={opt.portalUrl} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ScandiBridgeCard({
  bridges,
  isMotorcycle,
}: {
  bridges: ScandiBridge[];
  isMotorcycle: boolean;
}) {
  if (bridges.length === 0) return null;
  return (
    <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Landmark className="size-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">🌉 Scandinavian bridge crossings</h3>
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        Fixed links between Denmark and Sweden are tolled separately from motorway charges — a transponder
        pays for itself on the first return trip.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {bridges.map((b) => (
          <div key={b.id} className="rounded-2xl border border-border bg-background/40 p-4">
            <p className="text-sm font-semibold">
              {b.emoji} {b.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{b.crossing}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span
                className={
                  isMotorcycle
                    ? "rounded-full border border-border bg-background/60 px-3 py-1 text-foreground/70"
                    : "rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary"
                }
              >
                🚗 {b.carPrice}
              </span>
              <span
                className={
                  isMotorcycle
                    ? "rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-semibold text-primary"
                    : "rounded-full border border-border bg-background/60 px-3 py-1 text-foreground/70"
                }
              >
                🏍️ {b.motoPrice}
              </span>
            </div>
            <p className="mt-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200">
              💳 {b.transponder}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{b.note}</p>
            <div className="mt-3">
              <PortalLink label={b.portalLabel} url={b.portalUrl} />
            </div>
            <PoiLinks kind="toll" name={b.name} where={b.crossing} region="eu" website={b.portalUrl} />
          </div>
        ))}
      </div>
    </div>
  );
}
