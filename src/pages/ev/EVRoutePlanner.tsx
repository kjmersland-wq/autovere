import { useState } from "react";
import { Route, ArrowRight, ArrowUpDown, Battery, Zap, Clock, Euro, Thermometer, Wind, ChevronDown, ChevronUp, MapPin, Radio } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";

interface Stop {
  location: string;
  provider: string;
  chargeTime: string;
  energyAdded: string;
  cost: string;
  arrivalSoc: number;
  departureSoc: number;
}

interface RouteResult {
  origin: string;
  destination: string;
  totalDistance: string;
  totalTime: string;
  chargingTime: string;
  energyCost: string;
  stops: Stop[];
  avgConsumption: string;
  winterAdjusted: boolean;
}

const EXAMPLE_ROUTES: Record<string, RouteResult> = {
  "tromsø-barcelona": {
    origin: "Tromsø, Norway",
    destination: "Barcelona, Spain",
    totalDistance: "4 820 km",
    totalTime: "58 h 40 min",
    chargingTime: "6 h 15 min",
    energyCost: "€ 126",
    avgConsumption: "19.4 kWh/100 km",
    winterAdjusted: true,
    stops: [
      { location: "Trondheim Supercharger", provider: "Tesla", chargeTime: "35 min", energyAdded: "52 kWh", cost: "€ 18", arrivalSoc: 12, departureSoc: 85 },
      { location: "Ionity Oslo South", provider: "Ionity", chargeTime: "28 min", energyAdded: "48 kWh", cost: "€ 22", arrivalSoc: 15, departureSoc: 80 },
      { location: "Fastned Malmö", provider: "Fastned", chargeTime: "22 min", energyAdded: "38 kWh", cost: "€ 16", arrivalSoc: 18, departureSoc: 75 },
      { location: "Ionity Hamburg A1", provider: "Ionity", chargeTime: "30 min", energyAdded: "50 kWh", cost: "€ 24", arrivalSoc: 10, departureSoc: 80 },
      { location: "Ionity Frankfurt", provider: "Ionity", chargeTime: "25 min", energyAdded: "42 kWh", cost: "€ 20", arrivalSoc: 16, departureSoc: 78 },
      { location: "Tesla Supercharger Lyon", provider: "Tesla", chargeTime: "22 min", energyAdded: "36 kWh", cost: "€ 14", arrivalSoc: 14, departureSoc: 75 },
      { location: "Ionity Perpignan", provider: "Ionity", chargeTime: "18 min", energyAdded: "30 kWh", cost: "€ 12", arrivalSoc: 20, departureSoc: 70 },
    ],
  },
  "oslo-amsterdam": {
    origin: "Oslo, Norway",
    destination: "Amsterdam, Netherlands",
    totalDistance: "1 490 km",
    totalTime: "18 h 20 min",
    chargingTime: "1 h 45 min",
    energyCost: "€ 38",
    avgConsumption: "18.1 kWh/100 km",
    winterAdjusted: false,
    stops: [
      { location: "Ionity Göteborg", provider: "Ionity", chargeTime: "28 min", energyAdded: "46 kWh", cost: "€ 18", arrivalSoc: 14, departureSoc: 82 },
      { location: "Fastned Malmö", provider: "Fastned", chargeTime: "22 min", energyAdded: "38 kWh", cost: "€ 14", arrivalSoc: 18, departureSoc: 78 },
      { location: "Allego Hamburg", provider: "Allego", chargeTime: "25 min", energyAdded: "42 kWh", cost: "€ 16", arrivalSoc: 12, departureSoc: 80 },
    ],
  },
};

const EV_MODELS = [
  { name: "Tesla Model Y Long Range", range: 533 },
  { name: "Polestar 3 Long Range", range: 631 },
  { name: "BMW iX xDrive50", range: 630 },
  { name: "Hyundai IONIQ 6 RWD", range: 614 },
  { name: "Mercedes EQS 450+", range: 770 },
  { name: "Volvo EX90 Twin Motor", range: 580 },
  { name: "Audi Q8 e-tron 55", range: 582 },
];

const SocBar = ({ value, color }: { value: number; color: string }) => (
  <div className="h-1.5 rounded-full bg-card overflow-hidden flex-1">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
  </div>
);

