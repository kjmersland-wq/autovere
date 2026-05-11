import { useEffect, useMemo, useState } from "react";
import {
  Zap,
  Search,
  Filter,
  MapPin,
  Wifi,
  CheckCircle,
  Circle,
  Layers3,
  Sparkles,
  Navigation,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import {
  CHARGING_INTEGRATION_READY,
  CHARGING_PROVIDER_META,
  EV_CHARGING_DEMO_STATIONS,
  type ChargingConnector,
  type ChargingProvider,
  type ChargingSpeed,
  type ChargingStation,
} from "@/data/ev-charging";

type ProviderFilter = "All" | ChargingProvider;
type SpeedFilter = "All" | ChargingSpeed;
type ConnectorFilter = "All" | ChargingConnector;

const SPEED_LABELS: Record<ChargingSpeed, { label: string; color: string }> = {
  HPC: { label: "Ultra fast", color: "text-cyan-400" },
  DC: { label: "Fast charge", color: "text-emerald-400" },
  AC: { label: "Destination", color: "text-amber-400" },
};

const PROVIDERS: ProviderFilter[] = ["All", ...Object.keys(CHARGING_PROVIDER_META) as ChargingProvider[]];
const SPEEDS: SpeedFilter[] = ["All", "HPC", "DC", "AC"];
const CONNECTORS: ConnectorFilter[] = ["All", "CCS", "CHAdeMO", "Type 2", "NACS"];

const NORWAY_LAT = { min: 58.4, max: 63.8 };
const NORWAY_LNG = { min: 5.0, max: 11.4 };

const calculateStationMapPosition = (station: ChargingStation) => {
  const left = ((station.coordinates.lng - NORWAY_LNG.min) / (NORWAY_LNG.max - NORWAY_LNG.min)) * 100;
  const top = 100 - ((station.coordinates.lat - NORWAY_LAT.min) / (NORWAY_LAT.max - NORWAY_LAT.min)) * 100;
  return {
    left: `${Math.max(8, Math.min(92, left))}%`,
    top: `${Math.max(10, Math.min(90, top))}%`,
  };
};

function StationMapPreview({
  stations,
  selectedId,
  onSelect,
}: {
  stations: ChargingStation[];
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  return (
    <div className="glass rounded-3xl border border-border/40 overflow-hidden">
      <div className="p-6 border-b border-border/30">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-cyan-400 mb-3">
          <Layers3 className="w-3.5 h-3.5" />
          Map architecture preview
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Live infrastructure integration coming soon.</h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Current view uses representative demo data, but the page architecture is ready for Google Maps, OpenChargeMap,
          NOBIL, provider filters, clustering, and expandable station detail cards.
        </p>
      </div>

      <div className="relative aspect-[16/11] overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/70">
        <div className="absolute inset-0 opacity-[0.08] grid-bg" />
        <div className="absolute inset-y-[8%] left-[18%] w-px bg-gradient-to-b from-transparent via-cyan-400/70 to-transparent" />
        <div className="absolute inset-y-[14%] left-[48%] w-px bg-gradient-to-b from-transparent via-cyan-300/40 to-transparent" />
        <div className="absolute left-[20%] right-[22%] top-[34%] h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
        <div className="absolute left-[28%] right-[28%] top-[62%] h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent" />
        <div className="absolute top-[16%] left-[10%] rounded-full bg-cyan-500/10 blur-3xl w-28 h-28" />
        <div className="absolute bottom-[12%] right-[14%] rounded-full bg-violet-500/10 blur-3xl w-32 h-32" />

        {stations.map((station) => {
          const meta = CHARGING_PROVIDER_META[station.provider];
          const position = calculateStationMapPosition(station);
          const selected = station.id === selectedId;
          return (
            <button
              key={station.id}
              onClick={() => onSelect(station.id)}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-left"
              style={position}
              aria-label={`Select ${station.name}`}
            >
              <span
                className={`relative flex items-center justify-center rounded-full border transition-all duration-300 ${
                  selected
                    ? `w-5 h-5 ${meta.badgeClass} shadow-glow`
                    : `w-4 h-4 ${meta.badgeClass}`
                }`}
              >
                <span className={`absolute inset-0 rounded-full bg-gradient-to-br ${meta.tintClass} opacity-90`} />
                <span className="relative w-1.5 h-1.5 rounded-full bg-current" />
              </span>
              {selected && (
                <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border/40 bg-background/85 px-2 py-1 text-[10px] font-medium text-foreground backdrop-blur-sm">
                  {station.city}
                </span>
              )}
            </button>
          );
        })}

        <div className="absolute left-4 bottom-4 rounded-2xl border border-border/40 bg-background/70 px-4 py-3 backdrop-blur-md">
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">Focus</div>
          <div className="text-sm font-medium">Norway charging realism</div>
          <div className="text-xs text-muted-foreground mt-1">Oslo · Bergen · Trondheim · Stavanger · E6 corridor</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 p-5 border-t border-border/30">
        {CHARGING_INTEGRATION_READY.map((item) => (
          <div key={item.title} className="rounded-2xl border border-border/30 bg-card/40 p-4">
            <div className="text-xs font-medium text-foreground mb-2">{item.title}</div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function StationDetail({
  station,
}: {
  station: ChargingStation;
}) {
  const meta = CHARGING_PROVIDER_META[station.provider];
  const availabilityRatio = station.available / station.total;

  return (
    <div className="glass rounded-3xl border border-border/40 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${meta.badgeClass}`}>
            {station.provider}
          </span>
          <h3 className="text-2xl font-bold tracking-tight mt-3">{station.name}</h3>
          <p className="text-sm text-muted-foreground mt-2">
            {station.location} · {station.city}, {station.country}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-gradient">{station.maxKw} kW</div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mt-1">Peak charging</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">
        {[
          { label: "Corridor", value: station.corridor },
          { label: "Points", value: `${station.points} chargers` },
          { label: "Availability", value: `${station.available}/${station.total} live` },
          { label: "Pricing", value: station.pricingHint },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/30 bg-card/40 p-4">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{item.label}</div>
            <div className="text-sm font-medium leading-snug">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_240px] gap-5">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {station.connectors.map((connector) => (
              <span key={connector} className="rounded-full border border-border/40 bg-card/50 px-3 py-1 text-[11px] text-muted-foreground">
                {connector}
              </span>
            ))}
            {station.amenities.map((amenity) => (
              <span key={amenity} className="rounded-full border border-border/40 bg-card/50 px-3 py-1 text-[11px] text-muted-foreground">
                {amenity}
              </span>
            ))}
          </div>
          <div className="rounded-2xl border border-border/30 bg-card/35 p-4">
            <div className="flex items-center gap-2 text-xs font-medium mb-3">
              {availabilityRatio > 0.5 ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-amber-400" />
              )}
              Live availability snapshot
            </div>
            <div className="h-1.5 rounded-full bg-background/70 overflow-hidden mb-3">
              <div
                className={`h-full rounded-full ${availabilityRatio > 0.5 ? "bg-emerald-400" : "bg-amber-400"}`}
                style={{ width: `${Math.max(8, availabilityRatio * 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This card is already structured for future live status refreshes, roaming pricing overlays and provider-specific connector availability.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/30 bg-card/35 p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-3">Source mapping</div>
          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center justify-between gap-3">
              <span>Google Maps</span>
              <span className="text-foreground">{station.sourceIds?.googlePlace ? "Ready" : "Pending"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>OpenChargeMap</span>
              <span className="text-foreground">{station.sourceIds?.openChargeMap ?? "Pending"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>NOBIL</span>
              <span className="text-foreground">{station.sourceIds?.nobil ?? "Pending"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EVCharging() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState<ProviderFilter>("All");
  const [speed, setSpeed] = useState<SpeedFilter>("All");
  const [connector, setConnector] = useState<ConnectorFilter>("All");
  const [selectedId, setSelectedId] = useState(EV_CHARGING_DEMO_STATIONS[0]?.id ?? 0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return EV_CHARGING_DEMO_STATIONS.filter((station) => {
      const matchesSearch =
        !q ||
        station.name.toLowerCase().includes(q) ||
        station.city.toLowerCase().includes(q) ||
        station.region.toLowerCase().includes(q) ||
        station.corridor.toLowerCase().includes(q) ||
        station.provider.toLowerCase().includes(q);

      return (
        matchesSearch &&
        (provider === "All" || station.provider === provider) &&
        (speed === "All" || station.speed === speed) &&
        (connector === "All" || station.connectors.includes(connector))
      );
    });
  }, [connector, provider, search, speed]);

  useEffect(() => {
    if (!filtered.length) return;
    if (!filtered.some((station) => station.id === selectedId)) {
      setSelectedId(filtered[0].id);
    }
  }, [filtered, selectedId]);

  const selectedStation = filtered.find((station) => station.id === selectedId) ?? filtered[0];
  const providerCount = new Set(filtered.map((station) => station.provider)).size;
  const corridorCount = new Set(filtered.map((station) => station.corridor)).size;

  return (
    <PageShell>
      <SEO
        title="EV Charging Map Europe | AUTOVERE"
        description="Find Tesla Superchargers, Ionity, Fastned and all major EV charging networks across Europe. Filter by speed, connector and provider."
        image="https://autovere.com/og-autovere-1200x630.jpg"
      />

      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-transparent to-blue-950/30 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> EV Hub › Charging
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              Charging coverage with <span className="text-gradient">real corridor logic.</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              Norway-first demo data with a more believable mix of Tesla, Ionity, Recharge, Circle K, Eviny, Uno-X,
              Mer, Kople and Fastned. Structured now for future live infrastructure integrations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              `${EV_CHARGING_DEMO_STATIONS.length} demo stations`,
              `${Object.keys(CHARGING_PROVIDER_META).length} representative providers`,
              "Oslo · Bergen · Trondheim · Stavanger · E6 corridor",
            ].map((item) => (
              <span key={item} className="glass rounded-full border border-border/40 px-4 py-2 text-xs text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="sticky top-36 z-30 border-y border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container py-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search city, corridor or provider…"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border/50 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
                {SPEEDS.map((value) => (
                  <button
                    key={value}
                    onClick={() => setSpeed(value)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex-shrink-0 ${
                      speed === value
                        ? "bg-primary text-primary-foreground border-primary"
                        : "glass border-border/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {value === "All" ? "All speeds" : SPEED_LABELS[value].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PROVIDERS.map((value) => (
                <button
                  key={value}
                  onClick={() => setProvider(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    provider === value
                      ? "bg-primary/20 border-primary/50 text-primary"
                      : "glass border-border/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {value === "All" ? "All providers" : value}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-muted-foreground pr-2">
                <Filter className="w-3.5 h-3.5" /> Connectors
              </span>
              {CONNECTORS.map((value) => (
                <button
                  key={value}
                  onClick={() => setConnector(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    connector === value
                      ? "bg-accent/20 border-accent/50 text-accent"
                      : "glass border-border/30 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {value === "All" ? "All connectors" : value}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-10 space-y-8">
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
          <StationMapPreview stations={filtered.slice(0, 16)} selectedId={selectedId} onSelect={setSelectedId} />
          {selectedStation ? (
            <StationDetail station={selectedStation} />
          ) : (
            <div className="glass rounded-3xl border border-border/40 p-8 text-center text-muted-foreground">
              Adjust your filters to continue.
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent mb-2">Station results</p>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Norway-first representative charging view.</h2>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="glass rounded-full border border-border/30 px-3 py-1.5">
              <span className="text-foreground font-medium">{filtered.length}</span> stations
            </span>
            <span className="glass rounded-full border border-border/30 px-3 py-1.5">
              <span className="text-foreground font-medium">{providerCount}</span> providers
            </span>
            <span className="glass rounded-full border border-border/30 px-3 py-1.5">
              <span className="text-foreground font-medium">{corridorCount}</span> corridors
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((station) => {
            const speedInfo = SPEED_LABELS[station.speed];
            const meta = CHARGING_PROVIDER_META[station.provider];
            const availabilityRatio = station.available / station.total;
            const active = station.id === selectedId;

            return (
              <button
                key={station.id}
                onClick={() => setSelectedId(station.id)}
                className={`group text-left glass rounded-2xl border p-6 transition-all duration-300 ${
                  active
                    ? "border-cyan-400/40 bg-card/70 shadow-soft"
                    : "border-border/40 hover:border-border/80"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium border mb-2 ${meta.badgeClass}`}>
                      {station.provider}
                    </span>
                    <h3 className="font-semibold text-sm leading-snug">{station.name}</h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-bold text-gradient">{station.maxKw}</div>
                    <div className="text-[10px] text-muted-foreground">kW max</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{station.location}</span>
                  <span className="ml-auto flex-shrink-0 text-accent">{station.distance}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded bg-card ${speedInfo.color}`}>
                    {speedInfo.label}
                  </span>
                  {station.connectors.map((item) => (
                    <span key={item} className="text-[10px] px-2 py-0.5 rounded bg-card text-muted-foreground border border-border/40">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs mb-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {availabilityRatio > 0.5 ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : availabilityRatio > 0 ? (
                      <Circle className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 text-red-400" />
                    )}
                    <span>{station.available}/{station.total} available</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Wifi className="w-3 h-3" />
                    {station.points} points
                  </div>
                </div>

                <div className="h-1 rounded-full bg-card overflow-hidden mb-4">
                  <div
                    className={`h-full rounded-full transition-all ${availabilityRatio > 0.5 ? "bg-emerald-400" : availabilityRatio > 0 ? "bg-amber-400" : "bg-red-400"}`}
                    style={{ width: `${Math.max(8, availabilityRatio * 100)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">{station.pricingHint}</span>
                  <span className="inline-flex items-center gap-1 text-accent font-medium">
                    Expand detail <Navigation className="w-3 h-3" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {!filtered.length && (
          <div className="text-center py-20 text-muted-foreground">
            <Zap className="w-10 h-10 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-1">No stations match your filters.</p>
            <p className="text-sm">Try another provider, connector or corridor search.</p>
          </div>
        )}

        <div className="glass rounded-2xl border border-border/40 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-accent mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Future live infrastructure layer</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                Next phase will connect the same UI to Google Maps rendering, OpenChargeMap coverage, NOBIL for Norway,
                provider-side status feeds, clustering and richer live detail overlays — no scraping.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              {["Google Maps", "OpenChargeMap", "NOBIL", "Provider filters", "Clustering", "Expandable detail cards"].map((item) => (
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
