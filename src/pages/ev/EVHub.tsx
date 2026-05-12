import { Link, useLocation } from "react-router-dom";
import { Zap, Map, Route, Calculator, BookOpen, ChevronRight, Battery, Thermometer, Globe, TrendingUp, Star, Play, Car, BarChart2, Brain, Flag, Database, Rss } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const FEATURED_EVS = [
  { name: "Polestar 3", range: "631 km", origin: "Sweden", tag: "Long-range SUV" },
  { name: "Tesla Model Y", range: "533 km", origin: "USA", tag: "Best seller" },
  { name: "BMW iX", range: "630 km", origin: "Germany", tag: "Luxury flagship" },
  { name: "Volvo EX90", range: "580 km", origin: "Sweden", tag: "Family SUV" },
  { name: "Hyundai IONIQ 6", range: "614 km", origin: "Korea", tag: "Efficiency leader" },
  { name: "Mercedes EQS", range: "770 km", origin: "Germany", tag: "Ultra-range saloon" },
];

export default function EVHub() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const { t } = useTranslation();

  const MODULES = [
    {
      to: "/ev/charging",
      icon: Map,
      label: t("ev.hub.mod_charging"),
      desc: t("ev.hub.mod_charging_d"),
      color: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-500/20",
      iconColor: "text-cyan-400",
    },
    {
      to: "/ev/route-planner",
      icon: Route,
      label: t("ev.hub.mod_planner"),
      desc: t("ev.hub.mod_planner_d"),
      color: "from-violet-500/20 to-purple-500/10",
      border: "border-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      to: "/ev/calculator",
      icon: Calculator,
      label: t("ev.hub.mod_calculator"),
      desc: t("ev.hub.mod_calculator_d"),
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      to: "/ev/guides",
      icon: BookOpen,
      label: t("ev.hub.mod_guides"),
      desc: t("ev.hub.mod_guides_d"),
      color: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-500/20",
      iconColor: "text-amber-400",
    },
    {
      to: "/ev/models",
      icon: Car,
      label: t("ev.hub.mod_models"),
      desc: t("ev.hub.mod_models_d"),
      color: "from-rose-500/20 to-pink-500/10",
      border: "border-rose-500/20",
      iconColor: "text-rose-400",
    },
    {
      to: "/ev/reviews",
      icon: Play,
      label: t("ev.hub.mod_reviews"),
      desc: t("ev.hub.mod_reviews_d"),
      color: "from-indigo-500/20 to-blue-500/10",
      border: "border-indigo-500/20",
      iconColor: "text-indigo-400",
    },
    {
      to: "/ev/compare",
      icon: BarChart2,
      label: t("ev.hub.mod_compare"),
      desc: t("ev.hub.mod_compare_d"),
      color: "from-violet-500/20 to-fuchsia-500/10",
      border: "border-violet-500/20",
      iconColor: "text-violet-400",
    },
    {
      to: "/ev/advisor",
      icon: Brain,
      label: t("ev.hub.mod_advisor"),
      desc: t("ev.hub.mod_advisor_d"),
      color: "from-teal-500/20 to-emerald-500/10",
      border: "border-teal-500/20",
      iconColor: "text-teal-400",
    },
    {
      to: "/ev/markets",
      icon: Flag,
      label: t("ev.hub.mod_markets"),
      desc: t("ev.hub.mod_markets_d"),
      color: "from-sky-500/20 to-blue-500/10",
      border: "border-sky-500/20",
      iconColor: "text-sky-400",
    },
    {
      to: "/ev/database",
      icon: Database,
      label: t("ev.hub.mod_database"),
      desc: t("ev.hub.mod_database_d"),
      color: "from-slate-500/20 to-zinc-500/10",
      border: "border-slate-500/20",
      iconColor: "text-slate-400",
    },
    {
      to: "/ev/news",
      icon: Rss,
      label: t("ev.hub.mod_news"),
      desc: t("ev.hub.mod_news_d"),
      color: "from-emerald-500/20 to-teal-500/10",
      border: "border-emerald-500/20",
      iconColor: "text-emerald-400",
    },
  ];

  const STATS = [
    { value: "3.2M+", label: t("ev.hub.stat_evs"), icon: TrendingUp },
    { value: "800+", label: t("ev.hub.stat_ionity"), icon: Zap },
    { value: "620 km", label: t("ev.hub.stat_range"), icon: Battery },
    { value: "14°C", label: t("ev.hub.stat_winter"), icon: Thermometer },
  ];

  return (
    <PageShell>
      <SEO
        title={t("ev.hub.seo_title")}
        description={t("ev.hub.seo_desc")}
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-violet-950/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-400 mb-6">
            <Zap className="w-3.5 h-3.5" />
            {t("ev.hub.eyebrow")}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-3xl">
            {t("ev.hub.title")}{" "}
            <span className="text-gradient">{t("ev.hub.title_b")}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            {t("ev.hub.subtitle")}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={L("/ev/calculator")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              {t("ev.hub.cta_calculator")} <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to={L("/ev/route-planner")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-border/50 hover:border-border transition-colors"
            >
              {t("ev.hub.cta_planner")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Module cards */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">{t("ev.hub.tools_eyebrow")}</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("ev.hub.tools_title")}</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES.map((m) => (
            <Link
              key={m.to}
              to={L(m.to)}
              className={`group glass rounded-3xl p-7 border ${m.border} bg-gradient-to-br ${m.color} hover:-translate-y-1 transition-all duration-300`}
            >
              <div className={`w-10 h-10 rounded-xl bg-card flex items-center justify-center mb-5 ${m.iconColor}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{m.label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{m.desc}</p>
              <span className={`inline-flex items-center gap-1 text-xs font-medium ${m.iconColor}`}>
                {t("ev.hub.explore")} <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/40 bg-card/30">
        <div className="container py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <s.icon className="w-4.5 h-4.5 text-accent" />
                  </div>
                </div>
                <div className="text-3xl font-bold tracking-tight text-gradient mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured EVs */}
      <section className="container py-24">
        <div className="flex items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">{t("ev.hub.lineup_eyebrow")}</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{t("ev.hub.lineup_title")}</h2>
          </div>
          <Link to={L("/cars")} className="text-sm text-accent hover:underline flex-shrink-0">
            {t("ev.hub.all_cars")}
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_EVS.map((ev) => (
            <div key={ev.name} className="glass rounded-2xl p-6 border border-border/40 hover:border-border/80 transition-colors group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{ev.tag}</div>
                  <h3 className="font-semibold text-lg">{ev.name}</h3>
                  <div className="text-xs text-muted-foreground">{ev.origin}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gradient">{ev.range}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{t("ev.hub.wltp_range")}</div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Infrastructure teaser */}
      <section className="container pb-24">
        <div className="glass rounded-3xl border border-border/40 p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />
          <div className="relative">
            <Globe className="w-10 h-10 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              {t("ev.hub.infra_title")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              {t("ev.hub.infra_subtitle")}
            </p>
            <Link
              to={L("/ev/charging")}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              {t("ev.hub.infra_cta")} <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
