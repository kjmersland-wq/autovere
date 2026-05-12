import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Brain, Zap, Route, Database, Shield, Clock, Youtube, Lock, Globe, Sliders, ArrowRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

interface FAQItem {
  q: string;
  a: string | React.ReactNode;
}

interface FAQSection {
  icon: React.ElementType;
  color: string;
  title: string;
  items: FAQItem[];
}

const SECTIONS: FAQSection[] = [
  {
    icon: Brain,
    color: "text-accent",
    title: "About AUTOVERE",
    items: [
      {
        q: "What is AUTOVERE?",
        a: "AUTOVERE is a European EV intelligence platform. We combine curated editorial content, AI-powered vehicle scoring, and personal ownership tools to help you research, choose, and live with an electric vehicle. Think of it as an EV intelligence OS — not just a comparison site.",
      },
      {
        q: "Who is AUTOVERE for?",
        a: "Anyone researching an EV purchase in Europe, existing EV owners who want to track ownership costs and charging habits, and enthusiasts who want deep intelligence on the EV market. We skew toward drivers in Norway, Germany, Sweden, France, and the Netherlands — the densest EV markets in Europe.",
      },
      {
        q: "Is AUTOVERE affiliated with any manufacturer?",
        a: "No. AUTOVERE is independent. We are not affiliated with, sponsored by, or commercially tied to any vehicle manufacturer, charging network, or dealer group. All scoring and editorial content reflects our own analysis.",
      },
    ],
  },
  {
    icon: Database,
    color: "text-cyan-400",
    title: "EV Intelligence Scores",
    items: [
      {
        q: "How are EV intelligence scores calculated?",
        a: "Each vehicle is scored across nine dimensions: Winter Suitability, Charging Ecosystem, Motorway Efficiency, Family Practicality, Urban Suitability, Road Trip Score, Reliability Signal, Maintenance Complexity, and Overall Intelligence. Scores from 0–100 are derived from published manufacturer data, independent range tests, owner surveys, and WLTP/real-world benchmarks. The Overall score is a weighted mean of the eight specific dimensions.",
      },
      {
        q: "How current are the vehicle scores?",
        a: "Scores are reviewed and updated as significant new data emerges — typically when a new OTA software update changes range or charging behaviour, after published winter range tests, or when independently verified real-world data contradicts manufacturer claims. Each model page shows when its intelligence data was last reviewed.",
      },
      {
        q: "Why doesn't every model have a full intelligence score?",
        a: "Intelligence scoring requires sufficient real-world data from multiple independent sources. Newly launched vehicles or lower-volume models may have partial scores until we have reliable data across all nine dimensions. We show a '—' rather than publish an estimate we can't verify.",
      },
    ],
  },
  {
    icon: Route,
    color: "text-emerald-400",
    title: "Route Planner & Tools",
    items: [
      {
        q: "How does the route planner work?",
        a: "The route planner estimates charging stops along a given route based on the selected vehicle's real-world range, preferred charging networks, and driving speed. Enter your origin and destination, select your EV and preferred charging networks, and the planner calculates an optimised itinerary with estimated charging times, costs, and arrival SoC at each stop.",
      },
      {
        q: "How accurate are the charging cost estimates?",
        a: "Charging cost estimates use each network's published per-kWh tariffs as of our last data update. Live pricing varies by location, time of day, and membership tier. Treat our estimates as realistic ballpark figures for planning — always confirm the exact tariff in the charging network's app before a session.",
      },
      {
        q: "Is the ownership cost calculator real or estimated?",
        a: "The calculator uses a combination of real published figures (service intervals, manufacturer-recommended consumable replacement cycles) and our own cost modelling based on European workshop data. Annual totals are indicative — they assume average home electricity tariffs and typical urban/motorway driving mix. Your actual costs depend on your tariff, driving style, and service choices.",
      },
    ],
  },
  {
    icon: Zap,
    color: "text-amber-400",
    title: "Charging Networks",
    items: [
      {
        q: "Which charging networks does AUTOVERE cover?",
        a: "We currently profile the six major pan-European networks: Ionity, Tesla Supercharger, Fastned, Allego, and others with significant European footprints. Network coverage, maximum charging speeds, connector standards, pricing, and compatibility with each EV model are documented for each network.",
      },
      {
        q: "Does AUTOVERE show live charger availability?",
        a: "Not currently. Live availability requires real-time API access to each network's availability feed, which we are working to integrate. At present, we provide static network data: station locations by region, charger counts, and coverage strength maps.",
      },
    ],
  },
  {
    icon: Shield,
    color: "text-violet-400",
    title: "Premium & Pricing",
    items: [
      {
        q: "Is a Premium subscription required to use AUTOVERE?",
        a: "Most of the platform is free: vehicle pages, charging network data, the news feed, article intelligence, comparisons, and the route planner are all accessible without an account. Premium unlocks advanced personalization, unlimited garage slots, priority access to new features, and removes all content limits.",
      },
      {
        q: "What payment methods are accepted?",
        a: "All payments are processed securely by Stripe. We accept Visa, Mastercard, and most major debit cards. Subscriptions are billed monthly or annually in EUR. No cryptocurrency or alternative payment methods.",
      },
      {
        q: "Can I cancel my subscription?",
        a: "Yes, at any time from your account settings. Your Premium access continues until the end of the billing period you have already paid for. We do not prorate cancellations, but we do not charge beyond the period you cancel in.",
      },
    ],
  },
  {
    icon: Clock,
    color: "text-rose-400",
    title: "Content & Updates",
    items: [
      {
        q: "How often is content updated?",
        a: "Editorial articles are published weekly. Vehicle intelligence scores are reviewed on a rolling basis as new test data emerges. Charging network data is updated monthly. Market signals and signals feed are updated as notable events occur — typically multiple times per week.",
      },
      {
        q: "How are sources selected for articles and signals?",
        a: "We prioritise established independent EV test organisations, manufacturer official press releases, and peer-reviewed technical studies. We do not republish press releases verbatim. All articles include an editorial layer: analysis of what the news means for owners, how it affects vehicle scores, and what action (if any) owners should take.",
      },
    ],
  },
  {
    icon: Youtube,
    color: "text-red-400",
    title: "YouTube Reviews",
    items: [
      {
        q: "How are YouTube reviews used on AUTOVERE?",
        a: "Each vehicle model page curates three high-quality YouTube review embeds — typically covering a range test, a long-term ownership review, and a head-to-head comparison. Embeds are displayed within YouTube's standard iframe player under YouTube's standard Terms of Service. We do not host, copy, or re-encode any video content.",
      },
      {
        q: "Can I suggest a YouTube channel for inclusion?",
        a: "Yes — use our contact form and include the channel name and a specific review you think we should feature. We assess channels for independence, testing rigour, European relevance, and production quality before featuring them.",
      },
    ],
  },
  {
    icon: Lock,
    color: "text-sky-400",
    title: "Privacy & Data",
    items: [
      {
        q: "How is my personal data stored?",
        a: "Your garage, saved content, and preferences are stored in your browser's localStorage by default — on your device, not on our servers. If you create an account, this data can be synced to your cloud profile via Supabase (our backend infrastructure), secured with row-level security and encrypted at rest.",
      },
      {
        q: "Does AUTOVERE use cookies for tracking?",
        a: "We use a minimal set of functional cookies required for authentication and session management. We do not use third-party advertising cookies or build advertising profiles. Analytics (if any) are privacy-first. See our Cookie Policy for the complete breakdown.",
      },
    ],
  },
  {
    icon: Globe,
    color: "text-teal-400",
    title: "Countries & Languages",
    items: [
      {
        q: "Which countries does AUTOVERE support?",
        a: "AUTOVERE focuses on the European EV market, with deepest coverage of Norway, Germany, Sweden, France, the Netherlands, and the UK. Vehicle pricing is shown for these key markets. Charging network coverage maps prioritise these countries. We are expanding regional coverage progressively.",
      },
      {
        q: "Which languages are available?",
        a: "The platform is available in English, Norwegian, German, Swedish, French, Polish, Italian, and Spanish. English is the primary language and always the most complete. Other language versions are progressively expanded. If you spot a translation gap, please report it via the contact form.",
      },
    ],
  },
  {
    icon: Sliders,
    color: "text-orange-400",
    title: "Personalization",
    items: [
      {
        q: "How does personalization work?",
        a: "AUTOVERE's personalization engine uses your preferences — climate (arctic / cold / temperate / warm), driving profile (city / mixed / motorway / touring), household type, charging setup, and annual mileage — to re-rank content, weight vehicle intelligence scores, and generate AI ownership insights specific to your situation. Set your preferences via the settings icon in the navigation bar.",
      },
      {
        q: "Do I need an account for personalization?",
        a: "No. Preferences are stored locally in your browser and work without an account. Creating an account allows your preferences to sync across devices and persist through browser clears.",
      },
    ],
  },
];

function AccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left text-sm font-medium hover:text-accent transition-colors"
        aria-expanded={open}
      >
        <span>{item.q}</span>
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? "max-h-[600px] pb-4" : "max-h-0"}`}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  return (
    <PageShell>
      <SEO
        title="FAQ — AUTOVERE EV Intelligence Platform"
        description="Answers to common questions about AUTOVERE: EV intelligence scores, the route planner, charging data, Premium, privacy, and personalization."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: SECTIONS.flatMap((s) =>
            s.items.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: typeof item.a === "string" ? item.a : "",
              },
            }))
          ),
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-glow blur-3xl opacity-30" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Help & FAQ</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Frequently asked<br />
              <span className="text-gradient">questions</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Everything you need to know about AUTOVERE — from how scores are calculated to how your data is stored.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="container py-12 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 max-w-5xl">

          {/* Sticky nav on desktop */}
          <nav className="hidden lg:block">
            <div className="sticky top-28 space-y-1">
              {SECTIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.title}
                    href={`#${s.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-card/60 transition-colors"
                  >
                    <Icon className={`w-3.5 h-3.5 ${s.color} flex-shrink-0`} />
                    {s.title}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Accordion sections */}
          <div className="space-y-8">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  id={s.title.toLowerCase().replace(/\s+/g, "-")}
                  className="glass rounded-2xl border border-border/40 p-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className={`w-8 h-8 rounded-lg bg-card/80 flex items-center justify-center ${s.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <h2 className="text-sm font-semibold">{s.title}</h2>
                  </div>
                  <div>
                    {s.items.map((item) => (
                      <AccordionItem key={item.q} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Still have questions */}
        <div className="mt-16 max-w-5xl">
          <div className="glass rounded-2xl border border-border/40 p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-1">Still have a question?</h3>
              <p className="text-sm text-muted-foreground">Our team responds to every message — usually within one business day.</p>
            </div>
            <Link
              to={L("/contact")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex-shrink-0"
            >
              Contact us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
