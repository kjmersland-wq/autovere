import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Play, Star, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, ExternalLink, Zap, ShieldCheck, Globe } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { EV_MODELS } from "@/data/ev-models";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const ALL_REVIEWS = EV_MODELS.flatMap((model) =>
  model.youtubeReviews.map((r) => ({ ...r, model }))
);

interface ConsensusData {
  score: number;
  confidence: number;
  range: string;
  charging: string;
  winter: string;
  comfort: string;
  value: string;
  mostPraised: string[];
  mostCritiqued: string[];
  highlightQuote: string;
  highlightChannel: string;
}

const CONSENSUS: Record<string, ConsensusData> = {
  "tesla-model-y": {
    score: 88, confidence: 94,
    range: "430 km real-world", charging: "Supercharger unmatched", winter: "Heat pump helps, plan stops", comfort: "Firm ride", value: "Strong long-term",
    mostPraised: ["Supercharger reliability", "Cargo versatility", "OTA software updates"],
    mostCritiqued: ["Firm suspension", "No stalks / minimal controls", "Wind noise above 110 km/h"],
    highlightQuote: "The most complete package in the segment — not perfect, but closest to right for most people.",
    highlightChannel: "Fully Charged Show",
  },
  "porsche-macan-ev": {
    score: 93, confidence: 88,
    range: "490 km real-world", charging: "270 kW — class-best", winter: "Excellent 800V cold perf.", comfort: "Outstanding", value: "Premium justified",
    mostPraised: ["Cold weather charging stability", "Ride and handling balance", "Interior quality"],
    mostCritiqued: ["Price relative to class", "Smaller cargo than rivals", "Limited rear headroom"],
    highlightQuote: "The first Porsche that genuinely makes you feel nothing is being sacrificed for the electric powertrain.",
    highlightChannel: "Bjørn Nyland",
  },
  "kia-ev9": {
    score: 90, confidence: 91,
    range: "450 km real-world", charging: "800V reliable in cold", winter: "Good for size", comfort: "Best-in-class space", value: "Strong for families",
    mostPraised: ["Third-row usability", "800V cold charging", "Interior space intelligence"],
    mostCritiqued: ["Size in urban parking", "Infotainment learning curve", "Motorway efficiency"],
    highlightQuote: "The only electric vehicle that genuinely replaces a diesel people carrier without compromise.",
    highlightChannel: "AutoTrader UK",
  },
  "hyundai-ioniq5": {
    score: 87, confidence: 96,
    range: "400 km real-world", charging: "18 min 10–80% remarkable", winter: "Range drops noticeably", comfort: "Flat floor, airy", value: "Excellent value",
    mostPraised: ["18-minute charging time", "Interior space design", "800V architecture value"],
    mostCritiqued: ["Winter range sensitivity", "Rear visibility", "Software vs Tesla"],
    highlightQuote: "18 minutes to 80% changed the conversation about whether EVs can road trip. It proved they can.",
    highlightChannel: "Fully Charged Show",
  },
  "bmw-i5": {
    score: 89, confidence: 85,
    range: "460 km real-world", charging: "22 kW AC star feature", winter: "Strong with 22 kW AC", comfort: "Benchmark interior", value: "Expensive but earns it",
    mostPraised: ["22 kW AC charging", "Interior refinement", "Highway efficiency"],
    mostCritiqued: ["DC speed vs 800V rivals", "Price for non-M spec", "Large exterior dimensions"],
    highlightQuote: "The 22 kW AC charging is a detail that sounds boring until it changes how you plan every hotel stop.",
    highlightChannel: "Bjørn Nyland",
  },
  "audi-q6-etron": {
    score: 91, confidence: 89,
    range: "510 km real-world", charging: "270 kW minimal taper", winter: "Best 800V cold stability", comfort: "Refined and quiet", value: "Competitive segment",
    mostPraised: ["Charging curve consistency", "Winter range leadership", "Interior quality jump"],
    mostCritiqued: ["Price creep with options", "Smaller cargo than EV9", "Heavier than it should be"],
    highlightQuote: "The charging curve is what makes this special — it doesn't taper the way competitors do, and that matters on long runs.",
    highlightChannel: "InsideEVs",
  },
  "volvo-ex30": {
    score: 84, confidence: 92,
    range: "370 km real-world", charging: "153 kW adequate", winter: "Small battery feels winter", comfort: "Clever space use", value: "Best small EV value",
    mostPraised: ["Build quality for price", "Safety ratings", "Urban agility"],
    mostCritiqued: ["Winter range on smaller battery", "Screen-heavy controls", "Limited cargo"],
    highlightQuote: "The first genuinely small EV that doesn't feel like a compromise — it's just a good car that happens to be electric.",
    highlightChannel: "AutoTrader UK",
  },
  "bmw-ix": {
    score: 88, confidence: 83,
    range: "500 km real-world", charging: "22 kW AC + 195 kW DC", winter: "Large battery = confidence", comfort: "Near-silent reference", value: "Expensive — justified?",
    mostPraised: ["Cabin refinement", "Large battery confidence", "22 kW AC versatility"],
    mostCritiqued: ["Price vs alternatives", "Polarising exterior", "Software complexity"],
    highlightQuote: "The quietest EV interior tested — the noise isolation is at a level most manufacturers don't attempt.",
    highlightChannel: "Fully Charged Show",
  },
};

