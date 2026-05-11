/**
 * Vehicle Intelligence Scoring System
 *
 * Independently scored 0-100 per dimension.
 * Powers: AI verdict cards, homepage rankings, personalized recommendations.
 * Scores are editorially set, backed by published test data and owner surveys.
 */

export interface VehicleIntelligenceScore {
  slug: string;
  // Dimension scores (0-100)
  winterSuitability: number;       // cold range retention, heat pump, battery thermal mgmt
  chargingEcosystem: number;       // DC peak speed, AC speed, network compatibility
  motorwayEfficiency: number;      // Cd, kWh/100km at 130 km/h, high-speed range
  familyPracticality: number;      // cargo L, rear headroom, ISOFIX points, rear comfort
  urbanSuitability: number;        // turning radius, parking sensors, one-pedal, city range
  roadTripScore: number;           // range × charging speed × network coverage × comfort
  reliabilitySignal: number;       // owner survey data, brand track record, platform maturity
  maintenanceComplexity: number;   // service simplicity, OTA capability, service network
  overallIntelligence: number;     // weighted composite

  // Narrative
  bestFor: string[];
  worstFor: string[];
  personalitySummary: string;
  ownershipStrengths: string[];
  ownershipWeaknesses: string[];
  recommendedAlternatives: string[];
}

