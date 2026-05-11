import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Zap,
  Search,
  Filter,
  MapPin,
  Wifi,
  CheckCircle,
  Circle,
  Radio,
  Globe,
  ChevronRight,
  ChevronLeft,
  Navigation,
  AlertCircle,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import {
  CHARGING_PROVIDER_META,
  EV_CHARGING_DEMO_STATIONS,
  type ChargingConnector,
  type ChargingProvider,
  type ChargingSpeed,
  type ChargingStation,
} from "@/data/ev-charging";
import { EUROPE_COUNTRIES } from "@/lib/ocm";
import { useOCMCharging } from "@/hooks/useOCMCharging";
import { GoogleChargingMap } from "@/components/ev/GoogleChargingMap";

type ProviderFilter = "All" | ChargingProvider;
type SpeedFilter = "All" | ChargingSpeed;
type ConnectorFilter = "All" | ChargingConnector;

const SPEED_LABELS: Record<ChargingSpeed, { label: string; color: string }> = {
  HPC: { label: "Ultra fast", color: "text-cyan-400" },
  DC: { label: "Fast charge", color: "text-emerald-400" },
  AC: { label: "Destination", color: "text-amber-400" },
};

const PROVIDERS: ProviderFilter[] = ["All", ...(Object.keys(CHARGING_PROVIDER_META) as ChargingProvider[])];
const SPEEDS: SpeedFilter[] = ["All", "HPC", "DC", "AC"];
const CONNECTORS: ConnectorFilter[] = ["All", "CCS", "CHAdeMO", "Type 2", "NACS"];

// ── Loading skeleton ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="glass rounded-2xl border border-border/30 p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="h-4 w-16 bg-card rounded mb-2" />
          <div className="h-4 w-40 bg-card rounded" />
        </div>
        <div className="h-8 w-12 bg-card rounded" />
      </div>
      <div className="h-3 w-32 bg-card rounded mb-4" />
      <div className="flex gap-1.5 mb-4">
        <div className="h-4 w-20 bg-card rounded-full" />
        <div className="h-4 w-16 bg-card rounded-full" />
      </div>
      <div className="h-1 bg-card rounded-full mb-4" />
      <div className="h-3 w-24 bg-card rounded" />
    </div>
  );
}

