import carSnow from "@/assets/car-snow.jpg";
import carSedan from "@/assets/car-sedan.jpg";
import carFamily from "@/assets/car-family.jpg";
import sceneNight from "@/assets/scene-night-drive.jpg";
import sceneNordic from "@/assets/scene-nordic.jpg";
import sceneRoad from "@/assets/scene-roadtrip.jpg";
import sceneQuiet from "@/assets/scene-quiet.jpg";
import sceneCity from "@/assets/scene-city.jpg";
import type { LocalizedString, LocalizedArray } from "@/lib/loc";

export type Car = {
  slug: string;
  name: string;
  brand: string;
  type: LocalizedString;
  tagline: LocalizedString;
  fit: LocalizedString;
  score: number;
  tag: LocalizedString;
  hero: string;
  gallery: string[];
  summary: LocalizedString;
  personality: LocalizedString;
  comfort: LocalizedString;
  climate: LocalizedString;
  practicality: LocalizedString;
  ownership: LocalizedString;
  strengths: LocalizedArray;
  tradeoffs: LocalizedArray;
  lifestyle: LocalizedString;
  range?: LocalizedString;
  seats?: number;
  startingPrice?: LocalizedString;
  drivetrain?: LocalizedString;
  comparesWellWith: string[];
};

export const CARS: Car[] = [
  {
    slug: "polestar-3",
    name: "Polestar 3",
    brand: "Polestar",
    type: { en: "Electric SUV", no: "Elektrisk SUV" },
    tagline: {
      en: "Calm, refined, Scandinavian.",
      no: "Rolig, raffinert, skandinavisk.",
    },
    fit: { en: "Quiet confidence", no: "Stille selvtillit" },
    score: 96,
    tag: { en: "Best for cold climates", no: "Best i kaldt klima" },
    hero: carSnow,
    gallery: [carSnow, sceneNordic, sceneQuiet],
    summary: {
      en: "The Polestar 3 doesn't try to impress you — it tries to settle you. Its design is minimalist Scandinavian craft, and on cold roads it feels uncannily composed. This is a car for people who choose quietness as a luxury.",
      no: "Polestar 3 prøver ikke å imponere deg — den prøver å roe deg ned. Designet er minimalistisk skandinavisk håndverk, og på kalde veier føles den merkelig samlet. Dette er en bil for folk som velger stillhet som luksus.",
    },
    personality: { en: "Calm Explorer · Quiet Executive", no: "Rolig Utforsker · Stille Leder" },
    comfort: {
      en: "Long-distance posture, cabin sealed against road noise, suspension tuned for composure over sport.",
      no: "Stilling for lange turer, kupé tettet mot veistøy, fjæring satt opp for ro framfor sportslighet.",
    },
    climate: {
      en: "Excellent in winter — AWD, heat pump, pre-conditioning, and cabin warmth that holds at -15°.",
      no: "Glimrende på vinteren — firehjulsdrift, varmepumpe, forvarming og kupévarme som holder ved -15°.",
    },
    practicality: {
      en: "Spacious for two adults plus gear; family-capable but not minivan-roomy.",
      no: "Romslig for to voksne pluss utstyr; familievennlig, men ikke minivan-stor.",
    },
    ownership: {
      en: "Direct-to-customer service, modest annual costs, software updates that improve the car over time.",
      no: "Service direkte fra produsent, moderate årlige kostnader, programvareoppdateringer som gjør bilen bedre over tid.",
    },
    strengths: {
      en: [
        "Genuinely quiet at highway speeds",
        "Composed AWD on snow and ice",
        "Interior that feels handmade",
        "Restraint instead of screen overload",
      ],
      no: [
        "Virkelig stille i motorveifart",
        "Trygg firehjulsdrift på snø og is",
        "Interiør som føles håndlaget",
        "Rolig design framfor skjermkaos",
      ],
    },
    tradeoffs: {
      en: [
        "Range is good, not class-leading",
        "Rear visibility is sculpted, not generous",
        "Service network still maturing in some regions",
      ],
      no: [
        "Rekkevidde er god, ikke klasseledende",
        "Sikten bakover er skulpturert, ikke sjenerøs",
        "Servicenettverket er fortsatt i utvikling i noen regioner",
      ],
    },
    lifestyle: {
      en: "Built for a person who drives to think. Long winter weekends, mountain cabins, the kind of commute you don't dread.",
      no: "Bygget for en som kjører for å tenke. Lange vinterhelger, fjellhytter, den typen pendling du ikke gruer deg til.",
    },
    range: { en: "560 km WLTP", no: "560 km WLTP" },
    seats: 5,
    startingPrice: { en: "from €78,000", no: "fra €78 000" },
    drivetrain: { en: "Dual-motor AWD", no: "Tomotors firehjulsdrift" },
    comparesWellWith: ["volvo-ex90", "bmw-i5"],
  },
  {
    slug: "bmw-i5",
    name: "BMW i5",
    brand: "BMW",
    type: { en: "Executive EV Sedan", no: "Elektrisk eksekutiv-sedan" },
    tagline: {
      en: "Drives like a sport sedan, pampers like a flagship.",
      no: "Kjører som en sportssedan, skjemmer bort deg som et flaggskip.",
    },
    fit: { en: "Spirited & refined", no: "Sprek og raffinert" },
    score: 93,
    tag: { en: "Best for daily drivers", no: "Best for daglige sjåfører" },
    hero: carSedan,
    gallery: [carSedan, sceneNight, sceneCity],
    summary: {
      en: "The i5 is what happens when an executive sedan stops apologising for being electric. It steers like a 5 Series should, but its silence reframes every commute as something close to meditation.",
      no: "i5 er det som skjer når en eksekutiv-sedan slutter å unnskylde at den er elektrisk. Den styrer som en 5-serie skal, men stillheten gjør hver pendling om til noe nær meditasjon.",
    },
    personality: { en: "Quiet Executive · Performance Romantic", no: "Stille Leder · Ytelses-Romantiker" },
    comfort: {
      en: "Ergonomically obsessive seats, supple ride, cabin acoustics that absorb the city.",
      no: "Ergonomisk gjennomtenkte seter, mykt komfortnivå, kupéakustikk som absorberer byen.",
    },
    climate: {
      en: "Strong all-rounder; rear-bias variants prefer dry tarmac, AWD model handles wet and snow with confidence.",
      no: "Sterk allrounder; bakhjulsdrevne varianter foretrekker tørr asfalt, firehjulsdriften håndterer vått og snø med trygghet.",
    },
    practicality: {
      en: "Saloon space, generous boot, but lower step-in than an SUV.",
      no: "Sedanplass, romslig bagasjerom, men lavere innstigning enn en SUV.",
    },
    ownership: {
      en: "Premium servicing, strong residuals, software ecosystem that keeps maturing.",
      no: "Premium service, sterk gjensalgsverdi, programvareøkosystem som blir bedre.",
    },
    strengths: {
      en: [
        "Steering feel that still rewards",
        "Quiet, unhurried highway character",
        "Tech that feels considered, not flashy",
        "Comfortable across long distances",
      ],
      no: [
        "Rattfølelse som fortsatt belønner",
        "Stille, avslappet motorveikarakter",
        "Teknologi som føles gjennomtenkt, ikke prangende",
        "Komfortabel over lange avstander",
      ],
    },
    tradeoffs: {
      en: [
        "Premium pricing for premium feel",
        "Curved display polarises",
        "Rear headroom slightly compromised by roofline",
      ],
      no: [
        "Premium pris for premium følelse",
        "Den buede skjermen splitter",
        "Hodeplass bak er noe begrenset av taklinjen",
      ],
    },
    lifestyle: {
      en: "For someone who drives a lot, alone, and treats the commute as personal time. Confident in the city, calm on the motorway.",
      no: "For den som kjører mye, alene, og bruker pendlingen som egentid. Trygg i byen, rolig på motorveien.",
    },
    range: { en: "505 km WLTP", no: "505 km WLTP" },
    seats: 5,
    startingPrice: { en: "from €72,000", no: "fra €72 000" },
    drivetrain: { en: "RWD or AWD", no: "Bakhjulsdrift eller firehjulsdrift" },
    comparesWellWith: ["mercedes-eqe", "polestar-3"],
  },
  {
    slug: "volvo-ex90",
    name: "Volvo EX90",
    brand: "Volvo",
    type: { en: "Family Electric SUV", no: "Elektrisk familie-SUV" },
    tagline: {
      en: "Quietly capable. Family-first, beautifully understated.",
      no: "Stille kapabel. Familie først, vakkert nedtonet.",
    },
    fit: { en: "Quietly capable", no: "Stille kapabel" },
    score: 95,
    tag: { en: "Best for families", no: "Best for familier" },
    hero: carFamily,
    gallery: [carFamily, sceneRoad, sceneNordic],
    summary: {
      en: "The EX90 is what families ask for when they stop pretending they want a sports car. It's spacious, safe, calm, and quietly luxurious — the antidote to the over-styled three-row SUV.",
      no: "EX90 er det familier spør etter når de slutter å late som de vil ha en sportsbil. Den er romslig, trygg, rolig og diskré luksuriøs — motgiften til den overdesignede tre-radersbilen.",
    },
    personality: { en: "Calm Explorer · Weekend Escapist", no: "Rolig Utforsker · Helgeflukter" },
    comfort: {
      en: "Three real rows, quiet cabin, materials that age gracefully.",
      no: "Tre ekte seterader, stille kupé, materialer som eldes med verdighet.",
    },
    climate: {
      en: "Designed in Sweden — winter is its native habitat. Pre-conditioning, AWD, heated everything.",
      no: "Designet i Sverige — vinter er dens naturlige element. Forvarming, firehjulsdrift, varme overalt.",
    },
    practicality: {
      en: "Genuine 7-seater capability, big boot, easy car-seat geometry.",
      no: "Ekte sjuseters-kapasitet, stort bagasjerom, enkel barnesete-geometri.",
    },
    ownership: {
      en: "Volvo dealer comfort, predictable maintenance, strong safety reputation.",
      no: "Volvo-forhandlerens trygghet, forutsigbart vedlikehold, sterkt sikkerhetsrennomé.",
    },
    strengths: {
      en: [
        "Spacious without feeling oversized",
        "Genuine winter competence",
        "Calm, uncluttered interior",
        "Class-leading safety architecture",
      ],
      no: [
        "Romslig uten å føles for stor",
        "Ekte vinterkompetanse",
        "Roligt, ryddig interiør",
        "Klasseledende sikkerhetsarkitektur",
      ],
    },
    tradeoffs: {
      en: [
        "Software has matured slowly",
        "Not the sportiest steering",
        "Charging speeds are good, not exceptional",
      ],
      no: [
        "Programvaren har modnet langsomt",
        "Ikke den mest sportslige rattfølelsen",
        "Ladehastigheten er god, ikke eksepsjonell",
      ],
    },
    lifestyle: {
      en: "Built for families who'd rather feel calm than impressive. Long road trips, school runs, and ski weekends without compromise.",
      no: "Bygget for familier som heller vil føle ro enn å imponere. Lange biltur, skolekjøring og skihelger uten kompromiss.",
    },
    range: { en: "600 km WLTP", no: "600 km WLTP" },
    seats: 7,
    startingPrice: { en: "from €85,000", no: "fra €85 000" },
    drivetrain: { en: "Dual-motor AWD", no: "Tomotors firehjulsdrift" },
    comparesWellWith: ["kia-ev9", "polestar-3"],
  },
  {
    slug: "mercedes-eqe",
    name: "Mercedes EQE",
    brand: "Mercedes-Benz",
    type: { en: "Executive EV Sedan", no: "Elektrisk eksekutiv-sedan" },
    tagline: { en: "Quiet luxury, the German way.", no: "Stille luksus, på tysk vis." },
    fit: { en: "Refined & insulated", no: "Raffinert og isolert" },
    score: 91,
    tag: { en: "Quiet luxury", no: "Stille luksus" },
    hero: sceneQuiet,
    gallery: [sceneQuiet, sceneNight, carSedan],
    summary: {
      en: "The EQE is a serene, sound-isolated sanctuary on wheels — closer in spirit to an S-Class than a sport sedan. It rewards passengers as much as drivers.",
      no: "EQE er et rolig, lydisolert tilfluktssted på hjul — nærmere en S-Klasse i ånd enn en sportssedan. Den belønner passasjerer like mye som sjåføren.",
    },
    personality: { en: "Quiet Executive · Calm Explorer", no: "Stille Leder · Rolig Utforsker" },
    comfort: {
      en: "Air suspension, near-silent cabin, seats engineered for hours, not minutes.",
      no: "Luftfjæring, nær lydløs kupé, seter konstruert for timer, ikke minutter.",
    },
    climate: {
      en: "Comfortable in any weather; AWD variants competent in snow.",
      no: "Komfortabel i alt vær; firehjulsdrevne varianter kompetente i snø.",
    },
    practicality: {
      en: "Sedan boot, generous rear legroom, lower roofline than an SUV.",
      no: "Sedan-bagasjerom, romslig benplass bak, lavere taklinje enn en SUV.",
    },
    ownership: {
      en: "Dense Mercedes service network, strong long-distance support.",
      no: "Tett Mercedes-servicenettverk, sterk støtte for langturer.",
    },
    strengths: {
      en: [
        "Cabin quietness in a class of its own",
        "Long-distance composure",
        "Ride quality on air suspension",
        "Brand prestige and resale support",
      ],
      no: [
        "Kupéstillhet i sin egen klasse",
        "Langturs-ro",
        "Kjørekomfort på luftfjæring",
        "Merkeprestisje og gjensalgsstøtte",
      ],
    },
    tradeoffs: {
      en: [
        "Hyperscreen is overwhelming for some",
        "Steering feel is calmer than communicative",
        "Styling is divisive",
      ],
      no: [
        "Hyperscreen er overveldende for noen",
        "Rattfølelsen er roligere enn kommunikativ",
        "Designet splitter",
      ],
    },
    lifestyle: {
      en: "For people who value silence over speed. Executives, long-distance commuters, anyone who treats driving as decompression.",
      no: "For folk som verdsetter stillhet over fart. Ledere, langpendlere, alle som bruker kjøring som avkobling.",
    },
    range: { en: "590 km WLTP", no: "590 km WLTP" },
    seats: 5,
    startingPrice: { en: "from €74,000", no: "fra €74 000" },
    drivetrain: { en: "RWD or AWD", no: "Bakhjulsdrift eller firehjulsdrift" },
    comparesWellWith: ["bmw-i5"],
  },
  {
    slug: "kia-ev9",
    name: "Kia EV9",
    brand: "Kia",
    type: { en: "Family Electric SUV", no: "Elektrisk familie-SUV" },
    tagline: {
      en: "Three rows, real presence, surprising calm.",
      no: "Tre seterader, ekte tilstedeværelse, overraskende ro.",
    },
    fit: { en: "Spacious & honest", no: "Romslig og ærlig" },
    score: 92,
    tag: { en: "Best family value", no: "Best familieverdi" },
    hero: sceneRoad,
    gallery: [sceneRoad, carFamily, sceneCity],
    summary: {
      en: "The EV9 is the family SUV many people didn't realise they wanted. It's huge inside, charges fast, and feels considered in a way Kia's competitors are still catching up to.",
      no: "EV9 er familie-SUV-en mange ikke visste de ønsket. Den er enorm inni, lader fort og føles gjennomtenkt på en måte konkurrentene fortsatt prøver å ta igjen.",
    },
    personality: { en: "Weekend Escapist · Calm Explorer", no: "Helgeflukter · Rolig Utforsker" },
    comfort: {
      en: "Lounge-like rear seats, flat floor, quiet cabin for the price.",
      no: "Lounge-aktige baksete, flatt gulv, stille kupé for prisen.",
    },
    climate: {
      en: "Capable AWD, winter-ready trims, fast charging that thrives on cold-weather road trips.",
      no: "Kapabel firehjulsdrift, vinterklare utstyrsnivåer, hurtiglading som blomstrer på kalde langturer.",
    },
    practicality: {
      en: "Best-in-class interior space, real 6 or 7-seat usability.",
      no: "Klassens beste innvendige plass, ekte bruksverdi i 6- eller 7-seters konfigurasjon.",
    },
    ownership: {
      en: "Strong warranty, increasingly mature dealer network, predictable cost of ownership.",
      no: "Sterk garanti, stadig modnere forhandlernettverk, forutsigbare eierkostnader.",
    },
    strengths: {
      en: [
        "Genuinely spacious three-row cabin",
        "Fast 800V charging",
        "Honest, calm design language",
        "Aggressive value for the package",
      ],
      no: [
        "Virkelig romslig tre-raders kupé",
        "Rask 800V-lading",
        "Ærlig, rolig designspråk",
        "Aggressiv verdi for pakken",
      ],
    },
    tradeoffs: {
      en: [
        "Not the most refined steering",
        "Range with full load drops noticeably",
        "Brand perception still evolving in premium segment",
      ],
      no: [
        "Ikke den mest raffinerte rattfølelsen",
        "Rekkevidden faller merkbart med full last",
        "Merkeoppfatningen er fortsatt under utvikling i premiumsegmentet",
      ],
    },
    lifestyle: {
      en: "For families who want EX90-style space without EX90 pricing. Road trips, sports clubs, full-load weekend escapes.",
      no: "For familier som vil ha EX90-plass uten EX90-pris. Bilturer, idrettsklubber, fulle helgeflukter.",
    },
    range: { en: "563 km WLTP", no: "563 km WLTP" },
    seats: 7,
    startingPrice: { en: "from €72,000", no: "fra €72 000" },
    drivetrain: { en: "RWD or AWD", no: "Bakhjulsdrift eller firehjulsdrift" },
    comparesWellWith: ["volvo-ex90"],
  },
];

