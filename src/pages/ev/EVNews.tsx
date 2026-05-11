import { useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { Zap, Rss, ChevronRight, Lightbulb } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { ArticleCard } from "@/components/ArticleCard";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import {
  ARTICLES,
  CATEGORY_LABELS,
  type ArticleCategory,
} from "@/data/articles";
import { rankArticles } from "@/lib/content-ranking";

const CATEGORIES: { value: ArticleCategory | "all"; label: string }[] = [
  { value: "all", label: "All Intelligence" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "technology", label: "Technology" },
  { value: "market", label: "Market" },
  { value: "ownership", label: "Ownership" },
  { value: "policy", label: "Policy" },
  { value: "comparison", label: "Comparison" },
];

export default function EVNews() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const [category, setCategory] = useState<ArticleCategory | "all">("all");

  // Rank by composite score (freshness × relevance × trending) not just date
  const sorted = useMemo(
    () => rankArticles(ARTICLES, "total").map((r) => r.article),
    []
  );

  const filtered = useMemo(
    () => (category === "all" ? sorted : sorted.filter((a) => a.category === category)),
    [sorted, category]
  );

  const [featured, ...rest] = filtered;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "EV Intelligence — AUTOVERE",
    description:
      "Expert EV analysis: charging infrastructure, battery technology, European market data and ownership intelligence.",
    url: "https://autovere.com/ev/news",
  };

  return (
    <PageShell>
      <SEO
        title="EV Intelligence — Market, Technology & Infrastructure Analysis | AUTOVERE"
        description="Expert EV analysis: charging infrastructure, battery technology, European market data and ownership intelligence. No hype — real data."
        image="https://autovere.com/og-autovere-1200x630.jpg"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-cyan-950/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-400 mb-6">
            <Rss className="w-3.5 h-3.5" />
            EV Intelligence
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
            The signal, not{" "}
            <span className="text-gradient">the noise.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
            Expert analysis on EV infrastructure, technology, European market shifts and ownership economics.
            Every article includes a "Why it matters" verdict — so you know exactly how it affects your decisions.
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-accent" />
              Every article includes a "Why it matters" analysis
            </div>
            <span className="text-border">·</span>
            <span>{ARTICLES.length} articles</span>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border/30">
        <div className="container py-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setCategory(c.value)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors border flex-shrink-0 ${
                  category === c.value
                    ? "bg-accent text-primary-foreground border-accent"
                    : "glass border-border/40 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-16">
        {filtered.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">No articles in this category yet.</div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.25em] text-accent mb-5">Latest</p>
                <ArticleCard article={featured} featured showWhyItMatters />
              </div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {category === "all" ? "All articles" : CATEGORY_LABELS[category as ArticleCategory]}
                  </p>
                  <span className="text-xs text-muted-foreground">{rest.length} articles</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((article) => (
                    <ArticleCard key={article.slug} article={article} showWhyItMatters />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <section className="container pb-24">
        <div className="glass rounded-3xl border border-border/40 p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="relative flex-1">
            <Zap className="w-9 h-9 text-accent mb-4" />
            <h2 className="text-2xl font-bold tracking-tight mb-2">Go deeper with the EV Hub</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Use our route planner, charging maps, model guides and EV comparison tools — all built on the same data behind these articles.
            </p>
          </div>
          <div className="relative flex flex-col gap-3 flex-shrink-0">
            <Link
              to={L("/ev")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              EV Hub <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to={L("/ev/compare")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-border/50 hover:border-border text-sm transition-colors"
            >
              Compare EVs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
