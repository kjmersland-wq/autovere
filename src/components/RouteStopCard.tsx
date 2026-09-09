import { Star } from "lucide-react";

import { PoiLinks } from "@/components/PoiLinks";
import { useLocale, useTr } from "@/lib/i18n";
import type { CorridorStop } from "@/lib/corridor-map";
import type { PlaceReview } from "@/lib/place-reviews.functions";
import { poiLabel, type PoiInterestId } from "@/lib/poi-interests";
import type { RegionKey } from "@/lib/trip-data";
import { cn } from "@/lib/utils";

const CATEGORY_ICON: Record<PoiInterestId, string> = {
  fuel_stations: "⛽",
  ev_charging: "⚡",
  rv_services: "🚐",
  camping_stay: "🏕️",
  scenic_drives: "🛣️",
  scenic_viewpoints: "🌄",
  history_culture: "🏛️",
  castles_palaces: "🏰",
  nature_outdoors: "🌲",
  kids_play: "🎡",
  wildlife_nature: "🦌",
  food_culinary: "🍽️",
  beach_water: "🏖️",
  urban_city: "🏙️",
  adventure_active: "🧗",
  peaceful_relax: "🌿",
};

/**
 * Single unified card for every curated corridor POI category — history,
 * castles, viewpoints, camping, wildlife, and so on all render through this
 * one component so a new category never needs its own bespoke card.
 * Google Places rating/review data is optional and only ever supplied for
 * the handful of candidates the caller actually fetched on demand — never
 * fabricated when absent.
 */
export function RouteStopCard({
  stop,
  region = "eu",
  atLabel,
  review,
  reviewLoading,
  className,
}: {
  stop: CorridorStop;
  region?: RegionKey;
  /** Distance-along-route label (e.g. "212 km"), when known. */
  atLabel?: string;
  /** On-demand Google Places enrichment for this stop — omitted/undefined
   * when it hasn't been requested yet, null once requested but nothing came
   * back (never a fabricated rating). */
  review?: PlaceReview | null;
  reviewLoading?: boolean;
  className?: string;
}) {
  const locale = useLocale();
  const tr = useTr();

  return (
    <div className={cn("glass-panel rounded-2xl p-4 sm:p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {CATEGORY_ICON[stop.category] ?? "📍"} {poiLabel(locale, stop.category)}
          </p>
          <h4 className="mt-0.5 text-base font-semibold tracking-tight">{stop.name}</h4>
        </div>
        {atLabel && (
          <span className="shrink-0 rounded-full bg-background/60 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {atLabel}
          </span>
        )}
      </div>

      {(reviewLoading || review?.rating) && (
        <div className="mt-2 flex items-center gap-2 text-sm">
          {reviewLoading ? (
            <span className="text-xs text-muted-foreground">{tr("Loading rating…")}</span>
          ) : (
            review?.rating && (
              <span className="inline-flex items-center gap-1 font-medium text-amber-400">
                <Star className="size-3.5 fill-current" /> {review.rating.toFixed(1)}
                {typeof review.reviewCount === "number" && (
                  <span className="font-normal text-muted-foreground">({review.reviewCount})</span>
                )}
              </span>
            )
          )}
        </div>
      )}

      {review?.topReview && (
        <p className="mt-1.5 line-clamp-2 text-xs italic text-foreground/70">&ldquo;{review.topReview}&rdquo;</p>
      )}

      <PoiLinks kind="place" name={stop.name} where={stop.country} region={region} />
    </div>
  );
}
