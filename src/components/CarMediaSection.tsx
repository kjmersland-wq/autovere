import { ExternalLink, Globe, Settings2, FileText, KeyRound, MapPin, ShieldCheck, Sparkles, ThumbsUp, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CarMedia } from "@/data/media";
import { LiveVideoCard } from "@/components/LiveVideoCard";
import { useYouTubeSearch } from "@/hooks/use-youtube-search";
import { useVideoInsights } from "@/hooks/use-video-insights";
import { getUiCopy, interpolate } from "@/i18n/localized-content";
import { usePremium } from "@/hooks/usePremium";
import { LLink } from "@/i18n/routing";

const KIND_ICON = {
  site: Globe,
  configure: Settings2,
  specs: FileText,
  "test-drive": KeyRound,
  dealers: MapPin,
} as const;

export const CarMediaSection = ({ media, carName, carSlug }: { media: CarMedia; carName: string; carSlug?: string }) => {
  const { i18n, t } = useTranslation();
  const { isPremium } = usePremium();
  const ui = getUiCopy(i18n.language).carMedia;
  const { videos, loading } = useYouTubeSearch(`${carName} review`, { max: 7, order: "relevance" });
  const featured = videos[0];
  const rest = videos.slice(1);
  const { insights, loading: insightsLoading } = useVideoInsights(carName, videos, carSlug, isPremium);

  return (
    <section className="container py-24 space-y-20">
      {/* Featured review + AI consensus */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-10 items-start">
        <div>
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{ui.featuredEyebrow}</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">
            {ui.featuredTitle}
          </h2>
          {loading && (
            <div className="aspect-[16/9] rounded-2xl bg-secondary/40 animate-pulse border border-border/40" />
          )}
          {featured && <LiveVideoCard video={featured} size="lg" badge={ui.featuredBadge} />}
        </div>
          <aside className="glass rounded-3xl p-8 lg:sticky lg:top-28 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-4">
                <Sparkles className="w-3.5 h-3.5" /> {ui.consensusEyebrow}
              </div>
              {!isPremium ? (
                <div className="rounded-2xl border border-border/40 bg-secondary/20 p-5">
                  <p className="text-sm text-muted-foreground mb-4">{t("premium.lock.body")}</p>
                  <LLink to="/pricing" className="text-sm text-accent underline">
                    {t("premium.lock.cta")}
                  </LLink>
                </div>
              ) : null}
              {insightsLoading && !insights && (
                <div className="space-y-3">
                  <div className="h-4 w-3/4 rounded bg-secondary/40 animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-secondary/40 animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-secondary/40 animate-pulse" />
                </div>
              )}
              {isPremium && insights?.headline && (
                <h3 className="text-xl font-semibold tracking-tight mb-4 leading-snug">
                  {insights.headline}
                </h3>
              )}
              {isPremium && insights?.feel && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                  "{insights.feel}"
                </p>
              )}
            </div>

          {isPremium && insights?.strengths && insights.strengths.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-accent mb-3">
                <ThumbsUp className="w-3 h-3" /> {ui.strengthsLabel}
              </div>
              <ul className="space-y-3">
                {insights.strengths.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isPremium && insights?.criticisms && insights.criticisms.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground mb-3">
                <AlertCircle className="w-3 h-3" /> {ui.reservationsLabel}
              </div>
              <ul className="space-y-3">
                {insights.criticisms.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 mt-2 shrink-0" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!insightsLoading && !insights && media.consensus.length > 0 && (
            <ul className="space-y-3">
              {media.consensus.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="text-[11px] text-muted-foreground leading-relaxed pt-2 border-t border-border/40">
            {ui.aiDisclaimer}
          </div>
        </aside>
      </div>

      {/* Other videos — live */}
      {rest.length > 0 && (
        <div>
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{ui.moreReviewsEyebrow}</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
            {ui.moreReviewsTitle}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((v) => <LiveVideoCard key={v.id} video={v} />)}
          </div>
        </div>
      )}

      {/* Explore further: official + trusted */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-4">
            <Globe className="w-3.5 h-3.5" /> {ui.officialEyebrow}
          </div>
          <h3 className="text-2xl font-semibold tracking-tight mb-6">{interpolate(ui.officialTitle, { name: carName })}</h3>
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
            <ShieldCheck className="w-3.5 h-3.5" /> {ui.trustedEyebrow}
          </div>
          <h3 className="text-2xl font-semibold tracking-tight mb-6">{ui.trustedTitle}</h3>
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
            {ui.trustedDisclaimer}
          </div>
        </div>
      </div>
    </section>
  );
};
