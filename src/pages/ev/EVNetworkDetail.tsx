import { Link, useLocation, useParams } from "react-router-dom";
import { Zap, CheckCircle, XCircle, ChevronLeft, Globe, CreditCard, Wifi, MapPin } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { CHARGING_NETWORKS } from "@/data/charging-networks";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import NotFound from "@/pages/NotFound";

const COVERAGE_COUNTRIES: Record<string, string[]> = {
  ionity: ["🇩🇪 Germany", "🇫🇷 France", "🇳🇴 Norway", "🇸🇪 Sweden", "🇦🇹 Austria", "🇬🇧 UK", "🇪🇸 Spain", "🇮🇹 Italy", "🇧🇪 Belgium", "🇳🇱 Netherlands", "🇩🇰 Denmark", "🇨🇭 Switzerland", "🇵🇱 Poland", "🇨🇿 Czechia"],
  "tesla-supercharger": ["🇩🇪 Germany", "🇫🇷 France", "🇳🇴 Norway", "🇸🇪 Sweden", "🇬🇧 UK", "🇪🇸 Spain", "🇮🇹 Italy", "🇧🇪 Belgium", "🇳🇱 Netherlands", "🇩🇰 Denmark", "🇵🇱 Poland", "🇵🇹 Portugal", "🇨🇭 Switzerland", "🇦🇹 Austria"],
  fastned: ["🇳🇱 Netherlands", "🇩🇪 Germany", "🇬🇧 UK", "🇧🇪 Belgium", "🇫🇷 France"],
  recharge: ["🇳🇴 Norway", "🇸🇪 Sweden", "🇩🇰 Denmark", "🇫🇮 Finland"],
  allego: ["🇳🇱 Netherlands", "🇩🇪 Germany", "🇧🇪 Belgium", "🇫🇷 France", "🇵🇱 Poland", "🇨🇿 Czechia", "🇦🇹 Austria", "🇨🇭 Switzerland", "🇮🇹 Italy", "🇵🇹 Portugal"],
};

