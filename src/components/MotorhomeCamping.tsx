import { Caravan, CircleDot, Droplets, Flame, Lock, ParkingCircle, Sparkles, Tent, Trash2, Wrench, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AppLink as Link } from "@/components/AppLink";
import type { MotorhomeCopy } from "@/lib/motorhome-i18n";
import type { MotorhomeCategory, MotorhomePoi } from "@/lib/geo";
import { MOTORHOME_CATEGORIES } from "@/lib/geo";

const DISTANCE_OPTIONS = [5, 10, 25, 50] as const;

const CATEGORY_ICON: Record<MotorhomeCategory, LucideIcon> = {
  dump_station: Trash2,
  fresh_water: Droplets,
  camping: Tent,
  parking: ParkingCircle,
  lpg: Flame,
  workshop: Wrench,
  tyre_service: CircleDot,
  washing: Sparkles,
};

type MotorhomeCampingProps = {
  copy: MotorhomeCopy;
  pois: MotorhomePoi[];
  loading: boolean;
  maxDistanceKm: number;
  onMaxDistanceChange: (km: number) => void;
  selectedCategories: Set<MotorhomeCategory>;
  onToggleCategory: (category: MotorhomeCategory) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onAddStop: (place: { id: string; name: string; label: string; lat: number; lon: number }) => void;
};

export function MotorhomeCamping({ copy, pois, loading, maxDistanceKm, onMaxDistanceChange, selectedCategories, onToggleCategory, onSelectAll, onClearAll, onAddStop }: MotorhomeCampingProps) {
  return (
    <section className="panel p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/12 text-primary">
              <Caravan className="size-4" aria-hidden />
            </span>
            {copy.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          {copy.distanceLabel}
          <select
            value={maxDistanceKm}
            onChange={(event) => onMaxDistanceChange(Number(event.target.value))}
            className="rounded-lg border border-border bg-surface-raised px-2.5 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary/60"
          >
            {DISTANCE_OPTIONS.map((km) => (
              <option key={km} value={km}>{km} km</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {MOTORHOME_CATEGORIES.map((category) => {
          const active = selectedCategories.has(category);
          const Icon = CATEGORY_ICON[category];
          return (
            <button
              key={category}
              type="button"
              onClick={() => onToggleCategory(category)}
              aria-pressed={active}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${active ? "border-primary/60 bg-primary/10 text-primary" : "border-border bg-surface-raised text-muted-foreground hover:text-foreground"}`}
            >
              <Icon className="size-3.5" aria-hidden /> {copy.categories[category]}
            </button>
          );
        })}
        <span className="mx-1 h-4 w-px bg-border" aria-hidden />
        <button type="button" onClick={onSelectAll} className="text-xs font-semibold text-primary hover:underline">{copy.selectAll}</button>
        <button type="button" onClick={onClearAll} className="text-xs font-semibold text-muted-foreground hover:underline">{copy.clearAll}</button>
      </div>

      <div className="mt-5 space-y-2">
        {loading && <p className="text-sm text-muted-foreground">…</p>}
        {!loading && selectedCategories.size === 0 && <p className="text-sm text-muted-foreground">{copy.emptyNoCategories}</p>}
        {!loading && selectedCategories.size > 0 && pois.length === 0 && <p className="text-sm text-muted-foreground">{copy.empty}</p>}
        {!loading && pois.slice(0, 10).map((poi) => (
          <div key={poi.id} className="rounded-lg border border-border bg-surface-raised p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{poi.name}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {poi.categories.map((category) => {
                    const Icon = CATEGORY_ICON[category];
                    return (
                      <span key={category} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                        <Icon className="size-3" aria-hidden /> {copy.categories[category]}
                      </span>
                    );
                  })}
                  {poi.fee != null && (
                    <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{poi.fee ? copy.feeYes : copy.feeNo}</span>
                  )}
                  <span className="text-[11px] text-muted-foreground">{poi.detourKm} km</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onAddStop({ id: `motorhome-${poi.id}`, name: poi.name, label: `${poi.name}, ${copy.title}`, lat: poi.lat, lon: poi.lon })}
              >
                {copy.addStop}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs leading-relaxed text-muted-foreground">{copy.attribution}</p>
    </section>
  );
}

export function MotorhomeCampingUpgrade({ copy }: { copy: MotorhomeCopy }) {
  return (
    <section className="panel flex flex-col items-start gap-3 border-dashed p-5 sm:p-7">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
        <Lock className="size-3.5" aria-hidden /> {copy.proLabel}
      </span>
      <h2 className="text-lg font-bold">{copy.upgradeTitle}</h2>
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{copy.upgradeBody}</p>
      <Link to="/pricing">
        <Button>{copy.upgradeCta}</Button>
      </Link>
    </section>
  );
}
