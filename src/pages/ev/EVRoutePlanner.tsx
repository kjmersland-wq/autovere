import { useState } from "react";
import { Route, ArrowRight, ArrowUpDown, Zap, Clock, Euro, Thermometer, Wind, ChevronDown, ChevronUp, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
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
      { location: "Ionity Göteborg North", provider: "Ionity", chargeTime: "28 min", energyAdded: "46 kWh", cost: "€ 16", arrivalSoc: 14, departureSoc: 82 },
      { location: "Fastned Malmö Central", provider: "Fastned", chargeTime: "22 min", energyAdded: "38 kWh", cost: "€ 14", arrivalSoc: 18, departureSoc: 78 },
      { location: "Allego Hamburg Stellingen", provider: "Allego", chargeTime: "25 min", energyAdded: "42 kWh", cost: "€ 16", arrivalSoc: 12, departureSoc: 80 },
    ],
  },
  "paris-milan": {
    origin: "Paris, France",
    destination: "Milan, Italy",
    totalDistance: "850 km",
    totalTime: "9 h 35 min",
    chargingTime: "55 min",
    energyCost: "€ 22",
    avgConsumption: "18.8 kWh/100 km",
    winterAdjusted: false,
    stops: [
      { location: "Ionity Beaune A6", provider: "Ionity", chargeTime: "28 min", energyAdded: "44 kWh", cost: "€ 12", arrivalSoc: 16, departureSoc: 80 },
      { location: "Tesla Supercharger Chambéry", provider: "Tesla", chargeTime: "27 min", energyAdded: "40 kWh", cost: "€ 10", arrivalSoc: 14, departureSoc: 78 },
    ],
  },
  "berlin-prague": {
    origin: "Berlin, Germany",
    destination: "Prague, Czech Republic",
    totalDistance: "355 km",
    totalTime: "4 h 10 min",
    chargingTime: "26 min",
    energyCost: "€ 8",
    avgConsumption: "17.2 kWh/100 km",
    winterAdjusted: false,
    stops: [
      { location: "Ionity Dresden Süd A17", provider: "Ionity", chargeTime: "26 min", energyAdded: "32 kWh", cost: "€ 8", arrivalSoc: 24, departureSoc: 82 },
    ],
  },
  "barcelona-nice": {
    origin: "Barcelona, Spain",
    destination: "Nice, France",
    totalDistance: "690 km",
    totalTime: "7 h 50 min",
    chargingTime: "52 min",
    energyCost: "€ 16",
    avgConsumption: "18.6 kWh/100 km",
    winterAdjusted: false,
    stops: [
      { location: "Ionity Perpignan A9", provider: "Ionity", chargeTime: "26 min", energyAdded: "40 kWh", cost: "€ 8", arrivalSoc: 18, departureSoc: 80 },
      { location: "Tesla Supercharger Marseille", provider: "Tesla", chargeTime: "26 min", energyAdded: "38 kWh", cost: "€ 8", arrivalSoc: 17, departureSoc: 78 },
    ],
  },
  "warsaw-vienna": {
    origin: "Warsaw, Poland",
    destination: "Vienna, Austria",
    totalDistance: "640 km",
    totalTime: "7 h 25 min",
    chargingTime: "48 min",
    energyCost: "€ 14",
    avgConsumption: "17.9 kWh/100 km",
    winterAdjusted: false,
    stops: [
      { location: "GreenWay Kraków North", provider: "GreenWay", chargeTime: "26 min", energyAdded: "42 kWh", cost: "€ 8", arrivalSoc: 20, departureSoc: 82 },
      { location: "Ionity Brno D1", provider: "Ionity", chargeTime: "22 min", energyAdded: "34 kWh", cost: "€ 6", arrivalSoc: 24, departureSoc: 78 },
    ],
  },
  "munich-copenhagen": {
    origin: "Munich, Germany",
    destination: "Copenhagen, Denmark",
    totalDistance: "870 km",
    totalTime: "9 h 55 min",
    chargingTime: "58 min",
    energyCost: "€ 21",
    avgConsumption: "18.3 kWh/100 km",
    winterAdjusted: false,
    stops: [
      { location: "Ionity Hamburg A1 Nord", provider: "Ionity", chargeTime: "30 min", energyAdded: "48 kWh", cost: "€ 11", arrivalSoc: 12, departureSoc: 82 },
      { location: "Fastned Padborg A7", provider: "Fastned", chargeTime: "28 min", energyAdded: "44 kWh", cost: "€ 10", arrivalSoc: 16, departureSoc: 80 },
    ],
  },
  "lisbon-madrid": {
    origin: "Lisbon, Portugal",
    destination: "Madrid, Spain",
    totalDistance: "640 km",
    totalTime: "7 h 10 min",
    chargingTime: "44 min",
    energyCost: "€ 13",
    avgConsumption: "18.0 kWh/100 km",
    winterAdjusted: false,
    stops: [
      { location: "Ionity Badajoz A5", provider: "Ionity", chargeTime: "26 min", energyAdded: "40 kWh", cost: "€ 7", arrivalSoc: 18, departureSoc: 80 },
      { location: "Tesla Supercharger Mérida", provider: "Tesla", chargeTime: "18 min", energyAdded: "28 kWh", cost: "€ 6", arrivalSoc: 28, departureSoc: 75 },
    ],
  },
  "rome-zurich": {
    origin: "Rome, Italy",
    destination: "Zurich, Switzerland",
    totalDistance: "940 km",
    totalTime: "10 h 25 min",
    chargingTime: "1 h 14 min",
    energyCost: "€ 26",
    avgConsumption: "19.1 kWh/100 km",
    winterAdjusted: false,
    stops: [
      { location: "Ionity Florence Nord A1", provider: "Ionity", chargeTime: "26 min", energyAdded: "40 kWh", cost: "€ 9", arrivalSoc: 16, departureSoc: 80 },
      { location: "Tesla Supercharger Milano Ovest", provider: "Tesla", chargeTime: "24 min", energyAdded: "36 kWh", cost: "€ 8", arrivalSoc: 18, departureSoc: 78 },
      { location: "Ionity Bellinzona A2", provider: "Ionity", chargeTime: "24 min", energyAdded: "30 kWh", cost: "€ 9", arrivalSoc: 22, departureSoc: 76 },
    ],
  },
};

