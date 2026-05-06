import { Link } from "react-router-dom";
import { ArrowRight, ExternalLink, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { VideoCard } from "@/components/VideoCard";
import { CURATED_ROWS, TRUSTED_REVIEWERS } from "@/data/media";

const Watch = () => {
  const hero = CURATED_ROWS[0]?.videos[0];

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
            A curated, intelligent stream of the most trusted automotive reviewers in the world.
            No noise. No clickbait. Just the videos Lumen quietly recommends.
          </p>
        </div>

        {hero && (
          <div className="relative">
            <VideoCard video={hero} size="lg" />
          </div>
        )}
      </section>

      {/* Curated rows */}
      {CURATED_ROWS.map((row) => (
        row.videos.length > 0 && (
          <section key={row.title} className="container pb-20">
            <div className="flex items-end justify-between mb-8 gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{row.title}</h2>
                <p className="text-muted-foreground text-sm md:text-base">{row.subtitle}</p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {row.videos.map((v) => (
                <div key={v.id} className="space-y-3">
                  <VideoCard video={v} />
                  {v.carSlug && (
                    <Link
                      to={`/cars/${v.carSlug}`}
                      className="text-xs text-accent inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Read the Lumen review <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )
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
