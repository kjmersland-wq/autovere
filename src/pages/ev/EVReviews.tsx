import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Play, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { EV_MODELS } from "@/data/ev-models";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { useCarImage } from "@/hooks/useCarImage";

const ALL_REVIEWS = EV_MODELS.flatMap((model) =>
  model.youtubeReviews.map((r) => ({ ...r, model }))
);

interface ConsensusData {
  range: string;
  charging: string;
  winter: string;
  comfort: string;
  value: string;
  mostPraised: string[];
  mostCritiqued: string[];
  highlightQuote: string;
}

const CONSENSUS_META: Record<string, { score: number; confidence: number; highlightChannel: string }> = {
  "tesla-model-y": { score: 88, confidence: 94, highlightChannel: "Fully Charged Show" },
  "porsche-macan-ev": { score: 93, confidence: 88, highlightChannel: "Bjørn Nyland" },
  "kia-ev9": { score: 90, confidence: 91, highlightChannel: "AutoTrader UK" },
  "hyundai-ioniq5": { score: 87, confidence: 96, highlightChannel: "Fully Charged Show" },
  "bmw-i5": { score: 89, confidence: 85, highlightChannel: "Bjørn Nyland" },
  "audi-q6-etron": { score: 91, confidence: 89, highlightChannel: "InsideEVs" },
  "volvo-ex30": { score: 84, confidence: 92, highlightChannel: "AutoTrader UK" },
  "bmw-ix": { score: 88, confidence: 83, highlightChannel: "Fully Charged Show" },
};

const CHANNEL_META: Record<string, { score: number; country: string }> = {
  "Fully Charged Show": { score: 96, country: "🇬🇧 UK" },
  "Bjørn Nyland": { score: 98, country: "🇯🇵 Japan / Norway" },
  "AutoTrader UK": { score: 88, country: "🇬🇧 UK" },
  "InsideEVs": { score: 91, country: "🇺🇸 USA / EU" },
  "What Car?": { score: 85, country: "🇬🇧 UK" },
  "Carwow": { score: 82, country: "🇬🇧 UK" },
  "The Electric Viking": { score: 79, country: "🇦🇺 Australia" },
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
  const { t } = useTranslation();
  const [playing, setPlaying] = useState(false);
  // maxresdefault only exists for HD uploads; hqdefault.jpg is always generated.
  const [thumbIdx, setThumbIdx] = useState(0);
  const thumbs = [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
  ];

  return (
    <div className="glass rounded-2xl border border-border/40 overflow-hidden hover:border-border/70 transition-colors group">
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
              src={thumbs[thumbIdx]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={() => setThumbIdx((i) => Math.min(i + 1, thumbs.length - 1))}
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
              <span className="text-xs text-white/80">{views} {t("ev.reviews.views")}</span>
            </div>
          </>
        )}
      </div>
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
            {t("ev.reviews.watch_youtube")} <ExternalLink className="w-3 h-3" />
          </a>
          {CHANNEL_META[channel] && (
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">{CHANNEL_META[channel].score}</span>
              <Globe className="w-3 h-3 ml-1" />
              <span>{CHANNEL_META[channel].country}</span>
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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const meta = CONSENSUS_META[slug];
  const c = t(`ev.reviews.consensus.${slug}`, { returnObjects: true }) as ConsensusData | string;
  const model = EV_MODELS.find((m) => m.slug === slug);
  const { image: carImage } = useCarImage(model ? { brand: model.brand, model: model.name } : null);
  if (!meta || !model || typeof c === "string") return null;

  const confidenceColor = meta.confidence >= 90 ? "text-emerald-400" : meta.confidence >= 80 ? "text-amber-400" : "text-red-400";

  const metrics = [
    { label: t("ev.reviews.metric_range"), value: c.range },
    { label: t("ev.reviews.metric_charging"), value: c.charging },
    { label: t("ev.reviews.metric_winter"), value: c.winter },
    { label: t("ev.reviews.metric_comfort"), value: c.comfort },
    { label: t("ev.reviews.metric_value"), value: c.value },
  ];

  return (
    <div className="glass rounded-2xl border border-border/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-card/50 transition-colors"
      >
        <div className="relative w-20 h-14 sm:w-28 sm:h-20 rounded-lg overflow-hidden bg-card border border-border/40 flex-shrink-0">
          {carImage ? (
            <img
              src={carImage.thumb}
              alt={`${model.brand} ${model.name}`}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-muted to-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold">{name}</div>
          <div className="flex items-center gap-3 mt-0.5">
            <div className="text-xs text-muted-foreground">{model.youtubeReviews.length} {t("ev.reviews.reviews_analysed")}</div>
            <div className={`flex items-center gap-1 text-[10px] ${confidenceColor}`}>
              <ShieldCheck className="w-3 h-3" />
              {t("ev.reviews.confidence_pct", { n: meta.confidence })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-gradient">{meta.score}</div>
            <div className="text-[10px] text-muted-foreground">/ 100</div>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-border/40 pt-4 space-y-4">
          <div className="bg-card/40 border border-border/30 rounded-xl p-4">
            <div className="text-[10px] uppercase tracking-wider text-accent mb-2">{t("ev.reviews.consensus_quote_label")}</div>
            <p className="text-sm text-muted-foreground italic leading-relaxed">"{c.highlightQuote}"</p>
            <div className="text-[10px] text-muted-foreground mt-2">— {meta.highlightChannel}</div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {metrics.map((item) => (
              <div key={item.label} className="bg-card/60 rounded-xl p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{item.label}</div>
                <div className="text-xs font-medium">{item.value}</div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 mb-2">
                <ThumbsUp className="w-3.5 h-3.5" /> {t("ev.reviews.most_praised")}
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
                <ThumbsDown className="w-3.5 h-3.5" /> {t("ev.reviews.most_issues")}
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
            {t("ev.compare.full_deep_dive")}
          </Link>
        </div>
      )}
    </div>
  );
}

export default function EVReviews() {
  const { t } = useTranslation();
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
        title={t("ev.reviews.seo_title")}
        description={t("ev.reviews.seo_desc")}
      />

      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-transparent to-cyan-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-violet-400 mb-5">
            <Play className="w-3.5 h-3.5" /> {t("ev.reviews.eyebrow")}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight break-words hyphens-auto mb-5 max-w-2xl">
            {t("ev.reviews.title")} <span className="text-gradient">{t("ev.reviews.title_b")}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            {t("ev.reviews.subtitle")}
          </p>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-2xl font-bold tracking-tight mb-2">{t("ev.reviews.consensus_heading")}</h2>
        <p className="text-muted-foreground text-sm mb-8">{t("ev.reviews.consensus_lead")}</p>
        <div className="space-y-3 max-w-3xl">
          {EV_MODELS.map((m) => (
            <ConsensusCard key={m.slug} slug={m.slug} name={m.name} />
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">{t("ev.reviews.videos_heading")}</h2>
            <p className="text-muted-foreground text-sm mt-1">{filtered.length} {t("ev.reviews.views")}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {models.map((m) => (
            <button
              key={m}
              onClick={() => setActiveModel(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeModel === m ? "bg-primary text-primary-foreground border-primary" : "glass border-border/40 text-muted-foreground hover:text-foreground"}`}
            >
              {m === "All" ? t("ev.reviews.all_models") : m}
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