const ROUTE_CHIPS = [
  { region: "Northern", origin: "Oslo, Norway", destination: "Amsterdam, Netherlands", key: "oslo-amsterdam" },
  { region: "Western", origin: "Paris, France", destination: "Milan, Italy", key: "paris-milan" },
  { region: "Central", origin: "Berlin, Germany", destination: "Prague, Czech Republic", key: "berlin-prague" },
  { region: "Southern", origin: "Barcelona, Spain", destination: "Nice, France", key: "barcelona-nice" },
  { region: "Eastern", origin: "Warsaw, Poland", destination: "Vienna, Austria", key: "warsaw-vienna" },
  { region: "Cross", origin: "Munich, Germany", destination: "Copenhagen, Denmark", key: "munich-copenhagen" },
  { region: "Iberian", origin: "Lisbon, Portugal", destination: "Madrid, Spain", key: "lisbon-madrid" },
  { region: "Alpine", origin: "Rome, Italy", destination: "Zurich, Switzerland", key: "rome-zurich" },
] as const;

const EV_MODELS = [
  { name: "Tesla Model Y Long Range", range: 533 },
  { name: "Polestar 3 Long Range", range: 631 },
  { name: "BMW iX xDrive50", range: 630 },
  { name: "Hyundai IONIQ 6 RWD", range: 614 },
  { name: "Mercedes EQS 450+", range: 770 },
  { name: "Volvo EX90 Twin Motor", range: 580 },
  { name: "Audi Q8 e-tron 55", range: 582 },
];

const PROVIDER_COLORS: Record<string, string> = {
  Tesla: "text-red-400 bg-red-400/10 border-red-400/20",
  Ionity: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Fastned: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  Allego: "text-violet-400 bg-violet-400/10 border-violet-400/20",
  GreenWay: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
};

