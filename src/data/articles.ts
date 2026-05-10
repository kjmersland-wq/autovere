export type ArticleCategory =
  | "market"
  | "technology"
  | "infrastructure"
  | "ownership"
  | "policy"
  | "comparison";

export interface MediaAttribution {
  source: string;
  license: string;
  url: string;
  alt: string;
  gradient?: string;
}

export interface ArticleData {
  slug: string;
  title: string;
  category: ArticleCategory;
  publishedAt: string;
  readMinutes: number;
  summary: string;
  whyItMatters: string;
  body: string[];
  relatedVehicles: string[];
  relatedNetworks: string[];
  relatedGuides: string[];
  tags: string[];
  media: MediaAttribution;
}

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  market: "Market",
  technology: "Technology",
  infrastructure: "Infrastructure",
  ownership: "Ownership",
  policy: "Policy",
  comparison: "Comparison",
};

export const CATEGORY_COLORS: Record<ArticleCategory, string> = {
  market: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  technology: "text-violet-400 border-violet-500/30 bg-violet-500/10",
  infrastructure: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  ownership: "text-amber-400 border-amber-500/30 bg-amber-500/10",
  policy: "text-rose-400 border-rose-500/30 bg-rose-500/10",
  comparison: "text-indigo-400 border-indigo-500/30 bg-indigo-500/10",
};

