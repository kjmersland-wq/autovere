import { Castle, Coffee, ExternalLink, Landmark, Mountain, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ScenicCategory, ScenicHighlight } from "@/lib/geo";
import { COUNTRY_NAMES } from "@/lib/countries";
import { cn } from "@/lib/utils";
import { countryName, useLocale, useT } from "@/lib/i18n";

const CATEGORY_META: Record<ScenicCategory, { label: string; icon: typeof Castle }> = {
  camping: { label: "Camping & RV", icon: Landmark },
  lodging: { label: "Hotels & Lodging", icon: Castle },
  food: { label: "Food & Cafes", icon: Coffee },
  sights: { label: "Sights & Views", icon: Mountain },
};

export type ScenicFilter = "all" | ScenicCategory;

export function ScenicHighlights({
  highlights,
  filter,
  onFilterChange,
  selectedIds,
  onToggle,
}: {
  highlights: ScenicHighlight[];
  filter: ScenicFilter;
  onFilterChange: (filter: ScenicFilter) => void;
  selectedIds: Set<string>;
  onToggle: (highlight: ScenicHighlight) => void;
}) {
  const t = useT();
  const { locale } = useLocale();
  const visibleHighlights = (filter === "all" ? highlights : highlights.filter((highlight) => highlight.category === filter)).slice(0, 8);
  return (
    <section className="mt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-muted-foreground">
            {t.scenicTitle}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{t.scenicSub}</p>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:block">{t.scenicPicks}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="tablist" aria-label="POI categories">
        {(["all", "camping", "lodging", "food", "sights"] as ScenicFilter[]).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            onClick={() => onFilterChange(value)}
            className={cn("min-h-10 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors", filter === value ? "border-primary/60 bg-primary/12 text-primary" : "border-border bg-surface-raised text-muted-foreground hover:text-foreground")}
          >
            {value === "all" ? t.all : value === "camping" ? `🏕️ ${t.camping}` : value === "lodging" ? `🏨 ${t.lodging}` : value === "food" ? `🍽️ ${t.food}` : `🏰 ${t.sights}`}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibleHighlights.map((highlight) => {
          const meta = CATEGORY_META[highlight.category];
          const Icon = meta.icon;
          const selected = selectedIds.has(highlight.id);
          return (
            <article key={highlight.id} className={cn("panel p-4", selected && "border-primary/60 panel-glow")}>
              <div className="flex items-start justify-between gap-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary">
                  <Icon className="size-4" aria-hidden />
                </span>
                <span className="rounded-full bg-accent px-2 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-accent-foreground">
                  {t[highlight.category]}
                </span>
              </div>
              <h3 className="mt-4 line-clamp-2 text-sm font-bold text-foreground">{highlight.name}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{countryName(highlight.country, locale, COUNTRY_NAMES[highlight.country] ?? highlight.country)}</p>
              <p className="mt-3 text-xs font-semibold text-primary">
                {highlight.directlyOnRoute ? t.directlyOnRoute : t.minDetour(highlight.detourMinutes)}
              </p>
              <div className="mt-4 flex items-center justify-between gap-2">
                <div className="flex gap-3 text-xs text-muted-foreground">
                  <a href={highlight.osmUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                    OSM <ExternalLink className="size-3" />
                  </a>
                  <a href={highlight.googleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">
                    {t.openMap} <ExternalLink className="size-3" />
                  </a>
                  {highlight.websiteUrl && <a href={highlight.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-foreground">{t.website} <ExternalLink className="size-3" /></a>}
                </div>
                <Button type="button" size="sm" variant={selected ? "secondary" : "outline"} className="min-h-10 px-2.5 text-xs" onClick={() => onToggle(highlight)}>
                  {selected ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
                  {selected ? t.added : t.add}
                </Button>
              </div>
              {highlight.amenities.length > 0 && <div className="mt-2 flex flex-wrap gap-1"><span className="sr-only">Amenities:</span>{highlight.amenities.map((amenity) => <span key={amenity} className="rounded bg-accent px-1.5 py-0.5 text-[0.6rem] text-accent-foreground">{amenity}</span>)}</div>}
            </article>
          );
        })}
      </div>
    </section>
  );
}