export const getCar = (slug: string) => CARS.find((c) => c.slug === slug);

export type Collection = {
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  image: string;
  body: LocalizedString;
  cars: string[];
};

export const COLLECTIONS: Collection[] = [
  {
    slug: "nordic-winters",
    title: { en: "Best cars for Nordic winters", no: "Beste biler for nordiske vintre" },
    description: {
      en: "Composed on snow. Quiet on ice. Heated where it matters.",
      no: "Stødig på snø. Stille på is. Varm der det betyr noe.",
    },
    image: carSnow,
    body: {
      en: "Winter doesn't care about marketing. These are the cars AutoVere returns to when the temperature drops and the road disappears under snow — competent, calm, and comfortable in conditions where most cars become a chore.",
      no: "Vinteren bryr seg ikke om markedsføring. Dette er bilene AutoVere kommer tilbake til når temperaturen synker og veien forsvinner under snø — kompetente, rolige og komfortable i forhold der de fleste biler blir en byrde.",
    },
    cars: ["polestar-3", "volvo-ex90", "kia-ev9"],
  },
  {
    slug: "quiet-luxury",
    title: { en: "Quiet luxury EVs", no: "Stille luksus-elbiler" },
    description: {
      en: "Presence without announcement. Craft over chrome.",
      no: "Tilstedeværelse uten å rope. Håndverk framfor krom.",
    },
    image: sceneQuiet,
    body: {
      en: "Luxury used to shout. The new generation whispers. These cars choose silence, restraint, and material honesty over chrome and badge theatre — they reward you every time you sit inside.",
      no: "Luksus pleide å rope. Den nye generasjonen hvisker. Disse bilene velger stillhet, behersket design og materialærlighet framfor krom og merketeater — de belønner deg hver gang du setter deg inn.",
    },
    cars: ["mercedes-eqe", "polestar-3", "bmw-i5"],
  },
  {
    slug: "long-distance-comfort",
    title: { en: "Built for long-distance comfort", no: "Bygget for langturskomfort" },
    description: {
      en: "Six hours that should feel like one.",
      no: "Seks timer som skal føles som én.",
    },
    image: sceneRoad,
    body: {
      en: "Long drives expose every compromise. Seats betray you at hour four. Wind noise wears you down. These cars were engineered with the road trip in mind — and AutoVere ranks them for the reality, not the brochure.",
      no: "Lange turer avslører hvert kompromiss. Setene svikter deg etter fire timer. Vindstøy sliter deg ut. Disse bilene ble utviklet med langturen i tankene — og AutoVere rangerer dem for virkeligheten, ikke brosjyren.",
    },
    cars: ["mercedes-eqe", "volvo-ex90", "bmw-i5"],
  },
  {
    slug: "underestimated",
    title: { en: "Cars people underestimated", no: "Biler folk undervurderte" },
    description: {
      en: "Outside the spotlight. Inside, more thought than you'd expect.",
      no: "Utenfor rampelyset. Inni mer omtanke enn du forventer.",
    },
    image: sceneCity,
    body: {
      en: "Not every great car arrives with a marketing budget. These are the ones owners love more after a year, not less — quietly excellent, often overlooked, almost always the right answer.",
      no: "Ikke alle gode biler kommer med et marketingbudsjett. Dette er de eierne elsker mer etter et år, ikke mindre — stille fortreffelige, ofte oversett, nesten alltid riktig svar.",
    },
    cars: ["kia-ev9", "polestar-3"],
  },
  {
    slug: "best-family-evs",
    title: { en: "Best family EVs", no: "Beste familie-elbiler" },
    description: {
      en: "Space, safety, and calm — without compromise.",
      no: "Plass, sikkerhet og ro — uten kompromiss.",
    },
    image: carFamily,
    body: {
      en: "A family car is a quiet contract: safety, space, reliability, and a cabin that survives years of school runs and road trips. These EVs deliver on all of it, without losing what makes a great car feel great to drive.",
      no: "En familiebil er en stille kontrakt: sikkerhet, plass, pålitelighet og en kupé som overlever år med skolekjøring og bilturer. Disse elbilene leverer på alt, uten å miste det som gjør en god bil god å kjøre.",
    },
    cars: ["volvo-ex90", "kia-ev9", "polestar-3"],
  },
  {
    slug: "city-life",
    title: { en: "Cars built for city life", no: "Biler bygget for bylivet" },
    description: {
      en: "Composed in traffic. Confident in tight streets.",
      no: "Rolig i trafikken. Trygg i trange gater.",
    },
    image: sceneCity,
    body: {
      en: "Cities punish bad cars. Visibility, footprint, low-speed refinement, and easy parking matter more than 0–100 times. These are AutoVere's calmest urban companions.",
      no: "Byer straffer dårlige biler. Sikt, størrelse, raffinement i lav fart og enkel parkering betyr mer enn 0–100-tider. Dette er AutoVeres roligste byfølgesvenner.",
    },
    cars: ["bmw-i5", "polestar-3"],
  },
  {
    slug: "lowest-ownership-stress",
    title: { en: "Lowest ownership stress", no: "Lavest eierskapsstress" },
    description: {
      en: "Cars owners stop thinking about — in the best way.",
      no: "Biler eierne slutter å tenke på — på den beste måten.",
    },
    image: sceneNight,
    body: {
      en: "The best ownership experience is the one you forget you're having. These cars combine reliable software, predictable service, and durable interiors — the kind that age into a relationship instead of out of one.",
      no: "Den beste eieropplevelsen er den du glemmer at du har. Disse bilene kombinerer pålitelig programvare, forutsigbar service og solide interiører — typen som vokser inn i et forhold, ikke ut av det.",
    },
    cars: ["polestar-3", "volvo-ex90", "kia-ev9"],
  },
  {
    slug: "reviewers-unexpectedly-loved",
    title: { en: "Cars reviewers unexpectedly loved", no: "Biler testerne uventet elsket" },
    description: {
      en: "Quiet surprises that earned their respect.",
      no: "Stille overraskelser som vant deres respekt.",
    },
    image: sceneRoad,
    body: {
      en: "Some cars walk into a review with low expectations and walk out with a quiet kind of admiration. These are the ones reviewers kept coming back to — not because of headlines, but because of how the cars behave when no one is watching.",
      no: "Noen biler går inn i en test med lave forventninger og ut med en stille beundring. Dette er de testerne stadig kom tilbake til — ikke på grunn av overskrifter, men fordi bilene oppfører seg som de gjør når ingen ser på.",
    },
    cars: ["kia-ev9", "polestar-3", "bmw-i5"],
  },
  {
    slug: "calm-highway-cruisers",
    title: { en: "Calm highway cruisers", no: "Rolige motorvei-cruisere" },
    description: {
      en: "Hours dissolve. The car simply continues.",
      no: "Timene oppløses. Bilen bare fortsetter.",
    },
    image: sceneRoad,
    body: {
      en: "Highway driving rewards refinement: stable steering at speed, hushed cabins, suspensions that swallow imperfections, seats that still feel honest after four hours. These are the cars AutoVere reaches for when the route is long and the day is already heavy.",
      no: "Motorveikjøring belønner raffinement: stabilt ratt i fart, dempede kupéer, fjæring som svelger ujevnheter, seter som fortsatt føles ærlige etter fire timer. Dette er bilene AutoVere strekker seg etter når ruten er lang og dagen allerede tung.",
    },
    cars: ["mercedes-eqe", "bmw-i5", "volvo-ex90"],
  },
  {
    slug: "winter-confidence",
    title: { en: "Winter confidence", no: "Vintertrygghet" },
    description: {
      en: "AWD, heat pumps, and the temperament of a Nordic engineer.",
      no: "Firehjulsdrift, varmepumper og temperamentet til en nordisk ingeniør.",
    },
    image: carSnow,
    body: {
      en: "Winter rewards quiet competence over horsepower. Heat pumps, pre-conditioning, surefooted AWD, and cabins that hold warmth at -15°C. AutoVere's most reassuring picks when the forecast turns serious.",
      no: "Vinteren belønner stille kompetanse framfor hestekrefter. Varmepumper, forvarming, sikker firehjulsdrift og kupéer som holder varmen ved -15 °C. AutoVeres mest betryggende valg når værmeldingen blir alvorlig.",
    },
    cars: ["polestar-3", "volvo-ex90", "kia-ev9"],
  },
];

