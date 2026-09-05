/**
 * AutoVere Challenge — landing page content.
 *
 * One reusable structure, one entry per language URL. English (GB) is the base
 * version served at /challenge; every other language lives at /challenge/<prefix>.
 * Translations can be added later by filling CHALLENGE_CONTENT_BY_LANG; any
 * missing language falls back to English so the page never breaks.
 */

export type ChallengeStep = { number: string; title: string; body: string };
export type ChallengeCard = { title: string; body: string };

export type ChallengeContent = {
  meta: { title: string; description: string };
  badge: string;
  hero: {
    kicker: string;
    title: string;
    lede: string;
    statement: string[];
    primaryCta: string;
    secondaryCta: string;
    imageCredit: string;
  };
  invitation: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    signature: string;
  };
  steps: { eyebrow: string; title: string; intro: string; items: ChallengeStep[] };
  notCalculator: {
    eyebrow: string;
    title: string;
    body: string;
    flow: string[];
    footnote: string;
  };
  freedom: {
    eyebrow: string;
    title: string;
    lines: string[];
    body: string;
    items: ChallengeCard[];
  };
  journey: {
    eyebrow: string;
    title: string;
    intro: string;
    options: { label: string; title: string; body: string; bullets: string[] }[];
  };

  vehicles: {
    eyebrow: string;
    title: string;
    intro: string;
    items: { label: string; body: string; image: string; alt: string }[];
  };
  evCompare: {
    eyebrow: string;
    title: string;
    body: string;
    exampleLabel: string;
    rows: { label: string; sub: string; value: string }[];
    differenceLabel: string;
    differenceValue: string;
    caveat: string;
  };
  reality: {
    eyebrow: string;
    title: string;
    body: string;
    exampleLabel: string;
    calculation: { label: string; value: string };
    actual: { label: string; value: string };
    difference: { label: string; value: string };
    caveat: string;
  };
  founder: {
    eyebrow: string;
    title: string;
    opening: string;
    paragraphs: string[];
    closing: string[];
    name: string;
    role: string;
    note: string;
    alt: string;
  };
  report: {
    eyebrow: string;
    title: string;
    body: string;
    contents: string[];
    future: string;
    cta: string;
    ctaNote: string;
  };
  register: {
    eyebrow: string;
    title: string;
    body: string;
    fields: { name: string; email: string; outlet: string; role: string; country: string; message: string };
    placeholders: { name: string; email: string; outlet: string; role: string; country: string; message: string };
    submit: string;
    note: string;
    successTitle: string;
    successBody: string;
  };
  finalCta: {
    title: string;
    body: string;
    primary: string;
    secondary: string;
  };
  languageLabel: string;
};

