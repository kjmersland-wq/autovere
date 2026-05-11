import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, getCollection, getCar } from "@/data/cars";

const COLLECTION_VISUALS: Record<string, { position: string; tone: string }> = {
  "winter-confidence": { position: "center 65%", tone: "from-sky-500/15 to-blue-600/8" },
  "nordic-winters": { position: "center 58%", tone: "from-cyan-500/15 to-indigo-600/8" },
  "quiet-luxury": { position: "center 48%", tone: "from-amber-500/14 to-rose-500/6" },
  "long-distance-comfort": { position: "center 54%", tone: "from-violet-500/14 to-indigo-600/7" },
  "calm-highway-cruisers": { position: "center 52%", tone: "from-slate-500/14 to-sky-600/7" },
  "lowest-ownership-stress": { position: "center 46%", tone: "from-emerald-500/14 to-teal-600/7" },
  "reviewers-unexpectedly-loved": { position: "center 50%", tone: "from-fuchsia-500/14 to-purple-600/7" },
  "best-family-evs": { position: "center 52%", tone: "from-orange-500/14 to-amber-600/7" },
  underestimated: { position: "center 40%", tone: "from-teal-500/14 to-cyan-600/7" },
  "city-life": { position: "center 60%", tone: "from-slate-500/16 to-zinc-600/8" },
};

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <PageShell>
      <SEO title={t("pages.collection.not_found_seo_title")} description={t("pages.collection.not_found_seo_desc")} />
      <div className="container py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">{t("pages.collection.not_found_h1")}</h1>
        <Button asChild className="bg-gradient-primary"><Link to="/collections">{t("pages.collection.all")}</Link></Button>
      </div>
    </PageShell>
  );
};

const CollectionDetail = () => {
  const { t } = useTranslation();
  const { slug = "" } = useParams();
  const c = getCollection(slug);
  if (!c) return <NotFound />;
  const cars = c.cars.map(getCar).filter((x): x is NonNullable<typeof x> => Boolean(x));
  const visual = COLLECTION_VISUALS[c.slug] ?? { position: "center", tone: "from-slate-500/15 to-zinc-600/8" };

  return (
    <PageShell>
      <SEO
        title={`${c.title} · AUTOVERE`}
        description={`${c.description} ${c.body.slice(0, 100)}`}
        image={c.image}
        type="article"
      />
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover scale-[1.03] contrast-[1.08]" style={{ objectPosition: visual.position }} />
        <div className={`absolute inset-0 bg-gradient-to-tr ${visual.tone}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/92 via-background/48 to-background/14" />
        <div className="container relative z-10 h-full flex flex-col justify-end pb-16 max-w-3xl">
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{t("pages.collection.a_collection")}</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.05]">{c.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6">{c.description}</p>
        </div>
      </section>
      <section className="container py-20 max-w-3xl">
        <p className="text-lg text-muted-foreground leading-relaxed">{c.body}</p>
      </section>
      <section className="container pb-24">
        <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.collection.picks")}</div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">{t("pages.collection.cars_in")}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => <CarCard key={car.slug} car={car} />)}
        </div>
      </section>
    </PageShell>
  );
};

export default CollectionDetail;

export const CollectionsIndex = () => {
  const { t } = useTranslation();
  return (
    <PageShell>
      <SEO title={t("pages.collection.index_seo_title")} description={t("pages.collection.index_seo_desc")} />
      <section className="container pt-12 pb-20">
        <div className="max-w-2xl mb-14">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.collection.index_eyebrow")}</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            {t("pages.collection.index_h1_a")} <span className="text-gradient">{t("pages.collection.index_h1_b")}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.collection.index_lead")}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {COLLECTIONS.map((c) => {
            const visual = COLLECTION_VISUALS[c.slug] ?? { position: "center", tone: "from-slate-500/15 to-zinc-600/8" };
            return (
              <Link
                key={c.slug}
                to={`/collections/${c.slug}`}
                className="group relative overflow-hidden rounded-3xl aspect-[16/10] border border-border/40 hover:border-primary/50 transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(0,0,0,0.45)]"
              >
                <img src={c.image} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover scale-[1.06] group-hover:scale-[1.14] group-hover:contrast-[1.12] transition-transform duration-[1600ms]" style={{ objectPosition: visual.position }} />
                <div className={`absolute inset-0 bg-gradient-to-tr ${visual.tone}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-background/88 via-background/36 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-8">
                  <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">{c.title}</h2>
                  <p className="text-sm text-muted-foreground max-w-md mb-3">{c.description}</p>
                  <div className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t("common.open_collection")} <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
};
