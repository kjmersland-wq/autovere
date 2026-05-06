import { ExternalLink, Globe, Settings2, FileText, KeyRound, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import type { CarMedia } from "@/data/media";
import { VideoCard } from "@/components/VideoCard";

const KIND_ICON = {
  site: Globe,
  configure: Settings2,
  specs: FileText,
  "test-drive": KeyRound,
  dealers: MapPin,
} as const;

export const CarMediaSection = ({ media, carName }: { media: CarMedia; carName: string }) => {
  const featured = media.videos.find((v) => v.category === "Featured") ?? media.videos[0];
  const rest = media.videos.filter((v) => v.id !== featured.id);

  return (
    <section className="container py-24 space-y-20">
      {/* Featured review + AI consensus */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
        <div>
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">Featured video review</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">
            What the most trusted reviewers say.
          </h2>
          <VideoCard video={featured} size="lg" />
        </div>
        <aside className="glass rounded-3xl p-8 lg:sticky lg:top-28">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-4">
            <Sparkles className="w-3.5 h-3.5" /> AI reviewer consensus
          </div>
          <h3 className="text-xl font-semibold tracking-tight mb-5 leading-snug">
            What reviewers agree on about the {carName}
          </h3>
          <ul className="space-y-4">
            {media.consensus.map((c) => (
              <li key={c} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
          <div className="text-[11px] text-muted-foreground mt-6 leading-relaxed">
            Synthesised from public expert reviews. Lumen surfaces consensus, not opinion.
          </div>
        </aside>
      </div>

      {/* Other videos */}
      {rest.length > 0 && (
        <div>
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">More expert reviews</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
            Different drivers, different lenses.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </div>
      )}

      {/* Explore further: official + trusted */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-4">
            <Globe className="w-3.5 h-3.5" /> Official manufacturer resources
          </div>
          <h3 className="text-2xl font-semibold tracking-tight mb-6">Explore the {carName} directly.</h3>
          <ul className="space-y-2">
            {media.official.map((o) => {
              const Icon = KIND_ICON[o.kind] ?? Globe;
              return (
                <li key={o.href}>
                  <a
                    href={o.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group flex items-center justify-between gap-4 px-4 py-3 rounded-2xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-gradient-primary transition-all">
                        <Icon className="w-4 h-4 text-accent group-hover:text-primary-foreground transition-colors" />
                      </span>
                      <span className="text-sm font-medium">{o.label}</span>
                    </span>
                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Trusted external sources
          </div>
          <h3 className="text-2xl font-semibold tracking-tight mb-6">Independent verification.</h3>
          <ul className="space-y-2">
            {media.trusted.map((t) => (
              <li key={t.href}>
                <a
                  href={t.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex items-center justify-between gap-4 px-4 py-3 rounded-2xl hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50"
                >
                  <span>
                    <div className="text-sm font-medium">{t.label}</div>
                    <div className="text-xs text-muted-foreground">{t.org}</div>
                  </span>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </a>
              </li>
            ))}
          </ul>
          <div className="text-[11px] text-muted-foreground mt-6 leading-relaxed">
            Lumen does not own these resources. Links open on the publisher's site.
          </div>
        </div>
      </div>
    </section>
  );
};
