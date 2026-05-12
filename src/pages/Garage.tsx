import { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Car, Star, BarChart2, BookOpen, Zap, Brain, Plus, ArrowRight,
  Eye, Bookmark, Network,
} from "lucide-react";
import { useGarage } from "@/hooks/useGarage";
import { useSavedContent } from "@/hooks/useSavedContent";
import { useWatchlist } from "@/hooks/useWatchlist";
import { GarageVehicleCard } from "@/components/GarageVehicleCard";
import { InsightPanel } from "@/components/OwnershipInsightCard";
import { SignalFeedCompact } from "@/components/SignalFeed";
import { generateGarageInsights } from "@/lib/ai-ownership-insights";
import { getVehicleIntelligence } from "@/data/vehicle-intelligence";
import { loadPreferences } from "@/lib/personalization";
import { ARTICLES } from "@/data/articles";
import { EV_MODELS } from "@/data/ev-models";
import { CHARGING_NETWORKS } from "@/data/charging-networks";
import { localizePath, detectLangFromPath } from "@/i18n/routing";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { EVNavProvider } from "@/contexts/EVNavContext";
import { SEO } from "@/components/SEO";
import type { GarageSlot } from "@/data/ownership-tracking";

type TabId = "dream" | "owned" | "comparing" | "saved" | "watchlist";

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "dream", label: "Dream", icon: Star },
  { id: "owned", label: "Owned", icon: Car },
  { id: "comparing", label: "Comparing", icon: BarChart2 },
  { id: "saved", label: "Saved", icon: BookOpen },
  { id: "watchlist", label: "Watchlist", icon: Eye },
];