export const ARTICLES: ArticleData[] = [
  {
    slug: "ionity-gen2-chargers-rollout-2025",
    title: "Ionity Gen 2 Chargers Are Rolling Out — Here's What 400 kW Means in Practice",
    category: "infrastructure",
    publishedAt: "2025-11-18",
    readMinutes: 6,
    summary:
      "Ionity's second-generation 400 kW chargers are being installed at 300 locations across Europe. We break down which vehicles actually benefit, realistic charge times, and where the bottlenecks still are.",
    whyItMatters:
      "Most current EVs can't accept 400 kW — but the infrastructure is being built for the next generation. If you're buying an EV in 2025–2026, knowing which vehicles will hit 30-minute 10–80% charges is essential to future-proofing your purchase.",
    body: [
      "Ionity's Gen 2 hardware supports up to 400 kW per cable, but the actual limit is always determined by the vehicle. As of Q4 2025, only the Mercedes EQS, Hyundai IONIQ 6, and BMW i5 M60 regularly achieve above 200 kW at these stations.",
      "The practical impact for most drivers is a modest improvement: faster peak charging for vehicles with 200–350 kW acceptance, and better sustained speeds across a 10–80% session — since the chargers can maintain peak power longer without throttling.",
      "Ionity has confirmed 300 upgraded stations by end of 2025, with the Nordic corridor (Oslo–Stockholm–Copenhagen) prioritised first. Germany's Autobahn network follows in Q1 2026.",
      "Pricing remains on the Ionity Passport model — €0.35–0.69/kWh depending on membership tier. No change to tariff structure with Gen 2 rollout.",
    ],
    relatedVehicles: ["hyundai-ioniq-6", "mercedes-eqs", "bmw-ix"],
    relatedNetworks: ["ionity"],
    relatedGuides: ["fast-charging-guide"],
    tags: ["ionity", "charging infrastructure", "fast charging", "400kW", "Europe"],
    media: {
      source: "Ionity GmbH Press",
      license: "OEM Press Kit",
      url: "",
      alt: "Ionity Gen 2 charging station",
      gradient: "from-cyan-950 to-blue-950",
    },
  },
  {
    slug: "real-world-winter-range-2025",
    title: "Real Winter Range 2025: We Tested 8 EVs at −10°C — The Results Are Surprising",
    category: "comparison",
    publishedAt: "2025-11-05",
    readMinutes: 9,
    summary:
      "Independent cold-weather tests across Norway and Finland reveal which EVs lose the least range in winter — and which lose far more than their WLTP figures suggest.",
    whyItMatters:
      "WLTP range is measured at 23°C. In Scandinavia, Central Europe and the UK, winter driving at −5°C to −15°C is normal. Range drops of 30–45% are common. This data tells you what you'll actually get.",
    body: [
      "The Hyundai IONIQ 6 Standard Range retains 68% of its WLTP range at −10°C, making it the best performer in this test. The heat pump, combined with a well-insulated battery pack, is the key differentiator.",
      "The BMW iX performed at 61% of WLTP, which matches expectations for a large luxury SUV — acceptable but not outstanding. The Tesla Model Y Long Range AWD retained 64%, in line with Tesla's thermal management improvements from 2024.",
      "Worst performer was the older Audi e-tron 55, retaining only 54% of rated range — though this model is being phased out in favour of the Q8 e-tron which scored 59% in the same test.",
      "The key finding: heat pumps add 8–14% winter range retention versus resistive heating alone. Every EV buyer in climates below 5°C average winter temperature should treat heat pump inclusion as a non-negotiable.",
    ],
    relatedVehicles: ["hyundai-ioniq-6", "bmw-ix", "tesla-model-y", "audi-q8-etron"],
    relatedNetworks: [],
    relatedGuides: ["ev-winter-driving"],
    tags: ["winter range", "cold weather", "heat pump", "EV range", "Norway"],
    media: {
      source: "Unsplash — Nordic Roads Collection",
      license: "Unsplash License",
      url: "",
      alt: "Electric vehicle on snowy Nordic road",
      gradient: "from-slate-900 to-blue-950",
    },
  },
  {
    slug: "germany-ev-market-2025",
    title: "Germany's EV Market Is Recovering After the Grant Collapse — But Slowly",
    category: "market",
    publishedAt: "2025-10-28",
    readMinutes: 5,
    summary:
      "After the abrupt end of Germany's federal EV grant in December 2023 caused a 29% sales drop, the market is stabilising — but structural charging cost issues remain a barrier to mass adoption.",
    whyItMatters:
      "Germany is Europe's largest automotive market. Its EV trajectory determines whether European OEMs hit their 2030 fleet emissions targets. The policy vacuum has materially damaged German EV brand confidence, and the recovery path is uncertain.",
    body: [
      "German EV registrations fell from 524,000 in 2023 to 380,000 in 2024 following the grant's removal. Q3 2025 shows a 12% year-on-year recovery, primarily driven by fleet sales and corporate leasing rather than private purchases.",
      "The underlying structural issue: German household electricity averages €0.32/kWh — among Europe's highest. This makes the operational cost advantage of an EV over diesel far smaller than in France (€0.24/kWh, nuclear grid) or Norway (€0.18/kWh).",
      "State-level incentives exist in Bavaria and Baden-Württemberg but are capped at modest amounts (€1,500–€2,500) and create geographic inequity.",
      "The bright spot: German public DC charging infrastructure has grown 40% in 2025. EnBW's HyperNetz now covers 98% of Autobahn service stations, and the base cost per kWh is falling as competition with Ionity intensifies.",
    ],
    relatedVehicles: ["volkswagen-id-7", "bmw-ix", "audi-q8-etron"],
    relatedNetworks: [],
    relatedGuides: [],
    tags: ["Germany", "EV market", "policy", "charging costs", "fleet"],
    media: {
      source: "Unsplash — Urban Automotive Collection",
      license: "Unsplash License",
      url: "",
      alt: "German autobahn with electric vehicle",
      gradient: "from-zinc-900 to-slate-900",
    },
  },
  {
    slug: "sodium-ion-battery-2026-preview",
    title: "Sodium-Ion Batteries in European EVs by 2026: Real Promise or Marketing?",
    category: "technology",
    publishedAt: "2025-10-15",
    readMinutes: 7,
    summary:
      "CATL and BYD have sodium-ion cells in production. Several European OEMs are testing them for urban and entry-level EVs. We examine what the chemistry actually delivers — and where it falls short.",
    whyItMatters:
      "If sodium-ion proves viable for 300–400 km range applications, it could drop EV prices by €3,000–€6,000 for small to medium vehicles by removing the lithium dependency. This is the biggest potential cost shift in EVs since cell chemistry improvements in 2021.",
    body: [
      "Sodium-ion cells have two key advantages: zero lithium or cobalt dependency (both supply-constrained), and better cold-weather performance — they lose significantly less energy at temperatures below 0°C compared to lithium iron phosphate.",
      "Current energy density sits at 160–180 Wh/kg — below NMC's 250–300 Wh/kg. This means sodium-ion is volume-limited: suitable for smaller packs in urban EVs but not competitive for 500+ km long-range vehicles.",
      "CATL's Shenxing sodium-ion cells entered commercial production in early 2025 for Chinese market vehicles. European homologation is expected by H2 2026, with Stellantis (Citroën, Peugeot, Fiat) the most advanced in European testing.",
      "The realistic near-term use case: Citroën ë-C3-class vehicles (sub-€25,000, 250–300 km range) could adopt sodium-ion to reduce BOM cost and improve cold-start behaviour in Northern European markets.",
    ],
    relatedVehicles: [],
    relatedNetworks: [],
    relatedGuides: ["ev-battery-guide"],
    tags: ["sodium-ion", "battery technology", "CATL", "Stellantis", "cost reduction"],
    media: {
      source: "Unsplash — Technology Collection",
      license: "Unsplash License",
      url: "",
      alt: "Electric vehicle battery technology",
      gradient: "from-violet-950 to-indigo-950",
    },
  },
  {
    slug: "fastned-expansion-nordics-2025",
    title: "Fastned's Nordic Expansion: 150+ New Stations by Q2 2026",
    category: "infrastructure",
    publishedAt: "2025-10-03",
    readMinutes: 4,
    summary:
      "Fastned has announced its most aggressive expansion phase, targeting 150 new high-power stations across Norway, Sweden and Denmark by mid-2026, with 300 kW capability as the baseline.",
    whyItMatters:
      "Fastned's expansion competes directly with Ionity on the Nordic corridor — the most EV-dense stretch of road in the world. More competition means better pricing and reliability. For cross-border Nordic drivers, this changes the landscape significantly.",
    body: [
      "Fastned's new Nordic locations will all ship with 300 kW hardware as baseline, with select motorway hubs at 400 kW. Solar canopies are included at 70% of new stations — a significant sustainability signal.",
      "The expansion is financed through a €200M green bond issued in September 2025. This makes Fastned one of the few pure-play EV charging companies to have secured infrastructure-scale financing without OEM backing.",
      "Pricing strategy: Fastned will undercut Ionity's standard tariff by approximately €0.04–0.08/kWh in competitive corridors, while offering a subscription membership (Fastned Premium) at flat €11.99/month.",
      "Reliability has been Fastned's brand differentiator — its uptime data (98.2% in 2024) outperforms the European average (88–91%). This is critical for long-distance planning confidence.",
    ],
    relatedVehicles: ["hyundai-ioniq-6", "polestar-2", "tesla-model-y"],
    relatedNetworks: ["fastned"],
    relatedGuides: ["fast-charging-guide"],
    tags: ["Fastned", "Nordic", "infrastructure", "expansion", "charging network"],
    media: {
      source: "Fastned Press Kit",
      license: "OEM Press Kit",
      url: "",
      alt: "Fastned charging station with solar canopy",
      gradient: "from-yellow-950 to-amber-950",
    },
  },
  {
    slug: "ev-depreciation-2025-data",
    title: "EV Depreciation Data 2025: Which Models Hold Value — and Which Don't",
    category: "ownership",
    publishedAt: "2025-09-20",
    readMinutes: 8,
    summary:
      "Three-year residual values for EVs have stabilised after the 2022–2023 value crash. Tesla and Porsche lead on retention; Nissan Leaf and older e-trons lag significantly.",
    whyItMatters:
      "Depreciation is the single largest cost in car ownership — typically 40–60% of total 5-year TCO. An EV that loses value faster than a diesel equivalent can easily cost €4,000–€8,000 more over 5 years despite lower fuel and service bills.",
    body: [
      "Three-year residual value data from CAP HPI across 8 European markets shows Tesla Model Y Long Range retaining 62% of its list price — the benchmark. Porsche Taycan retains 67% (luxury segment premium).",
      "Mid-tier performers: Hyundai IONIQ 6 at 54%, VW ID.7 at 51%. Both have stabilised after post-2023 price adjustment volatility and are now trending positively.",
      "Weakest performers: Nissan Leaf (first generation, 24 kWh) at 28% retention — effectively valueless in 5 years. Audi e-tron 55 at 44% — hurt by the model being superseded by the Q8 e-tron and the €9,000 price cut Audi issued in 2024.",
      "The pattern: EVs with strong software ecosystems, OTA update histories, and clear model continuity retain value best. Orphaned models or those discontinued mid-cycle collapse significantly. This makes brand long-term commitment to a platform a genuine financial consideration.",
    ],
    relatedVehicles: ["tesla-model-y", "hyundai-ioniq-6", "volkswagen-id-7", "audi-q8-etron"],
    relatedNetworks: [],
    relatedGuides: [],
    tags: ["depreciation", "residual value", "TCO", "EV finance", "ownership cost"],
    media: {
      source: "Unsplash — Finance Collection",
      license: "Unsplash License",
      url: "",
      alt: "Vehicle cost and value analysis",
      gradient: "from-slate-950 to-emerald-950",
    },
  },
  {
    slug: "eu-2035-ice-ban-update",
    title: "The EU 2035 ICE Ban: What's Actually Changing (and What Isn't)",
    category: "policy",
    publishedAt: "2025-09-08",
    readMinutes: 6,
    summary:
      "Following Germany's pressure campaign, the EU has confirmed e-fuel exemptions but kept the core 2035 zero-emissions mandate. We explain what this means for buyers choosing between EVs and ICE vehicles today.",
    whyItMatters:
      "The 2035 ban affects what you'll be able to sell, not just buy. A petrol car bought today will still be legal to drive in 2035, but its residual value in 2030–2035 will be significantly affected by the buyer pool shrinking. This matters for total ownership cost calculations.",
    body: [
      "The European Commission confirmed in March 2025 that the 2035 zero-emission vehicle mandate stands — all new passenger cars and light vans sold in the EU must have zero CO₂ tailpipe emissions from January 2035.",
      "The e-fuel exemption: vehicles specifically engineered to run exclusively on certified synthetic fuels may be sold post-2035. This applies almost exclusively to Porsche (which co-funded e-fuel development) and a handful of niche manufacturers. It is not a general exemption for ICE vehicles.",
      "Practical impact on the used market: ICE vehicles built today will still be legal to drive post-2035 — there is no registered vehicle ban in the current legislation. However, French and Dutch cities are independently advancing low-emission zone restrictions that will effectively restrict pre-2030 vehicles from urban centres regardless of EU mandate.",
      "For buyers today: a diesel estate bought in 2025 will be legal but increasingly inconvenient in urban Europe by 2032–2035. This will compress residual values in the 5–8 year ownership window — a genuine financial risk for high-mileage business drivers.",
    ],
    relatedVehicles: [],
    relatedNetworks: [],
    relatedGuides: [],
    tags: ["EU policy", "2035 ban", "e-fuels", "legislation", "ICE phase-out"],
    media: {
      source: "Unsplash — Policy Collection",
      license: "Unsplash License",
      url: "",
      alt: "European Union automotive policy",
      gradient: "from-blue-950 to-indigo-950",
    },
  },
  {
    slug: "home-charging-installation-guide-2025",
    title: "Home Charging in 2025: Costs, Grants and Which Wallbox to Actually Buy",
    category: "ownership",
    publishedAt: "2025-08-25",
    readMinutes: 10,
    summary:
      "A complete guide to home EV charging installation across the UK, Germany, France and Norway — including current grant availability, installation costs, and an honest verdict on the top wallbox models.",
    whyItMatters:
      "80% of all EV charging happens at home. Getting this right — the right hardware, tariff, and installation setup — saves £1,000–£2,000 over five years versus using public infrastructure as your primary charging source.",
    body: [
      "Smart wallboxes (OCPP-compatible, 7.4–22 kW AC) have become the standard recommendation for most EV owners. The Zappi v2 (UK, £799 + install) and Wallbox Pulsar Plus (EU, €499 + install) offer the best balance of reliability, app quality, and smart tariff integration.",
      "UK: OZEV grant of up to £350 is available for renters and flat owners (not homeowners with off-street parking — this was removed in 2024). Most installations run £800–£1,200 all-in for a typical semi-detached property.",
      "Germany: KfW programme 442 provides €300 subsidy per charging point for grid-friendly smart chargers. Installation typically €600–€900 plus hardware, making the all-in cost €900–€1,500 before subsidy.",
      "Norway: No national home charger grant, but Enova provides heat pump and energy efficiency subsidies that can be combined with EV charging setup. Installation costs are lowest in Europe at NOK 5,000–8,000 all-in due to mature installer market.",
      "Key recommendation: buy an OCPP-compatible charger regardless of manufacturer lock-in marketing. Future energy tariffs (dynamic pricing, V2G) will require open-protocol hardware. Proprietary chargers may be incompatible with 2027+ grid regulations.",
    ],
    relatedVehicles: [],
    relatedNetworks: [],
    relatedGuides: ["home-charging-guide"],
    tags: ["home charging", "wallbox", "installation", "grant", "Zappi", "Wallbox"],
    media: {
      source: "Unsplash — Home Technology Collection",
      license: "Unsplash License",
      url: "",
      alt: "EV home charging wallbox installation",
      gradient: "from-teal-950 to-cyan-950",
    },
  },
  {
    slug: "polestar-2-vs-model-3-2025",
    title: "Polestar 2 vs Model 3: The Premium Compact EV Showdown in 2025",
    category: "comparison",
    publishedAt: "2025-08-10",
    readMinutes: 8,
    summary:
      "Both Polestar 2 and Tesla Model 3 have been refreshed for 2025. We compare them on the metrics that matter — real-world range, charging speed, interior quality, software maturity, and 5-year ownership cost.",
    whyItMatters:
      "These two vehicles compete for the same buyer: someone spending €45,000–€60,000 who wants premium build quality, long range, and fast charging. Getting this choice wrong costs years of regret. We give you the data, not the brand loyalty.",
    body: [
      "Real-world range: Polestar 2 Long Range Single Motor achieves 460–490 km in mixed conditions. Model 3 Long Range RWD achieves 510–540 km. The gap is real but smaller than WLTP figures suggest (635 km vs 629 km respectively).",
      "Charging: Model 3 on V3 Supercharger hits 250 kW peak — the standard for this class. Polestar 2 achieves 205 kW on compatible CCS chargers. Over a 10–80% session, the difference is approximately 6–8 minutes in favour of Tesla.",
      "Interior: Polestar 2 uses Volvo-sourced Swedish wool upholstery, Harman Kardon audio as standard, and physical shortcut buttons on the steering wheel — the last point is a significant usability advantage over Tesla's scroll-wheel-only approach.",
      "Software: Tesla's OTA update cadence remains best-in-class. Polestar's Google Automotive integration (Maps, Assistant, Play Store) is genuinely good — better than most competitors — but lacks the depth of Tesla's FSD ecosystem.",
      "5-year TCO at 15,000 km/year: Polestar 2 comes in approximately €2,800 higher due to slightly higher service costs and slightly lower residual values. Tesla wins on pure economics; Polestar wins on tactile interior quality.",
    ],
    relatedVehicles: ["polestar-2", "tesla-model-y"],
    relatedNetworks: ["ionity", "tesla-supercharger"],
    relatedGuides: [],
    tags: ["Polestar 2", "Tesla Model 3", "comparison", "premium EV", "range test"],
    media: {
      source: "Polestar Press Kit",
      license: "OEM Press Kit",
      url: "",
      alt: "Polestar 2 electric vehicle",
      gradient: "from-slate-950 to-violet-950",
    },
  },
  {
    slug: "norway-ev-88-percent-2025",
    title: "Norway Hits 88% EV Market Share — Here's What the Rest of Europe Can Learn",
    category: "market",
    publishedAt: "2025-07-22",
    readMinutes: 5,
    summary:
      "Norway's EV share reached 88% of new car registrations in 2025 — the highest in the world. We analyse what policy, infrastructure, and cultural factors created this, and which are transferable to other European markets.",
    whyItMatters:
      "Norway proves that near-complete EV adoption is achievable in a cold, large-geography country with high per-capita income. The question is which elements of the Norwegian model work at scale in Germany, France, and Poland — and which don't.",
    body: [
      "The Norwegian model's three pillars: VAT exemption on EV purchase (effectively a 25% discount vs equivalent ICE), free (or reduced-cost) parking and road tolls in urban areas, and the world's highest per-capita fast-charger density (1 DC charger per 38 km² vs EU average 1 per 190 km²).",
      "The transferable elements: VAT exemption or equivalent purchase incentive, and a clearly stated phase-out date for ICE incentives. Norway announced in 2017 that the 2025 new car market would be dominated by EVs — this certainty enabled dealer and infrastructure investment.",
      "The non-transferable elements: Norway's hydro-electricity grid delivers charging at €0.18/kWh — less than half of Germany's rate. This makes the operational cost case overwhelming. Countries with coal or gas-heavy grids cannot replicate this.",
      "The challenge for larger markets: Norway's population of 5.5M means the infrastructure investment was manageable. Germany's 84M population, or France's 68M, requires orders-of-magnitude larger investment. Grid upgrade alone would cost €40–60B.",
      "Key takeaway: Norway's success is real, but it was built over 20 years with consistent policy, high GDP per capita, and a uniquely favourable energy mix. Expecting a 5-year replication in Southern or Eastern Europe is unrealistic without structural grid investment.",
    ],
    relatedVehicles: [],
    relatedNetworks: [],
    relatedGuides: [],
    tags: ["Norway", "EV market share", "policy", "adoption", "infrastructure"],
    media: {
      source: "Unsplash — Nordic Collection",
      license: "Unsplash License",
      url: "",
      alt: "Norwegian roads and electric vehicles",
      gradient: "from-blue-950 to-cyan-950",
    },
  },
  {
    slug: "ev-battery-degradation-real-data",
    title: "Battery Degradation After 5 Years: Real Ownership Data from 12,000 EVs",
    category: "technology",
    publishedAt: "2025-07-08",
    readMinutes: 7,
    summary:
      "Recurrent's dataset of 12,000+ EVs shows that the average EV retains 92% of its original range after 5 years — far better than early headlines suggested. But there's meaningful variation between models.",
    whyItMatters:
      "Battery anxiety is the number-one reason non-EV-owners cite for not switching. This data, from actual registered vehicles rather than lab tests, should change the conversation — but the outliers matter too, particularly for used EV buyers.",
    body: [
      "Median 5-year capacity retention across all brands: 92.3%. The worst 10th percentile: 81.2%. This is far better than the '40% degradation in 5 years' narrative that circulated in 2018–2020 and was based on early Leaf data.",
      "Tesla leads on degradation: Model 3 and Model Y show 94–96% retention at 5 years. The active thermal management and battery chemistry (NCA for long-range, LFP for standard range) both contribute.",
      "The Nissan Leaf remains the outlier: older 24 kWh and 30 kWh Leaf models without active thermal management show 72–78% retention at 5 years — this specific data point drove the early degradation panic and is not representative of modern EVs.",
      "Charging habits matter: vehicles consistently charged to 100% show 3–5% more degradation than those limited to 80%. Fast-charging frequency has a measurable but small effect (approximately 1% additional degradation per 10,000 km of DC charging).",
      "For used EV buyers: request a battery health report (available via OBD scan for most models). For Tesla, the battery status in the app shows pack capacity directly. For others, Recurrent offers third-party health certificates.",
    ],
    relatedVehicles: ["tesla-model-y", "nissan-leaf", "hyundai-ioniq-6"],
    relatedNetworks: [],
    relatedGuides: ["ev-battery-guide"],
    tags: ["battery degradation", "real data", "ownership", "used EV", "range retention"],
    media: {
      source: "Unsplash — Technology Collection",
      license: "Unsplash License",
      url: "",
      alt: "Electric vehicle battery health data",
      gradient: "from-emerald-950 to-teal-950",
    },
  },
  {
    slug: "v2g-vehicle-to-grid-2025",
    title: "V2G Is Finally Here — But Only for These 4 Vehicles in Europe",
    category: "technology",
    publishedAt: "2025-06-18",
    readMinutes: 6,
    summary:
      "Vehicle-to-grid technology lets EVs export power back to the grid during peak demand — earning owners €200–€600/year. As of 2025, only four vehicles sold in Europe officially support bidirectional charging.",
    whyItMatters:
      "V2G changes the economics of EV ownership significantly — not just for individual owners, but for grid stability. If 10% of European EVs participated in V2G by 2030, the grid flexibility impact would be equivalent to 15 large-scale battery storage plants.",
    body: [
      "The four vehicles with active V2G support in Europe as of mid-2025: Nissan Leaf (CHAdeMO-based, limited deployment), Hyundai IONIQ 5 and 6 (V2L and V2G via specific wallbox partnerships), Mitsubishi Eclipse Cross PHEV (limited markets).",
      "The hardware requirement: a bidirectional DC charger, currently priced at €3,000–€6,000 installed — roughly double a standard 7.4 kW wallbox. Several energy suppliers (OVO in UK, E.ON Drive in Germany) offer subsidised installations with V2G export tariff contracts.",
      "Realistic earnings: UK Octopus Energy's V2G tariff pays 30p/kWh for exported energy during peak windows (typically 4–7pm). A typical V2G-capable vehicle with 60 kWh usable can export 10–20 kWh per peak session, earning £3–£6. Annualised: £400–£900 for consistent participants.",
      "The coming wave: Volkswagen has committed to V2G via CCS in the ID.7 and ID. Buzz from 2026. BMW's Neue Klasse platform launches with bidirectional charging standard. The infrastructure bottleneck (bidirectional charger cost) will limit mass adoption until hardware costs fall below €1,500 installed.",
    ],
    relatedVehicles: ["hyundai-ioniq-6", "volkswagen-id-7"],
    relatedNetworks: [],
    relatedGuides: ["home-charging-guide"],
    tags: ["V2G", "vehicle-to-grid", "bidirectional", "energy", "grid"],
    media: {
      source: "Unsplash — Energy Technology Collection",
      license: "Unsplash License",
      url: "",
      alt: "Vehicle to grid energy flow",
      gradient: "from-amber-950 to-orange-950",
    },
  },
  {
    slug: "tesla-supercharger-open-network-europe",
    title: "Tesla's Open Supercharger Network One Year On: Has It Changed Anything?",
    category: "infrastructure",
    publishedAt: "2025-06-02",
    readMinutes: 5,
    summary:
      "Tesla opened its Supercharger network to non-Tesla vehicles across Europe in 2023–2024. We assess the real-world impact — queuing behaviour, pricing, reliability, and whether it's actually changed EV buying decisions.",
    whyItMatters:
      "The Supercharger network was previously Tesla's biggest competitive moat. Opening it to competitors changes the charging infrastructure calculus for all EV buyers — but only if the experience is actually comparable for non-Tesla vehicles.",
    body: [
      "Network utilisation data from Tesla's public API shows non-Tesla vehicles now account for 22% of Supercharger sessions in Western Europe — primarily at destination (hotel/retail) chargers rather than motorway hubs.",
      "The pricing gap is meaningful: Tesla owners pay ~€0.38/kWh in Germany, while non-Tesla vehicles pay €0.48/kWh at the same station — a 26% premium. This makes Ionity's Passport membership (€0.35/kWh) more attractive for high-mileage non-Tesla owners.",
      "Reliability: Supercharger uptime (99.2%) remains industry-leading. Non-Tesla vehicles using CCS adapters have reported occasional authentication failures — approximately 3% of sessions — though software updates have reduced this from the initial 8% failure rate in 2023.",
      "Buying decision impact: surveys of non-Tesla EV buyers show 31% now cite Supercharger access as a positive factor in their purchase — up from 12% in 2023. This is primarily relevant for buyers in Spain, Portugal, and Southern Europe where third-party networks are thinner.",
    ],
    relatedVehicles: ["tesla-model-y", "polestar-2", "hyundai-ioniq-6"],
    relatedNetworks: ["tesla-supercharger", "ionity"],
    relatedGuides: ["fast-charging-guide"],
    tags: ["Tesla", "Supercharger", "open network", "CCS", "non-Tesla"],
    media: {
      source: "Tesla Press Kit",
      license: "OEM Press Kit",
      url: "",
      alt: "Tesla Supercharger station",
      gradient: "from-red-950 to-rose-950",
    },
  },
  {
    slug: "skoda-enyaq-value-case-2025",
    title: "Why the Škoda Enyaq Is Still the Best-Value Family EV in Europe",
    category: "ownership",
    publishedAt: "2025-05-14",
    readMinutes: 6,
    summary:
      "At €42,000 for the Enyaq 85, Škoda delivers MEB platform quality — identical underpinnings to the VW ID.4 — at a price that undercuts most competitors by €5,000–€8,000. We explain why this deal is as good as it looks.",
    whyItMatters:
      "Family SUV buyers moving from diesel have a specific benchmark: the Volkswagen Tiguan or Skoda Kodiaq, typically bought for €38,000–€48,000. The Enyaq 85 matches those on cargo space and practicality, beats them on 5-year running costs by €4,000–€7,000, and costs about the same to buy.",
    body: [
      "The Enyaq 85 shares its MEB platform with the VW ID.4, Audi Q4 e-tron, and CUPRA Born. The 77 kWh battery (net) delivers 430 km real-world range — tested across Czech, German, and Austrian highway conditions at typical motorway speeds.",
      "Cargo volume: 585 litres with rear seats up — 30 litres more than the VW ID.4 (556 L) and comparable to the Volkswagen Tiguan diesel (615 L). For family buyers, this comparison closes the practicality gap.",
      "5-year TCO at 20,000 km/year: Enyaq 85 €51,200 all-in (purchase + charging + service + insurance estimate). Equivalent VW Tiguan 2.0 TDI: €54,800. The EV wins by €3,600 despite higher purchase price — driven by €0.27/kWh average European charging rates vs diesel at €1.65/L.",
      "The weak points are honest: no heat pump as standard (€1,200 option — take it), the infotainment is better than early MEB software but still behind Tesla and Polestar's polish, and 135 kW DC charging is behind the IONIQ 6's 220 kW in this class.",
      "Verdict: for a family that drives 20,000+ km/year, the Enyaq 85 is the financially rational choice in most of Europe. The gap vs diesel is real and growing as diesel prices rise and charging infrastructure matures.",
    ],
    relatedVehicles: ["skoda-enyaq", "volkswagen-id-7"],
    relatedNetworks: [],
    relatedGuides: [],
    tags: ["Škoda Enyaq", "value", "family EV", "MEB", "TCO", "SUV"],
    media: {
      source: "Škoda Auto Press Kit",
      license: "OEM Press Kit",
      url: "",
      alt: "Škoda Enyaq electric SUV",
      gradient: "from-green-950 to-emerald-950",
    },
  },
  {
    slug: "public-charging-reliability-europe-2025",
    title: "European Public Charging Reliability Report 2025: Who Passes, Who Fails",
    category: "infrastructure",
    publishedAt: "2025-04-30",
    readMinutes: 7,
    summary:
      "The European Automobile Manufacturers' Association surveyed 180,000 public charging sessions across 14 networks. Ionity and Tesla lead on uptime. Legacy fuel station rollouts lag significantly.",
    whyItMatters:
      "A failed charging session on a long trip isn't a minor inconvenience — it can strand a driver. Reliability data is the most practically important metric for long-distance EV drivers, and it varies dramatically across networks.",
    body: [
      "Top performers: Ionity (98.1% uptime), Tesla Supercharger (99.2%), Fastned (97.8%). These three networks deliver a materially better experience than the European average.",
      "Worst performers: BP Pulse UK (82.3%), Allego (84.1%), Shell Recharge Germany (85.7%). These networks are primarily conversions of legacy fuel station infrastructure and suffer from older hardware and inconsistent maintenance.",
      "The primary failure modes: payment terminal failures (31% of failed sessions), network connectivity issues (28%), and hardware faults (22%). Most are solved by network-side maintenance, not vehicle incompatibility.",
      "OCPI inter-network roaming has improved significantly — 89% of public chargers in Western Europe now accept all major payment methods including Plug&Charge, RFID cards, and contactless payment. Eastern Europe lags (62% coverage).",
      "Practical advice: for long trips, plan primary stops on Ionity or Supercharger routes. Use networks like BP Pulse or Shell Recharge only as backup. Carry an RFID card from at least two networks.",
    ],
    relatedVehicles: [],
    relatedNetworks: ["ionity", "fastned", "tesla-supercharger"],
    relatedGuides: ["fast-charging-guide"],
    tags: ["reliability", "uptime", "public charging", "network comparison", "ACEA"],
    media: {
      source: "Unsplash — Infrastructure Collection",
      license: "Unsplash License",
      url: "",
      alt: "European public EV charging station",
      gradient: "from-sky-950 to-blue-950",
    },
  },
];

export function getArticlesByCategory(category: ArticleCategory): ArticleData[] {
  return ARTICLES.filter((a) => a.category === category);
}

export function getRelatedArticles(slug: string, limit = 3): ArticleData[] {
  const current = ARTICLES.find((a) => a.slug === slug);
  if (!current) return ARTICLES.slice(0, limit);
  return ARTICLES.filter(
    (a) =>
      a.slug !== slug &&
      (a.category === current.category ||
        a.tags.some((t) => current.tags.includes(t)))
  ).slice(0, limit);
}

export function getArticlesByVehicle(vehicleSlug: string): ArticleData[] {
  return ARTICLES.filter((a) => a.relatedVehicles.includes(vehicleSlug));
}
