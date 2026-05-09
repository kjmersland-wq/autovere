import { useParams } from "react-router-dom";
import { ArrowRight, ShieldCheck, Heart, Snowflake, Car as CarIcon, Users, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { CARS, getCar } from "@/data/cars";
import { useSafetyIntelligence } from "@/hooks/use-safety-intelligence";
import { CompareIntelligenceSection } from "@/components/CompareIntelligenceSection";
import { CompareNextStepsSection } from "@/components/CompareNextStepsSection";
import { RequirePremium } from "@/components/RequirePremium";
import { usePremium } from "@/hooks/usePremium";
import type { Car } from "@/data/cars";
import { resolveLang } from "@/i18n/localized-content";
import { LLink } from "@/i18n/routing";

const Row = ({ label, a, b, icon: Icon }: { label: string; a: string; b: string; icon?: typeof ShieldCheck }) => (
  <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_1fr] gap-4 md:gap-8 py-6 border-b border-border/30">
    <div className="text-xs uppercase tracking-wider text-muted-foreground self-start pt-1 flex items-center gap-2">
      {Icon && <Icon className="w-3.5 h-3.5 text-accent" />}
      {label}
    </div>
    <div className="text-sm leading-relaxed">{a}</div>
    <div className="text-sm leading-relaxed">{b}</div>
  </div>
);

