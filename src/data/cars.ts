import carSnow from "@/assets/car-snow.jpg";
import carSedan from "@/assets/car-sedan.jpg";
import carFamily from "@/assets/car-family.jpg";
import sceneNight from "@/assets/scene-night-drive.jpg";
import sceneNordic from "@/assets/scene-nordic.jpg";
import sceneRoad from "@/assets/scene-roadtrip.jpg";
import sceneQuiet from "@/assets/scene-quiet.jpg";
import sceneCity from "@/assets/scene-city.jpg";

export type Car = {
  slug: string;
  name: string;
  brand: string;
  type: string;
  tagline: string;
  fit: string;
  score: number;
  tag: string;
  hero: string;
  gallery: string[];
  summary: string;
  personality: string;
  comfort: string;
  climate: string;
  practicality: string;
  ownership: string;
  strengths: string[];
  tradeoffs: string[];
  lifestyle: string;
  range?: string;
  seats?: number;
  startingPrice?: string;
  drivetrain?: string;
  comparesWellWith: string[]; // other slugs
};

export const CARS: Car[] = [
  {
    slug: "polestar-3",
    name: "Polestar 3",
    brand: "Polestar",
    type: "Electric SUV",
    tagline: "Calm, refined, Scandinavian.",
    fit: "Quiet confidence",
    score: 96,
    tag: "Best for cold climates",
    hero: carSnow,
    gallery: [carSnow, sceneNordic, sceneQuiet],
    summary:
      "The Polestar 3 doesn't try to impress you — it tries to settle you. Its design is minimalist Scandinavian craft, and on cold roads it feels uncannily composed. This is a car for people who choose quietness as a luxury.",
    personality: "Calm Explorer · Quiet Executive",
    comfort: "Long-distance posture, cabin sealed against road noise, suspension tuned for composure over sport.",
    climate: "Excellent in winter — AWD, heat pump, pre-conditioning, and cabin warmth that holds at -15°.",
    practicality: "Spacious for two adults plus gear; family-capable but not minivan-roomy.",
    ownership: "Direct-to-customer service, modest annual costs, software updates that improve the car over time.",
    strengths: [
      "Genuinely quiet at highway speeds",
      "Composed AWD on snow and ice",
      "Interior that feels handmade",
      "Restraint instead of screen overload",
    ],
    tradeoffs: [
      "Range is good, not class-leading",
      "Rear visibility is sculpted, not generous",
      "Service network still maturing in some regions",
    ],
    lifestyle:
      "Built for a person who drives to think. Long winter weekends, mountain cabins, the kind of commute you don't dread.",
    range: "560 km WLTP",
    seats: 5,
    startingPrice: "from €78,000",
    drivetrain: "Dual-motor AWD",
    comparesWellWith: ["volvo-ex90", "bmw-i5"],
  },
  {
    slug: "bmw-i5",
    name: "BMW i5",
    brand: "BMW",
    type: "Executive EV Sedan",
    tagline: "Drives like a sport sedan, pampers like a flagship.",
    fit: "Spirited & refined",
    score: 93,
    tag: "Best for daily drivers",
    hero: carSedan,
    gallery: [carSedan, sceneNight, sceneCity],
    summary:
      "The i5 is what happens when an executive sedan stops apologising for being electric. It steers like a 5 Series should, but its silence reframes every commute as something close to meditation.",
    personality: "Quiet Executive · Performance Romantic",
    comfort: "Ergonomically obsessive seats, supple ride, cabin acoustics that absorb the city.",
    climate: "Strong all-rounder; rear-bias variants prefer dry tarmac, AWD model handles wet and snow with confidence.",
    practicality: "Saloon space, generous boot, but lower step-in than an SUV.",
    ownership: "Premium servicing, strong residuals, software ecosystem that keeps maturing.",
    strengths: [
      "Steering feel that still rewards",
      "Quiet, unhurried highway character",
      "Tech that feels considered, not flashy",
      "Comfortable across long distances",
    ],
    tradeoffs: [
      "Premium pricing for premium feel",
      "Curved display polarises",
      "Rear headroom slightly compromised by roofline",
    ],
    lifestyle:
      "For someone who drives a lot, alone, and treats the commute as personal time. Confident in the city, calm on the motorway.",
    range: "505 km WLTP",
    seats: 5,
    startingPrice: "from €72,000",
    drivetrain: "RWD or AWD",
    comparesWellWith: ["mercedes-eqe", "polestar-3"],
  },
  {
    slug: "volvo-ex90",
    name: "Volvo EX90",
    brand: "Volvo",
    type: "Family Electric SUV",
    tagline: "Quietly capable. Family-first, beautifully understated.",
    fit: "Quietly capable",
    score: 95,
    tag: "Best for families",
    hero: carFamily,
    gallery: [carFamily, sceneRoad, sceneNordic],
    summary:
      "The EX90 is what families ask for when they stop pretending they want a sports car. It's spacious, safe, calm, and quietly luxurious — the antidote to the over-styled three-row SUV.",
    personality: "Calm Explorer · Weekend Escapist",
    comfort: "Three real rows, quiet cabin, materials that age gracefully.",
    climate: "Designed in Sweden — winter is its native habitat. Pre-conditioning, AWD, heated everything.",
    practicality: "Genuine 7-seater capability, big boot, easy car-seat geometry.",
    ownership: "Volvo dealer comfort, predictable maintenance, strong safety reputation.",
    strengths: [
      "Spacious without feeling oversized",
      "Genuine winter competence",
      "Calm, uncluttered interior",
      "Class-leading safety architecture",
    ],
    tradeoffs: [
      "Software has matured slowly",
      "Not the sportiest steering",
      "Charging speeds are good, not exceptional",
    ],
    lifestyle:
      "Built for families who'd rather feel calm than impressive. Long road trips, school runs, and ski weekends without compromise.",
    range: "600 km WLTP",
    seats: 7,
    startingPrice: "from €85,000",
    drivetrain: "Dual-motor AWD",
    comparesWellWith: ["kia-ev9", "polestar-3"],
  },
  {
    slug: "mercedes-eqe",
    name: "Mercedes EQE",
    brand: "Mercedes-Benz",
    type: "Executive EV Sedan",
    tagline: "Quiet luxury, the German way.",
    fit: "Refined & insulated",
    score: 91,
    tag: "Quiet luxury",
    hero: sceneQuiet,
    gallery: [sceneQuiet, sceneNight, carSedan],
    summary:
      "The EQE is a serene, sound-isolated sanctuary on wheels — closer in spirit to an S-Class than a sport sedan. It rewards passengers as much as drivers.",
    personality: "Quiet Executive · Calm Explorer",
    comfort: "Air suspension, near-silent cabin, seats engineered for hours, not minutes.",
    climate: "Comfortable in any weather; AWD variants competent in snow.",
    practicality: "Sedan boot, generous rear legroom, lower roofline than an SUV.",
    ownership: "Dense Mercedes service network, strong long-distance support.",
    strengths: [
      "Cabin quietness in a class of its own",
      "Long-distance composure",
      "Ride quality on air suspension",
      "Brand prestige and resale support",
    ],
    tradeoffs: [
      "Hyperscreen is overwhelming for some",
      "Steering feel is calmer than communicative",
      "Styling is divisive",
    ],
    lifestyle:
      "For people who value silence over speed. Executives, long-distance commuters, anyone who treats driving as decompression.",
    range: "590 km WLTP",
    seats: 5,
    startingPrice: "from €74,000",
    drivetrain: "RWD or AWD",
    comparesWellWith: ["bmw-i5"],
  },
  {
    slug: "kia-ev9",
    name: "Kia EV9",
    brand: "Kia",
    type: "Family Electric SUV",
    tagline: "Three rows, real presence, surprising calm.",
    fit: "Spacious & honest",
    score: 92,
    tag: "Best family value",
    hero: sceneRoad,
    gallery: [sceneRoad, carFamily, sceneCity],
    summary:
      "The EV9 is the family SUV many people didn't realise they wanted. It's huge inside, charges fast, and feels considered in a way Kia's competitors are still catching up to.",
    personality: "Weekend Escapist · Calm Explorer",
    comfort: "Lounge-like rear seats, flat floor, quiet cabin for the price.",
    climate: "Capable AWD, winter-ready trims, fast charging that thrives on cold-weather road trips.",
    practicality: "Best-in-class interior space, real 6 or 7-seat usability.",
    ownership: "Strong warranty, increasingly mature dealer network, predictable cost of ownership.",
    strengths: [
      "Genuinely spacious three-row cabin",
      "Fast 800V charging",
      "Honest, calm design language",
      "Aggressive value for the package",
    ],
    tradeoffs: [
      "Not the most refined steering",
      "Range with full load drops noticeably",
      "Brand perception still evolving in premium segment",
    ],
    lifestyle:
      "For families who want EX90-style space without EX90 pricing. Road trips, sports clubs, full-load weekend escapes.",
    range: "563 km WLTP",
    seats: 7,
    startingPrice: "from €72,000",
    drivetrain: "RWD or AWD",
    comparesWellWith: ["volvo-ex90"],
  },
];

