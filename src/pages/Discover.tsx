import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles, Snowflake, Heart, Shield, Mountain, Moon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { COLLECTIONS } from "@/data/cars";
import { EditorialPulseSection } from "@/components/EditorialPulseSection";
import { ApprovedAdditionsSection } from "@/components/ApprovedAdditionsSection";

const DISCOVER_VISUALS: Record<string, { oem: string; position: string; tone: string }> = {
  "winter-confidence": { oem: "Volvo EX90", position: "center 65%", tone: "from-sky-500/18 to-blue-600/8" },
  "nordic-winters": { oem: "Polestar 3", position: "center 58%", tone: "from-cyan-500/18 to-indigo-600/8" },
  "quiet-luxury": { oem: "Mercedes EQ", position: "center 48%", tone: "from-amber-500/16 to-rose-500/6" },
  "long-distance-comfort": { oem: "Audi e-tron GT", position: "center 54%", tone: "from-violet-500/16 to-indigo-600/8" },
  "calm-highway-cruisers": { oem: "BMW i5", position: "center 52%", tone: "from-slate-500/16 to-sky-600/8" },
  "lowest-ownership-stress": { oem: "Tesla Model Y", position: "center 46%", tone: "from-emerald-500/16 to-teal-600/7" },
  "reviewers-unexpectedly-loved": { oem: "Hyundai IONIQ 6", position: "center 50%", tone: "from-fuchsia-500/15 to-purple-600/8" },
  "best-family-evs": { oem: "Kia EV9", position: "center 52%", tone: "from-orange-500/16 to-amber-600/8" },
  underestimated: { oem: "Lucid Air", position: "center 40%", tone: "from-teal-500/16 to-cyan-600/8" },
  "city-life": { oem: "Porsche Taycan", position: "center 60%", tone: "from-slate-500/18 to-zinc-600/8" },
};

const THEMES = [
  { slug: "winter-confidence", icon: Snowflake, hue: "from-sky-500/20 to-blue-500/5" },
  { slug: "nordic-winters", icon: Mountain, hue: "from-indigo-500/20 to-cyan-500/5" },
  { slug: "quiet-luxury", icon: Sparkles, hue: "from-amber-500/15 to-rose-500/5" },
  { slug: "long-distance-comfort", icon: Heart, hue: "from-rose-500/15 to-orange-500/5" },
  { slug: "calm-highway-cruisers", icon: Moon, hue: "from-violet-500/20 to-indigo-500/5" },
  { slug: "lowest-ownership-stress", icon: Shield, hue: "from-emerald-500/20 to-teal-500/5" },
  { slug: "reviewers-unexpectedly-loved", icon: Sparkles, hue: "from-fuchsia-500/15 to-purple-500/5" },
  { slug: "best-family-evs", icon: Heart, hue: "from-orange-500/15 to-amber-500/5" },
  { slug: "underestimated", icon: Sparkles, hue: "from-teal-500/15 to-cyan-500/5" },
  { slug: "city-life", icon: Sparkles, hue: "from-slate-500/20 to-zinc-500/5" },
];

const Discover = () => {
  const { t } = useTranslation();
  const cards = THEMES
    .map((th) => ({ ...th, c: COLLECTIONS.find((c) => c.slug === th.slug) }))
    .filter((x): x is typeof x & { c: NonNullable<typeof x.c> } => Boolean(x.c));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("pages.discover.seo_title"),
    description: t("pages.discover.seo_desc"),
    hasPart: cards.map((x) => ({ "@type": "CreativeWork", name: x.c.title, url: `https://autovere.com/collections/${x.c.slug}` })),
  };

  return (
    <PageShell>
      <SEO title={t("pages.discover.seo_title")} description={t("pages.discover.seo_desc")} jsonLd={jsonLd} />

      <section className="container pt-16 pb-12 max-w-3xl">
        <div className="text-xs uppercase tracking-[0.3em] text-accent mb-5">{t("pages.discover.eyebrow")}</div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.02] mb-6">
          {t("pages.discover.h1_a")} <span className="text-gradient">{t("pages.discover.h1_b")}</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.discover.lead")}</p>
      </section>

      <section className="container pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map(({ c, icon: Icon, hue }) => {
            const visual = DISCOVER_VISUALS[c.slug] ?? {
              oem: "European EV",
              position: "center",
              tone: hue,
            };

            return (
              <Link key={c.slug} to={`/collections/${c.slug}`} className="group relative overflow-hidden rounded-3xl border border-border/40 hover:border-primary/40 transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)] aspect-[4/5]">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.06] group-hover:scale-[1.18] group-hover:brightness-[0.96] group-hover:contrast-[1.14] transition-transform duration-[1600ms]"
                  style={{ objectPosition: visual.position }}
                />
                <div className={`absolute inset-0 bg-gradient-to-tr ${visual.tone}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10 opacity-80" />
                <div className="relative h-full flex flex-col justify-between p-7">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center shadow-soft">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <span className="rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[10px] uppercase tracking-[0.15em] text-white/85 backdrop-blur-sm">
                      {visual.oem}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight mb-2 leading-snug">{c.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{c.description}</p>
                    <div className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t("common.open_collection")} <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 glass rounded-3xl p-8 md:p-12 max-w-3xl mx-auto text-center">
          <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-3">{t("pages.discover.transparency_eyebrow")}</div>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{t("pages.discover.transparency")}</p>
        </div>
      </section>

      <ApprovedAdditionsSection />
      <EditorialPulseSection />
    </PageShell>
  );
};

export default Discover;
