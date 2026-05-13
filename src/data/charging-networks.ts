export interface ChargingNetwork {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  founded: number;
  headquarters: string;
  stationsEurope: number;
  pointsEurope: number;
  maxKw: number;
  connectors: string[];
  pricingModel: "per-kWh" | "per-minute" | "subscription" | "mixed";
  pricing: { description: string; homeCountry?: string; typical: string };
  coverageStrength: string[];
  coverageWeak: string[];
  pros: string[];
  cons: string[];
  compatible: string[];
  bestFor: string;
  summary: string;
  accentColor: string;
  speeds: { label: string; kw: number; typical: string }[];
  membershipRequired: boolean;
  appRequired: boolean;
}

export const CHARGING_NETWORKS: ChargingNetwork[] = [
  {
    slug: "ionity",
    name: "Ionity",
    shortName: "Ionity",
    tagline: "Europe's premium high-power charging backbone. Up to 400 kW. Built for speed.",
    founded: 2017,
    headquarters: "Munich, Germany",
    stationsEurope: 862,
    pointsEurope: 6500,
    maxKw: 400,
    connectors: ["CCS"],
    pricingModel: "per-kWh",
    pricing: {
      description: "Pay-as-you-go: ~€0.79/kWh. IONITY Power 365 subscription: €5.99/month for €0.39/kWh (annual). Higher tiers from €0.35/kWh.",
      typical: "€0.35–0.79/kWh",
    },
    coverageStrength: ["Germany", "France", "Norway", "Sweden", "Austria", "UK", "Spain"],
    coverageWeak: ["Eastern Europe", "Southern Italy", "Finland"],
    pros: ["Up to 400 kW with new Gen 2 hardware (2025–2026 rollout)", "862 stations across 24 countries", "Reliable, premium hardware", "Good motorway placement", "CCS standard — near-universal compatibility", "IONITY Power 365 from €0.39/kWh undercuts most rivals"],
    cons: ["Pay-as-you-go rate is expensive (~€0.79/kWh)", "CCS only — no AC option", "Subscription needed for best pricing", "Station density still lower in eastern/southern Europe", "Building backlog (51 sites) means coverage gaps remain"],
    compatible: ["All CCS vehicles", "Tesla (with adapter)", "Most EVs sold in Europe after 2020"],
    bestFor: "Motorway road trips across western Europe, especially with IONITY Power 365 subscription.",
    summary: "Ionity was built to do one thing: deliver maximum charging speed at motorway locations across Europe. Founded by BMW, Ford, Hyundai, Mercedes and Volkswagen Group, it operates 862 high-power locations across 24 countries (Q1 2026), with 51 more under construction and a €600m investment in 2025 to more than double charging points to 13,000. Gen 2 hardware lifts peak power to 400 kW. The pay-as-you-go rate is punishing — ~€0.79/kWh — but the IONITY Power 365 subscription drops this to €0.39/kWh, competitive with mid-range public pricing.",
    accentColor: "text-blue-400",
    speeds: [
      { label: "Peak", kw: 400, typical: "New Gen 2 hardware rolling out 2025–2026" },
      { label: "350 kW", kw: 350, typical: "For 800V vehicles (Porsche, Audi, Hyundai, Kia EV6)" },
      { label: "Most vehicles", kw: 150, typical: "Standard 400V EVs (Tesla, BMW, Volvo)" },
    ],
    membershipRequired: false,
    appRequired: false,
  },
  {
    slug: "tesla-supercharger",
    name: "Tesla Supercharger",
    shortName: "Supercharger",
    tagline: "The network that made long-distance EV travel feel normal. Now open to all.",
    founded: 2012,
    headquarters: "Austin, Texas, USA",
    stationsEurope: 900,
    pointsEurope: 10000,
    maxKw: 250,
    connectors: ["NACS", "CCS (via Magic Dock)"],
    pricingModel: "per-kWh",
    pricing: {
      description: "Tesla owners: ~€0.34/kWh. Non-Tesla: €0.40–0.65/kWh depending on vehicle and country.",
      typical: "€0.34–0.65/kWh",
    },
    coverageStrength: ["Norway", "Sweden", "Germany", "France", "Netherlands", "UK", "Spain", "Italy"],
    coverageWeak: ["Eastern Europe (expanding)"],
    pros: ["Largest network in Europe by station count", "Excellent reliability track record", "Urban and motorway placement balanced", "Multiple connectors per station", "Tesla V3 250 kW widely available"],
    cons: ["Non-Tesla pricing premium (15–30% above Tesla owner rates)", "250 kW peak (below Ionity's 400 kW Gen 2)", "Some older V2 stalls share power between two vehicles", "Adapter required for non-Tesla on some stalls", "App dependency for billing"],
    compatible: ["Tesla vehicles (native)", "All CCS vehicles (open access 2023–)", "Vehicles with NACS adapter"],
    bestFor: "Tesla drivers everywhere. Non-Tesla drivers in regions with limited Ionity coverage.",
    summary: "Tesla's Supercharger network is the benchmark others are measured against. With over 10,000 stalls across roughly 900 European stations, it's the largest fast-charging network on the continent. Reliability is exceptional — uptime consistently exceeds 99% — and placement reflects 13 years of route-planning data. Since opening to non-Tesla vehicles in 2023 (EU-first), it's become a genuine Europe-wide option. Non-Tesla pricing varies by country and is typically 15–30% above Tesla owner rates. V3 Superchargers at 250 kW are the standard; V4 at up to 350 kW is rolling out across Europe.",
    accentColor: "text-red-400",
    speeds: [
      { label: "V4 (rolling out)", kw: 350, typical: "Available at select European V4 stations" },
      { label: "V3 (standard)", kw: 250, typical: "Most urban and motorway Supercharger locations" },
      { label: "V2 (legacy)", kw: 150, typical: "Older installations — shared between two stalls" },
    ],
    membershipRequired: false,
    appRequired: true,
  },
  {
    slug: "fastned",
    name: "Fastned",
    shortName: "Fastned",
    tagline: "Green energy, premium hardware, fair pricing. The network with a clear conscience.",
    founded: 2012,
    headquarters: "Amsterdam, Netherlands",
    stationsEurope: 406,
    pointsEurope: 2400,
    maxKw: 400,
    connectors: ["CCS", "CHAdeMO", "Type 2"],
    pricingModel: "per-kWh",
    pricing: {
      description: "Standard: €0.69/kWh. Gold Member subscription: €11.99/month for €0.49/kWh. First 400 kW stations live in Italy (2025).",
      typical: "€0.49–0.69/kWh",
    },
    coverageStrength: ["Netherlands", "Germany", "UK", "Belgium", "France"],
    coverageWeak: ["Scandinavia", "Southern Europe", "Eastern Europe"],
    pros: ["100% renewable energy (own wind & solar PPAs)", "Premium station design with canopies", "Multi-connector standard (CCS + CHAdeMO + Type 2)", "Up to 400 kW on newest hardware (Italy 2025+)", "406 stations across 9 countries"],
    cons: ["Limited network size vs Tesla and Ionity", "Pay-as-you-go expensive", "Coverage patchy outside core markets", "CHAdeMO declining relevance", "Station design prioritises aesthetics over density"],
    compatible: ["CCS vehicles", "CHAdeMO vehicles (Nissan Leaf, older Mitsubishi)", "Type 2 AC charging", "Tesla (with adapter)"],
    bestFor: "Netherlands and Germany road trips. CHAdeMO vehicle owners. Environmentally-motivated drivers.",
    summary: "Fastned built something unusual: a charging network with a genuine identity. 100% renewable energy is the headline commitment — no carbon offsets, actual wind and solar. Stations are architecturally considered, canopy-covered, and feature genuine facilities including toilets and WiFi at most locations. The 300 kW hardware supports 800V vehicles. Coverage beyond the Netherlands, Germany and UK is limited, but within those markets, station quality consistently exceeds rivals.",
    accentColor: "text-yellow-400",
    speeds: [
      { label: "Maximum", kw: 400, typical: "Newest stations (Italy 2025, expanding)" },
      { label: "Standard HPC", kw: 300, typical: "Most newer Fastned stations, 800V capable" },
      { label: "Standard DC", kw: 175, typical: "Older stations, suits most 400V EVs" },
    ],
    membershipRequired: false,
    appRequired: false,
  },
  {
    slug: "recharge",
    name: "Recharge (Circle K + Eviny)",
    shortName: "Recharge",
    tagline: "Scandinavia's local charging backbone. Dense, accessible, practical.",
    founded: 2018,
    headquarters: "Bergen, Norway",
    stationsEurope: 450,
    pointsEurope: 4500,
    maxKw: 400,
    connectors: ["CCS", "CHAdeMO", "Type 2"],
    pricingModel: "per-kWh",
    pricing: {
      description: "Norway: 5.49 NOK/kWh AC, 6.49 NOK/kWh fast & HPC. Sweden: 6.29 SEK/kWh DC. Denmark: 3.79 DKK/kWh DC. Finland: €0.39/kWh DC.",
      typical: "€0.39–0.55/kWh equiv.",
    },
    coverageStrength: ["Norway", "Sweden", "Denmark", "Finland"],
    coverageWeak: ["Outside Scandinavia"],
    pros: ["Best coverage in rural Norway and Sweden", "Collocated with Circle K fuel stations", "150 kW DC widely available", "Transparent pricing", "Trusted local brand"],
    cons: ["Limited outside Scandinavia", "Subscription tier less developed than Ionity Power 365", "App quality behind Tesla/Ionity", "Coverage uneven in remote inland areas", "Pricing varies significantly between Nordic countries"],
    compatible: ["CCS vehicles", "Type 2 AC", "Most European EVs"],
    bestFor: "Drivers based in Scandinavia, especially Norway. Essential for rural coverage.",
    summary: "Recharge is the Scandinavian driver's default network — not because it's fastest or cheapest, but because it's there. In rural Norway and Sweden, it often provides the only public fast charging within 50 km. The partnership with Circle K means stations typically have cafes, food, clean facilities and reliable access. 150 kW maximum lags behind Ionity and Tesla, but for regular Scandinavian driving — shorter distances, strong home charging infrastructure — it's entirely adequate.",
    accentColor: "text-emerald-400",
    speeds: [
      { label: "Maximum HPC", kw: 400, typical: "Newest high-power stations, 800V capable" },
      { label: "Fast DC", kw: 150, typical: "Standard at most Recharge fast-charging sites" },
      { label: "AC", kw: 22, typical: "Type 2 AC at urban and destination locations" },
    ],
    membershipRequired: false,
    appRequired: false,
  },
  {
    slug: "allego",
    name: "Allego",
    shortName: "Allego",
    tagline: "Pan-European coverage with a focus on accessibility and interoperability.",
    founded: 2013,
    headquarters: "Arnhem, Netherlands",
    stationsEurope: 1000,
    pointsEurope: 35000,
    maxKw: 400,
    connectors: ["CCS", "CHAdeMO", "Type 2"],
    pricingModel: "per-kWh",
    pricing: {
      description: "RFID card or contactless. ~€0.59/kWh DC, €0.39/kWh AC. Network reliability 99.0% (2025 PCPR-compliant).",
      typical: "€0.39–0.59/kWh",
    },
    coverageStrength: ["Netherlands", "Belgium", "Germany", "France", "Poland"],
    coverageWeak: ["Scandinavia", "UK", "Southern Europe"],
    pros: ["Widest country coverage in Europe", "High interoperability — most roaming apps work", "CHAdeMO support for older EVs", "Urban and retail placement", "Reasonable AC pricing"],
    cons: ["Station quality inconsistent across legacy sites", "UI less polished than Tesla/Ionity", "Less visible in premium locations", "35,000 charge points includes a lot of slower AC", "Reliability uneven on third-party hosted sites"],
    compatible: ["CCS", "CHAdeMO", "Type 2", "Most RFID and roaming apps", "Plugsurfing, CHARG.E, etc."],
    bestFor: "Drivers needing broad European coverage, especially in BeNeLux and Central Europe.",
    summary: "Allego's strength is breadth. With over 1,000 fast-charging stations and 35,000+ total charge points across 16 European countries (1,000th fast-charging site opened October 2025), it's one of the largest pan-European operators by charge point count. Network reliability is published at 99.0% (PCPR-compliant for 2025). Newest Mega-E hubs reach 400 kW. Where Allego wins is interoperability: it works with almost every charging app and RFID card in Europe, making it the fallback option that actually works.",
    accentColor: "text-violet-400",
    speeds: [
      { label: "Maximum HPC", kw: 400, typical: "Latest Allego Mega-E hubs, 800V capable" },
      { label: "Standard DC", kw: 175, typical: "Most Allego DC stations" },
      { label: "AC", kw: 22, typical: "Type 2 AC widely available" },
    ],
    membershipRequired: false,
    appRequired: false,
  },
];
