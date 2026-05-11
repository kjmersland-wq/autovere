import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, ChevronRight, Activity } from "lucide-react";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import {
  AUTOMOTIVE_SIGNALS,
  SIGNAL_TYPE_LABELS,
  SIGNAL_TYPE_COLORS,
  SIGNAL_IMPACT_COLORS,
  getTopSignals,
  type SignalType,
  type AutomotiveSignal,
} from "@/data/automotive-signals";

const ALL_TYPES: (SignalType | "all")[] = [
  "all",
  "vehicle-launch",
  "network-expansion",
  "price-change",
  "software-update",
  "battery-tech",
  "charging-cost",
  "ownership-trend",
  "policy",
];

function SignalRow({ signal }: { signal: AutomotiveSignal }) {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const typeColor = SIGNAL_TYPE_COLORS[signal.type];
  const impactColor = SIGNAL_IMPACT_COLORS[signal.impact];
  const published = new Date(signal.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const inner = (
    <div className="flex items-start gap-3 py-3.5 border-b border-border/20 last:border-0 hover:bg-card/30 -mx-1 px-1 rounded-lg transition-colors cursor-pointer group">
      <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border font-medium flex-shrink-0 mt-0.5 ${typeColor}`}>
        {SIGNAL_TYPE_LABELS[signal.type]}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug line-clamp-1 group-hover:text-accent transition-colors">{signal.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{signal.summary}</p>
      </div>
      <div className="flex-shrink-0 flex items-center gap-2">
        <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${impactColor}`}>
          {signal.impact}
        </span>
        <span className="text-[10px] text-muted-foreground hidden sm:block">{published}</span>
        <ChevronRight className="w-3 h-3 text-muted-foreground group-hover:text-accent transition-colors" />
      </div>
    </div>
  );

  if (signal.actionPath) {
    return <Link to={L(signal.actionPath)}>{inner}</Link>;
  }
  return inner;
}

interface SignalFeedProps {
  limit?: number;
  showFilter?: boolean;
  className?: string;
}

export function SignalFeed({ limit = 8, showFilter = true, className = "" }: SignalFeedProps) {
  const [typeFilter, setTypeFilter] = useState<SignalType | "all">("all");
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const filtered = AUTOMOTIVE_SIGNALS.filter((s) => typeFilter === "all" || s.type === typeFilter)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, limit);

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Activity className="w-4 h-4 text-accent" />
        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Live Signals</span>
        <span className="ml-auto text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full border border-accent/20 font-medium">
          {AUTOMOTIVE_SIGNALS.length} signals
        </span>
      </div>

      {/* Filters */}
      {showFilter && (
        <div className="flex gap-1.5 mb-4 overflow-x-auto scrollbar-hide pb-0.5">
          {ALL_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-colors border flex-shrink-0 ${
                typeFilter === t
                  ? "bg-accent text-primary-foreground border-accent"
                  : "glass border-border/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "all" ? "All" : SIGNAL_TYPE_LABELS[t as SignalType]}
            </button>
          ))}
        </div>
      )}

      {/* Feed */}
      <div>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No signals in this category.</p>
        ) : (
          filtered.map((signal) => <SignalRow key={signal.id} signal={signal} />)
        )}
      </div>

      {/* View all */}
      <div className="mt-3 pt-3 border-t border-border/20">
        <Link
          to={L("/ev/news")}
          className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
        >
          <Zap className="w-3 h-3" />
          Full intelligence feed <ChevronRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

// Compact version for homepage sidebar
export function SignalFeedCompact({ limit = 5 }: { limit?: number }) {
  const signals = getTopSignals(limit);
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  return (
    <div className="glass rounded-2xl border border-border/40 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs uppercase tracking-wider text-accent font-medium">Live Signals</span>
        </div>
        <Link to={L("/ev/news")} className="text-[10px] text-muted-foreground hover:text-foreground transition-colors">
          All →
        </Link>
      </div>
      <div>
        {signals.map((s) => {
          const typeColor = SIGNAL_TYPE_COLORS[s.type];
          const inner = (
            <div className="flex items-start gap-2 py-2.5 border-b border-border/20 last:border-0 hover:bg-card/30 -mx-1 px-1 rounded transition-colors cursor-pointer group">
              <span className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-full border font-medium flex-shrink-0 mt-0.5 ${typeColor}`}>
                {SIGNAL_TYPE_LABELS[s.type]}
              </span>
              <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2 leading-snug">
                {s.title}
              </p>
            </div>
          );
          return s.actionPath ? (
            <Link key={s.id} to={L(s.actionPath)}>{inner}</Link>
          ) : (
            <div key={s.id}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
