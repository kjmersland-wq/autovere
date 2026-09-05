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
      { label: "Bilen din", sub: "Diesel", value: "€96,40" },
      { label: "Samme reise med elbil", sub: "Elektrisk", value: "€68,20" },
    ],
    differenceLabel: "Mulig differanse",
    differenceValue: "€28,20",
    caveat: "Kun eksempeltall. Vi påstår ikke at elbil alltid er billigere.",
  },
  reality: {
    eyebrow: "Beregning møter virkelighet",
    title: "Delen de fleste verktøy stille unngår.",
    body: "Challengen sammenligner det AutoVere beregnet før du kjørte av gårde, med det reisen faktisk kostet når du var fremme. Den sammenligningen tilhører deg — også de dagene den ikke smigrer oss.",
    exampleLabel: "Illustrerende eksempel — ikke et reelt AutoVere-resultat",
    calculation: { label: "AutoVere-beregning", value: "€96,40" },
    actual: { label: "Faktisk reisekostnad", value: "€99,10" },
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

/** Per-language overrides. Missing languages fall back to English. */
const CHALLENGE_CONTENT_BY_LANG: Partial<Record<ChallengeLang, ChallengeContent>> = {
  no: NO,
};

export function challengeContent(lang?: string | undefined): ChallengeContent {
  if (lang && isChallengeLang(lang)) return CHALLENGE_CONTENT_BY_LANG[lang] ?? EN;
  return EN;
}

export const CHALLENGE_EN = EN;
