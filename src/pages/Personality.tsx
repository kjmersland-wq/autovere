import { Link, useParams } from "react-router-dom";
import { ArrowRight, Wind, Crown, Building2, Mountain, Flame, Snowflake } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { CarCard } from "@/components/CarCard";
import { Button } from "@/components/ui/button";
import { PERSONALITIES, getPersonality, getCar } from "@/data/cars";

const ICONS: Record<string, any> = {
  "calm-explorer": Wind,
  "quiet-executive": Crown,
  "weekend-escapist": Mountain,
  "urban-minimalist": Building2,
  "performance-romantic": Flame,
  "nordic-adventurer": Snowflake,
};

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <PageShell>
      <SEO title={t("pages.personality.not_found_seo_title")} description={t("pages.personality.not_found_seo_desc")} />
      <div className="container py-32 text-center">
        <h1 className="text-4xl font-bold mb-4">{t("pages.personality.not_found_h1")}</h1>
        <Button asChild className="bg-gradient-primary"><Link to="/personalities">{t("pages.personality.all")}</Link></Button>
      </div>
    </PageShell>
  );
};

const PersonalityDetail = () => {
  const { t } = useTranslation();
  const { slug = "" } = useParams();
  const p = getPersonality(slug);
  if (!p) return <NotFound />;
  const Icon = ICONS[p.slug] ?? Wind;
  const cars = p.matches.map(getCar).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <PageShell>
      <SEO
        title={`${p.name} · AUTOVERE`}
        description={`${p.tagline} ${p.description}`}
        type="article"
      />
      <section className="container pt-12 pb-20 max-w-4xl">
        <div className="text-xs uppercase tracking-[0.3em] text-accent mb-6">{t("pages.personality.eyebrow")}</div>
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
            <Icon className="w-9 h-9 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">{p.name}</h1>
            <p className="text-lg text-muted-foreground italic mt-2">"{p.tagline}"</p>
          </div>
        </div>
        <p className="text-xl text-muted-foreground leading-relaxed mb-10">{p.description}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="glass rounded-3xl p-8">
            <div className="text-xs uppercase tracking-wider text-accent mb-3">{t("pages.personality.who")}</div>
            <p className="leading-relaxed">{p.whoYouAre}</p>
          </div>
          <div className="glass rounded-3xl p-8">
            <div className="text-xs uppercase tracking-wider text-accent mb-3">{t("pages.personality.values")}</div>
            <ul className="space-y-2">
              {p.whatYouValue.map((v) => (
                <li key={v} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-accent" /> {v}</li>
              ))}
            </ul>
          </div>
        </div>

        <Button asChild size="lg" className="bg-gradient-primary rounded-xl gap-2">
          <Link to={`/#advisor`}>{t("pages.personality.show_matches")} <ArrowRight className="w-4 h-4" /></Link>
        </Button>
      </section>

      <section className="container pb-24">
        <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.personality.matches")}</div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">
          {t("pages.personality.matches_h", { name: p.name })}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((c) => <CarCard key={c.slug} car={c} />)}
        </div>
      </section>
    </PageShell>
  );
};

export default PersonalityDetail;

export const PersonalitiesIndex = () => {
  const { t } = useTranslation();
  const GRADIENT_PAIRS = [
    "from-violet-500/20 to-purple-600/10",
    "from-cyan-500/20 to-blue-600/10",
    "from-amber-500/20 to-orange-600/10",
    "from-emerald-500/20 to-teal-600/10",
    "from-rose-500/20 to-pink-600/10",
    "from-sky-500/20 to-indigo-600/10",
  ];
  return (
    <PageShell>
      <SEO title={t("pages.personality.index_seo_title")} description={t("pages.personality.index_seo_desc")} />
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-indigo-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="max-w-2xl mb-4">
            <div className="text-sm text-accent font-medium mb-3 tracking-wide uppercase">{t("pages.personality.index_eyebrow")}</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-6">
              {t("pages.personality.index_h1_a")} <br />{t("pages.personality.index_h1_b")} <span className="text-gradient">{t("pages.personality.index_h1_c")}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.personality.index_lead")}</p>
          </div>
        </div>
      </section>
      <section className="container py-16 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PERSONALITIES.map((p, i) => {
            const Icon = ICONS[p.slug] ?? Wind;
            const grad = GRADIENT_PAIRS[i % GRADIENT_PAIRS.length];
            return (
              <Link
                key={p.slug}
                to={`/personalities/${p.slug}`}
                className={`group glass rounded-3xl p-8 bg-gradient-to-br ${grad} hover:-translate-y-1 hover:shadow-glow transition-all duration-300 block border border-border/40 hover:border-border/70`}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight mb-2">{p.name}</h2>
                <p className="text-sm italic text-muted-foreground mb-3">"{p.tagline}"</p>
                <p className="text-sm leading-relaxed text-muted-foreground mb-4 line-clamp-2">{p.description}</p>
                <div className="text-xs text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  {t("pages.personality.read_profile")} <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
};
