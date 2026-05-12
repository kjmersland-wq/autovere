import { useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { Zap, Rss, ChevronRight, Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { ArticleCard } from "@/components/ArticleCard";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import {
  ARTICLES,
  type ArticleCategory,
} from "@/data/articles";
import { rankArticles } from "@/lib/content-ranking";

export default function EVNews() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const [category, setCategory] = useState<ArticleCategory | "all">("all");

  const CATEGORIES: { value: ArticleCategory | "all"; label: string }[] = [
    { value: "all", label: t("ev.news.cat_all") },
    { value: "infrastructure", label: t("ev.news.cat_infrastructure") },
    { value: "technology", label: t("ev.news.cat_technology") },
    { value: "market", label: t("ev.news.cat_market") },
    { value: "ownership", label: t("ev.news.cat_ownership") },
    { value: "policy", label: t("ev.news.cat_policy") },
    { value: "comparison", label: t("ev.news.cat_comparison") },
  ];

  const sorted = useMemo(
    () => rankArticles(ARTICLES, "total").map((r) => r.article),
    []
  );

  const filtered = useMemo(
    () => (category === "all" ? sorted : sorted.filter((a) => a.category === category)),
    [sorted, category]
  );

  const [featured, ...rest] = filtered;

  const activeLabel = CATEGORIES.find((c) => c.value === category)?.label ?? "";

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
        title={t("ev.news.seo_title")}
        description={t("ev.news.seo_desc")}
        image="https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=80"
        jsonLd={jsonLd}
      />

      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/40 via-transparent to-cyan-950/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-400 mb-6">
            <Rss className="w-3.5 h-3.5" />
            {t("ev.news.eyebrow")}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 max-w-3xl">
            {t("ev.news.title")}{" "}
            <span className="text-gradient">{t("ev.news.title_b")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
            {t("ev.news.subtitle")}
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-accent" />
              {t("ev.news.why_matters_label")}
            </div>
            <span className="text-border">·</span>
            <span>{t("ev.news.articles_count", { n: ARTICLES.length })}</span>
          </div>
        </div>
      </section>

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
          <div className="text-center py-24 text-muted-foreground">{t("ev.news.no_articles")}</div>
        ) : (
          <>
            {featured && (
              <div className="mb-12">
                <p className="text-xs uppercase tracking-[0.25em] text-accent mb-5">{t("ev.news.latest")}</p>
                <ArticleCard article={featured} featured showWhyItMatters />
              </div>
            )}

            {rest.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {category === "all" ? t("ev.news.all_articles") : activeLabel}
                  </p>
                  <span className="text-xs text-muted-foreground">{t("ev.news.articles_count", { n: rest.length })}</span>
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

      <section className="container pb-24">
        <div className="glass rounded-3xl border border-border/40 p-10 md:p-14 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          <div className="relative flex-1">
            <Zap className="w-9 h-9 text-accent mb-4" />
            <h2 className="text-2xl font-bold tracking-tight mb-2">{t("ev.news.cta_title")}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("ev.news.cta_lead")}
            </p>
          </div>
          <div className="relative flex flex-col gap-3 flex-shrink-0">
            <Link
              to={L("/ev")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              {t("ev.nav.hub")} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to={L("/ev/compare")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-border/50 hover:border-border text-sm transition-colors"
            >
              {t("ev.news.cta_compare")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