export function EVNetworksIndex() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  return (
    <PageShell>
      <SEO
        title="EV Charging Networks in Europe | AUTOVERE"
        description="Compare Tesla Supercharger, Ionity, Fastned, Recharge and Allego. Speeds, pricing, coverage and compatibility for every major European charging network."
      />
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-violet-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> EV Hub › Networks
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            Which charging network <span className="text-gradient">is right for you?</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            Speed, coverage, pricing and compatibility — every major European network, compared honestly.
          </p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {CHARGING_NETWORKS.map((network) => (
            <Link
              key={network.slug}
              to={L(`/ev/networks/${network.slug}`)}
              className="glass rounded-2xl border border-border/40 p-6 hover:border-border/80 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className={`text-[10px] uppercase tracking-widest mb-2 ${network.accentColor}`}>{network.headquarters}</div>
              <h3 className="font-semibold text-xl mb-2">{network.name}</h3>
              <p className="text-xs text-muted-foreground mb-5 leading-relaxed line-clamp-2">{network.tagline}</p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                <div className="bg-card/60 rounded-lg p-2 text-center">
                  <div className={`text-lg font-bold ${network.accentColor}`}>{network.maxKw}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">kW max</div>
                </div>
                <div className="bg-card/60 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-foreground">{network.stationsEurope.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Stations</div>
                </div>
                <div className="bg-card/60 rounded-lg p-2 text-center">
                  <div className="text-lg font-bold text-foreground">{network.pointsEurope.toLocaleString()}</div>
                  <div className="text-[9px] text-muted-foreground uppercase">Points</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{network.pricing.typical}</span>
                <span className="text-accent group-hover:translate-x-0.5 transition-transform">Deep dive →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export default function EVNetworkDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const network = CHARGING_NETWORKS.find((n) => n.slug === slug);
  if (!network) return <NotFound />;

  const countries = COVERAGE_COUNTRIES[slug] ?? [];

  return (
    <PageShell>
      <SEO
        title={`${network.name} — European Charging Network Guide | AUTOVERE`}
        description={`${network.name}: ${network.maxKw} kW max, ${network.stationsEurope} stations, ${network.pricing.typical}. Coverage, compatibility and honest assessment.`}
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-violet-950/20 pointer-events-none" />
        <div className="container relative">
          <Link to={L("/ev/networks")} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> All networks
          </Link>
          <div className={`inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] mb-4 ${network.accentColor}`}>
            <Zap className="w-3.5 h-3.5" /> Charging network · est. {network.founded}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">{network.name}</h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed mb-8">{network.tagline}</p>

          <div className="flex flex-wrap gap-4">
            {[
              { label: "Max speed", value: `${network.maxKw} kW` },
              { label: "EU stations", value: network.stationsEurope.toLocaleString() },
              { label: "EU charge points", value: network.pointsEurope.toLocaleString() },
              { label: "Pricing", value: network.pricing.typical },
            ].map((s) => (
              <div key={s.label} className="glass rounded-xl border border-border/40 px-5 py-3 text-center">
                <div className={`text-xl font-bold ${network.accentColor}`}>{s.value}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-16">
        <div className="grid lg:grid-cols-[1fr_340px] gap-10">
          <div className="space-y-10">
            {/* Summary */}
            <section className="glass rounded-2xl border border-border/40 p-8">
              <div className={`flex items-center gap-2 text-xs uppercase tracking-widest mb-4 ${network.accentColor}`}>
                <Wifi className="w-3.5 h-3.5" /> Network overview
              </div>
              <p className="text-muted-foreground leading-relaxed">{network.summary}</p>
            </section>

            {/* Charging speeds */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-5">Charging speeds</h2>
              <div className="space-y-3">
                {network.speeds.map((speed) => (
                  <div key={speed.label} className="glass rounded-2xl border border-border/40 p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{speed.label}</span>
                      <span className={`text-xl font-bold ${network.accentColor}`}>{speed.kw} kW</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-card mb-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-700`}
                        style={{ width: `${(speed.kw / 350) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{speed.typical}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pros / Cons */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-5">Honest assessment</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="glass rounded-2xl border border-emerald-500/20 p-6 bg-emerald-500/5">
                  <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm mb-4">
                    <CheckCircle className="w-4 h-4" /> Strengths
                  </div>
                  <ul className="space-y-2.5">
                    {network.pros.map((pro) => (
                      <li key={pro} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass rounded-2xl border border-red-500/20 p-6 bg-red-500/5">
                  <div className="flex items-center gap-2 text-red-400 font-medium text-sm mb-4">
                    <XCircle className="w-4 h-4" /> Weaknesses
                  </div>
                  <ul className="space-y-2.5">
                    {network.cons.map((con) => (
                      <li key={con} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Compatibility */}
            <section>
              <h2 className="text-xl font-bold tracking-tight mb-4">Vehicle compatibility</h2>
              <div className="flex flex-wrap gap-2">
                {network.compatible.map((c) => (
                  <span key={c} className="px-3 py-1.5 rounded-lg glass border border-border/40 text-sm">{c}</span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Best for */}
            <div className="glass rounded-2xl border border-border/40 p-6">
              <div className={`text-xs uppercase tracking-widest mb-2 ${network.accentColor}`}>Best for</div>
              <p className="text-sm leading-relaxed">{network.bestFor}</p>
            </div>

            {/* Access */}
            <div className="glass rounded-2xl border border-border/40 p-6 space-y-3">
              <h3 className="text-sm font-semibold">Access requirements</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Membership required</span>
                <span className={network.membershipRequired ? "text-amber-400" : "text-emerald-400"}>
                  {network.membershipRequired ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">App required</span>
                <span className={network.appRequired ? "text-amber-400" : "text-emerald-400"}>
                  {network.appRequired ? "Yes" : "No"}
                </span>
              </div>
              <div className="pt-2 border-t border-border/30">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CreditCard className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  <span>{network.pricing.description}</span>
                </div>
              </div>
            </div>

            {/* Coverage */}
            <div className="glass rounded-2xl border border-border/40 p-6">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-4">
                <MapPin className="w-3.5 h-3.5" /> Country coverage
              </div>
              <div className="flex flex-wrap gap-1.5">
                {countries.map((c) => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-lg bg-card border border-border/30">{c}</span>
                ))}
              </div>
              {network.coverageWeak.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">Limited coverage</div>
                  <div className="text-xs text-muted-foreground">{network.coverageWeak.join(", ")}</div>
                </div>
              )}
            </div>

            {/* Compare */}
            <div className="glass rounded-2xl border border-border/40 p-6">
              <h3 className="text-sm font-semibold mb-3">Other networks</h3>
              <div className="space-y-2">
                {CHARGING_NETWORKS.filter((n) => n.slug !== slug).map((n) => (
                  <Link
                    key={n.slug}
                    to={`/ev/networks/${n.slug}`}
                    className="flex items-center justify-between py-1.5 hover:text-foreground transition-colors group"
                  >
                    <span className="text-sm text-muted-foreground group-hover:text-foreground">{n.name}</span>
                    <span className={`text-xs ${n.accentColor}`}>{n.maxKw} kW →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
