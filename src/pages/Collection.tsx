import { Link, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { COLLECTIONS, getCollection, getCar } from "@/data/cars";

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

  return (
    <PageShell>
      <SEO
        title={`${c.title} · AUTOVERE`}
        description={`${c.description} ${c.body.slice(0, 100)}`}
        image={c.image}
        type="article"
      />
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <img src={c.image} alt={c.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
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
          {COLLECTIONS.map((c) => (
            <Link
              key={c.slug}
              to={`/collections/${c.slug}`}
              className="group relative overflow-hidden rounded-3xl aspect-[16/10] border border-border/40 hover:border-primary/50 transition-all duration-700 hover:-translate-y-1 hover:shadow-glow"
            >
              <img src={c.image} alt={c.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-[2500ms]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/60 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-8">
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">{c.title}</h2>
                <p className="text-sm text-muted-foreground max-w-md mb-3">{c.description}</p>
                <div className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t("common.open_collection")} <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
};
