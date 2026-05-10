export interface CompareModel {
  slug: string;
  name: string;
  brand: string;
  category: string;
  priceFrom: number;
  range: { real: number; winter: number; wltp: number };
  charging: { maxDC: number; time10to80: number; maxAC: number };
  motorwayEfficiency: number; // Wh/km at 120 km/h
  scores: {
    comfort: number;
    practicality: number;
    software: number;
    networkCompat: number;
    longDistance: number;
    valueForMoney: number;
  };
  cargoL: number;
  annualCostEur: number;
  verdict: string;
  bestFor: string;
  worstFor: string;
  accentColor: string;
}

export const COMPARE_MODELS: CompareModel[] = [
  {
    slug: "tesla-model-y",
    name: "Tesla Model Y",
    brand: "Tesla",
    category: "SUV",
    priceFrom: 44990,
    range: { real: 430, winter: 290, wltp: 533 },
    charging: { maxDC: 250, time10to80: 27, maxAC: 11 },
    motorwayEfficiency: 195,
    scores: { comfort: 74, practicality: 88, software: 95, networkCompat: 82, longDistance: 86, valueForMoney: 81 },
    cargoL: 854,
    annualCostEur: 1820,
    verdict: "The Model Y remains the benchmark others are measured against. Its Supercharger integration is unmatched for European road trips, software is a generation ahead of traditional manufacturers, and 854L cargo beats most class rivals. Real-world range at 430 km is honest motorway reality — not the WLTP fantasy. Winter benefits from a heat pump, but Nordic drivers should plan stops conservatively. The interior minimalism divides opinion sharply. Over 5 years, total cost of ownership consistently undercuts equivalent ICE alternatives.",
    bestFor: "Tech-forward buyers who road trip across Europe and want one seamless ecosystem.",
    worstFor: "Buyers who prioritise ride comfort, interior luxury, or physical controls.",
    accentColor: "text-red-400",
  },
  {
    slug: "tesla-model-3",
    name: "Tesla Model 3",
    brand: "Tesla",
    category: "Saloon",
    priceFrom: 42990,
    range: { real: 490, winter: 330, wltp: 629 },
    charging: { maxDC: 250, time10to80: 25, maxAC: 11 },
    motorwayEfficiency: 170,
    scores: { comfort: 82, practicality: 76, software: 95, networkCompat: 82, longDistance: 88, valueForMoney: 83 },
    cargoL: 594,
    annualCostEur: 1750,
    verdict: "The refreshed Model 3 Highland addresses every meaningful criticism of the original: improved ambient lighting, retuned suspension, quieter cabin, rear-seat screens. Efficiency at 170 Wh/km at motorway speed is class-leading, translating directly to real-world range that makes long-distance travel genuinely stress-free. The Supercharger network advantage is identical to the Model Y. For solo drivers and couples who prioritise driving dynamics over maximum utility, the Model 3 is the most compelling complete package in the comparison.",
    bestFor: "Solo drivers and couples who want the most efficient Tesla with the best highway range.",
    worstFor: "Families needing maximum cargo or third-row seating.",
    accentColor: "text-red-400",
  },
  {
    slug: "porsche-macan-ev",
    name: "Porsche Macan EV",
    brand: "Porsche",
    category: "Performance SUV",
    priceFrom: 73900,
    range: { real: 490, winter: 355, wltp: 613 },
    charging: { maxDC: 270, time10to80: 21, maxAC: 11 },
    motorwayEfficiency: 210,
    scores: { comfort: 94, practicality: 79, software: 87, networkCompat: 91, longDistance: 93, valueForMoney: 72 },
    cargoL: 540,
    annualCostEur: 2100,
    verdict: "The Macan EV is the most technically accomplished compact electric SUV available in Europe. Its 800V architecture delivers best-in-class cold weather charging stability — while competitors see significant speed reduction below 5°C, the Macan largely maintains its curve. Ride quality on air suspension rivals dedicated luxury saloons. The 21-minute 10–80% charge means stops align perfectly with natural rest breaks. The price premium is real, but Porsche buyers know this, and ownership quality justifies every euro of it.",
    bestFor: "Premium buyers who want performance, interior excellence, and reliable cold-weather charging.",
    worstFor: "Value-conscious buyers — the price gap over similarly-specified alternatives is significant.",
    accentColor: "text-yellow-400",
  },
  {
    slug: "kia-ev9",
    name: "Kia EV9",
    brand: "Kia",
    category: "7-seat SUV",
    priceFrom: 63900,
    range: { real: 450, winter: 310, wltp: 563 },
    charging: { maxDC: 239, time10to80: 24, maxAC: 11 },
    motorwayEfficiency: 230,
    scores: { comfort: 87, practicality: 98, software: 83, networkCompat: 87, longDistance: 85, valueForMoney: 86 },
    cargoL: 2318,
    annualCostEur: 2050,
    verdict: "The EV9 solves a problem no other EV in Europe adequately addresses: genuine seven-seat family transport with compelling range and fast charging. The 2,318L maximum cargo figure is practically unrivalled. 800V architecture ensures consistent charging in cold conditions — Scandinavian owners report far less variance than 400V alternatives. The third row is usable by adults, not just a specification. Software lags behind Tesla and Porsche, but interior quality and practical intelligence are class-leading. For families previously priced out of large EV ownership, the EV9 is the answer.",
    bestFor: "Families who need seven genuine seats, maximum cargo, and real winter reliability.",
    worstFor: "Solo drivers — the EV9 is large, less efficient at speed, and overkill for urban use.",
    accentColor: "text-emerald-400",
  },
  {
    slug: "hyundai-ioniq5",
    name: "Hyundai Ioniq 5",
    brand: "Hyundai",
    category: "Crossover",
    priceFrom: 42990,
    range: { real: 400, winter: 265, wltp: 507 },
    charging: { maxDC: 220, time10to80: 18, maxAC: 11 },
    motorwayEfficiency: 200,
    scores: { comfort: 85, practicality: 84, software: 78, networkCompat: 88, longDistance: 80, valueForMoney: 88 },
    cargoL: 531,
    annualCostEur: 1680,
    verdict: "The Ioniq 5 holds a charging record that matters: 18 minutes 10–80% on 800V infrastructure. That aligns a charging stop with a coffee and stretch, not a meal. The flat floor and moveable centre console create interior spatial efficiency that physically larger rivals can't match. Real-world range at 400 km is adequate but not exceptional — winter drops more noticeably than 800V peers from Porsche and Audi. The value story is compelling: 800V charging technology at a price €15,000–25,000 below German competition.",
    bestFor: "Buyers who prioritise charging speed above all — the 18-minute 10–80% remains best in class.",
    worstFor: "Long-distance winter drivers who need maximum range buffer.",
    accentColor: "text-cyan-400",
  },
  {
    slug: "bmw-i5",
    name: "BMW i5",
    brand: "BMW",
    category: "Executive Saloon",
    priceFrom: 70300,
    range: { real: 460, winter: 330, wltp: 582 },
    charging: { maxDC: 205, time10to80: 31, maxAC: 22 },
    motorwayEfficiency: 185,
    scores: { comfort: 93, practicality: 81, software: 84, networkCompat: 89, longDistance: 89, valueForMoney: 74 },
    cargoL: 490,
    annualCostEur: 2200,
    verdict: "The i5 doesn't apologise for being an EV — it gets on with being an excellent executive saloon. The 22 kW AC charging is a quietly significant feature: overnight hotel charging completes fully even on standard infrastructure. Highway efficiency at 185 Wh/km is exceptional for a vehicle this size. Interior quality is genuinely premium — not 'premium for an EV' — with leather, ambient lighting and driver focus that justifies the price against non-electric alternatives. The 31-minute DC charging time is the main concession against 800V rivals.",
    bestFor: "Business travellers who want ICE-equivalent quality with class-leading AC charging.",
    worstFor: "Buyers prioritising raw DC speed — the 400V architecture trails 800V competitors.",
    accentColor: "text-blue-400",
  },
  {
    slug: "audi-q6-etron",
    name: "Audi Q6 e-tron",
    brand: "Audi",
    category: "Premium SUV",
    priceFrom: 63500,
    range: { real: 510, winter: 365, wltp: 641 },
    charging: { maxDC: 270, time10to80: 21, maxAC: 11 },
    motorwayEfficiency: 205,
    scores: { comfort: 91, practicality: 86, software: 89, networkCompat: 91, longDistance: 94, valueForMoney: 78 },
    cargoL: 526,
    annualCostEur: 2050,
    verdict: "The Q6 e-tron is the most complete all-rounder in the European premium EV segment. 800V charging with minimal power taper — the real-world curve stays above 200 kW from 15% to 65% SOC — makes stop planning predictable. At 365 km winter range, it leads the comparison in cold conditions outside the Macan. The 510 km real-world figure comes from aerodynamics and drivetrain efficiency that Audi's engineers took seriously. Software has improved dramatically with MIB4 — it's no longer the weak point it once was.",
    bestFor: "Premium SUV buyers who prioritise winter range, charging predictability, and long-distance confidence.",
    worstFor: "Urban buyers — the Q6 is optimised for the open road, not city parking.",
    accentColor: "text-violet-400",
  },
  {
    slug: "volvo-ex30",
    name: "Volvo EX30",
    brand: "Volvo",
    category: "Compact SUV",
    priceFrom: 33990,
    range: { real: 340, winter: 220, wltp: 421 },
    charging: { maxDC: 153, time10to80: 26, maxAC: 11 },
    motorwayEfficiency: 188,
    scores: { comfort: 79, practicality: 71, software: 81, networkCompat: 84, longDistance: 68, valueForMoney: 92 },
    cargoL: 318,
    annualCostEur: 1420,
    verdict: "The EX30 answers a question no other manufacturer had properly addressed: what does a genuinely good, genuinely compact EV look like? At €33,990 base, it brings Volvo build quality and safety credentials to a price point that makes sense without government incentives. The 51 kWh battery is the honest limitation: 340 km at motorway speed is adequate for urban commuting but requires planning on longer runs. Winter at 220 km is the most significant constraint. For urban and suburban use, the EX30 punches considerably above its price — and its safety record is exemplary.",
    bestFor: "Urban buyers who want Volvo quality and low running costs at a genuinely sensible price.",
    worstFor: "Frequent long-distance motorway drivers — the small battery demands more stops.",
    accentColor: "text-sky-400",
  },
  {
    slug: "bmw-ix3",
    name: "BMW iX3",
    brand: "BMW",
    category: "Compact SUV",
    priceFrom: 55500,
    range: { real: 360, winter: 240, wltp: 461 },
    charging: { maxDC: 100, time10to80: 35, maxAC: 11 },
    motorwayEfficiency: 198,
    scores: { comfort: 83, practicality: 78, software: 77, networkCompat: 82, longDistance: 70, valueForMoney: 74 },
    cargoL: 510,
    annualCostEur: 1620,
    verdict: "The iX3 is BMW's safe choice — built on the familiar X3 platform, inheriting its ride quality and interior execution without demanding a significant lifestyle adjustment from diesel X3 owners. The 100 kW DC ceiling is the defining limitation: 35 minutes for a 10–80% charge means the iX3 demands more careful route planning than Ionity-optimised rivals. Winter range at 240 km is the most notable concession. For urban and suburban buyers who rarely exceed 200 km between charges, these constraints rarely surface. For road trippers, they define every long journey.",
    bestFor: "Former BMW X3 diesel owners wanting minimal change and proven quality.",
    worstFor: "Regular long-distance motorway drivers — 100 kW DC makes stops longer and more frequent.",
    accentColor: "text-blue-400",
  },
  {
    slug: "polestar-2",
    name: "Polestar 2",
    brand: "Polestar",
    category: "Saloon",
    priceFrom: 45990,
    range: { real: 460, winter: 295, wltp: 635 },
    charging: { maxDC: 205, time10to80: 28, maxAC: 11 },
    motorwayEfficiency: 175,
    scores: { comfort: 80, practicality: 75, software: 90, networkCompat: 84, longDistance: 83, valueForMoney: 84 },
    cargoL: 405,
    annualCostEur: 1760,
    verdict: "The Polestar 2 occupies a precise and deliberate position: Scandinavian engineering discipline, 205 kW fast charging, and Google's best software natively integrated — at a price that doesn't require justification the way a Porsche does. The 2024 refresh made it genuinely competitive with 205 kW DC and 635 km WLTP. Build quality from Chengdu is consistently above industry average. The cargo at 405 L is the main practical limitation. For tech-forward buyers who find the Model 3 too American and the BMW too conservative, the Polestar 2 answers precisely.",
    bestFor: "Tech-conscious buyers who want native Google integration, Scandinavian build quality, and fast DC charging.",
    worstFor: "Families needing maximum cargo or rear legroom — saloon proportions limit practicality.",
    accentColor: "text-emerald-400",
  },
  {
    slug: "skoda-enyaq",
    name: "Škoda Enyaq 85",
    brand: "Škoda",
    category: "Compact SUV",
    priceFrom: 38900,
    range: { real: 430, winter: 275, wltp: 562 },
    charging: { maxDC: 135, time10to80: 28, maxAC: 11 },
    motorwayEfficiency: 205,
    scores: { comfort: 80, practicality: 90, software: 72, networkCompat: 82, longDistance: 78, valueForMoney: 94 },
    cargoL: 585,
    annualCostEur: 1550,
    verdict: "The Enyaq 85 is the value play executed without compromise on the things that actually matter for families: cargo, space, and range. At €38,900, the 585 L boot and 430 km real-world range represent the best cost-per-practical-km in the comparison. MEB platform reliability is well-established across Volkswagen Group. The 135 kW DC charging is adequate rather than impressive — a 10–80% stop takes 28 minutes. Software and driving dynamics trail premium rivals. For buyers whose priority is family capability per euro rather than brand prestige, the Enyaq 85 is difficult to argue against.",
    bestFor: "Value-focused families who need maximum cargo, proven reliability, and adequate fast charging.",
    worstFor: "Performance or premium enthusiasts — the Enyaq is competent, not exciting.",
    accentColor: "text-emerald-400",
  },
  {
    slug: "volkswagen-id7",
    name: "Volkswagen ID.7",
    brand: "Volkswagen",
    category: "Executive Saloon",
    priceFrom: 49990,
    range: { real: 470, winter: 310, wltp: 621 },
    charging: { maxDC: 175, time10to80: 28, maxAC: 11 },
    motorwayEfficiency: 172,
    scores: { comfort: 86, practicality: 82, software: 78, networkCompat: 84, longDistance: 87, valueForMoney: 80 },
    cargoL: 532,
    annualCostEur: 1800,
    verdict: "The ID.7 brings 470 km of real-world motorway range in a package that consciously refuses to be dramatic. VW's aerodynamic engineering is the headline achievement — the Cd of 0.23 is class-best among non-purpose-built EVs, directly explaining the range figure. At 130 km/h on the Autobahn, the ID.7 loses range less rapidly than heavier, less aerodynamic rivals. The experience is calm, competent and unhurried. 175 kW DC is competitive without being exceptional. For executives and sales reps who drive 40,000 km annually and need reliability above all, the ID.7 delivers.",
    bestFor: "High-mileage motorway drivers who want maximum range with familiar VW ergonomics.",
    worstFor: "Performance drivers or those needing AWD — single-motor, comfort-only brief.",
    accentColor: "text-blue-400",
  },
];

