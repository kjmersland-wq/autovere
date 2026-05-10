import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Zap, Car, Wifi, BookOpen } from "lucide-react";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { EV_MODELS } from "@/data/ev-models";
import { CHARGING_NETWORKS } from "@/data/charging-networks";

interface RelatedContentProps {
  relatedVehicles?: string[];
  relatedNetworks?: string[];
  relatedGuides?: string[];
  className?: string;
}

const GUIDE_LABELS: Record<string, string> = {
  "fast-charging-guide": "Fast Charging Guide",
  "ev-winter-driving": "EV Winter Driving",
  "ev-battery-guide": "Battery Care Guide",
  "home-charging-guide": "Home Charging Guide",
};

const GUIDE_PATHS: Record<string, string> = {
  "fast-charging-guide": "/ev/guides",
  "ev-winter-driving": "/ev/guides",
  "ev-battery-guide": "/ev/guides",
  "home-charging-guide": "/ev/guides",
};

export function RelatedContent({
  relatedVehicles = [],
  relatedNetworks = [],
  relatedGuides = [],
  className = "",
}: RelatedContentProps) {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const vehicles = EV_MODELS.filter((m) => relatedVehicles.includes(m.slug));
  const networks = CHARGING_NETWORKS.filter((n) => relatedNetworks.includes(n.slug));
  const guides = relatedGuides.filter((g) => GUIDE_LABELS[g]);

  if (!vehicles.length && !networks.length && !guides.length) return null;

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Related</h3>

      {vehicles.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-2">
            <Car className="w-3 h-3" /> Vehicles
          </div>
          <div className="flex flex-wrap gap-2">
            {vehicles.map((v) => (
              <Link
                key={v.slug}
                to={L(`/ev/models/${v.slug}`)}
                className="inline-flex items-center gap-1.5 text-xs glass border border-border/40 hover:border-accent/40 rounded-xl px-3 py-1.5 transition-colors hover:text-accent"
              >
                <Zap className="w-3 h-3 text-accent flex-shrink-0" />
                {v.name}
                <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {networks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-2">
            <Wifi className="w-3 h-3" /> Charging Networks
          </div>
          <div className="flex flex-wrap gap-2">
            {networks.map((n) => (
              <Link
                key={n.slug}
                to={L(`/ev/networks/${n.slug}`)}
                className="inline-flex items-center gap-1.5 text-xs glass border border-border/40 hover:border-cyan-400/40 rounded-xl px-3 py-1.5 transition-colors hover:text-cyan-400"
              >
                <Wifi className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                {n.name}
                <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {guides.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-2">
            <BookOpen className="w-3 h-3" /> Guides
          </div>
          <div className="flex flex-wrap gap-2">
            {guides.map((g) => (
              <Link
                key={g}
                to={L(GUIDE_PATHS[g] ?? "/ev/guides")}
                className="inline-flex items-center gap-1.5 text-xs glass border border-border/40 hover:border-amber-400/40 rounded-xl px-3 py-1.5 transition-colors hover:text-amber-400"
              >
                <BookOpen className="w-3 h-3 text-amber-400 flex-shrink-0" />
                {GUIDE_LABELS[g]}
                <ChevronRight className="w-2.5 h-2.5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