const SocBar = ({ value, color }: { value: number; color: string }) => (
  <div className="h-1.5 rounded-full bg-card overflow-hidden flex-1">
    <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
  </div>
);

function findRoute(orig: string, dest: string): RouteResult {
  const normOrig = orig.toLowerCase().split(",")[0].trim();
  const normDest = dest.toLowerCase().split(",")[0].trim();
  const match = Object.values(EXAMPLE_ROUTES).find(
    (r) =>
      r.origin.toLowerCase().includes(normOrig) &&
      r.destination.toLowerCase().includes(normDest),
  );
  if (match) return match;
  const all = Object.values(EXAMPLE_ROUTES);
  return all[Math.floor(Math.random() * all.length)];
}

export default function EVRoutePlanner() {
  const { t } = useTranslation();
  const [origin, setOrigin] = useState("Oslo, Norway");
  const [destination, setDestination] = useState("Amsterdam, Netherlands");
  const [model, setModel] = useState(EV_MODELS[0]);
  const [winter, setWinter] = useState(false);
  const [result, setResult] = useState<RouteResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedStop, setExpandedStop] = useState<number | null>(null);
  const [activeChip, setActiveChip] = useState<string | null>("oslo-amsterdam");

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
    setResult(null);
    setActiveChip(null);
  };

  const handlePlan = () => {
    setLoading(true);
    setResult(null);
    setExpandedStop(null);
    setTimeout(() => {
      setResult(findRoute(origin, destination));
      setLoading(false);
    }, 1200);
  };

  const handleChipSelect = (chip: (typeof ROUTE_CHIPS)[number]) => {
    setOrigin(chip.origin);
    setDestination(chip.destination);
    setActiveChip(chip.key);
    setExpandedStop(null);
    setResult(EXAMPLE_ROUTES[chip.key]);
  };

  return (
    <PageShell>
      <SEO
        title={t("ev.planner.seo_title")}
        description={t("ev.planner.seo_desc")}
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/50 via-transparent to-cyan-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-violet-400 mb-5">
            <Route className="w-3.5 h-3.5" /> {t("ev.planner.eyebrow")}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            {t("ev.planner.title")} <span className="text-gradient">{t("ev.planner.title_b")}</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            {t("ev.planner.subtitle")}
          </p>
        </div>
      </section>

      {/* Planner */}
      <section className="container py-16">
        <div className="max-w-4xl mx-auto">

          {/* Quick-select chips */}
          <div className="mb-6">
            <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
              {t("ev.planner.popular_routes")}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {ROUTE_CHIPS.map((chip) => {
                const isActive = activeChip === chip.key;
                const [fromCity] = chip.origin.split(",");
                const [toCity] = chip.destination.split(",");
                return (
                  <button
                    key={chip.key}
                    onClick={() => handleChipSelect(chip)}
                    className={`flex-shrink-0 group px-4 py-2.5 rounded-xl border text-left transition-all ${
                      isActive
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-border/40 bg-card/40 text-muted-foreground hover:border-border/70 hover:text-foreground hover:bg-card/60"
                    }`}
                  >
                    <div className={`text-[9px] font-semibold uppercase tracking-[0.2em] mb-0.5 ${isActive ? "text-primary" : "text-muted-foreground/50 group-hover:text-muted-foreground"}`}>
                      {chip.region}
                    </div>
                    <div className="text-xs font-medium whitespace-nowrap flex items-center gap-1">
                      {fromCity}
                      <ArrowRight className="w-2.5 h-2.5 opacity-50" />
                      {toCity}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Inputs */}
          <div className="glass rounded-3xl border border-border/40 p-8 mb-8">
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center mb-6">
              {/* Origin */}
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{t("ev.planner.from")}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={origin}
                    onChange={(e) => { setOrigin(e.target.value); setResult(null); setActiveChip(null); }}
                    placeholder={t("ev.planner.from_placeholder")}
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
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{t("ev.planner.to")}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={destination}
                    onChange={(e) => { setDestination(e.target.value); setResult(null); setActiveChip(null); }}
                    placeholder={t("ev.planner.to_placeholder")}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle + options */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{t("ev.planner.vehicle")}</label>
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
                      {t("ev.planner.winter_mode")}
                    </div>
                    <div className="text-xs text-muted-foreground">{t("ev.planner.winter_hint")}</div>
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
                  {t("ev.planner.planning")}
                </>
              ) : (
                <>
                  <Route className="w-4 h-4" />
                  {t("ev.planner.plan_btn")}
                </>
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="animate-fade-up space-y-6">

              {/* Route summary card */}
              <div className="glass rounded-2xl border border-border/40 overflow-hidden">
                {/* Route header */}
                <div className="px-7 pt-7 pb-6 border-b border-border/30">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl font-bold tracking-tight">{result.origin}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xl font-bold tracking-tight">{result.destination}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">{result.totalDistance} · {model.name}</div>
                    </div>
                    {result.winterAdjusted && (
                      <span className="flex-shrink-0 inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-400/10 px-3 py-1.5 rounded-full text-xs border border-cyan-400/20">
                        <Thermometer className="w-3 h-3" /> {t("ev.planner.winter_adjusted")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-border/30">
                  {[
                    { icon: Route, label: t("ev.planner.distance"), value: result.totalDistance, color: "text-foreground", sub: null },
                    { icon: Clock, label: t("ev.planner.total_time"), value: result.totalTime, color: "text-foreground", sub: null },
                    { icon: Zap, label: t("ev.planner.charging_time"), value: result.chargingTime, color: "text-cyan-400", sub: `${result.stops.length} stops` },
                    { icon: Euro, label: t("ev.planner.energy_cost"), value: result.energyCost, color: "text-emerald-400", sub: result.avgConsumption },
                  ].map((stat) => (
                    <div key={stat.label} className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-2">
                        <stat.icon className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase tracking-wider font-medium">{stat.label}</span>
                      </div>
                      <div className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</div>
                      {stat.sub && <div className="text-[11px] text-muted-foreground mt-0.5">{stat.sub}</div>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Charging stops */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("ev.planner.stops", { n: result.stops.length })}
                  </h3>
                  <div className="h-px flex-1 mx-4 bg-border/30" />
                </div>

                <div className="space-y-2.5">
                  {result.stops.map((stop, i) => (
                    <div key={i} className="glass rounded-2xl border border-border/40 overflow-hidden">
                      <button
                        onClick={() => setExpandedStop(expandedStop === i ? null : i)}
                        className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-card/40 transition-colors"
                      >
                        {/* Stop number */}
                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[11px] font-bold text-accent">{i + 1}</span>
                        </div>

                        {/* Location + provider */}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate mb-1">{stop.location}</div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${PROVIDER_COLORS[stop.provider] ?? "text-muted-foreground bg-muted/20 border-border/30"}`}>
                              {stop.provider}
                            </span>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Zap className="w-3 h-3" />
                              {stop.chargeTime}
                            </span>
                          </div>
                        </div>

                        {/* Cost + energy */}
                        <div className="text-right flex-shrink-0 mr-1">
                          <div className="text-base font-bold text-emerald-400">{stop.cost}</div>
                          <div className="text-[11px] text-muted-foreground">{stop.energyAdded}</div>
                        </div>

                        {expandedStop === i
                          ? <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          : <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                      </button>

                      {expandedStop === i && (
                        <div className="px-6 pb-5 border-t border-border/30 pt-4">
                          <div className="grid grid-cols-2 gap-6 mb-4">
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("ev.planner.arrive_with")}</div>
                              <div className="text-lg font-bold text-amber-400">{t("ev.planner.charge", { n: stop.arrivalSoc })}</div>
                            </div>
                            <div>
                              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{t("ev.planner.depart_with")}</div>
                              <div className="text-lg font-bold text-emerald-400">{t("ev.planner.charge", { n: stop.departureSoc })}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <SocBar value={stop.arrivalSoc} color="bg-amber-400" />
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            <SocBar value={stop.departureSoc} color="bg-emerald-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer note */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2 pb-4">
                <Wind className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{t("ev.planner.estimate_note", { consumption: result.avgConsumption })}</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}
