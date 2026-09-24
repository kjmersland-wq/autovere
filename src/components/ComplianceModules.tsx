import { useMemo, useState } from "react";
import { BadgeCheck, ExternalLink, Gauge, Radio, Ruler, Wind } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  CLEARANCE_ADVISORIES,
  HEAVY_SYSTEMS,
  MOTORHOME_SPEED_RULES,
  detectLezZones,
  tagSavings,
  tagsForRegion,
} from "@/lib/compliance";
import { useT, useTr } from "@/lib/i18n";
import { money, type RegionKey, type TripEstimate } from "@/lib/trip-data";

function Portal({ label, url }: { label: string; url: string }) {
  const t = useT();
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
    >
      {t.compliance.officialPortal} · {label}
      <ExternalLink className="size-3.5" />
    </a>
  );
}

export function MotorhomeClearanceRadar({ region }: { region: RegionKey }) {
  const t = useT();
  const tr = useTr();
  const [heavy, setHeavy] = useState(false);
  const [height, setHeight] = useState(3.2);

  const systems = region === "eu" ? HEAVY_SYSTEMS : [];

  return (
    <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Ruler className="size-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">{t.compliance.clearanceTitle}</h3>
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        {t.compliance.clearanceIntro}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/40 p-4">
          <span>
            <span className="text-sm font-semibold">{t.compliance.heavyToggle}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {t.compliance.heavyHint}
            </span>
          </span>
          <Switch checked={heavy} onCheckedChange={setHeavy} />
        </label>

        <div className="rounded-2xl border border-border bg-background/40 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-semibold">{t.compliance.heightLabel}</span>
            <span className="text-lg font-semibold text-primary">{height.toFixed(2)} m</span>
          </div>
          <input
            type="range"
            min={2.4}
            max={4.2}
            step={0.05}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="mt-3 w-full accent-primary"
            aria-label={t.compliance.heightAria}
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {t.compliance.heightHint}
          </p>
        </div>
      </div>

      {heavy && systems.length > 0 && (
        <div className="mt-6">
          <p className="rounded-2xl border border-amber-400/40 bg-amber-400/10 p-4 text-sm text-amber-100">
            {t.compliance.heavyWarning}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {systems.map((s) => (
              <article key={s.id} className="rounded-2xl border border-border bg-background/40 p-5">
                <p className="text-sm font-semibold">
                  {s.flag} {tr(s.country)} · {tr(s.system)}
                </p>
                <p className="mt-2 text-sm text-foreground/80">{tr(s.body)}</p>
                <Portal label={s.portalLabel} url={s.portalUrl} />
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {CLEARANCE_ADVISORIES.map((a) => {
          const critical = a.triggerHeight !== undefined && height >= a.triggerHeight;
          return (
            <article
              key={a.id}
              className={cn(
                "rounded-2xl border p-5",
                critical ? "border-red-400/40 bg-red-400/10" : "border-border bg-background/40",
              )}
            >
              <p className="text-sm font-semibold">
                {a.emoji} {tr(a.title)}
                {critical && (
                  <span className="ml-2 rounded-full border border-red-400/50 px-2 py-0.5 text-[11px] text-red-200">
                    {t.compliance.appliesAt(height.toFixed(2))}
                  </span>
                )}
              </p>
              <p className="mt-2 text-sm text-foreground/80">{tr(a.body)}</p>
            </article>
          );
        })}
      </div>

      {region === "eu" && (
        <div className="mt-6">
          <div className="flex items-center gap-2">
            <Gauge className="size-4 text-primary" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {t.compliance.speedTitle}
            </p>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {MOTORHOME_SPEED_RULES.map((r) => (
              <article key={r.id} className="rounded-2xl border border-border bg-background/40 p-4">
                <p className="text-sm font-semibold">
                  {r.flag} {tr(r.country)}
                </p>
                <p className="mt-1 text-sm font-medium text-primary">{tr(r.motorway)}</p>
                <p className="mt-2 text-xs text-foreground/75">{tr(r.note)}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function LezMonitor({
  region,
  origin,
  destination,
  isMotorcycle,
}: {
  region: RegionKey;
  origin: string;
  destination: string;
  isMotorcycle: boolean;
}) {
  const t = useT();
  const tr = useTr();
  const { matched } = useMemo(
    () => detectLezZones(region, origin, destination),
    [region, origin, destination],
  );
  // Only zones on this route — the full overview lives on the tolls page.
  const zones = matched;
  if (zones.length === 0) return null;

  return (
    <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Wind className="size-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">{t.compliance.lezTitle}</h3>
        <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-0.5 text-[11px] font-medium text-primary">
          {matched.length > 0 ? t.compliance.lezDetected(matched.length) : t.compliance.lezOverview}
        </span>
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        {t.compliance.lezIntro}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {zones.map((z) => (
          <article key={z.id} className="rounded-2xl border border-border bg-background/40 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold">
                {z.flag} {tr(z.country)} · {tr(z.scheme)}
              </p>
              <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary">
                {tr(z.cost)}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {z.cities.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-border/70 bg-background/60 px-2.5 py-0.5 text-[11px] text-foreground/80"
                >
                  {c}
                </span>
              ))}
            </div>
            <p className="mt-3 text-sm text-foreground/80">{tr(z.requirement)}</p>
            <p className="mt-2 text-xs text-muted-foreground">⏱️ {tr(z.leadTime)}</p>
            {isMotorcycle && <p className="mt-2 text-xs text-amber-200">🏍️ {tr(z.motorcycle)}</p>}
            <Portal label={z.portalLabel} url={z.portalUrl} />
          </article>
        ))}
      </div>
    </div>
  );
}

export function TransponderSelector({
  region,
  trip,
}: {
  region: RegionKey;
  trip: TripEstimate;
}) {
  const t2 = useT();
  const tr = useTr();
  const tags = tagsForRegion(region);
  const [activeIds, setActiveIds] = useState<string[]>([]);
  const { savings, best, active } = tagSavings(trip.tolls, activeIds, region);
  const newTotal = Math.max(0, trip.tolls - savings);

  if (tags.length === 0) return null;

  const toggle = (id: string) =>
    setActiveIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div className="glass-panel mt-10 rounded-2xl p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Radio className="size-5 text-primary" />
        <h3 className="text-lg font-semibold tracking-tight">{t2.compliance.tagTitle}</h3>
      </div>
      <p className="mt-1 text-sm text-foreground/70">
        {t2.compliance.tagIntro}
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {tags.map((t) => {
          const on = activeIds.includes(t.id);
          return (
            <article
              key={t.id}
              className={cn(
                "rounded-2xl border p-5 transition",
                on ? "border-emerald-400/40 bg-emerald-400/10" : "border-border bg-background/40",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">
                    {t.emoji} {t.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{tr(t.scope)}</p>
                </div>
                <Switch checked={on} onCheckedChange={() => toggle(t.id)} aria-label={t.label} />
              </div>
              <p className="mt-3 text-sm text-foreground/80">
                {on ? t2.compliance.tagAuto : tr(t.lanes)}
              </p>
              <p className="mt-2 text-xs text-primary">
                {t2.compliance.tagSaving(Math.round(t.discount * 100))}
              </p>
              <Portal label={t.portalLabel} url={t.portalUrl} />
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-background/40 p-4">
        <BadgeCheck className={cn("size-5", active.length > 0 ? "text-emerald-400" : "text-muted-foreground")} />
        {active.length === 0 ? (
          <p className="text-sm text-foreground/75">
            {t2.compliance.tagNone(money(trip.currency, trip.tolls))}
          </p>
        ) : (
          <p className="text-sm text-foreground/85">
            {t2.compliance.tagActivePrefix(active.length)}{" "}
            <span className="line-through text-muted-foreground">{money(trip.currency, trip.tolls)}</span>{" "}
            {t2.compliance.tagTo}{" "}
            <span className="font-semibold text-primary">{money(trip.currency, newTotal)}</span>{" "}
            {t2.compliance.tagSavingTail(money(trip.currency, savings), Math.round(best * 100))}
          </p>
        )}
      </div>
    </div>
  );
}
