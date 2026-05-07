import { ExternalLink, Calendar, User } from "lucide-react";
import type { ContentItemWithSource } from "@/types/content";
import { CONTENT_TYPE_LABELS } from "@/types/content";

export const ArticleCard = ({
  item,
  size = "md",
}: {
  item: ContentItemWithSource;
  size?: "sm" | "md" | "lg";
}) => {
  const formattedDate = new Date(item.published_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const contentTypeLabel = CONTENT_TYPE_LABELS[item.content_type] || "Article";

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`group relative glass rounded-3xl overflow-hidden hover:-translate-y-2 transition-all duration-700 hover:shadow-glow block ${
        size === "lg" ? "md:col-span-2" : ""
      }`}
    >
      {/* Thumbnail */}
      {item.thumbnail_url && (
        <div className={`relative overflow-hidden ${
          size === "lg" ? "aspect-[16/9]" : "aspect-[16/11]"
        }`}>
          <img
            src={item.thumbnail_url}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover scale-105 group-hover:scale-115 transition-transform duration-[2200ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Content Type Badge */}
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full glass">
            <span className="w-1 h-1 rounded-full bg-accent animate-glow-pulse" />
            {contentTypeLabel}
          </div>

          {/* Quality Score */}
          {item.quality_score && item.quality_score >= 70 && (
            <div className="absolute top-4 right-4 glass rounded-2xl px-3 py-2">
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Quality</div>
              <div className="text-xl font-bold text-gradient leading-none">{item.quality_score}</div>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={size === "lg" ? "p-8" : "p-6"}>
        {/* Source Attribution */}
        <div className="flex items-center gap-2 mb-3">
          {item.source.logo_url && (
            <img
              src={item.source.logo_url}
              alt={item.source.name}
              className="w-5 h-5 object-contain rounded"
            />
          )}
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <span className="font-medium">{item.source.name}</span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formattedDate}
            </span>
            {item.author && (
              <>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {item.author}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-semibold tracking-tight mb-3 line-clamp-2 ${
          size === "lg" ? "text-3xl md:text-4xl" : "text-xl"
        }`}>
          {item.title}
        </h3>

        {/* Excerpt */}
        {item.excerpt && (
          <p className={`text-muted-foreground leading-relaxed mb-4 ${
            size === "lg" ? "text-base line-clamp-3" : "text-sm line-clamp-2"
          }`}>
            {item.excerpt}
          </p>
        )}

        {/* Categories */}
        {item.categories && item.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-secondary/50 text-secondary-foreground"
              >
                {category}
              </span>
            ))}
          </div>
        )}

        {/* Read More Link */}
        <div className="text-xs text-accent inline-flex items-center gap-1 group-hover:gap-2 transition-all">
          Read full article <ExternalLink className="w-3 h-3" />
        </div>
      </div>

      {/* No thumbnail fallback */}
      {!item.thumbnail_url && (
        <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full glass">
          <span className="w-1 h-1 rounded-full bg-accent animate-glow-pulse" />
          {contentTypeLabel}
        </div>
      )}
    </a>
  );
};
