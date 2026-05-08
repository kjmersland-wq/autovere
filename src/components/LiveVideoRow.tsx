import { useTranslation } from "react-i18next";
import { useYouTubeSearch } from "@/hooks/use-youtube-search";
import { LiveVideoCard } from "@/components/LiveVideoCard";
import { getUiCopy } from "@/i18n/localized-content";

export const LiveVideoRow = ({
  query,
  title,
  subtitle,
  max = 6,
  order = "relevance",
  badge,
}: {
  query: string;
  title: string;
  subtitle?: string;
  max?: number;
  order?: "relevance" | "date" | "viewCount";
  badge?: string;
}) => {
  const { i18n } = useTranslation();
  const ui = getUiCopy(i18n.language).liveVideo;
  const { videos, loading, error } = useYouTubeSearch(query, { max, order });

  return (
    <section className="container pb-20">
      <div className="flex items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{title}</h2>
          {subtitle && <p className="text-muted-foreground text-sm md:text-base">{subtitle}</p>}
        </div>
      </div>

      {loading && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[16/10] rounded-2xl bg-secondary/40 animate-pulse border border-border/40"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="text-sm text-muted-foreground glass rounded-2xl p-6">
          {ui.loadError} {error}
        </div>
      )}

      {!loading && !error && videos.length === 0 && (
        <div className="text-sm text-muted-foreground">{ui.noReviews}</div>
      )}

      {!loading && videos.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v) => (
            <LiveVideoCard key={v.id} video={v} badge={badge} />
          ))}
        </div>
      )}
    </section>
  );
};
