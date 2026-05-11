import { Link, useLocation } from "react-router-dom";
import {
  Snowflake, Zap, Route, Wallet, ShieldCheck, TrendingUp, TrendingDown,
  Users, MapPin, Battery, AlertTriangle, ChevronRight, Brain,
} from "lucide-react";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import type { OwnershipInsight } from "@/lib/ai-ownership-insights";

const ICON_MAP = {
  snowflake: Snowflake,
  zap: Zap,
  route: Route,
  wallet: Wallet,
  shield: ShieldCheck,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  users: Users,
  "map-pin": MapPin,
  battery: Battery,
  alert: AlertTriangle,
} as const;

const TYPE_STYLES = {
  positive: {
    border: "border-emerald-500/25",
    bg: "bg-emerald-500/5",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    badge: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    label: "Positive signal",
  },
  warning: {
    border: "border-amber-500/25",
    bg: "bg-amber-500/5",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    badge: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    label: "Watch out",
  },
  action: {
    border: "border-accent/25",
    bg: "bg-accent/5",
    iconBg: "bg-accent/15",
    iconColor: "text-accent",
    badge: "text-accent bg-accent/10 border-accent/30",
    label: "Action",
  },
  neutral: {
    border: "border-border/40",
    bg: "bg-card/30",
    iconBg: "bg-card/60",
    iconColor: "text-muted-foreground",
    badge: "text-muted-foreground bg-card/60 border-border/40",
    label: "Note",
  },
} as const;

interface OwnershipInsightCardProps {
  insight: OwnershipInsight;
  compact?: boolean;
}

export function OwnershipInsightCard({ insight, compact = false }: OwnershipInsightCardProps) {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const style = TYPE_STYLES[insight.type];
  const Icon = ICON_MAP[insight.icon] ?? Brain;

  if (compact) {
    return (
      <div className={`flex gap-3 p-4 rounded-xl border ${style.border} ${style.bg}`}>
        <div className={`w-7 h-7 rounded-lg ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${style.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold mb-0.5">{insight.title}</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{insight.body}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`glass rounded-2xl border ${style.border} p-6`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium ${style.badge}`}>
              {style.label}
            </span>
            {insight.score !== undefined && (
              <span className="text-[10px] text-muted-foreground">Score: {insight.score}/100</span>
            )}
          </div>
          <h4 className="text-sm font-semibold mb-1.5">{insight.title}</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">{insight.body}</p>
          {insight.actionLabel && insight.actionPath && (
            <Link
              to={L(insight.actionPath)}
              className={`inline-flex items-center gap-1 mt-3 text-xs font-medium ${style.iconColor} hover:underline`}
            >
              {insight.actionLabel} <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

interface InsightPanelProps {
  insights: OwnershipInsight[];
  title?: string;
  compact?: boolean;
}

export function InsightPanel({ insights, title = "AI Ownership Insights", compact = false }: InsightPanelProps) {
  if (!insights.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-accent" />
        <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">{title}</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight) => (
          <OwnershipInsightCard key={insight.id} insight={insight} compact={compact} />
        ))}
      </div>
    </div>
  );
}
