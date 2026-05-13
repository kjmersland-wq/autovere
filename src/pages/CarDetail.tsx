import { Link, useParams } from "react-router-dom";
import { ArrowRight, Check, X, Sparkles, MapPin, Heart, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { CARS, getCar } from "@/data/cars";
import { getMedia } from "@/data/media";
import { CarMediaSection } from "@/components/CarMediaSection";
import { PricingOwnership } from "@/components/PricingOwnership";
import { SafetyOwnershipBlock } from "@/components/SafetyOwnershipBlock";
import { ContinueExploringSection } from "@/components/ContinueExploringSection";
import { useLoc } from "@/lib/loc";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <PageShell>
      <SEO title={t("pages.car.not_found_seo_title")} description={t("pages.car.not_found_seo_desc")} />
      <div className="container py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">{t("pages.car.not_found_h1")}</h1>
        <p className="text-muted-foreground mb-8">{t("pages.car.not_found_lead")}</p>
        <Button asChild className="bg-gradient-primary"><Link to="/cars">{t("pages.car.all_cars")}</Link></Button>
      </div>
    </PageShell>
  );
};

const CarDetail = () => {
  const { t } = useTranslation();
  const { l, la } = useLoc();
  const { slug = "" } = useParams();
  const car = getCar(slug);
  if (!car) return <NotFound />;

  const related = car.comparesWellWith
    .map((s) => getCar(s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const summary = l(car.summary);
  const fit = l(car.fit);

  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.autovere.com";
  const carUrl = `${origin}/cars/${car.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Car",
      name: car.name,
      brand: { "@type": "Brand", name: car.brand },
      vehicleConfiguration: l(car.type),
      numberOfDoors: 5,
      seatingCapacity: car.seats,
      fuelType: "Electric",
      description: summary,
      image: car.hero,
      url: carUrl,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: origin },
        { "@type": "ListItem", position: 2, name: "Cars", item: `${origin}/cars` },
        { "@type": "ListItem", position: 3, name: car.name, item: carUrl },
      ],
    },
  ];

  return (
    <PageShell>
      <SEO
        title={`${car.name} — ${fit} · AUTOVERE`}
        description={summary.slice(0, 155)}
        image={car.hero}
        type="article"
        jsonLd={jsonLd}
      />

      <section className="relative h-[80vh] min-h-[560px] overflow-hidden">
        <img src={car.hero} alt={car.name} className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        <div className="container relative z-10 h-full flex flex-col justify-end pb-16">
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{car.brand} · {l(car.type)}</div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter max-w-4xl leading-[1.05]">{car.name}</h1>
          <p className="text-xl md:text-2xl text-muted-foreground italic mt-4 max-w-2xl">"{l(car.tagline)}"</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <div className="glass rounded-2xl px-4 py-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("pages.car.match")}</div>
              <div className="text-2xl font-bold text-gradient leading-none">{car.score}</div>
            </div>
            {car.range && (
              <div className="glass rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("pages.car.range")}</div>
                <div className="text-base font-semibold">{l(car.range)}</div>
              </div>
            )}
            {car.startingPrice && (
              <div className="glass rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("pages.car.price")}</div>
                <div className="text-base font-semibold">{l(car.startingPrice)}</div>
              </div>
            )}
            {car.drivetrain && (
              <div className="glass rounded-2xl px-4 py-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("pages.car.drivetrain")}</div>
                <div className="text-base font-semibold">{l(car.drivetrain)}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container py-24 grid lg:grid-cols-[1.4fr_1fr] gap-16">
        <div>
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.car.summary_eyebrow")}</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6 leading-tight">{fit}.</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">{summary}</p>
          <p className="text-base text-muted-foreground leading-relaxed">{l(car.lifestyle)}</p>
        </div>
        <aside className="glass rounded-3xl p-8 h-fit">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-4">{t("pages.car.personality_fit")}</div>
          <div className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Heart className="w-5 h-5 text-accent" /> {l(car.personality)}
          </div>
          <div className="space-y-5 text-sm">
            <div>
              <div className="text-muted-foreground flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-accent" /> {t("pages.car.comfort")}</div>
              <div>{l(car.comfort)}</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-2 mb-1"><MapPin className="w-4 h-4 text-accent" /> {t("pages.car.climate")}</div>
              <div>{l(car.climate)}</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-2 mb-1"><Zap className="w-4 h-4 text-accent" /> {t("pages.car.practicality")}</div>
              <div>{l(car.practicality)}</div>
            </div>
            <div>
              <div className="text-muted-foreground flex items-center gap-2 mb-1"><Sparkles className="w-4 h-4 text-accent" /> {t("pages.car.ownership")}</div>
              <div>{l(car.ownership)}</div>
            </div>
          </div>
        </aside>
      </section>

      <section className="container pb-24">
        <div className="grid md:grid-cols-3 gap-4">
          {car.gallery.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/40 group">
              <img src={src} alt={`${car.name} gallery ${i + 1}`} loading="lazy" className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform [transition-duration:2500ms]" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-24 grid md:grid-cols-2 gap-6">
        <div className="glass rounded-3xl p-8">
          <div className="text-xs uppercase tracking-wider text-accent mb-3">{t("pages.car.strengths")}</div>
          <ul className="space-y-3">
            {la(car.strengths).map((s) => (
              <li key={s} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" /> <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-3xl p-8">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{t("pages.car.tradeoffs")}</div>
          <ul className="space-y-3">
            {la(car.tradeoffs).map((s) => (
              <li key={s} className="flex items-start gap-3">
                <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" /> <span className="text-muted-foreground">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <PricingOwnership car={car} />
      <SafetyOwnershipBlock car={car} />

      {(() => {
        const media = getMedia(car.slug);
        return media ? <CarMediaSection media={media} carName={car.name} carSlug={car.slug} /> : null;
      })()}

      <ContinueExploringSection car={car} />

      {related.length > 0 && (
        <section className="container pb-24">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.car.compare_eyebrow")}</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
            {t("pages.car.compare_h", { name: car.name })}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={`/compare/${car.slug}-vs-${r.slug}`}
                className="group glass rounded-3xl p-8 hover:-translate-y-1 hover:shadow-glow transition-all duration-500 flex items-center justify-between gap-6"
              >
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{t("pages.car.compare_label")}</div>
                  <div className="text-xl font-semibold mb-1">{car.name} vs {r.name}</div>
                  <div className="text-sm text-muted-foreground">{l(r.fit)} · {l(r.type)}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container pb-24">
        <div className="relative glass rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-40" />
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
              {t("pages.car.cta_title_a", { name: car.name })} <span className="text-gradient">{t("pages.car.cta_title_b")}</span>
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t("pages.car.cta_lead")}</p>
            <Button asChild size="lg" className="bg-gradient-primary rounded-xl gap-2">
              <Link to="/#advisor">{t("common.talk_to_autovere")} <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default CarDetail;

export const CarsIndex = () => {
  const { t } = useTranslation();
  return (
    <PageShell>
      <SEO title={t("pages.car.index_seo_title")} description={t("pages.car.index_seo_desc")} />
      <section className="container pt-12 pb-20">
        <div className="max-w-2xl mb-14">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.car.index_eyebrow")}</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            {t("pages.car.index_h1_a")} <span className="text-gradient">{t("pages.car.index_h1_b")}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.car.index_lead")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CARS.map((c) => <CarCard key={c.slug} car={c} />)}
        </div>
      </section>
    </PageShell>
  );
};
