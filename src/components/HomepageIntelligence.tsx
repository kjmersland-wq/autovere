import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, Snowflake, Wallet, Route, TrendingUp, ChevronRight, Rss } from "lucide-react";
import { ArticleCard } from "@/components/ArticleCard";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { ARTICLES } from "@/data/articles";
import { buildHomepageSections } from "@/lib/content-ranking";
import { enrichArticlesWithResolvedMedia } from "@/lib/editorial-media";

type SignalTab = "trending" | "charging" | "ownership" | "winter" | "longrange";

const TABS: { id: SignalTab; label: string; icon: React.ElementType; color: string }[] = [
  { id: "trending", label: "Trending", icon: TrendingUp, color: "text-accent" },
  { id: "charging", label: "Charging", icon: Zap, color: "text-cyan-400" },
  { id: "ownership", label: "Ownership", icon: Wallet, color: "text-emerald-400" },
  { id: "winter", label: "Winter", icon: Snowflake, color: "text-sky-400" },
  { id: "longrange", label: "Long Range", icon: Route, color: "text-rose-400" },
];

export function HomepageIntelligence() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const [activeTab, setActiveTab] = useState<SignalTab>("trending");

  const sections = useMemo(() => buildHomepageSections(enrichArticlesWithResolvedMedia(ARTICLES)), []);

  const tabArticles: Record<SignalTab, typeof ARTICLES> = {
    trending: sections.trending,
    charging: sections.chargingUpdates,
    ownership: sections.ownershipPicks,
    winter: sections.winterReady,
    longrange: sections.longRangeTests,
  };

  const displayed = tabArticles[activeTab];

  return (
    <section className="py-24 relative bg-card/20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/5 to-transparent pointer-events-none" />
      <div className="container relative">
        {/* Header */}
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-400 mb-3">
              <Rss className="w-3.5 h-3.5" />
              EV Intelligence
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              The signal, not the noise.
            </h2>
          </div>
          <Link
            to={L("/ev/news")}
            className="text-sm text-accent hover:underline flex items-center gap-1 flex-shrink-0"
          >
            All articles <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Signal tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto scrollbar-hide pb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border flex-shrink-0 ${
                  active
                    ? "bg-accent text-primary-foreground border-accent shadow-glow"
                    : "glass border-border/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? "text-primary-foreground" : tab.color}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Articles */}
        {displayed.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No articles in this signal yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.slice(0, 3).map((article) => (
              <ArticleCard key={article.slug} article={article} showWhyItMatters />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="mt-10 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {ARTICLES.length} intelligence reports · ranked by signal
          </p>
          <Link
            to={L("/ev/news")}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-border/40 hover:border-border/70 text-sm font-medium transition-colors"
          >
            Full intelligence feed <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