export const getCar = (slug: string) => CARS.find((c) => c.slug === slug);

export type Collection = {
  slug: string;
  title: string;
  description: string;
  image: string;
  body: string;
  cars: string[]; // slugs
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "nordic-winters",
    title: "Best cars for Nordic winters",
    description: "Composed on snow. Quiet on ice. Heated where it matters.",
    image: carSnow,
    body:
      "Winter doesn't care about marketing. These are the cars Lumen returns to when the temperature drops and the road disappears under snow — competent, calm, and comfortable in conditions where most cars become a chore.",
    cars: ["polestar-3", "volvo-ex90", "kia-ev9"],
  },
  {
    slug: "quiet-luxury",
    title: "Quiet luxury EVs",
    description: "Presence without announcement. Craft over chrome.",
    image: sceneQuiet,
    body:
      "Luxury used to shout. The new generation whispers. These cars choose silence, restraint, and material honesty over chrome and badge theatre — they reward you every time you sit inside.",
    cars: ["mercedes-eqe", "polestar-3", "bmw-i5"],
  },
  {
    slug: "long-distance-comfort",
    title: "Built for long-distance comfort",
    description: "Six hours that should feel like one.",
    image: sceneRoad,
    body:
      "Long drives expose every compromise. Seats betray you at hour four. Wind noise wears you down. These cars were engineered with the road trip in mind — and Lumen ranks them for the reality, not the brochure.",
    cars: ["mercedes-eqe", "volvo-ex90", "bmw-i5"],
  },
  {
    slug: "underestimated",
    title: "Cars people underestimated",
    description: "Outside the spotlight. Inside, more thought than you'd expect.",
    image: sceneCity,
    body:
      "Not every great car arrives with a marketing budget. These are the ones owners love more after a year, not less — quietly excellent, often overlooked, almost always the right answer.",
    cars: ["kia-ev9", "polestar-3"],
  },
  {
    slug: "best-family-evs",
    title: "Best family EVs",
    description: "Space, safety, and calm — without compromise.",
    image: carFamily,
    body:
      "A family car is a quiet contract: safety, space, reliability, and a cabin that survives years of school runs and road trips. These EVs deliver on all of it, without losing what makes a great car feel great to drive.",
    cars: ["volvo-ex90", "kia-ev9", "polestar-3"],
  },
  {
    slug: "city-life",
    title: "Cars built for city life",
    description: "Composed in traffic. Confident in tight streets.",
    image: sceneCity,
    body:
      "Cities punish bad cars. Visibility, footprint, low-speed refinement, and easy parking matter more than 0–100 times. These are Lumen's calmest urban companions.",
    cars: ["bmw-i5", "polestar-3"],
  },
];

