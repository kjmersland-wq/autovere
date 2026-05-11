import { Link, useLocation } from "react-router-dom";
import { Zap, Map, Route, Calculator, BookOpen, ChevronRight, Battery, Thermometer, Globe, TrendingUp, Star, Play, Car, BarChart2, Brain, Flag, Database, Rss } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const MODULES = [
  {
    to: "/ev/charging",
    icon: Map,
    label: "Charging Map",
    desc: "Find Ionity, Tesla Supercharger, Fastned and more across Europe — filtered by speed and connector.",
    color: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    to: "/ev/route-planner",
    icon: Route,
    label: "Route Planner",
    desc: "Plan long-distance EV trips with charging stops, cost estimates and winter range adjustments.",
    color: "from-violet-500/20 to-purple-500/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    to: "/ev/calculator",
    icon: Calculator,
    label: "Cost Calculator",
    desc: "See exactly what an EV costs to charge — monthly, yearly, and compared to petrol.",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    to: "/ev/guides",
    icon: BookOpen,
    label: "Ownership Guides",
    desc: "From battery longevity to winter driving — everything real EV owners need to know.",
    color: "from-amber-500/20 to-orange-500/10",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    to: "/ev/models",
    icon: Car,
    label: "Model Guides",
    desc: "Deep-dive pages on every major EV: real range, charging data, winter performance and pricing by country.",
    color: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-500/20",
    iconColor: "text-rose-400",
  },
  {
    to: "/ev/reviews",
    icon: Play,
    label: "Video Reviews",
    desc: "Curated YouTube reviews with consensus scores, real-world data and reviewer analysis.",
    color: "from-indigo-500/20 to-blue-500/10",
    border: "border-indigo-500/20",
    iconColor: "text-indigo-400",
  },
  {
    to: "/ev/compare",
    icon: BarChart2,
    label: "EV Comparison",
    desc: "Compare up to 3 EVs side by side — real range, charging speed, comfort, costs and expert verdicts.",
    color: "from-violet-500/20 to-fuchsia-500/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    to: "/ev/advisor",
    icon: Brain,
    label: "Buying Advisor",
    desc: "7 questions. Personalised EV recommendations matched to your budget, climate and lifestyle.",
    color: "from-teal-500/20 to-emerald-500/10",
    border: "border-teal-500/20",
    iconColor: "text-teal-400",
  },
  {
    to: "/ev/markets",
    icon: Flag,
    label: "Market Intelligence",
    desc: "Incentives, charging costs and EV economics for 8 European countries — from Norway to Italy.",
    color: "from-sky-500/20 to-blue-500/10",
    border: "border-sky-500/20",
    iconColor: "text-sky-400",
  },
  {
    to: "/ev/database",
    icon: Database,
    label: "Vehicle Database",
    desc: "EV, hybrid and ICE vehicles compared — 5-year TCO, depreciation, brake wear and ownership cost.",
    color: "from-slate-500/20 to-zinc-500/10",
    border: "border-slate-500/20",
    iconColor: "text-slate-400",
  },
  {
    to: "/ev/news",
    icon: Rss,
    label: "EV Intelligence",
    desc: "Expert analysis on charging infrastructure, battery technology, European market shifts and ownership economics.",
    color: "from-emerald-500/20 to-teal-500/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

const MODULE_GROUPS = [
  {
    title: "Plan & charge",
    description: "Core tools for route confidence, charging clarity and cost planning.",
    items: ["/ev/charging", "/ev/route-planner", "/ev/calculator", "/ev/networks"],
  },
  {
    title: "Research & compare",
    description: "Editorial model guidance before you shortlist or sign.",
    items: ["/ev/models", "/ev/compare", "/ev/reviews", "/ev/guides"],
  },
  {
    title: "Market intelligence",
    description: "Signals, markets and decision support around the EV ownership landscape.",
    items: ["/ev/news", "/ev/markets", "/ev/advisor", "/ev/database"],
  },
];

const STATS = [
  { value: "3.2M+", label: "EVs sold in Europe in 2024", icon: TrendingUp },
  { value: "800+", label: "Ionity stations across Europe", icon: Zap },
  { value: "620 km", label: "Best-in-class real-world range", icon: Battery },
  { value: "14°C", label: "Average range loss in winter", icon: Thermometer },
];

const FEATURED_EVS = [
  { name: "Polestar 3", range: "631 km", origin: "Sweden", tag: "Long-range SUV", slug: "polestar-3", strip: "from-slate-700 to-blue-800", border: "border-blue-500/20" },
  { name: "Tesla Model Y", range: "533 km", origin: "USA", tag: "Best seller", slug: "tesla-model-y", strip: "from-slate-700 to-red-800", border: "border-red-500/20" },
  { name: "BMW iX", range: "630 km", origin: "Germany", tag: "Luxury flagship", slug: "bmw-ix", strip: "from-zinc-700 to-blue-800", border: "border-sky-500/20" },
  { name: "Volvo EX90", range: "580 km", origin: "Sweden", tag: "Family SUV", slug: "volvo-ex90", strip: "from-slate-700 to-teal-800", border: "border-teal-500/20" },
  { name: "Hyundai IONIQ 6", range: "614 km", origin: "Korea", tag: "Efficiency leader", slug: "hyundai-ioniq6", strip: "from-slate-700 to-cyan-800", border: "border-cyan-500/20" },
  { name: "Mercedes EQS", range: "770 km", origin: "Germany", tag: "Ultra-range saloon", slug: "mercedes-eqs", strip: "from-zinc-700 to-indigo-800", border: "border-violet-500/20" },
];

export default function EVHub() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  return (
    <PageShell>
      <SEO
        title="EV Hub — Electric Intelligence | AUTOVERE"
        description="Europe's premium EV intelligence layer. Charging maps, route planning, ownership guides and cost calculators — all inside AUTOVERE."
        image="https://autovere.com/og-autovere-1200x630.jpg"
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-violet-950/30 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
        {/* Decorative EV silhouette strip */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <div className="absolute top-16 right-0 w-[55%] h-full opacity-[0.035]" style={{ backgroundImage: "repeating-linear-gradient(90deg, hsl(var(--accent)) 0px, hsl(var(--accent)) 1px, transparent 1px, transparent 80px), repeating-linear-gradient(0deg, hsl(var(--accent)) 0px, hsl(var(--accent)) 1px, transparent 1px, transparent 80px)" }} />
        </div>

        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-400 mb-6">
            <Zap className="w-3.5 h-3.5" />
            EV Intelligence Layer
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-3xl">
            Europe's EV platform,{" "}
            <span className="text-gradient">built for reality.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Not hype. Not speculation. Real-world range, honest charging infrastructure data,
            and tools that help you decide — before you sign anything.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to={L("/ev/calculator")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Calculate your EV cost <ChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to={L("/ev/route-planner")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-border/50 hover:border-border transition-colors"
            >
              Plan a route <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Live data ticker strip */}
      <div className="border-y border-border/30 bg-card/20 overflow-hidden">
        <div className="container py-3">
          <div
            className="flex items-center gap-6 overflow-x-auto scrollbar-hide text-xs text-muted-foreground"
            role="region"
            aria-label="Live EV data"
            tabIndex={0}
          >
            <span className="inline-flex items-center gap-1.5 text-cyan-400 font-medium flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" /> LIVE DATA
            </span>
            {[
              { label: "Ionity avg. price", value: "€0.69/kWh" },
              { label: "Fastned uptime", value: "98.2%" },
              { label: "Tesla Supercharger EU", value: "7,200+ points" },
              { label: "Norway EV share 2025", value: "88%" },
              { label: "Best 10–80% time", value: "18 min (IONIQ 5)" },
              { label: "EU EV sales 2024", value: "3.2M units" },
            ].map((item) => (
              <span key={item.label} className="flex-shrink-0 flex items-center gap-2">
                <span>{item.label}:</span>
                <span className="text-foreground font-medium">{item.value}</span>
                <span className="text-border/60">·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Module cards */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">Tools</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need, in one place.</h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
            The EV layer is structured around three calm workflows: planning the journey, understanding the product,
            and tracking the market context behind ownership decisions.
          </p>
        </div>
        <div className="space-y-14">
          {MODULE_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
                <div className="max-w-xl">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-accent mb-2">{group.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{group.description}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {group.items.map((path) => {
                  const module = MODULES.find((entry) => entry.to === path);
                  if (!module) return null;
                  return (
                    <Link
                      key={module.to}
                      to={L(module.to)}
                      className={`group glass rounded-3xl p-7 border ${module.border} bg-gradient-to-br ${module.color} hover:-translate-y-1 transition-all duration-300`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-card flex items-center justify-center mb-5 ${module.iconColor}`}>
                        <module.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{module.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{module.desc}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium ${module.iconColor}`}>
                        Explore <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
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
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">Lineup</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Top European EV picks.</h2>
          </div>
          <Link to={L("/cars")} className="text-sm text-accent hover:underline flex-shrink-0">
            All cars →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURED_EVS.map((ev) => (
            <Link
              key={ev.name}
              to={L(`/ev/models/${ev.slug}`)}
              className={`group glass rounded-2xl border ${ev.border} hover:border-opacity-60 transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
            >
              {/* Brand colour strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${ev.strip}`} />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{ev.tag}</div>
                    <h3 className="font-semibold text-lg">{ev.name}</h3>
                    <div className="text-xs text-muted-foreground">{ev.origin}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gradient">{ev.range}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">WLTP range</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-accent group-hover:gap-1.5 transition-all">
                    View guide →
                  </span>
                </div>
              </div>
            </Link>
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
              European EV infrastructure, mapped.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
              Charging prices, network coverage, incentives and adoption rates — by country.
              Built for drivers who cross borders.
            </p>
            <Link
              to={L("/ev/charging")}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Explore charging map <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