const EN: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — Put AutoVere to the Test",
    description:
      "Test AutoVere on real journeys, with real cars and real-world costs. Automotive journalists are invited to calculate, drive and compare.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Put AutoVere to the test.",
    lede: "Choose the car you actually drive. Choose the journey you want to test. Calculate it in the real AutoVere, drive it, and compare our numbers with what you truly spent.",
    statement: ["Real cars.", "Real journeys.", "Real costs."],
    primaryCta: "Apply for Challenge access",
    secondaryCta: "Explore AutoVere",
    imageCredit: "Photography: Unsplash",
  },
  invitation: {
    eyebrow: "A personal invitation to the motoring press",
    title: "We invite you to test AutoVere yourself.",
    paragraphs: [
      "If you write about cars, you already know how rarely a journey costs what a calculator says it will. Tolls, vignettes, ferries, fuel and charging add up quietly, country by country — and that is exactly what AutoVere is built to get right.",
      "We are not going to ask you to take our word for it.",
      "We would rather hand you the keys: pick a real journey, pick the car sitting on your driveway, use AutoVere as a Pro user, drive the route, and hold our calculation up against your receipts.",
      "If we are close, that is a story worth telling. If we are off, we want to know — and we would rather hear it from you than never hear it at all.",
    ],
    signature: "Kjell Mersland — Founder, AutoVere · KM Tech Labs, Kristiansand, Norway",
  },

  steps: {
    eyebrow: "How the Challenge works",
    title: "Six calm steps, from invitation to result.",
    intro:
      "Nothing here is a demo environment. From step five onward you are using the same AutoVere that every other traveller uses.",
    items: [
      { number: "01", title: "Register", body: "Register as a member of the automotive press." },
      { number: "02", title: "Get verified", body: "AutoVere reviews the request and activates Challenge access." },
      {
        number: "03",
        title: "Choose your journey",
        body: "Pick one of AutoVere's suggested Challenge routes, or a journey of your own.",
      },
      {
        number: "04",
        title: "Choose your car",
        body: "Select the vehicle you are actually testing — petrol, diesel or electric.",
      },
      {
        number: "05",
        title: "Calculate & drive",
        body: "Use the normal AutoVere experience as a Pro user. Calculate the journey, then drive it for real.",
      },
      {
        number: "06",
        title: "Compare",
        body: "Enter your actual journey costs and compare them with the AutoVere calculation.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "One product, not a press demo",
    title: "Your Challenge takes place inside the real AutoVere experience.",
    body: "AutoVere Challenge is the entrance and the testing concept — not a second, simplified calculator built for journalists. There is no limited press version, no curated sandbox and no separate numbers.",
    flow: [
      "Challenge landing page",
      "Journalist registration",
      "AutoVere verification",
      "Challenge Pro access",
      "The normal AutoVere product",
      "Your Challenge result",
    ],
    footnote: "The calculation you test is the calculation everyone else gets.",
  },
  freedom: {
    eyebrow: "Your test, your terms",
    title: "Choose the journey you want to test.",
    lines: [
      "Use one of our suggested routes — or choose your own.",
      "Choose the car you actually drive.",
    ],
    body: "There is no fixed test to pass, no scripted route and no approved car list. The Challenge is yours to design; we simply ask you to publish what you find.",
    items: [
      { title: "Any journey", body: "A suggested Challenge route, or the trip you were making anyway." },
      { title: "Any car", body: "The car in your test fleet or your own driveway — petrol, diesel or electric." },
      { title: "Full Pro access", body: "The complete AutoVere product, unrestricted, for the duration of your test." },
      { title: "Your own conclusion", body: "Publish the result exactly as you find it. We do not review it first." },
    ],
  },
  journey: {

    eyebrow: "Journey selection",
    title: "Drive a suggested route — or one that suits your test.",
    intro:
      "Two ways to run your Challenge. Both use the same engine, the same data sources and the same country-by-country breakdown.",
    options: [
      {
        label: "Option 01",
        title: "A suggested Challenge route",
        body: "For each country, AutoVere will provide three suggested routes, covering different regions and different kinds of driving.",
        bullets: ["Short", "Medium", "Long"],
      },
      {
        label: "Option 02",
        title: "Test your own journey",
        body: "Choose any realistic journey relevant to your test — the trip you were going to make anyway is often the most revealing one. For illustration only: Bergen–Trondheim, Warsaw–Kraków, Los Angeles–San Diego.",
        bullets: ["Your route", "Your schedule", "Your conditions"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Vehicle selection",
    title: "Test the car that is actually on your driveway.",
    intro:
      "Choose the powertrain, then select the specific vehicle from the existing AutoVere vehicle data. No separate Challenge vehicle list.",
    items: [
      {
        label: "Petrol",
        body: "Consumption, fuel prices and tolls costed per country along your route.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Blue coupé parked on a desert road at sunset",
      },
      {
        label: "Diesel",
        body: "Long-distance economy, weight and axle classes where operators apply them.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "White SUV on a snowy forest road",
      },
      {
        label: "Electric",
        body: "Battery size, consumption, charging stops and network pricing along the corridor.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Charging cable plugged into an electric car",
      },
    ],
  },
  evCompare: {
    eyebrow: "Same journey with an EV",
    title: "What would this journey have cost electrically?",
    body: "After calculating your own journey, you can run the identical route with an electric vehicle and see what the numbers say. Sometimes it is cheaper. Sometimes charging, tolls and detours change the picture. AutoVere shows the calculation either way.",
    exampleLabel: "Illustrative example — not a real AutoVere result",
    rows: [
      { label: "Your car", sub: "Diesel", value: "€96.40" },
      { label: "Same journey with an EV", sub: "Electric", value: "€68.20" },
    ],
    differenceLabel: "Potential difference",
    differenceValue: "€28.20",
    caveat: "Example figures only. We do not claim an EV is always cheaper.",
  },
  reality: {
    eyebrow: "Prediction vs. reality",
    title: "The part most tools quietly avoid.",
    body: "The Challenge compares what AutoVere calculated before you set off with what the journey actually cost once you arrived. That comparison belongs to you — including the days it does not flatter us.",
    exampleLabel: "Illustrative example — not a real AutoVere result",
    calculation: { label: "AutoVere calculation", value: "€96.40" },
    actual: { label: "Actual journey cost", value: "€99.10" },
    difference: { label: "Difference", value: "+2.8%" },
    caveat: "We do not promise a specific accuracy percentage. Your own result is the point.",
  },
  founder: {
    eyebrow: "The person behind AutoVere",
    title: "Why I built AutoVere",
    opening:
      "It started with a simple question: why is it still so difficult to know what a road trip will actually cost?",
    paragraphs: [
      "I am 74 years old. After more than 40 years in the construction industry, I retired in 2020. A year later, instead of slowing down, I started building something completely different.",
      "For many years, I had travelled extensively by car through Europe. And the more I travelled, the more I noticed the same problem: planning a long journey often meant searching for information in several different places.",
      "Tolls. Vignettes. Ferries. Fuel. EV charging. Different routes. Different countries. Different costs.",
      "I thought there had to be a better way. So I started building AutoVere.",
      "What began as an idea has since grown into a much bigger project — and I am not doing it alone. My son is part of the journey too. Together, we are developing AutoVere with the ambition of creating something that can be useful to drivers far beyond Norway.",
      "I have always believed that if something is worth building, it should be built properly. That is why AutoVere is based on real data, official sources, algorithms and mathematics. Not guesses. Not a black box.",
      "The goal is simple: give drivers a clearer picture of what a journey is likely to cost before they leave home — and help them make better choices about routes, cars and travel.",
      "What started in Kristiansand is now being built for Europe.",
    ],
    closing: [
      "And perhaps the most important part is this: I don't just want people to believe that AutoVere works. I want them to test it.",
      "That is why we created the AutoVere Challenge. Choose a real car. Choose a real journey. Calculate it with AutoVere. Drive it. Then compare the result with what actually happened. No special demonstration. No prepared result. Just AutoVere — and the road.",
      "If it performs well, we will be proud of it. If it gets something wrong, we want to know.",
      "Because the best way to prove AutoVere is not to tell you that it works. It's to let you test it.",
    ],
    name: "Kjell Mersland, 74",
    role: "Founder, AutoVere",
    note: "Building AutoVere together with my son",
    alt: "Kjell Mersland, founder of AutoVere",
  },
  report: {
    eyebrow: "Challenge report",
    title: "Your journey. Your result.",
    body: "Once the journey is complete, you can receive a professional Challenge result you can reference, publish or challenge us on.",
    contents: [
      "Route",
      "Vehicle",
      "Powertrain",
      "AutoVere calculation",
      "Actual journey cost",
      "Difference",
      "EV comparison",
      "Date",
      "Challenge ID",
    ],
    future: "Planned: a permanent web result, a shareable link and a PDF report.",
    cta: "View this journey in AutoVere",
    ctaNote:
      "After a Challenge, the journey and its parameters can be opened again inside the normal AutoVere product, so you can keep exploring it.",
  },
  register: {
    eyebrow: "Automotive press access",
    title: "Apply for AutoVere Challenge access",
    body: "Are you a member of the automotive press? We'd love to have you test AutoVere yourself. Apply for Challenge access and, once approved, use AutoVere as a Pro user while conducting your test.",
    fields: {
      name: "Full name",
      email: "Work email",
      outlet: "Publication or channel",
      role: "Role",
      country: "Country",
      message: "The journey and car you'd like to test",
    },
    placeholders: {
      name: "Alex Lindgren",
      email: "alex@publication.com",
      outlet: "Publication, website or channel",
      role: "Motoring journalist, reviewer, editor…",
      country: "Norway",
      message: "Optional — tell us what you plan to test",
    },
    submit: "Apply for Challenge access",
    note: "A quick verification step keeps Challenge access with working journalists. Once approved, your account is upgraded to Pro for the test — no separate press tool, no restrictions.",
    successTitle: "Thank you — we've got your application.",
    successBody:
      "Challenge access is being rolled out gradually. Your details are kept in this browser only for now, and we'll come back to you personally as soon as verification opens.",
  },

  finalCta: {
    title: "Ready to put AutoVere to the test?",
    body: "Choose a journey. Choose your car. Drive it. Compare the result.",
    primary: "Join the AutoVere Challenge",
    secondary: "Explore AutoVere",
  },
  languageLabel: "Challenge in your language",
};

/** Language URLs for the Challenge page. English/GB is the root /challenge. */
export const CHALLENGE_LANGS = [
  { prefix: "no", label: "Norsk", flag: "🇳🇴" },
  { prefix: "se", label: "Svenska", flag: "🇸🇪" },
  { prefix: "dk", label: "Dansk", flag: "🇩🇰" },
  { prefix: "fi", label: "Suomi", flag: "🇫🇮" },
  { prefix: "us", label: "US English", flag: "🇺🇸" },
  { prefix: "de", label: "Deutsch", flag: "🇩🇪" },
  { prefix: "nl", label: "Nederlands", flag: "🇳🇱" },
  { prefix: "fr", label: "Français", flag: "🇫🇷" },
  { prefix: "pl", label: "Polski", flag: "🇵🇱" },
  { prefix: "es", label: "Español", flag: "🇪🇸" },
  { prefix: "it", label: "Italiano", flag: "🇮🇹" },
] as const;

export type ChallengeLang = (typeof CHALLENGE_LANGS)[number]["prefix"];

export function isChallengeLang(value: string): value is ChallengeLang {
  return CHALLENGE_LANGS.some((l) => l.prefix === value);
}

/** Per-language overrides. Empty for now — translations land here later. */
const CHALLENGE_CONTENT_BY_LANG: Partial<Record<ChallengeLang, ChallengeContent>> = {};

export function challengeContent(lang?: string | undefined): ChallengeContent {
  if (lang && isChallengeLang(lang)) return CHALLENGE_CONTENT_BY_LANG[lang] ?? EN;
  return EN;
}

export const CHALLENGE_EN = EN;