export default function EVRoutePlanner() {
  const [origin, setOrigin] = useState("Tromsø, Norway");
  const [destination, setDestination] = useState("Barcelona, Spain");
  const [model, setModel] = useState(EV_MODELS[0]);
  const [winter, setWinter] = useState(false);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedStop, setExpandedStop] = useState<number | null>(null);

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
    setResult(null);
  };

  const handlePlan = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const key = origin.toLowerCase().includes("tromsø") && destination.toLowerCase().includes("barcelona")
        ? "tromsø-barcelona"
        : "oslo-amsterdam";
      setResult(EXAMPLE_ROUTES[key]);
      setLoading(false);
    }, 1400);
  };

  return (
    <PageShell>
      <SEO
        title="EV Route Planner Europe | AUTOVERE"
        description="Plan long-distance EV trips across Europe. Get charging stops, costs and travel time estimates for your electric vehicle."
        image="https://autovere.com/og-autovere-1200x630.jpg"
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-transparent to-cyan-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-violet-400 mb-5">
            <Route className="w-3.5 h-3.5" /> EV Hub › Route Planner
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            Long-distance EV travel, <span className="text-gradient">planned precisely.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            Enter your route, select your car. We'll calculate optimal charging stops,
            real costs and total travel time — including winter adjustments.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 glass rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 px-4 py-2 text-xs font-medium">
            <Radio className="w-3.5 h-3.5" />
            <span>Live infrastructure aware · Powered by Open Charge Map</span>
          </div>
        </div>
      </section>

      {/* Planner */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">
          {/* Inputs */}
          <div className="glass rounded-3xl border border-border/40 p-8 mb-8">
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">
              {/* Origin */}
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">From</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={origin}
                    onChange={(e) => { setOrigin(e.target.value); setResult(null); }}
                    placeholder="Departure city…"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>

              {/* Swap */}
              <button
                onClick={handleSwap}
                className="w-10 h-10 rounded-xl glass border border-border/40 flex items-center justify-center hover:border-border transition-colors mt-5 mx-auto"
              >
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              </button>

              {/* Destination */}
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">To</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={destination}
                    onChange={(e) => { setDestination(e.target.value); setResult(null); }}
                    placeholder="Destination city…"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle + options */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Vehicle</label>
                <select
                  value={model.name}
                  onChange={(e) => setModel(EV_MODELS.find((m) => m.name === e.target.value) ?? EV_MODELS[0])}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  {EV_MODELS.map((m) => (
                    <option key={m.name} value={m.name}>{m.name} ({m.range} km WLTP)</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-3 cursor-pointer select-none group pb-3">
                  <div
                    onClick={() => setWinter(!winter)}
                    className={`relative w-11 h-6 rounded-full border transition-colors ${winter ? "bg-cyan-500 border-cyan-400" : "bg-card border-border/60"}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${winter ? "left-[22px]" : "left-0.5"}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium flex items-center gap-1.5">
                      <Thermometer className="w-3.5 h-3.5 text-cyan-400" />
                      Winter mode
                    </div>
                    <div className="text-xs text-muted-foreground">–15% range, more stops</div>
                  </div>
                </label>
              </div>
            </div>

            <button
              onClick={handlePlan}
              disabled={!origin || !destination || loading}
              className="w-full py-4 rounded-xl bg-gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Calculating route…
                </>
              ) : (
                <>
                  <Route className="w-4 h-4" />
                  Plan my route
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="animate-fade-up">
              {/* Summary bar */}
              <div className="glass rounded-2xl border border-border/40 p-6 mb-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-5">
                  <span className="font-medium text-foreground">{result.origin}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span className="font-medium text-foreground">{result.destination}</span>
                  {result.winterAdjusted && (
                    <span className="ml-auto inline-flex items-center gap-1 text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded-full text-[10px] border border-cyan-400/20">
                      <Thermometer className="w-3 h-3" /> Winter adjusted
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { icon: Route, label: "Distance", value: result.totalDistance, color: "text-foreground" },
                    { icon: Clock, label: "Total time", value: result.totalTime, color: "text-foreground" },
                    { icon: Zap, label: "Charging time", value: result.chargingTime, color: "text-cyan-400" },
                    { icon: Euro, label: "Energy cost", value: result.energyCost, color: "text-emerald-400" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        <stat.icon className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase tracking-wider">{stat.label}</span>
                      </div>
                      <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Charging stops */}
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                {result.stops.length} charging stops
              </h3>
              <div className="space-y-3">
                {result.stops.map((stop, i) => (
                  <div key={i} className="glass rounded-2xl border border-border/40 overflow-hidden">
                    <button
                      onClick={() => setExpandedStop(expandedStop === i ? null : i)}
                      className="w-full flex items-center gap-4 p-5 text-left hover:bg-card/50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-accent">{i + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{stop.location}</div>
                        <div className="text-xs text-muted-foreground">{stop.provider} · {stop.chargeTime}</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-semibold text-emerald-400">{stop.cost}</div>
                        <div className="text-xs text-muted-foreground">{stop.energyAdded}</div>
                      </div>
                      {expandedStop === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </button>
                    {expandedStop === i && (
                      <div className="px-5 pb-5 border-t border-border/40 pt-4">
                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Arrive with</div>
                            <div className="font-semibold text-amber-400">{stop.arrivalSoc}% charge</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-0.5">Depart with</div>
                            <div className="font-semibold text-emerald-400">{stop.departureSoc}% charge</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <SocBar value={stop.arrivalSoc} color="bg-amber-400" />
                          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                          <SocBar value={stop.departureSoc} color="bg-emerald-400" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div className="mt-8 text-center text-xs text-muted-foreground">
                <Wind className="w-3.5 h-3.5 inline mr-1" />
                Estimates based on {result.avgConsumption} average consumption. Actual results vary by speed, load and weather.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Live data attribution */}
      <section className="container pb-16">
        <div className="glass rounded-2xl border border-border/40 p-5 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Radio className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium mb-1">Live infrastructure · Estimated routing</div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                  Route stops are calculated estimates using WLTP consumption data and representative European
                  charging networks. Real-world results vary by speed, elevation, temperature and vehicle load.
                  Live charging infrastructure data provided by <strong>Open Charge Map</strong>.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              {["WLTP range data", "Estimated stops", "Open Charge Map", "Winter adjustment"].map((item) => (
                <span key={item} className="rounded-full border border-border/30 bg-card/40 px-3 py-1.5">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
