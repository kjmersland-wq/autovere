/**
 * Automotive Signals — Live Intelligence Feed
 *
 * Represents the normalized output of the automated content pipeline.
 * Static data for now; architected for live ingestion via content-pipeline.ts.
 */

export type SignalType =
  | "price-change"
  | "network-expansion"
  | "vehicle-launch"
  | "software-update"
  | "battery-tech"
  | "charging-cost"
  | "ownership-trend"
  | "policy";

export type SignalImpact = "high" | "medium" | "low";

export interface AutomotiveSignal {
  id: string;
  type: SignalType;
  title: string;
  summary: string;
  impact: SignalImpact;
  relevanceScore: number;
  publishedAt: string;
  source: string;
  affectedVehicles?: string[];
  affectedNetworks?: string[];
  actionPath?: string;
}

export const SIGNAL_TYPE_LABELS: Record<SignalType, string> = {
  "price-change": "Price",
  "network-expansion": "Network",
  "vehicle-launch": "Launch",
  "software-update": "Software",
  "battery-tech": "Battery",
  "charging-cost": "Charging Cost",
  "ownership-trend": "Ownership",
  "policy": "Policy",
};

export const SIGNAL_TYPE_COLORS: Record<SignalType, string> = {
  "price-change": "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  "network-expansion": "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
  "vehicle-launch": "text-violet-400 bg-violet-500/10 border-violet-500/30",
  "software-update": "text-blue-400 bg-blue-500/10 border-blue-500/30",
  "battery-tech": "text-amber-400 bg-amber-500/10 border-amber-500/30",
  "charging-cost": "text-teal-400 bg-teal-500/10 border-teal-500/30",
  "ownership-trend": "text-rose-400 bg-rose-500/10 border-rose-500/30",
  "policy": "text-indigo-400 bg-indigo-500/10 border-indigo-500/30",
};

export const SIGNAL_IMPACT_COLORS: Record<SignalImpact, string> = {
  high: "text-rose-400 bg-rose-500/10",
  medium: "text-amber-400 bg-amber-500/10",
  low: "text-muted-foreground bg-card/60",
};

