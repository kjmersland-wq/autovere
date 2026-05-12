import { Link, useLocation } from "react-router-dom";
import {
  Warehouse, CreditCard, Route, Zap, Calculator, BookOpen,
  Wrench, MessageCircle, ArrowRight, Shield, LogIn,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const TOPICS = [
  {
    icon: LogIn,
    color: "text-accent",
    bg: "bg-accent/10",
    title: "Account & sign in",
    body: "Create a free account at autovere.com/auth using your email address and a password of at least 8 characters. After signing up you will receive a confirmation email — click the link to activate your account. If you don't see the email, check your spam folder. To sign back in, visit the same page and switch to the 'Sign in' tab.",
    links: [{ label: "Go to sign in", to: "/auth" }],
  },
  {
    icon: CreditCard,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    title: "Premium subscription",
    body: "Premium is billed monthly or annually in EUR via Stripe. After checkout you will be redirected back to AUTOVERE with your Premium access immediately active. To manage, pause, or cancel your subscription, visit your account settings. Cancelling stops future charges — access continues until your current billing period ends.",
    links: [{ label: "View pricing", to: "/pricing" }, { label: "Subscription policy", to: "/legal/subscriptions" }],
  },
  {
    icon: Warehouse,
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    title: "My Garage",
    body: "My Garage lets you track EVs in three slots: Dream (vehicles you want), Owned (vehicles you drive), and Comparing (active research). Add any EV by clicking 'Add to Garage' on its model page. Owned vehicles generate AI ownership insights and fleet score overlays. Charge sessions and service events can be logged from the Owned tab. Your garage is saved locally by default and syncs to your account when signed in.",
    links: [{ label: "Open My Garage", to: "/garage" }],
  },
  {
    icon: Route,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    title: "Route planner",
    body: "Enter an origin and destination, select your EV model, and choose your preferred charging networks. The planner calculates an optimised itinerary with estimated charging stops, session durations, costs, and arrival state-of-charge at each stop. Estimates use each vehicle's real-world range at motorway speed and published network tariffs. For winter journeys, enable the winter range mode — this applies a cold-climate range reduction based on each vehicle's winter suitability score.",
    links: [{ label: "Open route planner", to: "/ev/route-planner" }],
  },
  {
    icon: Zap,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    title: "Charging networks",
    body: "The charging section profiles the six major pan-European networks with station counts, maximum charging speed, connector standards, pricing models, membership requirements, and compatibility by EV model. Use the network pages to decide which memberships or apps to set up before a long trip. Coverage maps show each network's regional strengths and gaps.",
    links: [{ label: "Browse networks", to: "/ev/charging" }],
  },
  {
    icon: Calculator,
    color: "text-rose-400",
    bg: "bg-rose-400/10",
    title: "Ownership calculator",
    body: "The ownership calculator estimates five-year total cost of ownership by combining purchase price, annual charging cost (based on your home tariff, charging setup, and annual mileage), estimated service costs, insurance, and depreciation. All inputs are editable. Results are indicative — they are a planning tool, not a financial guarantee.",
    links: [{ label: "Open calculator", to: "/ev/calculator" }],
  },
  {
    icon: BookOpen,
    color: "text-teal-400",
    bg: "bg-teal-400/10",
    title: "Articles & intelligence",
    body: "The news feed at /ev/news publishes curated EV intelligence articles weekly across six categories: infrastructure, technology, market, comparison, ownership, and policy. Each article includes a 'Why it matters' summary, an AI intelligence sidebar with ownership impact and charging implications, and links to related vehicles and networks. Use the category filter to focus on topics most relevant to you.",
    links: [{ label: "News feed", to: "/ev/news" }],
  },
  {
    icon: Wrench,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    title: "Troubleshooting",
    body: "If the page appears blank after loading, try a hard refresh (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). If your garage or saved content appears empty unexpectedly, check that your browser allows localStorage (some privacy modes block it). For subscription issues, clearing your browser cache and signing back in often resolves a stale session. If a problem persists, use the contact form below and describe what you see, what you expected, and which browser and device you are using.",
    links: [],
  },
  {
    icon: Shield,
    color: "text-sky-400",
    bg: "bg-sky-400/10",
    title: "Privacy & data",
    body: "Your garage, preferences, and saved content are stored in your browser's localStorage by default — not sent to our servers. Creating an account enables encrypted cloud sync. AUTOVERE does not use advertising trackers. We use a minimal, functional cookie set required for authentication. Full details are in our Privacy Policy.",
    links: [{ label: "Privacy policy", to: "/legal/privacy" }, { label: "Cookie policy", to: "/legal/cookies" }],
  },
  {
    icon: MessageCircle,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    title: "Contact support",
    body: "Our team responds to every message — typically within one business day. For subscription and billing issues please include your account email. For technical issues, include your browser, operating system, and a brief description of what happened. For content suggestions or data corrections, we welcome detailed feedback via the contact form.",
    links: [{ label: "Contact us", to: "/contact" }],
  },
];

export default function Help() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  return (
    <PageShell>
      <SEO
        title="Help Centre — AUTOVERE"
        description="Find answers about your AUTOVERE account, Premium subscription, My Garage, the route planner, charging calculator, and more."
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-glow blur-3xl opacity-30" />
        <div className="container relative py-16 md:py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Support</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Help <span className="text-gradient">centre</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Guides for every part of the AUTOVERE platform. If you can't find what you need, our team is one message away.
            </p>
          </div>
        </div>
      </section>

      {/* Topic cards */}
      <section className="container py-12">
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
          {TOPICS.map((topic) => {
            const Icon = topic.icon;
            return (
              <div key={topic.title} className="glass rounded-2xl border border-border/40 p-6 hover:border-border/70 transition-colors flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl ${topic.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${topic.color}`} />
                  </div>
                  <h2 className="text-sm font-semibold">{topic.title}</h2>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-4">{topic.body}</p>
                {topic.links.length > 0 && (
                  <div className="flex flex-wrap gap-3 pt-2 border-t border-border/20">
                    {topic.links.map((link) => (
                      <Link
                        key={link.to}
                        to={L(link.to)}
                        className={`inline-flex items-center gap-1 text-xs font-medium ${topic.color} hover:underline`}
                      >
                        {link.label} <ArrowRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Also check FAQ */}
      <section className="container pb-24">
        <div className="max-w-4xl">
          <div className="glass rounded-2xl border border-border/40 p-8 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-1">Looking for detailed answers?</h3>
              <p className="text-sm text-muted-foreground">
                The FAQ covers how scores work, privacy, charging estimates, Premium, and more — in depth.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to={L("/faq")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-border/40 hover:border-accent/40 text-sm font-medium transition-colors"
              >
                Read FAQ <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={L("/contact")}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
