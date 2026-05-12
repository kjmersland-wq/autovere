import { Link } from "react-router-dom";
import { Clock, ChevronRight, Lightbulb } from "lucide-react";
import { MediaImage } from "@/components/MediaImage";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/data/articles";
import type { ArticleData } from "@/data/articles";
import { resolveArticleImage } from "@/lib/article-images";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { useLocation } from "react-router-dom";

interface ArticleCardProps {
  article: ArticleData;
  featured?: boolean;
  showWhyItMatters?: boolean;
}

export function ArticleCard({ article, featured = false, showWhyItMatters = false }: ArticleCardProps) {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const href = L(`/ev/news/${article.slug}`);
  const categoryColor = CATEGORY_COLORS[article.category];

  const dateStr = new Date(article.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (featured) {
    const media = { ...article.media, url: resolveArticleImage(article, 1400) };

    return (
      <Link
        to={href}
        className="group glass rounded-3xl border border-border/40 hover:border-border/60 transition-all duration-300 overflow-hidden hover:-translate-y-1 block"
      >
        {/* Hero image */}
        <div className="relative">
          <MediaImage
            media={media}
            aspectClass="aspect-[16/7]"
            overlayGradient
            showAttribution
          />
          {/* Category badge overlaid on image */}
          <div className="absolute top-5 left-5">
            <span
              className={`inline-flex items-center text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full border font-semibold bg-black/50 backdrop-blur-md ${categoryColor}`}
            >
              {CATEGORY_LABELS[article.category]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 lg:p-10">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              {article.readMinutes} min read
            </span>
            <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
            <span>{dateStr}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4 group-hover:text-accent transition-colors leading-snug max-w-3xl">
            {article.title}
          </h2>

          {/* Summary */}
          <p className="text-muted-foreground leading-relaxed mb-6 text-sm sm:text-base max-w-2xl">
            {article.summary}
          </p>

          {/* Why it matters */}
          {showWhyItMatters && (
            <div className="flex gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20 mb-6 max-w-2xl">
              <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">Why it matters: </span>
                {article.whyItMatters}
              </p>
            </div>
          )}

          {/* CTA */}
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all duration-200">
            Read analysis <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    );
  }

  /* ── Standard card ── */
  const media = { ...article.media, url: resolveArticleImage(article, 800) };

  return (
    <Link
      to={href}
      className="group glass rounded-2xl border border-border/40 hover:border-border/60 transition-all duration-300 overflow-hidden hover:-translate-y-0.5 flex flex-col"
    >
      {/* Image */}
      <div className="relative flex-shrink-0">
        <MediaImage media={media} aspectClass="aspect-[16/9]" overlayGradient />
        {/* Category badge on image */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-semibold bg-black/50 backdrop-blur-md ${categoryColor}`}
          >
            {CATEGORY_LABELS[article.category]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-semibold text-sm sm:text-base leading-snug mb-2.5 group-hover:text-accent transition-colors flex-1">
          {article.title}
        </h3>

        {/* Summary */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
          {article.summary}
        </p>

        {/* Why it matters */}
        {showWhyItMatters && (
          <div className="flex gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20 mb-4">
            <Lightbulb className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
              {article.whyItMatters}
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/20">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Clock className="w-2.5 h-2.5" />
            <span>{article.readMinutes} min</span>
            <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/40" />
            <span>
              {new Date(article.publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>
          <span className="text-[10px] font-medium text-accent flex items-center gap-1 group-hover:gap-1.5 transition-all duration-200">
            Read <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
