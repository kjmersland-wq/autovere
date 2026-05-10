import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Play, Star, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, ExternalLink, Zap } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { EV_MODELS } from "@/data/ev-models";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const ALL_REVIEWS = EV_MODELS.flatMap((model) =>
  model.youtubeReviews.map((r) => ({ ...r, model }))
);

const CONSENSUS: Record<string, { score: number; range: string; charging: string; winter: string; comfort: string; value: string }> = {
  "tesla-model-y": { score: 88, range: "430 km real-world", charging: "Supercharger unmatched", winter: "Heat pump helps, plan stops", comfort: "Firm ride", value: "Strong long-term" },
  "porsche-macan-ev": { score: 93, range: "490 km real-world", charging: "270 kW — class-best", winter: "Excellent 800V cold perf.", comfort: "Outstanding", value: "Premium justified" },
  "kia-ev9": { score: 90, range: "450 km real-world", charging: "800V reliable in cold", winter: "Good for size", comfort: "Best-in-class space", value: "Strong for families" },
  "hyundai-ioniq5": { score: 87, range: "400 km real-world", charging: "18 min 10–80% remarkable", winter: "Range drops noticeably", comfort: "Flat floor, airy", value: "Excellent value" },
  "bmw-i5": { score: 89, range: "460 km real-world", charging: "22 kW AC star feature", winter: "Strong with 22 kW AC", comfort: "Benchmark interior", value: "Expensive but earns it" },
  "audi-q6-etron": { score: 91, range: "510 km real-world", charging: "270 kW minimal taper", winter: "Best 800V cold stability", comfort: "Refined and quiet", value: "Competitive segment" },
  "volvo-ex30": { score: 84, range: "370 km real-world", charging: "153 kW adequate", winter: "Small battery feels winter", comfort: "Clever space use", value: "Best small EV value" },
  "bmw-ix": { score: 88, range: "500 km real-world", charging: "22 kW AC + 195 kW DC", winter: "Large battery = confidence", comfort: "Near-silent reference", value: "Expensive — justified?" },
};

interface ReviewCardProps {
  videoId: string;
  channel: string;
  title: string;
  views: string;
  modelName: string;
  modelSlug: string;
}

function ReviewCard({ videoId, channel, title, views, modelName, modelSlug }: ReviewCardProps) {
  const [playing, setPlaying] = useState(false);
  const thumb = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="glass rounded-2xl border border-border/40 overflow-hidden hover:border-border/70 transition-colors group">
      {/* Thumbnail / player */}
      <div className="relative aspect-video bg-card overflow-hidden">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
            allow="autoplay; fullscreen"
            className="w-full h-full"
            title={title}
          />
        ) : (
          <>
            <img
              src={thumb}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play review"
            >
              <div className="w-14 h-14 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-colors shadow-elegant">
                <Play className="w-5 h-5 text-black ml-0.5" />
              </div>
            </button>
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
              <span className="text-xs font-medium text-white bg-black/60 px-2 py-0.5 rounded">{channel}</span>
              <span className="text-xs text-white/80">{views} views</span>
            </div>
          </>
        )}
      </div>
      {/* Card body */}
      <div className="p-4">
        <Link
          to={`/ev/models/${modelSlug}`}
          className="text-[10px] uppercase tracking-widest text-accent hover:underline mb-1 block"
        >
          {modelName}
        </Link>
        <p className="text-sm font-medium leading-snug line-clamp-2 mb-3">{title}</p>
        <a
          href={`https://youtube.com/watch?v=${videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Watch on YouTube <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

interface ConsensusCardProps {
  slug: string;
  name: string;
}

function ConsensusCard({ slug, name }: ConsensusCardProps) {
  const [open, setOpen] = useState(false);
  const c = CONSENSUS[slug];
  const model = EV_MODELS.find((m) => m.slug === slug);
  if (!c || !model) return null;

  return (
    <div className="glass rounded-2xl border border-border/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-card/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="font-semibold">{name}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Reviewer consensus · {model.youtubeReviews.length} reviews analysed</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient">{c.score}</div>
            <div className="text-[10px] text-muted-foreground">/ 100</div>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Real range", value: c.range },
              { label: "Charging", value: c.charging },
              { label: "Winter", value: c.winter },
              { label: "Comfort", value: c.comfort },
              { label: "Value", value: c.value },
            ].map((item) => (
              <div key={item.label} className="bg-card/60 rounded-xl p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</div>
                <div className="text-xs font-medium">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 mb-2">
                <ThumbsUp className="w-3.5 h-3.5" /> Most mentioned pros
              </div>
              <ul className="space-y-1">
                {model.pros.slice(0, 3).map((pro) => (
                  <li key={pro} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">+</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-red-400 mb-2">
                <ThumbsDown className="w-3.5 h-3.5" /> Most mentioned cons
              </div>
              <ul className="space-y-1">
                {model.cons.slice(0, 3).map((con) => (
                  <li key={con} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-red-400 mt-0.5">−</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            to={`/ev/models/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
          >
            Full model deep-dive →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function EVReviews() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const [activeModel, setActiveModel] = useState("All");

  const models = ["All", ...EV_MODELS.map((m) => m.name)];
  const filtered = activeModel === "All"
    ? ALL_REVIEWS
    : ALL_REVIEWS.filter((r) => r.model.name === activeModel);

  return (
    <PageShell>
      <SEO
        title="EV Video Reviews — European Model Guide | AUTOVERE"
        description="Curated YouTube EV reviews with consensus scoring, real-world range data and reviewer analysis for the best EVs in Europe."
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-transparent to-cyan-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-violet-400 mb-5">
            <Play className="w-3.5 h-3.5" /> EV Hub › Reviews
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            Every major EV review, <span className="text-gradient">scored and synthesised.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            We aggregate video reviews from trusted automotive channels, extract the key metrics
            and build reviewer consensus scores — so you get the truth, faster.
          </p>
        </div>
      </section>

      {/* Consensus scores */}
      <section className="container py-16">
        <h2 className="text-2xl font-bold tracking-tight mb-2">Reviewer consensus scores</h2>
        <p className="text-muted-foreground text-sm mb-8">Click any model to expand key metrics, pros, cons and links to the full model page.</p>
        <div className="space-y-3 max-w-3xl">
          {EV_MODELS.map((m) => (
            <ConsensusCard key={m.slug} slug={m.slug} name={m.name} />
          ))}
        </div>
      </section>

      {/* Review videos */}
      <section className="container pb-24">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Review videos</h2>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} reviews</p>
          </div>
        </div>

        {/* Model filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {models.map((m) => (
            <button
              key={m}
              onClick={() => setActiveModel(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeModel === m ? "bg-primary text-primary-foreground border-primary" : "glass border-border/40 text-muted-foreground hover:text-foreground"}`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r) => (
            <ReviewCard
              key={r.videoId}
              videoId={r.videoId}
              channel={r.channel}
              title={r.title}
              views={r.views}
              modelName={r.model.name}
              modelSlug={r.model.slug}
            />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
