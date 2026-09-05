/**
 * AutoVere Challenge — landing page content.
 *
 * One reusable structure, one entry per language URL. English (GB) is the base
 * version served at /challenge; every other language lives at /challenge/<prefix>.
 * Translations can be added later by filling CHALLENGE_CONTENT_BY_LANG; any
 * missing language falls back to English so the page never breaks.
 *
 * Money in the illustrative example figures (evCompare, reality) is stored as a
 * plain EUR amount and converted at render time with AutoVere's existing currency
 * system (src/lib/currency.tsx — the same convert()/formatCurrency() used for
 * pricing everywhere else), so no locale ever hardcodes a Euro string.
 */

import type { CurrencyCode } from "@/lib/currency";

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
    /** Amounts in EUR — converted to the locale's own currency at render time. */
    rows: { label: string; sub: string; amountEur: number }[];
    differenceLabel: string;
    differenceAmountEur: number;
    caveat: string;
  };
  reality: {
    eyebrow: string;
    title: string;
    body: string;
    exampleLabel: string;
    /** Amounts in EUR — converted to the locale's own currency at render time. */
    calculation: { label: string; amountEur: number };
    actual: { label: string; amountEur: number };
    /** A relative percentage, not a currency amount — shown verbatim in every locale. */
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
    /** Phrases from paragraphs/closing to render with subtle emphasis. Must match verbatim. */
    emphasis: string[];
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
      { label: "Your car", sub: "Diesel", amountEur: 96.4 },
      { label: "Same journey with an EV", sub: "Electric", amountEur: 68.2 },
    ],
    differenceLabel: "Potential difference",
    differenceAmountEur: 28.2,
    caveat: "Example figures only. We do not claim an EV is always cheaper.",
  },
  reality: {
    eyebrow: "Prediction vs. reality",
    title: "The part most tools quietly avoid.",
    body: "The Challenge compares what AutoVere calculated before you set off with what the journey actually cost once you arrived. That comparison belongs to you — including the days it does not flatter us.",
    exampleLabel: "Illustrative example — not a real AutoVere result",
    calculation: { label: "AutoVere calculation", amountEur: 96.4 },
    actual: { label: "Actual journey cost", amountEur: 99.1 },
    difference: { label: "Difference", value: "+2.8%" },
    caveat: "We do not promise a specific accuracy percentage. Your own result is the point.",
  },
  founder: {
    eyebrow: "The person behind AutoVere",
    title: "Why I built AutoVere",
    opening:
      "It started with a simple question: Why is it still so difficult to know what a road trip will actually cost?",
    paragraphs: [
      "I am 74 years old. After more than 40 years in the construction industry, I retired in 2020.",
      "A year later, instead of slowing down, I started building something completely different.",
      "For many years, I had travelled extensively by car through Europe. The more I travelled, the more I noticed the same problem: planning a long journey often meant searching for information in several different places.",
      "Tolls. Vignettes. Ferries. Fuel. EV charging. Different routes. Different countries. Different costs.",
      "I thought there had to be a better way.",
      "So I started building AutoVere.",
      "What began as a personal idea has grown into a much bigger project — and I am not doing it alone. My son is part of the journey too.",
      "Together, we are building AutoVere around a principle that has always been important to me: if something is worth building, it should be built properly.",
      "That means using real data, official sources, algorithms and mathematics to calculate the journey.",
      "Not guesses. Not a black box.",
      "The goal is simple: give people a clearer picture of what a journey is likely to cost before they leave home — and help them make better decisions about routes, cars and travel.",
      "What started in Kristiansand has now grown beyond Norway and beyond Europe.",
      "AutoVere is already launched in the USA and Canada as well as Europe, with the ambition of becoming a global automotive intelligence platform for people who travel by road.",
    ],
    closing: [
      "But building something and believing in it is not enough.",
      "I want it to be tested in the real world.",
      "That is why we created the AutoVere Challenge.",
      "I don't want automotive journalists to simply take my word for it.",
      "Choose a real car. Choose a real journey. Calculate it with AutoVere. Drive it. Then compare the result with what actually happened.",
      "No special demonstration. No prepared result.",
      "Just AutoVere — and the road.",
      "If it performs well, we will be proud of it.",
      "If it gets something wrong, we want to know.",
      "Because the best way to prove AutoVere is not to tell you that it works.",
      "It's to let you test it.",
    ],
    name: "Kjell Mersland, 74",
    role: "Founder, AutoVere",
    note: "Building AutoVere together with my son",
    alt: "Kjell Mersland, founder of AutoVere",
    emphasis: [
      "I am 74 years old.",
      "My son is part of the journey too.",
      "Not guesses. Not a black box.",
      "AutoVere is already launched in the USA and Canada as well as Europe",
      "I want it to be tested in the real world.",
      "It's to let you test it.",
    ],
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

const NO: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — sett AutoVere på prøve",
    description:
      "Test AutoVere på ekte reiser, med ekte biler og reelle kostnader. Vi inviterer bilpressen til å beregne, kjøre og sammenligne.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Sett AutoVere på prøve.",
    lede: "Velg bilen du faktisk kjører til daglig. Velg reisen du vil teste. Beregn den i den ekte AutoVere, kjør den, og sammenlign tallene våre med det du faktisk brukte.",
    statement: ["Ekte biler.", "Ekte reiser.", "Ekte kostnader."],
    primaryCta: "Søk om Challenge-tilgang",
    secondaryCta: "Utforsk AutoVere",
    imageCredit: "Foto: Unsplash",
  },
  invitation: {
    eyebrow: "En personlig invitasjon til bilpressen",
    title: "Vi inviterer deg til å teste AutoVere selv.",
    paragraphs: [
      "Skriver du om biler, vet du det allerede: en reise ender sjelden opp med å koste det en kalkulator lovet på forhånd. Bompenger, vignetter, ferjer, drivstoff og lading legger seg på, stille og land for land — og det er nøyaktig det AutoVere er bygget for å få riktig.",
      "Vi ber deg ikke stole blindt på oss.",
      "Vi gir deg heller nøklene selv: velg en ekte reise, velg bilen som står i oppkjørselen din, bruk AutoVere som Pro-bruker, kjør ruten — og hold beregningen vår opp mot kvitteringene dine.",
      "Treffer vi, er det en historie verdt å fortelle. Bommer vi, vil vi vite det — vi hører det heller fra deg enn at det aldri kommer fram.",
    ],
    signature: "Kjell Mersland — grunnlegger av AutoVere · KM Tech Labs, Kristiansand",
  },
  steps: {
    eyebrow: "Slik fungerer Challenge",
    title: "Seks ryddige steg, fra invitasjon til resultat.",
    intro:
      "Ingenting her er et demomiljø. Fra og med steg fem bruker du nøyaktig den samme AutoVere som alle andre reisende.",
    items: [
      { number: "01", title: "Registrer deg", body: "Meld deg som en del av bilpressen." },
      {
        number: "02",
        title: "Bli verifisert",
        body: "AutoVere går gjennom søknaden og aktiverer Challenge-tilgangen din.",
      },
      {
        number: "03",
        title: "Velg reisen din",
        body: "Velg en av AutoVeres foreslåtte Challenge-ruter, eller sett opp din egen reise.",
      },
      {
        number: "04",
        title: "Velg bilen din",
        body: "Velg kjøretøyet du skal teste — bensin, diesel eller elektrisk.",
      },
      {
        number: "05",
        title: "Beregn og kjør",
        body: "Bruk den vanlige AutoVere-opplevelsen som Pro-bruker. Beregn reisen, og kjør den så for ordentlig.",
      },
      {
        number: "06",
        title: "Sammenlign",
        body: "Legg inn hva reisen faktisk kostet, og sammenlign med AutoVere-beregningen.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Ett produkt, ingen pressedemo",
    title: "Challengen din foregår inne i den ekte AutoVere-opplevelsen.",
    body: "AutoVere Challenge er døråpneren og selve testopplegget — ikke en forenklet kalkulator nummer to, bygget spesielt for journalister. Det finnes ingen begrenset presseversjon, ingen tilrettelagt sandkasse og ingen egne tall.",
    flow: [
      "Challenge-forsiden",
      "Journalistregistrering",
      "AutoVere-verifisering",
      "Challenge Pro-tilgang",
      "Det vanlige AutoVere-produktet",
      "Ditt Challenge-resultat",
    ],
    footnote: "Beregningen du tester, er den samme beregningen alle andre får.",
  },
  freedom: {
    eyebrow: "Din test, dine premisser",
    title: "Velg reisen du vil teste.",
    lines: [
      "Bruk en av våre foreslåtte ruter — eller velg din egen.",
      "Velg bilen du kjører til vanlig.",
    ],
    body: "Det finnes ingen fasit å bestå, ingen fastlagt rute og ingen godkjent billiste. Challengen er din å utforme — vi ber bare om at du publiserer det du finner.",
    items: [
      { title: "Enhver reise", body: "En foreslått Challenge-rute, eller turen du skulle ta uansett." },
      { title: "Enhver bil", body: "Bilen i testflåten din eller i din egen oppkjørsel — bensin, diesel eller elektrisk." },
      { title: "Full Pro-tilgang", body: "Hele AutoVere-produktet, uten begrensninger, gjennom hele testperioden." },
      { title: "Din egen konklusjon", body: "Publiser resultatet nøyaktig slik du finner det. Vi leser det ikke gjennom først." },
    ],
  },
  journey: {
    eyebrow: "Velg reise",
    title: "Kjør en foreslått rute — eller en som passer testen din.",
    intro:
      "To måter å gjennomføre Challengen på. Begge bruker samme beregningsmotor, samme datakilder og samme land-for-land-oversikt.",
    options: [
      {
        label: "Alternativ 01",
        title: "En foreslått Challenge-rute",
        body: "For hvert land tilbyr AutoVere tre foreslåtte ruter, som dekker ulike regioner og ulike typer kjøring.",
        bullets: ["Kort", "Middels", "Lang"],
      },
      {
        label: "Alternativ 02",
        title: "Test din egen reise",
        body: "Velg en realistisk reise som passer testen din — turen du uansett skulle ta, er ofte den mest avslørende. Illustrasjon: Bergen–Trondheim, Warszawa–Kraków, Los Angeles–San Diego.",
        bullets: ["Din rute", "Din tidsplan", "Dine kjøreforhold"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Velg kjøretøy",
    title: "Test bilen som faktisk står i oppkjørselen din.",
    intro:
      "Velg fremdriftstype, og velg deretter den konkrete bilen fra AutoVeres eksisterende kjøretøydata. Ingen egen billiste for Challenge.",
    items: [
      {
        label: "Bensin",
        body: "Forbruk, drivstoffpriser og bompenger beregnet land for land langs ruten din.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Blå coupé parkert på en ørkenvei i solnedgang",
      },
      {
        label: "Diesel",
        body: "Kjøreøkonomi på lange strekninger, pluss vekt- og akselklasser der bomselskapene bruker dem.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "Hvit SUV på en snødekt skogsvei",
      },
      {
        label: "Elektrisk",
        body: "Batteristørrelse, forbruk, ladestopp og nettverkspriser langs ruten.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Ladekabel koblet til en elbil",
      },
    ],
  },
  evCompare: {
    eyebrow: "Samme reise med elbil",
    title: "Hva ville denne reisen kostet med elbil?",
    body: "Etter at du har beregnet din egen reise, kan du kjøre den samme ruten med en elbil og se hva tallene sier. Noen ganger blir det billigere. Andre ganger endrer lading, bompenger og omveier bildet. AutoVere viser deg tallene, uansett hva de sier.",
    exampleLabel: "Illustrerende eksempel — ikke et reelt AutoVere-resultat",
    rows: [
      { label: "Bilen din", sub: "Diesel", amountEur: 96.4 },
      { label: "Samme reise med elbil", sub: "Elektrisk", amountEur: 68.2 },
    ],
    differenceLabel: "Mulig differanse",
    differenceAmountEur: 28.2,
    caveat: "Kun eksempeltall. Vi påstår ikke at elbil alltid er billigere.",
  },
  reality: {
    eyebrow: "Beregning møter virkelighet",
    title: "Delen de fleste verktøy stille unngår.",
    body: "Challengen sammenligner det AutoVere beregnet før du kjørte av gårde, med det reisen faktisk kostet når du var fremme. Den sammenligningen tilhører deg — også de dagene den ikke smigrer oss.",
    exampleLabel: "Illustrerende eksempel — ikke et reelt AutoVere-resultat",
    calculation: { label: "AutoVere-beregning", amountEur: 96.4 },
    actual: { label: "Faktisk reisekostnad", amountEur: 99.1 },
    difference: { label: "Differanse", value: "+2,8 %" },
    caveat: "Vi lover ingen bestemt treffsikkerhet i prosent. Poenget er ditt eget resultat.",
  },
  founder: {
    eyebrow: "Mannen bak AutoVere",
    title: "Hvorfor jeg bygde AutoVere",
    opening:
      "Det startet med et enkelt spørsmål: Hvorfor er det fortsatt så vanskelig å vite hva en biltur faktisk kommer til å koste?",
    paragraphs: [
      "Jeg er 74 år. Etter over 40 år i byggebransjen gikk jeg av med pensjon i 2020.",
      "Året etter — i stedet for å trappe ned — begynte jeg å bygge noe helt annet.",
      "I mange år hadde jeg kjørt mye på kryss og tvers i Europa. Jo mer jeg reiste, jo tydeligere så jeg det samme problemet: å planlegge en lang reise betydde som regel å lete etter informasjon på en håndfull forskjellige steder.",
      "Bompenger. Vignetter. Ferjer. Drivstoff. Lading. Forskjellige ruter. Forskjellige land. Forskjellige kostnader.",
      "Jeg tenkte det måtte finnes en bedre måte.",
      "Så jeg begynte å bygge AutoVere.",
      "Det som begynte som en personlig idé, har vokst til et mye større prosjekt. Og jeg gjør det ikke alene — sønnen min er også med på reisen.",
      "Sammen bygger vi AutoVere på et prinsipp som alltid har betydd mye for meg: er noe verdt å gjøre, er det verdt å gjøre skikkelig.",
      "Det betyr at vi bruker ekte data, offisielle kilder, algoritmer og matematikk for å beregne reisen.",
      "Ikke gjetning. Ikke en svart boks.",
      "Målet er enkelt: gi folk et klarere bilde av hva en reise sannsynligvis kommer til å koste før de kjører hjemmefra — og hjelpe dem å ta bedre valg om rute, bil og reise.",
      "Det som startet i Kristiansand, har vokst langt utover Norge og Europa.",
      "AutoVere er allerede lansert i USA og Canada, i tillegg til Europa — med en klar ambisjon om å bli en global reiseintelligens-plattform for alle som ferdes på vei.",
    ],
    closing: [
      "Men å bygge noe og tro på det er ikke nok.",
      "Jeg vil at det skal testes i den virkelige verden.",
      "Derfor skapte vi AutoVere Challenge.",
      "Jeg vil ikke at bilpressen bare skal ta ordene mine for god fisk.",
      "Velg en ekte bil. Velg en ekte reise. Beregn den med AutoVere. Kjør den. Sammenlign så resultatet med det som faktisk skjedde.",
      "Ingen spesiell forestilling. Ingen forhåndsbestemt fasit.",
      "Bare AutoVere — og veien.",
      "Går det bra, blir vi stolte av det.",
      "Går noe galt, vil vi vite det.",
      "For den beste måten å bevise at AutoVere fungerer, er ikke å påstå det.",
      "Det er å la deg teste det selv.",
    ],
    name: "Kjell Mersland, 74 år",
    role: "Grunnlegger av AutoVere",
    note: "Bygger AutoVere sammen med sønnen min",
    alt: "Kjell Mersland, grunnlegger av AutoVere",
    emphasis: [
      "Jeg er 74 år.",
      "sønnen min er også med på reisen.",
      "Ikke gjetning. Ikke en svart boks.",
      "AutoVere er allerede lansert i USA og Canada, i tillegg til Europa",
      "Jeg vil at det skal testes i den virkelige verden.",
      "Det er å la deg teste det selv.",
    ],
  },
  report: {
    eyebrow: "Challenge-rapport",
    title: "Din reise. Ditt resultat.",
    body: "Når reisen er fullført, får du et profesjonelt Challenge-resultat du kan vise til, publisere eller utfordre oss på.",
    contents: [
      "Rute",
      "Kjøretøy",
      "Fremdrift",
      "AutoVere-beregning",
      "Faktisk reisekostnad",
      "Differanse",
      "Elbil-sammenligning",
      "Dato",
      "Challenge-ID",
    ],
    future: "Planlagt: et permanent webresultat, en delbar lenke og en PDF-rapport.",
    cta: "Se denne reisen i AutoVere",
    ctaNote:
      "Etter en Challenge kan reisen og parameterne åpnes igjen inne i det vanlige AutoVere-produktet, slik at du kan fortsette å utforske den.",
  },
  register: {
    eyebrow: "Tilgang for bilpressen",
    title: "Søk om tilgang til AutoVere Challenge",
    body: "Er du en del av bilpressen? Vi vil gjerne at du tester AutoVere selv. Søk om Challenge-tilgang — når søknaden er godkjent, bruker du AutoVere som Pro-bruker gjennom hele testperioden.",
    fields: {
      name: "Fullt navn",
      email: "Jobb-e-post",
      outlet: "Publikasjon eller kanal",
      role: "Rolle",
      country: "Land",
      message: "Reisen og bilen du ønsker å teste",
    },
    placeholders: {
      name: "Kari Nordmann",
      email: "kari@publikasjon.no",
      outlet: "Publikasjon, nettside eller kanal",
      role: "Biljournalist, anmelder, redaktør…",
      country: "Norge",
      message: "Valgfritt — fortell oss hva du planlegger å teste",
    },
    submit: "Søk om Challenge-tilgang",
    note: "Et raskt verifiseringssteg sikrer at Challenge-tilgangen forbeholdes journalister i aktivt arbeid. Når du er godkjent, oppgraderes kontoen din til Pro for testperioden — ikke noe eget presseverktøy, ingen begrensninger.",
    successTitle: "Takk — vi har mottatt søknaden din.",
    successBody:
      "Challenge-tilgangen rulles ut gradvis. Opplysningene dine lagres foreløpig kun i denne nettleseren, og vi tar personlig kontakt med deg så snart verifiseringen åpner.",
  },
  finalCta: {
    title: "Klar for å sette AutoVere på prøve?",
    body: "Velg en reise. Velg bilen din. Kjør den. Sammenlign resultatet.",
    primary: "Bli med på AutoVere Challenge",
    secondary: "Utforsk AutoVere",
  },
  languageLabel: "Challenge på ditt språk",
};

const SE: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — sätt AutoVere på prov",
    description:
      "Testa AutoVere på riktiga resor, med riktiga bilar och verkliga kostnader. Vi bjuder in bilpressen att beräkna, köra och jämföra.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Sätt AutoVere på prov.",
    lede: "Välj bilen du kör till vardags. Välj resan du vill testa. Beräkna den i riktiga AutoVere, kör den — och jämför våra siffror med vad du faktiskt spenderade.",
    statement: ["Riktiga bilar.", "Riktiga resor.", "Riktiga kostnader."],
    primaryCta: "Ansök om Challenge-tillgång",
    secondaryCta: "Utforska AutoVere",
    imageCredit: "Foto: Unsplash",
  },
  invitation: {
    eyebrow: "En personlig inbjudan till bilpressen",
    title: "Vi bjuder in dig att testa AutoVere själv.",
    paragraphs: [
      "Skriver du om bilar vet du redan hur sällan en resa slutar med att kosta det en kalkylator lovade i förväg. Vägtullar, vinjetter, färjor, bränsle och laddning läggs på, land för land — och det är precis det AutoVere är byggt för att räkna rätt på.",
      "Vi ber dig inte lita blint på oss.",
      "Vi ger dig hellre nycklarna själv: välj en riktig resa, välj bilen som står i din uppfart, använd AutoVere som Pro-användare, kör rutten — och håll vår beräkning mot dina kvitton.",
      "Har vi rätt är det en historia värd att berätta. Har vi fel vill vi veta det — vi hör det hellre av dig än att det aldrig kommer fram.",
    ],
    signature: "Kjell Mersland — grundare av AutoVere · KM Tech Labs, Kristiansand, Norge",
  },
  steps: {
    eyebrow: "Så fungerar Challenge",
    title: "Sex tydliga steg, från inbjudan till resultat.",
    intro:
      "Inget här är en demomiljö. Från och med steg fem använder du exakt samma AutoVere som alla andra resenärer.",
    items: [
      { number: "01", title: "Registrera dig", body: "Anmäl dig som en del av bilpressen." },
      {
        number: "02",
        title: "Bli verifierad",
        body: "AutoVere går igenom ansökan och aktiverar din Challenge-tillgång.",
      },
      {
        number: "03",
        title: "Välj din resa",
        body: "Välj en av AutoVeres föreslagna Challenge-rutter, eller sätt upp din egen resa.",
      },
      {
        number: "04",
        title: "Välj din bil",
        body: "Välj fordonet du ska testa — bensin, diesel eller elektriskt.",
      },
      {
        number: "05",
        title: "Beräkna och kör",
        body: "Använd den vanliga AutoVere-upplevelsen som Pro-användare. Beräkna resan, och kör den sedan på riktigt.",
      },
      {
        number: "06",
        title: "Jämför",
        body: "Fyll i vad resan faktiskt kostade, och jämför med AutoVere-beräkningen.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "En produkt, ingen pressdemo",
    title: "Din Challenge sker inne i den riktiga AutoVere-upplevelsen.",
    body: "AutoVere Challenge är dörröppnaren och själva testupplägget — inte en förenklad kalkylator nummer två, byggd särskilt för journalister. Det finns ingen begränsad pressversion, ingen tillrättalagd sandlåda och inga egna siffror.",
    flow: [
      "Challenge-startsidan",
      "Journalistregistrering",
      "AutoVere-verifiering",
      "Challenge Pro-tillgång",
      "Den vanliga AutoVere-produkten",
      "Ditt Challenge-resultat",
    ],
    footnote: "Beräkningen du testar är samma beräkning som alla andra får.",
  },
  freedom: {
    eyebrow: "Din test, dina villkor",
    title: "Välj resan du vill testa.",
    lines: [
      "Använd en av våra föreslagna rutter — eller välj din egen.",
      "Välj bilen du kör till vardags.",
    ],
    body: "Det finns inget facit att klara, ingen fastlagd rutt och ingen godkänd billista. Challengen är din att utforma — vi ber bara om att du publicerar det du hittar.",
    items: [
      { title: "Valfri resa", body: "En föreslagen Challenge-rutt, eller resan du ändå skulle göra." },
      { title: "Valfri bil", body: "Bilen i din testflotta eller din egen uppfart — bensin, diesel eller elektrisk." },
      { title: "Full Pro-tillgång", body: "Hela AutoVere-produkten, utan begränsningar, under hela testperioden." },
      { title: "Din egen slutsats", body: "Publicera resultatet precis som du hittar det. Vi läser inte igenom det först." },
    ],
  },
  journey: {
    eyebrow: "Välj resa",
    title: "Kör en föreslagen rutt — eller en som passar ditt test.",
    intro:
      "Två sätt att genomföra din Challenge på. Båda använder samma beräkningsmotor, samma datakällor och samma land-för-land-uppdelning.",
    options: [
      {
        label: "Alternativ 01",
        title: "En föreslagen Challenge-rutt",
        body: "För varje land erbjuder AutoVere tre föreslagna rutter, som täcker olika regioner och olika typer av körning.",
        bullets: ["Kort", "Medellång", "Lång"],
      },
      {
        label: "Alternativ 02",
        title: "Testa din egen resa",
        body: "Välj en realistisk resa som passar ditt test — resan du ändå skulle göra är ofta den mest avslöjande. Illustration: Stockholm–Göteborg, Warszawa–Kraków, Los Angeles–San Diego.",
        bullets: ["Din rutt", "Ditt schema", "Dina körförhållanden"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Välj fordon",
    title: "Testa bilen som faktiskt står i din uppfart.",
    intro:
      "Välj drivlina, och välj sedan den specifika bilen från AutoVeres befintliga fordonsdata. Ingen egen billista för Challenge.",
    items: [
      {
        label: "Bensin",
        body: "Förbrukning, bränslepriser och vägtullar beräknat land för land längs din rutt.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Blå coupé parkerad på en ökenväg i solnedgång",
      },
      {
        label: "Diesel",
        body: "Bränsleekonomi på långa sträckor, plus vikt- och axelklasser där avgiftsoperatörerna använder dem.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "Vit SUV på en snöig skogsväg",
      },
      {
        label: "Elektrisk",
        body: "Batteristorlek, förbrukning, laddstopp och nätverkspriser längs rutten.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Laddkabel kopplad till en elbil",
      },
    ],
  },
  evCompare: {
    eyebrow: "Samma resa med elbil",
    title: "Vad skulle den här resan ha kostat med elbil?",
    body: "När du har beräknat din egen resa kan du köra samma rutt med en elbil och se vad siffrorna säger. Ibland blir det billigare. Andra gånger ändrar laddning, vägtullar och omvägar bilden. AutoVere visar dig siffrorna, oavsett vad de säger.",
    exampleLabel: "Illustrerande exempel — inte ett verkligt AutoVere-resultat",
    rows: [
      { label: "Din bil", sub: "Diesel", amountEur: 96.4 },
      { label: "Samma resa med elbil", sub: "Elektrisk", amountEur: 68.2 },
    ],
    differenceLabel: "Möjlig skillnad",
    differenceAmountEur: 28.2,
    caveat: "Endast exempelsiffror. Vi påstår inte att elbil alltid är billigare.",
  },
  reality: {
    eyebrow: "Beräkning möter verklighet",
    title: "Delen de flesta verktyg tyst undviker.",
    body: "Challengen jämför det AutoVere beräknade innan du gav dig av med vad resan faktiskt kostade när du var framme. Den jämförelsen tillhör dig — även de dagar den inte smickrar oss.",
    exampleLabel: "Illustrerande exempel — inte ett verkligt AutoVere-resultat",
    calculation: { label: "AutoVere-beräkning", amountEur: 96.4 },
    actual: { label: "Faktisk resekostnad", amountEur: 99.1 },
    difference: { label: "Skillnad", value: "+2,8 %" },
    caveat: "Vi lovar ingen exakt träffsäkerhet i procent. Poängen är ditt eget resultat.",
  },
  founder: {
    eyebrow: "Mannen bakom AutoVere",
    title: "Varför jag byggde AutoVere",
    opening:
      "Det började med en enkel fråga: Varför är det fortfarande så svårt att veta vad en bilresa faktiskt kommer att kosta?",
    paragraphs: [
      "Jag är 74 år. Efter över 40 år i byggbranschen gick jag i pension 2020.",
      "Året efter — i stället för att trappa ner — började jag bygga något helt annat.",
      "I många år hade jag kört mycket kors och tvärs genom Europa. Ju mer jag reste, desto tydligare såg jag samma problem: att planera en lång resa innebar oftast att leta efter information på en handfull olika ställen.",
      "Vägtullar. Vinjetter. Färjor. Bränsle. Laddning. Olika rutter. Olika länder. Olika kostnader.",
      "Jag tänkte att det måste finnas ett bättre sätt.",
      "Så jag började bygga AutoVere.",
      "Det som började som en personlig idé har vuxit till ett mycket större projekt. Och jag gör det inte ensam — min son är också med på resan.",
      "Tillsammans bygger vi AutoVere på en princip som alltid har betytt mycket för mig: är något värt att göra, är det värt att göra ordentligt.",
      "Det betyder att vi använder riktig data, officiella källor, algoritmer och matematik för att beräkna resan.",
      "Inga gissningar. Ingen svart låda.",
      "Målet är enkelt: ge folk en tydligare bild av vad en resa sannolikt kommer att kosta innan de kör hemifrån — och hjälpa dem fatta bättre beslut om rutt, bil och resa.",
      "Det som startade i Kristiansand, Norge, har vuxit långt utanför både Norge och Europa.",
      "AutoVere är redan lanserat i USA och Kanada, utöver Europa — med en tydlig ambition: att bli en global reseintelligensplattform för alla som färdas på väg.",
    ],
    closing: [
      "Men att bygga något och tro på det räcker inte.",
      "Jag vill att det testas i den verkliga världen.",
      "Därför skapade vi AutoVere Challenge.",
      "Jag vill inte att bilpressen bara ska lita blint på mig.",
      "Välj en riktig bil. Välj en riktig resa. Beräkna den med AutoVere. Kör den. Jämför sedan resultatet med vad som faktiskt hände.",
      "Ingen särskild föreställning. Inget förutbestämt facit.",
      "Bara AutoVere — och vägen.",
      "Går det bra blir vi stolta över det.",
      "Går något fel vill vi veta det.",
      "För det bästa sättet att bevisa att AutoVere fungerar är inte att påstå det.",
      "Det är att låta dig testa det själv.",
    ],
    name: "Kjell Mersland, 74 år",
    role: "Grundare av AutoVere",
    note: "Bygger AutoVere tillsammans med min son",
    alt: "Kjell Mersland, grundare av AutoVere",
    emphasis: [
      "Jag är 74 år.",
      "min son är också med på resan.",
      "Inga gissningar. Ingen svart låda.",
      "AutoVere är redan lanserat i USA och Kanada, utöver Europa",
      "Jag vill att det testas i den verkliga världen.",
      "Det är att låta dig testa det själv.",
    ],
  },
  report: {
    eyebrow: "Challenge-rapport",
    title: "Din resa. Ditt resultat.",
    body: "När resan är klar får du ett professionellt Challenge-resultat du kan hänvisa till, publicera eller utmana oss på.",
    contents: [
      "Rutt",
      "Fordon",
      "Drivlina",
      "AutoVere-beräkning",
      "Faktisk resekostnad",
      "Skillnad",
      "Elbilsjämförelse",
      "Datum",
      "Challenge-ID",
    ],
    future: "Planerat: ett permanent webbresultat, en delbar länk och en PDF-rapport.",
    cta: "Se den här resan i AutoVere",
    ctaNote:
      "Efter en Challenge kan resan och dess parametrar öppnas igen inne i den vanliga AutoVere-produkten, så att du kan fortsätta utforska den.",
  },
  register: {
    eyebrow: "Tillgång för bilpressen",
    title: "Ansök om tillgång till AutoVere Challenge",
    body: "Är du en del av bilpressen? Vi vill gärna att du testar AutoVere själv. Ansök om Challenge-tillgång — när ansökan är godkänd använder du AutoVere som Pro-användare under hela testperioden.",
    fields: {
      name: "Fullständigt namn",
      email: "Jobb-e-post",
      outlet: "Publikation eller kanal",
      role: "Roll",
      country: "Land",
      message: "Resan och bilen du vill testa",
    },
    placeholders: {
      name: "Kajsa Andersson",
      email: "kajsa@publikation.se",
      outlet: "Publikation, webbplats eller kanal",
      role: "Bilskribent, recensent, redaktör…",
      country: "Sverige",
      message: "Valfritt — berätta vad du planerar att testa",
    },
    submit: "Ansök om Challenge-tillgång",
    note: "Ett snabbt verifieringssteg säkerställer att Challenge-tillgången förbehålls yrkesverksamma journalister. När du är godkänd uppgraderas ditt konto till Pro för testperioden — inget separat pressverktyg, inga begränsningar.",
    successTitle: "Tack — vi har tagit emot din ansökan.",
    successBody:
      "Challenge-tillgången rullas ut gradvis. Dina uppgifter sparas tills vidare bara i den här webbläsaren, och vi hör av oss personligen så snart verifieringen öppnar.",
  },
  finalCta: {
    title: "Redo att sätta AutoVere på prov?",
    body: "Välj en resa. Välj din bil. Kör den. Jämför resultatet.",
    primary: "Gå med i AutoVere Challenge",
    secondary: "Utforska AutoVere",
  },
  languageLabel: "Challenge på ditt språk",
};

const DK: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — sæt AutoVere på prøve",
    description:
      "Test AutoVere på rigtige rejser, med rigtige biler og reelle omkostninger. Vi inviterer bilpressen til at beregne, køre og sammenligne.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Sæt AutoVere på prøve.",
    lede: "Vælg bilen du kører til daglig. Vælg rejsen du vil teste. Beregn den i den rigtige AutoVere, kør den — og sammenlign vores tal med det, du reelt brugte.",
    statement: ["Rigtige biler.", "Rigtige rejser.", "Rigtige omkostninger."],
    primaryCta: "Ansøg om Challenge-adgang",
    secondaryCta: "Udforsk AutoVere",
    imageCredit: "Foto: Unsplash",
  },
  invitation: {
    eyebrow: "En personlig invitation til bilpressen",
    title: "Vi inviterer dig til at teste AutoVere selv.",
    paragraphs: [
      "Skriver du om biler, ved du det allerede: en rejse ender sjældent med at koste det, en kalkulator lovede på forhånd. Vejafgifter, vignetter, færger, brændstof og opladning lægger sig oveni, land for land — og det er præcis det, AutoVere er bygget til at ramme rigtigt.",
      "Vi beder dig ikke om bare at stole blindt på os.",
      "Vi giver dig hellere nøglerne selv: vælg en rigtig rejse, vælg bilen der står i din indkørsel, brug AutoVere som Pro-bruger, kør ruten — og hold vores beregning op mod dine kvitteringer.",
      "Rammer vi rigtigt, er det en historie værd at fortælle. Rammer vi forkert, vil vi gerne vide det — vi hører det hellere fra dig, end at det aldrig kommer frem.",
    ],
    signature: "Kjell Mersland — grundlægger af AutoVere · KM Tech Labs, Kristiansand, Norge",
  },
  steps: {
    eyebrow: "Sådan fungerer Challenge",
    title: "Seks tydelige trin, fra invitation til resultat.",
    intro:
      "Intet her er et demomiljø. Fra trin fem bruger du nøjagtig den samme AutoVere, som alle andre rejsende gør.",
    items: [
      { number: "01", title: "Registrer dig", body: "Meld dig som en del af bilpressen." },
      {
        number: "02",
        title: "Bliv verificeret",
        body: "AutoVere gennemgår din ansøgning og aktiverer din Challenge-adgang.",
      },
      {
        number: "03",
        title: "Vælg din rejse",
        body: "Vælg en af AutoVeres foreslåede Challenge-ruter, eller sæt din egen rejse op.",
      },
      {
        number: "04",
        title: "Vælg din bil",
        body: "Vælg køretøjet du skal teste — benzin, diesel eller elektrisk.",
      },
      {
        number: "05",
        title: "Beregn og kør",
        body: "Brug den almindelige AutoVere-oplevelse som Pro-bruger. Beregn rejsen, og kør den så for alvor.",
      },
      {
        number: "06",
        title: "Sammenlign",
        body: "Indtast hvad rejsen reelt kostede, og sammenlign med AutoVere-beregningen.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Ét produkt, ingen pressedemo",
    title: "Din Challenge foregår inde i den rigtige AutoVere-oplevelse.",
    body: "AutoVere Challenge er døråbneren og selve testforløbet — ikke endnu en forenklet kalkulator bygget specielt til journalister. Der findes ingen begrænset presseversion, ingen tilrettelagt sandkasse og ingen egne tal.",
    flow: [
      "Challenge-forsiden",
      "Journalistregistrering",
      "AutoVere-verificering",
      "Challenge Pro-adgang",
      "Det almindelige AutoVere-produkt",
      "Dit Challenge-resultat",
    ],
    footnote: "Beregningen du tester, er den samme beregning, alle andre får.",
  },
  freedom: {
    eyebrow: "Din test, dine betingelser",
    title: "Vælg rejsen du vil teste.",
    lines: [
      "Brug en af vores foreslåede ruter — eller vælg din egen.",
      "Vælg bilen du kører til daglig.",
    ],
    body: "Der findes ingen facitliste at bestå, ingen fastlagt rute og ingen godkendt billiste. Challengen er din at forme — vi beder bare om, at du offentliggør det, du finder.",
    items: [
      { title: "Valgfri rejse", body: "En foreslået Challenge-rute, eller turen du alligevel skulle ud på." },
      { title: "Valgfri bil", body: "Bilen i din testflåde eller din egen indkørsel — benzin, diesel eller elektrisk." },
      { title: "Fuld Pro-adgang", body: "Hele AutoVere-produktet, uden begrænsninger, i hele testperioden." },
      { title: "Din egen konklusion", body: "Offentliggør resultatet præcis som du finder det. Vi læser det ikke igennem først." },
    ],
  },
  journey: {
    eyebrow: "Vælg rejse",
    title: "Kør en foreslået rute — eller en der passer til din test.",
    intro:
      "To måder at gennemføre din Challenge på. Begge bruger samme beregningsmotor, samme datakilder og samme land-for-land-opdeling.",
    options: [
      {
        label: "Mulighed 01",
        title: "En foreslået Challenge-rute",
        body: "For hvert land tilbyder AutoVere tre foreslåede ruter, der dækker forskellige regioner og forskellige typer kørsel.",
        bullets: ["Kort", "Mellemlang", "Lang"],
      },
      {
        label: "Mulighed 02",
        title: "Test din egen rejse",
        body: "Vælg en realistisk rejse, der passer til din test — turen du alligevel skulle ud på, er ofte den mest afslørende. Eksempel: København–Aarhus, Warszawa–Kraków, Los Angeles–San Diego.",
        bullets: ["Din rute", "Din tidsplan", "Dine kørselsforhold"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Vælg køretøj",
    title: "Test bilen der faktisk står i din indkørsel.",
    intro:
      "Vælg drivmiddel, og vælg derefter den konkrete bil fra AutoVeres eksisterende køretøjsdata. Ingen selvstændig billiste til Challenge.",
    items: [
      {
        label: "Benzin",
        body: "Forbrug, brændstofpriser og vejafgifter beregnet land for land langs din rute.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Blå coupé parkeret på en ørkenvej ved solnedgang",
      },
      {
        label: "Diesel",
        body: "Brændstoføkonomi på lange strækninger, samt vægt- og akselklasser hvor afgiftsoperatørerne bruger dem.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "Hvid SUV på en snedækket skovvej",
      },
      {
        label: "Elektrisk",
        body: "Batteristørrelse, forbrug, ladestop og netværkspriser langs ruten.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Ladekabel tilsluttet en elbil",
      },
    ],
  },
  evCompare: {
    eyebrow: "Samme rejse med elbil",
    title: "Hvad ville denne rejse have kostet med elbil?",
    body: "Når du har beregnet din egen rejse, kan du køre den samme rute med en elbil og se, hvad tallene siger. Nogle gange bliver det billigere. Andre gange ændrer opladning, vejafgifter og omveje billedet. AutoVere viser dig tallene, uanset hvad de siger.",
    exampleLabel: "Illustrativt eksempel — ikke et reelt AutoVere-resultat",
    rows: [
      { label: "Din bil", sub: "Diesel", amountEur: 96.4 },
      { label: "Samme rejse med elbil", sub: "Elektrisk", amountEur: 68.2 },
    ],
    differenceLabel: "Mulig forskel",
    differenceAmountEur: 28.2,
    caveat: "Kun eksempeltal. Vi påstår ikke, at elbil altid er billigere.",
  },
  reality: {
    eyebrow: "Beregning møder virkelighed",
    title: "Den del de fleste værktøjer stille undgår.",
    body: "Challengen sammenligner det, AutoVere beregnede, før du kørte hjemmefra, med det rejsen reelt kostede, da du var fremme. Den sammenligning tilhører dig — også de dage, den ikke smigrer os.",
    exampleLabel: "Illustrativt eksempel — ikke et reelt AutoVere-resultat",
    calculation: { label: "AutoVere-beregning", amountEur: 96.4 },
    actual: { label: "Reel rejseomkostning", amountEur: 99.1 },
    difference: { label: "Forskel", value: "+2,8 %" },
    caveat: "Vi lover ingen bestemt nøjagtighed i procent. Pointen er dit eget resultat.",
  },
  founder: {
    eyebrow: "Manden bag AutoVere",
    title: "Hvorfor jeg byggede AutoVere",
    opening:
      "Det startede med et enkelt spørgsmål: Hvor svært er det stadig at vide, hvad en roadtrip reelt kommer til at koste?",
    paragraphs: [
      "Jeg er 74 år. Efter mere end 40 år i byggebranchen gik jeg på pension i 2020.",
      "Året efter — i stedet for at trappe ned — begyndte jeg at bygge noget helt andet.",
      "I mange år havde jeg kørt på kryds og tværs gennem Europa. Jo mere jeg rejste, desto tydeligere så jeg det samme problem: at planlægge en lang rejse betød som regel at lede efter oplysninger på en håndfuld forskellige steder.",
      "Vejafgifter. Vignetter. Færger. Brændstof. Opladning. Forskellige ruter. Forskellige lande. Forskellige omkostninger.",
      "Jeg tænkte, der måtte findes en bedre måde.",
      "Så jeg begyndte at bygge AutoVere.",
      "Det, der begyndte som en personlig idé, er vokset til et langt større projekt. Og jeg gør det ikke alene — min søn er også med på rejsen.",
      "Sammen bygger vi AutoVere på et princip, der altid har betydet meget for mig: er noget værd at gøre, er det værd at gøre ordentligt.",
      "Det betyder, at vi bruger rigtige data, officielle kilder, algoritmer og matematik til at beregne rejsen.",
      "Ikke gætværk. Ikke en sort boks.",
      "Målet er enkelt: give folk et klarere billede af, hvad en rejse sandsynligvis kommer til at koste, før de kører hjemmefra — og hjælpe dem med at træffe bedre valg om rute, bil og rejse.",
      "Det, der startede i Kristiansand, Norge, er vokset langt ud over både Norge og Europa.",
      "AutoVere er allerede lanceret i USA og Canada, ud over Europa — med en klar ambition: at blive en global rejseintelligensplatform for alle, der færdes på vejen.",
    ],
    closing: [
      "Men at bygge noget og tro på det er ikke nok.",
      "Jeg vil have det testet i den virkelige verden.",
      "Derfor skabte vi AutoVere Challenge.",
      "Jeg vil ikke have, at bilpressen bare skal tage mine ord for gode varer.",
      "Vælg en rigtig bil. Vælg en rigtig rejse. Beregn den med AutoVere. Kør den. Sammenlign så resultatet med det, der faktisk skete.",
      "Ingen særlig forestilling. Intet forudbestemt facit.",
      "Bare AutoVere — og vejen.",
      "Går det godt, bliver vi stolte af det.",
      "Går noget galt, vil vi gerne vide det.",
      "For den bedste måde at bevise, at AutoVere virker, er ikke at påstå det.",
      "Det er at lade dig teste det selv.",
    ],
    name: "Kjell Mersland, 74 år",
    role: "Grundlægger af AutoVere",
    note: "Bygger AutoVere sammen med min søn",
    alt: "Kjell Mersland, grundlægger af AutoVere",
    emphasis: [
      "Jeg er 74 år.",
      "min søn er også med på rejsen.",
      "Ikke gætværk. Ikke en sort boks.",
      "AutoVere er allerede lanceret i USA og Canada, ud over Europa",
      "Jeg vil have det testet i den virkelige verden.",
      "Det er at lade dig teste det selv.",
    ],
  },
  report: {
    eyebrow: "Challenge-rapport",
    title: "Din rejse. Dit resultat.",
    body: "Når rejsen er afsluttet, får du et professionelt Challenge-resultat, du kan henvise til, offentliggøre eller udfordre os på.",
    contents: [
      "Rute",
      "Køretøj",
      "Drivmiddel",
      "AutoVere-beregning",
      "Reel rejseomkostning",
      "Forskel",
      "Elbilsammenligning",
      "Dato",
      "Challenge-ID",
    ],
    future: "Planlagt: et permanent webresultat, et link du kan dele, og en PDF-rapport.",
    cta: "Se denne rejse i AutoVere",
    ctaNote:
      "Efter en Challenge kan rejsen og dens parametre åbnes igen inde i det almindelige AutoVere-produkt, så du kan blive ved med at udforske den.",
  },
  register: {
    eyebrow: "Adgang for bilpressen",
    title: "Ansøg om adgang til AutoVere Challenge",
    body: "Er du en del af bilpressen? Vi vil meget gerne have, at du tester AutoVere selv. Ansøg om Challenge-adgang — når din ansøgning er godkendt, bruger du AutoVere som Pro-bruger i hele testperioden.",
    fields: {
      name: "Fulde navn",
      email: "Arbejds-e-mail",
      outlet: "Medie eller kanal",
      role: "Rolle",
      country: "Land",
      message: "Rejsen og bilen du gerne vil teste",
    },
    placeholders: {
      name: "Kirsten Nielsen",
      email: "kirsten@medie.dk",
      outlet: "Medie, hjemmeside eller kanal",
      role: "Bilskribent, anmelder, redaktør…",
      country: "Danmark",
      message: "Valgfrit — fortæl os hvad du planlægger at teste",
    },
    submit: "Ansøg om Challenge-adgang",
    note: "Et hurtigt verificeringstrin sikrer, at Challenge-adgang forbeholdes journalister i aktivt arbejde. Når du er godkendt, opgraderes din konto til Pro i testperioden — intet separat presseværktøj, ingen begrænsninger.",
    successTitle: "Tak — vi har modtaget din ansøgning.",
    successBody:
      "Challenge-adgangen rulles gradvist ud. Dine oplysninger gemmes indtil videre kun i denne browser, og vi kontakter dig personligt, så snart verificeringen åbner.",
  },
  finalCta: {
    title: "Klar til at sætte AutoVere på prøve?",
    body: "Vælg en rejse. Vælg din bil. Kør den. Sammenlign resultatet.",
    primary: "Vær med i AutoVere Challenge",
    secondary: "Udforsk AutoVere",
  },
  languageLabel: "Challenge på dit sprog",
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

/**
 * Fixed display currency for each Challenge locale's illustrative example figures.
 * Mirrors the app's existing per-locale currency defaults (LOCALE_DEFAULT_CURRENCY in
 * src/lib/currency.tsx) under Challenge's own prefix naming — "se" and "dk" are Challenge's
 * URL prefixes for Swedish/Danish, while the shared currency map keys them "sv"/"da".
 * English/GB (the master, no prefix) is intentionally pinned to EUR so /challenge's
 * rendered output is unaffected — its "real" locale default (GBP) is deliberately not
 * used here, matching the existing master figures rather than changing them.
 */
export const CHALLENGE_CURRENCY: Record<ChallengeLang | "en", CurrencyCode> = {
  en: "EUR",
  no: "NOK",
  se: "SEK",
  dk: "DKK",
  fi: "EUR",
  us: "USD",
  de: "EUR",
  nl: "EUR",
  fr: "EUR",
  pl: "PLN",
  es: "EUR",
  it: "EUR",
};

/** Per-language overrides. Missing languages fall back to English. */
const CHALLENGE_CONTENT_BY_LANG: Partial<Record<ChallengeLang, ChallengeContent>> = {
  no: NO,
  se: SE,
  dk: DK,
};

export function challengeContent(lang?: string | undefined): ChallengeContent {
  if (lang && isChallengeLang(lang)) return CHALLENGE_CONTENT_BY_LANG[lang] ?? EN;
  return EN;
}

export const CHALLENGE_EN = EN;
