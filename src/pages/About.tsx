import { Link, useLocation } from "react-router-dom";
import {
  Brain, Zap, Globe, Shield, TrendingUp, Users, Warehouse, ArrowRight, Sparkles,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const PILLARS = [
  {
    icon: Brain,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Intelligence, not opinions",
    body: "EV buying decisions involve dozens of variables that vary by climate, driving style, charging infrastructure, and budget. We built a scoring system that surfaces the right answer for your specific situation — not a generic bestseller list.",
  },
  {
    icon: Globe,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    title: "European by design",
    body: "Most EV coverage is US-centric. European drivers face different charging infrastructure, different winters, different pricing structures, and different regulatory environments. AUTOVERE is built for this reality from the ground up.",
  },
  {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "Ownership over the full arc",
    body: "Buying an EV is the first chapter. We care about the next five years: charging habits, winter range, battery health, service costs, network expansion, software updates. The garage and ownership tools exist because the purchase is just the beginning.",
  },
  {
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Editorially independent",
    body: "We have no commercial relationships with vehicle manufacturers, charging networks, or dealers. No sponsored scores. No affiliate placement. Our analysis reflects our genuine assessment of the data — nothing else.",
  },
  {
    icon: TrendingUp,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    title: "AI-assisted, human-curated",
    body: "Our intelligence engine processes test data, ownership signals, and market shifts automatically. Every insight is reviewed editorially before it reaches a reader. AI accelerates the analysis; humans remain accountable for what we publish.",
  },
  {
    icon: Users,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    title: "Designed for depth",
    body: "The EV market moves fast and the detail matters. We go further than spec sheets: real-world range in specific conditions, charging curve analysis, reliability signals from owner communities, and policy implications for European buyers.",
  },
];

const STATS = [
  { value: "15", label: "EV models profiled" },
  { value: "9", label: "intelligence dimensions" },
  { value: "17+", label: "in-depth articles" },
  { value: "8", label: "European languages" },
];

export default function About() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  return (
    <PageShell>
      <SEO
        title="About AUTOVERE — European EV Intelligence Platform"
        description="AUTOVERE is an independent European EV intelligence platform. We combine editorial depth, AI-powered vehicle scoring, and ownership tools to help you choose and live with an electric vehicle."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "AUTOVERE",
          description: "Independent European EV intelligence platform",
          url: "https://autovere.com",
          foundingLocation: { "@type": "Place", name: "Norway" },
          areaServed: "Europe",
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -top-48 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-glow blur-3xl opacity-20" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> Independent · European · Intelligence-first
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              The EV platform built<br />
              for <span className="text-gradient">serious buyers</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
              AUTOVERE exists because buying an electric vehicle in Europe requires more than a spec comparison.
              It requires understanding how a vehicle performs in <em>your</em> winter, on <em>your</em> routes,
              with <em>your</em> charging setup — and what it actually costs to own over five years.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/30 bg-card/20">
        <div className="container py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-gradient mb-1">{s.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="container py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">Our philosophy</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Six things we believe about EV intelligence
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            These are the principles that shape every feature, every score, and every editorial decision on AUTOVERE.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {PILLARS.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="glass rounded-2xl border border-border/40 p-6 hover:border-border/70 transition-colors">
                <div className={`w-9 h-9 rounded-xl ${p.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-4.5 h-4.5 ${p.color}`} />
                </div>
                <h3 className="text-sm font-semibold mb-2">{p.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* What AUTOVERE is */}
      <section className="container pb-20">
        <div className="glass rounded-3xl border border-border/40 p-8 md:p-12 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-3">The platform</p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                More than a comparison site
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                AUTOVERE combines editorial intelligence, AI-powered vehicle scoring, a personal garage, and live market signals into a single platform. It's designed to be useful when you're researching, useful when you're deciding, and useful every week after you've bought.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We are a small, independent team based in Norway. Our commercial model is a transparent subscription — no advertising, no affiliate revenue, no manufacturer partnerships.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { icon: Brain, label: "AI vehicle intelligence", desc: "9-dimension scoring for every major EV" },
                { icon: Warehouse, label: "Personal garage", desc: "Track ownership, charging, and service history" },
                { icon: Zap, label: "Live market signals", desc: "Price changes, software updates, network expansions" },
                { icon: Globe, label: "European coverage", desc: "8 languages, 6 major charging networks" },
              ].map((item) => {
                const Icon = item.icon;
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

      {/* CTA row */}
      <section className="container pb-24">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            to={L("/ev")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity text-sm font-medium"
          >
            <Zap className="w-4 h-4" /> Explore EV Hub
          </Link>
          <Link
            to={L("/pricing")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-border/40 hover:border-accent/40 transition-colors text-sm font-medium"
          >
            View Premium <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to={L("/contact")}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
