import { ExternalLink, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { LiveVideoCard } from "@/components/LiveVideoCard";
import { LiveVideoRow } from "@/components/LiveVideoRow";
import { useYouTubeSearch } from "@/hooks/use-youtube-search";
import { TRUSTED_REVIEWERS } from "@/data/media";

const HERO_QUERY = "best new electric car review 2025";

const ROW_DEFS = [
  { key: "trending", query: "best electric car review 2025", order: "date" as const },
  { key: "winter", query: "electric car winter cold weather range test" },
  { key: "long", query: "EV long distance road trip review" },
  { key: "luxury", query: "luxury electric car quiet cabin review" },
  { key: "family", query: "family SUV electric car review" },
];

const Watch = () => {
  const { t } = useTranslation();
  const { videos: heroVideos, loading: heroLoading } = useYouTubeSearch(HERO_QUERY, { max: 1, order: "relevance" });
  const hero = heroVideos[0];

  return (
    <PageShell>
      <SEO title={t("pages.watch.seo_title")} description={t("pages.watch.seo_desc")} type="website" />

      <section className="container pt-12 pb-16">
        <div className="max-w-3xl mb-12">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.watch.eyebrow")}</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 leading-[1.05]">
            {t("pages.watch.h1_a")} <span className="text-gradient">{t("pages.watch.h1_b")}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.watch.lead")}</p>
        </div>

        {heroLoading && (
          <div className="aspect-[16/9] rounded-2xl bg-secondary/40 animate-pulse border border-border/40" />
        )}
        {hero && <LiveVideoCard video={hero} size="lg" badge={t("pages.watch.featured")} />}
      </section>

      {ROW_DEFS.map((row) => (
        <LiveVideoRow
          key={row.key}
          query={row.query}
          title={t(`pages.watch.rows.${row.key}_t`)}
          subtitle={t(`pages.watch.rows.${row.key}_s`)}
          order={row.order}
          max={6}
        />
      ))}

      <section className="container py-20">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-accent mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> {t("pages.watch.trusted")}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">{t("pages.watch.trusted_h")}</h2>
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
