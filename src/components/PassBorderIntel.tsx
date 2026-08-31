import { ExternalLink, Fuel, Mountain, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  detectBorderCrossings,
  detectBorderTips,
  detectMountainPasses,
  passStatus,
  passTollForVehicle,
} from "@/lib/pass-intel";
import type { RegionKey, VehicleKey } from "@/lib/trip-data";
import { cn } from "@/lib/utils";

const TONE_CLASS = {
  open: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
  warn: "border-amber-400/45 bg-amber-400/12 text-amber-200",
  closed: "border-rose-400/40 bg-rose-400/10 text-rose-200",
} as const;

const TONE_DOT = {
  open: "bg-emerald-400",
  warn: "bg-amber-400",
  closed: "bg-rose-400",
} as const;

export function PassBorderIntel({
  region,
  origin,
  destination,
  vehicle,
  onAddStop,
  onUseSmartBypass,
}: {
  region: RegionKey;
  origin: string;
  destination: string;
  vehicle: VehicleKey;
  onAddStop?: (name: string) => void;
  onUseSmartBypass?: () => void;
}) {
  const passes = detectMountainPasses(region, origin, destination);
  const tips = detectBorderTips(region, origin, destination);
  const crossings = detectBorderCrossings(region, origin, destination);

  return (
    <>
      {/* Mountain pass radar */}
      <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <Mountain className="size-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">
            🏔️ Iconic mountain pass radar
          </h3>
        </div>
        <p className="mt-1 text-sm text-foreground/70">
          Seasonal windows, tolls and live-status pointers for the great passes on your corridor — so
          you arrive at the summit on a day it's genuinely open.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {passes.map((p) => {
            const status = passStatus(p);
            return (
              <article key={p.id} className="rounded-2xl border border-border bg-background/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {p.emoji} {p.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.where}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold",
                      TONE_CLASS[status.tone],
                    )}
                  >
                    <span className={cn("size-1.5 rounded-full", TONE_DOT[status.tone])} />
                    {status.label}
                  </span>
                </div>

                <dl className="mt-4 grid gap-2 text-sm">
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Elevation
                    </dt>
                    <dd className="text-foreground/85">{p.elevation}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Season
                    </dt>
                    <dd className="text-foreground/85">{p.seasonLabel}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="w-24 shrink-0 text-xs uppercase tracking-[0.12em] text-muted-foreground">
                      Toll
                    </dt>
                    <dd className="font-medium text-amber-300">{passTollForVehicle(p, vehicle)}</dd>
                  </div>
                </dl>

                <p className="mt-3 text-sm text-foreground/80">{p.advisory}</p>
                {vehicle === "motorcycle" && p.motoNote && (
                  <p className="mt-2 rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-foreground/90">
                    🏍️ {p.motoNote}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button size="sm" variant="secondary" onClick={() => onAddStop?.(p.name)}>
                    + Add as Stop
                  </Button>
                  <a
                    href={p.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    Live status · {p.portalLabel}
                    <ExternalLink className="size-3.5" />
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Cross-border fuel arbitrage */}
      {tips.length > 0 && (
        <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Fuel className="size-5 text-primary" />
            <h3 className="text-lg font-semibold tracking-tight">
              💡 Cross-border fuel &amp; cost arbitrage
            </h3>
          </div>
          <p className="mt-1 text-sm text-foreground/70">
            Small timing choices at the border add up to a very nice dinner at the other end.
          </p>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
            {tips.map((t) => (
              <article
                key={t.id}
                className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-5"
              >
                <p className="text-sm font-semibold">
                  {t.emoji} Border tip: {t.title}
                </p>
                <p className="mt-2 text-sm text-foreground/85">{t.body}</p>
                <p className="mt-3 text-sm font-semibold text-amber-300">{t.saving}</p>
                {t.action && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="mt-4"
                    onClick={() =>
                      t.id === "ch-vignette" ? onUseSmartBypass?.() : onAddStop?.(t.title)
                    }
                  >
                    {t.action}
                  </Button>
                )}
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Border crossing checkpoints */}
      <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-primary" />
          <h3 className="text-lg font-semibold tracking-tight">
            🛂 Border crossing checkpoints
          </h3>
        </div>
        <p className="mt-1 text-sm text-foreground/70">
          What to expect at each frontier on this route — have the paperwork ready and the crossing is
          a formality.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {crossings.map((c) => {
            const schengen = c.kind === "schengen";
            return (
              <article
                key={c.id}
                className={cn(
                  "rounded-2xl border p-5",
                  schengen ? "border-emerald-400/35 bg-emerald-400/[0.07]" : "border-border bg-background/40",
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">
                      {c.flags} {c.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">Wait: {c.waitLabel}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold",
                      schengen ? TONE_CLASS.open : TONE_CLASS.warn,
                    )}
                  >
                    <span
                      className={cn("size-1.5 rounded-full", schengen ? TONE_DOT.open : TONE_DOT.warn)}
                    />
                    {schengen ? "Schengen" : "Passport & customs"}
                  </span>
                </div>

                <p className="mt-3 text-sm font-medium text-foreground/90">{c.statusLabel}</p>
                <p className="mt-2 text-sm text-foreground/80">{c.body}</p>

                <ul className="mt-4 grid gap-2 text-sm">
                  {c.requirements.map((r) => (
                    <li key={r} className="flex gap-2 text-foreground/85">
                      <span className="mt-0.5 text-primary">✓</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>

                {c.portalUrl && c.portalLabel && (
                  <a
                    href={c.portalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    {c.portalLabel}
                    <ExternalLink className="size-3.5" />
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}