export const getCollection = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);

export type Personality = {
  slug: string;
  name: LocalizedString;
  tagline: LocalizedString;
  description: LocalizedString;
  whoYouAre: LocalizedString;
  whatYouValue: LocalizedArray;
  matches: string[];
  prompt: LocalizedString;
};

export const PERSONALITIES: Personality[] = [
  {
    slug: "calm-explorer",
    name: { en: "Calm Explorer", no: "Rolig Utforsker" },
    tagline: { en: "Long horizons, quiet thoughts.", no: "Lange horisonter, stille tanker." },
    description: {
      en: "You drive to clear your head. You'd rather glide than race. Comfort beats horsepower, every time.",
      no: "Du kjører for å klarne hodet. Du vil heller gli enn å rase. Komfort slår hestekrefter, hver gang.",
    },
    whoYouAre: {
      en: "You think of driving as time, not performance. The right car is the one that lets the world go quiet around you and gives you back a clearer head at the other end.",
      no: "Du tenker på kjøring som tid, ikke ytelse. Riktig bil er den som lar verden bli stille rundt deg og gir deg et klarere hode i den andre enden.",
    },
    whatYouValue: {
      en: ["Cabin silence", "Composed ride", "Honest design", "Range that disappears as a worry"],
      no: ["Kupéstillhet", "Rolig kjøring", "Ærlig design", "Rekkevidde som slutter å være en bekymring"],
    },
    matches: ["polestar-3", "volvo-ex90", "mercedes-eqe"],
    prompt: {
      en: "I'm a Calm Explorer — long drives, quiet head, comfort over speed. What 3 cars should I look at?",
      no: "Jeg er en Rolig Utforsker — lange turer, stille hode, komfort framfor fart. Hvilke 3 biler bør jeg se på?",
    },
  },
  {
    slug: "quiet-executive",
    name: { en: "Quiet Executive", no: "Stille Leder" },
    tagline: { en: "Refinement without announcement.", no: "Raffinement uten å rope det ut." },
    description: {
      en: "You want presence, not attention. Tech that disappears into craft.",
      no: "Du vil ha tilstedeværelse, ikke oppmerksomhet. Teknologi som forsvinner inn i håndverket.",
    },
    whoYouAre: {
      en: "Your car is part of your professional life. It needs to look composed, sound composed, and respect every minute of your day.",
      no: "Bilen din er en del av yrkeslivet ditt. Den må se behersket ut, høres behersket ut og respektere hvert minutt av dagen din.",
    },
    whatYouValue: {
      en: ["Insulation", "Material honesty", "Predictable luxury", "Service density"],
      no: ["Lydisolasjon", "Materialærlighet", "Forutsigbar luksus", "Tett servicenett"],
    },
    matches: ["bmw-i5", "mercedes-eqe", "polestar-3"],
    prompt: {
      en: "I'm a Quiet Executive — long highway commutes, restrained luxury, calm tech. Recommend 3 cars.",
      no: "Jeg er en Stille Leder — lange motorveipendlinger, behersket luksus, rolig teknologi. Anbefal 3 biler.",
    },
  },
  {
    slug: "weekend-escapist",
    name: { en: "Weekend Escapist", no: "Helgeflukter" },
    tagline: { en: "Monday city. Saturday wild.", no: "Mandag by. Lørdag villmark." },
    description: {
      en: "Capable when it matters. Quiet when it doesn't.",
      no: "Kapabel når det teller. Stille når det ikke gjør det.",
    },
    whoYouAre: {
      en: "You commute through the week and disappear on the weekend. The right car has to do both without resentment.",
      no: "Du pendler gjennom uka og forsvinner i helga. Riktig bil må klare begge deler uten å klage.",
    },
    whatYouValue: {
      en: ["AWD competence", "Space for gear", "Long range", "Calm city manners"],
      no: ["Trygg firehjulsdrift", "Plass til utstyr", "Lang rekkevidde", "Rolige bymanerer"],
    },
    matches: ["volvo-ex90", "kia-ev9", "polestar-3"],
    prompt: {
      en: "I'm a Weekend Escapist — city weekdays, mountains and trips on weekends. Recommend 3 cars.",
      no: "Jeg er en Helgeflukter — by i ukedagene, fjell og turer i helgene. Anbefal 3 biler.",
    },
  },
  {
    slug: "urban-minimalist",
    name: { en: "Urban Minimalist", no: "Urban Minimalist" },
    tagline: { en: "Less, but better. Every day.", no: "Mindre, men bedre. Hver dag." },
    description: {
      en: "Tight streets, premium feel, zero compromise.",
      no: "Trange gater, premium følelse, null kompromiss.",
    },
    whoYouAre: {
      en: "You live in a city. Your car needs to be small enough to disappear into traffic and refined enough to make the drive feel intentional.",
      no: "Du bor i en by. Bilen din må være liten nok til å forsvinne i trafikken og raffinert nok til at kjøringen føles bevisst.",
    },
    whatYouValue: {
      en: ["Compact footprint", "Premium cabin", "Easy parking", "Quiet design"],
      no: ["Kompakt størrelse", "Premium kupé", "Enkel parkering", "Rolig design"],
    },
    matches: ["bmw-i5", "polestar-3"],
    prompt: {
      en: "I'm an Urban Minimalist — city driving, compact, premium feel. Recommend 3 cars.",
      no: "Jeg er en Urban Minimalist — bykjøring, kompakt, premium følelse. Anbefal 3 biler.",
    },
  },
  {
    slug: "performance-romantic",
    name: { en: "Performance Romantic", no: "Ytelses-Romantiker" },
    tagline: { en: "It should make you smile.", no: "Den skal få deg til å smile." },
    description: {
      en: "Specs are the language, but feeling is the point.",
      no: "Spesifikasjoner er språket, men følelsen er poenget.",
    },
    whoYouAre: {
      en: "You want a car you'll talk about in 20 years. Numbers matter, but feel matters more.",
      no: "Du vil ha en bil du fortsatt snakker om om 20 år. Tall betyr noe, men følelse betyr mer.",
    },
    whatYouValue: {
      en: ["Steering feel", "Acceleration response", "Sound (or its absence)", "Design that ages well"],
      no: ["Rattfølelse", "Akselerasjonsrespons", "Lyd (eller fraværet av den)", "Design som eldes godt"],
    },
    matches: ["bmw-i5", "polestar-3"],
    prompt: {
      en: "I'm a Performance Romantic — I want a car that makes me smile every time I drive it. Recommend 3.",
      no: "Jeg er en Ytelses-Romantiker — jeg vil ha en bil som får meg til å smile hver gang jeg kjører. Anbefal 3.",
    },
  },
  {
    slug: "nordic-adventurer",
    name: { en: "Nordic Adventurer", no: "Nordisk Eventyrer" },
    tagline: { en: "At home where the road ends.", no: "Hjemme der veien slutter." },
    description: {
      en: "Cold weather, long distances, and the trips most cars never see.",
      no: "Kaldt vær, lange avstander og turene de fleste biler aldri får se.",
    },
    whoYouAre: {
      en: "You live where winter is real. The car has to start, hold heat, hold the road, and not feel like a compromise the rest of the year.",
      no: "Du bor der vinteren er ekte. Bilen må starte, holde varmen, holde veien — og ikke føles som et kompromiss resten av året.",
    },
    whatYouValue: {
      en: ["AWD", "Heat pump", "Range in cold", "Cabin warmth that holds"],
      no: ["Firehjulsdrift", "Varmepumpe", "Rekkevidde i kulde", "Kupévarme som holder"],
    },
    matches: ["volvo-ex90", "polestar-3", "kia-ev9"],
    prompt: {
      en: "I'm a Nordic Adventurer — winter driving, long cold trips. Recommend 3 cars.",
      no: "Jeg er en Nordisk Eventyrer — vinterkjøring, lange kalde turer. Anbefal 3 biler.",
    },
  },
];