export const COMPARE_CATEGORIES = [
  { key: "range.real", label: "Real-world range", unit: "km", type: "value" as const, higherBetter: true, description: "Estimated motorway range at mixed speed" },
  { key: "range.winter", label: "Winter range (−10°C)", unit: "km", type: "value" as const, higherBetter: true, description: "Estimated range in cold Nordic conditions" },
  { key: "charging.maxDC", label: "Max DC charging", unit: "kW", type: "value" as const, higherBetter: true, description: "Peak fast charging speed" },
  { key: "charging.time10to80", label: "10–80% charge time", unit: "min", type: "value" as const, higherBetter: false, description: "Time to charge from 10% to 80% at peak DC" },
  { key: "charging.maxAC", label: "Max AC charging", unit: "kW", type: "value" as const, higherBetter: true, description: "Maximum AC charging speed for overnight use" },
  { key: "motorwayEfficiency", label: "Motorway efficiency", unit: "Wh/km", type: "value" as const, higherBetter: false, description: "Energy use at 120 km/h — lower is better" },
  { key: "cargoL", label: "Cargo space", unit: "L", type: "value" as const, higherBetter: true, description: "Maximum cargo volume" },
  { key: "scores.comfort", label: "Comfort", unit: "/100", type: "score" as const, higherBetter: true, description: "Ride quality, NVH, seating" },
  { key: "scores.practicality", label: "Practicality", unit: "/100", type: "score" as const, higherBetter: true, description: "Space, flexibility, usability" },
  { key: "scores.software", label: "Software & Tech", unit: "/100", type: "score" as const, higherBetter: true, description: "Infotainment, OTA updates, driver assistance" },
  { key: "scores.networkCompat", label: "Network compatibility", unit: "/100", type: "score" as const, higherBetter: true, description: "Access to European charging infrastructure" },
  { key: "scores.longDistance", label: "Long-distance suitability", unit: "/100", type: "score" as const, higherBetter: true, description: "Overall road trip capability" },
  { key: "scores.valueForMoney", label: "Value for money", unit: "/100", type: "score" as const, higherBetter: true, description: "Capability per euro relative to segment" },
  { key: "annualCostEur", label: "Est. annual charging cost", unit: "€", type: "cost" as const, higherBetter: false, description: "Estimated annual charging cost (mixed home/public)" },
];

export function getNestedValue(obj: CompareModel, path: string): number {
  const parts = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  for (const part of parts) {
    current = current?.[part];
  }
  return current as number;
}

export function getBestValue(models: CompareModel[], key: string, higherBetter: boolean): number {
  const values = models.map((m) => getNestedValue(m, key));
  return higherBetter ? Math.max(...values) : Math.min(...values);
}