export const getCollection = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);

export type Personality = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  whoYouAre: string;
  whatYouValue: string[];
  matches: string[]; // slugs
  prompt: string;
};

export const PERSONALITIES: Personality[] = [
  {
    slug: "calm-explorer",
    name: "Calm Explorer",
    tagline: "Long horizons, quiet thoughts.",
    description:
      "You drive to clear your head. You'd rather glide than race. Comfort beats horsepower, every time.",
    whoYouAre:
      "You think of driving as time, not performance. The right car is the one that lets the world go quiet around you and gives you back a clearer head at the other end.",
    whatYouValue: ["Cabin silence", "Composed ride", "Honest design", "Range that disappears as a worry"],
    matches: ["polestar-3", "volvo-ex90", "mercedes-eqe"],
    prompt: "I'm a Calm Explorer — long drives, quiet head, comfort over speed. What 3 cars should I look at?",
  },
  {
    slug: "quiet-executive",
    name: "Quiet Executive",
    tagline: "Refinement without announcement.",
    description: "You want presence, not attention. Tech that disappears into craft.",
    whoYouAre:
      "Your car is part of your professional life. It needs to look composed, sound composed, and respect every minute of your day.",
    whatYouValue: ["Insulation", "Material honesty", "Predictable luxury", "Service density"],
    matches: ["bmw-i5", "mercedes-eqe", "polestar-3"],
    prompt: "I'm a Quiet Executive — long highway commutes, restrained luxury, calm tech. Recommend 3 cars.",
  },
  {
    slug: "weekend-escapist",
    name: "Weekend Escapist",
    tagline: "Monday city. Saturday wild.",
    description: "Capable when it matters. Quiet when it doesn't.",
    whoYouAre:
      "You commute through the week and disappear on the weekend. The right car has to do both without resentment.",
    whatYouValue: ["AWD competence", "Space for gear", "Long range", "Calm city manners"],
    matches: ["volvo-ex90", "kia-ev9", "polestar-3"],
    prompt: "I'm a Weekend Escapist — city weekdays, mountains and trips on weekends. Recommend 3 cars.",
  },
  {
    slug: "urban-minimalist",
    name: "Urban Minimalist",
    tagline: "Less, but better. Every day.",
    description: "Tight streets, premium feel, zero compromise.",
    whoYouAre:
      "You live in a city. Your car needs to be small enough to disappear into traffic and refined enough to make the drive feel intentional.",
    whatYouValue: ["Compact footprint", "Premium cabin", "Easy parking", "Quiet design"],
    matches: ["bmw-i5", "polestar-3"],
    prompt: "I'm an Urban Minimalist — city driving, compact, premium feel. Recommend 3 cars.",
  },
  {
    slug: "performance-romantic",
    name: "Performance Romantic",
    tagline: "It should make you smile.",
    description: "Specs are the language, but feeling is the point.",
    whoYouAre:
      "You want a car you'll talk about in 20 years. Numbers matter, but feel matters more.",
    whatYouValue: ["Steering feel", "Acceleration response", "Sound (or its absence)", "Design that ages well"],
    matches: ["bmw-i5", "polestar-3"],
    prompt: "I'm a Performance Romantic — I want a car that makes me smile every time I drive it. Recommend 3.",
  },
  {
    slug: "nordic-adventurer",
    name: "Nordic Adventurer",
    tagline: "At home where the road ends.",
    description: "Cold weather, long distances, and the trips most cars never see.",
    whoYouAre:
      "You live where winter is real. The car has to start, hold heat, hold the road, and not feel like a compromise the rest of the year.",
    whatYouValue: ["AWD", "Heat pump", "Range in cold", "Cabin warmth that holds"],
    matches: ["volvo-ex90", "polestar-3", "kia-ev9"],
    prompt: "I'm a Nordic Adventurer — winter driving, long cold trips. Recommend 3 cars.",
  },
];

