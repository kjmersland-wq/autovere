import { useParams, Link, useLocation } from "react-router-dom";
import { Clock, Lightbulb, Tag, ChevronRight, Share2, Link2, Check } from "lucide-react";
import { useState } from "react";
import { EVBreadcrumb } from "@/components/EVBreadcrumb";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { MediaImage } from "@/components/MediaImage";
import { RelatedContent } from "@/components/RelatedContent";
import { ArticleCard } from "@/components/ArticleCard";
import { IntelligencePanel } from "@/components/IntelligenceBlocks";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import {
  ARTICLES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getRelatedArticles,
} from "@/data/articles";
import { getArticleIntelligence } from "@/data/article-intelligence";
import { resolveArticleImage } from "@/lib/article-images";

export default function EVArticle() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const [copied, setCopied] = useState(false);

  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <PageShell>
        <SEO title={t("ev.database.article_nf_title")} description={t("ev.database.article_nf_desc")} />
        <div className="container py-40 text-center">
          <h1 className="text-3xl font-bold mb-4">{t("ev.news.article_not_found")}</h1>
          <Link to={L("/ev/news")} className="text-accent hover:underline">
            ← {t("ev.news.back_to_intel")}
          </Link>
        </div>
      </PageShell>
    );
  }

  const related = getRelatedArticles(article.slug, 3);
  const intelligence = getArticleIntelligence(article.slug);
  const categoryColor = CATEGORY_COLORS[article.category];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary,
    datePublished: article.publishedAt,
    author: { "@type": "Organization", name: "AUTOVERE" },
    publisher: { "@type": "Organization", name: "AUTOVERE", url: "https://autovere.com" },
    keywords: article.tags.join(", "),
  };

  const dateLocale = lang === "no" ? "nb-NO" : "en-GB";

  return (
    <PageShell>
      <SEO
        title={`${article.title} | AUTOVERE EV Intelligence`}
        description={article.summary}
        type="article"
        image={resolveArticleImage(article, 1200)}
        jsonLd={jsonLd}
      />

      <div className="pt-20">
        <MediaImage
          media={{ ...article.media, url: resolveArticleImage(article, 1600) }}
          aspectClass="aspect-[21/7]"
          overlayGradient
          showAttribution
          className="w-full"
        />
      </div>

      <div className="container py-12">
        <EVBreadcrumb items={[
          { label: t("ev.nav.hub"), to: L("/ev") },
          { label: t("ev.nav.news"), to: L("/ev/news") },
          { label: article.title },
        ]} />

        <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border font-medium ${categoryColor}`}>
                {CATEGORY_LABELS[article.category]}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" /> {t("ev.news.read_time", { n: article.readMinutes })}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(article.publishedAt).toLocaleDateString(dateLocale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-6">
              {article.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-2 border-accent pl-5">
              {article.summary}
            </p>

            <div className="flex gap-4 p-5 rounded-2xl bg-accent/5 border border-accent/20 mb-10">
              <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">{t("ev.news.why_matters")}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{article.whyItMatters}</p>
              </div>
            </div>

            <div className="space-y-5 mb-12">
              {article.body.map((para, i) => (
                <p key={i} className="text-base text-muted-foreground leading-relaxed">
                  {para}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Tag className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] glass border border-border/40 rounded-full px-2.5 py-1 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Share bar */}
            <div className="flex items-center gap-3 mb-10 pb-10 border-b border-border/30">
              <Share2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              <span className="text-xs text-muted-foreground mr-1">Share</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X (Twitter)"
                className="text-[10px] glass border border-border/40 rounded-full px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-border/70 transition-colors"
              >
                X / Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
                className="text-[10px] glass border border-border/40 rounded-full px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-border/70 transition-colors"
              >
                LinkedIn
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                aria-label="Copy link"
                className="text-[10px] glass border border-border/40 rounded-full px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-border/70 transition-colors inline-flex items-center gap-1"
              >
                {copied ? <><Check className="w-3 h-3 text-accent" /> Copied</> : <><Link2 className="w-3 h-3" /> Copy link</>}
              </button>
            </div>

            {intelligence && (
              <div className="lg:hidden mb-10">
                <IntelligencePanel intelligence={intelligence} />
              </div>
            )}

            <RelatedContent
              relatedVehicles={article.relatedVehicles}
              relatedNetworks={article.relatedNetworks}
              relatedGuides={article.relatedGuides}
            />
          </div>

          {intelligence && (
            <div className="hidden lg:block sticky top-24">
              <IntelligencePanel intelligence={intelligence} />
            </div>
          )}
        </div>

        {related.length > 0 && (
          <div className="mt-20 pt-10 border-t border-border/30">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">{t("ev.news.related_intel")}</h2>
              <Link
                to={L("/ev/news")}
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                {t("ev.news.all_articles")} <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
