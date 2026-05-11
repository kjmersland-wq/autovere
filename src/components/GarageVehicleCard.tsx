import { Link, useLocation } from "react-router-dom";
import { Zap, Snowflake, Route, Brain, Trash2, ChevronRight, Car, Navigation } from "lucide-react";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import type { EnrichedGarageEntry } from "@/hooks/useGarage";
import type { GarageSlot } from "@/data/ownership-tracking";

const SLOT_LABELS: Record<GarageSlot, string> = {
  owned: "Owned",
  dream: "Dream",
  comparing: "Comparing",
};

const SLOT_COLORS: Record<GarageSlot, string> = {
  owned: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  dream: "text-violet-400 bg-violet-500/10 border-violet-500/30",
  comparing: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
};

interface GarageVehicleCardProps {
  enriched: EnrichedGarageEntry;
  onRemove: (slug: string) => void;
  onSlotChange: (slug: string, slot: GarageSlot) => void;
}

const fmt = (n: number) => n.toLocaleString();

export function GarageVehicleCard({ enriched, onRemove, onSlotChange }: GarageVehicleCardProps) {
  const { entry, model, intelligence } = enriched;
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  if (!model) return null;

  const slotColor = SLOT_COLORS[entry.slot];
  const addedDate = new Date(entry.addedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="glass rounded-2xl border border-border/40 hover:border-border/70 transition-all duration-300 overflow-hidden group">
      {/* Gradient header */}
      <div className="relative h-24 bg-gradient-to-br from-primary/10 via-card to-accent/5 flex items-end px-6 pb-4">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-cyan-500/30 to-violet-500/20" />
        <div className="relative flex items-end justify-between w-full">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-accent/70 mb-0.5">{model.brand}</div>
            <h3 className="text-xl font-bold tracking-tight">{model.name}</h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Slot badge */}
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium ${slotColor}`}>
              {SLOT_LABELS[entry.slot]}
            </span>
            {/* Remove */}
            <button
              onClick={() => onRemove(entry.slug)}
              className="w-7 h-7 rounded-lg glass border border-border/40 flex items-center justify-center hover:border-rose-500/40 hover:text-rose-400 transition-colors"
              aria-label="Remove from garage"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-card/60 rounded-xl p-3 text-center">
            <div className="text-base font-bold text-gradient">{model.specs.range.realWorld}</div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">Real km</div>
          </div>
          <div className="bg-card/60 rounded-xl p-3 text-center">
            <div className="text-base font-bold text-cyan-400">{model.specs.charging.maxDC}</div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">kW DC</div>
          </div>
          <div className="bg-card/60 rounded-xl p-3 text-center">
            <div className="text-base font-bold text-violet-400">{intelligence?.overallIntelligence ?? "—"}</div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">AI Score</div>
          </div>
        </div>

        {/* Intelligence mini bars */}
        {intelligence && (
          <div className="space-y-2 mb-5">
            {[
              { label: "Winter", value: intelligence.winterSuitability, icon: Snowflake, color: "bg-sky-400" },
              { label: "Charging", value: intelligence.chargingEcosystem, icon: Zap, color: "bg-cyan-400" },
              { label: "Road trip", value: intelligence.roadTripScore, icon: Route, color: "bg-rose-400" },
            ].map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <d.icon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-[10px] text-muted-foreground w-16">{d.label}</span>
                <div className="flex-1 h-1 rounded-full bg-card overflow-hidden">
                  <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.value}%` }} />
                </div>
                <span className="text-[10px] font-medium w-6 text-right">{d.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Slot switcher */}
        <div className="flex gap-1.5 mb-5">
          {(["dream", "owned", "comparing"] as GarageSlot[]).map((s) => (
            <button
              key={s}
              onClick={() => onSlotChange(entry.slug, s)}
              className={`flex-1 text-[10px] font-medium py-1.5 rounded-lg border transition-colors ${
                entry.slot === s
                  ? SLOT_COLORS[s]
                  : "glass border-border/30 text-muted-foreground hover:text-foreground"
              }`}
            >
              {SLOT_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={L(`/ev/models/${model.slug}`)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-xl glass border border-border/40 hover:border-accent/40 hover:text-accent transition-colors"
          >
            <Car className="w-3.5 h-3.5" /> Full guide
          </Link>
          <Link
            to={L("/ev/compare")}
            className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-medium py-2.5 rounded-xl glass border border-border/40 hover:border-cyan-400/40 hover:text-cyan-400 transition-colors"
          >
            <Navigation className="w-3.5 h-3.5" /> Compare
          </Link>
        </div>

        {/* Added date */}
        <div className="mt-4 pt-3 border-t border-border/20">
          <span className="text-[10px] text-muted-foreground">Added {addedDate}</span>
        </div>
      </div>
    </div>
  );
}