export default function Garage() {
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);

  const { enriched, bySlot, removeFromGarage, updateSlot, totalCount, dreamCount, ownedCount, comparingCount } = useGarage();
  const { saved, getSaved } = useSavedContent();
  const { entries: watchlistEntries, removeFromWatchlist } = useWatchlist();

  const [activeTab, setActiveTab] = useState<TabId>("dream");

  const prefs = useMemo(() => loadPreferences(), []);

  const garageIntelligence = useMemo(() => {
    const vehicles = enriched
      .map((e) => getVehicleIntelligence(e.entry.slug))
      .filter(Boolean) as ReturnType<typeof getVehicleIntelligence>[];
    return generateGarageInsights(vehicles.filter(Boolean) as NonNullable<ReturnType<typeof getVehicleIntelligence>>[], prefs);
  }, [enriched, prefs]);

  const savedArticles = useMemo(() => {
    const slugs = getSaved("article");
    return ARTICLES.filter((a) => slugs.includes(a.slug));
  }, [getSaved]);

  const savedVehicles = useMemo(() => {
    const slugs = getSaved("vehicle");
    return EV_MODELS.filter((m) => slugs.includes(m.slug));
  }, [getSaved]);

  const savedNetworks = useMemo(() => {
    const slugs = getSaved("network");
    return CHARGING_NETWORKS.filter((n) => slugs.includes(n.slug));
  }, [getSaved]);

  const totalSaved = savedArticles.length + savedVehicles.length + savedNetworks.length;
  const tabCount: Record<TabId, number> = {
    dream: dreamCount,
    owned: ownedCount,
    comparing: comparingCount,
    saved: totalSaved,
    watchlist: watchlistEntries.length,
  };

  const activeVehicles = (activeTab === "dream" || activeTab === "owned" || activeTab === "comparing")
    ? bySlot(activeTab as GarageSlot)
    : [];

  return (
    <EVNavProvider>
    <>
      <SEO
        title="My Garage — AUTOVERE"
        description="Your personal EV garage: dream vehicles, owned cars, saved content and AI ownership insights."
      />
      <SiteHeader />
      <main className="min-h-screen pt-20 pb-16">

        {/* Hero stats bar */}
        <div className="border-b border-border/30 bg-card/30">
          <div className="container py-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-1">My Garage</p>
                <h1 className="text-3xl font-bold tracking-tight">
                  {totalCount === 0 ? "Your garage is empty" : (
                    <>Your <span className="text-gradient">{totalCount} vehicle{totalCount !== 1 ? "s" : ""}</span></>
                  )}
                </h1>
              </div>
              <div className="flex items-center gap-6">
                <Stat label="Dream" value={dreamCount} color="text-violet-400" />
                <Stat label="Owned" value={ownedCount} color="text-emerald-400" />
                <Stat label="Comparing" value={comparingCount} color="text-cyan-400" />
                <Stat label="Saved" value={totalSaved} color="text-accent" />
              </div>
            </div>
          </div>
        </div>

        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

            {/* Main content */}
            <div>
              {/* Tabs */}
              <div className="flex gap-1 p-1 bg-card/40 border border-border/30 rounded-2xl mb-6 overflow-x-auto">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const count = tabCount[tab.id];
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center ${
                        activeTab === tab.id
                          ? "bg-accent text-accent-foreground shadow-glow"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                      {tab.label}
                      {count > 0 && (
                        <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-medium ${
                          activeTab === tab.id ? "bg-white/20" : "bg-card/80"
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Vehicle tabs (dream / owned / comparing) */}
              {(activeTab === "dream" || activeTab === "owned" || activeTab === "comparing") && (
                <>
                  {activeVehicles.length === 0 ? (
                    <VehicleEmptyState tab={activeTab} L={L} />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeVehicles.map((ev) => (
                        <GarageVehicleCard
                          key={ev.entry.slug}
                          enriched={ev}
                          onRemove={removeFromGarage}
                          onSlotChange={updateSlot}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Saved content tab */}
              {activeTab === "saved" && (
                <div className="space-y-8">
                  {totalSaved === 0 ? (
                    <SavedEmptyState L={L} />
                  ) : (
                    <>
                      {savedVehicles.length > 0 && (
                        <SavedSection title="Saved Vehicles" count={savedVehicles.length}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {savedVehicles.map((m) => (
                              <Link
                                key={m.slug}
                                to={L(`/ev/models/${m.slug}`)}
                                className="flex items-center gap-3 p-3 rounded-xl glass border border-border/30 hover:border-accent/40 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                                  <Car className="w-4 h-4 text-cyan-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{m.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{m.brand}</p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </SavedSection>
                      )}

                      {savedArticles.length > 0 && (
                        <SavedSection title="Saved Articles" count={savedArticles.length}>
                          <div className="space-y-2">
                            {savedArticles.map((a) => (
                              <Link
                                key={a.slug}
                                to={L(`/ev/news/${a.slug}`)}
                                className="flex items-start gap-3 p-3 rounded-xl glass border border-border/30 hover:border-accent/40 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <BookOpen className="w-4 h-4 text-accent" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold leading-snug mb-0.5">{a.title}</p>
                                  <p className="text-[10px] text-muted-foreground">{a.readMinutes} min · {a.category}</p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0 mt-1" />
                              </Link>
                            ))}
                          </div>
                        </SavedSection>
                      )}

                      {savedNetworks.length > 0 && (
                        <SavedSection title="Saved Networks" count={savedNetworks.length}>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {savedNetworks.map((n) => (
                              <Link
                                key={n.slug}
                                to={L(`/ev/networks/${n.slug}`)}
                                className="flex items-center gap-3 p-3 rounded-xl glass border border-border/30 hover:border-accent/40 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                                  <Network className="w-4 h-4 text-violet-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold truncate">{n.name}</p>
                                  <p className="text-[10px] text-muted-foreground">{n.coverageStrength.slice(0, 2).join(", ")}</p>
                                </div>
                                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-accent transition-colors flex-shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </SavedSection>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Watchlist tab */}
              {activeTab === "watchlist" && (
                <div>
                  {watchlistEntries.length === 0 ? (
                    <WatchlistEmptyState L={L} />
                  ) : (
                    <div className="space-y-3">
                      {watchlistEntries.map((w) => {
                        const model = EV_MODELS.find((m) => m.slug === w.slug);
                        return (
                          <div
                            key={`${w.type}-${w.slug}`}
                            className="flex items-center gap-4 p-4 rounded-xl glass border border-border/30 hover:border-border/60 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                              <Eye className="w-4 h-4 text-amber-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold truncate">
                                {model ? model.name : w.slug.replace(/-/g, " ")}
                              </p>
                              <p className="text-[10px] text-muted-foreground capitalize">
                                {w.type} · {w.enabledAlerts.length} alert{w.enabledAlerts.length !== 1 ? "s" : ""} active
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {w.type === "vehicle" && model && (
                                <Link
                                  to={L(`/ev/models/${w.slug}`)}
                                  className="text-[10px] font-medium text-accent hover:underline"
                                >
                                  View
                                </Link>
                              )}
                              <button
                                onClick={() => removeFromWatchlist(w.slug)}
                                className="text-[10px] text-muted-foreground hover:text-rose-400 transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* AI Insights */}
              {garageIntelligence.length > 0 && (
                <div className="glass rounded-2xl border border-border/40 p-5">
                  <InsightPanel insights={garageIntelligence} title="Garage Insights" compact />
                </div>
              )}

              {/* CTA to add vehicles if garage is sparse */}
              {totalCount < 3 && (
                <div className="glass rounded-2xl border border-border/40 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Plus className="w-4 h-4 text-accent" />
                    <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Add vehicles</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    Browse the EV model database and add vehicles to your dream garage, comparison list, or mark ones you own.
                  </p>
                  <Link
                    to={L("/ev/models")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
                  >
                    Browse all EV models <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {/* AI Score overview for owned vehicles */}
              {ownedCount > 0 && (
                <div className="glass rounded-2xl border border-border/40 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="w-4 h-4 text-accent" />
                    <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Your fleet scores</h3>
                  </div>
                  <div className="space-y-3">
                    {bySlot("owned").map((ev) => {
                      const intel = ev.intelligence;
                      if (!ev.model || !intel) return null;
                      return (
                        <div key={ev.entry.slug} className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-semibold truncate">{ev.model.name}</p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <div className="w-16 h-1.5 rounded-full bg-card overflow-hidden">
                              <div
                                className="h-full rounded-full bg-accent"
                                style={{ width: `${intel.overallIntelligence}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-medium text-accent w-6 text-right">
                              {intel.overallIntelligence}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Live signals */}
              <div className="glass rounded-2xl border border-border/40 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Live signals</h3>
                </div>
                <SignalFeedCompact limit={4} />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
    </EVNavProvider>
  );
}

// --- Sub-components ---

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="text-center">
      <div className={`text-2xl font-bold tabular-nums ${color}`}>{value}</div>
      <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function SavedSection({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Bookmark className="w-3.5 h-3.5 text-accent" />
        <h3 className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">{title}</h3>
        <span className="text-[10px] text-muted-foreground bg-card/60 px-2 py-0.5 rounded-full border border-border/30">{count}</span>
      </div>
      {children}
    </div>
  );
}

function VehicleEmptyState({ tab, L }: { tab: TabId; L: (p: string) => string }) {
  const copy = {
    dream: { heading: "No dream vehicles yet", body: "Browse the EV model database and add vehicles you'd love to own some day.", cta: "Explore EVs", path: "/ev/models" },
    owned: { heading: "No owned vehicles logged", body: "Mark an EV as owned to track its AI intelligence score and get personalised ownership insights.", cta: "Browse models", path: "/ev/models" },
    comparing: { heading: "Not comparing anything yet", body: "Add vehicles to your comparison list while you research your next EV purchase.", cta: "Compare EVs", path: "/ev/compare" },
  } as const;
  const c = copy[tab as keyof typeof copy];
  if (!c) return null;
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-card/60 border border-border/40 flex items-center justify-center mb-5">
        <Car className="w-7 h-7 text-muted-foreground/40" />
      </div>
      <h3 className="text-base font-semibold mb-2">{c.heading}</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">{c.body}</p>
      <Link
        to={L(c.path)}
        className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
      >
        {c.cta} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function SavedEmptyState({ L }: { L: (p: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-card/60 border border-border/40 flex items-center justify-center mb-5">
        <BookOpen className="w-7 h-7 text-muted-foreground/40" />
      </div>
      <h3 className="text-base font-semibold mb-2">Nothing saved yet</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
        Bookmark articles, vehicles, and charging networks using the save button on any page.
      </p>
      <Link to={L("/ev/news")} className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        Read the news feed <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

function WatchlistEmptyState({ L }: { L: (p: string) => string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-card/60 border border-border/40 flex items-center justify-center mb-5">
        <Eye className="w-7 h-7 text-muted-foreground/40" />
      </div>
      <h3 className="text-base font-semibold mb-2">Watchlist is empty</h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6 leading-relaxed">
        Watch EV models and charging networks to get notified of price changes, software updates, and network expansions.
      </p>
      <Link to={L("/ev/models")} className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        Browse models <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}
