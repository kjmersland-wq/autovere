import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Sparkles, Snowflake, Heart, Shield, Mountain, Moon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { COLLECTIONS } from "@/data/cars";
import { EditorialPulseSection } from "@/components/EditorialPulseSection";
import { ApprovedAdditionsSection } from "@/components/ApprovedAdditionsSection";

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
          {cards.map(({ c, icon: Icon, hue }) => (
            <Link key={c.slug} to={`/collections/${c.slug}`} className="group relative overflow-hidden rounded-3xl border border-border/40 hover:border-primary/40 transition-all duration-700 hover:-translate-y-1 hover:shadow-glow aspect-[4/5]">
              <img src={c.image} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[2500ms]" />
              <div className={`absolute inset-0 bg-gradient-to-tr ${hue}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
              <div className="relative h-full flex flex-col justify-between p-7">
                <div className="w-11 h-11 rounded-2xl glass flex items-center justify-center">
                  <Icon className="w-5 h-5 text-accent" />
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
          ))}
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
