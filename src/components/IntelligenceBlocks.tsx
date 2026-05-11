import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  RefreshCw,
  Wallet,
  Zap,
  Snowflake,
  Route,
  TrendingUp,
  BarChart2,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { EV_MODELS } from "@/data/ev-models";
import type { ArticleIntelligence } from "@/data/article-intelligence";

interface BlockProps {
  icon: React.ElementType;
  label: string;
  body: string;
  accentClass?: string;
  borderClass?: string;
}

function IntelBlock({ icon: Icon, label, body, accentClass = "text-accent", borderClass = "border-accent/20" }: BlockProps) {
  return (
    <div className={`flex gap-4 p-5 rounded-2xl bg-card/40 border ${borderClass}`}>
      <div className="flex-shrink-0 mt-0.5">
        <Icon className={`w-4.5 h-4.5 ${accentClass}`} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1">{label}</p>
        <p className="text-sm text-foreground/90 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

interface AlternativeCardProps {
  slug: string;
  reason: string;
}

function AlternativeCard({ slug, reason }: AlternativeCardProps) {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const model = EV_MODELS.find((m) => m.slug === slug);
  if (!model) return null;

  return (
    <Link
      to={L(`/ev/models/${slug}`)}
      className="group flex items-center gap-3 p-4 rounded-xl glass border border-border/40 hover:border-accent/40 transition-colors"
    >
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Zap className="w-4 h-4 text-accent" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{model.name}</p>
        <p className="text-xs text-muted-foreground truncate">{reason}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
    </Link>
  );
}

interface IntelligencePanelProps {
  intelligence: ArticleIntelligence;
}

export function IntelligencePanel({ intelligence }: IntelligencePanelProps) {
  const blocks: BlockProps[] = [];

  if (intelligence.aiSummary) {
    blocks.push({
      icon: Brain,
      label: "AI Summary",
      body: intelligence.aiSummary,
      accentClass: "text-violet-400",
      borderClass: "border-violet-500/20",
    });
  }
  if (intelligence.whatChanged) {
    blocks.push({
      icon: RefreshCw,
      label: "What Changed",
      body: intelligence.whatChanged,
      accentClass: "text-cyan-400",
      borderClass: "border-cyan-500/20",
    });
  }
  if (intelligence.ownershipImpact) {
    blocks.push({
      icon: Wallet,
      label: "Ownership Impact",
      body: intelligence.ownershipImpact,
      accentClass: "text-emerald-400",
      borderClass: "border-emerald-500/20",
    });
  }
  if (intelligence.chargingImplications) {
    blocks.push({
      icon: Zap,
      label: "Charging Implications",
      body: intelligence.chargingImplications,
      accentClass: "text-amber-400",
      borderClass: "border-amber-500/20",
    });
  }
  if (intelligence.winterImpact) {
    blocks.push({
      icon: Snowflake,
      label: "Winter Impact",
      body: intelligence.winterImpact,
      accentClass: "text-sky-400",
      borderClass: "border-sky-500/20",
    });
  }
  if (intelligence.longDistanceSuitability) {
    blocks.push({
      icon: Route,
      label: "Long-Distance Suitability",
      body: intelligence.longDistanceSuitability,
      accentClass: "text-rose-400",
      borderClass: "border-rose-500/20",
    });
  }
  if (intelligence.marketImplications) {
    blocks.push({
      icon: TrendingUp,
      label: "Market Implications",
      body: intelligence.marketImplications,
      accentClass: "text-teal-400",
      borderClass: "border-teal-500/20",
    });
  }
  if (intelligence.policyImplications) {
    blocks.push({
      icon: BarChart2,
      label: "Policy Implications",
      body: intelligence.policyImplications,
      accentClass: "text-indigo-400",
      borderClass: "border-indigo-500/20",
    });
  }

  if (blocks.length === 0 && !intelligence.bestAlternatives?.length) return null;

  return (
    <aside className="space-y-4">
      <div className="flex items-center gap-2 mb-5">
        <Lightbulb className="w-4 h-4 text-accent" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Intelligence Analysis
        </h2>
      </div>

      <div className="space-y-3">
        {blocks.map((b) => (
          <IntelBlock key={b.label} {...b} />
        ))}
      </div>

      {intelligence.bestAlternatives && intelligence.bestAlternatives.length > 0 && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
            Best Alternatives
          </p>
          <div className="space-y-2">
            {intelligence.bestAlternatives.map((alt) => (
              <AlternativeCard key={alt.slug} {...alt} />
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
