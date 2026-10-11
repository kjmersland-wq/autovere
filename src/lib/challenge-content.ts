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
    signature: "Kjell Mersland — Founder, AutoVere · KM Tech Labs",
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
      "What started as one idea has now grown beyond Norway and beyond Europe.",
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
    signature: "Kjell Mersland — grunnlegger av AutoVere · KM Tech Labs",
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
      "Det som startet som én idé, har vokst langt utover Norge og Europa.",
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
    signature: "Kjell Mersland — grundare av AutoVere · KM Tech Labs",
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
      "Det som startade som en idé har vuxit långt utanför både Norge och Europa.",
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
    signature: "Kjell Mersland — grundlægger af AutoVere · KM Tech Labs",
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
      "Det, der startede som én idé, er vokset langt ud over både Norge og Europa.",
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

const FI: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — pane AutoVere koetteelle",
    description:
      "Testaa AutoVerea oikeilla matkoilla, oikeilla autoilla ja todellisilla kustannuksilla. Kutsumme autotoimittajat laskemaan, ajamaan ja vertailemaan.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Pane AutoVere koetteelle.",
    lede: "Valitse auto, jolla oikeasti ajat. Valitse matka, jota haluat testata. Laske se aidossa AutoVeressa, aja se — ja vertaile lukujamme siihen, mitä todella kulutit.",
    statement: ["Oikeat autot.", "Oikeat matkat.", "Oikeat kustannukset."],
    primaryCta: "Hae Challenge-pääsyä",
    secondaryCta: "Tutustu AutoVereen",
    imageCredit: "Kuva: Unsplash",
  },
  invitation: {
    eyebrow: "Henkilökohtainen kutsu autotoimittajille",
    title: "Kutsumme sinut testaamaan AutoVerea itse.",
    paragraphs: [
      "Jos kirjoitat autoista, tiedät jo, miten harvoin matka maksaa sen, minkä laskuri lupasi etukäteen. Tietullit, vinjetit, lautat, polttoaine ja lataus kasautuvat hiljaa maittain — ja juuri sen AutoVere on rakennettu laskemaan oikein.",
      "Emme pyydä sinua vain luottamaan sokeasti meihin.",
      "Annamme sinulle mieluummin avaimet: valitse oikea matka, valitse auto, joka on omalla pihallasi, käytä AutoVerea Pro-käyttäjänä, aja reitti — ja vertaa laskelmaamme kuitteihisi.",
      "Jos osumme oikeaan, siitä kannattaa kertoa. Jos osumme väärään, haluamme tietää sen — kuulemme sen mieluummin sinulta kuin että se ei tulisi koskaan ilmi.",
    ],
    signature: "Kjell Mersland — AutoVeren perustaja · KM Tech Labs",
  },
  steps: {
    eyebrow: "Näin Challenge toimii",
    title: "Kuusi selkeää vaihetta kutsusta tulokseen.",
    intro:
      "Mikään tässä ei ole demoympäristö. Viidennestä vaiheesta lähtien käytät täsmälleen samaa AutoVerea kuin kaikki muut matkailijat.",
    items: [
      { number: "01", title: "Rekisteröidy", body: "Ilmoittaudu mukaan autotoimittajana." },
      {
        number: "02",
        title: "Vahvistus",
        body: "AutoVere käy hakemuksesi läpi ja aktivoi Challenge-pääsysi.",
      },
      {
        number: "03",
        title: "Valitse matkasi",
        body: "Valitse joko AutoVeren ehdottama Challenge-reitti tai kokoa oma matkasi.",
      },
      {
        number: "04",
        title: "Valitse autosi",
        body: "Valitse ajoneuvo, jota oikeasti testaat — bensiini, diesel tai sähkö.",
      },
      {
        number: "05",
        title: "Laske ja aja",
        body: "Käytä tavallista AutoVere-kokemusta Pro-käyttäjänä. Laske matka ja aja se sitten oikeasti.",
      },
      {
        number: "06",
        title: "Vertaile",
        body: "Syötä, mitä matka oikeasti maksoi, ja vertaile sitä AutoVere-laskelmaan.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Yksi tuote, ei lehdistödemoa",
    title: "Challengesi tapahtuu aidon AutoVere-kokemuksen sisällä.",
    body: "AutoVere Challenge on sisäänkäynti ja koko testausmalli — ei toista, yksinkertaistettua laskuria, joka on rakennettu erityisesti toimittajia varten. Mitään rajattua lehdistöversiota, valmiiksi rakennettua hiekkalaatikkoa tai omia lukuja ei ole.",
    flow: [
      "Challenge-aloitussivu",
      "Toimittajarekisteröinti",
      "AutoVere-vahvistus",
      "Challenge Pro -pääsy",
      "Tavallinen AutoVere-tuote",
      "Oma Challenge-tuloksesi",
    ],
    footnote: "Laskelma, jota testaat, on sama laskelma, jonka kaikki muutkin saavat.",
  },
  freedom: {
    eyebrow: "Oma testisi, omat ehtosi",
    title: "Valitse matka, jota haluat testata.",
    lines: [
      "Käytä jotain ehdottamistamme reiteistä — tai valitse oma.",
      "Valitse auto, jolla ajat arjessa.",
    ],
    body: "Läpäistävää testiä, käsikirjoitettua reittiä tai hyväksyttyjen autojen listaa ei ole. Challenge on sinun muotoiltavanasi — pyydämme vain, että julkaiset sen, mitä löydät.",
    items: [
      { title: "Mikä tahansa matka", body: "Ehdotettu Challenge-reitti tai matka, jonka olisit tehnyt joka tapauksessa." },
      { title: "Mikä tahansa auto", body: "Auto testiflotassasi tai omalla pihallasi — bensiini, diesel tai sähkö." },
      { title: "Täysi Pro-pääsy", body: "Koko AutoVere-tuote, ilman rajoituksia, koko testijakson ajan." },
      { title: "Oma johtopäätöksesi", body: "Julkaise tulos juuri sellaisena kuin löydät sen. Emme lue sitä läpi etukäteen." },
    ],
  },
  journey: {
    eyebrow: "Valitse matka",
    title: "Aja ehdotettua reittiä — tai sellaista, joka sopii testiisi.",
    intro:
      "Challengesi voi toteuttaa kahdella tavalla. Molemmat käyttävät samaa laskentamoottoria, samoja tietolähteitä ja samaa maakohtaista erittelyä.",
    options: [
      {
        label: "Vaihtoehto 01",
        title: "Ehdotettu Challenge-reitti",
        body: "AutoVere tarjoaa jokaiselle maalle kolme ehdotettua reittiä, jotka kattavat eri alueita ja erilaista ajamista.",
        bullets: ["Lyhyt", "Keskipitkä", "Pitkä"],
      },
      {
        label: "Vaihtoehto 02",
        title: "Testaa omaa matkaasi",
        body: "Valitse realistinen matka, joka sopii testiisi — matka, jonka olisit tehnyt joka tapauksessa, on usein kaikkein paljastavin. Esimerkkinä: Helsinki–Rovaniemi, Warszawa–Kraków, Los Angeles–San Diego.",
        bullets: ["Oma reittisi", "Oma aikataulusi", "Omat ajo-olosuhteesi"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Valitse ajoneuvo",
    title: "Testaa autoa, joka oikeasti on pihallasi.",
    intro:
      "Valitse käyttövoima ja sen jälkeen tarkka auto AutoVeren olemassa olevasta ajoneuvodatasta. Challengelle ei ole erillistä autolistaa.",
    items: [
      {
        label: "Bensiini",
        body: "Kulutus, polttoainehinnat ja tietullit laskettuna maittain reittisi varrella.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Sininen coupé pysäköitynä autiomaan tiellä auringonlaskussa",
      },
      {
        label: "Diesel",
        body: "Polttoainetalous pitkillä matkoilla sekä paino- ja akseliluokat, joissa tietullioperaattorit soveltavat niitä.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "Valkoinen maastoauto lumisella metsätiellä",
      },
      {
        label: "Sähkö",
        body: "Akun koko, kulutus, latauspysähdykset ja verkkohinnat reitin varrella.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Latauskaapeli kytkettynä sähköautoon",
      },
    ],
  },
  evCompare: {
    eyebrow: "Sama matka sähköautolla",
    title: "Mitä tämä matka olisi maksanut sähköautolla?",
    body: "Kun olet laskenut matkasi, voit ajaa saman reitin sähköautolla ja katsoa, mitä luvut kertovat. Joskus se on halvempi. Toisinaan lataus, tietullit ja kiertotiet muuttavat kuvan. AutoVere näyttää luvut joka tapauksessa.",
    exampleLabel: "Havainnollistava esimerkki — ei todellinen AutoVere-tulos",
    rows: [
      { label: "Autosi", sub: "Diesel", amountEur: 96.4 },
      { label: "Sama matka sähköautolla", sub: "Sähkö", amountEur: 68.2 },
    ],
    differenceLabel: "Mahdollinen ero",
    differenceAmountEur: 28.2,
    caveat: "Vain esimerkkilukuja. Emme väitä, että sähköauto on aina halvempi.",
  },
  reality: {
    eyebrow: "Arvio kohtaa todellisuuden",
    title: "Osa, jota useimmat työkalut hiljaa välttävät.",
    body: "Challenge vertaa sitä, mitä AutoVere laski ennen matkaan lähtöä, siihen, mitä matka todella maksoi perillä. Se vertailu kuuluu sinulle — myös niinä päivinä, jolloin se ei mairittele meitä.",
    exampleLabel: "Havainnollistava esimerkki — ei todellinen AutoVere-tulos",
    calculation: { label: "AutoVere-laskelma", amountEur: 96.4 },
    actual: { label: "Todellinen matkakustannus", amountEur: 99.1 },
    difference: { label: "Ero", value: "+2,8 %" },
    caveat: "Emme lupaa tarkkaa prosentuaalista osumatarkkuutta. Pointti on omassa tuloksessasi.",
  },
  founder: {
    eyebrow: "Mies AutoVeren takana",
    title: "Miksi rakensin AutoVeren",
    opening:
      "Kaikki alkoi yksinkertaisesta kysymyksestä: Miksi on yhä niin vaikeaa tietää, mitä autolla matkustaminen oikeasti maksaa?",
    paragraphs: [
      "Olen 74-vuotias. Yli 40 vuoden jälkeen rakennusalalla jäin eläkkeelle vuonna 2020.",
      "Vuotta myöhemmin, sen sijaan että olisin hidastanut, aloin rakentaa jotain aivan uutta.",
      "Olin ajanut vuosikausia ristiin rastiin Euroopassa. Mitä enemmän matkustin, sitä selvemmin näin saman ongelman: pitkän matkan suunnittelu tarkoitti yleensä tiedon etsimistä monesta eri paikasta.",
      "Tietullit. Vinjetit. Lautat. Polttoaine. Lataus. Eri reitit. Eri maat. Eri kustannukset.",
      "Ajattelin, että täytyy olla parempi tapa.",
      "Joten aloin rakentaa AutoVerea.",
      "Se, mikä alkoi henkilökohtaisena ideana, on kasvanut paljon suuremmaksi hankkeeksi. Enkä tee sitä yksin — poikani on myös mukana tässä matkassa.",
      "Yhdessä rakennamme AutoVerea periaatteen pohjalta, joka on aina merkinnyt minulle paljon: jos jotain on syytä tehdä, se kannattaa tehdä kunnolla.",
      "Se tarkoittaa, että käytämme aitoa dataa, virallisia lähteitä, algoritmeja ja matematiikkaa matkan laskemiseen.",
      "Ei arvailua. Ei mustaa laatikkoa.",
      "Tavoite on yksinkertainen: antaa ihmisille selkeämpi kuva siitä, mitä matka todennäköisesti tulee maksamaan ennen kotoa lähtöä — ja auttaa heitä tekemään parempia valintoja reitin, auton ja matkustustavan suhteen.",
      "Se, mikä alkoi yhtenä pienenä ideana, on kasvanut kauas Norjan ja Euroopan ulkopuolelle.",
      "AutoVere on jo lanseerattu Yhdysvalloissa ja Kanadassa Euroopan lisäksi, ja kunnianhimomme on tulla globaaliksi automatkailun tietoalustaksi kaikille, jotka liikkuvat teillä.",
    ],
    closing: [
      "Mutta jonkin rakentaminen ja siihen uskominen ei riitä.",
      "Haluan, että se testataan oikeassa maailmassa.",
      "Siksi loimme AutoVere Challengen.",
      "En halua, että autotoimittajat vain luottavat sanaani.",
      "Valitse oikea auto. Valitse oikea matka. Laske se AutoVerella. Aja se. Vertaa sitten tulosta siihen, mikä todella tapahtui.",
      "Ei erikoisnäytöstä. Ei ennalta sovittua tulosta.",
      "Vain AutoVere — ja tie.",
      "Jos se toimii hyvin, olemme siitä ylpeitä.",
      "Jos jokin menee pieleen, haluamme tietää siitä.",
      "Sillä paras tapa todistaa, että AutoVere toimii, ei ole väittää sitä.",
      "Se on antaa sinun testata sitä itse.",
    ],
    name: "Kjell Mersland, 74-vuotias",
    role: "AutoVeren perustaja",
    note: "Rakennan AutoVerea yhdessä poikani kanssa",
    alt: "Kjell Mersland, AutoVeren perustaja",
    emphasis: [
      "Olen 74-vuotias.",
      "poikani on myös mukana tässä matkassa.",
      "Ei arvailua. Ei mustaa laatikkoa.",
      "AutoVere on jo lanseerattu Yhdysvalloissa ja Kanadassa Euroopan lisäksi",
      "Haluan, että se testataan oikeassa maailmassa.",
      "Se on antaa sinun testata sitä itse.",
    ],
  },
  report: {
    eyebrow: "Challenge-raportti",
    title: "Matkasi. Tuloksesi.",
    body: "Kun matka on suoritettu, saat ammattimaisen Challenge-tuloksen, johon voit viitata, jonka voit julkaista tai jonka perusteella voit haastaa meidät.",
    contents: [
      "Reitti",
      "Ajoneuvo",
      "Käyttövoima",
      "AutoVere-laskelma",
      "Todellinen matkakustannus",
      "Ero",
      "Sähköautovertailu",
      "Päivämäärä",
      "Challenge-tunnus",
    ],
    future: "Suunnitteilla: pysyvä verkkotulos, jaettava linkki ja PDF-raportti.",
    cta: "Katso tämä matka AutoVeressa",
    ctaNote:
      "Challengen jälkeen matka ja sen parametrit voidaan avata uudelleen tavallisessa AutoVere-tuotteessa, joten voit jatkaa sen tutkimista.",
  },
  register: {
    eyebrow: "Pääsy autotoimittajille",
    title: "Hae pääsyä AutoVere Challengeen",
    body: "Oletko osa autotoimittajakuntaa? Haluaisimme mielellämme, että testaat AutoVerea itse. Hae Challenge-pääsyä — kun hakemuksesi on hyväksytty, käytät AutoVerea Pro-käyttäjänä koko testijakson ajan.",
    fields: {
      name: "Koko nimi",
      email: "Työsähköposti",
      outlet: "Julkaisu tai kanava",
      role: "Rooli",
      country: "Maa",
      message: "Matka ja auto, joita haluaisit testata",
    },
    placeholders: {
      name: "Kaisa Virtanen",
      email: "kaisa@julkaisu.fi",
      outlet: "Julkaisu, verkkosivu tai kanava",
      role: "Autotoimittaja, arvostelija, päätoimittaja…",
      country: "Suomi",
      message: "Valinnainen — kerro, mitä aiot testata",
    },
    submit: "Hae Challenge-pääsyä",
    note: "Nopea vahvistusvaihe varmistaa, että Challenge-pääsy on varattu aktiivisesti työskenteleville toimittajille. Kun hakemuksesi on hyväksytty, tilisi päivitetään Pro-tasolle testijakson ajaksi — ei erillistä lehdistötyökalua, ei rajoituksia.",
    successTitle: "Kiitos — olemme vastaanottaneet hakemuksesi.",
    successBody:
      "Challenge-pääsyä otetaan käyttöön vähitellen. Tietosi tallennetaan toistaiseksi vain tähän selaimeen, ja otamme sinuun henkilökohtaisesti yhteyttä heti, kun vahvistus avautuu.",
  },
  finalCta: {
    title: "Valmiina panemaan AutoVeren koetteelle?",
    body: "Valitse matka. Valitse autosi. Aja se. Vertaile tulosta.",
    primary: "Liity mukaan AutoVere Challengeen",
    secondary: "Tutustu AutoVereen",
  },
  languageLabel: "Challenge omalla kielelläsi",
};

const US: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — Road-Test AutoVere Yourself",
    description:
      "Test AutoVere on real road trips, with real cars and real-world costs. We're inviting automotive journalists to run the numbers, drive it, and compare.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Road-test AutoVere yourself.",
    lede: "Pick the car you actually drive. Pick the trip you want to test. Run the numbers in the real AutoVere, drive it, then compare our figures to what you actually spent.",
    statement: ["Real cars.", "Real trips.", "Real costs."],
    primaryCta: "Apply for Challenge Access",
    secondaryCta: "Explore AutoVere",
    imageCredit: "Photo credit: Unsplash",
  },
  invitation: {
    eyebrow: "A Personal Invitation to the Automotive Press",
    title: "We're inviting you to road-test AutoVere yourself.",
    paragraphs: [
      "If you cover cars for a living, you already know how rarely a trip costs what a calculator says it will. Tolls, toll passes, ferries, gas and charging stack up quietly, state by state and country by country — and that's exactly what AutoVere is built to get right.",
      "We're not going to ask you to just take our word for it.",
      "We'd rather hand you the keys: pick a real trip, pick the car sitting in your driveway, use AutoVere as a Pro user, drive the route, and hold our numbers up against your receipts.",
      "If we're right, that's a story worth telling. If we're off, we want to know about it — we'd rather hear it from you than never hear it at all.",
    ],
    signature: "Kjell Mersland — Founder, AutoVere · KM Tech Labs",
  },
  steps: {
    eyebrow: "How the Challenge Works",
    title: "Six simple steps, from sign-up to results.",
    intro:
      "None of this is a demo environment. From step five on, you're using the exact same AutoVere every other traveler uses.",
    items: [
      { number: "01", title: "Sign Up", body: "Sign up as a member of the automotive press." },
      {
        number: "02",
        title: "Get Verified",
        body: "AutoVere reviews your request and activates your Challenge access.",
      },
      {
        number: "03",
        title: "Pick Your Trip",
        body: "Choose one of AutoVere's suggested Challenge routes, or set up a trip of your own.",
      },
      {
        number: "04",
        title: "Pick Your Car",
        body: "Select the vehicle you're actually testing — gas, diesel, or electric.",
      },
      {
        number: "05",
        title: "Run the Numbers & Drive",
        body: "Use the regular AutoVere experience as a Pro user. Run the numbers, then drive it for real.",
      },
      {
        number: "06",
        title: "Compare",
        body: "Enter your actual trip costs and compare them to the AutoVere estimate.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "One Product, Not a Press Demo",
    title: "Your Challenge runs inside the real AutoVere — not a separate press build.",
    body: "AutoVere Challenge is the front door and the whole testing setup — not a second, dumbed-down calculator built just for journalists. There's no limited press version, no curated sandbox, and no separate numbers.",
    flow: [
      "Challenge Landing Page",
      "Journalist Sign-Up",
      "AutoVere Verification",
      "Challenge Pro Access",
      "The Regular AutoVere Product",
      "Your Challenge Results",
    ],
    footnote: "The math you're testing is the same math everyone else gets.",
  },
  freedom: {
    eyebrow: "Your Test, Your Rules",
    title: "Pick the trip you want to test.",
    lines: [
      "Use one of our suggested routes — or pick your own.",
      "Drive the car you actually own.",
    ],
    body: "There's no fixed test to pass, no scripted route, and no approved car list. The Challenge is yours to design — we just ask that you publish what you find.",
    items: [
      { title: "Any Trip", body: "A suggested Challenge route, or the trip you were taking anyway." },
      { title: "Any Car", body: "The car in your test fleet or sitting in your own driveway — gas, diesel, or electric." },
      { title: "Full Pro Access", body: "The complete AutoVere product, no restrictions, for the length of your test." },
      { title: "Your Own Call", body: "Publish the result exactly as you find it. We don't review it first." },
    ],
  },
  journey: {
    eyebrow: "Pick Your Trip",
    title: "Drive a suggested route — or one that fits your test.",
    intro:
      "Two ways to run your Challenge. Both use the same engine, the same data sources, and the same state-by-state, country-by-country breakdown.",
    options: [
      {
        label: "Option 01",
        title: "A Suggested Challenge Route",
        body: "For each country, AutoVere lines up three suggested routes, covering different areas and different kinds of driving.",
        bullets: ["Short", "Medium", "Long"],
      },
      {
        label: "Option 02",
        title: "Test Your Own Trip",
        body: "Pick any real-world trip that fits your test — the drive you were already planning is often the most revealing. For example: Bergen–Trondheim, Warsaw–Kraków, Route 66 (Chicago–Santa Monica).",
        bullets: ["Your Route", "Your Schedule", "Your Conditions"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Pick Your Vehicle",
    title: "Test the car that's actually in your driveway.",
    intro:
      "Pick your powertrain, then choose the specific vehicle from AutoVere's existing vehicle database. No separate car list just for the Challenge.",
    items: [
      {
        label: "Gas",
        body: "Fuel economy, gas prices, and tolls — priced out along your route, state by state and country by country.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Blue coupe parked on a desert road at sunset",
      },
      {
        label: "Diesel",
        body: "Long-haul fuel economy, plus weight and axle classes where they apply.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "White SUV on a snowy forest road",
      },
      {
        label: "Electric",
        body: "Battery size, consumption, charging stops, and network pricing along the way.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Charging cable plugged into an EV",
      },
    ],
  },
  evCompare: {
    eyebrow: "Same Trip, Electric",
    title: "What would this trip have cost in an EV?",
    body: "Once you've run the numbers on your own trip, you can run the identical route in an EV and see what the figures say. Sometimes it's cheaper. Sometimes charging, tolls, and detours change the math. AutoVere shows you the numbers either way.",
    exampleLabel: "Illustrative example — not an actual AutoVere result",
    rows: [
      { label: "Your Car", sub: "Diesel", amountEur: 96.4 },
      { label: "Same Trip in an EV", sub: "Electric", amountEur: 68.2 },
    ],
    differenceLabel: "Potential Difference",
    differenceAmountEur: 28.2,
    caveat: "Example figures only — we're not claiming an EV is always cheaper.",
  },
  reality: {
    eyebrow: "Prediction vs. Reality",
    title: "The part most tools quietly skip.",
    body: "The Challenge compares what AutoVere estimated before you hit the road with what the trip actually cost once you got there. That comparison belongs to you — including the days it doesn't make us look good.",
    exampleLabel: "Illustrative example — not an actual AutoVere result",
    calculation: { label: "AutoVere Estimate", amountEur: 96.4 },
    actual: { label: "Actual Trip Cost", amountEur: 99.1 },
    difference: { label: "Difference", value: "+2.8%" },
    caveat: "We don't promise a specific accuracy percentage. The point is your own result.",
  },
  founder: {
    eyebrow: "The Man Behind AutoVere",
    title: "Why I Built AutoVere",
    opening:
      "It started with a simple question: Why is it still so hard to know what a road trip is actually going to cost?",
    paragraphs: [
      "I'm 74 years old. After more than 40 years in construction, I retired in 2020.",
      "A year later, instead of slowing down, I started building something completely different.",
      "I'd spent years driving across Europe. The more I traveled, the more I kept running into the same problem: planning a long trip usually meant hunting for information in a bunch of different places.",
      "Tolls. Toll passes. Ferries. Gas. EV charging. Different routes. Different countries. Different costs.",
      "I figured there had to be a better way.",
      "So I started building AutoVere.",
      "What started as a personal project has grown into something a lot bigger — and I'm not doing it alone. My son's part of this too.",
      "Together, we're building AutoVere around something that's always mattered to me: if it's worth doing, it's worth doing right.",
      "That means using real data, official sources, algorithms, and math to figure out the cost of your trip.",
      "Not guesswork. Not a black box.",
      "The goal is simple: give people a clearer picture of what a trip is probably going to cost before they leave the driveway — and help them make smarter calls on routes, cars, and travel.",
      "What started as one idea has grown way beyond Norway — and way beyond Europe.",
      "AutoVere's already up and running in the US and Canada, not just Europe — with the goal of becoming a global automotive intelligence platform for anyone who travels by road.",
    ],
    closing: [
      "But building something and believing in it isn't enough.",
      "I want it tested in the real world.",
      "That's why we created the AutoVere Challenge.",
      "I don't want automotive journalists just taking my word for it.",
      "Pick a real car. Pick a real trip. Run the numbers with AutoVere. Drive it. Then compare the result to what actually happened.",
      "No special demo. No script.",
      "Just AutoVere — and the road.",
      "If it holds up, we'll be proud of it.",
      "If it gets something wrong, we want to know.",
      "Because the best way to prove AutoVere works isn't to tell you it does.",
      "It's to let you test it yourself.",
    ],
    name: "Kjell Mersland, 74",
    role: "Founder, AutoVere",
    note: "Building AutoVere together with my son",
    alt: "Kjell Mersland, founder of AutoVere",
    emphasis: [
      "I'm 74 years old.",
      "My son's part of this too.",
      "Not guesswork. Not a black box.",
      "AutoVere's already up and running in the US and Canada, not just Europe",
      "I want it tested in the real world.",
      "It's to let you test it yourself.",
    ],
  },
  report: {
    eyebrow: "Challenge Report",
    title: "Your Trip. Your Result.",
    body: "Once the trip's done, you get a professional Challenge result you can reference, publish, or challenge us on.",
    contents: [
      "Route",
      "Vehicle",
      "Powertrain",
      "AutoVere Estimate",
      "Actual Trip Cost",
      "Difference",
      "EV Comparison",
      "Date",
      "Challenge ID",
    ],
    future: "Coming soon: a permanent web result, a shareable link, and a PDF report.",
    cta: "View This Trip in AutoVere",
    ctaNote:
      "After a Challenge, the trip and its settings can be reopened right inside the regular AutoVere product, so you can keep exploring it.",
  },
  register: {
    eyebrow: "Automotive Press Access",
    title: "Apply for AutoVere Challenge Access",
    body: "Part of the automotive press? We'd love to have you road-test AutoVere yourself. Apply for Challenge access, and once you're approved, use AutoVere as a Pro user while you run your test.",
    fields: {
      name: "Full Name",
      email: "Work Email",
      outlet: "Publication or Channel",
      role: "Role",
      country: "Country",
      message: "The Trip and Car You'd Like to Test",
    },
    placeholders: {
      name: "Alex Rivera",
      email: "alex@publication.com",
      outlet: "Publication, website, or channel",
      role: "Automotive journalist, reviewer, editor…",
      country: "United States",
      message: "Optional — tell us what you're planning to test",
    },
    submit: "Apply for Challenge Access",
    note: "A quick verification step keeps Challenge access limited to working journalists. Once you're approved, your account gets upgraded to Pro for the test — no separate press tool, no restrictions.",
    successTitle: "Thanks — we've got your application.",
    successBody:
      "Challenge access is rolling out gradually. Your details are only stored in this browser for now, and we'll follow up with you personally as soon as verification opens up.",
  },
  finalCta: {
    title: "Ready to road-test AutoVere?",
    body: "Pick a trip. Pick your car. Drive it. Compare the results.",
    primary: "Join the AutoVere Challenge",
    secondary: "Explore AutoVere",
  },
  languageLabel: "Challenge in Your Language",
};

const DE: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — Stellen Sie AutoVere auf die Probe",
    description:
      "Testen Sie AutoVere auf echten Reisen, mit echten Autos und echten Kosten. Wir laden die Automobilpresse ein, zu rechnen, zu fahren und zu vergleichen.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Stellen Sie AutoVere auf die Probe.",
    lede: "Wählen Sie das Auto, das Sie wirklich fahren. Wählen Sie die Reise, die Sie testen möchten. Berechnen Sie sie im echten AutoVere, fahren Sie sie — und vergleichen Sie unsere Zahlen mit dem, was Sie tatsächlich ausgegeben haben.",
    statement: ["Echte Autos.", "Echte Reisen.", "Echte Kosten."],
    primaryCta: "Challenge-Zugang beantragen",
    secondaryCta: "AutoVere entdecken",
    imageCredit: "Foto: Unsplash",
  },
  invitation: {
    eyebrow: "Eine persönliche Einladung an die Automobilpresse",
    title: "Wir laden Sie ein, AutoVere selbst zu testen.",
    paragraphs: [
      "Wenn Sie über Autos schreiben, wissen Sie es längst: Eine Reise kostet selten das, was ein Rechner vorher versprochen hat. Maut, Vignetten, Fähren, Kraftstoff und Laden summieren sich still, Land für Land — und genau das soll AutoVere richtig berechnen.",
      "Wir bitten Sie nicht, uns einfach blind zu vertrauen.",
      "Wir geben Ihnen lieber die Schlüssel: Wählen Sie eine echte Reise, wählen Sie das Auto, das in Ihrer Einfahrt steht, nutzen Sie AutoVere als Pro-Nutzer, fahren Sie die Route — und halten Sie unsere Berechnung gegen Ihre Quittungen.",
      "Liegen wir richtig, ist das eine Geschichte wert, erzählt zu werden. Liegen wir falsch, wollen wir es wissen — und hören es lieber von Ihnen, als es nie zu erfahren.",
    ],
    signature: "Kjell Mersland — Gründer von AutoVere · KM Tech Labs",
  },
  steps: {
    eyebrow: "So funktioniert die Challenge",
    title: "Sechs klare Schritte, von der Einladung bis zum Ergebnis.",
    intro:
      "Nichts davon ist eine Testumgebung. Ab Schritt fünf nutzen Sie genau das AutoVere, das auch alle anderen Reisenden nutzen.",
    items: [
      { number: "01", title: "Registrieren", body: "Melden Sie sich als Teil der Automobilpresse an." },
      {
        number: "02",
        title: "Verifizierung",
        body: "AutoVere prüft Ihre Anfrage und schaltet Ihren Challenge-Zugang frei.",
      },
      {
        number: "03",
        title: "Reise wählen",
        body: "Wählen Sie eine der von AutoVere vorgeschlagenen Challenge-Routen oder stellen Sie Ihre eigene Reise zusammen.",
      },
      {
        number: "04",
        title: "Auto wählen",
        body: "Wählen Sie das Fahrzeug, das Sie tatsächlich testen — Benzin, Diesel oder Elektro.",
      },
      {
        number: "05",
        title: "Berechnen & fahren",
        body: "Nutzen Sie die normale AutoVere-Erfahrung als Pro-Nutzer. Berechnen Sie die Reise, und fahren Sie sie anschließend wirklich.",
      },
      {
        number: "06",
        title: "Vergleichen",
        body: "Geben Sie ein, was die Reise tatsächlich gekostet hat, und vergleichen Sie es mit der AutoVere-Berechnung.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Ein Produkt, kein Pressedemo",
    title: "Ihre Challenge findet innerhalb des echten AutoVere statt.",
    body: "AutoVere Challenge ist der Zugang und das gesamte Testkonzept — kein zweiter, vereinfachter Rechner, der speziell für Journalisten gebaut wurde. Es gibt keine eingeschränkte Presseversion, keine vorbereitete Sandbox und keine eigenen Zahlen.",
    flow: [
      "Challenge-Startseite",
      "Journalistenregistrierung",
      "AutoVere-Verifizierung",
      "Challenge-Pro-Zugang",
      "Das normale AutoVere-Produkt",
      "Ihr Challenge-Ergebnis",
    ],
    footnote: "Die Berechnung, die Sie testen, ist dieselbe Berechnung, die auch alle anderen erhalten.",
  },
  freedom: {
    eyebrow: "Ihr Test, Ihre Bedingungen",
    title: "Wählen Sie die Reise, die Sie testen möchten.",
    lines: [
      "Nutzen Sie eine unserer vorgeschlagenen Routen — oder wählen Sie Ihre eigene.",
      "Fahren Sie das Auto, das Sie tatsächlich besitzen.",
    ],
    body: "Es gibt keinen festen Test zu bestehen, keine vorgeschriebene Route und keine genehmigte Autoliste. Die Challenge gestalten Sie selbst — wir bitten nur darum, dass Sie veröffentlichen, was Sie herausfinden.",
    items: [
      { title: "Jede beliebige Reise", body: "Eine vorgeschlagene Challenge-Route oder die Reise, die Sie ohnehin gemacht hätten." },
      { title: "Jedes beliebige Auto", body: "Das Auto in Ihrer Testflotte oder in Ihrer eigenen Einfahrt — Benzin, Diesel oder Elektro." },
      { title: "Voller Pro-Zugang", body: "Das komplette AutoVere-Produkt, ohne Einschränkungen, für die gesamte Testdauer." },
      { title: "Ihre eigene Schlussfolgerung", body: "Veröffentlichen Sie das Ergebnis genau so, wie Sie es vorfinden. Wir lesen es vorher nicht gegen." },
    ],
  },
  journey: {
    eyebrow: "Reise wählen",
    title: "Fahren Sie eine vorgeschlagene Route — oder eine, die zu Ihrem Test passt.",
    intro:
      "Es gibt zwei Wege, Ihre Challenge durchzuführen. Beide nutzen dieselbe Berechnungslogik, dieselben Datenquellen und dieselbe länderweise Aufschlüsselung.",
    options: [
      {
        label: "Option 01",
        title: "Eine vorgeschlagene Challenge-Route",
        body: "Für jedes Land bietet AutoVere drei vorgeschlagene Routen an, die unterschiedliche Regionen und Fahrarten abdecken.",
        bullets: ["Kurz", "Mittellang", "Lang"],
      },
      {
        label: "Option 02",
        title: "Testen Sie Ihre eigene Reise",
        body: "Wählen Sie eine realistische Reise, die zu Ihrem Test passt — die Fahrt, die Sie ohnehin gemacht hätten, ist oft die aufschlussreichste. Zum Beispiel: Berlin–München, Warschau–Krakau, Los Angeles–San Diego.",
        bullets: ["Ihre Route", "Ihr Zeitplan", "Ihre Fahrbedingungen"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Fahrzeug wählen",
    title: "Testen Sie das Auto, das tatsächlich in Ihrer Einfahrt steht.",
    intro:
      "Wählen Sie die Antriebsart, und wählen Sie anschließend das konkrete Fahrzeug aus den vorhandenen AutoVere-Fahrzeugdaten. Keine eigene Autoliste für die Challenge.",
    items: [
      {
        label: "Benzin",
        body: "Verbrauch, Kraftstoffpreise und Maut, Land für Land entlang Ihrer Route berechnet.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Blaues Coupé bei Sonnenuntergang auf einer Wüstenstraße geparkt",
      },
      {
        label: "Diesel",
        body: "Verbrauch auf langen Strecken sowie Gewichts- und Achsklassen, wo Mautbetreiber sie anwenden.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "Weißer SUV auf einer verschneiten Waldstraße",
      },
      {
        label: "Elektro",
        body: "Batteriegröße, Verbrauch, Ladestopps und Netzpreise entlang der Route.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Ladekabel an ein Elektroauto angeschlossen",
      },
    ],
  },
  evCompare: {
    eyebrow: "Dieselbe Reise mit einem Elektroauto",
    title: "Was hätte diese Reise mit einem Elektroauto gekostet?",
    body: "Nachdem Sie Ihre eigene Reise berechnet haben, können Sie dieselbe Route mit einem Elektroauto fahren und sehen, was die Zahlen sagen. Manchmal wird es günstiger. Manchmal verändern Laden, Maut und Umwege das Bild. AutoVere zeigt die Berechnung so oder so.",
    exampleLabel: "Anschauliches Beispiel — kein reales AutoVere-Ergebnis",
    rows: [
      { label: "Ihr Auto", sub: "Diesel", amountEur: 96.4 },
      { label: "Dieselbe Reise mit Elektroauto", sub: "Elektro", amountEur: 68.2 },
    ],
    differenceLabel: "Möglicher Unterschied",
    differenceAmountEur: 28.2,
    caveat: "Nur Beispielwerte. Wir behaupten nicht, dass ein Elektroauto immer günstiger ist.",
  },
  reality: {
    eyebrow: "Schätzung trifft Wirklichkeit",
    title: "Der Teil, den die meisten Tools still umgehen.",
    body: "Die Challenge vergleicht, was AutoVere vor der Abfahrt berechnet hat, mit dem, was die Reise bei Ankunft tatsächlich gekostet hat. Dieser Vergleich gehört Ihnen — auch an den Tagen, an denen er uns nicht schmeichelt.",
    exampleLabel: "Anschauliches Beispiel — kein reales AutoVere-Ergebnis",
    calculation: { label: "AutoVere-Berechnung", amountEur: 96.4 },
    actual: { label: "Tatsächliche Reisekosten", amountEur: 99.1 },
    difference: { label: "Unterschied", value: "+2,8 %" },
    caveat: "Wir versprechen keine bestimmte prozentuale Genauigkeit. Der Punkt ist Ihr eigenes Ergebnis.",
  },
  founder: {
    eyebrow: "Der Mann hinter AutoVere",
    title: "Warum ich AutoVere gebaut habe",
    opening:
      "Alles begann mit einer einfachen Frage: Warum ist es immer noch so schwer zu wissen, was eine Reise mit dem Auto tatsächlich kosten wird?",
    paragraphs: [
      "Ich bin 74 Jahre alt. Nach mehr als 40 Jahren in der Baubranche bin ich 2020 in Rente gegangen.",
      "Ein Jahr später begann ich, statt kürzerzutreten, etwas völlig anderes aufzubauen.",
      "Ich war jahrelang mit dem Auto quer durch Europa gefahren. Je mehr ich reiste, desto klarer erkannte ich immer dasselbe Problem: Eine lange Reise zu planen bedeutete meist, Informationen an mehreren verschiedenen Stellen zu suchen.",
      "Maut. Vignetten. Fähren. Kraftstoff. Laden. Verschiedene Routen. Verschiedene Länder. Verschiedene Kosten.",
      "Ich dachte, es müsse einen besseren Weg geben.",
      "Also begann ich, AutoVere zu bauen.",
      "Was als persönliche Idee begann, ist zu einem viel größeren Projekt gewachsen — und ich mache das nicht allein. Auch mein Sohn ist Teil dieser Reise.",
      "Gemeinsam bauen wir AutoVere nach einem Grundsatz, der mir immer wichtig war: Was es wert ist, getan zu werden, ist es wert, richtig getan zu werden.",
      "Das bedeutet, dass wir echte Daten, offizielle Quellen, Algorithmen und Mathematik verwenden, um die Reise zu berechnen.",
      "Keine Vermutungen. Keine Black Box.",
      "Das Ziel ist einfach: Menschen ein klareres Bild davon geben, was eine Reise voraussichtlich kosten wird, bevor sie von zu Hause losfahren — und ihnen helfen, bessere Entscheidungen über Route, Auto und Reiseweise zu treffen.",
      "Was als eine Idee begann, ist inzwischen weit über Norwegen und Europa hinausgewachsen.",
      "AutoVere ist neben Europa bereits in den USA und Kanada gestartet, mit dem Ziel, eine globale Reiseintelligenzplattform für alle zu werden, die auf der Straße unterwegs sind.",
    ],
    closing: [
      "Aber etwas zu bauen und daran zu glauben, reicht nicht.",
      "Ich möchte, dass es in der echten Welt getestet wird.",
      "Deshalb haben wir die AutoVere Challenge geschaffen.",
      "Ich möchte nicht, dass die Automobilpresse mir einfach aufs Wort glaubt.",
      "Wählen Sie ein echtes Auto. Wählen Sie eine echte Reise. Berechnen Sie sie mit AutoVere. Fahren Sie sie. Vergleichen Sie dann das Ergebnis mit dem, was tatsächlich passiert ist.",
      "Keine besondere Vorführung. Kein vorbereitetes Ergebnis.",
      "Nur AutoVere — und die Straße.",
      "Wenn es sich bewährt, sind wir stolz darauf.",
      "Wenn etwas nicht stimmt, wollen wir es wissen.",
      "Denn der beste Weg, zu beweisen, dass AutoVere funktioniert, ist nicht, es zu behaupten.",
      "Es ist, Sie es selbst testen zu lassen.",
    ],
    name: "Kjell Mersland, 74",
    role: "Gründer von AutoVere",
    note: "Ich baue AutoVere gemeinsam mit meinem Sohn",
    alt: "Kjell Mersland, Gründer von AutoVere",
    emphasis: [
      "Ich bin 74 Jahre alt.",
      "Auch mein Sohn ist Teil dieser Reise.",
      "Keine Vermutungen. Keine Black Box.",
      "AutoVere ist neben Europa bereits in den USA und Kanada gestartet",
      "Ich möchte, dass es in der echten Welt getestet wird.",
      "Es ist, Sie es selbst testen zu lassen.",
    ],
  },
  report: {
    eyebrow: "Challenge-Bericht",
    title: "Ihre Reise. Ihr Ergebnis.",
    body: "Sobald die Reise abgeschlossen ist, erhalten Sie ein professionelles Challenge-Ergebnis, auf das Sie sich berufen, das Sie veröffentlichen oder mit dem Sie uns herausfordern können.",
    contents: [
      "Route",
      "Fahrzeug",
      "Antriebsart",
      "AutoVere-Berechnung",
      "Tatsächliche Reisekosten",
      "Unterschied",
      "Elektroauto-Vergleich",
      "Datum",
      "Challenge-ID",
    ],
    future: "Geplant: ein dauerhaftes Web-Ergebnis, ein teilbarer Link und ein PDF-Bericht.",
    cta: "Diese Reise in AutoVere ansehen",
    ctaNote:
      "Nach einer Challenge können die Reise und ihre Parameter erneut im normalen AutoVere-Produkt geöffnet werden, sodass Sie sie weiter erkunden können.",
  },
  register: {
    eyebrow: "Zugang für die Automobilpresse",
    title: "Zugang zur AutoVere Challenge beantragen",
    body: "Gehören Sie zur Automobilpresse? Wir würden uns freuen, wenn Sie AutoVere selbst testen. Beantragen Sie den Challenge-Zugang, und nutzen Sie AutoVere nach Ihrer Freischaltung als Pro-Nutzer für die Dauer Ihres Tests.",
    fields: {
      name: "Vollständiger Name",
      email: "Geschäftliche E-Mail-Adresse",
      outlet: "Publikation oder Kanal",
      role: "Rolle",
      country: "Land",
      message: "Die Reise und das Auto, die Sie testen möchten",
    },
    placeholders: {
      name: "Anna Weber",
      email: "anna@publikation.de",
      outlet: "Publikation, Website oder Kanal",
      role: "Automobiljournalist, Tester, Redakteur…",
      country: "Deutschland",
      message: "Optional — erzählen Sie uns, was Sie testen möchten",
    },
    submit: "Challenge-Zugang beantragen",
    note: "Ein kurzer Verifizierungsschritt stellt sicher, dass der Challenge-Zugang aktiven Journalisten vorbehalten bleibt. Nach der Freischaltung wird Ihr Konto für die Testdauer auf Pro hochgestuft — kein separates Presse-Tool, keine Einschränkungen.",
    successTitle: "Danke — wir haben Ihre Anfrage erhalten.",
    successBody:
      "Der Challenge-Zugang wird schrittweise freigeschaltet. Ihre Angaben werden vorerst nur in diesem Browser gespeichert, und wir melden uns persönlich bei Ihnen, sobald die Verifizierung startet.",
  },
  finalCta: {
    title: "Bereit, AutoVere auf die Probe zu stellen?",
    body: "Wählen Sie eine Reise. Wählen Sie Ihr Auto. Fahren Sie es. Vergleichen Sie das Ergebnis.",
    primary: "An der AutoVere Challenge teilnehmen",
    secondary: "AutoVere entdecken",
  },
  languageLabel: "Challenge in Ihrer Sprache",
};

const NL: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — zet AutoVere op de proef",
    description:
      "Test AutoVere op echte reizen, met echte auto's en reële kosten. We nodigen de autopers uit om te rekenen, te rijden en te vergelijken.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Zet AutoVere op de proef.",
    lede: "Kies de auto die je echt rijdt. Kies de reis die je wilt testen. Bereken alles in de echte AutoVere, rij de route — en vergelijk onze cijfers met wat je daadwerkelijk hebt uitgegeven.",
    statement: ["Echte auto's.", "Echte reizen.", "Echte kosten."],
    primaryCta: "Vraag Challenge-toegang aan",
    secondaryCta: "Ontdek AutoVere",
    imageCredit: "Foto: Unsplash",
  },
  invitation: {
    eyebrow: "Een persoonlijke uitnodiging aan de autopers",
    title: "We nodigen je uit om AutoVere zelf te testen.",
    paragraphs: [
      "Als je over auto's schrijft, weet je het al: een reis kost zelden wat een rekentool vooraf beloofde. Tol, vignetten, veerboten, brandstof en laden stapelen zich stilletjes op, land voor land — en precies dat is waar AutoVere voor gebouwd is.",
      "We vragen je niet om ons zomaar blindelings te vertrouwen.",
      "We geven je liever de sleutels: kies een echte reis, kies de auto die op je oprit staat, gebruik AutoVere als Pro-gebruiker, rijd de route — en leg onze berekening naast je bonnetjes.",
      "Hebben we gelijk, dan is dat een verhaal waard om te vertellen. Zitten we ernaast, dan willen we het weten — we horen het liever van jou dan dat het nooit aan het licht komt.",
    ],
    signature: "Kjell Mersland — oprichter van AutoVere · KM Tech Labs",
  },
  steps: {
    eyebrow: "Zo werkt de Challenge",
    title: "Zes heldere stappen, van uitnodiging tot resultaat.",
    intro:
      "Niets hiervan is een demo-omgeving. Vanaf stap vijf gebruik je exact dezelfde AutoVere die elke andere reiziger gebruikt.",
    items: [
      { number: "01", title: "Registreren", body: "Meld je aan als onderdeel van de autopers." },
      {
        number: "02",
        title: "Verificatie",
        body: "AutoVere beoordeelt je aanvraag en activeert je Challenge-toegang.",
      },
      {
        number: "03",
        title: "Reis kiezen",
        body: "Kies een van de door AutoVere voorgestelde Challenge-routes, of stel je eigen reis samen.",
      },
      {
        number: "04",
        title: "Auto kiezen",
        body: "Kies het voertuig dat je daadwerkelijk test — benzine, diesel of elektrisch.",
      },
      {
        number: "05",
        title: "Berekenen & rijden",
        body: "Gebruik de gewone AutoVere-ervaring als Pro-gebruiker. Bereken de reis, en rijd hem daarna echt.",
      },
      {
        number: "06",
        title: "Vergelijken",
        body: "Vul in wat de reis daadwerkelijk heeft gekost, en vergelijk dat met de AutoVere-berekening.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Eén product, geen persdemo",
    title: "Je Challenge speelt zich af binnen de echte AutoVere.",
    body: "AutoVere Challenge is de toegangspoort en het complete testconcept — geen tweede, versimpelde rekentool speciaal gebouwd voor journalisten. Er is geen beperkte persversie, geen voorbereide sandbox en geen eigen cijfers.",
    flow: [
      "Challenge-startpagina",
      "Registratie voor journalisten",
      "AutoVere-verificatie",
      "Challenge Pro-toegang",
      "Het gewone AutoVere-product",
      "Jouw Challenge-resultaat",
    ],
    footnote: "De berekening die je test, is dezelfde berekening die iedereen krijgt.",
  },
  freedom: {
    eyebrow: "Jouw test, jouw voorwaarden",
    title: "Kies de reis die je wilt testen.",
    lines: [
      "Gebruik een van onze voorgestelde routes — of kies je eigen.",
      "Rijd de auto die je daadwerkelijk bezit.",
    ],
    body: "Er is geen vaste test om te doorstaan, geen voorgeschreven route en geen goedgekeurde autolijst. Jij bepaalt hoe de Challenge eruitziet — we vragen alleen dat je publiceert wat je vindt.",
    items: [
      { title: "Elke reis", body: "Een voorgestelde Challenge-route, of de reis die je toch al zou maken." },
      { title: "Elke auto", body: "De auto in je testvloot of op je eigen oprit — benzine, diesel of elektrisch." },
      { title: "Volledige Pro-toegang", body: "Het complete AutoVere-product, zonder beperkingen, voor de hele testperiode." },
      { title: "Jouw eigen conclusie", body: "Publiceer het resultaat precies zoals je het aantreft. Wij lezen het van tevoren niet na." },
    ],
  },
  journey: {
    eyebrow: "Reis kiezen",
    title: "Rijd een voorgestelde route — of een die bij jouw test past.",
    intro:
      "Er zijn twee manieren om je Challenge uit te voeren. Beide gebruiken dezelfde rekenmethode, dezelfde databronnen en dezelfde uitsplitsing per land.",
    options: [
      {
        label: "Optie 01",
        title: "Een voorgestelde Challenge-route",
        body: "Voor elk land biedt AutoVere drie voorgestelde routes, die verschillende regio's en soorten rijden dekken.",
        bullets: ["Kort", "Middellang", "Lang"],
      },
      {
        label: "Optie 02",
        title: "Test je eigen reis",
        body: "Kies een realistische reis die bij jouw test past — de rit die je toch al zou maken, is vaak het meest onthullend. Bijvoorbeeld: Amsterdam–Nice, Warschau–Krakau, Los Angeles–San Diego.",
        bullets: ["Jouw route", "Jouw planning", "Jouw rijomstandigheden"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Voertuig kiezen",
    title: "Test de auto die daadwerkelijk op je oprit staat.",
    intro:
      "Kies de aandrijving, en kies vervolgens de specifieke auto uit de bestaande AutoVere-voertuiggegevens. Geen aparte autolijst voor de Challenge.",
    items: [
      {
        label: "Benzine",
        body: "Verbruik, brandstofprijzen en tol berekend per land langs je route.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Blauwe coupé geparkeerd op een woestijnweg bij zonsondergang",
      },
      {
        label: "Diesel",
        body: "Brandstofverbruik op lange afstanden, plus gewichts- en asklassen waar tolexploitanten die toepassen.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "Witte SUV op een besneeuwde bosweg",
      },
      {
        label: "Elektrisch",
        body: "Batterijcapaciteit, verbruik, laadstops en netwerkprijzen langs de route.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Laadkabel aangesloten op een elektrische auto",
      },
    ],
  },
  evCompare: {
    eyebrow: "Dezelfde reis met een elektrische auto",
    title: "Wat had deze reis met een elektrische auto gekost?",
    body: "Zodra je je eigen reis hebt berekend, kun je dezelfde route rijden met een elektrische auto en zien wat de cijfers zeggen. Soms is het goedkoper. Soms veranderen laden, tol en omwegen het beeld. AutoVere laat de cijfers hoe dan ook zien.",
    exampleLabel: "Illustratief voorbeeld — geen echt AutoVere-resultaat",
    rows: [
      { label: "Jouw auto", sub: "Diesel", amountEur: 96.4 },
      { label: "Dezelfde reis met elektrische auto", sub: "Elektrisch", amountEur: 68.2 },
    ],
    differenceLabel: "Mogelijk verschil",
    differenceAmountEur: 28.2,
    caveat: "Alleen voorbeeldcijfers. We beweren niet dat een elektrische auto altijd goedkoper is.",
  },
  reality: {
    eyebrow: "Schatting versus werkelijkheid",
    title: "Het deel dat de meeste tools stilletjes vermijden.",
    body: "De Challenge vergelijkt wat AutoVere vooraf berekende met wat de reis daadwerkelijk heeft gekost bij aankomst. Die vergelijking is van jou — ook op de dagen dat die ons niet vleit.",
    exampleLabel: "Illustratief voorbeeld — geen echt AutoVere-resultaat",
    calculation: { label: "AutoVere-berekening", amountEur: 96.4 },
    actual: { label: "Werkelijke reiskosten", amountEur: 99.1 },
    difference: { label: "Verschil", value: "+2,8%" },
    caveat: "We beloven geen exact nauwkeurigheidspercentage. Het gaat om jouw eigen resultaat.",
  },
  founder: {
    eyebrow: "De man achter AutoVere",
    title: "Waarom ik AutoVere heb gebouwd",
    opening:
      "Het begon met een simpele vraag: waarom is het nog steeds zo moeilijk om te weten wat een reis met de auto daadwerkelijk gaat kosten?",
    paragraphs: [
      "Ik ben 74 jaar. Na meer dan 40 jaar in de bouw ging ik in 2020 met pensioen.",
      "Een jaar later begon ik, in plaats van rustiger aan te doen, iets compleet anders op te bouwen.",
      "Ik had jarenlang kris-kras door Europa gereden. Hoe meer ik reisde, hoe duidelijker ik hetzelfde probleem zag: een lange reis plannen betekende meestal op allerlei plekken naar informatie zoeken.",
      "Tol. Vignetten. Veerboten. Brandstof. Laden. Andere routes. Andere landen. Andere kosten.",
      "Ik dacht dat er een betere manier moest zijn.",
      "Dus begon ik AutoVere te bouwen.",
      "Wat begon als een persoonlijk idee, is uitgegroeid tot een veel groter project. En ik doe het niet alleen — mijn zoon is ook onderdeel van deze reis.",
      "Samen bouwen we AutoVere op een principe dat voor mij altijd belangrijk is geweest: als iets de moeite waard is om te doen, is het de moeite waard om het goed te doen.",
      "Dat betekent dat we echte data, officiële bronnen, algoritmes en wiskunde gebruiken om de reis te berekenen.",
      "Geen giswerk. Geen zwarte doos.",
      "Het doel is simpel: mensen een duidelijker beeld geven van wat een reis waarschijnlijk gaat kosten voordat ze van huis vertrekken — en hen helpen betere keuzes te maken over route, auto en manier van reizen.",
      "Wat als één idee begon, is inmiddels ver voorbij Noorwegen en Europa gegroeid.",
      "AutoVere is naast Europa inmiddels ook gelanceerd in de VS en Canada, met de ambitie om een wereldwijd platform voor reisintelligentie te worden voor iedereen die de weg op gaat.",
    ],
    closing: [
      "Maar iets bouwen en erin geloven is niet genoeg.",
      "Ik wil dat het in de echte wereld wordt getest.",
      "Daarom hebben we de AutoVere Challenge in het leven geroepen.",
      "Ik wil niet dat de autopers mij zomaar op mijn woord gelooft.",
      "Kies een echte auto. Kies een echte reis. Bereken hem met AutoVere. Rijd hem. Vergelijk daarna het resultaat met wat er werkelijk is gebeurd.",
      "Geen speciale vertoning. Geen voorbereid resultaat.",
      "Alleen AutoVere — en de weg.",
      "Als het goed werkt, zijn we daar trots op.",
      "Als er iets misgaat, willen we het weten.",
      "Want de beste manier om te bewijzen dat AutoVere werkt, is niet om het te beweren.",
      "Het is om je het zelf te laten testen.",
    ],
    name: "Kjell Mersland, 74",
    role: "Oprichter van AutoVere",
    note: "Ik bouw AutoVere samen met mijn zoon",
    alt: "Kjell Mersland, oprichter van AutoVere",
    emphasis: [
      "Ik ben 74 jaar.",
      "mijn zoon is ook onderdeel van deze reis.",
      "Geen giswerk. Geen zwarte doos.",
      "AutoVere is naast Europa inmiddels ook gelanceerd in de VS en Canada",
      "Ik wil dat het in de echte wereld wordt getest.",
      "Het is om je het zelf te laten testen.",
    ],
  },
  report: {
    eyebrow: "Challenge-rapport",
    title: "Jouw reis. Jouw resultaat.",
    body: "Zodra de reis is afgerond, ontvang je een professioneel Challenge-resultaat waarnaar je kunt verwijzen, dat je kunt publiceren of waarmee je ons kunt uitdagen.",
    contents: [
      "Route",
      "Voertuig",
      "Aandrijving",
      "AutoVere-berekening",
      "Werkelijke reiskosten",
      "Verschil",
      "Vergelijking met elektrische auto",
      "Datum",
      "Challenge-ID",
    ],
    future: "Gepland: een permanent webresultaat, een deelbare link en een pdf-rapport.",
    cta: "Bekijk deze reis in AutoVere",
    ctaNote:
      "Na een Challenge kunnen de reis en de bijbehorende instellingen opnieuw worden geopend in het gewone AutoVere-product, zodat je verder kunt blijven verkennen.",
  },
  register: {
    eyebrow: "Toegang voor de autopers",
    title: "Vraag toegang aan tot de AutoVere Challenge",
    body: "Maak je deel uit van de autopers? We zouden het geweldig vinden als je AutoVere zelf test. Vraag Challenge-toegang aan, en gebruik AutoVere na goedkeuring als Pro-gebruiker tijdens je test.",
    fields: {
      name: "Volledige naam",
      email: "Zakelijk e-mailadres",
      outlet: "Publicatie of kanaal",
      role: "Functie",
      country: "Land",
      message: "De reis en auto die je wilt testen",
    },
    placeholders: {
      name: "Sanne de Vries",
      email: "sanne@publicatie.nl",
      outlet: "Publicatie, website of kanaal",
      role: "Autojournalist, recensent, hoofdredacteur…",
      country: "Nederland",
      message: "Optioneel — vertel ons wat je van plan bent te testen",
    },
    submit: "Vraag Challenge-toegang aan",
    note: "Een korte verificatiestap zorgt ervoor dat Challenge-toegang voorbehouden blijft aan actief werkende journalisten. Na goedkeuring wordt je account voor de testperiode geüpgraded naar Pro — geen apart perstool, geen beperkingen.",
    successTitle: "Bedankt — we hebben je aanvraag ontvangen.",
    successBody:
      "Challenge-toegang wordt geleidelijk uitgerold. Je gegevens worden voorlopig alleen in deze browser bewaard, en we nemen persoonlijk contact met je op zodra de verificatie start.",
  },
  finalCta: {
    title: "Klaar om AutoVere op de proef te zetten?",
    body: "Kies een reis. Kies je auto. Rijd hem. Vergelijk het resultaat.",
    primary: "Doe mee aan de AutoVere Challenge",
    secondary: "Ontdek AutoVere",
  },
  languageLabel: "Challenge in jouw taal",
};

const FR: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — mettez AutoVere à l'épreuve",
    description:
      "Testez AutoVere sur de vrais trajets, avec de vraies voitures et des coûts réels. Nous invitons la presse automobile à calculer, rouler et comparer.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Mettez AutoVere à l'épreuve.",
    lede: "Choisissez la voiture que vous conduisez vraiment. Choisissez le trajet que vous voulez tester. Calculez-le dans le vrai AutoVere, roulez — et comparez nos chiffres à ce que vous avez réellement dépensé.",
    statement: ["De vraies voitures.", "De vrais trajets.", "Des coûts réels."],
    primaryCta: "Demander l'accès Challenge",
    secondaryCta: "Découvrir AutoVere",
    imageCredit: "Photo : Unsplash",
  },
  invitation: {
    eyebrow: "Une invitation personnelle à la presse automobile",
    title: "Nous vous invitons à tester AutoVere vous-même.",
    paragraphs: [
      "Si vous écrivez sur l'automobile, vous le savez déjà : un trajet coûte rarement ce qu'un calculateur avait promis à l'avance. Péages, vignettes, ferries, carburant et recharge s'additionnent discrètement, pays après pays — et c'est exactement ce qu'AutoVere est conçu pour calculer avec justesse.",
      "Nous ne vous demandons pas de nous croire simplement sur parole.",
      "Nous préférons vous donner les clés : choisissez un vrai trajet, choisissez la voiture garée devant chez vous, utilisez AutoVere en tant qu'utilisateur Pro, roulez l'itinéraire — et confrontez notre calcul à vos reçus.",
      "Si nous avons raison, c'est une histoire qui mérite d'être racontée. Si nous avons tort, nous voulons le savoir — et nous préférons l'apprendre de vous plutôt que de ne jamais l'apprendre.",
    ],
    signature: "Kjell Mersland — fondateur d'AutoVere · KM Tech Labs",
  },
  steps: {
    eyebrow: "Comment fonctionne le Challenge",
    title: "Six étapes claires, de l'invitation au résultat.",
    intro:
      "Rien de tout cela n'est un environnement de démonstration. À partir de l'étape cinq, vous utilisez exactement le même AutoVere que tous les autres voyageurs.",
    items: [
      { number: "01", title: "S'inscrire", body: "Inscrivez-vous en tant que membre de la presse automobile." },
      {
        number: "02",
        title: "Vérification",
        body: "AutoVere examine votre demande et active votre accès Challenge.",
      },
      {
        number: "03",
        title: "Choisir son trajet",
        body: "Choisissez l'un des itinéraires Challenge suggérés par AutoVere, ou composez votre propre trajet.",
      },
      {
        number: "04",
        title: "Choisir sa voiture",
        body: "Choisissez le véhicule que vous testez réellement — essence, diesel ou électrique.",
      },
      {
        number: "05",
        title: "Calculer et rouler",
        body: "Utilisez l'expérience AutoVere habituelle en tant qu'utilisateur Pro. Calculez le trajet, puis roulez-le pour de vrai.",
      },
      {
        number: "06",
        title: "Comparer",
        body: "Indiquez ce que le trajet a réellement coûté, et comparez-le au calcul d'AutoVere.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Un seul produit, pas une démo presse",
    title: "Votre Challenge se déroule à l'intérieur du vrai AutoVere.",
    body: "AutoVere Challenge est la porte d'entrée et le dispositif de test dans son ensemble — pas un second calculateur simplifié conçu spécialement pour les journalistes. Il n'existe aucune version presse limitée, aucun bac à sable préparé et aucun chiffre à part.",
    flow: [
      "Page d'accueil du Challenge",
      "Inscription des journalistes",
      "Vérification AutoVere",
      "Accès Challenge Pro",
      "Le produit AutoVere habituel",
      "Votre résultat Challenge",
    ],
    footnote: "Le calcul que vous testez est le même calcul que tout le monde reçoit.",
  },
  freedom: {
    eyebrow: "Votre test, vos règles",
    title: "Choisissez le trajet que vous voulez tester.",
    lines: [
      "Utilisez l'un de nos itinéraires suggérés — ou choisissez le vôtre.",
      "Roulez avec la voiture que vous possédez réellement.",
    ],
    body: "Il n'y a aucun test fixe à réussir, aucun itinéraire imposé et aucune liste de voitures approuvées. Le Challenge, c'est vous qui le façonnez — nous vous demandons seulement de publier ce que vous découvrez.",
    items: [
      { title: "N'importe quel trajet", body: "Un itinéraire Challenge suggéré, ou le trajet que vous alliez faire de toute façon." },
      { title: "N'importe quelle voiture", body: "La voiture de votre flotte de test ou celle garée devant chez vous — essence, diesel ou électrique." },
      { title: "Accès Pro complet", body: "Le produit AutoVere complet, sans restrictions, pendant toute la durée de votre test." },
      { title: "Votre propre conclusion", body: "Publiez le résultat exactement tel que vous le constatez. Nous ne le relisons pas au préalable." },
    ],
  },
  journey: {
    eyebrow: "Choisir son trajet",
    title: "Roulez sur un itinéraire suggéré — ou sur un itinéraire adapté à votre test.",
    intro:
      "Il existe deux façons de mener votre Challenge. Les deux utilisent le même moteur de calcul, les mêmes sources de données et la même répartition pays par pays.",
    options: [
      {
        label: "Option 01",
        title: "Un itinéraire Challenge suggéré",
        body: "Pour chaque pays, AutoVere propose trois itinéraires suggérés, couvrant différentes régions et différents types de conduite.",
        bullets: ["Court", "Moyen", "Long"],
      },
      {
        label: "Option 02",
        title: "Testez votre propre trajet",
        body: "Choisissez un trajet réaliste adapté à votre test — le voyage que vous alliez faire de toute façon est souvent le plus révélateur. Par exemple : Paris–Nice, Varsovie–Cracovie, Los Angeles–San Diego.",
        bullets: ["Votre itinéraire", "Votre calendrier", "Vos conditions de conduite"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Choisir son véhicule",
    title: "Testez la voiture qui est réellement garée devant chez vous.",
    intro:
      "Choisissez le type de motorisation, puis sélectionnez le véhicule précis dans les données AutoVere existantes. Aucune liste de voitures distincte pour le Challenge.",
    items: [
      {
        label: "Essence",
        body: "Consommation, prix du carburant et péages calculés pays par pays le long de votre itinéraire.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Coupé bleu garé sur une route désertique au coucher du soleil",
      },
      {
        label: "Diesel",
        body: "Consommation sur longue distance, ainsi que les classes de poids et d'essieux là où les opérateurs de péage les appliquent.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "SUV blanc sur une route forestière enneigée",
      },
      {
        label: "Électrique",
        body: "Taille de la batterie, consommation, arrêts de recharge et tarifs des réseaux le long de l'itinéraire.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Câble de recharge branché sur une voiture électrique",
      },
    ],
  },
  evCompare: {
    eyebrow: "Le même trajet en électrique",
    title: "Combien aurait coûté ce trajet en voiture électrique ?",
    body: "Une fois votre propre trajet calculé, vous pouvez rouler le même itinéraire en voiture électrique et voir ce que disent les chiffres. Parfois, c'est moins cher. Parfois, la recharge, les péages et les détours changent la donne. AutoVere affiche le calcul dans tous les cas.",
    exampleLabel: "Exemple illustratif — pas un résultat AutoVere réel",
    rows: [
      { label: "Votre voiture", sub: "Diesel", amountEur: 96.4 },
      { label: "Le même trajet en électrique", sub: "Électrique", amountEur: 68.2 },
    ],
    differenceLabel: "Différence potentielle",
    differenceAmountEur: 28.2,
    caveat: "Chiffres d'exemple uniquement. Nous n'affirmons pas qu'une voiture électrique est toujours moins chère.",
  },
  reality: {
    eyebrow: "L'estimation face à la réalité",
    title: "La partie que la plupart des outils évitent discrètement.",
    body: "Le Challenge compare ce qu'AutoVere avait calculé avant votre départ à ce que le trajet a réellement coûté une fois arrivé. Cette comparaison vous appartient — y compris les jours où elle ne nous met pas en valeur.",
    exampleLabel: "Exemple illustratif — pas un résultat AutoVere réel",
    calculation: { label: "Calcul AutoVere", amountEur: 96.4 },
    actual: { label: "Coût réel du trajet", amountEur: 99.1 },
    difference: { label: "Différence", value: "+2,8 %" },
    caveat: "Nous ne promettons aucun pourcentage de précision précis. Ce qui compte, c'est votre propre résultat.",
  },
  founder: {
    eyebrow: "L'homme derrière AutoVere",
    title: "Pourquoi j'ai créé AutoVere",
    opening:
      "Tout a commencé par une question simple : pourquoi est-il encore si difficile de savoir ce qu'un trajet en voiture va réellement coûter ?",
    paragraphs: [
      "J'ai 74 ans. Après plus de 40 ans dans le bâtiment, j'ai pris ma retraite en 2020.",
      "Un an plus tard, au lieu de lever le pied, j'ai commencé à construire quelque chose de complètement différent.",
      "J'avais passé des années à sillonner l'Europe en voiture. Plus je voyageais, plus je voyais clairement le même problème : planifier un long trajet signifiait généralement chercher des informations à plusieurs endroits différents.",
      "Péages. Vignettes. Ferries. Carburant. Recharge. Itinéraires différents. Pays différents. Coûts différents.",
      "Je me suis dit qu'il devait exister une meilleure façon de faire.",
      "Alors j'ai commencé à construire AutoVere.",
      "Ce qui a commencé comme une idée personnelle est devenu un projet bien plus vaste — et je ne le fais pas seul. Mon fils fait aussi partie de cette aventure.",
      "Ensemble, nous construisons AutoVere autour d'un principe qui a toujours compté pour moi : ce qui mérite d'être fait mérite d'être bien fait.",
      "Cela signifie que nous utilisons des données réelles, des sources officielles, des algorithmes et des mathématiques pour calculer le trajet.",
      "Pas de suppositions. Pas de boîte noire.",
      "L'objectif est simple : donner aux gens une image plus claire de ce qu'un trajet va probablement coûter avant même de quitter la maison — et les aider à faire de meilleurs choix concernant l'itinéraire, la voiture et la façon de voyager.",
      "Ce qui a commencé comme une simple idée a aujourd'hui largement dépassé la Norvège et l'Europe.",
      "AutoVere est déjà lancé aux États-Unis et au Canada, en plus de l'Europe, avec l'ambition de devenir une plateforme mondiale d'intelligence de voyage pour tous ceux qui prennent la route.",
    ],
    closing: [
      "Mais construire quelque chose et y croire ne suffit pas.",
      "Je veux que ce soit testé dans le monde réel.",
      "C'est pour cela que nous avons créé l'AutoVere Challenge.",
      "Je ne veux pas que la presse automobile me croie simplement sur parole.",
      "Choisissez une vraie voiture. Choisissez un vrai trajet. Calculez-le avec AutoVere. Roulez. Comparez ensuite le résultat à ce qui s'est réellement passé.",
      "Pas de démonstration spéciale. Pas de résultat préparé à l'avance.",
      "Juste AutoVere — et la route.",
      "Si ça tient la route, nous en serons fiers.",
      "Si quelque chose ne va pas, nous voulons le savoir.",
      "Car la meilleure façon de prouver qu'AutoVere fonctionne n'est pas de l'affirmer.",
      "C'est de vous laisser le tester vous-même.",
    ],
    name: "Kjell Mersland, 74 ans",
    role: "Fondateur d'AutoVere",
    note: "Je construis AutoVere avec mon fils",
    alt: "Kjell Mersland, fondateur d'AutoVere",
    emphasis: [
      "J'ai 74 ans.",
      "Mon fils fait aussi partie de cette aventure.",
      "Pas de suppositions. Pas de boîte noire.",
      "AutoVere est déjà lancé aux États-Unis et au Canada, en plus de l'Europe",
      "Je veux que ce soit testé dans le monde réel.",
      "C'est de vous laisser le tester vous-même.",
    ],
  },
  report: {
    eyebrow: "Rapport Challenge",
    title: "Votre trajet. Votre résultat.",
    body: "Une fois le trajet terminé, vous recevez un résultat Challenge professionnel que vous pouvez citer, publier, ou avec lequel vous pouvez nous défier.",
    contents: [
      "Itinéraire",
      "Véhicule",
      "Motorisation",
      "Calcul AutoVere",
      "Coût réel du trajet",
      "Différence",
      "Comparaison électrique",
      "Date",
      "ID Challenge",
    ],
    future: "Prévu : un résultat web permanent, un lien partageable et un rapport PDF.",
    cta: "Voir ce trajet dans AutoVere",
    ctaNote:
      "Après un Challenge, le trajet et ses paramètres peuvent être rouverts dans le produit AutoVere habituel, afin que vous puissiez continuer à l'explorer.",
  },
  register: {
    eyebrow: "Accès pour la presse automobile",
    title: "Demander l'accès à l'AutoVere Challenge",
    body: "Faites-vous partie de la presse automobile ? Nous serions ravis que vous testiez AutoVere vous-même. Demandez l'accès Challenge, et une fois approuvé, utilisez AutoVere en tant qu'utilisateur Pro pendant votre test.",
    fields: {
      name: "Nom complet",
      email: "E-mail professionnel",
      outlet: "Publication ou chaîne",
      role: "Fonction",
      country: "Pays",
      message: "Le trajet et la voiture que vous aimeriez tester",
    },
    placeholders: {
      name: "Camille Moreau",
      email: "camille@publication.fr",
      outlet: "Publication, site web ou chaîne",
      role: "Journaliste automobile, testeur, rédacteur en chef…",
      country: "France",
      message: "Facultatif — dites-nous ce que vous comptez tester",
    },
    submit: "Demander l'accès Challenge",
    note: "Une brève étape de vérification garantit que l'accès Challenge reste réservé aux journalistes en activité. Une fois approuvé, votre compte passe en Pro pour la durée du test — aucun outil presse séparé, aucune restriction.",
    successTitle: "Merci — nous avons bien reçu votre demande.",
    successBody:
      "L'accès Challenge est déployé progressivement. Vos informations sont pour l'instant conservées uniquement dans ce navigateur, et nous vous recontacterons personnellement dès que la vérification sera ouverte.",
  },
  finalCta: {
    title: "Prêt à mettre AutoVere à l'épreuve ?",
    body: "Choisissez un trajet. Choisissez votre voiture. Roulez. Comparez le résultat.",
    primary: "Rejoindre l'AutoVere Challenge",
    secondary: "Découvrir AutoVere",
  },
  languageLabel: "Challenge dans votre langue",
};

const PL: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — wystaw AutoVere na próbę",
    description:
      "Przetestuj AutoVere na prawdziwych podróżach, z prawdziwymi samochodami i realnymi kosztami. Zapraszamy prasę motoryzacyjną do liczenia, jazdy i porównywania.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Wystaw AutoVere na próbę.",
    lede: "Wybierz samochód, którym naprawdę jeździsz. Wybierz podróż, którą chcesz przetestować. Oblicz ją w prawdziwym AutoVere, przejedź trasę — i porównaj nasze liczby z tym, co faktycznie wydałeś.",
    statement: ["Prawdziwe samochody.", "Prawdziwe podróże.", "Prawdziwe koszty."],
    primaryCta: "Zgłoś się po dostęp do Challenge",
    secondaryCta: "Poznaj AutoVere",
    imageCredit: "Zdjęcie: Unsplash",
  },
  invitation: {
    eyebrow: "Osobiste zaproszenie dla prasy motoryzacyjnej",
    title: "Zapraszamy Cię, abyś sam przetestował AutoVere.",
    paragraphs: [
      "Jeśli piszesz o samochodach, wiesz to już doskonale: podróż rzadko kosztuje tyle, ile z góry obiecywał kalkulator. Opłaty drogowe, winiety, promy, paliwo i ładowanie cicho się sumują, kraj po kraju — i właśnie to AutoVere ma liczyć poprawnie.",
      "Nie prosimy Cię, żebyś po prostu ślepo nam zaufał.",
      "Wolimy dać Ci klucze: wybierz prawdziwą podróż, wybierz samochód, który stoi na Twoim podjeździe, korzystaj z AutoVere jako użytkownik Pro, przejedź trasę — i zestaw nasze wyliczenie ze swoimi paragonami.",
      "Jeśli mamy rację, to historia, którą warto opowiedzieć. Jeśli się mylimy, chcemy o tym wiedzieć — wolimy usłyszeć to od Ciebie, niż nigdy się o tym nie dowiedzieć.",
    ],
    signature: "Kjell Mersland — założyciel AutoVere · KM Tech Labs",
  },
  steps: {
    eyebrow: "Jak działa Challenge",
    title: "Sześć prostych kroków, od zaproszenia do wyniku.",
    intro:
      "Nic z tego nie jest środowiskiem demonstracyjnym. Od piątego kroku korzystasz dokładnie z tego samego AutoVere, z którego korzystają wszyscy inni podróżni.",
    items: [
      { number: "01", title: "Zarejestruj się", body: "Zarejestruj się jako przedstawiciel prasy motoryzacyjnej." },
      {
        number: "02",
        title: "Weryfikacja",
        body: "AutoVere sprawdza Twoje zgłoszenie i aktywuje Twój dostęp do Challenge.",
      },
      {
        number: "03",
        title: "Wybierz podróż",
        body: "Wybierz jedną z tras Challenge zaproponowanych przez AutoVere albo ułóż własną podróż.",
      },
      {
        number: "04",
        title: "Wybierz samochód",
        body: "Wybierz pojazd, który faktycznie testujesz — benzynowy, diesel czy elektryczny.",
      },
      {
        number: "05",
        title: "Oblicz i jedź",
        body: "Korzystaj z normalnego AutoVere jako użytkownik Pro. Oblicz podróż, a potem naprawdę ją przejedź.",
      },
      {
        number: "06",
        title: "Porównaj",
        body: "Wpisz, ile podróż faktycznie kosztowała, i porównaj to z wyliczeniem AutoVere.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Jeden produkt, nie demo dla prasy",
    title: "Twój Challenge odbywa się wewnątrz prawdziwego AutoVere.",
    body: "AutoVere Challenge to brama wejściowa i cała koncepcja testu — nie drugi, uproszczony kalkulator zbudowany specjalnie dla dziennikarzy. Nie ma tu ograniczonej wersji dla prasy, przygotowanego środowiska testowego ani osobnych liczb.",
    flow: [
      "Strona startowa Challenge",
      "Rejestracja dziennikarzy",
      "Weryfikacja AutoVere",
      "Dostęp Challenge Pro",
      "Zwykły produkt AutoVere",
      "Twój wynik Challenge",
    ],
    footnote: "Wyliczenie, które testujesz, to to samo wyliczenie, które dostają wszyscy inni.",
  },
  freedom: {
    eyebrow: "Twój test, Twoje zasady",
    title: "Wybierz podróż, którą chcesz przetestować.",
    lines: [
      "Skorzystaj z jednej z naszych proponowanych tras — albo wybierz własną.",
      "Jeźdź samochodem, który faktycznie posiadasz.",
    ],
    body: "Nie ma tu sztywnego testu do zaliczenia, narzuconej trasy ani zatwierdzonej listy samochodów. To Ty kształtujesz swój Challenge — prosimy tylko, abyś opublikował to, co znajdziesz.",
    items: [
      { title: "Dowolna podróż", body: "Zaproponowana trasa Challenge albo podróż, którą i tak planujesz odbyć." },
      { title: "Dowolny samochód", body: "Samochód z Twojej floty testowej albo z własnego podjazdu — benzynowy, diesel czy elektryczny." },
      { title: "Pełny dostęp Pro", body: "Kompletny produkt AutoVere, bez ograniczeń, przez cały okres testu." },
      { title: "Twój własny wniosek", body: "Opublikuj wynik dokładnie taki, jaki go znajdziesz. Nie sprawdzamy go wcześniej." },
    ],
  },
  journey: {
    eyebrow: "Wybierz podróż",
    title: "Przejedź zaproponowaną trasę — albo taką, która pasuje do Twojego testu.",
    intro:
      "Są dwa sposoby na przeprowadzenie Twojego Challenge. Oba korzystają z tego samego silnika obliczeniowego, tych samych źródeł danych i tego samego podziału na kraje.",
    options: [
      {
        label: "Opcja 01",
        title: "Zaproponowana trasa Challenge",
        body: "Dla każdego kraju AutoVere proponuje trzy trasy, obejmujące różne regiony i różne style jazdy.",
        bullets: ["Krótka", "Średnia", "Długa"],
      },
      {
        label: "Opcja 02",
        title: "Przetestuj własną podróż",
        body: "Wybierz realistyczną podróż pasującą do Twojego testu — wyjazd, który i tak planujesz zrobić, często okazuje się najbardziej wymowny. Na przykład: Bergen–Trondheim, Gdańsk–Zakopane, Los Angeles–San Diego.",
        bullets: ["Twoja trasa", "Twój harmonogram", "Twoje warunki jazdy"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Wybierz pojazd",
    title: "Przetestuj samochód, który faktycznie stoi na Twoim podjeździe.",
    intro:
      "Wybierz rodzaj napędu, a potem wskaż konkretny samochód z istniejących danych pojazdów AutoVere. Żadnej osobnej listy samochodów na potrzeby Challenge.",
    items: [
      {
        label: "Benzyna",
        body: "Zużycie, ceny paliwa i opłaty drogowe wyliczone kraj po kraju wzdłuż Twojej trasy.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Niebieskie coupé zaparkowane na pustynnej drodze o zachodzie słońca",
      },
      {
        label: "Diesel",
        body: "Zużycie paliwa na długich dystansach oraz klasy wagowe i osiowe, tam gdzie stosują je operatorzy opłat drogowych.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "Biały SUV na ośnieżonej leśnej drodze",
      },
      {
        label: "Elektryczny",
        body: "Pojemność baterii, zużycie, przystanki ładowania i ceny w sieciach ładowania wzdłuż trasy.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Kabel ładujący podłączony do samochodu elektrycznego",
      },
    ],
  },
  evCompare: {
    eyebrow: "Ta sama podróż samochodem elektrycznym",
    title: "Ile kosztowałaby ta podróż samochodem elektrycznym?",
    body: "Gdy obliczysz już swoją podróż, możesz przejechać tę samą trasę samochodem elektrycznym i zobaczyć, co mówią liczby. Czasem wychodzi taniej. Czasem ładowanie, opłaty drogowe i objazdy zmieniają obraz. AutoVere i tak pokazuje wyliczenie.",
    exampleLabel: "Przykład poglądowy — nie rzeczywisty wynik AutoVere",
    rows: [
      { label: "Twój samochód", sub: "Diesel", amountEur: 96.4 },
      { label: "Ta sama podróż samochodem elektrycznym", sub: "Elektryczny", amountEur: 68.2 },
    ],
    differenceLabel: "Możliwa różnica",
    differenceAmountEur: 28.2,
    caveat: "To tylko przykładowe liczby. Nie twierdzimy, że samochód elektryczny zawsze wychodzi taniej.",
  },
  reality: {
    eyebrow: "Szacunek kontra rzeczywistość",
    title: "Część, którą większość narzędzi po cichu pomija.",
    body: "Challenge porównuje to, co AutoVere wyliczyło przed wyjazdem, z tym, co podróż faktycznie kosztowała po przyjeździe. To porównanie należy do Ciebie — również w te dni, kiedy nie wypada nam korzystnie.",
    exampleLabel: "Przykład poglądowy — nie rzeczywisty wynik AutoVere",
    calculation: { label: "Wyliczenie AutoVere", amountEur: 96.4 },
    actual: { label: "Rzeczywisty koszt podróży", amountEur: 99.1 },
    difference: { label: "Różnica", value: "+2,8%" },
    caveat: "Nie obiecujemy konkretnej dokładności procentowej. Liczy się Twój własny wynik.",
  },
  founder: {
    eyebrow: "Człowiek stojący za AutoVere",
    title: "Dlaczego zbudowałem AutoVere",
    opening:
      "Zaczęło się od prostego pytania: dlaczego wciąż tak trudno jest wiedzieć, ile naprawdę będzie kosztować podróż samochodem?",
    paragraphs: [
      "Mam 74 lata. Po ponad 40 latach w budownictwie przeszedłem na emeryturę w 2020 roku.",
      "Rok później, zamiast zwolnić tempo, zacząłem budować coś zupełnie innego.",
      "Przez lata jeździłem samochodem wzdłuż i wszerz Europy. Im więcej podróżowałem, tym wyraźniej widziałem ten sam problem: zaplanowanie długiej podróży zwykle oznaczało szukanie informacji w wielu różnych miejscach.",
      "Opłaty drogowe. Winiety. Promy. Paliwo. Ładowanie. Inne trasy. Inne kraje. Inne koszty.",
      "Pomyślałem, że musi istnieć lepszy sposób.",
      "Więc zacząłem budować AutoVere.",
      "To, co zaczęło się jako osobisty pomysł, wyrosło na dużo większy projekt. I nie robię tego sam — mój syn też jest częścią tej podróży.",
      "Razem budujemy AutoVere na zasadzie, która zawsze była dla mnie ważna: jeśli coś jest warte zrobienia, warto zrobić to porządnie.",
      "To znaczy, że korzystamy z prawdziwych danych, oficjalnych źródeł, algorytmów i matematyki, żeby obliczyć podróż.",
      "Żadnych domysłów. Żadnej czarnej skrzynki.",
      "Cel jest prosty: dać ludziom jaśniejszy obraz tego, ile podróż prawdopodobnie będzie kosztować, zanim wyjadą z domu — i pomóc im podejmować lepsze decyzje dotyczące trasy, samochodu i sposobu podróżowania.",
      "To, co zaczęło się od jednego pomysłu, dziś wykroczyło daleko poza Norwegię i Europę.",
      "AutoVere jest już uruchomione w USA i Kanadzie, oprócz Europy, z ambicją stania się globalną platformą inteligencji podróżniczej dla wszystkich, którzy wyruszają w drogę.",
    ],
    closing: [
      "Ale zbudowanie czegoś i wiara w to nie wystarczą.",
      "Chcę, żeby to zostało przetestowane w prawdziwym świecie.",
      "Dlatego stworzyliśmy AutoVere Challenge.",
      "Nie chcę, żeby prasa motoryzacyjna po prostu wierzyła mi na słowo.",
      "Wybierz prawdziwy samochód. Wybierz prawdziwą podróż. Oblicz ją w AutoVere. Przejedź ją. Porównaj potem wynik z tym, co naprawdę się wydarzyło.",
      "Żadnego specjalnego pokazu. Żadnego przygotowanego wyniku.",
      "Tylko AutoVere — i droga.",
      "Jeśli to się sprawdzi, będziemy z tego dumni.",
      "Jeśli coś pójdzie nie tak, chcemy o tym wiedzieć.",
      "Bo najlepszy sposób na udowodnienie, że AutoVere działa, to nie mówienie, że działa.",
      "To pozwolenie Ci przetestować to samodzielnie.",
    ],
    name: "Kjell Mersland, 74 lata",
    role: "Założyciel AutoVere",
    note: "Buduję AutoVere razem z moim synem",
    alt: "Kjell Mersland, założyciel AutoVere",
    emphasis: [
      "Mam 74 lata.",
      "mój syn też jest częścią tej podróży.",
      "Żadnych domysłów. Żadnej czarnej skrzynki.",
      "AutoVere jest już uruchomione w USA i Kanadzie, oprócz Europy",
      "Chcę, żeby to zostało przetestowane w prawdziwym świecie.",
      "To pozwolenie Ci przetestować to samodzielnie.",
    ],
  },
  report: {
    eyebrow: "Raport Challenge",
    title: "Twoja podróż. Twój wynik.",
    body: "Gdy podróż się zakończy, otrzymasz profesjonalny wynik Challenge, na który możesz się powołać, który możesz opublikować lub za pomocą którego możesz rzucić nam wyzwanie.",
    contents: [
      "Trasa",
      "Pojazd",
      "Napęd",
      "Wyliczenie AutoVere",
      "Rzeczywisty koszt podróży",
      "Różnica",
      "Porównanie elektryczne",
      "Data",
      "ID Challenge",
    ],
    future: "Planowane: stały wynik w sieci, link do udostępnienia i raport PDF.",
    cta: "Zobacz tę podróż w AutoVere",
    ctaNote:
      "Po Challenge podróż i jej parametry można ponownie otworzyć w zwykłym produkcie AutoVere, dzięki czemu możesz dalej ją odkrywać.",
  },
  register: {
    eyebrow: "Dostęp dla prasy motoryzacyjnej",
    title: "Zgłoś się po dostęp do AutoVere Challenge",
    body: "Jesteś częścią prasy motoryzacyjnej? Chętnie zobaczylibyśmy, jak sam testujesz AutoVere. Zgłoś się po dostęp do Challenge, a po zatwierdzeniu korzystaj z AutoVere jako użytkownik Pro przez cały czas trwania testu.",
    fields: {
      name: "Imię i nazwisko",
      email: "Służbowy adres e-mail",
      outlet: "Publikacja lub kanał",
      role: "Funkcja",
      country: "Kraj",
      message: "Podróż i samochód, które chcesz przetestować",
    },
    placeholders: {
      name: "Anna Kowalska",
      email: "anna@publikacja.pl",
      outlet: "Publikacja, strona internetowa lub kanał",
      role: "Dziennikarz motoryzacyjny, recenzent, redaktor naczelny…",
      country: "Polska",
      message: "Opcjonalnie — powiedz nam, co planujesz przetestować",
    },
    submit: "Zgłoś się po dostęp do Challenge",
    note: "Krótki etap weryfikacji zapewnia, że dostęp do Challenge pozostaje zarezerwowany dla czynnie pracujących dziennikarzy. Po zatwierdzeniu Twoje konto zostaje podniesione do poziomu Pro na czas trwania testu — żadnego osobnego narzędzia dla prasy, żadnych ograniczeń.",
    successTitle: "Dziękujemy — otrzymaliśmy Twoje zgłoszenie.",
    successBody:
      "Dostęp do Challenge jest udostępniany stopniowo. Twoje dane są na razie przechowywane wyłącznie w tej przeglądarce, a my skontaktujemy się z Tobą osobiście, gdy tylko weryfikacja zostanie uruchomiona.",
  },
  finalCta: {
    title: "Czas wystawić AutoVere na próbę?",
    body: "Wybierz podróż. Wybierz swój samochód. Przejedź go. Porównaj wynik.",
    primary: "Dołącz do AutoVere Challenge",
    secondary: "Poznaj AutoVere",
  },
  languageLabel: "Challenge w Twoim języku",
};

const ES: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — pon a prueba AutoVere",
    description:
      "Prueba AutoVere en viajes reales, con coches reales y costes reales. Invitamos a la prensa del motor a calcular, conducir y comparar.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Pon a prueba AutoVere.",
    lede: "Elige el coche que conduces de verdad. Elige el viaje que quieres probar. Calcúlalo en el AutoVere real, condúcelo — y compara nuestras cifras con lo que realmente gastaste.",
    statement: ["Coches reales.", "Viajes reales.", "Costes reales."],
    primaryCta: "Solicitar acceso al Challenge",
    secondaryCta: "Descubrir AutoVere",
    imageCredit: "Foto: Unsplash",
  },
  invitation: {
    eyebrow: "Una invitación personal a la prensa del motor",
    title: "Te invitamos a probar AutoVere tú mismo.",
    paragraphs: [
      "Si escribes sobre coches, ya lo sabes: un viaje pocas veces cuesta lo que una calculadora prometió de antemano. Peajes, viñetas, ferris, combustible y carga se van sumando en silencio, país tras país — y precisamente eso es lo que AutoVere está diseñado para calcular bien.",
      "No te pedimos que simplemente confíes en nuestra palabra.",
      "Preferimos darte las llaves: elige un viaje real, elige el coche que tienes aparcado en la puerta de tu casa, usa AutoVere como usuario Pro, conduce la ruta — y contrasta nuestro cálculo con tus recibos.",
      "Si acertamos, es una historia que merece la pena contar. Si nos equivocamos, queremos saberlo — preferimos que nos lo digas tú a no enterarnos nunca.",
    ],
    signature: "Kjell Mersland — fundador de AutoVere · KM Tech Labs",
  },
  steps: {
    eyebrow: "Cómo funciona el Challenge",
    title: "Seis pasos sencillos, de la invitación al resultado.",
    intro:
      "Nada de esto es un entorno de demostración. A partir del quinto paso, usas exactamente el mismo AutoVere que usa cualquier otro viajero.",
    items: [
      { number: "01", title: "Regístrate", body: "Regístrate como miembro de la prensa del motor." },
      {
        number: "02",
        title: "Verificación",
        body: "AutoVere revisa tu solicitud y activa tu acceso al Challenge.",
      },
      {
        number: "03",
        title: "Elige tu viaje",
        body: "Elige una de las rutas de Challenge sugeridas por AutoVere, o crea tu propio viaje.",
      },
      {
        number: "04",
        title: "Elige tu coche",
        body: "Elige el vehículo que vas a probar de verdad — gasolina, diésel o eléctrico.",
      },
      {
        number: "05",
        title: "Calcula y conduce",
        body: "Usa la experiencia normal de AutoVere como usuario Pro. Calcula el viaje y luego condúcelo de verdad.",
      },
      {
        number: "06",
        title: "Compara",
        body: "Indica lo que costó realmente el viaje y compáralo con el cálculo de AutoVere.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Un solo producto, no una demo para la prensa",
    title: "Tu Challenge se desarrolla dentro del AutoVere real.",
    body: "AutoVere Challenge es la puerta de entrada y todo el planteamiento de la prueba — no una segunda calculadora simplificada creada solo para periodistas. No existe una versión de prensa limitada, ni un entorno de pruebas preparado, ni cifras aparte.",
    flow: [
      "Página de inicio del Challenge",
      "Registro de periodistas",
      "Verificación de AutoVere",
      "Acceso Pro al Challenge",
      "El producto normal de AutoVere",
      "Tu resultado del Challenge",
    ],
    footnote: "El cálculo que pruebas es el mismo cálculo que recibe todo el mundo.",
  },
  freedom: {
    eyebrow: "Tu prueba, tus reglas",
    title: "Elige el viaje que quieres probar.",
    lines: [
      "Usa una de nuestras rutas sugeridas — o elige la tuya.",
      "Conduce el coche que realmente tienes.",
    ],
    body: "No hay ninguna prueba fija que superar, ninguna ruta impuesta ni ninguna lista de coches aprobados. El Challenge lo diseñas tú — solo te pedimos que publiques lo que descubras.",
    items: [
      { title: "Cualquier viaje", body: "Una ruta de Challenge sugerida, o el viaje que ibas a hacer de todos modos." },
      { title: "Cualquier coche", body: "El coche de tu flota de pruebas o el que tienes aparcado en tu propia puerta — gasolina, diésel o eléctrico." },
      { title: "Acceso Pro completo", body: "El producto AutoVere completo, sin restricciones, durante toda la prueba." },
      { title: "Tu propia conclusión", body: "Publica el resultado tal como lo encuentres. No lo revisamos antes." },
    ],
  },
  journey: {
    eyebrow: "Elige tu viaje",
    title: "Conduce una ruta sugerida — o una que se adapte a tu prueba.",
    intro:
      "Hay dos formas de llevar a cabo tu Challenge. Ambas usan el mismo motor de cálculo, las mismas fuentes de datos y el mismo desglose país por país.",
    options: [
      {
        label: "Opción 01",
        title: "Una ruta de Challenge sugerida",
        body: "Para cada país, AutoVere propone tres rutas sugeridas, que cubren distintas regiones y distintos tipos de conducción.",
        bullets: ["Corta", "Media", "Larga"],
      },
      {
        label: "Opción 02",
        title: "Prueba tu propio viaje",
        body: "Elige un viaje realista que se adapte a tu prueba — el trayecto que ibas a hacer de todos modos suele ser el más revelador. Por ejemplo: Madrid–Barcelona, Varsovia–Cracovia, Los Ángeles–San Diego.",
        bullets: ["Tu ruta", "Tu horario", "Tus condiciones de conducción"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Elige tu vehículo",
    title: "Prueba el coche que de verdad tienes aparcado en tu puerta.",
    intro:
      "Elige el tipo de motor y después selecciona el vehículo concreto entre los datos de vehículos ya existentes de AutoVere. Ninguna lista de coches aparte para el Challenge.",
    items: [
      {
        label: "Gasolina",
        body: "Consumo, precios del combustible y peajes calculados país por país a lo largo de tu ruta.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Cupé azul aparcado en una carretera desértica al atardecer",
      },
      {
        label: "Diésel",
        body: "Consumo en trayectos largos, además de las clases de peso y de eje donde los operadores de peaje las aplican.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "SUV blanco en una carretera forestal nevada",
      },
      {
        label: "Eléctrico",
        body: "Capacidad de la batería, consumo, paradas de carga y precios de las redes a lo largo de la ruta.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Cable de carga conectado a un coche eléctrico",
      },
    ],
  },
  evCompare: {
    eyebrow: "El mismo viaje en eléctrico",
    title: "¿Cuánto habría costado este viaje en un coche eléctrico?",
    body: "Una vez que hayas calculado tu propio viaje, puedes conducir la misma ruta en un coche eléctrico y ver qué dicen las cifras. A veces sale más barato. Otras veces la carga, los peajes y los desvíos cambian el panorama. AutoVere muestra el cálculo de todos modos.",
    exampleLabel: "Ejemplo ilustrativo — no es un resultado real de AutoVere",
    rows: [
      { label: "Tu coche", sub: "Diésel", amountEur: 96.4 },
      { label: "El mismo viaje en eléctrico", sub: "Eléctrico", amountEur: 68.2 },
    ],
    differenceLabel: "Diferencia potencial",
    differenceAmountEur: 28.2,
    caveat: "Solo cifras de ejemplo. No afirmamos que un coche eléctrico siempre salga más barato.",
  },
  reality: {
    eyebrow: "La estimación frente a la realidad",
    title: "La parte que la mayoría de las herramientas evitan en silencio.",
    body: "El Challenge compara lo que AutoVere calculó antes de salir con lo que el viaje costó realmente al llegar. Esa comparación es tuya — también los días en que no nos deja en buen lugar.",
    exampleLabel: "Ejemplo ilustrativo — no es un resultado real de AutoVere",
    calculation: { label: "Cálculo de AutoVere", amountEur: 96.4 },
    actual: { label: "Coste real del viaje", amountEur: 99.1 },
    difference: { label: "Diferencia", value: "+2,8 %" },
    caveat: "No prometemos un porcentaje de precisión exacto. Lo que importa es tu propio resultado.",
  },
  founder: {
    eyebrow: "El hombre detrás de AutoVere",
    title: "Por qué construí AutoVere",
    opening:
      "Todo empezó con una pregunta sencilla: ¿por qué sigue siendo tan difícil saber cuánto va a costar realmente un viaje en coche?",
    paragraphs: [
      "Tengo 74 años. Después de más de 40 años en la construcción, me jubilé en 2020.",
      "Un año después, en lugar de reducir el ritmo, empecé a construir algo completamente distinto.",
      "Llevaba años recorriendo Europa en coche de punta a punta. Cuanto más viajaba, más claro veía el mismo problema: planificar un viaje largo normalmente significaba buscar información en varios sitios distintos.",
      "Peajes. Viñetas. Ferris. Combustible. Carga. Rutas distintas. Países distintos. Costes distintos.",
      "Pensé que tenía que haber una manera mejor de hacerlo.",
      "Así que empecé a construir AutoVere.",
      "Lo que empezó como una idea personal se ha convertido en un proyecto mucho más grande. Y no lo hago solo — mi hijo también forma parte de este viaje.",
      "Juntos construimos AutoVere sobre un principio que siempre me ha importado: si algo merece la pena hacerse, merece la pena hacerlo bien.",
      "Eso significa usar datos reales, fuentes oficiales, algoritmos y matemáticas para calcular el viaje.",
      "Nada de suposiciones. Nada de cajas negras.",
      "El objetivo es sencillo: dar a la gente una imagen más clara de lo que probablemente va a costar un viaje antes de salir de casa — y ayudarles a tomar mejores decisiones sobre la ruta, el coche y la forma de viajar.",
      "Lo que empezó como una idea hoy ha crecido mucho más allá de Noruega y de Europa.",
      "AutoVere ya se ha lanzado en Estados Unidos y Canadá, además de en Europa, con la ambición de convertirse en una plataforma global de inteligencia de viaje para todos los que se echan a la carretera.",
    ],
    closing: [
      "Pero construir algo y creer en ello no es suficiente.",
      "Quiero que se ponga a prueba en el mundo real.",
      "Por eso creamos el AutoVere Challenge.",
      "No quiero que la prensa del motor se quede solo con mi palabra.",
      "Elige un coche real. Elige un viaje real. Calcúlalo con AutoVere. Condúcelo. Después compara el resultado con lo que realmente pasó.",
      "Nada de demostraciones especiales. Nada de resultados preparados de antemano.",
      "Solo AutoVere — y la carretera.",
      "Si funciona bien, estaremos orgullosos de ello.",
      "Si algo falla, queremos saberlo.",
      "Porque la mejor manera de demostrar que AutoVere funciona no es decir que funciona.",
      "Es dejar que lo pruebes tú mismo.",
    ],
    name: "Kjell Mersland, 74 años",
    role: "Fundador de AutoVere",
    note: "Construyo AutoVere junto a mi hijo",
    alt: "Kjell Mersland, fundador de AutoVere",
    emphasis: [
      "Tengo 74 años.",
      "mi hijo también forma parte de este viaje.",
      "Nada de suposiciones. Nada de cajas negras.",
      "AutoVere ya se ha lanzado en Estados Unidos y Canadá, además de en Europa",
      "Quiero que se ponga a prueba en el mundo real.",
      "Es dejar que lo pruebes tú mismo.",
    ],
  },
  report: {
    eyebrow: "Informe del Challenge",
    title: "Tu viaje. Tu resultado.",
    body: "Cuando termine el viaje, recibirás un resultado profesional del Challenge al que podrás hacer referencia, que podrás publicar o con el que podrás desafiarnos.",
    contents: [
      "Ruta",
      "Vehículo",
      "Tipo de motor",
      "Cálculo de AutoVere",
      "Coste real del viaje",
      "Diferencia",
      "Comparación eléctrica",
      "Fecha",
      "ID del Challenge",
    ],
    future: "Próximamente: un resultado web permanente, un enlace para compartir y un informe en PDF.",
    cta: "Ver este viaje en AutoVere",
    ctaNote:
      "Después de un Challenge, el viaje y sus parámetros se pueden volver a abrir dentro del producto normal de AutoVere, para que sigas explorándolo.",
  },
  register: {
    eyebrow: "Acceso para la prensa del motor",
    title: "Solicita acceso al AutoVere Challenge",
    body: "¿Formas parte de la prensa del motor? Nos encantaría que probaras AutoVere tú mismo. Solicita el acceso al Challenge y, una vez aprobado, usa AutoVere como usuario Pro mientras dure tu prueba.",
    fields: {
      name: "Nombre completo",
      email: "Correo electrónico profesional",
      outlet: "Publicación o canal",
      role: "Cargo",
      country: "País",
      message: "El viaje y el coche que te gustaría probar",
    },
    placeholders: {
      name: "Marta Sánchez",
      email: "marta@publicacion.es",
      outlet: "Publicación, web o canal",
      role: "Periodista del motor, redactor, redactor jefe…",
      country: "España",
      message: "Opcional — cuéntanos qué planeas probar",
    },
    submit: "Solicitar acceso al Challenge",
    note: "Un breve paso de verificación garantiza que el acceso al Challenge quede reservado a periodistas en activo. Una vez aprobado, tu cuenta pasa a Pro durante la prueba — sin herramienta de prensa aparte, sin restricciones.",
    successTitle: "Gracias — hemos recibido tu solicitud.",
    successBody:
      "El acceso al Challenge se está implementando de forma gradual. Tus datos se guardan por ahora solo en este navegador, y nos pondremos en contacto contigo en persona en cuanto se abra la verificación.",
  },
  finalCta: {
    title: "¿Listo para poner a prueba AutoVere?",
    body: "Elige un viaje. Elige tu coche. Condúcelo. Compara el resultado.",
    primary: "Únete al AutoVere Challenge",
    secondary: "Descubrir AutoVere",
  },
  languageLabel: "El Challenge en tu idioma",
};

const IT: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — metti alla prova AutoVere",
    description:
      "Metti alla prova AutoVere su viaggi reali, con auto reali e costi reali. Invitiamo la stampa automobilistica a calcolare, guidare e confrontare.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Metti alla prova AutoVere.",
    lede: "Scegli l'auto che guidi davvero. Scegli il viaggio che vuoi testare. Calcolalo nel vero AutoVere, guidalo — e confronta i nostri numeri con quello che hai davvero speso.",
    statement: ["Auto reali.", "Viaggi reali.", "Costi reali."],
    primaryCta: "Richiedi l'accesso al Challenge",
    secondaryCta: "Scopri AutoVere",
    imageCredit: "Foto: Unsplash",
  },
  invitation: {
    eyebrow: "Un invito personale alla stampa automobilistica",
    title: "Ti invitiamo a testare AutoVere di persona.",
    paragraphs: [
      "Se scrivi di auto, lo sai già: un viaggio raramente costa quanto promesso in anticipo da un calcolatore. Pedaggi, vignette, traghetti, carburante e ricarica si sommano in silenzio, paese dopo paese — ed è esattamente questo che AutoVere è pensato per calcolare bene.",
      "Non ti chiediamo semplicemente di crederci sulla parola.",
      "Preferiamo darti le chiavi: scegli un viaggio vero, scegli l'auto parcheggiata nel tuo vialetto, usa AutoVere come utente Pro, guida il percorso — e confronta il nostro calcolo con le tue ricevute.",
      "Se abbiamo ragione, è una storia che vale la pena raccontare. Se sbagliamo, vogliamo saperlo — preferiamo saperlo da te piuttosto che non scoprirlo mai.",
    ],
    signature: "Kjell Mersland — fondatore di AutoVere · KM Tech Labs",
  },
  steps: {
    eyebrow: "Come funziona il Challenge",
    title: "Sei passaggi semplici, dall'invito al risultato.",
    intro:
      "Niente di tutto questo è un ambiente demo. Dal quinto passaggio in poi, usi esattamente lo stesso AutoVere di tutti gli altri viaggiatori.",
    items: [
      { number: "01", title: "Registrati", body: "Registrati come membro della stampa automobilistica." },
      {
        number: "02",
        title: "Verifica",
        body: "AutoVere esamina la tua richiesta e attiva il tuo accesso al Challenge.",
      },
      {
        number: "03",
        title: "Scegli il viaggio",
        body: "Scegli uno dei percorsi Challenge proposti da AutoVere, oppure crea un viaggio tutto tuo.",
      },
      {
        number: "04",
        title: "Scegli l'auto",
        body: "Scegli il veicolo che stai davvero testando — benzina, diesel o elettrico.",
      },
      {
        number: "05",
        title: "Calcola e guida",
        body: "Usa la normale esperienza AutoVere come utente Pro. Calcola il viaggio, poi guidalo per davvero.",
      },
      {
        number: "06",
        title: "Confronta",
        body: "Inserisci quanto è costato davvero il viaggio e confrontalo con il calcolo di AutoVere.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Un solo prodotto, non una demo per la stampa",
    title: "Il tuo Challenge si svolge dentro il vero AutoVere.",
    body: "AutoVere Challenge è la porta d'ingresso e l'intero impianto del test — non un secondo calcolatore semplificato costruito apposta per i giornalisti. Non esiste una versione stampa limitata, né un ambiente di prova preconfezionato, né numeri a parte.",
    flow: [
      "Pagina di destinazione del Challenge",
      "Registrazione dei giornalisti",
      "Verifica AutoVere",
      "Accesso Pro al Challenge",
      "Il normale prodotto AutoVere",
      "Il tuo risultato Challenge",
    ],
    footnote: "Il calcolo che stai testando è lo stesso calcolo che ricevono tutti gli altri.",
  },
  freedom: {
    eyebrow: "Il tuo test, le tue regole",
    title: "Scegli il viaggio che vuoi testare.",
    lines: [
      "Usa uno dei nostri percorsi proposti — oppure scegline uno tuo.",
      "Guida l'auto che possiedi davvero.",
    ],
    body: "Non c'è nessun test fisso da superare, nessun percorso imposto e nessuna lista di auto approvate. Il Challenge lo definisci tu — ti chiediamo solo di pubblicare quello che scopri.",
    items: [
      { title: "Qualsiasi viaggio", body: "Un percorso Challenge proposto, oppure il viaggio che avresti comunque fatto." },
      { title: "Qualsiasi auto", body: "L'auto della tua flotta di prova o quella parcheggiata nel tuo vialetto — benzina, diesel o elettrica." },
      { title: "Accesso Pro completo", body: "Il prodotto AutoVere al completo, senza restrizioni, per tutta la durata del test." },
      { title: "La tua conclusione", body: "Pubblica il risultato esattamente come lo trovi. Non lo rileggiamo prima." },
    ],
  },
  journey: {
    eyebrow: "Scegli il viaggio",
    title: "Guida un percorso proposto — oppure uno adatto al tuo test.",
    intro:
      "Ci sono due modi per condurre il tuo Challenge. Entrambi usano lo stesso motore di calcolo, le stesse fonti di dati e la stessa suddivisione paese per paese.",
    options: [
      {
        label: "Opzione 01",
        title: "Un percorso Challenge proposto",
        body: "Per ogni paese, AutoVere propone tre percorsi, che coprono regioni diverse e diversi stili di guida.",
        bullets: ["Breve", "Medio", "Lungo"],
      },
      {
        label: "Opzione 02",
        title: "Testa il tuo viaggio",
        body: "Scegli un viaggio realistico adatto al tuo test — il tragitto che avresti comunque fatto è spesso il più rivelatore. Ad esempio: Milano–Roma, Varsavia–Cracovia, Los Angeles–San Diego.",
        bullets: ["Il tuo percorso", "I tuoi tempi", "Le tue condizioni di guida"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Scegli il veicolo",
    title: "Testa l'auto che è davvero parcheggiata nel tuo vialetto.",
    intro:
      "Scegli il tipo di alimentazione, poi seleziona l'auto specifica tra i dati veicoli già presenti in AutoVere. Nessuna lista auto separata per il Challenge.",
    items: [
      {
        label: "Benzina",
        body: "Consumi, prezzi del carburante e pedaggi calcolati paese per paese lungo il tuo percorso.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Coupé blu parcheggiata su una strada desertica al tramonto",
      },
      {
        label: "Diesel",
        body: "Consumi sulle lunghe percorrenze, oltre a classi di peso e di assale dove i gestori dei pedaggi le applicano.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "SUV bianco su una strada forestale innevata",
      },
      {
        label: "Elettrico",
        body: "Capacità della batteria, consumi, soste di ricarica e tariffe delle reti lungo il percorso.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Cavo di ricarica collegato a un'auto elettrica",
      },
    ],
  },
  evCompare: {
    eyebrow: "Lo stesso viaggio in elettrico",
    title: "Quanto sarebbe costato questo viaggio con un'auto elettrica?",
    body: "Una volta calcolato il tuo viaggio, puoi percorrere lo stesso itinerario con un'auto elettrica e vedere cosa dicono i numeri. A volte costa meno. Altre volte, ricarica, pedaggi e deviazioni cambiano il quadro. AutoVere mostra comunque il calcolo.",
    exampleLabel: "Esempio illustrativo — non un risultato reale di AutoVere",
    rows: [
      { label: "La tua auto", sub: "Diesel", amountEur: 96.4 },
      { label: "Lo stesso viaggio in elettrico", sub: "Elettrico", amountEur: 68.2 },
    ],
    differenceLabel: "Differenza potenziale",
    differenceAmountEur: 28.2,
    caveat: "Solo cifre di esempio. Non affermiamo che un'auto elettrica costi sempre meno.",
  },
  reality: {
    eyebrow: "La stima contro la realtà",
    title: "La parte che la maggior parte degli strumenti evita in silenzio.",
    body: "Il Challenge confronta ciò che AutoVere aveva calcolato prima della partenza con quanto il viaggio è realmente costato all'arrivo. Questo confronto appartiene a te — anche nei giorni in cui non ci fa fare bella figura.",
    exampleLabel: "Esempio illustrativo — non un risultato reale di AutoVere",
    calculation: { label: "Calcolo AutoVere", amountEur: 96.4 },
    actual: { label: "Costo reale del viaggio", amountEur: 99.1 },
    difference: { label: "Differenza", value: "+2,8%" },
    caveat: "Non promettiamo una percentuale di precisione specifica. Ciò che conta è il tuo risultato.",
  },
  founder: {
    eyebrow: "L'uomo dietro AutoVere",
    title: "Perché ho costruito AutoVere",
    opening:
      "Tutto è iniziato con una domanda semplice: perché è ancora così difficile sapere quanto costerà davvero un viaggio in auto?",
    paragraphs: [
      "Ho 74 anni. Dopo oltre 40 anni nell'edilizia, sono andato in pensione nel 2020.",
      "Un anno dopo, invece di rallentare, ho iniziato a costruire qualcosa di completamente diverso.",
      "Per anni avevo girato l'Europa in auto in lungo e in largo. Più viaggiavo, più vedevo chiaramente lo stesso problema: pianificare un viaggio lungo significava di solito cercare informazioni in tanti posti diversi.",
      "Pedaggi. Vignette. Traghetti. Carburante. Ricarica. Percorsi diversi. Paesi diversi. Costi diversi.",
      "Ho pensato che doveva esserci un modo migliore.",
      "Così ho iniziato a costruire AutoVere.",
      "Quello che è iniziato come un'idea personale è diventato un progetto molto più grande. E non lo sto facendo da solo — anche mio figlio fa parte di questo viaggio.",
      "Insieme costruiamo AutoVere su un principio che per me ha sempre contato molto: se qualcosa vale la pena farlo, vale la pena farlo bene.",
      "Questo significa usare dati reali, fonti ufficiali, algoritmi e matematica per calcolare il viaggio.",
      "Niente supposizioni. Nessuna scatola nera.",
      "L'obiettivo è semplice: dare alle persone un'idea più chiara di quanto probabilmente costerà un viaggio prima ancora di partire da casa — e aiutarle a prendere decisioni migliori su percorso, auto e modo di viaggiare.",
      "Quello che è iniziato come una semplice idea oggi è cresciuto ben oltre la Norvegia e l'Europa.",
      "AutoVere è già stato lanciato negli Stati Uniti e in Canada, oltre che in Europa, con l'ambizione di diventare una piattaforma globale di intelligenza di viaggio per chiunque si metta in viaggio su strada.",
    ],
    closing: [
      "Ma costruire qualcosa e crederci non basta.",
      "Voglio che venga testato nel mondo reale.",
      "Per questo abbiamo creato l'AutoVere Challenge.",
      "Non voglio che la stampa automobilistica creda semplicemente alla mia parola.",
      "Scegli un'auto vera. Scegli un viaggio vero. Calcolalo con AutoVere. Guidalo. Poi confronta il risultato con quello che è realmente successo.",
      "Nessuna dimostrazione speciale. Nessun risultato preparato in anticipo.",
      "Solo AutoVere — e la strada.",
      "Se funziona bene, ne saremo orgogliosi.",
      "Se qualcosa va storto, vogliamo saperlo.",
      "Perché il modo migliore per dimostrare che AutoVere funziona non è dirlo.",
      "È lasciare che tu lo testi di persona.",
    ],
    name: "Kjell Mersland, 74 anni",
    role: "Fondatore di AutoVere",
    note: "Costruisco AutoVere insieme a mio figlio",
    alt: "Kjell Mersland, fondatore di AutoVere",
    emphasis: [
      "Ho 74 anni.",
      "anche mio figlio fa parte di questo viaggio.",
      "Niente supposizioni. Nessuna scatola nera.",
      "AutoVere è già stato lanciato negli Stati Uniti e in Canada, oltre che in Europa",
      "Voglio che venga testato nel mondo reale.",
      "È lasciare che tu lo testi di persona.",
    ],
  },
  report: {
    eyebrow: "Rapporto Challenge",
    title: "Il tuo viaggio. Il tuo risultato.",
    body: "Una volta concluso il viaggio, ricevi un risultato Challenge professionale a cui puoi fare riferimento, che puoi pubblicare o con cui puoi sfidarci.",
    contents: [
      "Percorso",
      "Veicolo",
      "Motorizzazione",
      "Calcolo AutoVere",
      "Costo reale del viaggio",
      "Differenza",
      "Confronto elettrico",
      "Data",
      "ID Challenge",
    ],
    future: "In programma: un risultato web permanente, un link condivisibile e un report in PDF.",
    cta: "Guarda questo viaggio in AutoVere",
    ctaNote:
      "Dopo un Challenge, il viaggio e i suoi parametri possono essere riaperti nel normale prodotto AutoVere, così puoi continuare a esplorarlo.",
  },
  register: {
    eyebrow: "Accesso per la stampa automobilistica",
    title: "Richiedi l'accesso all'AutoVere Challenge",
    body: "Fai parte della stampa automobilistica? Ci piacerebbe che testassi AutoVere di persona. Richiedi l'accesso al Challenge e, una volta approvato, usa AutoVere come utente Pro per tutta la durata del test.",
    fields: {
      name: "Nome completo",
      email: "Email di lavoro",
      outlet: "Testata o canale",
      role: "Ruolo",
      country: "Paese",
      message: "Il viaggio e l'auto che vorresti testare",
    },
    placeholders: {
      name: "Giulia Bianchi",
      email: "giulia@testata.it",
      outlet: "Testata, sito web o canale",
      role: "Giornalista automobilistico, collaudatore, caporedattore…",
      country: "Italia",
      message: "Facoltativo — raccontaci cosa hai intenzione di testare",
    },
    submit: "Richiedi l'accesso al Challenge",
    note: "Un breve passaggio di verifica garantisce che l'accesso al Challenge resti riservato ai giornalisti in attività. Una volta approvato, il tuo account passa a Pro per la durata del test — nessuno strumento stampa separato, nessuna restrizione.",
    successTitle: "Grazie — abbiamo ricevuto la tua richiesta.",
    successBody:
      "L'accesso al Challenge viene attivato gradualmente. I tuoi dati sono per ora conservati solo in questo browser, e ti contatteremo personalmente non appena la verifica sarà attiva.",
  },
  finalCta: {
    title: "Pronto a mettere alla prova AutoVere?",
    body: "Scegli un viaggio. Scegli la tua auto. Guidala. Confronta il risultato.",
    primary: "Partecipa all'AutoVere Challenge",
    secondary: "Scopri AutoVere",
  },
  languageLabel: "Il Challenge nella tua lingua",
};

/** Language URLs for the Challenge page. English/GB is the root /challenge. */
const JA: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — AutoVereを実際の旅で試す",
    description:
      "実際の旅、実際のクルマ、実際の費用でAutoVereをお試しいただけます。自動車ジャーナリストの皆様に、計算・走行・比較へのご参加をお願いしています。",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "AutoVereを、実際の旅で試してください。",
    lede: "普段ご自身が運転されている車をお選びください。試してみたい旅程をお選びください。本物のAutoVereで計算し、実際に走ってみて、私たちの計算結果と実際にかかった費用を比べてみてください。",
    statement: ["本物のクルマ。", "本物の旅。", "本物の費用。"],
    primaryCta: "Challengeへの参加を申し込む",
    secondaryCta: "AutoVereについて詳しく見る",
    imageCredit: "写真提供：Unsplash",
  },
  invitation: {
    eyebrow: "自動車ジャーナリストの皆様への、個人的なご招待",
    title: "AutoVereを、ご自身の目で確かめてください。",
    paragraphs: [
      "自動車について書かれている方なら、旅の費用が事前の見積もり通りになることがどれほど少ないか、よくご存じかと思います。通行料金、ビネット、フェリー、燃料費、充電費用は、国境を越えるたびに静かに積み重なっていきます。AutoVereは、まさにこの部分を正確に計算するために作られました。",
      "私たちの言葉を、そのまま信じていただく必要はありません。",
      "むしろ、鍵をお渡ししたいのです。実際の旅程を選び、いつも運転している車を選び、Proユーザーとして AutoVereを使い、実際にその道を走ってみてください。そして、私たちの計算結果をご自身の領収書と照らし合わせてみてください。",
      "もし数字が近ければ、それは記事にする価値のある話になるはずです。もしずれていたら、私たちはそれを知りたいのです。黙って見過ごされるより、あなたから教えていただくほうが、ずっとありがたいのです。",
    ],
    signature: "Kjell Mersland — AutoVere創業者・KM Tech Labs",
  },
  steps: {
    eyebrow: "Challengeの流れ",
    title: "招待から結果まで、6つの落ち着いたステップ。",
    intro: "ここには、デモ用の環境は一切ありません。5番目のステップからは、他のすべての利用者と同じAutoVereをお使いいただきます。",
    items: [
      { number: "01", title: "登録", body: "自動車ジャーナリストとして登録してください。" },
      { number: "02", title: "確認", body: "AutoVereがお申し込み内容を確認し、Challengeへのアクセスを有効にします。" },
      {
        number: "03",
        title: "旅程を選ぶ",
        body: "AutoVereが提案するChallenge向けルートからお選びいただくか、ご自身で旅程をお決めください。",
      },
      {
        number: "04",
        title: "車を選ぶ",
        body: "実際にテストする車両をお選びください — ガソリン、ディーゼル、電気自動車のいずれでも構いません。",
      },
      {
        number: "05",
        title: "計算して走る",
        body: "Proユーザーとして、通常のAutoVereをお使いください。旅程を計算し、そのあと実際に走ってみてください。",
      },
      {
        number: "06",
        title: "比較する",
        body: "実際にかかった旅の費用を入力し、AutoVereの計算結果と比較してください。",
      },
    ],
  },
  notCalculator: {
    eyebrow: "報道向けの特別版ではなく、ひとつの製品",
    title: "あなたのChallengeは、本物のAutoVereの中で行われます。",
    body: "AutoVere Challengeは、AutoVereへの入り口であり、検証の仕組みそのものです。ジャーナリスト向けに作られた簡易版の計算機ではありません。制限された報道用バージョンも、用意された検証環境も、別の数字も存在しません。",
    flow: [
      "Challengeのランディングページ",
      "ジャーナリスト登録",
      "AutoVereによる確認",
      "Challenge Proアクセス",
      "通常のAutoVere製品",
      "あなたのChallenge結果",
    ],
    footnote: "あなたが試す計算は、他のすべての利用者が受け取る計算とまったく同じものです。",
  },
  freedom: {
    eyebrow: "あなたの検証、あなたのルール",
    title: "試したい旅程を、自由にお選びください。",
    lines: [
      "おすすめのルートをお使いいただくか、ご自身で旅程をお決めください。",
      "普段お使いの車で、そのままお試しください。",
    ],
    body: "決まった合格基準も、指定されたルートも、承認された車種リストもありません。Challengeの内容はあなた次第です。私たちがお願いするのは、見つけたことをそのまま公開していただくことだけです。",
    items: [
      { title: "どんな旅程でも", body: "おすすめのChallengeルートでも、もともと予定していた旅でも構いません。" },
      { title: "どんな車でも", body: "テスト車両でも、普段ご自身が運転している車でも — ガソリン、ディーゼル、電気自動車、いずれでも。" },
      { title: "Pro機能をすべて", body: "検証期間中、AutoVereの全機能を制限なくお使いいただけます。" },
      { title: "あなた自身の結論", body: "見つけた結果を、そのまま公開してください。私たちが事前に確認することはありません。" },
    ],
  },
  journey: {
    eyebrow: "旅程の選択",
    title: "おすすめのルートを走る、あるいは検証に合ったルートを選ぶ。",
    intro: "Challengeの進め方は2通りです。どちらも同じ計算エンジン、同じデータソース、同じ国別の内訳を使用します。",
    options: [
      {
        label: "選択肢01",
        title: "おすすめのChallengeルート",
        body: "各国ごとに、AutoVereは地域や走行スタイルの異なる3つのおすすめルートをご用意しています。",
        bullets: ["短距離", "中距離", "長距離"],
      },
      {
        label: "選択肢02",
        title: "ご自身の旅程で試す",
        body: "検証にふさわしい、現実的な旅程を自由にお選びください。もともと予定していた旅こそ、最も本音の結果が出ることも少なくありません。例：ベルゲン〜トロンハイム、ワルシャワ〜クラクフ、ロサンゼルス〜サンディエゴ。",
        bullets: ["自分のルート", "自分のスケジュール", "自分の走行条件"],
      },
    ],
  },
  vehicles: {
    eyebrow: "車両の選択",
    title: "実際にお持ちの車で試してください。",
    intro: "パワートレインを選んだあと、AutoVereに既にある車両データから具体的な車種をお選びください。Challenge専用の車両リストはありません。",
    items: [
      {
        label: "ガソリン",
        body: "ルート沿いの各国ごとに、燃費・燃料価格・通行料金を計算します。",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "夕暮れの砂漠の道に停まる青いクーペ",
      },
      {
        label: "ディーゼル",
        body: "長距離走行時の燃費に加え、事業者が適用する重量区分や軸数区分も考慮します。",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "雪の森の道を走る白いSUV",
      },
      {
        label: "電気自動車",
        body: "バッテリー容量、電費、充電の回数、ルート沿いの充電ネットワークの料金を計算します。",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "電気自動車に接続された充電ケーブル",
      },
    ],
  },
  evCompare: {
    eyebrow: "同じ旅程を電気自動車で",
    title: "この旅を電気自動車で走ったら、費用はどうなるでしょうか。",
    body: "ご自身の旅程を計算したあと、同じルートを電気自動車で計算してみることができます。電気自動車のほうが安くなることもあれば、充電や通行料金、迂回によって結果が変わることもあります。AutoVereは、どちらの場合も正直に計算結果をお見せします。",
    exampleLabel: "参考例です — 実際のAutoVereの計算結果ではありません",
    rows: [
      { label: "あなたの車", sub: "ディーゼル", amountEur: 96.4 },
      { label: "同じ旅を電気自動車で", sub: "電気自動車", amountEur: 68.2 },
    ],
    differenceLabel: "想定される差額",
    differenceAmountEur: 28.2,
    caveat: "あくまで参考例です。電気自動車が常に安いとは限りません。",
  },
  reality: {
    eyebrow: "予測と実際の結果",
    title: "多くのツールが、そっと避けている部分です。",
    body: "Challengeでは、出発前にAutoVereが計算した金額と、実際に旅を終えたときにかかった費用を比較します。この結果はあなた自身のものです — 私たちにとって都合の良くない日であっても。",
    exampleLabel: "参考例です — 実際のAutoVereの計算結果ではありません",
    calculation: { label: "AutoVereの計算結果", amountEur: 96.4 },
    actual: { label: "実際にかかった費用", amountEur: 99.1 },
    difference: { label: "差", value: "+2.8%" },
    caveat: "特定の精度をお約束するものではありません。大切なのは、あなた自身の結果です。",
  },
  founder: {
    eyebrow: "AutoVereを作った人",
    title: "なぜ、私はAutoVereを作ったのか",
    opening: "きっかけは、ひとつのシンプルな疑問でした。なぜ今でも、旅にかかる本当の費用を知ることがこんなに難しいのだろう、と。",
    paragraphs: [
      "私は74歳です。建設業に40年以上携わったのち、2020年に引退しました。",
      "その1年後、ゆっくり過ごす代わりに、まったく違う何かを作り始めることにしました。",
      "長年、私は車でヨーロッパ各地を旅してきました。旅を重ねるほど、いつも同じ問題に気づかされました。長距離の旅を計画するには、たいてい、いくつもの異なる場所で情報を探さなければならなかったのです。",
      "通行料金。ビネット。フェリー。燃料費。EVの充電費用。ルートが変われば、国が変われば、費用も変わります。",
      "もっと良い方法があるはずだと思いました。",
      "そうして、AutoVereを作り始めたのです。",
      "個人的な思いつきから始まったこの取り組みは、今ではずっと大きなプロジェクトになりました。そして、これは私ひとりの仕事ではありません。息子も、この旅に加わってくれています。",
      "私たちは、ずっと大切にしてきたひとつの考え方を軸に、AutoVereを作り続けています。それは、やる価値のあることは、きちんとやるべきだ、ということです。",
      "そのために、実際のデータ、公式の情報源、アルゴリズムと数学を使って、旅の費用を計算しています。",
      "当て推量ではありません。ブラックボックスでもありません。",
      "目指していることはシンプルです。出発する前に、旅にかかる費用をより明確に知っていただくこと。そして、ルートや車、旅の計画について、より良い選択をする手助けをすることです。",
      "ひとつのアイデアから始まったこの取り組みは、今ではノルウェーやヨーロッパの枠を超えて広がっています。",
      "AutoVereはすでにヨーロッパに加え、アメリカとカナダでも展開しています。目指しているのは、車で旅するすべての人のための、世界規模の情報基盤になることです。",
    ],
    closing: [
      "けれど、何かを作り、それを信じるだけでは十分ではありません。",
      "現実の世界で試されてほしいと、私は思っています。",
      "だからこそ、AutoVere Challengeを作りました。",
      "自動車ジャーナリストの皆様に、私の言葉をそのまま信じていただきたくはありません。",
      "本物の車を選んでください。本物の旅を選んでください。AutoVereで計算してください。実際に走ってください。そして、その結果を実際に起きたことと比べてみてください。",
      "特別なデモンストレーションはありません。用意された結果もありません。",
      "あるのは、AutoVereと、道だけです。",
      "うまくいけば、私たちはそれを誇りに思います。",
      "もし何か間違っていたら、それを知りたいと思っています。",
      "AutoVereが本当に役立つことを証明する一番の方法は、言葉で伝えることではないからです。",
      "それは、あなた自身に試していただくことです。",
    ],
    name: "Kjell Mersland、74歳",
    role: "AutoVere創業者",
    note: "息子とともにAutoVereを作っています",
    alt: "AutoVere創業者、Kjell Mersland",
    emphasis: [
      "私は74歳です。",
      "息子も、この旅に加わってくれています。",
      "当て推量ではありません。ブラックボックスでもありません。",
      "AutoVereはすでにヨーロッパに加え、アメリカとカナダでも展開しています",
      "現実の世界で試されてほしいと、私は思っています。",
      "それは、あなた自身に試していただくことです。",
    ],
  },
  report: {
    eyebrow: "Challengeレポート",
    title: "あなたの旅。あなたの結果。",
    body: "旅を終えると、引用・公開、そして私たちへの反証にもお使いいただける、正式なChallenge結果を受け取ることができます。",
    contents: [
      "ルート",
      "車両",
      "パワートレイン",
      "AutoVereの計算結果",
      "実際の旅の費用",
      "差額",
      "電気自動車との比較",
      "日付",
      "Challenge ID",
    ],
    future: "今後の予定：常設のWeb結果ページ、共有可能なリンク、PDFレポート。",
    cta: "この旅をAutoVereで見る",
    ctaNote: "Challenge終了後も、その旅とパラメータは通常のAutoVere内でいつでも開き直すことができ、引き続き探っていただけます。",
  },
  register: {
    eyebrow: "自動車ジャーナリストの方へ",
    title: "AutoVere Challengeへの参加を申し込む",
    body: "自動車ジャーナリストの方でしょうか。ぜひご自身でAutoVereをお試しいただきたいと思っています。Challengeへの参加をお申し込みいただき、承認後は検証期間中、Proユーザーとしてご利用いただけます。",
    fields: {
      name: "お名前",
      email: "仕事用メールアドレス",
      outlet: "媒体名・チャンネル名",
      role: "ご担当",
      country: "国",
      message: "試してみたい旅程と車",
    },
    placeholders: {
      name: "山田太郎",
      email: "taro@publication.jp",
      outlet: "媒体名、ウェブサイト、チャンネル名",
      role: "自動車ジャーナリスト、レビュアー、編集者など…",
      country: "日本",
      message: "任意 — 試してみたい内容を教えてください",
    },
    submit: "Challengeへの参加を申し込む",
    note: "簡単な確認手続きにより、Challengeへのアクセスは現役のジャーナリストの方に限らせていただいています。承認後は、検証期間中アカウントがProにアップグレードされます — 報道専用のツールはなく、制限もありません。",
    successTitle: "ありがとうございます。お申し込みを受け付けました。",
    successBody: "Challengeへのアクセスは、順次ご案内しています。現時点でのご入力内容はこのブラウザにのみ保存されており、確認手続きが始まり次第、あらためて個別にご連絡いたします。",
  },
  finalCta: {
    title: "AutoVereを、実際に試してみませんか。",
    body: "旅程を選び、車を選び、走り、結果を比べてください。",
    primary: "AutoVere Challengeに参加する",
    secondary: "AutoVereについて詳しく見る",
  },
  languageLabel: "あなたの言語でChallengeを見る",
};

/** Language URLs for the Challenge page. English/GB is the root /challenge. */
const PT: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — põe o AutoVere à prova",
    description:
      "Põe o AutoVere à prova em viagens reais, com carros reais e custos reais. Convidamos a imprensa automóvel a calcular, conduzir e comparar.",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "Põe o AutoVere à prova.",
    lede: "Escolhe o carro que realmente conduzes. Escolhe a viagem que queres testar. Calcula-a no verdadeiro AutoVere, conduz — e compara os nossos números com o que realmente gastaste.",
    statement: ["Carros reais.", "Viagens reais.", "Custos reais."],
    primaryCta: "Pede acesso ao Challenge",
    secondaryCta: "Conhece o AutoVere",
    imageCredit: "Foto: Unsplash",
  },
  invitation: {
    eyebrow: "Um convite pessoal à imprensa automóvel",
    title: "Convidamos-te a testar o AutoVere pessoalmente.",
    paragraphs: [
      "Se escreves sobre automóveis, já sabes: uma viagem raramente custa o que um calculador promete à partida. Portagens, vinhetas, ferries, combustível e carregamento vão-se somando em silêncio, país após país — e é exatamente isto que o AutoVere foi pensado para calcular bem.",
      "Não te pedimos simplesmente que acredites na nossa palavra.",
      "Preferimos dar-te as chaves: escolhe uma viagem verdadeira, escolhe o carro que tens na garagem, usa o AutoVere como utilizador Pro, conduz o percurso — e compara o nosso cálculo com os teus recibos.",
      "Se tivermos razão, é uma história que vale a pena contar. Se estivermos errados, queremos sabê-lo — preferimos saber por ti do que nunca vir a descobrir.",
    ],
    signature: "Kjell Mersland — fundador do AutoVere · KM Tech Labs",
  },
  steps: {
    eyebrow: "Como funciona o Challenge",
    title: "Seis passos simples, do convite ao resultado.",
    intro:
      "Nada disto é um ambiente de demonstração. A partir do quinto passo, usas exatamente o mesmo AutoVere que todos os outros viajantes.",
    items: [
      { number: "01", title: "Regista-te", body: "Regista-te como membro da imprensa automóvel." },
      {
        number: "02",
        title: "Verificação",
        body: "O AutoVere analisa o teu pedido e ativa o teu acesso ao Challenge.",
      },
      {
        number: "03",
        title: "Escolhe a viagem",
        body: "Escolhe um dos percursos Challenge sugeridos pelo AutoVere, ou cria uma viagem só tua.",
      },
      {
        number: "04",
        title: "Escolhe o carro",
        body: "Escolhe o veículo que estás mesmo a testar — gasolina, gasóleo ou elétrico.",
      },
      {
        number: "05",
        title: "Calcula e conduz",
        body: "Usa a experiência normal do AutoVere como utilizador Pro. Calcula a viagem, depois conduz-a de verdade.",
      },
      {
        number: "06",
        title: "Compara",
        body: "Introduz quanto custou realmente a viagem e compara com o cálculo do AutoVere.",
      },
    ],
  },
  notCalculator: {
    eyebrow: "Um único produto, não uma demonstração para a imprensa",
    title: "O teu Challenge decorre dentro do verdadeiro AutoVere.",
    body: "O AutoVere Challenge é a porta de entrada e toda a estrutura do teste — não é uma segunda calculadora simplificada criada só para jornalistas. Não existe uma versão de imprensa limitada, nem um ambiente de teste à parte, nem números diferentes.",
    flow: [
      "Página de destino do Challenge",
      "Registo de jornalistas",
      "Verificação AutoVere",
      "Acesso Pro ao Challenge",
      "O produto AutoVere normal",
      "O teu resultado Challenge",
    ],
    footnote: "O cálculo que estás a testar é o mesmo cálculo que todos os outros recebem.",
  },
  freedom: {
    eyebrow: "O teu teste, as tuas regras",
    title: "Escolhe a viagem que queres testar.",
    lines: [
      "Usa um dos nossos percursos sugeridos — ou escolhe um teu.",
      "Conduz o carro que realmente tens.",
    ],
    body: "Não há nenhum teste fixo para passar, nenhum percurso obrigatório e nenhuma lista de carros aprovados. O Challenge é definido por ti — só te pedimos que publiques o que descobrires.",
    items: [
      { title: "Qualquer viagem", body: "Um percurso Challenge sugerido, ou a viagem que já ias fazer de qualquer forma." },
      { title: "Qualquer carro", body: "O carro da tua frota de testes ou o que tens na garagem — gasolina, gasóleo ou elétrico." },
      { title: "Acesso Pro completo", body: "O AutoVere completo, sem restrições, durante toda a duração do teste." },
      { title: "A tua conclusão", body: "Publica o resultado exatamente como o encontraste. Não o revemos antes." },
    ],
  },
  journey: {
    eyebrow: "Escolhe a viagem",
    title: "Conduz um percurso sugerido — ou um que sirva o teu teste.",
    intro:
      "Há duas formas de conduzires o teu Challenge. Ambas usam o mesmo motor de cálculo, as mesmas fontes de dados e a mesma divisão país a país.",
    options: [
      {
        label: "Opção 01",
        title: "Um percurso Challenge sugerido",
        body: "Para cada país, o AutoVere sugere três percursos, cobrindo regiões diferentes e estilos de condução diferentes.",
        bullets: ["Curto", "Médio", "Longo"],
      },
      {
        label: "Opção 02",
        title: "Testa a tua própria viagem",
        body: "Escolhe uma viagem realista que sirva o teu teste — o trajeto que já ias fazer de qualquer forma costuma ser o mais revelador. Por exemplo: Lisboa–Porto, Varsóvia–Cracóvia, Los Angeles–San Diego.",
        bullets: ["A tua rota", "O teu horário", "As tuas condições de condução"],
      },
    ],
  },
  vehicles: {
    eyebrow: "Escolhe o veículo",
    title: "Testa o carro que tens mesmo na garagem.",
    intro:
      "Escolhe o tipo de motorização e depois seleciona o carro específico entre os dados de veículos já existentes no AutoVere. Não há nenhuma lista de carros separada para o Challenge.",
    items: [
      {
        label: "Gasolina",
        body: "Consumos, preços de combustível e portagens calculados país a país ao longo do teu percurso.",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "Cupé azul estacionado numa estrada deserta ao pôr do sol",
      },
      {
        label: "Gasóleo",
        body: "Consumos em longas distâncias, além de classes de peso e de eixo onde os operadores de portagens as aplicam.",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "SUV branco numa estrada florestal coberta de neve",
      },
      {
        label: "Elétrico",
        body: "Capacidade da bateria, consumos, paragens para carregar e tarifas das redes ao longo do percurso.",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "Cabo de carregamento ligado a um carro elétrico",
      },
    ],
  },
  evCompare: {
    eyebrow: "A mesma viagem em elétrico",
    title: "Quanto teria custado esta viagem com um carro elétrico?",
    body: "Depois de calculares a tua viagem, podes percorrer o mesmo itinerário com um carro elétrico e ver o que dizem os números. Às vezes custa menos. Outras vezes, o carregamento, as portagens e os desvios mudam o panorama. O AutoVere mostra sempre o cálculo.",
    exampleLabel: "Exemplo ilustrativo — não é um resultado real do AutoVere",
    rows: [
      { label: "O teu carro", sub: "Gasóleo", amountEur: 96.4 },
      { label: "A mesma viagem em elétrico", sub: "Elétrico", amountEur: 68.2 },
    ],
    differenceLabel: "Diferença potencial",
    differenceAmountEur: 28.2,
    caveat: "Apenas valores de exemplo. Não afirmamos que um carro elétrico custa sempre menos.",
  },
  reality: {
    eyebrow: "A estimativa contra a realidade",
    title: "A parte que a maioria das ferramentas evita em silêncio.",
    body: "O Challenge compara o que o AutoVere tinha calculado antes da partida com o que a viagem realmente custou na chegada. Esta comparação é tua — mesmo nos dias em que não nos favorece.",
    exampleLabel: "Exemplo ilustrativo — não é um resultado real do AutoVere",
    calculation: { label: "Cálculo AutoVere", amountEur: 96.4 },
    actual: { label: "Custo real da viagem", amountEur: 99.1 },
    difference: { label: "Diferença", value: "+2,8%" },
    caveat: "Não prometemos uma percentagem de precisão específica. O que importa é o teu resultado.",
  },
  founder: {
    eyebrow: "O homem por trás do AutoVere",
    title: "Porque construí o AutoVere",
    opening:
      "Tudo começou com uma pergunta simples: porque é que ainda é tão difícil saber quanto vai custar mesmo uma viagem de carro?",
    paragraphs: [
      "Tenho 74 anos. Depois de mais de 40 anos na construção civil, reformei-me em 2020.",
      "Um ano depois, em vez de abrandar, comecei a construir algo completamente diferente.",
      "Durante anos percorri a Europa de carro, de lés a lés. Quanto mais viajava, mais claramente via o mesmo problema: planear uma viagem longa significava, normalmente, procurar informação em muitos sítios diferentes.",
      "Portagens. Vinhetas. Ferries. Combustível. Carregamento. Percursos diferentes. Países diferentes. Custos diferentes.",
      "Pensei que tinha de haver uma forma melhor.",
      "Foi assim que comecei a construir o AutoVere.",
      "O que começou como uma ideia pessoal tornou-se um projeto muito maior. E não o estou a fazer sozinho — também o meu filho faz parte desta viagem.",
      "Juntos, construímos o AutoVere sobre um princípio que sempre me importou muito: se vale a pena fazer algo, vale a pena fazê-lo bem.",
      "Isto significa usar dados reais, fontes oficiais, algoritmos e matemática para calcular a viagem.",
      "Sem suposições. Sem caixa negra.",
      "O objetivo é simples: dar às pessoas uma ideia mais clara de quanto uma viagem provavelmente vai custar, ainda antes de saírem de casa — e ajudá-las a tomar melhores decisões sobre o percurso, o carro e a forma de viajar.",
      "O que começou como uma simples ideia cresceu hoje muito além da Noruega e da Europa.",
      "O AutoVere já foi lançado nos Estados Unidos e no Canadá, além da Europa, com a ambição de se tornar uma plataforma global de inteligência de viagem para quem quer que se ponha a caminho.",
    ],
    closing: [
      "Mas construir algo e acreditar nisso não basta.",
      "Quero que seja testado no mundo real.",
      "Foi por isso que criámos o AutoVere Challenge.",
      "Não quero que a imprensa automóvel acredite simplesmente na minha palavra.",
      "Escolhe um carro real. Escolhe uma viagem real. Calcula-a com o AutoVere. Conduz. Depois compara o resultado com o que realmente aconteceu.",
      "Nenhuma demonstração especial. Nenhum resultado preparado antecipadamente.",
      "Só o AutoVere — e a estrada.",
      "Se funcionar bem, teremos orgulho nisso.",
      "Se alguma coisa correr mal, queremos sabê-lo.",
      "Porque a melhor forma de provar que o AutoVere funciona não é dizê-lo.",
      "É deixar que o testes tu mesmo.",
    ],
    name: "Kjell Mersland, 74 anos",
    role: "Fundador do AutoVere",
    note: "Construo o AutoVere junto com o meu filho",
    alt: "Kjell Mersland, fundador do AutoVere",
    emphasis: [
      "Tenho 74 anos.",
      "também o meu filho faz parte desta viagem.",
      "Sem suposições. Sem caixa negra.",
      "O AutoVere já foi lançado nos Estados Unidos e no Canadá, além da Europa",
      "Quero que seja testado no mundo real.",
      "É deixar que o testes tu mesmo.",
    ],
  },
  report: {
    eyebrow: "Relatório Challenge",
    title: "A tua viagem. O teu resultado.",
    body: "Depois de terminares a viagem, recebes um resultado Challenge profissional que podes citar, publicar ou usar para nos desafiar.",
    contents: [
      "Percurso",
      "Veículo",
      "Motorização",
      "Cálculo AutoVere",
      "Custo real da viagem",
      "Diferença",
      "Comparação elétrico",
      "Data",
      "ID do Challenge",
    ],
    future: "Em preparação: um resultado permanente na web, uma hiperligação partilhável e um relatório em PDF.",
    cta: "Vê esta viagem no AutoVere",
    ctaNote:
      "Depois de um Challenge, a viagem e os seus parâmetros podem ser reabertos no AutoVere normal, para continuares a explorá-la.",
  },
  register: {
    eyebrow: "Acesso para a imprensa automóvel",
    title: "Pede acesso ao AutoVere Challenge",
    body: "Fazes parte da imprensa automóvel? Gostávamos que testasses o AutoVere pessoalmente. Pede acesso ao Challenge e, assim que for aprovado, usa o AutoVere como utilizador Pro durante toda a duração do teste.",
    fields: {
      name: "Nome completo",
      email: "Email profissional",
      outlet: "Publicação ou canal",
      role: "Função",
      country: "País",
      message: "A viagem e o carro que gostarias de testar",
    },
    placeholders: {
      name: "Mariana Costa",
      email: "mariana@publicacao.pt",
      outlet: "Publicação, site ou canal",
      role: "Jornalista automóvel, piloto de testes, editor-chefe…",
      country: "Portugal",
      message: "Opcional — conta-nos o que pretendes testar",
    },
    submit: "Pede acesso ao Challenge",
    note: "Um pequeno passo de verificação garante que o acesso ao Challenge fica reservado a jornalistas em atividade. Assim que for aprovado, a tua conta passa a Pro durante o teste — sem ferramenta de imprensa separada, sem restrições.",
    successTitle: "Obrigado — recebemos o teu pedido.",
    successBody:
      "O acesso ao Challenge está a ser ativado de forma gradual. Os teus dados ficam, por agora, guardados apenas neste navegador, e entraremos em contacto contigo pessoalmente assim que a verificação estiver ativa.",
  },
  finalCta: {
    title: "Pronto para pôr o AutoVere à prova?",
    body: "Escolhe uma viagem. Escolhe o teu carro. Conduz. Compara o resultado.",
    primary: "Participa no AutoVere Challenge",
    secondary: "Conhece o AutoVere",
  },
  languageLabel: "O Challenge na tua língua",
};

const ZH: ChallengeContent = {
  meta: {
    title: "AutoVere Challenge — 用真实旅途检验AutoVere",
    description:
      "用真实的旅途、真实的车辆和真实的花费来检验AutoVere。我们诚挚邀请汽车媒体人参与计算、驾驶与对比。",
  },
  badge: "Challenge",
  hero: {
    kicker: "AutoVere Challenge",
    title: "让真实的旅途，来检验AutoVere。",
    lede: "选择您平时驾驶的车辆，选择您想验证的行程。用真正的AutoVere完成计算，实际驾驶这段旅程，再将我们的计算结果与您真实花费的费用做对比。",
    statement: ["真实的车辆。", "真实的旅途。", "真实的花费。"],
    primaryCta: "申请Challenge资格",
    secondaryCta: "了解AutoVere",
    imageCredit: "图片来源：Unsplash",
  },
  invitation: {
    eyebrow: "写给汽车媒体人的一封邀请",
    title: "请亲自验证AutoVere。",
    paragraphs: [
      "如果您从事汽车媒体工作，一定深有体会：旅途的实际花费，很少会与计算器给出的数字完全吻合。过路费、通行证、渡轮、燃油和充电费用，会随着一程程跨越国境悄悄累积——而这正是AutoVere着力解决的问题。",
      "我们并不希望您仅凭一面之词就相信这一点。",
      "我们更愿意把钥匙交到您手上：选一段真实的行程，开您车库里那辆真正的车，以Pro用户身份使用AutoVere，把这段路实际开完，再将我们的计算结果与您的真实收据对照。",
      "如果数字相近，这会是一个值得报道的故事。如果有出入，我们同样想知道——比起被悄悄略过，我们更希望这份反馈来自您。",
    ],
    signature: "Kjell Mersland — AutoVere创始人 · KM Tech Labs",
  },
  steps: {
    eyebrow: "Challenge如何进行",
    title: "从邀请到结果，六个从容的步骤。",
    intro: "这里没有任何演示环境。从第五步开始，您使用的就是与所有其他用户完全相同的AutoVere。",
    items: [
      { number: "01", title: "注册", body: "以汽车媒体身份完成注册。" },
      { number: "02", title: "审核确认", body: "AutoVere审核您的申请，并开通Challenge权限。" },
      {
        number: "03",
        title: "选择行程",
        body: "从AutoVere推荐的Challenge路线中选择，或自行决定行程。",
      },
      {
        number: "04",
        title: "选择车辆",
        body: "选择您实际测试的车辆——汽油、柴油或电动车均可。",
      },
      {
        number: "05",
        title: "计算并出发",
        body: "以Pro用户身份使用普通版AutoVere。先计算行程，再实际驾驶。",
      },
      {
        number: "06",
        title: "对比结果",
        body: "输入实际产生的旅途费用，与AutoVere的计算结果进行对比。",
      },
    ],
  },
  notCalculator: {
    eyebrow: "这是一款产品，而非媒体演示版",
    title: "您的Challenge，就在真实的AutoVere中进行。",
    body: "AutoVere Challenge是进入AutoVere、并对其加以检验的入口，而不是专为媒体打造的简化版计算器。这里没有限量版的媒体工具，没有特别搭建的测试环境，也没有另一套数字。",
    flow: [
      "Challenge落地页",
      "媒体注册",
      "AutoVere审核",
      "Challenge Pro权限",
      "普通版AutoVere产品",
      "您的Challenge结果",
    ],
    footnote: "您所检验的计算方式，与所有其他用户所使用的完全相同。",
  },
  freedom: {
    eyebrow: "您的检验，您来定义",
    title: "自由选择您想检验的行程。",
    lines: ["使用我们推荐的路线，或自行决定行程。", "开您平时驾驶的那辆车即可。"],
    body: "没有固定的及格标准，没有指定路线，也没有认可车型清单。Challenge的内容由您决定，我们唯一的期待，是您如实公开自己的发现。",
    items: [
      { title: "任意行程", body: "推荐的Challenge路线，或您原本就计划的旅途，都可以。" },
      { title: "任意车辆", body: "测试车队里的车，或您自己车库里的车——汽油、柴油、电动车均可。" },
      { title: "完整Pro权限", body: "检验期间，可不受限制地使用AutoVere的全部功能。" },
      { title: "属于您自己的结论", body: "把发现的结果如实公开。我们不会提前审核。" },
    ],
  },
  journey: {
    eyebrow: "行程选择",
    title: "驾驶推荐路线，或选择更适合您检验的路线。",
    intro: "Challenge有两种进行方式，都使用同一套计算引擎、同一批数据来源，以及同样的分国费用明细。",
    options: [
      {
        label: "选项01",
        title: "推荐的Challenge路线",
        body: "针对每个国家，AutoVere都会提供三条推荐路线，覆盖不同地区与不同驾驶方式。",
        bullets: ["短途", "中途", "长途"],
      },
      {
        label: "选项02",
        title: "检验您自己的行程",
        body: "选择一段与您的检验相符、真实可行的行程。往往您原本就打算进行的那趟旅途，最能体现真实情况。仅供参考：卑尔根—特隆赫姆、华沙—克拉科夫、洛杉矶—圣地亚哥。",
        bullets: ["自己的路线", "自己的时间安排", "自己的路况"],
      },
    ],
  },
  vehicles: {
    eyebrow: "车辆选择",
    title: "用您车库里那辆真正的车来测试。",
    intro: "先选择动力类型，再从AutoVere现有的车辆数据中选出具体车型。Challenge不设单独的车辆清单。",
    items: [
      {
        label: "汽油",
        body: "沿途各国的油耗、油价与过路费均逐一计算。",
        image:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=70",
        alt: "夕阳下停在沙漠公路旁的蓝色双门轿跑车",
      },
      {
        label: "柴油",
        body: "计算长途油耗的同时，也会考虑部分运营商采用的车重与轴数分级收费。",
        image:
          "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1200&q=70",
        alt: "行驶在积雪森林道路上的白色SUV",
      },
      {
        label: "电动车",
        body: "计算电池容量、电耗、沿途所需的充电次数，以及沿线充电网络的费用。",
        image:
          "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1200&q=70",
        alt: "正在充电的电动车充电线",
      },
    ],
  },
  evCompare: {
    eyebrow: "同一行程，换成电动车",
    title: "如果换成电动车，这趟旅途会花多少钱？",
    body: "在计算完您自己的行程后，您可以用同一条路线再计算一次电动车版本，看看结果如何。有时电动车更省钱，有时充电、过路费和绕行又会改变结果。无论哪种情况，AutoVere都会如实呈现计算结果。",
    exampleLabel: "示例数据——并非AutoVere的真实计算结果",
    rows: [
      { label: "您的车", sub: "柴油", amountEur: 96.4 },
      { label: "同一行程换成电动车", sub: "电动车", amountEur: 68.2 },
    ],
    differenceLabel: "预计差额",
    differenceAmountEur: 28.2,
    caveat: "以上仅为示例，我们并不认为电动车总是更划算。",
  },
  reality: {
    eyebrow: "预估与实际",
    title: "大多数工具悄悄回避的部分。",
    body: "Challenge会将您出发前AutoVere计算出的费用，与旅途结束后实际产生的花费进行对比。这个结果属于您自己——即便某一天的结果并不那么有利于我们。",
    exampleLabel: "示例数据——并非AutoVere的真实计算结果",
    calculation: { label: "AutoVere计算结果", amountEur: 96.4 },
    actual: { label: "实际旅途花费", amountEur: 99.1 },
    difference: { label: "差额", value: "+2.8%" },
    caveat: "我们不会承诺某个具体的准确率。真正重要的，是您自己得出的结果。",
  },
  founder: {
    eyebrow: "AutoVere背后的人",
    title: "我为什么要做AutoVere",
    opening:
      "一切始于一个很简单的问题：为什么直到今天，弄清楚一趟自驾旅途究竟要花多少钱，依然这么难？",
    paragraphs: [
      "我今年74岁。在建筑行业工作了40多年后，我于2020年退休。",
      "一年后，我没有选择安享清闲，而是开始着手做一件完全不同的事情。",
      "多年来，我一直驾车穿梭在欧洲各地旅行。走得越多，越发现同一个问题反复出现：规划一趟长途旅行，往往需要在好几个不同的地方分别查找信息。",
      "过路费、通行证、渡轮、燃油、电动车充电——换一条路线、换一个国家，费用就完全不同。",
      "我当时就想，一定有更好的办法。",
      "于是，我开始着手打造AutoVere。",
      "这个最初只是个人想法的项目，如今已经发展成规模大得多的事业——而这并非我一个人的努力，我的儿子也一路参与其中。",
      "我们始终坚持一个对我而言一直很重要的原则：一件事如果值得做，就应该认真做好。",
      "这意味着，我们使用真实数据、官方信息来源、算法与数学模型来计算旅途费用。",
      "不是凭猜测，也不是一个黑箱。",
      "我们的目标很简单：让人们在出发前，就能更清楚地知道这趟旅途大概要花多少钱，并帮助他们在路线、车辆和行程安排上做出更好的选择。",
      "从一个简单的想法起步的这个项目，如今已经走出了挪威，走出了欧洲。",
      "AutoVere目前已经在欧洲、美国和加拿大同步上线，我们的目标，是成为服务全球自驾出行人群的汽车信息平台。",
    ],
    closing: [
      "但仅仅把一件事做出来，并且相信它，还远远不够。",
      "我希望它能在真实的世界里接受检验。",
      "这正是我们创建AutoVere Challenge的原因。",
      "我不希望汽车媒体人只是听我一面之词。",
      "选一辆真实的车，选一段真实的旅途，用AutoVere完成计算，实际把它开完，再把结果和真实发生的情况做对比。",
      "没有特别准备的演示，也没有提前安排好的结果。",
      "只有AutoVere，和这条路。",
      "如果结果不错，我们会为此感到骄傲。",
      "如果哪里出了错，我们也想知道。",
      "因为证明AutoVere真正有用的最好方式，从来都不是靠我们自己说。",
      "而是让您亲自试一试。",
    ],
    name: "Kjell Mersland，74岁",
    role: "AutoVere创始人",
    note: "与儿子一起打造AutoVere",
    alt: "AutoVere创始人 Kjell Mersland",
    emphasis: [
      "我今年74岁。",
      "我的儿子也一路参与其中。",
      "不是凭猜测，也不是一个黑箱。",
      "AutoVere目前已经在欧洲、美国和加拿大同步上线",
      "我希望它能在真实的世界里接受检验。",
      "而是让您亲自试一试。",
    ],
  },
  report: {
    eyebrow: "Challenge报告",
    title: "您的旅途，您的结果。",
    body: "旅途结束后，您将获得一份正式的Challenge结果，可供引用、公开发表，也可以据此对我们提出质疑。",
    contents: [
      "路线",
      "车辆",
      "动力类型",
      "AutoVere计算结果",
      "实际旅途花费",
      "差额",
      "电动车对比",
      "日期",
      "Challenge编号",
    ],
    future: "计划推出：常驻网页版结果、可分享链接，以及PDF报告。",
    cta: "在AutoVere中查看这趟旅途",
    ctaNote: "Challenge结束后，这趟旅途及其参数仍可在普通版AutoVere中随时重新打开，继续探索。",
  },
  register: {
    eyebrow: "汽车媒体专属通道",
    title: "申请AutoVere Challenge资格",
    body: "您是汽车媒体从业者吗？我们很期待您能亲自体验AutoVere。申请Challenge资格，获批后即可在检验期间以Pro用户身份使用AutoVere。",
    fields: {
      name: "姓名",
      email: "工作邮箱",
      outlet: "媒体或频道名称",
      role: "职务",
      country: "国家",
      message: "您想测试的行程与车辆",
    },
    placeholders: {
      name: "李明",
      email: "liming@publication.com",
      outlet: "媒体、网站或频道名称",
      role: "汽车媒体人、评测人、编辑等",
      country: "中国",
      message: "选填——欢迎告诉我们您的测试计划",
    },
    submit: "申请Challenge资格",
    note: "简单的审核流程，是为了让Challenge权限真正提供给在职媒体人。审核通过后，您的账户将在检验期间升级为Pro——没有单独的媒体工具，也没有额外限制。",
    successTitle: "感谢您，我们已收到您的申请。",
    successBody: "Challenge权限正在逐步开放中。您目前填写的信息暂时仅保存在此浏览器中，审核开放后我们会第一时间与您联系。",
  },
  finalCta: {
    title: "准备好亲自检验AutoVere了吗？",
    body: "选一段行程，选一辆车，出发，再对比结果。",
    primary: "加入AutoVere Challenge",
    secondary: "了解AutoVere",
  },
  languageLabel: "切换到您的语言查看Challenge",
};

export const CHALLENGE_LANGS = [
  { prefix: "no", label: "Norsk", flag: "🇳🇴" },
  { prefix: "se", label: "Svenska", flag: "🇸🇪" },
  { prefix: "dk", label: "Dansk", flag: "🇩🇰" },
  { prefix: "fi", label: "Suomi", flag: "🇫🇮" },
  { prefix: "us", label: "US English", flag: "🇺🇸" },
  { prefix: "ca", label: "Canada (EN)", flag: "🇨🇦" },
  { prefix: "de", label: "Deutsch", flag: "🇩🇪" },
  { prefix: "nl", label: "Nederlands", flag: "🇳🇱" },
  { prefix: "fr", label: "Français", flag: "🇫🇷" },
  { prefix: "pl", label: "Polski", flag: "🇵🇱" },
  { prefix: "es", label: "Español", flag: "🇪🇸" },
  { prefix: "it", label: "Italiano", flag: "🇮🇹" },
  { prefix: "pt", label: "Português", flag: "🇵🇹" },
  { prefix: "ja", label: "日本語", flag: "🇯🇵" },
  { prefix: "zh", label: "简体中文", flag: "🇨🇳" },
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
  ca: "CAD",
  de: "EUR",
  nl: "EUR",
  fr: "EUR",
  pl: "PLN",
  es: "EUR",
  it: "EUR",
  pt: "EUR",
  ja: "EUR",
  zh: "EUR",
};

/** Per-language overrides. Missing languages fall back to English. */
const CHALLENGE_CONTENT_BY_LANG: Partial<Record<ChallengeLang, ChallengeContent>> = {
  no: NO,
  se: SE,
  dk: DK,
  fi: FI,
  us: US,
  de: DE,
  nl: NL,
  fr: FR,
  pl: PL,
  es: ES,
  it: IT,
  pt: PT,
  ja: JA,
  zh: ZH,
};

export function challengeContent(lang?: string | undefined): ChallengeContent {
  if (lang && isChallengeLang(lang)) return CHALLENGE_CONTENT_BY_LANG[lang] ?? EN;
  return EN;
}

export const CHALLENGE_EN = EN;
