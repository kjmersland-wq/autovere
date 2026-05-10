import { useState } from "react";
import { Zap, Search, Filter, MapPin, Clock, ChevronRight, Wifi, CheckCircle, Circle } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";

type Provider = "All" | "Tesla" | "Ionity" | "Fastned" | "Recharge" | "Allego" | "Circle K";
type Speed = "All" | "AC" | "DC" | "HPC";
type Connector = "All" | "CCS" | "CHAdeMO" | "Type 2" | "NACS";

interface Station {
  id: number;
  name: string;
  provider: Exclude<Provider, "All">;
  location: string;
  country: string;
  maxKw: number;
  points: number;
  connectors: string[];
  speed: Exclude<Speed, "All">;
  available: number;
  total: number;
  distance: string;
}

const STATIONS: Station[] = [
  { id: 1, name: "Ionity München Nord", provider: "Ionity", location: "A9 Motorway, Munich", country: "Germany", maxKw: 350, points: 6, connectors: ["CCS"], speed: "HPC", available: 4, total: 6, distance: "2.1 km" },
  { id: 2, name: "Tesla Supercharger Oslo Sentrum", provider: "Tesla", location: "Bjørvika, Oslo", country: "Norway", maxKw: 250, points: 12, connectors: ["NACS", "CCS"], speed: "HPC", available: 8, total: 12, distance: "0.8 km" },
  { id: 3, name: "Fastned Amsterdam ArenA", provider: "Fastned", location: "Arena Boulevard, Amsterdam", country: "Netherlands", maxKw: 300, points: 8, connectors: ["CCS", "CHAdeMO", "Type 2"], speed: "HPC", available: 5, total: 8, distance: "1.4 km" },
  { id: 4, name: "Recharge Göteborg Central", provider: "Recharge", location: "Drottningtorget, Gothenburg", country: "Sweden", maxKw: 150, points: 4, connectors: ["CCS", "Type 2"], speed: "DC", available: 2, total: 4, distance: "3.2 km" },
  { id: 5, name: "Allego Brussels Airport", provider: "Allego", location: "Brussels Airport, Zaventem", country: "Belgium", maxKw: 175, points: 10, connectors: ["CCS", "CHAdeMO", "Type 2"], speed: "DC", available: 7, total: 10, distance: "5.1 km" },
  { id: 6, name: "Circle K Charge Copenhagen S", provider: "Circle K", location: "Amager, Copenhagen", country: "Denmark", maxKw: 50, points: 2, connectors: ["CCS", "Type 2"], speed: "AC", available: 1, total: 2, distance: "4.7 km" },
  { id: 7, name: "Ionity Paris Bercy", provider: "Ionity", location: "Cours Saint-Emilion, Paris", country: "France", maxKw: 350, points: 8, connectors: ["CCS"], speed: "HPC", available: 6, total: 8, distance: "1.9 km" },
  { id: 8, name: "Tesla Supercharger Stockholm", provider: "Tesla", location: "Kungens Kurva, Stockholm", country: "Sweden", maxKw: 250, points: 16, connectors: ["NACS", "CCS"], speed: "HPC", available: 11, total: 16, distance: "7.3 km" },
  { id: 9, name: "Fastned Hamburg Süd", provider: "Fastned", location: "A7 Motorway, Hamburg", country: "Germany", maxKw: 300, points: 6, connectors: ["CCS", "CHAdeMO", "Type 2"], speed: "HPC", available: 3, total: 6, distance: "8.2 km" },
  { id: 10, name: "Recharge Malmö City", provider: "Recharge", location: "Stortorget, Malmö", country: "Sweden", maxKw: 150, points: 4, connectors: ["CCS", "Type 2"], speed: "DC", available: 4, total: 4, distance: "2.6 km" },
];

const PROVIDER_COLORS: Record<Exclude<Provider, "All">, string> = {
  Tesla: "text-red-400 bg-red-400/10 border-red-400/20",
  Ionity: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Fastned: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  Recharge: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  Allego: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  "Circle K": "text-orange-400 bg-orange-400/10 border-orange-400/20",
};

const SPEED_LABELS: Record<Exclude<Speed, "All">, { label: string; color: string }> = {
  HPC: { label: "Ultra Fast", color: "text-cyan-400" },
  DC: { label: "Fast", color: "text-emerald-400" },
  AC: { label: "Standard", color: "text-amber-400" },
};

