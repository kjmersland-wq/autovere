export interface EVModel {
  slug: string;
  name: string;
  brand: string;
  year: number;
  category: "SUV" | "Saloon" | "Hatchback" | "Estate" | "Crossover";
  tagline: string;
  priceEur: { from: number; to: number };
  specs: {
    range: { wltp: number; realWorld: number; winter: number };
    battery: { capacity: number; usable: number };
    charging: { maxAC: number; maxDC: number; time10to80: number };
    performance: { zeroTo100: number; topSpeed: number; powerKw: number };
    dimensions: { lengthMm: number; weightKg: number; cargoL: number };
  };
  networks: string[];
  pros: string[];
  cons: string[];
  summary: string;
  winterNote: string;
  alternatives: string[];
  youtubeReviews: { videoId: string; channel: string; title: string; views: string }[];
  pricingByCountry: { country: string; price: number; note?: string }[];
}

export const EV_MODELS: EVModel[] = [
  {
    slug: "tesla-model-y",
    name: "Tesla Model Y",
    brand: "Tesla",
    year: 2024,
    category: "SUV",
    tagline: "Europe's best-selling EV. Polarising, practical, and devastatingly quick to charge.",
    priceEur: { from: 44990, to: 62990 },
    specs: {
      range: { wltp: 533, realWorld: 430, winter: 340 },
      battery: { capacity: 82, usable: 75 },
      charging: { maxAC: 11, maxDC: 250, time10to80: 25 },
      performance: { zeroTo100: 5.0, topSpeed: 217, powerKw: 220 },
      dimensions: { lengthMm: 4751, weightKg: 1979, cargoL: 854 },
    },
    networks: ["Tesla Supercharger", "Ionity", "Allego", "Fastned"],
    pros: ["250 kW Supercharger access everywhere in Europe", "Class-leading real-world efficiency", "Massive cargo space with frunk", "Regular OTA improvements", "Lowest 10–80% charge time in class"],
    cons: ["Interior quality below price point", "Firm ride on standard suspension", "No CarPlay or Android Auto", "Fit and finish inconsistency", "Minimalist controls take adjustment"],
    summary: "The Model Y remains the most practical choice for high-mileage European drivers. Supercharger access alone justifies serious consideration — 250 kW charging means a 25-minute stop from 10–80%. Range is class-competitive, efficiency best-in-class at motorway speeds. Ownership costs after 3 years routinely undercut equivalent diesel SUVs.",
    winterNote: "Range drops to approximately 340 km in Norwegian winter conditions (-10°C). Pre-conditioning is automatic when navigating to Superchargers. Heat pump standard from 2021 onwards significantly improves cold-weather efficiency.",
    alternatives: ["porsche-macan-ev", "kia-ev9", "bmw-ix"],
    youtubeReviews: [
      { videoId: "8t6BWSV-2ps", channel: "MKBHD", title: "Tesla Model Y: The Best Electric Car?", views: "4.2M" },
      { videoId: "Gn5fLhpYv3g", channel: "Bjørn Nyland", title: "Model Y Winter Range Test Norway", views: "1.8M" },
      { videoId: "xYFqVDvE-6Y", channel: "AutoTrader UK", title: "Tesla Model Y Long Range Review", views: "890K" },
    ],
    pricingByCountry: [
      { country: "Norway", price: 389990, note: "NOK — no VAT on EVs" },
      { country: "Germany", price: 44990, note: "EUR incl. VAT" },
      { country: "Netherlands", price: 46990, note: "EUR incl. VAT" },
      { country: "Sweden", price: 499000, note: "SEK incl. VAT" },
      { country: "France", price: 43990, note: "EUR — bonus écologique may apply" },
    ],
  },
  {
    slug: "porsche-macan-ev",
    name: "Porsche Macan Electric",
    brand: "Porsche",
    year: 2024,
    category: "SUV",
    tagline: "The sharpest EV crossover in Europe. Built for drivers, not just commuters.",
    priceEur: { from: 73600, to: 99000 },
    specs: {
      range: { wltp: 613, realWorld: 490, winter: 380 },
      battery: { capacity: 100, usable: 96.8 },
      charging: { maxAC: 11, maxDC: 270, time10to80: 21 },
      performance: { zeroTo100: 3.3, topSpeed: 260, powerKw: 470 },
      dimensions: { lengthMm: 4784, weightKg: 2195, cargoL: 540 },
    },
    networks: ["Ionity", "Allego", "Fastned", "Tesla (via adapter)"],
    pros: ["270 kW peak charging — fastest in class", "Exceptional driving dynamics", "Premium interior with analogue touches", "800V architecture for consistent charging speed", "Rear-axle steering on Turbo"],
    cons: ["Price premium vs competition", "Smaller cargo than Model Y", "Apple CarPlay wired only", "Higher tyre costs", "Range not class-leading despite big battery"],
    summary: "The Macan Electric is what happens when a sports car company electrifies an SUV without compromising. The 800V architecture delivers 270 kW charging peak with minimal taper — a Macan Turbo adds 100 km of real-world range in roughly 11 minutes. The interior is the best in any EV crossover. For drivers who find the Model Y clinically correct but emotionally blank, the Macan answers that question.",
    winterNote: "800V architecture and Porsche's thermal management system deliver relatively consistent charging speeds in cold weather. Range in Scandinavian winter is approximately 380 km. Pre-conditioning via Porsche Connect app.",
    alternatives: ["tesla-model-y", "audi-q6-etron", "bmw-ix"],
    youtubeReviews: [
      { videoId: "v7l8e_tDSdo", channel: "Carwow", title: "Porsche Macan Electric Review", views: "2.1M" },
      { videoId: "JxJY3j7IGFU", channel: "Top Gear", title: "Porsche Macan EV: Worth It?", views: "1.4M" },
      { videoId: "HoMLEcr7L7o", channel: "Bjørn Nyland", title: "Macan EV 270 kW Charging Test", views: "640K" },
    ],
    pricingByCountry: [
      { country: "Norway", price: 819900, note: "NOK — no VAT" },
      { country: "Germany", price: 73600, note: "EUR" },
      { country: "Netherlands", price: 76200, note: "EUR" },
      { country: "Sweden", price: 849000, note: "SEK" },
    ],
  },
  {
    slug: "kia-ev9",
    name: "Kia EV9",
    brand: "Kia",
    year: 2024,
    category: "SUV",
    tagline: "Seven seats, 800V charging, and the most honest family EV on the market.",
    priceEur: { from: 64990, to: 84990 },
    specs: {
      range: { wltp: 563, realWorld: 450, winter: 350 },
      battery: { capacity: 99.8, usable: 98 },
      charging: { maxAC: 11, maxDC: 233, time10to80: 24 },
      performance: { zeroTo100: 4.2, topSpeed: 200, powerKw: 379 },
      dimensions: { lengthMm: 5010, weightKg: 2620, cargoL: 333 },
    },
    networks: ["Ionity", "Allego", "Fastned", "Recharge", "Tesla (via adapter)"],
    pros: ["Genuine 7-seat practicality", "800V charging architecture", "V2L and V2G capability", "Class-leading towing (2,500 kg)", "Outstanding warranty coverage"],
    cons: ["Large size limits urban parking", "Third row only for children", "High kerb weight affects efficiency", "Infotainment lag occasionally", "Limited boot with 3rd row up"],
    summary: "The EV9 is for families who genuinely need seven seats and refuse to compromise on electrification. At 5 metres long and 2,620 kg, it's a full-size SUV — and the 800V charging system means that 563 km WLTP tank doesn't require all-day charging stops. Vehicle-to-load capability turns it into a portable power station at campsites. Kia's 7-year warranty removes most long-term ownership anxiety.",
    winterNote: "Range in Nordic winter drops to approximately 350 km. Large battery and good thermal management deliver consistent charging. Pre-conditioning available via Kia Connect. Third row heating included on GT-Line and above.",
    alternatives: ["tesla-model-y", "hyundai-ioniq5", "volvo-ex90"],
    youtubeReviews: [
      { videoId: "Bfm6-X0j4zY", channel: "Carwow", title: "Kia EV9 Review: Best 7-Seat EV?", views: "1.9M" },
      { videoId: "SJWmjp4WXQE", channel: "Bjørn Nyland", title: "Kia EV9 Range and Charging Test", views: "1.1M" },
      { videoId: "KKbGh8T9LKQ", channel: "AutoTrader UK", title: "Kia EV9 Long-Term Review", views: "520K" },
    ],
    pricingByCountry: [
      { country: "Norway", price: 599900, note: "NOK" },
      { country: "Germany", price: 64990, note: "EUR" },
      { country: "Netherlands", price: 67990, note: "EUR" },
      { country: "Sweden", price: 699000, note: "SEK" },
    ],
  },
  {
    slug: "hyundai-ioniq5",
    name: "Hyundai IONIQ 5",
    brand: "Hyundai",
    year: 2024,
    category: "Crossover",
    tagline: "800V ultra-fast charging in a retro-futurist crossover. The enthusiast's value pick.",
    priceEur: { from: 41900, to: 62900 },
    specs: {
      range: { wltp: 507, realWorld: 400, winter: 310 },
      battery: { capacity: 84, usable: 80 },
      charging: { maxAC: 11, maxDC: 230, time10to80: 18 },
      performance: { zeroTo100: 3.5, topSpeed: 185, powerKw: 325 },
      dimensions: { lengthMm: 4635, weightKg: 2100, cargoL: 527 },
    },
    networks: ["Ionity", "Allego", "Fastned", "Tesla (via adapter)"],
    pros: ["800V / 230 kW peak charging", "18-minute 10–80% charge time", "Distinctive design with huge interior", "Vehicle-to-load (V2L) standard", "Sliding rear bench for legroom flexibility"],
    cons: ["WLTP range modest for battery size", "Smaller boot than crossover rivals", "Highway range below class average", "Updated 2024 model not yet widely available", "Rear visibility limited"],
    summary: "The IONIQ 5 changed what value means in the EV market. An 18-minute 10–80% charge time at 230 kW was extraordinary when launched and remains class-leading for its price. The interior is genuinely spacious — the flat floor and sliding rear bench make it feel larger than dimensions suggest. V2L means it can power camping equipment or charge other devices. The 2024 facelift adds range and refinement.",
    winterNote: "Range drops noticeably in winter — budget 310 km in -10°C conditions. 800V architecture means charging speed holds up better than many rivals in cold. Pre-conditioning via Hyundai Bluelink.",
    alternatives: ["kia-ev9", "tesla-model-y", "bmw-i5"],
    youtubeReviews: [
      { videoId: "vS1oCY-YKUU", channel: "Bjørn Nyland", title: "IONIQ 5 230kW Charging Test", views: "2.3M" },
      { videoId: "NcWwuqR4HJA", channel: "Fully Charged Show", title: "Hyundai IONIQ 5 Review", views: "1.2M" },
      { videoId: "m_Hy0FaJ5js", channel: "Carwow", title: "IONIQ 5 vs Model Y — Which Wins?", views: "3.1M" },
    ],
    pricingByCountry: [
      { country: "Norway", price: 389900, note: "NOK" },
      { country: "Germany", price: 41900, note: "EUR" },
      { country: "Netherlands", price: 43500, note: "EUR" },
      { country: "Sweden", price: 449000, note: "SEK" },
    ],
  },
  {
    slug: "bmw-i5",
    name: "BMW i5",
    brand: "BMW",
    year: 2024,
    category: "Saloon",
    tagline: "The executive saloon benchmark. Sport and sophistication, electrified without compromise.",
    priceEur: { from: 69900, to: 98000 },
    specs: {
      range: { wltp: 582, realWorld: 460, winter: 360 },
      battery: { capacity: 84, usable: 81.2 },
      charging: { maxAC: 22, maxDC: 205, time10to80: 31 },
      performance: { zeroTo100: 3.8, topSpeed: 230, powerKw: 442 },
      dimensions: { lengthMm: 4976, weightKg: 2215, cargoL: 490 },
    },
    networks: ["Ionity", "Allego", "Fastned", "BMW Charging"],
    pros: ["22 kW AC charging (exceptional)", "Driving dynamics class-leading", "Interior quality benchmark", "iDrive 9 — best EV infotainment", "Curved display and HUD standard"],
    cons: ["Kidney grille divisive", "Heavier than petrol 5 Series", "205 kW DC charging behind class leaders", "Price creeps high when optioned", "Subscription features controversial"],
    summary: "The i5 is the answer for drivers who've always bought 5 Series and aren't ready to accept interior compromises. The 22 kW AC charging is almost uniquely generous — overnight at a 22 kW wallbox fills from empty. iDrive 9 is genuinely the best EV infotainment system on sale: quick, logical, CarPlay wireless standard. DC charging at 205 kW trails Porsche and Hyundai, but real-world route planning rarely exposes this.",
    winterNote: "Range of approximately 360 km in Nordic winter. 22 kW AC charging particularly useful for overnight hotel charging. Pre-conditioning via BMW app with cabin ready on arrival.",
    alternatives: ["porsche-macan-ev", "audi-q6-etron", "hyundai-ioniq5"],
    youtubeReviews: [
      { videoId: "8PK3hzKN3-E", channel: "Carwow", title: "BMW i5 Review: Is It Worth It?", views: "1.7M" },
      { videoId: "IG_EcJSwbX8", channel: "AutoTrader UK", title: "BMW i5 M60 Long-Term Review", views: "690K" },
      { videoId: "h04cjC3Rjkw", channel: "Bjørn Nyland", title: "BMW i5 Range Test Norway", views: "840K" },
    ],
    pricingByCountry: [
      { country: "Norway", price: 649900, note: "NOK" },
      { country: "Germany", price: 69900, note: "EUR" },
      { country: "Netherlands", price: 72900, note: "EUR" },
      { country: "Sweden", price: 749000, note: "SEK" },
    ],
  },
  {
    slug: "audi-q6-etron",
    name: "Audi Q6 e-tron",
    brand: "Audi",
    year: 2024,
    category: "SUV",
    tagline: "Audi's first true EV-native platform. Efficiency and refinement, finally reconciled.",
    priceEur: { from: 63400, to: 89000 },
    specs: {
      range: { wltp: 641, realWorld: 510, winter: 400 },
      battery: { capacity: 100, usable: 94.9 },
      charging: { maxAC: 11, maxDC: 270, time10to80: 22 },
      performance: { zeroTo100: 4.3, topSpeed: 210, powerKw: 285 },
      dimensions: { lengthMm: 4771, weightKg: 2185, cargoL: 526 },
    },
    networks: ["Ionity", "Allego", "Fastned", "AUDI charging service"],
    pros: ["800V / 270 kW charging — best in class", "641 km WLTP longest range in class", "Dual-screen MMI standard", "Exceptional motorway efficiency", "Quiet cabin at speed"],
    cons: ["Not as driver-focused as Porsche sibling", "Infotainment transition still ongoing", "Larger dimensions limit parking", "No CarPlay on base models", "Price of SQ6 variant excessive"],
    summary: "Built on the PPE platform shared with the Porsche Macan Electric, the Q6 e-tron delivers 800V charging architecture at an Audi price point. The 641 km WLTP range is the longest in its segment, and the 270 kW peak charging with minimal taper means real-world route planning is genuinely relaxed. The dual-screen MMI system is a significant step forward from earlier Audi EVs. This is the Audi for people who've been waiting for them to get it right.",
    winterNote: "Excellent winter performance — 400 km realistic in northern Europe conditions. 800V architecture holds charging speed better than 400V rivals in cold. Pre-conditioning via myAudi app.",
    alternatives: ["porsche-macan-ev", "bmw-i5", "tesla-model-y"],
    youtubeReviews: [
      { videoId: "CdWAaVvIGu8", channel: "Carwow", title: "Audi Q6 e-tron Review", views: "1.5M" },
      { videoId: "c87bDDgGpRg", channel: "Bjørn Nyland", title: "Audi Q6 e-tron 270kW Charge Test", views: "780K" },
      { videoId: "L9kJmfgk-IE", channel: "AutoTrader UK", title: "Audi Q6 e-tron: First Drive", views: "540K" },
    ],
    pricingByCountry: [
      { country: "Norway", price: 619900, note: "NOK" },
      { country: "Germany", price: 63400, note: "EUR" },
      { country: "Netherlands", price: 66500, note: "EUR" },
      { country: "Sweden", price: 699000, note: "SEK" },
    ],
  },
  {
    slug: "volvo-ex30",
    name: "Volvo EX30",
    brand: "Volvo",
    year: 2024,
    category: "Crossover",
    tagline: "The smallest Volvo. The most sustainable car in production. Genuinely compelling.",
    priceEur: { from: 35900, to: 48900 },
    specs: {
      range: { wltp: 480, realWorld: 370, winter: 280 },
      battery: { capacity: 69, usable: 64 },
      charging: { maxAC: 11, maxDC: 153, time10to80: 26 },
      performance: { zeroTo100: 3.6, topSpeed: 180, powerKw: 315 },
      dimensions: { lengthMm: 4233, weightKg: 1800, cargoL: 318 },
    },
    networks: ["Ionity", "Allego", "Fastned", "Recharge"],
    pros: ["Most sustainable new car in production (CO2 per km)", "Excellent urban maneuverability", "Surprisingly quick — 3.6s to 100 km/h", "Minimal, considered interior design", "Competitive base price"],
    cons: ["Small boot for a family", "Sound system in steering wheel unusual", "Limited rear headroom for tall adults", "153 kW DC — behind class leaders", "Phone holder infotainment won't suit everyone"],
    summary: "The EX30 is Volvo's honest attempt at making EVs genuinely accessible without sacrificing what makes a Volvo a Volvo. The lowest CO2 per km of any production car — counting manufacturing, energy and lifetime use — is a meaningful claim. Packaging is clever: a 318 L boot, rear seats usable for adults, and a minimalist interior that's genuinely pleasant rather than just sparse. For urban and suburban drivers who don't regularly travel 400+ km on single charges, it's the most considered small EV available.",
    winterNote: "Range drops to approximately 280 km in winter — the smaller battery feels this more than rivals. Volvo's climate preconditioning helps. Best suited for drivers with reliable home charging.",
    alternatives: ["hyundai-ioniq5", "tesla-model-y", "kia-ev9"],
    youtubeReviews: [
      { videoId: "4rQnkT9Gfg8", channel: "Fully Charged Show", title: "Volvo EX30: The Greenest Car Made", views: "980K" },
      { videoId: "Xf_K5kJe1AY", channel: "Carwow", title: "Volvo EX30 Review — Small But Mighty", views: "2.4M" },
      { videoId: "OVXmIRVCqTs", channel: "AutoTrader UK", title: "Volvo EX30 Twin Motor Performance", views: "670K" },
    ],
    pricingByCountry: [
      { country: "Norway", price: 309900, note: "NOK" },
      { country: "Germany", price: 35900, note: "EUR" },
      { country: "Netherlands", price: 37500, note: "EUR" },
      { country: "Sweden", price: 389000, note: "SEK" },
    ],
  },
  {
    slug: "bmw-ix",
    name: "BMW iX",
    brand: "BMW",
    year: 2024,
    category: "SUV",
    tagline: "BMW's technology flagship. Divisive design, undeniable capability.",
    priceEur: { from: 77300, to: 118000 },
    specs: {
      range: { wltp: 630, realWorld: 500, winter: 390 },
      battery: { capacity: 111.5, usable: 105.2 },
      charging: { maxAC: 22, maxDC: 195, time10to80: 35 },
      performance: { zeroTo100: 3.6, topSpeed: 250, powerKw: 619 },
      dimensions: { lengthMm: 4953, weightKg: 2585, cargoL: 500 },
    },
    networks: ["Ionity", "Allego", "Fastned", "BMW Charging"],
    pros: ["Exceptional interior refinement", "22 kW AC standard", "Impressive real-world range", "Near-silent cabin", "Advanced driver assistance"],
    cons: ["Exterior design not universally liked", "195 kW DC charging modest for premium price", "Heavy at 2,585 kg", "High option costs", "Large footprint"],
    summary: "The iX remains BMW's most ambitious EV — designed from the ground up without ICE constraints. The interior is the reference point for EV luxury: bespoke materials, near-silence at 130 km/h, and the most advanced head-up display in any car. The 22 kW AC charging alongside 630 km WLTP range means overnight charges are genuinely rare. 195 kW DC is the weak point at this price, but BMW's driver routing software is conservative — you rarely see battery below 20% on planned routes.",
    winterNote: "Outstanding winter capability. 390 km in Nordic winter from the large battery. Heat pump standard. 22 kW AC makes hotel overnight stops trivial — 0–100% in under 5 hours.",
    alternatives: ["audi-q6-etron", "porsche-macan-ev", "tesla-model-y"],
    youtubeReviews: [
      { videoId: "gqH_QZ3U-KI", channel: "Carwow", title: "BMW iX Review", views: "2.2M" },
      { videoId: "m7XMm4nTsiI", channel: "AutoTrader UK", title: "BMW iX M60 — The Ultimate EV?", views: "910K" },
      { videoId: "x2HiCHnHmIY", channel: "Bjørn Nyland", title: "BMW iX Range Test — How Far?", views: "1.3M" },
    ],
    pricingByCountry: [
      { country: "Norway", price: 769900, note: "NOK" },
      { country: "Germany", price: 77300, note: "EUR" },
      { country: "Netherlands", price: 80500, note: "EUR" },
      { country: "Sweden", price: 849000, note: "SEK" },
    ],
  },
];