export const AUTOMOTIVE_SIGNALS: AutomotiveSignal[] = [
  {
    id: "bmw-neue-klasse-reveal-2025",
    type: "vehicle-launch",
    title: "BMW Neue Klasse iX3 Full Reveal — 300 kW DC Charging Confirmed",
    summary: "BMW confirmed the production Neue Klasse iX3 will feature 300 kW DC charging as standard — tripling the current iX3's 100 kW capability. Deliveries expected Q4 2026.",
    impact: "high",
    relevanceScore: 94,
    publishedAt: "2025-11-20",
    source: "BMW Group PressClub",
    affectedVehicles: ["bmw-ix3", "bmw-ix"],
    actionPath: "/ev/models/bmw-ix3",
  },
  {
    id: "ioniq-9-deliveries-begin",
    type: "vehicle-launch",
    title: "Hyundai IONIQ 9 Begins European Deliveries",
    summary: "The 7-seat IONIQ 9 starts deliveries in Norway and Germany. 800V architecture, 220 kW DC charging, and 620+ km WLTP range. Positioned against Volvo EX90 and BMW iX.",
    impact: "high",
    relevanceScore: 91,
    publishedAt: "2025-11-14",
    source: "Hyundai Motor Group Newsroom",
    affectedVehicles: ["volvo-ex90", "bmw-ix"],
    actionPath: "/ev/models",
  },
  {
    id: "vw-id7-tourer-confirmed",
    type: "vehicle-launch",
    title: "VW Confirms ID.7 Tourer Estate — 600L Boot, Same 170 kW DC",
    summary: "Volkswagen's ID.7 Tourer estate variant launches in Europe. 600L cargo with rear seats up vs saloon's 530L. Priced €3,500 above saloon equivalent.",
    impact: "medium",
    relevanceScore: 82,
    publishedAt: "2025-11-08",
    source: "Volkswagen Newsroom",
    affectedVehicles: ["volkswagen-id-7"],
    actionPath: "/ev/models/volkswagen-id-7",
  },
  {
    id: "tesla-model-y-price-cut-germany",
    type: "price-change",
    title: "Tesla Cuts Model Y Long Range Price by €3,500 in Germany",
    summary: "Tesla reduced the Model Y LR from €52,990 to €49,490 in Germany — narrowing the gap to VW ID.7 and Polestar 2. Existing owners not eligible for retroactive credit.",
    impact: "high",
    relevanceScore: 89,
    publishedAt: "2025-11-02",
    source: "Tesla Newsroom",
    affectedVehicles: ["tesla-model-y", "volkswagen-id-7", "polestar-2"],
    actionPath: "/ev/models/tesla-model-y",
  },
  {
    id: "mercedes-eqs-price-reduction",
    type: "price-change",
    title: "Mercedes Drops EQS Price by €8,000 Across All Variants",
    summary: "Mercedes-EQ reduces EQS pricing to address inventory pressure. EQS 450+ now from €102,000 — a meaningful softening after being criticised for aggressive pricing at launch.",
    impact: "medium",
    relevanceScore: 77,
    publishedAt: "2025-10-26",
    source: "Mercedes-Benz Newsroom",
    affectedVehicles: ["mercedes-eqs", "bmw-ix"],
    actionPath: "/ev/models/mercedes-eqs",
  },
  {
    id: "ionity-nordic-400kw-complete",
    type: "network-expansion",
    title: "Ionity Nordic Corridor 400 kW Upgrade Complete — 60 Stations",
    summary: "Ionity's Gen 2 400 kW rollout on the Oslo–Stockholm–Copenhagen corridor is complete. All 60 stops now support 400 kW hardware. Average session reliability: 98.7%.",
    impact: "high",
    relevanceScore: 92,
    publishedAt: "2025-10-18",
    source: "Ionity GmbH Press",
    affectedNetworks: ["ionity"],
    actionPath: "/ev/networks/ionity",
  },
  {
    id: "shell-recharge-acquires-allego",
    type: "network-expansion",
    title: "Shell Recharge Acquires Allego in €720M Deal — 35,000 Chargers Combined",
    summary: "Shell's acquisition of Allego creates Europe's largest charging network by location count. Integration expected over 18 months. Uptime improvement from Allego's 84% average remains the challenge.",
    impact: "high",
    relevanceScore: 85,
    publishedAt: "2025-10-09",
    source: "Shell Press",
    affectedNetworks: [],
    actionPath: "/ev/charging",
  },
  {
    id: "fastned-premium-membership-launch",
    type: "charging-cost",
    title: "Fastned Launches Premium Subscription — €11.99/month for Flat Rates",
    summary: "Fastned Premium offers fixed €0.35/kWh across all Fastned stations. Undercuts Ionity standard tariff by up to €0.12/kWh on competitive corridors. No minimum session requirement.",
    impact: "medium",
    relevanceScore: 83,
    publishedAt: "2025-09-30",
    source: "Fastned Press",
    affectedNetworks: ["fastned"],
    actionPath: "/ev/networks/fastned",
  },
  {
    id: "uk-electricity-price-cap-falls",
    type: "charging-cost",
    title: "UK Energy Price Cap Falls 8% — EV Home Charging Now ~£0.22/kWh",
    summary: "Ofgem's Q1 2026 price cap reduces UK electricity to approximately £0.22/kWh. Off-peak EV tariffs (Octopus Go, E.ON Next Drive) now available at £0.08–0.09/kWh overnight.",
    impact: "medium",
    relevanceScore: 76,
    publishedAt: "2025-09-22",
    source: "Ofgem",
    actionPath: "/ev/calculator",
  },
  {
    id: "catl-shenxing-plus-1000km",
    type: "battery-tech",
    title: "CATL Shenxing Plus Cell: 1,000 km WLTP at 4C Charging Rate",
    summary: "CATL's next-generation Shenxing Plus chemistry achieves 1,000 km WLTP range with 4C (15-minute) charging. European vehicle applications expected in Zeekr and BMW Neue Klasse derivatives from 2027.",
    impact: "high",
    relevanceScore: 90,
    publishedAt: "2025-09-15",
    source: "CATL",
    actionPath: "/ev/news/sodium-ion-battery-2026-preview",
  },
  {
    id: "vw-ota-motor-efficiency",
    type: "software-update",
    title: "VW Pushes OTA Improving ID.4 and ID.7 Motor Efficiency by 7%",
    summary: "Over-the-air update released for ID.4, ID.7 and Enyaq (MEB platform). Motor control algorithm update improves real-world efficiency 5–7% — effective immediately, no dealer visit required.",
    impact: "medium",
    relevanceScore: 88,
    publishedAt: "2025-09-04",
    source: "Volkswagen Newsroom",
    affectedVehicles: ["volkswagen-id-7", "skoda-enyaq"],
    actionPath: "/ev/models/volkswagen-id-7",
  },
  {
    id: "polestar-2-google-maps-ev-routing",
    type: "software-update",
    title: "Polestar 2 Gets Google Maps EV Routing — Automatic Charging Stop Planning",
    summary: "Polestar 2 OTA 2.5 activates Google Maps EV routing — the app automatically suggests charging stops based on real-time battery state. Live for all Polestar 2 owners without dealer visit.",
    impact: "medium",
    relevanceScore: 79,
    publishedAt: "2025-08-27",
    source: "Polestar Media",
    affectedVehicles: ["polestar-2"],
    actionPath: "/ev/models/polestar-2",
  },
  {
    id: "norway-ev-share-91-percent",
    type: "ownership-trend",
    title: "Norway's EV Market Share Reaches 91% in October 2025",
    summary: "October 2025 data shows 91% of new car registrations in Norway are fully electric. The 9% ICE share is primarily commercial vehicles and rural delivery vans. Pure private ICE sales are statistically negligible.",
    impact: "medium",
    relevanceScore: 74,
    publishedAt: "2025-11-03",
    source: "OFV (Norwegian Road Federation)",
    actionPath: "/ev/news/norway-ev-88-percent-2025",
  },
  {
    id: "eu-parliament-2035-vote",
    type: "policy",
    title: "EU Parliament Votes 419-188 to Maintain 2035 ICE Mandate",
    summary: "The European Parliament rejected an amendment to delay the 2035 zero-emissions vehicle mandate. The vote reinforces certainty for OEM electrification investment and fleet buyer planning through 2035.",
    impact: "high",
    relevanceScore: 87,
    publishedAt: "2025-10-14",
    source: "European Parliament",
    actionPath: "/ev/news/eu-2035-ice-ban-update",
  },
  {
    id: "recurrent-2026-battery-report",
    type: "ownership-trend",
    title: "Recurrent 2026 Battery Health Report: Tesla Still Leads at 5-Year Retention",
    summary: "Updated data from 18,000 EVs shows Tesla Model 3/Y at 95% median 5-year battery retention. IONIQ 5/6 at 93%. Industry average: 91%. Nissan Leaf (24 kWh) confirmed at 71% — the persistent outlier.",
    impact: "medium",
    relevanceScore: 81,
    publishedAt: "2025-08-12",
    source: "Recurrent",
    affectedVehicles: ["tesla-model-y", "hyundai-ioniq-6"],
    actionPath: "/ev/news/ev-battery-degradation-real-data",
  },
  {
    id: "enbw-autobahn-300kw-upgrade",
    type: "network-expansion",
    title: "EnBW Upgrades 50 German Autobahn Stations to 300 kW",
    summary: "EnBW's HyperNetz completes 300 kW upgrade at 50 major Autobahn service stations. Covers A1, A3, A7, A9 corridors. Combined with Ionity coverage, Germany now has 300 kW DC access at 94% of Autobahn service stops.",
    impact: "medium",
    relevanceScore: 80,
    publishedAt: "2025-07-30",
    source: "EnBW Press",
    affectedNetworks: [],
    actionPath: "/ev/charging",
  },
];

export function getSignalsByType(type: SignalType): AutomotiveSignal[] {
  return AUTOMOTIVE_SIGNALS.filter((s) => s.type === type);
}

export function getTopSignals(n = 6): AutomotiveSignal[] {
  return [...AUTOMOTIVE_SIGNALS]
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, n);
}

export function getSignalsForVehicle(slug: string): AutomotiveSignal[] {
  return AUTOMOTIVE_SIGNALS.filter((s) => s.affectedVehicles?.includes(slug));
}

export function getRecentSignals(n = 8): AutomotiveSignal[] {
  return [...AUTOMOTIVE_SIGNALS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, n);
}