const PROVIDERS: Provider[] = ["All", "Tesla", "Ionity", "Fastned", "Recharge", "Allego", "Circle K"];
const SPEEDS: Speed[] = ["All", "HPC", "DC", "AC"];
const CONNECTORS: Connector[] = ["All", "CCS", "CHAdeMO", "Type 2", "NACS"];

export default function EVCharging() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState<Provider>("All");
  const [speed, setSpeed] = useState<Speed>("All");
  const [connector, setConnector] = useState<Connector>("All");

  const filtered = STATIONS.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.location.toLowerCase().includes(q) || s.country.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
    const matchProvider = provider === "All" || s.provider === provider;
    const matchSpeed = speed === "All" || s.speed === speed;
    const matchConnector = connector === "All" || s.connectors.includes(connector);
    return matchSearch && matchProvider && matchSpeed && matchConnector;
  });

  return (
    <PageShell>
      <SEO
        title="EV Charging Map Europe | AUTOVERE"
        description="Find Tesla Superchargers, Ionity, Fastned and all major EV charging networks across Europe. Filter by speed, connector and provider."
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-transparent to-blue-950/30 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> EV Hub › Charging
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            Find your next charge <span className="text-gradient">across Europe.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            All major networks in one place. Filter by speed, connector and provider.
            Live API integration coming soon — currently showing representative data.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container py-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by city or country…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            {/* Speed */}
            <div className="flex gap-1.5 flex-wrap">
              {SPEEDS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${speed === s ? "bg-primary text-primary-foreground border-primary" : "glass border-border/40 text-muted-foreground hover:text-foreground"}`}
                >
                  {s === "HPC" ? "Ultra Fast" : s === "All" ? "All speeds" : s}
                </button>
              ))}
            </div>
          </div>
          {/* Provider + connector row */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {PROVIDERS.map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${provider === p ? "bg-primary/20 border-primary/50 text-primary" : "glass border-border/30 text-muted-foreground hover:text-foreground"}`}
              >
                {p === "All" ? "All providers" : p}
              </button>
            ))}
            <div className="w-px bg-border/40 mx-1 hidden sm:block" />
            {CONNECTORS.map((c) => (
              <button
                key={c}
                onClick={() => setConnector(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${connector === c ? "bg-accent/20 border-accent/50 text-accent" : "glass border-border/30 text-muted-foreground hover:text-foreground"}`}
              >
                {c === "All" ? "All connectors" : c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <p className="text-sm text-muted-foreground">
            <span className="text-foreground font-medium">{filtered.length}</span> stations found
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="w-3.5 h-3.5" />
            Sorted by distance
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((station) => {
            const availRatio = station.available / station.total;
            const speedInfo = SPEED_LABELS[station.speed];
            return (
              <div key={station.id} className="glass rounded-2xl border border-border/40 p-6 hover:border-border/80 transition-colors group">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border mb-2 ${PROVIDER_COLORS[station.provider]}`}>
                      {station.provider}
                    </span>
                    <h3 className="font-semibold text-sm leading-snug truncate">{station.name}</h3>
                  </div>
                  <div className="text-right ml-3 flex-shrink-0">
                    <div className="text-xl font-bold text-gradient">{station.maxKw}</div>
                    <div className="text-[10px] text-muted-foreground">kW max</div>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{station.location}</span>
                  <span className="ml-auto flex-shrink-0 text-accent">{station.distance}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded bg-card ${speedInfo.color}`}>
                    {speedInfo.label}
                  </span>
                  {station.connectors.map((c) => (
                    <span key={c} className="text-[10px] px-2 py-0.5 rounded bg-card text-muted-foreground border border-border/40">
                      {c}
                    </span>
                  ))}
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {availRatio > 0.5 ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : availRatio > 0 ? (
                      <Circle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      {station.available}/{station.total} available
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Wifi className="w-3 h-3" />
                    {station.points} points
                  </div>
                </div>

                {/* Availability bar */}
                <div className="mt-3 h-1 rounded-full bg-card overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${availRatio > 0.5 ? "bg-emerald-400" : availRatio > 0 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${(availRatio * 100).toFixed(0)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Zap className="w-10 h-10 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-1">No stations match your filters.</p>
            <p className="text-sm">Try adjusting the provider, speed or connector filters.</p>
          </div>
        )}

        {/* API notice */}
        <div className="mt-16 glass rounded-2xl border border-border/40 p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-accent mb-2">
            <Wifi className="w-4 h-4" />
            <span className="text-sm font-medium">Live data integration</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            This module displays representative charging data. Live integration with Open Charge Map,
            PlugShare and provider APIs is in development.
          </p>
        </div>
      </section>
    </PageShell>
  );
}