export const getPersonality = (slug: string) =>
  PERSONALITIES.find((p) => p.slug === slug);

export type LearnArticle = {
  slug: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  body: LocalizedArray;
  category: LocalizedString;
};

export const LEARN: LearnArticle[] = [
  {
    slug: "how-the-ai-works",
    title: { en: "How the AutoVere AI actually works", no: "Hvordan AutoVere-AI-en faktisk fungerer" },
    category: { en: "Inside AutoVere", no: "Innsikt i AutoVere" },
    excerpt: {
      en: "AutoVere is an emotionally intelligent advisor — not a filter. Here's how it interprets your life and turns it into a small, honest set of matches.",
      no: "AutoVere er en emosjonelt intelligent rådgiver — ikke et filter. Slik tolker den livet ditt og gjør det om til et lite, ærlig sett med treff.",
    },
    body: {
      en: [
        "AutoVere starts from the premise that the right car is a personal answer to a personal question. So it doesn't ask you to filter; it asks you to describe.",
        "When you tell AutoVere about your climate, your family, your commute, or how driving makes you feel, it interprets those signals across hundreds of dimensions — not as keywords, but as meaning.",
        "It then narrows the field to two or three cars worth your attention, and explains the tradeoffs honestly. The goal is clarity, not choice paralysis.",
      ],
      no: [
        "AutoVere starter fra premisset om at riktig bil er et personlig svar på et personlig spørsmål. Derfor ber den deg ikke filtrere; den ber deg beskrive.",
        "Når du forteller AutoVere om klimaet ditt, familien din, pendlingen din eller hvordan kjøring føles for deg, tolker den disse signalene på hundrevis av dimensjoner — ikke som nøkkelord, men som mening.",
        "Den smalner deretter feltet til to eller tre biler verdt oppmerksomheten din, og forklarer kompromissene ærlig. Målet er klarhet, ikke valglammelse.",
      ],
    },
  },
  {
    slug: "how-recommendations-work",
    title: { en: "How recommendations work", no: "Hvordan anbefalingene fungerer" },
    category: { en: "Inside AutoVere", no: "Innsikt i AutoVere" },
    excerpt: {
      en: "Why AutoVere shows you 2–3 cars instead of 47, and how it decides which ones deserve your attention.",
      no: "Hvorfor AutoVere viser deg 2–3 biler i stedet for 47, og hvordan den bestemmer hvilke som fortjener oppmerksomheten din.",
    },
    body: {
      en: [
        "Most platforms confuse choice with help. AutoVere takes the opposite position: the more accurately it understands you, the fewer cars you should see.",
        "Recommendations are weighted across personality fit, climate, lifestyle, ownership reality, and emotional resonance — not just specs.",
        "Every match comes with the genuine compromises, because trust is earned by being honest about what isn't perfect.",
      ],
      no: [
        "De fleste plattformer forveksler valg med hjelp. AutoVere tar motsatt posisjon: jo mer presist den forstår deg, jo færre biler bør du se.",
        "Anbefalingene vektes på tvers av personlighetsfit, klima, livsstil, eierhverdag og emosjonell resonans — ikke bare spesifikasjoner.",
        "Hvert treff kommer med de ekte kompromissene, for tillit bygges ved å være ærlig om det som ikke er perfekt.",
      ],
    },
  },
  {
    slug: "ev-explained-simply",
    title: { en: "EVs, explained simply", no: "Elbiler, forklart enkelt" },
    category: { en: "Understand the basics", no: "Forstå grunnlaget" },
    excerpt: {
      en: "Range, charging, battery health, and the things that actually matter day-to-day — without the jargon.",
      no: "Rekkevidde, lading, batterihelse og det som faktisk betyr noe i hverdagen — uten sjargongen.",
    },
    body: {
      en: [
        "An EV is, mostly, a quieter car with a different fueling habit. The hard parts are charging logistics, cold-weather range, and battery longevity — and they're easier to understand than the industry pretends.",
        "Range numbers are a moving target. Real-world range depends on temperature, speed, terrain, and how you drive. A car rated at 500 km might give you 380 in winter.",
        "Charging is a daily-life question, not a road-trip question. If you can charge at home, most concerns disappear. If you can't, the math changes.",
      ],
      no: [
        "En elbil er, stort sett, en stillere bil med en annen drivstoffvane. De vanskelige delene er ladelogistikk, rekkevidde i kulde og batteriets levetid — og de er enklere å forstå enn bransjen later som.",
        "Rekkeviddetall er et bevegelig mål. Reell rekkevidde avhenger av temperatur, fart, terreng og hvordan du kjører. En bil oppgitt med 500 km kan gi deg 380 om vinteren.",
        "Lading er et hverdagsspørsmål, ikke et langturspørsmål. Kan du lade hjemme, forsvinner de fleste bekymringer. Kan du ikke, endres regnestykket.",
      ],
    },
  },
  {
    slug: "suv-vs-crossover",
    title: { en: "SUV vs crossover — does it actually matter?", no: "SUV vs crossover — har det egentlig noe å si?" },
    category: { en: "Understand the basics", no: "Forstå grunnlaget" },
    excerpt: {
      en: "The labels are blurry. What matters is footprint, space, and how the car feels in the city versus the open road.",
      no: "Etikettene er uklare. Det som teller er størrelsen, plassen og hvordan bilen føles i byen kontra på åpen vei.",
    },
    body: {
      en: [
        "The SUV/crossover line moved years ago. Most modern 'SUVs' are unibody crossovers — better on-road, less true off-road capability.",
        "What actually matters: footprint (does it fit your street?), seating posture, ground clearance, and cabin volume.",
        "AutoVere ignores the marketing label and matches you on the dimensions you'll feel every day.",
      ],
      no: [
        "Skillet mellom SUV og crossover flyttet seg for mange år siden. De fleste moderne «SUV-er» er crossovere på selvbærende karosseri — bedre på vei, mindre ekte terrengevne.",
        "Det som faktisk betyr noe: størrelsen (passer den i gata di?), sittestilling, bakkeklaring og kupévolum.",
        "AutoVere ignorerer markedsføringsetiketten og matcher deg på dimensjonene du vil føle hver dag.",
      ],
    },
  },
  {
    slug: "winter-driving",
    title: { en: "What matters in winter driving", no: "Hva som betyr noe i vinterkjøring" },
    category: { en: "Driving knowledge", no: "Kjørekunnskap" },
    excerpt: {
      en: "AWD is overrated. Tyres, heat pumps, and pre-conditioning are underrated. Here's what to look for.",
      no: "Firehjulsdrift er overvurdert. Dekk, varmepumper og forvarming er undervurdert. Her er det du bør se etter.",
    },
    body: {
      en: [
        "Winter tires beat AWD almost every time. AWD helps you go; only tyres help you stop and turn.",
        "For EVs, a heat pump dramatically improves cold-weather range. Pre-conditioning while plugged in is the underrated daily-life feature.",
        "Cabin warmth that holds matters more than peak heating power. So does seat heating that warms quickly.",
      ],
      no: [
        "Vinterdekk slår firehjulsdrift nesten hver gang. Firehjulsdrift hjelper deg å komme av sted; bare dekk hjelper deg å stoppe og svinge.",
        "For elbiler forbedrer en varmepumpe rekkevidden i kulde dramatisk. Forvarming mens bilen er tilkoblet er den undervurderte hverdagsfunksjonen.",
        "Kupévarme som holder betyr mer enn topp varmeeffekt. Det samme gjør setevarme som varmer raskt.",
      ],
    },
  },
  {
    slug: "compare-cars-intelligently",
    title: { en: "How to compare cars intelligently", no: "Hvordan sammenligne biler intelligent" },
    category: { en: "Driving knowledge", no: "Kjørekunnskap" },
    excerpt: {
      en: "Spec sheets lie by omission. Here's how to compare cars on the dimensions that actually shape ownership.",
      no: "Spesifikasjonsark lyver ved utelatelse. Slik sammenligner du biler på dimensjonene som faktisk former eierskapet.",
    },
    body: {
      en: [
        "Specs are necessary but rarely sufficient. The dimensions that shape ownership are: ride quality, cabin noise, seat geometry, software maturity, and dealer experience.",
        "Compare cars on a typical day in your life — not on a spec sheet. The car you'll love is the one that fits the trips you actually take.",
        "AutoVere's comparisons start from lived experience and only use specs to confirm or qualify what you'd actually feel.",
      ],
      no: [
        "Spesifikasjoner er nødvendige, men sjelden tilstrekkelige. Dimensjonene som former eierskapet er: kjørekomfort, kupéstøy, setegeometri, programvaremodenhet og forhandleropplevelse.",
        "Sammenlign biler på en vanlig dag i livet ditt — ikke på et spesifikasjonsark. Bilen du vil elske er den som passer turene du faktisk tar.",
        "AutoVeres sammenligninger starter fra levd erfaring og bruker bare spesifikasjoner til å bekrefte eller nyansere det du faktisk vil føle.",
      ],
    },
  },
  {
    slug: "what-makes-a-car-feel-premium",
    title: { en: "What makes a car feel premium", no: "Hva som gjør at en bil føles premium" },
    category: { en: "Driving knowledge", no: "Kjørekunnskap" },
    excerpt: {
      en: "It isn't badges or screens. It's silence, materials, and the small details you notice on day 100.",
      no: "Det er ikke merker eller skjermer. Det er stillhet, materialer og de små detaljene du legger merke til på dag 100.",
    },
    body: {
      en: [
        "Premium isn't a price point — it's a feeling of restraint. Quiet doors, materials that age, switches with weight, surfaces that don't squeak.",
        "Software is part of premium now. A car that updates and improves feels more luxurious than one frozen at delivery.",
        "The premium feeling lives in the daily details: how the cabin sounds, how the seat supports you on hour three, how the car behaves in traffic.",
      ],
      no: [
        "Premium er ikke et prispunkt — det er en følelse av tilbakeholdenhet. Stille dører, materialer som eldes, knapper med vekt, flater som ikke knirker.",
        "Programvare er en del av premium nå. En bil som oppdaterer og forbedrer seg føles mer luksuriøs enn en som er fastfrossen ved levering.",
        "Den premium-følelsen lever i de daglige detaljene: hvordan kupéen høres ut, hvordan setet støtter deg på time tre, hvordan bilen oppfører seg i trafikken.",
      ],
    },
  },
  {
    slug: "how-comparisons-work",
    title: { en: "How AutoVere comparisons actually work", no: "Hvordan AutoVere-sammenligninger faktisk fungerer" },
    category: { en: "Inside AutoVere", no: "Innsikt i AutoVere" },
    excerpt: {
      en: "Two cars side-by-side, with the dimensions that shape your daily life — not the ones that look good in a brochure.",
      no: "To biler side om side, med dimensjonene som former hverdagen din — ikke de som ser bra ut i en brosjyre.",
    },
    body: {
      en: [
        "Most comparison tools line up specs and let you decide. AutoVere does the opposite — it interprets the specs through the lens of your life.",
        "Cabin noise, ride quality, winter behaviour, software maturity, dealer experience and long-term ownership stress matter more than 0-100 times for most people.",
        "AutoVere weighs each dimension by how much it will actually shape your years with the car, then explains the tradeoff in a single calm paragraph.",
      ],
      no: [
        "De fleste sammenligningsverktøy stiller opp spesifikasjoner og lar deg bestemme. AutoVere gjør det motsatte — den tolker spesifikasjonene gjennom linsen av livet ditt.",
        "Kupéstøy, kjørekomfort, vinteroppførsel, programvaremodenhet, forhandleropplevelse og langsiktig eierskapsstress betyr mer enn 0–100-tider for de fleste.",
        "AutoVere veier hver dimensjon ut fra hvor mye den faktisk vil forme årene dine med bilen, og forklarer kompromisset i ett rolig avsnitt.",
      ],
    },
  },
  {
    slug: "how-personalization-works",
    title: { en: "How AutoVere personalises without surveillance", no: "Hvordan AutoVere personaliserer uten overvåkning" },
    category: { en: "Inside AutoVere", no: "Innsikt i AutoVere" },
    excerpt: {
      en: "Personalisation built on what you tell us — not on tracking, not on data resale, not on dealer leads.",
      no: "Personalisering bygget på det du forteller oss — ikke på sporing, ikke på datasalg, ikke på forhandlerleads.",
    },
    body: {
      en: [
        "AutoVere learns from your conversation, your saved cars and your stated context. Nothing else.",
        "We don't sell your preferences to dealers, and we don't share data with manufacturers to influence what you see.",
        "The result: recommendations that feel personal because they are — not because we built a profile of you in the background.",
      ],
      no: [
        "AutoVere lærer av samtalen din, de lagrede bilene dine og konteksten du oppgir. Ingenting annet.",
        "Vi selger ikke preferansene dine til forhandlere, og vi deler ikke data med produsenter for å påvirke det du ser.",
        "Resultatet: anbefalinger som føles personlige fordi de er det — ikke fordi vi har bygget en profil av deg i bakgrunnen.",
      ],
    },
  },
  {
    slug: "what-matters-in-pricing",
    title: { en: "What actually matters in EV pricing", no: "Det som faktisk teller i elbil-priser" },
    category: { en: "Ownership", no: "Eierskap" },
    excerpt: {
      en: "Sticker price is the smallest part of the story. Here's the framework AutoVere uses to estimate true cost.",
      no: "Listeprisen er den minste delen av historien. Her er rammeverket AutoVere bruker for å anslå reell kostnad.",
    },
    body: {
      en: [
        "Total cost of ownership is sticker price plus charging, insurance, maintenance, depreciation and the price of stress.",
        "EVs typically win on charging and maintenance, lose on insurance, and vary wildly on depreciation. Software-mature brands tend to hold value better.",
        "The 'comfort-to-price ratio' is the underrated metric — how premium does the car feel relative to what it costs you each year, not just on day one.",
      ],
      no: [
        "Total eierkostnad er listepris pluss lading, forsikring, vedlikehold, verdifall og prisen for stress.",
        "Elbiler vinner som regel på lading og vedlikehold, taper på forsikring, og varierer kraftig på verdifall. Merker med moden programvare holder verdien bedre.",
        "«Komfort-til-pris-forholdet» er det undervurderte målet — hvor premium føles bilen i forhold til hva den koster deg hvert år, ikke bare dag én.",
      ],
    },
  },
];

export const getArticle = (slug: string) => LEARN.find((a) => a.slug === slug);