const CHANNEL_TRUST: Record<string, { score: number; country: string; speciality: string }> = {
  "Fully Charged Show": { score: 96, country: "🇬🇧 UK", speciality: "Long-term EV advocacy, real-world focus" },
  "Bjørn Nyland": { score: 98, country: "🇯🇵 Japan / Norway", speciality: "Data-driven range and charging tests" },
  "AutoTrader UK": { score: 88, country: "🇬🇧 UK", speciality: "Consumer perspective, value analysis" },
  "InsideEVs": { score: 91, country: "🇺🇸 USA / EU", speciality: "Technical deep-dives, spec accuracy" },
  "What Car?": { score: 85, country: "🇬🇧 UK", speciality: "Consumer testing, ownership focus" },
  "Carwow": { score: 82, country: "🇬🇧 UK", speciality: "Entertainment-led, broad audience" },
  "The Electric Viking": { score: 79, country: "🇦🇺 Australia", speciality: "Industry news, commentary" },
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
        <div className="flex items-center justify-between">
          <a
            href={`https://youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Watch on YouTube <ExternalLink className="w-3 h-3" />
          </a>
          {CHANNEL_TRUST[channel] && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">{CHANNEL_TRUST[channel].score}</span>
              <Globe className="w-3 h-3 ml-1" />
              <span>{CHANNEL_TRUST[channel].country}</span>
            </div>
          )}
        </div>
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

  const confidenceColor = c.confidence >= 90 ? "text-emerald-400" : c.confidence >= 80 ? "text-amber-400" : "text-red-400";

  return (
    <div className="glass rounded-2xl border border-border/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-card/50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="font-semibold">{name}</div>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="text-xs text-muted-foreground">{model.youtubeReviews.length} reviews analysed</div>
            <div className={`flex items-center gap-1 text-[10px] ${confidenceColor}`}>
              <ShieldCheck className="w-3 h-3" />
              {c.confidence}% confidence
            </div>
          </div>
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
          {/* Highlight quote */}
          <div className="bg-card/40 border border-border/30 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-accent mb-2">Reviewer consensus quote</div>
            <p className="text-sm text-muted-foreground italic leading-relaxed">"{c.highlightQuote}"</p>
            <div className="text-[10px] text-muted-foreground mt-2">— {c.highlightChannel}</div>
          </div>

          {/* Key metrics */}
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

          {/* Most praised / critiqued */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 mb-2">
                <ThumbsUp className="w-3.5 h-3.5" /> Most praised features
              </div>
              <ul className="space-y-1">
                {c.mostPraised.map((pro) => (
                  <li key={pro} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="text-emerald-400 mt-0.5">+</span> {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-red-400 mb-2">
                <ThumbsDown className="w-3.5 h-3.5" /> Most discussed issues
              </div>
              <ul className="space-y-1">
                {c.mostCritiqued.map((con) => (
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
