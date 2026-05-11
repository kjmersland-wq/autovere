/**
 * Per-article AI intelligence data.
 * Keyed by article slug. Populated for all published articles.
 * Fields are optional — only show blocks where data exists.
 */

export interface ArticleIntelligence {
  aiSummary: string;
  whatChanged?: string;
  ownershipImpact?: string;
  chargingImplications?: string;
  winterImpact?: string;
  longDistanceSuitability?: string;
  bestAlternatives?: { slug: string; reason: string }[];
  policyImplications?: string;
  marketImplications?: string;
  trendingScore?: number;
}

const INTELLIGENCE: Record<string, ArticleIntelligence> = {
  "ionity-gen2-chargers-rollout-2025": {
    aiSummary:
      "Ionity's 400 kW Gen 2 hardware is being installed at 300 European stations by end of 2025. Most current EVs can't accept full 400 kW, but sustained charging speeds and reliability improve across the board.",
    whatChanged:
      "Gen 2 replaces 50–350 kW hardware at existing Ionity stations. Nordic corridor prioritised first. Pricing unchanged — existing Ionity Passport memberships valid.",
    chargingImplications:
      "If your EV accepts over 200 kW DC, plan routes via the updated Nordic corridor for noticeably shorter stops. 10–80% sessions at 200+ kW stations typically run 22–28 minutes vs 35+ minutes on older units.",
    ownershipImpact:
      "No subscription changes. Existing Ionity memberships transfer automatically. If you're buying a new EV, vehicles with 200+ kW DC acceptance (IONIQ 6, Polestar 2, upcoming Neue Klasse) get the most benefit.",
    longDistanceSuitability:
      "Improved significantly for high-acceptance EVs on the Oslo–Stockholm–Copenhagen and German Autobahn corridors. Average stop frequency unchanged but session times drop.",
    trendingScore: 88,
  },

  "real-world-winter-range-2025": {
    aiSummary:
      "Independent cold-weather testing at −10°C shows most EVs retain 60–70% of WLTP range. The IONIQ 6 leads with 68% retention. Heat pumps add 8–14% over resistive heating.",
    whatChanged:
      "2025 data updates 2023 benchmarks. IONIQ 6 displaces Tesla Model Y as cold-weather leader. BMW iX holds steady at 61% — acceptable for its class.",
    winterImpact:
      "Budget 30–45% more charge time or stops on winter long trips. In practical terms: a 430 km real-world summer route becomes a 290–300 km usable range in winter. Plan stops accordingly.",
    ownershipImpact:
      "For buyers in Central/Northern Europe: heat pump is no longer optional — it's essential. Its absence adds €200–400/year in additional winter energy cost and noticeably longer journey times.",
    chargingImplications:
      "DC charging efficiency drops in cold: batteries must pre-condition to accept peak power. Allow 10–15 minutes of cabin heating before a planned DC stop for best results.",
    bestAlternatives: [
      { slug: "hyundai-ioniq-6", reason: "Best-in-class winter range retention at 68%" },
      { slug: "tesla-model-y", reason: "Strong thermal management, 64% winter retention" },
      { slug: "bmw-ix", reason: "Acceptable 61% retention with premium cabin comfort" },
    ],
    trendingScore: 92,
  },

  "germany-ev-market-2025": {
    aiSummary:
      "Germany's EV market is recovering after the 2023 grant collapse, with Q3 2025 showing 12% year-on-year growth. However, structural electricity cost issues (€0.32/kWh) limit the operational savings case vs diesel.",
    whatChanged:
      "Recovery is fleet-led, not private-buyer-led. Public DC charging infrastructure has grown 40% in 2025. EnBW's HyperNetz now covers 98% of Autobahn service stations.",
    marketImplications:
      "Germany remains Europe's hardest EV market to sell into. OEMs offering direct fleet pricing and company car tax benefits are outperforming retail. Private EV buyers need 3–5 years of ownership to break even vs diesel.",
    policyImplications:
      "No federal grant expected in 2025–2026. State-level incentives (Bavaria, Baden-Württemberg) partially compensate but create geographic inequity. Fleet operators benefit most from existing Dienstwagen tax reform.",
    ownershipImpact:
      "German EV buyers: factor €0.32/kWh home charging into TCO. At this rate, operational savings vs diesel are €600–1,200/year — positive but smaller than in France or Norway.",
    trendingScore: 75,
  },

  "sodium-ion-battery-2026-preview": {
    aiSummary:
      "Sodium-ion batteries from CATL and BYD are in commercial production for the Chinese market. European homologation expected H2 2026, targeting sub-€25,000 urban EVs. Energy density remains below lithium, limiting range to 250–350 km.",
    whatChanged:
      "CATL's Shenxing sodium-ion cells entered production in early 2025. Stellantis confirmed European testing. Timeline to first European sodium-ion production vehicle now credible within 18–24 months.",
    ownershipImpact:
      "No immediate change for buyers today. If buying in late 2026 or 2027, an entry-level Citroën or Peugeot with sodium-ion may offer €3,000–6,000 lower purchase price vs equivalent lithium.",
    winterImpact:
      "Sodium-ion performs better than LFP in cold: retains higher capacity at 0°C and below. For short-range urban EVs in Northern Europe, this is a meaningful advantage over current entry-level alternatives.",
    chargingImplications:
      "Sodium-ion cells accept charge at low temperatures without the warming cycle required by NMC and NCA chemistry — reducing cold-weather DC charging friction.",
    trendingScore: 71,
  },

  "fastned-expansion-nordics-2025": {
    aiSummary:
      "Fastned is adding 150+ stations across Norway, Sweden and Denmark by Q2 2026, financed by a €200M green bond. All new stations open with 300 kW baseline and 98%+ uptime — the highest in the industry.",
    whatChanged:
      "Fastned's Nordic expansion is its most aggressive to date. 70% of new stations include solar canopies. A new Fastned Premium subscription at €11.99/month undercuts Ionity on competitive corridors.",
    chargingImplications:
      "Nordic drivers gain a credible alternative to Ionity on key corridors. Pricing competition will likely push per-kWh costs down by €0.04–0.08 on routes where both networks compete.",
    longDistanceSuitability:
      "Cross-border Nordic routes improve significantly. Stockholm–Oslo and Copenhagen–Oslo corridors will have Fastned + Ionity competing side-by-side at most major stops by mid-2026.",
    ownershipImpact:
      "Consider Fastned Premium membership if you drive long-distance in Nordic countries regularly. At €11.99/month it pays back at around 3 DC sessions/month vs standard public tariffs.",
    trendingScore: 83,
  },

  "ev-depreciation-2025-data": {
    aiSummary:
      "Three-year residual values have stabilised after the 2022–2023 crash. Tesla and Porsche lead at 62–67% retention. Mid-tier (IONIQ 6, ID.7) holds at 51–54%. Older, discontinued models remain worst-hit.",
    whatChanged:
      "2025 CAP HPI data shows the post-Tesla price-cut volatility stabilising. IONIQ 6 and ID.7 trending positively after 2023–2024 turbulence. Nissan Leaf (24/30 kWh) remains worst performer at 28%.",
    ownershipImpact:
      "Depreciation is the single largest cost in EV ownership — typically 40–60% of 5-year TCO. Choosing a model with strong residual retention (Tesla, Hyundai, Polestar) vs a weaker one is worth €4,000–8,000 over 5 years.",
    marketImplications:
      "Used EV market is recovering. 2021–2022 EVs now entering the 3-year sweet spot for used buyers. Request OBD battery health scan before purchase — especially on Leaf and early Audi e-tron.",
    bestAlternatives: [
      { slug: "tesla-model-y", reason: "62% 3-year retention — benchmark for the class" },
      { slug: "hyundai-ioniq-6", reason: "54% and trending up as the model matures" },
      { slug: "polestar-2", reason: "Strong brand positioning limits value loss" },
    ],
    trendingScore: 85,
  },

  "eu-2035-ice-ban-update": {
    aiSummary:
      "The EU 2035 ICE mandate is confirmed. E-fuel exemptions exist but apply only to Porsche and niche manufacturers — not a general reprieve for ICE vehicles. ICE cars built today remain legal to drive post-2035.",
    whatChanged:
      "March 2025 confirmed the mandate stands. E-fuel exemption is narrower than early reports suggested. French and Dutch cities are advancing independent urban low-emission zones faster than the EU timeline.",
    policyImplications:
      "OEMs now have a locked mandate. Fleet buyers should assume 2030 models will be EV-only for all volume manufacturers. Company car policies need updating to reflect this timeline.",
    ownershipImpact:
      "A petrol/diesel car bought today remains legal to drive past 2035, but its resale value in 2030–2032 will be compressed as the buyer pool shrinks — particularly for high-mileage business drivers who sell at 3–4 years.",
    marketImplications:
      "Southern and Eastern European markets face the steepest adjustment. Infrastructure and grid readiness in these markets lags significantly behind the 2035 target.",
    trendingScore: 72,
  },

  "home-charging-installation-guide-2025": {
    aiSummary:
      "Smart wallbox installation costs €800–1,500 all-in across UK, Germany and France. OCPP-compatible hardware is essential for future V2G and dynamic tariff compatibility. Grant availability varies significantly by country.",
    whatChanged:
      "UK OZEV grant now covers only renters and flat owners (homeowner grant removed 2024). German KfW 442 provides €300/point. Hardware costs continue to fall — Wallbox Pulsar Plus now €499 in Europe.",
    chargingImplications:
      "80% of all EV charging happens at home. Getting the right wallbox now avoids a second installation when V2G hardware becomes affordable (projected 2026–2027). OCPP compatibility is the key future-proofing requirement.",
    ownershipImpact:
      "Correct home setup saves €1,000–2,000 over 5 years vs using primarily public charging. Smart wallbox + off-peak tariff (typically €0.08–0.14/kWh overnight) vs public DC at €0.45–0.65/kWh is the core saving.",
    winterImpact:
      "Pre-conditioning from a home charger before cold-morning departure adds 10–15% effective range for the first 30–40 km. Particularly relevant in Scandinavia and Central Europe.",
    trendingScore: 78,
  },

  "polestar-2-vs-model-3-2025": {
    aiSummary:
      "Polestar 2 and Model 3 refresh in 2025 both deliver 460–540 km real-world range. Tesla wins on charging speed (250 kW vs 205 kW) and 5-year TCO. Polestar wins on interior quality and physical controls.",
    whatChanged:
      "2025 refreshes updated both models. Tesla Supercharger now open to Polestar on CCS — a genuine change to the charging calculus. Polestar 2 received updated Google Automotive integration.",
    ownershipImpact:
      "5-year TCO gap is €2,800 in Tesla's favour at 15,000 km/year. If you drive more than 25,000 km/year, the gap widens further due to faster Supercharger sessions. Below 12,000 km/year, the gap is small enough that interior preference should decide.",
    chargingImplications:
      "Polestar 2 can now use Tesla Superchargers in Europe via CCS adapter at a 26% pricing premium over Tesla owners. On routes with good third-party CCS coverage (Ionity, Fastned), this premium is avoidable.",
    longDistanceSuitability:
      "Both are genuinely good long-distance EVs. Tesla's edge: more Supercharger stations in Southern Europe and Balkans where third-party coverage thins. Polestar's edge: better audio system for long trips.",
    bestAlternatives: [
      { slug: "hyundai-ioniq-6", reason: "Cheaper, 220 kW DC charging, excellent efficiency" },
      { slug: "volkswagen-id-7", reason: "More space, same price band, very efficient at motorway speeds" },
    ],
    trendingScore: 76,
  },

  "norway-ev-88-percent-2025": {
    aiSummary:
      "Norway's 88% EV share in 2025 was built over 20 years with VAT exemption, urban privileges, and €0.18/kWh hydro electricity. The model is partially transferable but depends heavily on energy economics that most European countries lack.",
    whatChanged:
      "88% is the 2025 peak — the highest national EV share in history. Norway's success demonstrates near-complete mass-market EV adoption is technically feasible. Policy certainty from 2017 was the key enabler.",
    marketImplications:
      "Norway's data proves that EV adoption doesn't stall at 40–50% — it can reach near-full market saturation given the right conditions. This is significant for European policy modelling for 2035 targets.",
    policyImplications:
      "VAT exemption was always temporary — Norway is now introducing a scaled purchase tax as EVs exceed 85% share. This transition model (exempt→graduated→taxed) is the most likely policy path for other markets.",
    ownershipImpact:
      "Norwegian EV owners have the lowest operational costs in Europe at €0.18/kWh. The 5-year TCO advantage over diesel is €8,000–12,000 — roughly double the German equivalent. If you're buying in Norway, ICE has no financial case.",
    trendingScore: 73,
  },

  "ev-battery-degradation-real-data": {
    aiSummary:
      "Real-world data from 12,000+ EVs shows median 5-year battery retention of 92.3%. Tesla leads at 94–96%. Modern EVs are not experiencing the degradation rates of early Nissan Leafs that drove the initial anxiety.",
    whatChanged:
      "Recurrent's 2025 dataset is the largest published real-world EV battery study. It formally closes the chapter on early-2020s battery anxiety narratives for modern EVs. Nissan Leaf data is now an explicit historical outlier.",
    ownershipImpact:
      "For used EV buyers: 92% average retention means a 60 kWh EV bought at 5 years old should still deliver 55+ kWh usable range. Request OBD scan for any pre-2021 EV purchase — degradation variance is higher on older chemistry.",
    winterImpact:
      "Charging to 80% vs 100% reduces long-term degradation by 3–5%. In winter, this is especially relevant: the smaller margin from 80% is noticeable in range, but the battery health benefit accumulates over 5+ years.",
    chargingImplications:
      "Frequent DC fast-charging (3+ sessions/week) adds ~1% additional degradation per 10,000 km. For most drivers this is trivial. Only high-mileage fleet vehicles need to actively manage DC session frequency.",
    trendingScore: 80,
  },

  "v2g-vehicle-to-grid-2025": {
    aiSummary:
      "V2G is commercially available in Europe for 4 vehicle types as of mid-2025. Bidirectional charger hardware costs €3,000–6,000 installed — the main adoption barrier. UK V2G tariffs can return £400–900/year to participating owners.",
    whatChanged:
      "V2G went from concept to commercial product for IONIQ 5/6 in the UK via specific energy supplier partnerships. VW has committed to V2G via CCS in the ID.7 from 2026. BMW Neue Klasse includes bidirectional charging as standard.",
    chargingImplications:
      "Bidirectional charger installation doubles the cost vs a standard 7.4 kW wallbox. Break-even on the hardware premium requires 3–4 years of consistent V2G participation at current UK tariff rates.",
    ownershipImpact:
      "V2G participants earn €200–600/year depending on grid pricing and participation rate. This meaningfully changes the total ownership calculation for IONIQ 5/6 buyers in UK and German markets where energy supplier partnerships exist.",
    winterImpact:
      "V2G participation in winter requires careful battery management — exporting during peak hours may reduce range available for the morning commute. Smart scheduling (reserve 30–40 kWh, export only the surplus) is essential.",
    trendingScore: 86,
  },

  "tesla-supercharger-open-network-europe": {
    aiSummary:
      "Non-Tesla vehicles now represent 22% of European Supercharger sessions. The network's 99.2% uptime remains industry-leading. Non-Tesla users pay a 26% premium vs Tesla owners — making Ionity Passport competitive for high-mileage drivers.",
    whatChanged:
      "Network is now effectively open to all CCS-compatible EVs. Authentication failures reduced from 8% to 3% of non-Tesla sessions since 2023 opening. Non-Tesla buying intent citing Supercharger access jumped from 12% to 31%.",
    chargingImplications:
      "Non-Tesla EV owners on long trips in Southern Europe or Balkans should add Supercharger to their route planning apps as a fallback. 99.2% uptime significantly outperforms most alternatives in thin-coverage regions.",
    ownershipImpact:
      "If you drive >15,000 km/year on routes where Supercharger density matters (Spain, Portugal, Italy, Balkans), factor the 26% non-Tesla pricing premium into your annual charging cost projection. For most Northern European owners it's irrelevant.",
    longDistanceSuitability:
      "The network opening makes Spain, Portugal and Balkans routes materially more viable for non-Tesla EV drivers. Previously, route planning in these areas required significant deviation; now Superchargers fill many gaps.",
    trendingScore: 82,
  },

  "skoda-enyaq-value-case-2025": {
    aiSummary:
      "The Enyaq 85 at €42,000 delivers MEB platform quality — shared with VW ID.4 and Audi Q4 — with 585L cargo, 430 km real-world range, and a 5-year TCO that beats an equivalent Tiguan diesel by €3,600.",
    whatChanged:
      "Enyaq 85 pricing adjusted in 2025 to close the gap further with the VW ID.4. Heat pump is now €1,200 option (previously €1,500). 135 kW DC charging unchanged — the model's main technical weakness.",
    ownershipImpact:
      "For family buyers replacing a diesel SUV: the financial case is now clear in most of Europe. The break-even vs a Tiguan TDI at 20,000 km/year is reached at approximately 3.5 years, making a 5-year ownership cycle clearly positive.",
    longDistanceSuitability:
      "Acceptable but not best-in-class. 135 kW DC peak vs IONIQ 6's 220 kW means longer motorway stops. On a 600 km trip with two stops, the difference is approximately 12–15 extra minutes vs the fastest-charging competitors.",
    winterImpact:
      "Heat pump option is essential in Northern/Central European climates. Without it, winter range drops to approximately 300 km real-world — fine for most daily use but limiting for long winter trips.",
    bestAlternatives: [
      { slug: "volkswagen-id-7", reason: "More range, slightly larger, €6k more — better for high-mileage families" },
      { slug: "hyundai-ioniq-6", reason: "Faster charging and better efficiency, different body style" },
    ],
    trendingScore: 77,
  },

  "public-charging-reliability-europe-2025": {
    aiSummary:
      "ACEA survey of 180,000 sessions shows Ionity (98.1%), Tesla (99.2%) and Fastned (97.8%) as the reliability leaders. Legacy fuel station conversions (BP Pulse, Shell Recharge) fail at 14–18% of sessions.",
    whatChanged:
      "2025 marks the first year OCPI roaming coverage exceeded 89% in Western Europe. Eastern Europe lags at 62%. Plug&Charge is now accepted at 74% of Western European DC stations — up from 43% in 2023.",
    chargingImplications:
      "For long-trip planning: never rely on BP Pulse or Shell Recharge as primary stops — use them as backup only. Carry RFID cards from at least two independent networks. Ionity and Supercharger are the only safe primaries.",
    ownershipImpact:
      "Charging failure on a long trip is not just inconvenient — it can cost 2–3 hours of delay and emergency roadside charging at premium rates. Planning routes via verified-reliable networks is a genuine ownership quality-of-life decision.",
    longDistanceSuitability:
      "Route reliability is now the primary bottleneck for long-distance EV travel — more than range anxiety. A 400 km route is feasible for any modern EV; the risk is a failed charger at the planned stop. Plan with two network options at each stop.",
    trendingScore: 84,
  },
};

export function getArticleIntelligence(slug: string): ArticleIntelligence | null {
  return INTELLIGENCE[slug] ?? null;
}