const FeelCard = ({ car }: { car: Car }) => {
  const { t, i18n } = useTranslation();
  const { isPremium } = usePremium();
  const { data, loading } = useSafetyIntelligence(car.name, car.type, car.lifestyle, isPremium);
  return (
    <div className="glass rounded-3xl p-7 space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-[0.25em] text-accent mb-2 flex items-center gap-2">
          <Sparkles className="w-3 h-3" /> {t("pages.compare.real_world_feel")} · {car.name}
        </div>
        {loading || !data ? (
          <div className="space-y-2">
            <div className="h-4 w-4/5 bg-secondary/40 rounded animate-pulse" />
            <div className="h-4 w-3/5 bg-secondary/40 rounded animate-pulse" />
          </div>
        ) : (
          <p className="text-base leading-relaxed">{data.safetyHeadline}</p>
        )}
      </div>
      {data && (
        <>
          <div className="text-sm text-muted-foreground leading-relaxed italic">"{data.safetySummary}"</div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {data.safetyDimensions.slice(0, 4).map((d) => (
              <div key={d.label}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{d.label}</div>
                <div className="text-sm font-medium">{d.rating}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <PageShell>
      <SEO title={t("pages.compare.not_found_seo_title")} description={t("pages.compare.not_found_seo_desc")} />
      <div className="container py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">{t("pages.compare.not_found_h1")}</h1>
        <Button asChild className="bg-gradient-primary"><LLink to="/compare">{t("pages.compare.browse")}</LLink></Button>
      </div>
    </PageShell>
  );
};

const Compare = () => {
  const { t, i18n } = useTranslation();
  const lang = resolveLang(i18n.language);
  const { slug = "" } = useParams();
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return <NotFound />;
  const [aSlug, bSlug] = parts;
  const a = getCar(aSlug, lang);
  const b = getCar(bSlug, lang);
  if (!a || !b) return <NotFound />;

  const title = `${a.name} vs ${b.name} — AUTOVERE`;
  const desc = `${a.name} vs ${b.name}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    inLanguage: lang,
    headline: `${a.name} vs ${b.name}`,
    description: desc,
    about: [a.name, b.name],
  };

  return (
    <PageShell>
      <SEO title={title} description={desc} type="article" jsonLd={jsonLd} />

      <section className="relative">
        <div className="grid md:grid-cols-2">
          {[a, b].map((c, i) => (
            <LLink key={c.slug} to={`/cars/${c.slug}`} className="relative aspect-[16/10] md:aspect-[4/3] overflow-hidden group">
              <img src={c.hero} alt={c.name} className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-[2500ms]" />
              <div className={`absolute inset-0 bg-gradient-to-${i === 0 ? "r" : "l"} from-background via-background/30 to-transparent`} />
              <div className={`absolute inset-0 flex items-end p-10 ${i === 1 ? "justify-end text-right" : ""}`}>
                <div>
                  <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">{c.brand}</div>
                  <div className="text-3xl md:text-5xl font-bold tracking-tighter">{c.name}</div>
                  <div className="text-muted-foreground mt-2">{c.fit}</div>
                </div>
              </div>
            </LLink>
          ))}
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex">
          <div className="glass w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold text-gradient">vs</div>
        </div>
      </section>

      <section className="container py-20 max-w-3xl">
        <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.compare.eyebrow")}</div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
          {a.name} vs {b.name}: <span className="text-gradient">{t("pages.compare.title_b")}</span>
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {t("pages.compare.lead", { a: a.name, b: b.name })}
        </p>
      </section>

      <CompareIntelligenceSection aSlug={a.slug} bSlug={b.slug} aName={a.name} bName={b.name} />

      <section className="container pb-20">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent mb-4">{t("pages.compare.detailed")}</div>
        <Row label={t("pages.compare.driving_feel")} icon={CarIcon} a={a.summary} b={b.summary} />
        <Row label={t("pages.compare.comfort")} icon={Heart} a={a.comfort} b={b.comfort} />
        <Row label={t("pages.compare.safety")} icon={ShieldCheck} a={`${t("pages.compare.strong_confidence")} ${a.climate.toLowerCase()}`} b={`${t("pages.compare.strong_confidence")} ${b.climate.toLowerCase()}`} />
        <Row label={t("pages.compare.winter")} icon={Snowflake} a={a.climate} b={b.climate} />
        <Row label={t("pages.compare.family")} icon={Users} a={a.practicality} b={b.practicality} />
        <Row label={t("pages.compare.ownership_stress")} a={a.ownership} b={b.ownership} />
        <Row label={t("pages.compare.personality_fit")} a={a.personality} b={b.personality} />
        <Row label={t("pages.compare.lifestyle")} a={a.lifestyle} b={b.lifestyle} />
      </section>

      <RequirePremium fallbackHeightClassName="min-h-[280px]">
        <section className="container pb-20">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.compare.ai_consensus")}</div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">{t("pages.compare.ai_consensus_h")}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <FeelCard car={a} />
            <FeelCard car={b} />
          </div>
        </section>
      </RequirePremium>

      <CompareNextStepsSection a={a} b={b} />

      <section className="container pb-24 grid md:grid-cols-2 gap-6">
        {[a, b].map((c) => (
          <div key={c.slug} className="glass rounded-3xl p-8">
            <div className="text-xs uppercase tracking-wider text-accent mb-2">{t("pages.compare.choose_if", { name: c.name })}</div>
            <p className="text-lg leading-relaxed mb-4">{c.lifestyle}</p>
            <Button asChild variant="outline" className="rounded-xl">
               <LLink to={`/cars/${c.slug}`}>{t("pages.compare.read_full_review", { name: c.name })} <ArrowRight className="w-4 h-4 ml-2" /></LLink>
            </Button>
          </div>
        ))}
      </section>

      <section className="container pb-24">
        <div className="relative glass rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-glow opacity-40" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4">{t("pages.compare.still_fence")}</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">{t("pages.compare.still_fence_lead")}</p>
            <Button asChild size="lg" className="bg-gradient-primary rounded-xl gap-2">
               <LLink to="/#advisor">{t("common.ask_autovere")} <ArrowRight className="w-4 h-4" /></LLink>
            </Button>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Compare;

export const CompareIndex = () => {
  const { t, i18n } = useTranslation();
  const lang = resolveLang(i18n.language);
  const pairs: Array<[typeof CARS[number], typeof CARS[number]]> = [];
  CARS.forEach((c) => c.comparesWellWith.forEach((s) => {
    const source = getCar(c.slug, lang);
    const o = getCar(s, lang);
    if (!source) return;
    if (o && !pairs.some(([x, y]) => (x.slug === o.slug && y.slug === source.slug))) pairs.push([source, o]);
  }));

  return (
    <PageShell>
      <SEO title={t("pages.compare.index_seo_title")} description={t("pages.compare.index_seo_desc")} />
      <section className="container pt-12 pb-20">
        <div className="max-w-2xl mb-14">
          <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.compare.index_eyebrow")}</div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
            {t("pages.compare.index_h1_a")} <span className="text-gradient">{t("pages.compare.index_h1_b")}</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.compare.index_lead")}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {pairs.map(([x, y]) => (
            <LLink
              key={`${x.slug}-${y.slug}`}
              to={`/compare/${x.slug}-vs-${y.slug}`}
              className="group glass rounded-3xl overflow-hidden hover:-translate-y-1 hover:shadow-glow transition-all duration-500"
            >
              <div className="grid grid-cols-2 aspect-[16/7]">
                <img src={x.hero} alt={x.name} className="w-full h-full object-cover" loading="lazy" />
                <img src={y.hero} alt={y.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-6 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{t("pages.compare.comparison_label")}</div>
                  <div className="text-xl font-semibold">{x.name} vs {y.name}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-1 transition-transform" />
              </div>
            </LLink>
          ))}
        </div>
      </section>
    </PageShell>
  );
};
