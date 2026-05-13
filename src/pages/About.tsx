import { Link, useLocation } from "react-router-dom";
import {
  Brain, Zap, Globe, Shield, TrendingUp, Users, Warehouse, ArrowRight, Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const PILLAR_VISUALS = [
  { icon: Brain, color: "text-accent", bg: "bg-accent/10" },
  { icon: Globe, color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10" },
  { icon: Shield, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { icon: TrendingUp, color: "text-violet-400", bg: "bg-violet-400/10" },
  { icon: Users, color: "text-rose-400", bg: "bg-rose-400/10" },
];

const WHAT_ICONS = [Brain, Warehouse, Zap, Globe];

export default function About() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const { t } = useTranslation();

  const pillars = (t("pages.about.pillars", { returnObjects: true }) as Array<{ title: string; body: string }>) || [];
  const stats = (t("pages.about.stats", { returnObjects: true }) as Array<{ value: string; label: string }>) || [];
  const whatItems = (t("pages.about.what_items", { returnObjects: true }) as Array<{ label: string; desc: string }>) || [];

  return (
    <PageShell>
      <SEO
        title={t("pages.about.seo_title")}
        description={t("pages.about.seo_desc")}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AUTOVERE",
          description: t("pages.about.seo_desc"),
          url: "https://autovere.com",
          foundingLocation: { "@type": "Place", name: "Norway" },
          areaServed: "Europe",
        }}
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -top-48 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-glow blur-3xl opacity-20" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> {t("pages.about.pill")}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              {t("pages.about.h1_a")}<br />
              <span className="text-gradient">{t("pages.about.h1_b")}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">{t("pages.about.lead")}</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border/30 bg-card/20">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">{t("pages.about.philosophy_eyebrow")}</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{t("pages.about.philosophy_h")}</h2>
          <p className="text-muted-foreground leading-relaxed">{t("pages.about.philosophy_lead")}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {pillars.map((p, i) => {
            const v = PILLAR_VISUALS[i] ?? PILLAR_VISUALS[0];
            const Icon = v.icon;
            return (
              <div key={p.title} className="glass rounded-2xl border border-border/40 p-6 hover:border-border/70 transition-colors">
                <div className={`w-9 h-9 rounded-xl ${v.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-4.5 h-4.5 ${v.color}`} />
                </div>
                <h3 className="text-sm font-semibold mb-2">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container pb-20">
        <div className="glass rounded-3xl border border-border/40 p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">{t("pages.about.what_eyebrow")}</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">{t("pages.about.what_h")}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t("pages.about.what_p1")}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{t("pages.about.what_p2")}</p>
            </div>
            <div className="space-y-4">
              {whatItems.map((item, i) => {
                const Icon = WHAT_ICONS[i] ?? Brain;
                return (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-card/50 border border-border/30">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="container pb-24">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link to={L("/ev")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity text-sm font-medium">
            <Zap className="w-4 h-4" /> {t("pages.about.cta_explore")}
          </Link>
          <Link to={L("/pricing")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-border/40 hover:border-accent/40 transition-colors text-sm font-medium">
            {t("pages.about.cta_premium")} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link to={L("/contact")} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            {t("pages.about.cta_contact")}
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
