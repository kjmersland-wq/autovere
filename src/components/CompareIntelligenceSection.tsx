import { Play, Sparkles, Users, Clock, ShieldCheck } from "lucide-react";
import { useCompareIntelligence } from "@/hooks/use-compare-intelligence";

const formatViews = (v?: string) => {
  if (!v) return "";
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return "";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`;
  return `${n} views`;
};

type Props = {
  aSlug: string;
  bSlug: string;
  aName: string;
  bName: string;
};

export const CompareIntelligenceSection = ({ aSlug, bSlug, aName, bName }: Props) => {
  const { data, loading } = useCompareIntelligence(aSlug, bSlug, aName, bName);

  return (
    <section className="container pb-24">
      {/* AI consensus (first — emotional understanding before tech) */}
      <div className="relative mb-16">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4 flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> AutoVere reviewer consensus
        </div>
        {loading || !data ? (
          <div className="space-y-3">
            <div className="h-7 w-3/4 bg-secondary/40 rounded animate-pulse" />
            <div className="h-7 w-2/3 bg-secondary/40 rounded animate-pulse" />
          </div>
        ) : (
          <p className="text-2xl md:text-3xl font-semibold tracking-tight leading-snug max-w-3xl text-foreground/95">
            {data.summary}
          </p>
        )}
        {data && data.source_count > 0 && (
          <div className="mt-4 text-xs text-muted-foreground/70 flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" />
            Synthesised from {data.source_count} reviewer signals · prioritising trusted sources
          </div>
        )}
      </div>

      {/* Contrasts grid */}
      {data && data.contrasts.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3 mb-16">
          {data.contrasts.map((c) => (
            <div
              key={c.dimension}
              className="glass rounded-2xl p-6 border border-border/40"
            >
              <div className="text-[10px] uppercase tracking-[0.25em] text-accent mb-4">
                {c.dimension}
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 shrink-0 w-16">
                    {aName.split(" ")[0]}
                  </div>
                  <div className="text-sm leading-relaxed">{c.a}</div>
                </div>
                <div className="h-px bg-border/30" />
                <div className="flex gap-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1 shrink-0 w-16">
                    {bName.split(" ")[0]}
                  </div>
                  <div className="text-sm leading-relaxed">{c.b}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cinematic video grid */}
      {data && data.videos.length > 0 && (
        <div>
          <div className="flex items-end justify-between mb-8 flex-wrap gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-2">
                Curated comparison reviews
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Watch the reviewers reviewers trust.
              </h3>
            </div>
            <div className="text-xs text-muted-foreground/70 max-w-xs">
              Filtered for trusted sources. Clickbait, reaction, and low-trust content excluded.
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.videos.map((v, i) => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden rounded-2xl border border-border/40 hover:border-accent/40 transition-all duration-500 hover:-translate-y-1 ${
                  i === 0 ? "md:col-span-2 lg:col-span-2 md:row-span-2" : ""
                }`}
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    loading="lazy"
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full glass flex items-center justify-center backdrop-blur-xl">
                      <Play className="w-5 h-5 text-foreground fill-foreground ml-0.5" />
                    </div>
                  </div>
                  {v.duration && (
                    <div className="absolute bottom-3 right-3 text-[10px] font-medium tracking-wider px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm">
                      {v.duration}
                    </div>
                  )}
                  {(v.trust ?? 0) >= 4 && (
                    <div className="absolute top-3 left-3 text-[9px] uppercase tracking-[0.2em] px-2 py-1 rounded-full bg-accent/20 backdrop-blur-md text-accent border border-accent/30">
                      Trusted source
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h4
                    className={`font-semibold leading-snug mb-3 line-clamp-2 ${
                      i === 0 ? "text-lg md:text-xl" : "text-sm"
                    }`}
                  >
                    {v.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> {v.channel}
                    </span>
                    {v.views && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatViews(v.views)}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {data && data.videos.length === 0 && !loading && (
        <div className="text-sm text-muted-foreground/70 italic py-8 text-center">
          No trusted comparison reviews surfaced yet for this pairing — AutoVere will keep watching.
        </div>
      )}
    </section>
  );
};
