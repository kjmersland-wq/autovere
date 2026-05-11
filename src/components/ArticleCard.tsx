import { Link } from "react-router-dom";
import { Clock, ChevronRight, Lightbulb } from "lucide-react";
import { MediaImage } from "@/components/MediaImage";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/data/articles";
import type { ArticleData } from "@/data/articles";
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

  if (featured) {
    return (
      <Link
        to={href}
        className="group glass rounded-3xl border border-border/40 hover:border-border/70 transition-all duration-300 overflow-hidden hover:-translate-y-1 block"
      >
        <MediaImage
          media={article.media}
          aspectClass="aspect-[16/7]"
          showAttribution
          variant="card"
        />
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium ${categoryColor}`}>
              {CATEGORY_LABELS[article.category]}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" /> {article.readMinutes} min read
            </span>
            <span className="text-xs text-muted-foreground ml-auto">
              {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-3 group-hover:text-accent transition-colors leading-snug">
            {article.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-5 text-sm">{article.summary}</p>
          {showWhyItMatters && (
            <div className="flex gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20 mb-5">
              <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-foreground font-medium">Why it matters: </span>
                {article.whyItMatters}
              </p>
            </div>
          )}
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent group-hover:gap-2.5 transition-all">
            Read analysis <ChevronRight className="w-4 h-4" />
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to={href}
      className="group glass rounded-2xl border border-border/40 hover:border-border/70 transition-all duration-300 overflow-hidden hover:-translate-y-0.5 flex flex-col"
    >
      <MediaImage media={article.media} aspectClass="aspect-[16/9]" showAttribution variant="card" />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border font-medium ${categoryColor}`}>
            {CATEGORY_LABELS[article.category]}
          </span>
          <span className="text-[10px] text-muted-foreground ml-auto flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> {article.readMinutes} min
          </span>
        </div>
        <h3 className="font-semibold text-base leading-snug mb-2 group-hover:text-accent transition-colors flex-1">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">{article.summary}</p>
        {showWhyItMatters && (
          <div className="flex gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20 mb-4">
            <Lightbulb className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{article.whyItMatters}</p>
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/20">
          <span className="text-[10px] text-muted-foreground">
            {new Date(article.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
          <span className="text-[10px] font-medium text-accent flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Read <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
