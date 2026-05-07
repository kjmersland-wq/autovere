import { ArticleCard } from "./ArticleCard";
import { LiveVideoCard } from "./LiveVideoCard";
import { useContentFeed } from "@/hooks/use-content";
import type { ContentQueryOptions } from "@/types/content";
import type { LiveVideo } from "@/hooks/use-youtube-search";
import { Loader2 } from "lucide-react";

type MixedContentFeedProps = {
  title?: string;
  subtitle?: string;
  queryOptions?: ContentQueryOptions;
  youtubeVideos?: LiveVideo[];
  maxItems?: number;
  layout?: "grid" | "masonry";
};

export const MixedContentFeed = ({
  title,
  subtitle,
  queryOptions,
  youtubeVideos = [],
  maxItems = 12,
  layout = "grid",
}: MixedContentFeedProps) => {
  const { data: contentItems, isLoading, error } = useContentFeed(queryOptions);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Failed to load content. Please try again later.</p>
      </div>
    );
  }

  // Combine content items and YouTube videos
  const mixedContent: Array<{ type: "article" | "video"; data: any; publishedAt: Date }> = [];

  // Add content items
  if (contentItems) {
    mixedContent.push(
      ...contentItems.map((item) => ({
        type: "article" as const,
        data: item,
        publishedAt: new Date(item.published_at),
      }))
    );
  }

  // Add YouTube videos
  if (youtubeVideos.length > 0) {
    mixedContent.push(
      ...youtubeVideos.map((video) => ({
        type: "video" as const,
        data: video,
        publishedAt: new Date(video.publishedAt),
      }))
    );
  }

  // Sort by published date (most recent first)
  mixedContent.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

  // Limit total items
  const limitedContent = mixedContent.slice(0, maxItems);

  if (limitedContent.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">No content available yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {(title || subtitle) && (
        <div className="text-center max-w-2xl mx-auto space-y-3">
          {title && (
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gradient">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Content Grid */}
      <div
        className={`grid gap-6 ${
          layout === "masonry"
            ? "md:grid-cols-2 lg:grid-cols-3"
            : "md:grid-cols-2 lg:grid-cols-3 auto-rows-fr"
        }`}
      >
        {limitedContent.map((item, index) => {
          const key = item.type === "article"
            ? `article-${item.data.id}`
            : `video-${item.data.id}`;

          // Feature the first item (make it larger)
          const isFeature = index === 0;

          if (item.type === "video") {
            return (
              <div key={key} className={isFeature ? "md:col-span-2" : ""}>
                <LiveVideoCard
                  video={item.data}
                  size={isFeature ? "lg" : "md"}
                  badge="VIDEO"
                />
              </div>
            );
          }

          return (
            <ArticleCard
              key={key}
              item={item.data}
              size={isFeature ? "lg" : "md"}
            />
          );
        })}
      </div>
    </div>
  );
};