export const VEHICLE_INTELLIGENCE: VehicleIntelligenceScore[] = [
  {
    slug: "tesla-model-y",
    winterSuitability: 79,
    chargingEcosystem: 93,
    motorwayEfficiency: 83,
    familyPracticality: 77,
    urbanSuitability: 72,
    roadTripScore: 92,
    reliabilitySignal: 79,
    maintenanceComplexity: 85,
    overallIntelligence: 83,
    bestFor: ["Long-distance touring", "Network coverage everywhere", "Low running costs"],
    worstFor: ["Physical interior controls", "Brand sensitivity in some markets"],
    personalitySummary: "Europe's best-selling EV for a reason — unmatched Supercharger coverage, genuine long-range capability and software that gets better every year. Pragmatic rather than premium.",
    ownershipStrengths: ["Supercharger network: 99.2% uptime, open to non-Tesla via CCS", "OTA updates every 4–6 weeks — car improves over time", "Lowest depreciation in class (62% 3-year retention)", "Flat load floor with fold-flat rear — van-like cargo mode"],
    ownershipWeaknesses: ["Panel gap consistency below German rivals", "Touchscreen-only controls require adaptation period", "No heat pump on some variants — affects winter range"],
    recommendedAlternatives: ["hyundai-ioniq-6", "volkswagen-id-7", "polestar-2"],
  },
  {
    slug: "bmw-ix",
    winterSuitability: 73,
    chargingEcosystem: 78,
    motorwayEfficiency: 79,
    familyPracticality: 84,
    urbanSuitability: 68,
    roadTripScore: 81,
    reliabilitySignal: 80,
    maintenanceComplexity: 71,
    overallIntelligence: 78,
    bestFor: ["Luxury cabin experience", "Family SUV comfort", "22 kW AC destination charging"],
    worstFor: ["Buyers on tight budgets", "Urban parking (large footprint)"],
    personalitySummary: "The iX is the most complete luxury EV experience — outstanding Harman Kardon audio, immense rear space, and genuinely premium materials. Its 200 kW DC charging is adequate but no longer class-leading.",
    ownershipStrengths: ["22 kW AC charging: best-in-class for overnight hotel/destination stops", "500L cargo + flat-floor boot — practical despite luxury positioning", "BMW service network: widest coverage in Europe", "Curved display and ambient lighting set the interior benchmark"],
    ownershipWeaknesses: ["200 kW DC charging — 6–8 minutes slower than class leaders at 10–80%", "Service costs notably higher than Asian rivals", "61% winter range retention — below IONIQ 6's 68%"],
    recommendedAlternatives: ["mercedes-eqs", "audi-q8-etron", "polestar-3"],
  },
  {
    slug: "hyundai-ioniq-6",
    winterSuitability: 88,
    chargingEcosystem: 93,
    motorwayEfficiency: 91,
    familyPracticality: 61,
    urbanSuitability: 76,
    roadTripScore: 91,
    reliabilitySignal: 86,
    maintenanceComplexity: 87,
    overallIntelligence: 85,
    bestFor: ["Long-distance efficiency", "Winter range retention", "Fastest charging in class"],
    worstFor: ["Families needing SUV cargo space", "Rear headroom in saloon format"],
    personalitySummary: "The most technically impressive EV in Europe — aerodynamic design (Cd 0.21), 220 kW DC charging on 800V architecture, and best-in-class winter retention at 68%. It prioritises efficiency above everything else.",
    ownershipStrengths: ["220 kW DC peak — 10–80% in 18 minutes on compatible chargers", "800V architecture: charges faster at lower temperatures than rivals", "Heat pump standard — class-best cold weather performance", "Cd 0.21: aerodynamic efficiency reduces motorway energy consumption significantly"],
    ownershipWeaknesses: ["Saloon body: 401L boot, limited rear headroom vs SUV rivals", "Polarising exterior styling not universally liked", "Some V2L cable complexity for first-time users"],
    recommendedAlternatives: ["polestar-2", "volkswagen-id-7", "tesla-model-y"],
  },
  {
    slug: "polestar-3",
    winterSuitability: 75,
    chargingEcosystem: 82,
    motorwayEfficiency: 78,
    familyPracticality: 87,
    urbanSuitability: 65,
    roadTripScore: 84,
    reliabilitySignal: 79,
    maintenanceComplexity: 76,
    overallIntelligence: 80,
    bestFor: ["Premium family SUV buyers", "Design-conscious owners", "Long-range comfort touring"],
    worstFor: ["Urban parking (large SUV footprint)", "Budget-conscious buyers"],
    personalitySummary: "Polestar 3 bridges Scandinavian design purity with full-size SUV capability. Swedish wool interior, 484L cargo, 250 kW DC charging, and genuine dual-motor AWD confidence. The design justifies the premium.",
    ownershipStrengths: ["250 kW DC charging — competitive fast-stop times", "Interior material quality: vegan leather, Swedish wool, Bowers & Wilkins audio", "Pilot Assist: well-calibrated highway assist system", "631 km WLTP — genuine long-range credibility"],
    ownershipWeaknesses: ["New platform — limited 3+ year ownership data yet available", "Large footprint limits urban usability", "Service via Polestar Spaces only — smaller network than BMW/Mercedes"],
    recommendedAlternatives: ["volvo-ex90", "bmw-ix", "audi-q8-etron"],
  },
  {
    slug: "volvo-ex90",
    winterSuitability: 77,
    chargingEcosystem: 80,
    motorwayEfficiency: 76,
    familyPracticality: 95,
    urbanSuitability: 61,
    roadTripScore: 83,
    reliabilitySignal: 78,
    maintenanceComplexity: 75,
    overallIntelligence: 80,
    bestFor: ["7-seat family buyers", "Nordic climate families", "Safety-critical buyers"],
    worstFor: ["Urban drivers (very large)", "Solo/couple buyers (oversized)"],
    personalitySummary: "The EX90 is purpose-built for the European family — 7 seats, ISOFIX on all three rows, and Volvo's best-in-class safety suite. It's the only premium 7-seat EV that doesn't require compromises on interior quality.",
    ownershipStrengths: ["7 genuine seats — only premium EV in class with full 3-row comfort", "Volvo Safety: best-in-class autonomous emergency braking and child occupant detection", "580 km WLTP — sufficient for 7-person family road trips", "Scandinavian cold-weather engineering in DNA"],
    ownershipWeaknesses: ["Very large footprint — urban parking is genuinely difficult", "Platform newer than established BMW/Audi rivals — long-term data limited", "Boot space compromised by third row when up"],
    recommendedAlternatives: ["polestar-3", "mercedes-eqe-suv", "audi-q8-etron"],
  },
  {
    slug: "mercedes-eqs",
    winterSuitability: 80,
    chargingEcosystem: 85,
    motorwayEfficiency: 88,
    familyPracticality: 74,
    urbanSuitability: 71,
    roadTripScore: 90,
    reliabilitySignal: 82,
    maintenanceComplexity: 68,
    overallIntelligence: 81,
    bestFor: ["Ultra-long-distance touring", "Executive travel", "Destination hotel charging (22 kW AC)"],
    worstFor: ["Tight city driving", "Value-focused buyers"],
    personalitySummary: "The EQS delivers an experience no other EV matches — 770 km WLTP, Cd 0.20, and a rear passenger suite that rivals private aviation. It's an executive transport tool, not a family SUV.",
    ownershipStrengths: ["770 km WLTP — unmatched range in passenger cars", "22 kW AC charging — best-in-class for overnight destination stops", "Hyperscreen: 1.41m dashboard display — genuinely functional not just spectacle", "200 kW DC sufficient given massive battery buffer — stops are infrequent"],
    ownershipWeaknesses: ["MBUX complexity requires significant learning curve", "Maintenance costs among highest in EV market", "Very long body (5.2m) limits urban and parking garage usability"],
    recommendedAlternatives: ["bmw-ix", "audi-q8-etron", "volkswagen-id-7"],
  },
  {
    slug: "skoda-enyaq",
    winterSuitability: 71,
    chargingEcosystem: 74,
    motorwayEfficiency: 79,
    familyPracticality: 88,
    urbanSuitability: 81,
    roadTripScore: 73,
    reliabilitySignal: 84,
    maintenanceComplexity: 85,
    overallIntelligence: 79,
    bestFor: ["Value-conscious family buyers", "First-time EV buyers", "Replacing a diesel estate/SUV"],
    worstFor: ["High-mileage long-distance drivers (slow DC charging)", "Buyers wanting class-leading range"],
    personalitySummary: "The most financially rational family EV in Europe. MEB platform quality at €42,000, 585L cargo, and a 5-year TCO that beats a Tiguan TDI by €3,600. The 135 kW DC charging is the only significant weakness.",
    ownershipStrengths: ["585L boot — more than VW ID.4, close to ICE estate rivals", "VW Group service network — dealer in every town across Europe", "Best value MEB proposition — €5,000 cheaper than ID.4 for same platform", "Proven MEB reliability — 4+ years of production data"],
    ownershipWeaknesses: ["135 kW DC peak — class's slowest, adds 12–18 min on 600 km trips vs IONIQ 6", "Infotainment below Tesla and Google-based rivals", "No heat pump standard — €1,200 option, essential for Northern Europe"],
    recommendedAlternatives: ["volkswagen-id-7", "hyundai-ioniq-6", "polestar-2"],
  },
  {
    slug: "bmw-ix3",
    winterSuitability: 68,
    chargingEcosystem: 71,
    motorwayEfficiency: 76,
    familyPracticality: 83,
    urbanSuitability: 79,
    roadTripScore: 67,
    reliabilitySignal: 82,
    maintenanceComplexity: 74,
    overallIntelligence: 75,
    bestFor: ["BMW brand loyalty buyers", "Urban and suburban family use", "Buyers needing X3 practicality"],
    worstFor: ["Long-distance road trips (100 kW DC is a major bottleneck)", "Cold climate buyers"],
    personalitySummary: "The iX3 is an excellent urban family car built on the proven X3 platform — but its 100 kW DC charging is genuinely limiting on motorway routes. Best suited to owners with home charging and moderate daily ranges.",
    ownershipStrengths: ["X3 platform quality: build, NVH and driving dynamics best in class", "510L cargo — excellent for its footprint", "BMW ConnectedDrive: navigation and remote features well-implemented", "Familiar X3 exterior — avoids the polarising iX styling"],
    ownershipWeaknesses: ["100 kW DC charging: 55+ minutes for 10–80% — this class should be at 150 kW minimum", "No heat pump: 62% winter retention below MEB rivals", "360 km real-world range on shorter side for longer trips"],
    recommendedAlternatives: ["skoda-enyaq", "hyundai-ioniq-6", "polestar-2"],
  },
  {
    slug: "polestar-2",
    winterSuitability: 76,
    chargingEcosystem: 87,
    motorwayEfficiency: 84,
    familyPracticality: 65,
    urbanSuitability: 80,
    roadTripScore: 83,
    reliabilitySignal: 81,
    maintenanceComplexity: 80,
    overallIntelligence: 80,
    bestFor: ["Design-forward drivers", "Tech-focused buyers (Google native)", "Urban-to-motorway mixed use"],
    worstFor: ["Families needing rear space (hatchback body)", "Buyers comparing to IONIQ 6 on range"],
    personalitySummary: "Polestar 2 is where Scandinavian design meets Silicon Valley software — Google Automotive native, 205 kW DC charging, Harman Kardon standard. The hatchback body limits rear room but the driving experience is exceptional.",
    ownershipStrengths: ["Google Automotive: Maps, Assistant, Play Store — best non-Tesla ecosystem", "205 kW DC charging: competitive fast-stop times", "Physical steering wheel shortcuts — superior usability vs Tesla's scroll wheels", "Harman Kardon audio standard — others charge extra"],
    ownershipWeaknesses: ["405L boot small vs SUV rivals — rear occupant headroom limited", "Polestar Space service network smaller than BMW/Mercedes", "Depreciation slightly below Tesla at 3 years"],
    recommendedAlternatives: ["hyundai-ioniq-6", "volkswagen-id-7", "tesla-model-y"],
  },
  {
    slug: "volkswagen-id-7",
    winterSuitability: 75,
    chargingEcosystem: 82,
    motorwayEfficiency: 88,
    familyPracticality: 78,
    urbanSuitability: 76,
    roadTripScore: 85,
    reliabilitySignal: 85,
    maintenanceComplexity: 84,
    overallIntelligence: 82,
    bestFor: ["High-mileage motorway drivers", "Saloon buyers from Passat/Insignia class", "Efficiency-focused ownership"],
    worstFor: ["Buyers needing SUV cargo or ride height", "Urban-only use (undersells the capability)"],
    personalitySummary: "The ID.7 is the electric Passat — Cd 0.23 aerodynamic excellence, 470 km real-world range, and the quiet, refined highway presence German saloon buyers demand. The most motorway-efficient EV in its class.",
    ownershipStrengths: ["Cd 0.23 — exceptional motorway efficiency, 470 km real vs 390 km for heavier rivals", "530L boot — estate-class practicality in saloon form", "170 kW DC + 11 kW AC: well-balanced charging for mixed use", "MEB+ reliability: proven platform with OTA update commitment"],
    ownershipWeaknesses: ["Saloon form reduces loading versatility vs hatchback/SUV", "Infotainment still trailing Tesla/Google competitors", "170 kW DC adequate but not the fastest in class"],
    recommendedAlternatives: ["hyundai-ioniq-6", "polestar-2", "skoda-enyaq"],
  },
  {
    slug: "mercedes-eqe-suv",
    winterSuitability: 77,
    chargingEcosystem: 82,
    motorwayEfficiency: 80,
    familyPracticality: 86,
    urbanSuitability: 69,
    roadTripScore: 83,
    reliabilitySignal: 80,
    maintenanceComplexity: 69,
    overallIntelligence: 79,
    bestFor: ["Luxury family SUV buyers", "Destination hotel charging (22 kW AC)", "Business class travel"],
    worstFor: ["Urban-only use", "Tech-forward buyers (MBUX has steep learning curve)"],
    personalitySummary: "The EQE SUV delivers Mercedes luxury in a genuinely practical form — large cabin, 22 kW AC destination charging, and a refined motorway presence. Software complexity and maintenance costs are the friction points.",
    ownershipStrengths: ["22 kW AC charging: unmatched for hotel/destination overnight stops", "Mercedes interior quality: premium materials, Burmester audio option", "Airmatic air suspension: motorway ride comfort best-in-class", "Quattro-equivalent: 4MATIC AWD standard on EQE 500"],
    ownershipWeaknesses: ["MBUX: complex to master, some features buried 3+ menus deep", "First-generation EQE platform: some software reliability reports", "Maintenance: Mercedes specialist pricing, not VW Group accessibility"],
    recommendedAlternatives: ["bmw-ix", "audi-q8-etron", "polestar-3"],
  },
  {
    slug: "audi-q8-etron",
    winterSuitability: 76,
    chargingEcosystem: 82,
    motorwayEfficiency: 77,
    familyPracticality: 88,
    urbanSuitability: 66,
    roadTripScore: 80,
    reliabilitySignal: 81,
    maintenanceComplexity: 71,
    overallIntelligence: 79,
    bestFor: ["Audi brand loyalty buyers", "Large family with premium expectations", "Destination charging (22 kW AC)"],
    worstFor: ["Efficiency-focused buyers (WLTP vs real-world gap is notable)", "Urban parking (very large)"],
    personalitySummary: "The Q8 e-tron is Audi's most complete EV statement — massive cabin, 660L cargo, Quattro AWD confidence, and 22 kW AC charging. Its real-world efficiency lags behind the headline figures, but nothing else matches it on sheer presence.",
    ownershipStrengths: ["660L cargo — largest in class, optional third row available", "22 kW AC: excellent for destination charging overnight", "Quattro AWD: best-in-class all-condition confidence", "Bang & Olufsen audio: class-leading as standard on higher trims"],
    ownershipWeaknesses: ["Real-world range 20–25% below WLTP — largest gap in class", "Very large footprint, 2.5+ tonne weight", "Audi specialist servicing costs above VW Group average"],
    recommendedAlternatives: ["bmw-ix", "mercedes-eqe-suv", "volvo-ex90"],
  },
];

export function getVehicleIntelligence(slug: string): VehicleIntelligenceScore | null {
  return VEHICLE_INTELLIGENCE.find((v) => v.slug === slug) ?? null;
}

export function rankByDimension(
  dimension: keyof Pick<
    VehicleIntelligenceScore,
    | "winterSuitability"
    | "chargingEcosystem"
    | "motorwayEfficiency"
    | "familyPracticality"
    | "urbanSuitability"
    | "roadTripScore"
    | "overallIntelligence"
  >,
  n = 5
): VehicleIntelligenceScore[] {
  return [...VEHICLE_INTELLIGENCE].sort((a, b) => b[dimension] - a[dimension]).slice(0, n);
}
