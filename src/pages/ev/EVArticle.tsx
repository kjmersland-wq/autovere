import { useParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Clock, Lightbulb, Tag, ChevronRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { MediaImage } from "@/components/MediaImage";
import { RelatedContent } from "@/components/RelatedContent";
import { ArticleCard } from "@/components/ArticleCard";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import {
  ARTICLES,
  CATEGORY_LABELS,
  CATEGORY_COLORS,
  getRelatedArticles,
} from "@/data/articles";

export default function EVArticle() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <PageShell>
        <SEO title="Article Not Found | AUTOVERE" description="This article could not be found." />
        <div className="container py-40 text-center">
          <h1 className="text-3xl font-bold mb-4">Article not found</h1>
          <Link to={L("/ev/news")} className="text-accent hover:underline">
            ← Back to EV Intelligence
          </Link>
        </div>
      </PageShell>
    );
  }

  const related = getRelatedArticles(article.slug, 3);
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

  return (
    <PageShell>
      <SEO
        title={`${article.title} | AUTOVERE EV Intelligence`}
        description={article.summary}
        type="article"
        jsonLd={jsonLd}
      />

      {/* Hero */}
      <div className="pt-24">
        <MediaImage media={article.media} aspectClass="aspect-[21/7]" showAttribution className="w-full" />
      </div>

      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back */}
          <Link
            to={L("/ev/news")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> EV Intelligence
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border font-medium ${categoryColor}`}>
              {CATEGORY_LABELS[article.category]}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {article.readMinutes} min read
            </span>
            <span className="text-xs text-muted-foreground">
              {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-snug mb-6">
            {article.title}
          </h1>

          {/* Summary */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-8 border-l-2 border-accent pl-5">
            {article.summary}
          </p>

          {/* Why it matters */}
          <div className="flex gap-4 p-5 rounded-2xl bg-accent/5 border border-accent/20 mb-10">
            <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Why this matters</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{article.whyItMatters}</p>
            </div>
          </div>

          {/* Body */}
          <div className="prose prose-invert max-w-none space-y-5 mb-12">
            {article.body.map((para, i) => (
              <p key={i} className="text-base text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-10 pb-10 border-b border-border/30">
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

          {/* Related content cross-links */}
          <RelatedContent
            relatedVehicles={article.relatedVehicles}
            relatedNetworks={article.relatedNetworks}
            relatedGuides={article.relatedGuides}
            className="mb-12"
          />
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="max-w-5xl mx-auto mt-16 pt-10 border-t border-border/30">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">Related Intelligence</h2>
              <Link
                to={L("/ev/news")}
                className="text-sm text-accent hover:underline flex items-center gap-1"
              >
                All articles <ChevronRight className="w-3.5 h-3.5" />
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