// ── Station detail panel ──────────────────────────────────────────────────────
function StationDetail({ station }: { station: ChargingStation }) {
  const meta = CHARGING_PROVIDER_META[station.provider] ?? {
    badgeClass: "text-slate-400 bg-slate-400/10 border-slate-400/20",
  };
  const availabilityRatio = station.available / Math.max(1, station.total);

  return (
    <div className="glass rounded-3xl border border-border/40 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-medium ${meta.badgeClass}`}>
            {station.provider}
          </span>
          <h3 className="text-xl font-bold tracking-tight mt-3 leading-snug">{station.name}</h3>
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
          { label: "Corridor", value: station.corridor || station.region },
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

      <div className="grid lg:grid-cols-[1fr_200px] gap-5">
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {station.connectors.map((c) => (
              <span key={c} className="rounded-full border border-border/40 bg-card/50 px-3 py-1 text-[11px] text-muted-foreground">
                {c}
              </span>
            ))}
            {station.amenities.map((a) => (
              <span key={a} className="rounded-full border border-border/40 bg-card/50 px-3 py-1 text-[11px] text-muted-foreground">
                {a}
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
              Availability data sourced from Open Charge Map. Real-time status may differ — verify with provider app.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/30 bg-card/35 p-4">
          <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-400 mb-3">Data source</div>
          <div className="space-y-2.5 text-xs text-muted-foreground">
            <div className="flex items-center justify-between gap-3">
              <span>Open Charge Map</span>
              <span className="text-emerald-400 font-medium">{station.sourceIds?.openChargeMap ? "Live" : "Pending"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>NOBIL</span>
              <span className="text-foreground">{(station.sourceIds as { nobil?: string })?.nobil ?? "—"}</span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-border/20 text-[10px] text-muted-foreground/60 leading-relaxed">
            Charging data updated dynamically. Speeds may vary based on vehicle and network load.
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EVCharging() {
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState<ProviderFilter>("All");
  const [speed, setSpeed] = useState<SpeedFilter>("All");
  const [connector, setConnector] = useState<ConnectorFilter>("All");
  const [selectedId, setSelectedId] = useState(EV_CHARGING_DEMO_STATIONS[0]?.id ?? 0);
  const [countryIndex, setCountryIndex] = useState(0); // default: Norway
  const [page, setPage] = useState(0);

  const selectedCountry = EUROPE_COUNTRIES[countryIndex];
  const [viewportQuery, setViewportQuery] = useState(() => ({
    lat: selectedCountry.center.lat,
    lng: selectedCountry.center.lng,
    distance: selectedCountry.code === "NO" ? 180 : 240,
  }));

  useEffect(() => {
    setViewportQuery({
      lat: selectedCountry.center.lat,
      lng: selectedCountry.center.lng,
      distance: selectedCountry.code === "NO" ? 180 : 240,
    });
  }, [selectedCountry.center.lat, selectedCountry.center.lng, selectedCountry.code]);

  const { stations: liveStations, isLoading, isError, isFallback, total } = useOCMCharging({
    countryCode: selectedCountry.code,
    page,
    lat: viewportQuery.lat,
    lng: viewportQuery.lng,
    distance: viewportQuery.distance,
    maxResults: 50,
  });

  const handleViewportChange = useCallback((next: { lat: number; lng: number; distanceKm: number; zoom: number }) => {
    setViewportQuery((prev) => {
      const distance = Math.round(next.distanceKm);
      const unchanged =
        Math.abs(prev.lat - next.lat) < 0.02 &&
        Math.abs(prev.lng - next.lng) < 0.02 &&
        Math.abs(prev.distance - distance) < 5;
      if (unchanged) return prev;
      setPage(0);
      return { lat: next.lat, lng: next.lng, distance };
    });
  }, []);

  // Apply client-side filters on top of live data
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const pool = liveStations.length ? liveStations : (isFallback ? EV_CHARGING_DEMO_STATIONS : []);
    return pool.filter((s) => {
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.region.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        (s.corridor ?? "").toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q);
      const matchesProvider = provider === "All" || s.provider === provider;
      const matchesSpeed = speed === "All" || s.speed === speed;
      const matchesConnector = connector === "All" || s.connectors.includes(connector);
      return matchesSearch && matchesProvider && matchesSpeed && matchesConnector;
    });
  }, [liveStations, isFallback, search, provider, speed, connector]);

  // Auto-select first station when filters/country change — must be in useEffect to avoid render-phase state mutation
  const firstFilteredId = filtered[0]?.id;
  useEffect(() => {
    if (firstFilteredId !== undefined && !filtered.some((s) => s.id === selectedId)) {
      setSelectedId(firstFilteredId);
    }
  }, [filtered, firstFilteredId, selectedId]);

  const selectedStation = filtered.find((s) => s.id === selectedId) ?? filtered[0];

  const providerCount = new Set(filtered.map((s) => s.provider)).size;
  const hasFilters = Boolean(search.trim()) || provider !== "All" || speed !== "All" || connector !== "All";

  const resetFilters = () => {
    setSearch("");
    setProvider("All");
    setSpeed("All");
    setConnector("All");
  };

  return (
    <PageShell>
      <SEO
        title="EV Charging Map Europe | AUTOVERE"
        description="Find Tesla Superchargers, Ionity, Fastned, Allego and all major EV charging networks across Europe. Live data from Open Charge Map."
        image="https://autovere.com/og-autovere-1200x630.jpg"
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-transparent to-blue-950/30 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-cyan-400 mb-5">
            <Zap className="w-3.5 h-3.5" /> EV Hub › Charging
          </div>
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              European EV infrastructure,{" "}
              <span className="text-gradient">live and filterable.</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              Live charging data across 12 European countries. Tesla Supercharger, Ionity, Fastned, Allego,
              Shell Recharge and more — filtered by provider, speed and connector.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            {[
              "Live · Powered by Open Charge Map",
              `${Object.keys(CHARGING_PROVIDER_META).length} providers`,
              "12 countries · Norway-first",
            ].map((item) => (
              <span key={item} className="glass rounded-full border border-border/40 px-4 py-2 text-xs text-muted-foreground">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Country selector */}
      <section className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container py-3">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/60 flex-shrink-0 pr-2">
              <Globe className="w-3.5 h-3.5 inline-block mr-1" />Country
            </span>
            {EUROPE_COUNTRIES.map((c, idx) => (
              <button
                key={c.code}
                onClick={() => {
                  setCountryIndex(idx);
                  setPage(0);
                  setSelectedId(0);
                  setViewportQuery({
                    lat: c.center.lat,
                    lng: c.center.lng,
                    distance: c.code === "NO" ? 180 : 240,
                  });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex-shrink-0 ${
                  idx === countryIndex
                    ? "bg-primary/20 border-primary/50 text-primary"
                    : "glass border-border/30 text-muted-foreground hover:text-foreground"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10 space-y-6">
        {/* Error / fallback notice */}
        {isError && !isFallback && (
          <div className="glass rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-amber-400">Live data temporarily unavailable.</span>{" "}
              <span className="text-muted-foreground">
                Showing available station data. Retry or check your connection.
              </span>
            </div>
          </div>
        )}
        {isFallback && (
          <div className="glass rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-blue-400">Showing representative Norway data.</span>{" "}
              <span className="text-muted-foreground">
                Live Open Charge Map data could not be fetched. Displayed stations are illustrative.
              </span>
            </div>
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
          <aside className="order-2 xl:order-1 space-y-4 xl:max-h-[calc(100vh-11rem)] xl:overflow-auto xl:pr-2 -mt-4 xl:mt-0">
            <div className="glass rounded-2xl border border-border/40 p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search city, country, corridor or provider…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="glass rounded-full border border-border/30 px-3 py-1.5">
                <span className="text-foreground font-medium">{filtered.length}</span> stations
              </span>
              <span className="glass rounded-full border border-border/30 px-3 py-1.5">
                <span className="text-foreground font-medium">{providerCount}</span> providers
              </span>
              {total > 50 && (
                <span className="glass rounded-full border border-border/30 px-3 py-1.5">
                  <span className="text-foreground font-medium">{total}</span> total available
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length ? (
              <div className="space-y-4">
                {filtered.map((station) => {
                  const speedInfo = SPEED_LABELS[station.speed];
                  const meta = CHARGING_PROVIDER_META[station.provider] ?? {
                    badgeClass: "text-slate-400 bg-slate-400/10 border-slate-400/20",
                  };
                  const availabilityRatio = station.available / Math.max(1, station.total);
                  const active = station.id === selectedId;

                  return (
                    <button
                      key={station.id}
                      onClick={() => setSelectedId(station.id)}
                      className={`group w-full text-left glass rounded-2xl border p-6 transition-all duration-300 ${
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
                        <span className="truncate">{station.location || station.city}</span>
                      </div>

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
                          className={`h-full rounded-full transition-all ${
                            availabilityRatio > 0.5 ? "bg-emerald-400" : availabilityRatio > 0 ? "bg-amber-400" : "bg-red-400"
                          }`}
                          style={{ width: `${Math.max(8, availabilityRatio * 100)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="text-muted-foreground truncate">{station.pricingHint}</span>
                        <span className="inline-flex items-center gap-1 text-accent font-medium flex-shrink-0">
                          Details <Navigation className="w-3 h-3" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="glass rounded-2xl border border-border/40 p-8 text-center text-muted-foreground">
                <Zap className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-base font-medium mb-1">No stations match your filters.</p>
                <p className="text-sm mb-4">Showing nearby infrastructure works best with broader filters.</p>
                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 rounded-xl border border-primary/50 bg-primary/10 text-primary text-sm"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            )}

            {total > 50 && !isLoading && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 rounded-xl glass border border-border/40 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4 inline-block mr-1" />
                  Previous
                </button>
                <span className="text-xs text-muted-foreground">Page {page + 1}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 rounded-xl glass border border-border/40 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 inline-block ml-1" />
                </button>
              </div>
            )}
          </aside>

          <div className="order-1 xl:order-2 space-y-4">
            <GoogleChargingMap
              stations={filtered}
              selectedId={selectedId}
              countryName={selectedCountry.name}
              isLoading={isLoading}
              isFallback={isFallback}
              onSelect={setSelectedId}
              onViewportChange={handleViewportChange}
              countryCenter={selectedCountry.center}
            />

            {selectedStation ? (
              <StationDetail station={selectedStation} />
            ) : (
              <div className="glass rounded-3xl border border-border/40 p-8 text-center text-muted-foreground">
                {isLoading ? "Loading nearby stations…" : "Move the map or broaden filters to load nearby stations."}
              </div>
            )}
          </div>
        </div>

        {/* Attribution footer */}
        <div className="glass rounded-2xl border border-border/40 p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-start gap-3">
              <Radio className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-sm font-medium mb-1">Live infrastructure data</div>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                  Charging data is sourced from <strong>Open Charge Map</strong>, an open-access community dataset. Station
                  availability, pricing and speed data may lag real-world conditions. Always verify with the provider
                  app before departing.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              {["Open Charge Map", "NOBIL (Norway)", "12 countries", "Live updates"].map((item) => (
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