export const getPersonality = (slug: string) =>
  PERSONALITIES.find((p) => p.slug === slug);

export type LearnArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  category: string;
};

export const LEARN: LearnArticle[] = [
  {
    slug: "how-the-ai-works",
    title: "How the Lumen AI actually works",
    category: "Inside Lumen",
    excerpt:
      "Lumen is an emotionally intelligent advisor — not a filter. Here's how it interprets your life and turns it into a small, honest set of matches.",
    body: [
      "Lumen starts from the premise that the right car is a personal answer to a personal question. So it doesn't ask you to filter; it asks you to describe.",
      "When you tell Lumen about your climate, your family, your commute, or how driving makes you feel, it interprets those signals across hundreds of dimensions — not as keywords, but as meaning.",
      "It then narrows the field to two or three cars worth your attention, and explains the tradeoffs honestly. The goal is clarity, not choice paralysis.",
    ],
  },
  {
    slug: "how-recommendations-work",
    title: "How recommendations work",
    category: "Inside Lumen",
    excerpt:
      "Why Lumen shows you 2–3 cars instead of 47, and how it decides which ones deserve your attention.",
    body: [
      "Most platforms confuse choice with help. Lumen takes the opposite position: the more accurately it understands you, the fewer cars you should see.",
      "Recommendations are weighted across personality fit, climate, lifestyle, ownership reality, and emotional resonance — not just specs.",
      "Every match comes with the genuine compromises, because trust is earned by being honest about what isn't perfect.",
    ],
  },
  {
    slug: "ev-explained-simply",
    title: "EVs, explained simply",
    category: "Understand the basics",
    excerpt:
      "Range, charging, battery health, and the things that actually matter day-to-day — without the jargon.",
    body: [
      "An EV is, mostly, a quieter car with a different fueling habit. The hard parts are charging logistics, cold-weather range, and battery longevity — and they're easier to understand than the industry pretends.",
      "Range numbers are a moving target. Real-world range depends on temperature, speed, terrain, and how you drive. A car rated at 500 km might give you 380 in winter.",
      "Charging is a daily-life question, not a road-trip question. If you can charge at home, most concerns disappear. If you can't, the math changes.",
    ],
  },
  {
    slug: "suv-vs-crossover",
    title: "SUV vs crossover — does it actually matter?",
    category: "Understand the basics",
    excerpt:
      "The labels are blurry. What matters is footprint, space, and how the car feels in the city versus the open road.",
    body: [
      "The SUV/crossover line moved years ago. Most modern 'SUVs' are unibody crossovers — better on-road, less true off-road capability.",
      "What actually matters: footprint (does it fit your street?), seating posture, ground clearance, and cabin volume.",
      "Lumen ignores the marketing label and matches you on the dimensions you'll feel every day.",
    ],
  },
  {
    slug: "winter-driving",
    title: "What matters in winter driving",
    category: "Driving knowledge",
    excerpt:
      "AWD is overrated. Tyres, heat pumps, and pre-conditioning are underrated. Here's what to look for.",
    body: [
      "Winter tires beat AWD almost every time. AWD helps you go; only tyres help you stop and turn.",
      "For EVs, a heat pump dramatically improves cold-weather range. Pre-conditioning while plugged in is the underrated daily-life feature.",
      "Cabin warmth that holds matters more than peak heating power. So does seat heating that warms quickly.",
    ],
  },
  {
    slug: "compare-cars-intelligently",
    title: "How to compare cars intelligently",
    category: "Driving knowledge",
    excerpt:
      "Spec sheets lie by omission. Here's how to compare cars on the dimensions that actually shape ownership.",
    body: [
      "Specs are necessary but rarely sufficient. The dimensions that shape ownership are: ride quality, cabin noise, seat geometry, software maturity, and dealer experience.",
      "Compare cars on a typical day in your life — not on a spec sheet. The car you'll love is the one that fits the trips you actually take.",
      "Lumen's comparisons start from lived experience and only use specs to confirm or qualify what you'd actually feel.",
    ],
  },
  {
    slug: "what-makes-a-car-feel-premium",
    title: "What makes a car feel premium",
    category: "Driving knowledge",
    excerpt:
      "It isn't badges or screens. It's silence, materials, and the small details you notice on day 100.",
    body: [
      "Premium isn't a price point — it's a feeling of restraint. Quiet doors, materials that age, switches with weight, surfaces that don't squeak.",
      "Software is part of premium now. A car that updates and improves feels more luxurious than one frozen at delivery.",
      "The premium feeling lives in the daily details: how the cabin sounds, how the seat supports you on hour three, how the car behaves in traffic.",
    ],
  },
  {
    slug: "how-comparisons-work",
    title: "How Lumen comparisons actually work",
    category: "Inside Lumen",
    excerpt:
      "Two cars side-by-side, with the dimensions that shape your daily life — not the ones that look good in a brochure.",
    body: [
      "Most comparison tools line up specs and let you decide. Lumen does the opposite — it interprets the specs through the lens of your life.",
      "Cabin noise, ride quality, winter behaviour, software maturity, dealer experience and long-term ownership stress matter more than 0-100 times for most people.",
      "Lumen weighs each dimension by how much it will actually shape your years with the car, then explains the tradeoff in a single calm paragraph.",
    ],
  },
  {
    slug: "how-personalization-works",
    title: "How Lumen personalises without surveillance",
    category: "Inside Lumen",
    excerpt:
      "Personalisation built on what you tell us — not on tracking, not on data resale, not on dealer leads.",
    body: [
      "Lumen learns from your conversation, your saved cars and your stated context. Nothing else.",
      "We don't sell your preferences to dealers, and we don't share data with manufacturers to influence what you see.",
      "The result: recommendations that feel personal because they are — not because we built a profile of you in the background.",
    ],
  },
  {
    slug: "what-matters-in-pricing",
    title: "What actually matters in EV pricing",
    category: "Ownership",
    excerpt:
      "Sticker price is the smallest part of the story. Here's the framework Lumen uses to estimate true cost.",
    body: [
      "Total cost of ownership is sticker price plus charging, insurance, maintenance, depreciation and the price of stress.",
      "EVs typically win on charging and maintenance, lose on insurance, and vary wildly on depreciation. Software-mature brands tend to hold value better.",
      "The 'comfort-to-price ratio' is the underrated metric — how premium does the car feel relative to what it costs you each year, not just on day one.",
    ],
  },
];

export const getArticle = (slug: string) => LEARN.find((a) => a.slug === slug);
