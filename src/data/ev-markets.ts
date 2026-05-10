export interface EvMarketIncentive {
  type: string;
  amount: string;
  notes: string;
}

export interface EvMarket {
  code: string;
  name: string;
  flag: string;
  homechargingCostPerKwh: number;
  publicDCCostPerKwh: number;
  evSharePercent: number;
  evSalesGrowthYoY: number;
  registeredEvs: number;
  incentives: EvMarketIncentive[];
  infrastructure: {
    score: number;
    dcStationsPer1000km: number;
    fastChargerDensity: "excellent" | "good" | "moderate" | "limited";
    notes: string;
  };
  roadTripFriendliness: number;
  winterSuitability: number;
  ownershipEconomics: {
    annualSavingVsPetrol: number;
    paybackYears: number;
    notes: string;
  };
  summary: string;
  topNetworks: string[];
  watch: string;
  bestEvsForMarket: string[];
}

export const EV_MARKETS: EvMarket[] = [
  {
    code: "no",
    name: "Norway",
    flag: "🇳🇴",
    homechargingCostPerKwh: 0.18,
    publicDCCostPerKwh: 0.52,
    evSharePercent: 88,
    evSalesGrowthYoY: 12,
    registeredEvs: 750000,
    incentives: [
      { type: "VAT exemption", amount: "25% VAT", notes: "EVs exempt from VAT on purchase price — most significant incentive" },
      { type: "Road toll reduction", amount: "50% discount", notes: "Half-price on most Norwegian road tolls" },
      { type: "Free/discounted parking", amount: "Varies", notes: "Many municipalities offer free or reduced EV parking" },
      { type: "Reduced annual tax", amount: "~NOK 0", notes: "No annual road duty for EVs under certain weight" },
    ],
    infrastructure: {
      score: 92,
      dcStationsPer1000km: 38,
      fastChargerDensity: "excellent",
      notes: "World's most mature EV charging infrastructure. Recharge (Circle K/Eviny) dominant in rural areas. Ionity on major corridors. High charger uptime standards enforced by government.",
    },
    roadTripFriendliness: 90,
    winterSuitability: 95,
    ownershipEconomics: {
      annualSavingVsPetrol: 3800,
      paybackYears: 3.5,
      notes: "Exceptional economics due to cheap electricity, VAT exemption, and toll discounts. Payback vs petrol is the fastest in Europe.",
    },
    summary: "Norway is the world's most advanced EV market — period. With 88% of new car sales being electric in 2024, the infrastructure, incentives and cultural acceptance are unmatched globally. Home electricity is among the cheapest in Europe, toll discounts are substantial, and even rural mountain roads have fast chargers. The only genuine challenge is winter range planning on longer alpine routes, but Norwegian drivers are experienced EV users who plan accordingly.",
    topNetworks: ["Recharge", "Ionity", "Tesla Supercharger", "Mer"],
    watch: "Rural fast charger queuing during summer peak travel season. Plan stops in advance for E6 north of Trondheim.",
    bestEvsForMarket: ["kia-ev9", "audi-q6-etron", "porsche-macan-ev"],
  },
  {
    code: "se",
    name: "Sweden",
    flag: "🇸🇪",
    homechargingCostPerKwh: 0.21,
    publicDCCostPerKwh: 0.58,
    evSharePercent: 59,
    evSalesGrowthYoY: 8,
    registeredEvs: 450000,
    incentives: [
      { type: "Bonus-Malus (reformed)", amount: "Up to SEK 50,000", notes: "The Klimatbonus has been reformed — check current eligibility. Malus applies to high-emission vehicles" },
      { type: "Reduced benefit taxation", amount: "SEK 2,000 green car benefit", notes: "Employer-provided EVs benefit from reduced benefit-in-kind taxation" },
      { type: "VAT deduction (business)", amount: "25% VAT", notes: "Businesses can deduct VAT on EV purchases for company use" },
    ],
    infrastructure: {
      score: 84,
      dcStationsPer1000km: 24,
      fastChargerDensity: "good",
      notes: "Strong infrastructure in population corridors (Stockholm–Gothenburg–Malmö). Rural northern Sweden has improving but still sparse coverage. Recharge and Vattenfall InCharge most prominent networks.",
    },
    roadTripFriendliness: 82,
    winterSuitability: 88,
    ownershipEconomics: {
      annualSavingVsPetrol: 2900,
      paybackYears: 4.2,
      notes: "Strong economics driven by low home electricity costs and fuel tax incentives. Public charging pricing is higher than Norway but still below UK/Germany.",
    },
    summary: "Sweden sits firmly in the second tier of European EV adoption — well ahead of most of Europe but behind its Norwegian neighbour. The charging infrastructure is reliable on major corridors, and Swedish winters are well-served by a growing network. The Bonus-Malus system has been reformed multiple times; verify current incentives before purchase. Volvo and Polestar's domestic presence gives Swedish buyers strong local brand options.",
    topNetworks: ["Recharge", "Ionity", "Vattenfall InCharge", "Tesla Supercharger"],
    watch: "Northern Sweden above Sundsvall has limited fast charging density. Plan carefully on Norrland routes in winter.",
    bestEvsForMarket: ["volvo-ex30", "kia-ev9", "tesla-model-y"],
  },
  {
    code: "de",
    name: "Germany",
    flag: "🇩🇪",
    homechargingCostPerKwh: 0.32,
    publicDCCostPerKwh: 0.79,
    evSharePercent: 18,
    evSalesGrowthYoY: -15,
    registeredEvs: 1400000,
    incentives: [
      { type: "Federal grant (ended)", amount: "€0", notes: "The Umweltbonus was suspended in December 2023. No federal EV grant currently available." },
      { type: "Company car tax benefit", amount: "0.25% rate", notes: "EVs taxed at 0.25% of list price per month (vs 1% for ICE). Significant benefit for business users." },
      { type: "State-level incentives", amount: "Varies", notes: "Some German states offer local incentives. Check your Bundesland separately." },
    ],
    infrastructure: {
      score: 78,
      dcStationsPer1000km: 19,
      fastChargerDensity: "good",
      notes: "Strong Ionity and Tesla Supercharger coverage on Autobahn corridors. Urban fast charging expanding but uneven. High-speed motorway charging is world-class; secondary road coverage lags.",
    },
    roadTripFriendliness: 85,
    winterSuitability: 74,
    ownershipEconomics: {
      annualSavingVsPetrol: 1200,
      paybackYears: 7.8,
      notes: "Challenging economics after grant removal. High home electricity costs (among Europe's highest) erode EV running cost advantage. Business users have better economics via company car tax.",
    },
    summary: "Germany's EV story is complicated. Europe's largest car market ended federal purchase incentives in December 2023, triggering a sharp sales decline in early 2024. Home electricity prices are among Europe's highest, significantly impacting running cost advantages. Despite this, Germany has excellent motorway charging infrastructure, world-class manufacturing, and strong Ionity coverage. The business case for fleet operators remains strong. Private buyers should model costs carefully — the economics are less compelling than in Scandinavia.",
    topNetworks: ["Ionity", "Tesla Supercharger", "EnBW mobility+", "ARAL Pulse"],
    watch: "Home electricity costs are significantly higher than EU average — model your actual running costs before assuming EV savings.",
    bestEvsForMarket: ["bmw-i5", "audi-q6-etron", "tesla-model-3"],
  },
  {
    code: "fr",
    name: "France",
    flag: "🇫🇷",
    homechargingCostPerKwh: 0.24,
    publicDCCostPerKwh: 0.65,
    evSharePercent: 25,
    evSalesGrowthYoY: 14,
    registeredEvs: 1100000,
    incentives: [
      { type: "Bonus Écologique", amount: "Up to €7,000", notes: "Income-tested grant for EVs under €47,000. Maximum €7,000 for low-income households." },
      { type: "Leasing social", amount: "From €100/month", notes: "Government-backed affordable EV leasing scheme for lower-income drivers — extremely popular, oversubscribed." },
      { type: "Rétrofit incentive", amount: "Up to €6,000", notes: "Converting existing vehicles to electric. Applicable to both personal and commercial vehicles." },
      { type: "Zero-emission zone requirements", amount: "Regulatory", notes: "Paris and other major cities restricting ICE vehicles — creating EV demand pressure." },
    ],
    infrastructure: {
      score: 81,
      dcStationsPer1000km: 17,
      fastChargerDensity: "good",
      notes: "Strong autoroute fast charging network operated by TotalEnergies, Ionity and Tesla. EDF/Izivia large urban network. Rural fast charging improving. Government-mandated charger installation at service stations.",
    },
    roadTripFriendliness: 87,
    winterSuitability: 70,
    ownershipEconomics: {
      annualSavingVsPetrol: 2200,
      paybackYears: 5.1,
      notes: "Nuclear-powered grid means low home electricity costs and low carbon content. Bonus Écologique reduces upfront cost meaningfully. Strong long-term ownership economics.",
    },
    summary: "France is one of Europe's most interesting EV markets — its nuclear grid provides some of the cheapest and cleanest electricity on the continent, and government intervention has been aggressive and effective. The Leasing Social programme created enormous demand. Autoroute charging is well-developed, making road trips viable. The growing ZFE (zero-emission zone) regulations in major cities are structurally pushing EV adoption even without buyer enthusiasm.",
    topNetworks: ["Ionity", "Tesla Supercharger", "TotalEnergies Charge", "EDF Izivia"],
    watch: "Bonus Écologique is income-tested and vehicle price-capped — verify your eligibility before purchase.",
    bestEvsForMarket: ["hyundai-ioniq5", "tesla-model-y", "volvo-ex30"],
  },
  {
    code: "nl",
    name: "Netherlands",
    flag: "🇳🇱",
    homechargingCostPerKwh: 0.28,
    publicDCCostPerKwh: 0.61,
    evSharePercent: 34,
    evSalesGrowthYoY: 6,
    registeredEvs: 520000,
    incentives: [
      { type: "MIA / VAMIL (business)", amount: "Tax deduction", notes: "Significant business tax deductions for EV investments — major driver of fleet EV adoption." },
      { type: "Subsidieregeling elektrische personenauto's (SEPP)", amount: "€2,950", notes: "Private buyer grant. Budget often runs out early in the year — apply promptly." },
      { type: "BPM exemption", amount: "€0 purchase tax", notes: "No purchase tax (BPM) on fully electric vehicles. Significant saving." },
    ],
    infrastructure: {
      score: 89,
      dcStationsPer1000km: 42,
      fastChargerDensity: "excellent",
      notes: "Among the densest charging networks in Europe relative to land area. Fastned, Allego, Ionity and Tesla all prominent. Amsterdam and Rotterdam have exceptional public AC infrastructure.",
    },
    roadTripFriendliness: 86,
    winterSuitability: 72,
    ownershipEconomics: {
      annualSavingVsPetrol: 2600,
      paybackYears: 4.8,
      notes: "BPM exemption removes significant upfront cost. Company car market is enormous and strongly incentivised toward EVs. Charging network density reduces range anxiety significantly.",
    },
    summary: "The Netherlands punches above its weight in EV adoption — with 34% market share and the highest public charger density in Europe (relative to area), it's a natural EV environment. The flat geography and short distances suit the technology perfectly. Business leasing drives the market strongly, supported by tax structures that make EVs compulsory for financially-rational fleet managers. Fastned, headquartered in Amsterdam, operates some of Europe's most premium charging stations.",
    topNetworks: ["Fastned", "Allego", "Tesla Supercharger", "Ionity"],
    watch: "SEPP private buyer grant has a fixed annual budget that expires mid-year — register early.",
    bestEvsForMarket: ["tesla-model-3", "volvo-ex30", "hyundai-ioniq5"],
  },
  {
    code: "pl",
    name: "Poland",
    flag: "🇵🇱",
    homechargingCostPerKwh: 0.21,
    publicDCCostPerKwh: 0.58,
    evSharePercent: 4,
    evSalesGrowthYoY: 28,
    registeredEvs: 75000,
    incentives: [
      { type: "Mój Elektryk (private)", amount: "Up to PLN 27,000 (~€6,200)", notes: "Government subsidy for private EV buyers. Income and price conditions apply." },
      { type: "Mój Elektryk (leasing)", amount: "Up to PLN 18,750 (~€4,300)", notes: "Subsidy for EV leasing. Corporate fleet adoption strong." },
      { type: "VAT reduction (company)", amount: "50% VAT recovery", notes: "Companies can recover 50% VAT on EV purchases for mixed-use vehicles." },
    ],
    infrastructure: {
      score: 58,
      dcStationsPer1000km: 7,
      fastChargerDensity: "limited",
      notes: "Fast-growing but still limited. Major urban centres (Warsaw, Kraków, Wrocław) have reasonable coverage. Rural and eastern Poland coverage sparse. GreenWay and Orlen Charge expanding rapidly.",
    },
    roadTripFriendliness: 62,
    winterSuitability: 66,
    ownershipEconomics: {
      annualSavingVsPetrol: 1800,
      paybackYears: 5.9,
      notes: "Growing home charging cost advantage as Poland's energy mix shifts. Public charging expensive relative to income. Fleet operators have strongest business case.",
    },
    summary: "Poland is the most significant emerging EV market in Central Europe — growing fast from a low base, with strong government subsidy support and rapidly improving infrastructure. Warsaw now has a reasonably developed charging network, and the government's Mój Elektryk programme has driven significant adoption. The coal-heavy electricity grid means carbon benefits are currently limited, but this is shifting with renewable expansion. Road trip viability outside major corridors requires careful planning.",
    topNetworks: ["GreenWay", "Orlen Charge", "Ionity", "Allego"],
    watch: "Infrastructure outside major cities is developing rapidly but not yet reliable for unplanned long-distance travel.",
    bestEvsForMarket: ["hyundai-ioniq5", "volvo-ex30", "tesla-model-y"],
  },
  {
    code: "es",
    name: "Spain",
    flag: "🇪🇸",
    homechargingCostPerKwh: 0.19,
    publicDCCostPerKwh: 0.55,
    evSharePercent: 12,
    evSalesGrowthYoY: 22,
    registeredEvs: 280000,
    incentives: [
      { type: "MOVES III", amount: "Up to €9,000", notes: "Major EV subsidy programme. Scrapping old vehicle increases grant. Subject to budget availability." },
      { type: "Income tax deduction", amount: "15% deduction", notes: "15% personal income tax deduction on EV purchase price, up to €20,000 base." },
      { type: "Municipal exemptions", amount: "Varies", notes: "Madrid, Barcelona and other cities offer parking and road access benefits for EVs." },
    ],
    infrastructure: {
      score: 70,
      dcStationsPer1000km: 11,
      fastChargerDensity: "moderate",
      notes: "Major motorway corridors reasonably served. Urban centres good. Rural interior Spain and some coastal routes have meaningful charging gaps. Repsol, Ionity and Tesla covering main routes.",
    },
    roadTripFriendliness: 76,
    winterSuitability: 75,
    ownershipEconomics: {
      annualSavingVsPetrol: 2400,
      paybackYears: 4.3,
      notes: "Low home electricity costs (despite recent volatility) create strong running cost advantage. MOVES III grant significantly reduces upfront cost when available.",
    },
    summary: "Spain's EV market is growing rapidly from a mid-level base, supported by the MOVES III programme and favourable electricity costs. The climate is excellent for EVs — cold weather range loss is minimal in most of Spain. Major motorway infrastructure is improving quickly. The challenges are rural coverage gaps on interior routes and budget-limited subsidy programmes that run out quickly. Urban drivers have a compelling EV case; long-distance adventurers should research specific route charging.",
    topNetworks: ["Tesla Supercharger", "Ionity", "Repsol Waylet", "Endesa X"],
    watch: "MOVES III has a limited annual budget — application timing matters significantly.",
    bestEvsForMarket: ["tesla-model-y", "hyundai-ioniq5", "porsche-macan-ev"],
  },
  {
    code: "it",
    name: "Italy",
    flag: "🇮🇹",
    homechargingCostPerKwh: 0.27,
    publicDCCostPerKwh: 0.69,
    evSharePercent: 9,
    evSalesGrowthYoY: 18,
    registeredEvs: 210000,
    incentives: [
      { type: "Ecobonus (private)", amount: "Up to €11,000", notes: "Largest incentive in Europe. Requires scrapping old vehicle for maximum amount. Income-tested tiers." },
      { type: "Regional supplements", amount: "Varies", notes: "Several regions top up the national Ecobonus with additional grants. Significant in Lombardy, Lazio." },
      { type: "Company car deduction", amount: "70–100% deduction", notes: "Business use EVs have enhanced tax deductibility compared to ICE vehicles." },
    ],
    infrastructure: {
      score: 65,
      dcStationsPer1000km: 9,
      fastChargerDensity: "moderate",
      notes: "Northern Italy (Milan, Turin corridor) has reasonable infrastructure. A1 motorway improving fast. Southern Italy and rural areas remain challenging. Enel X Way, Ionity and Tesla the main fast charging options.",
    },
    roadTripFriendliness: 71,
    winterSuitability: 68,
    ownershipEconomics: {
      annualSavingVsPetrol: 2100,
      paybackYears: 4.9,
      notes: "Ecobonus dramatically reduces upfront cost when available. Higher home electricity costs than northern Europe but lower fuel prices partially offset this.",
    },
    summary: "Italy offers Europe's most generous EV purchase grant in absolute terms — the Ecobonus can reach €11,000 with scrappage. Despite this, adoption remains lower than northern Europe, driven by apartment living (home charging challenges), lower average incomes, and infrastructure gaps south of Rome. Northern Italy is a genuinely good EV environment; the south requires more careful planning. The tourist route infrastructure — A1, Brenner corridor, coastal Amalfi — is improving rapidly for summer visitors.",
    topNetworks: ["Enel X Way", "Ionity", "Tesla Supercharger", "BeCharge"],
    watch: "Apartment dwellers without garage access face significant home charging challenges — assess your charging situation before purchase.",
    bestEvsForMarket: ["volvo-ex30", "hyundai-ioniq5", "tesla-model-3"],
  },
];
