import { ExternalLink, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { LiveVideoCard } from "@/components/LiveVideoCard";
import { LiveVideoRow } from "@/components/LiveVideoRow";
import { useYouTubeSearch } from "@/hooks/use-youtube-search";
import { TRUSTED_REVIEWERS } from "@/data/media";

const HERO_QUERY = "best new electric car review 2025";

const ROWS: { query: string; title: string; subtitle: string; order?: "relevance" | "date" | "viewCount" }[] = [
  {
    query: "best electric car review 2025",
    title: "Trending automotive reviews",
    subtitle: "What the most trusted reviewers are publishing right now.",
    order: "date",
  },
  {
    query: "electric car winter cold weather range test",
    title: "Winter driving reviews",
    subtitle: "Real-world cold-weather tests from reviewers who live where it snows.",
  },
  {
    query: "EV long distance road trip review",
    title: "Long-distance test videos",
    subtitle: "How these cars actually feel on a six-hour drive.",
  },
  {
    query: "luxury electric car quiet cabin review",
    title: "Quiet luxury, on camera",
    subtitle: "Cabin reviews of the most refined EVs reviewers have driven.",
  },
  {
    query: "family SUV electric car review",
    title: "Family-ready EVs",
    subtitle: "Space, safety, and how they handle real family life.",
  },
];

const Watch = () => {
  const { videos: heroVideos, loading: heroLoading } = useYouTubeSearch(HERO_QUERY, { max: 1, order: "relevance" });
  const hero = heroVideos[0];

  return (
    <PageShell>
      <SEO
        title="Watch — curated automotive video reviews · Lumen"
        description="A premium, AI-curated stream of trusted automotive reviews — winter tests, long-distance drives, quiet luxury, and the most discussed EVs."
        type="website"
      />

      {/* Hero */}
      <section className="container pt-12 pb-16">
        <div className="max-w-3xl mb-12">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Lumen Watch</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.05]">
            The reviews <span className="text-gradient">worth your time.</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            A curated, intelligent stream of the most trusted automotive reviewers in the world,
            updated live from YouTube. No noise. No clickbait. Just the videos Lumen quietly recommends.
          </p>
        </div>

        {heroLoading && (
          <div className="aspect-[16/9] rounded-2xl bg-secondary/40 animate-pulse border border-border/40" />
        )}
        {hero && <LiveVideoCard video={hero} size="lg" badge="Featured" />}
      </section>

      {/* Curated live rows */}
      {ROWS.map((row) => (
        <LiveVideoRow
          key={row.title}
          query={row.query}
          title={row.title}
          subtitle={row.subtitle}
          order={row.order}
          max={6}
        />
      ))}

      {/* Trusted reviewers */}
      <section className="container py-20">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> The most trusted reviewers
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
          The voices Lumen returns to.
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRUSTED_REVIEWERS.map((r) => (
            <a
              key={r.handle}
              href={r.url}
              target="_blank"
              rel="noreferrer noopener"
              className="group glass rounded-3xl p-7 hover:-translate-y-1 hover:shadow-glow transition-all duration-500 block"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="text-xl font-semibold tracking-tight">{r.name}</div>
                  <div className="text-xs text-muted-foreground">{r.handle}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.tagline}</p>
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default Watch;
