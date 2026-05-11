import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Snowflake, Zap, Route, Users, MapPin, Navigation, ShieldCheck, Wrench, ChevronRight,
  CheckCircle, XCircle, Brain,
} from "lucide-react";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import type { VehicleIntelligenceScore } from "@/data/vehicle-intelligence";
import { SaveButton } from "@/components/SaveButton";

interface ScoreBarProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  animate?: boolean;
}

function ScoreBar({ label, icon: Icon, value, color, animate = true }: ScoreBarProps) {
  const [width, setWidth] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      setTimeout(() => setWidth(value), 80);
    }
  }, [value]);

  const displayWidth = animate ? width : value;

  return (
    <div className="flex items-center gap-3 group">
      <Icon className={`w-3.5 h-3.5 ${color} flex-shrink-0`} />
      <span className="text-xs text-muted-foreground w-32 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-card overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color.replace("text-", "bg-")}`}
          style={{ width: `${displayWidth}%` }}
        />
      </div>
      <span className="text-xs font-semibold w-8 text-right">{value}</span>
    </div>
  );
}

const DIMENSIONS: { key: keyof VehicleIntelligenceScore; label: string; icon: React.ElementType; color: string }[] = [
  { key: "winterSuitability", label: "Winter", icon: Snowflake, color: "text-sky-400" },
  { key: "chargingEcosystem", label: "Charging", icon: Zap, color: "text-cyan-400" },
  { key: "motorwayEfficiency", label: "Motorway", icon: Navigation, color: "text-violet-400" },
  { key: "familyPracticality", label: "Family", icon: Users, color: "text-emerald-400" },
  { key: "urbanSuitability", label: "Urban", icon: MapPin, color: "text-amber-400" },
  { key: "roadTripScore", label: "Road Trip", icon: Route, color: "text-rose-400" },
  { key: "reliabilitySignal", label: "Reliability", icon: ShieldCheck, color: "text-teal-400" },
  { key: "maintenanceComplexity", label: "Simplicity", icon: Wrench, color: "text-indigo-400" },
];

interface VehicleIntelligenceCardProps {
  intelligence: VehicleIntelligenceScore;
  compact?: boolean;
}

export function VehicleIntelligenceCard({ intelligence, compact = false }: VehicleIntelligenceCardProps) {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  if (compact) {
    const top3 = DIMENSIONS.slice(0, 3);
    return (
      <div className="glass rounded-2xl border border-border/40 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
            <Brain className="w-3.5 h-3.5" /> Intelligence Score
          </div>
          <span className="text-2xl font-bold text-gradient">{intelligence.overallIntelligence}</span>
        </div>
        <div className="space-y-3">
          {top3.map((d) => (
            <ScoreBar
              key={d.key as string}
              label={d.label}
              icon={d.icon}
              value={intelligence[d.key] as number}
              color={d.color}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-2xl border border-border/40 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-accent">
          <Brain className="w-3.5 h-3.5" /> AI Intelligence Score
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gradient">{intelligence.overallIntelligence}</div>
          <div className="text-[9px] text-muted-foreground uppercase tracking-wider">/ 100</div>
        </div>
      </div>

      {/* Scores */}
      <div className="space-y-3">
        {DIMENSIONS.map((d) => (
          <ScoreBar
            key={d.key as string}
            label={d.label}
            icon={d.icon}
            value={intelligence[d.key] as number}
            color={d.color}
          />
        ))}
      </div>

      {/* Personality */}
      <div className="pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground leading-relaxed italic">{intelligence.personalitySummary}</p>
      </div>

      {/* Best for / Worst for */}
      <div className="grid grid-cols-1 gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium mb-2">Best for</div>
          <div className="space-y-1">
            {intelligence.bestFor.map((b) => (
              <div key={b} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                {b}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-rose-400 font-medium mb-2">Avoid if</div>
          <div className="space-y-1">
            {intelligence.worstFor.map((w) => (
              <div key={w} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <XCircle className="w-3 h-3 text-rose-400 flex-shrink-0 mt-0.5" />
                {w}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alternatives */}
      {intelligence.recommendedAlternatives.length > 0 && (
        <div className="pt-4 border-t border-border/30">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-2">Compare alternatives</div>
          <div className="space-y-1">
            {intelligence.recommendedAlternatives.map((slug) => (
              <Link
                key={slug}
                to={L(`/ev/models/${slug}`)}
                className="flex items-center justify-between py-1 text-xs text-muted-foreground hover:text-accent transition-colors"
              >
                <span className="truncate">{slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</span>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <SaveButton type="vehicle" slug={intelligence.slug} className="w-full justify-center gap-2" label="Save vehicle" />
      </div>
    </div>
  );
}
