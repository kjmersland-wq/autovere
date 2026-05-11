import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Zap, ChevronLeft, TrendingUp, Wallet, MapPin, Snowflake, Route, ChevronDown, ChevronUp } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { EV_MARKETS, type EvMarket } from "@/data/ev-markets";

function ScoreBar({ value, color = "bg-gradient-to-r from-primary to-accent" }: { value: number; color?: string }) {
  return (
    <div className="h-1.5 rounded-full bg-card overflow-hidden flex-1">
      <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
}

function DensityBadge({ density }: { density: EvMarket["infrastructure"]["fastChargerDensity"] }) {
  const map = {
    excellent: { label: "Excellent", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" },
    good: { label: "Good", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20" },
    moderate: { label: "Moderate", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    limited: { label: "Limited", color: "text-red-400 bg-red-400/10 border-red-400/20" },
  };
  const d = map[density];
  return (
    <span className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full border ${d.color}`}>
      {d.label}
    </span>
  );
}

function MarketCard({ market, isSelected, onSelect }: {
  market: EvMarket;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-2xl border p-5 transition-all duration-200 ${
        isSelected
          ? "border-accent bg-accent/10"
          : "glass border-border/40 hover:border-border/80 hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-2xl mb-1">{market.flag}</div>
          <div className="font-semibold">{market.name}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{market.evSharePercent}% EV share</div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gradient">{market.infrastructure.score}</div>
          <div className="text-[9px] text-muted-foreground uppercase">Infra score</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ScoreBar value={market.infrastructure.score} />
        <span className={`text-xs font-medium ${isSelected ? "text-accent" : "text-muted-foreground"}`}>
          {isSelected ? "Viewing ↓" : "Details →"}
        </span>
      </div>
    </button>
  );
}

function MarketDetail({ market }: { market: EvMarket }) {
  const [incentivesOpen, setIncentivesOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass rounded-3xl border border-border/40 p-8">
        <div className="flex items-start justify-between gap-6 mb-6">
          <div>
            <div className="text-4xl mb-3">{market.flag}</div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">{market.name}</h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-2xl">{market.summary}</p>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "EV market share", value: `${market.evSharePercent}%`, icon: TrendingUp, color: "text-emerald-400" },
            { label: "Registered EVs", value: `${(market.registeredEvs / 1000).toFixed(0)}k`, icon: MapPin, color: "text-cyan-400" },
            { label: "Home charging", value: `€${market.homechargingCostPerKwh}/kWh`, icon: Wallet, color: "text-amber-400" },
            { label: "Public DC avg", value: `€${market.publicDCCostPerKwh}/kWh`, icon: Zap, color: "text-violet-400" },
          ].map((s) => (
            <div key={s.label} className="bg-card/60 rounded-xl p-4 text-center">
              <s.icon className={`w-4 h-4 mx-auto mb-2 ${s.color}`} />
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Infrastructure */}
        <div className="glass rounded-2xl border border-border/40 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> Charging infrastructure
            </h3>
            <DensityBadge density={market.infrastructure.fastChargerDensity} />
          </div>

          <div className="space-y-4 mb-4">
            {[
              { label: "Infrastructure score", value: market.infrastructure.score, max: 100 },
              { label: "Road trip friendliness", value: market.roadTripFriendliness, max: 100 },
              { label: "Winter suitability", value: market.winterSuitability, max: 100 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.value}/100</span>
                </div>
                <ScoreBar value={(item.value / item.max) * 100} />
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">{market.infrastructure.notes}</p>

          <div className="mt-4 pt-4 border-t border-border/30">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Top networks</div>
            <div className="flex flex-wrap gap-1.5">
              {market.topNetworks.map((n) => (
                <span key={n} className="text-xs px-2.5 py-1 rounded-lg bg-card border border-border/30">{n}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Economics */}
        <div className="glass rounded-2xl border border-border/40 p-6">
          <h3 className="font-semibold flex items-center gap-2 mb-4">
            <Wallet className="w-4 h-4 text-accent" /> Ownership economics
          </h3>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between py-2.5 border-b border-border/20">
              <span className="text-sm text-muted-foreground">Annual saving vs petrol</span>
              <span className="text-sm font-semibold text-emerald-400">€{market.ownershipEconomics.annualSavingVsPetrol.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-border/20">
              <span className="text-sm text-muted-foreground">EV payback vs petrol</span>
              <span className="text-sm font-semibold">{market.ownershipEconomics.paybackYears} years</span>
            </div>
            <div className="flex items-center justify-between py-2.5 border-b border-border/20">
              <span className="text-sm text-muted-foreground">YoY EV sales growth</span>
              <span className={`text-sm font-semibold ${market.evSalesGrowthYoY > 0 ? "text-emerald-400" : "text-red-400"}`}>
                {market.evSalesGrowthYoY > 0 ? "+" : ""}{market.evSalesGrowthYoY}%
              </span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{market.ownershipEconomics.notes}</p>

          {/* Watch */}
          <div className="bg-amber-400/5 border border-amber-400/20 rounded-xl p-3">
            <div className="text-[10px] uppercase tracking-wider text-amber-400 mb-1">Important to know</div>
            <p className="text-xs text-muted-foreground">{market.watch}</p>
          </div>
        </div>
      </div>

      {/* Incentives */}
      <div className="glass rounded-2xl border border-border/40 overflow-hidden">
        <button
          onClick={() => setIncentivesOpen(!incentivesOpen)}
          className="w-full flex items-center justify-between p-6 hover:bg-card/30 transition-colors"
        >
          <h3 className="font-semibold flex items-center gap-2">
            <Wallet className="w-4 h-4 text-accent" /> Government incentives & grants
          </h3>
          {incentivesOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>
        {incentivesOpen && (
          <div className="px-6 pb-6 border-t border-border/30 pt-5 space-y-4">
            {market.incentives.map((inc, i) => (
              <div key={i} className="glass rounded-xl border border-border/30 p-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <span className="font-medium text-sm">{inc.type}</span>
                  <span className="text-sm font-bold text-accent flex-shrink-0">{inc.amount}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{inc.notes}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Best EVs for market */}
      <div className="glass rounded-2xl border border-border/40 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Route className="w-4 h-4 text-accent" /> Best EV picks for {market.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          {market.bestEvsForMarket.map((slug) => (
            <Link
              key={slug}
              to={`/ev/models/${slug}`}
              className="px-4 py-2 rounded-xl glass border border-border/40 hover:border-border/80 text-sm transition-colors"
            >
              {slug.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ")} →
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function EVMarkets() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const [selected, setSelected] = useState<string>("no");
  const selectedMarket = EV_MARKETS.find((m) => m.code === selected)!;

  return (
    <PageShell>
      <SEO
        title="European EV Market Intelligence — Country Guide | AUTOVERE"
        description="EV charging costs, incentives, infrastructure maturity and ownership economics for Norway, Sweden, Germany, France, Netherlands, Poland, Spain and Italy."
        image="https://autovere.com/og-autovere-1200x630.jpg"
      />

      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950/30 via-transparent to-violet-950/20 pointer-events-none" />
        <div className="container relative">
          <Link to={L("/ev")} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" /> EV Hub
          </Link>
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-teal-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> EV Hub › Markets
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-3xl">
            European EV intelligence, <span className="text-gradient">country by country.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg">
            Charging costs, incentives, infrastructure maturity and ownership economics — for every major European market.
          </p>
        </div>
      </section>

      {/* Summary comparison */}
      <section className="border-y border-border/40 bg-card/20">
        <div className="container py-10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="text-left pb-4 pr-4">Country</th>
                  <th className="text-center pb-4 px-3">EV share</th>
                  <th className="text-center pb-4 px-3">Home ¢/kWh</th>
                  <th className="text-center pb-4 px-3">DC ¢/kWh</th>
                  <th className="text-center pb-4 px-3 hidden md:table-cell">Infra score</th>
                  <th className="text-center pb-4 px-3 hidden md:table-cell">Road trip</th>
                  <th className="text-center pb-4 px-3 hidden lg:table-cell">Winter infra</th>
                  <th className="pb-4"></th>
                </tr>
              </thead>
              <tbody>
                {EV_MARKETS.map((m) => (
                  <tr
                    key={m.code}
                    className={`border-t border-border/20 cursor-pointer transition-colors ${selected === m.code ? "bg-accent/5" : "hover:bg-card/30"}`}
                    onClick={() => setSelected(m.code)}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{m.flag}</span>
                        <span className="font-medium text-sm">{m.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-sm font-semibold text-emerald-400">{m.evSharePercent}%</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-sm">€{m.homechargingCostPerKwh}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-sm">€{m.publicDCCostPerKwh}</span>
                    </td>
                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <span className={`text-sm font-semibold ${m.infrastructure.score >= 80 ? "text-emerald-400" : m.infrastructure.score >= 65 ? "text-amber-400" : "text-red-400"}`}>
                        {m.infrastructure.score}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center hidden md:table-cell">
                      <span className="text-sm">{m.roadTripFriendliness}</span>
                    </td>
                    <td className="py-3 px-3 text-center hidden lg:table-cell">
                      <span className="text-sm">{m.winterSuitability}</span>
                    </td>
                    <td className="py-3 pl-3">
                      <span className="text-xs text-accent">{selected === m.code ? "Viewing ↓" : "Details →"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Country cards */}
      <section className="container py-12">
        <div className="lg:hidden mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EV_MARKETS.map((m) => (
              <MarketCard
                key={m.code}
                market={m}
                isSelected={selected === m.code}
                onSelect={() => setSelected(m.code)}
              />
            ))}
          </div>
        </div>

        <MarketDetail market={selectedMarket} />
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="glass rounded-3xl border border-border/40 p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-violet-500/5 pointer-events-none" />
          <div className="relative">
            <Snowflake className="w-8 h-8 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold tracking-tight mb-3">Ready to find your EV?</h2>
            <p className="text-muted-foreground text-sm max-w-md mx-auto mb-7">
              Use our buying advisor to find the right EV for your specific country, climate and driving habits.
            </p>
            <Link
              to={L("/ev/advisor")}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
            >
              Start the advisor →
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
