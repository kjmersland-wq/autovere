import type { Locale } from "./i18n";

export type PartnerCopy = {
  navLink: string;
  header: { visitWebsite: (name: string) => string; partnerLabel: string };
  page: {
    eyebrow: string;
    title: string;
    intro: string;
    proudStatement: string;
    whyTitle: string;
    why1Title: string;
    why1Body: string;
    why2Title: string;
    why2Body: string;
    why3Title: string;
    why3Body: string;
    stepsTitle: string;
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step3Title: string;
    step3Body: string;
    previewLabel: string;
    previewCaption: string;
    directoryTitle: string;
    directoryEmptyTitle: string;
    directoryEmptyBody: string;
    memberBenefit: (percent: number) => string;
    visitSite: string;
    ctaTitle: string;
    ctaText: string;
    ctaButton: string;
    back: string;
    checkoutBanner: (code: string, percent: number) => string;
  };
  demo: { name: string; country: string; note: string };
};

export const en: PartnerCopy = {
  navLink: "Partners",
  header: { visitWebsite: (name) => `Visit ${name}'s official website (opens in a new tab)`, partnerLabel: "Partner" },
  page: {
    eyebrow: "AUTOVERE PARTNERS",
    title: "Give your members 25% off AutoVere Pro.",
    intro: "AutoVere is offering motoring, EV, motorhome, caravan, touring and travel organisations a simple way to give their members something genuinely useful: real trip costs before they set off, and 25% off AutoVere Pro to make it an easy yes.",
    proudStatement: "We're proud to work with organisations that help their members travel further, smarter and with fewer surprises.",
    whyTitle: "Why partner with AutoVere?",
    why1Title: "A useful member benefit",
    why1Body: "Give your members something they'll actually use when they're planning and taking journeys — real toll, vignette, fuel and charging costs, not guesswork.",
    why2Title: "Simple for your organisation",
    why2Body: "AutoVere handles the technology, the subscriptions and the member experience. There's no software to build and no billing to manage — you simply share the benefit with your community.",
    why3Title: "Built for people who travel",
    why3Body: "AutoVere helps travellers understand what a journey will really cost, from tolls and vignettes to fuel and EV charging, before they leave home.",
    stepsTitle: "How it works",
    step1Title: "1. We set up your member benefit",
    step1Body: "AutoVere creates your partner arrangement and member access — no work required on your side.",
    step2Title: "2. You share it with your members",
    step2Body: "We give you the member link and code to share however suits your organisation best.",
    step3Title: "3. Your members get 25% off AutoVere Pro",
    step3Body: "Simple, useful, and ready to use from day one.",
    previewLabel: "Here's how it looks",
    previewCaption: "Demonstration — example only. This organisation is fictional.",
    directoryTitle: "Our Organisation Partners",
    directoryEmptyTitle: "Our partner network is growing",
    directoryEmptyBody: "We're building a growing network of organisations that want to give their members more value when they travel. If you'd like to be part of it, we'd love to hear from you.",
    memberBenefit: (percent) => `${percent}% member benefit`,
    visitSite: "Visit official website",
    ctaTitle: "Interested in becoming a partner?",
    ctaText: "We'd love to hear from you and explore how AutoVere could become a useful benefit for your members.",
    ctaButton: "Let's talk",
    back: "Back to AutoVere",
    checkoutBanner: (code, percent) => `Organisation member code ${code} → ${percent}% member discount applied`,
  },
  demo: { name: "European Touring Association", country: "Norway", note: "Fictional example organisation, for demonstration only." },
};

export const de: PartnerCopy = {
  navLink: "Partner",
  header: { visitWebsite: (name) => `Offizielle Website von ${name} besuchen (öffnet in neuem Tab)`, partnerLabel: "Partner" },
  page: {
    eyebrow: "AUTOVERE PARTNER",
    title: "Schenken Sie Ihren Mitgliedern 25 % Rabatt auf AutoVere Pro.",
    intro: "AutoVere bietet Motoring-, E-Mobilitäts-, Wohnmobil-, Caravan-, Touring- und Reiseorganisationen eine einfache Möglichkeit, ihren Mitgliedern etwas wirklich Nützliches zu bieten: die echten Reisekosten schon vor der Abfahrt, plus 25 % Rabatt auf AutoVere Pro, der die Entscheidung leicht macht.",
    proudStatement: "Wir sind stolz, mit Organisationen zusammenzuarbeiten, die ihren Mitgliedern helfen, weiter, klüger und mit weniger Überraschungen zu reisen.",
    whyTitle: "Warum mit AutoVere zusammenarbeiten?",
    why1Title: "Ein Mitgliedervorteil, der wirklich genutzt wird",
    why1Body: "Schenken Sie Ihren Mitgliedern etwas, das sie bei der Reiseplanung tatsächlich einsetzen: echte Maut-, Vignetten-, Kraftstoff- und Ladekosten statt Vermutungen.",
    why2Title: "Denkbar einfach für Ihre Organisation",
    why2Body: "AutoVere kümmert sich um die Technik, die Abonnements und das Mitgliedererlebnis. Sie müssen keine Software bauen und keine Abrechnung verwalten — Sie teilen den Vorteil einfach mit Ihrer Community.",
    why3Title: "Gemacht für Menschen, die unterwegs sind",
    why3Body: "AutoVere zeigt Reisenden, was eine Fahrt wirklich kostet — Maut, Vignetten, Kraftstoff und Laden — noch bevor sie losfahren.",
    stepsTitle: "So funktioniert es",
    step1Title: "1. Wir richten Ihren Mitgliedervorteil ein",
    step1Body: "AutoVere erstellt Ihre Partnerschaft und den Mitgliederzugang — ohne Aufwand auf Ihrer Seite.",
    step2Title: "2. Sie teilen ihn mit Ihren Mitgliedern",
    step2Body: "Wir geben Ihnen den Mitgliedslink und -code, den Sie teilen können, wie es für Ihre Organisation am besten passt.",
    step3Title: "3. Ihre Mitglieder erhalten 25 % Rabatt auf AutoVere Pro",
    step3Body: "Einfach, nützlich und ab dem ersten Tag einsatzbereit.",
    previewLabel: "So sieht es aus",
    previewCaption: "Demonstration — nur Beispiel. Diese Organisation ist fiktiv.",
    directoryTitle: "Unsere Organisationspartner",
    directoryEmptyTitle: "Unser Partnernetzwerk wächst",
    directoryEmptyBody: "Wir bauen ein wachsendes Netzwerk von Organisationen auf, die ihren Mitgliedern mehr Wert auf Reisen bieten möchten. Wenn Sie dabei sein möchten, freuen wir uns, von Ihnen zu hören.",
    memberBenefit: (percent) => `${percent} % Mitgliedervorteil`,
    visitSite: "Offizielle Website besuchen",
    ctaTitle: "Interesse an einer Partnerschaft?",
    ctaText: "Wir freuen uns, von Ihnen zu hören und gemeinsam zu prüfen, wie AutoVere ein nützlicher Vorteil für Ihre Mitglieder werden kann.",
    ctaButton: "Lassen Sie uns sprechen",
    back: "Zurück zu AutoVere",
    checkoutBanner: (code, percent) => `Mitgliedscode ${code} → ${percent} % Mitgliederrabatt angewendet`,
  },
  demo: { name: "European Touring Association", country: "Norwegen", note: "Fiktive Beispielorganisation, nur zu Demonstrationszwecken." },
};

export const nl: PartnerCopy = {
  navLink: "Partners",
  header: { visitWebsite: (name) => `Bezoek de officiële website van ${name} (opent in nieuw tabblad)`, partnerLabel: "Partner" },
  page: {
    eyebrow: "AUTOVERE PARTNERS",
    title: "Geef uw leden 25% korting op AutoVere Pro.",
    intro: "AutoVere biedt motor-, EV-, camper-, caravan-, touring- en reisorganisaties een eenvoudige manier om hun leden iets echt nuttigs te geven: de werkelijke reiskosten al vóór vertrek, plus 25% korting op AutoVere Pro die de keuze makkelijk maakt.",
    proudStatement: "We zijn er trots op samen te werken met organisaties die hun leden helpen verder, slimmer en met minder verrassingen te reizen.",
    whyTitle: "Waarom samenwerken met AutoVere?",
    why1Title: "Een ledenvoordeel dat echt gebruikt wordt",
    why1Body: "Geef uw leden iets dat ze daadwerkelijk gebruiken bij het plannen en maken van reizen — echte tol-, vignet-, brandstof- en laadkosten, geen giswerk.",
    why2Title: "Eenvoudig voor uw organisatie",
    why2Body: "AutoVere regelt de techniek, de abonnementen en de ledenervaring. U hoeft geen software te bouwen en geen facturatie te beheren — u deelt het voordeel gewoon met uw achterban.",
    why3Title: "Gemaakt voor mensen die reizen",
    why3Body: "AutoVere laat reizigers zien wat een rit werkelijk kost — tol, vignetten, brandstof en laden — nog voordat ze vertrekken.",
    stepsTitle: "Zo werkt het",
    step1Title: "1. Wij stellen uw ledenvoordeel in",
    step1Body: "AutoVere regelt het partnerschap en de ledentoegang — zonder werk aan uw kant.",
    step2Title: "2. U deelt het met uw leden",
    step2Body: "We geven u de ledenlink en -code, die u kunt delen op de manier die het beste bij uw organisatie past.",
    step3Title: "3. Uw leden krijgen 25% korting op AutoVere Pro",
    step3Body: "Eenvoudig, nuttig en direct klaar voor gebruik.",
    previewLabel: "Zo ziet het eruit",
    previewCaption: "Demonstratie — alleen een voorbeeld. Deze organisatie is fictief.",
    directoryTitle: "Onze organisatiepartners",
    directoryEmptyTitle: "Ons partnernetwerk groeit",
    directoryEmptyBody: "We bouwen aan een groeiend netwerk van organisaties die hun leden meer waarde willen bieden tijdens het reizen. Wilt u daar deel van uitmaken? We horen graag van u.",
    memberBenefit: (percent) => `${percent}% ledenvoordeel`,
    visitSite: "Bezoek officiële website",
    ctaTitle: "Interesse om partner te worden?",
    ctaText: "We horen graag van u en verkennen samen hoe AutoVere een nuttig voordeel kan worden voor uw leden.",
    ctaButton: "Laten we praten",
    back: "Terug naar AutoVere",
    checkoutBanner: (code, percent) => `Ledencode van organisatie ${code} → ${percent}% ledenkorting toegepast`,
  },
  demo: { name: "European Touring Association", country: "Noorwegen", note: "Fictieve voorbeeldorganisatie, uitsluitend ter demonstratie." },
};

export const no: PartnerCopy = {
  navLink: "Partnere",
  header: { visitWebsite: (name) => `Besøk ${name}s offisielle nettside (åpnes i ny fane)`, partnerLabel: "Partner" },
  page: {
    eyebrow: "AUTOVERE PARTNERE",
    title: "Gi medlemmene dine 25 % rabatt på AutoVere Pro.",
    intro: "AutoVere gir bilorganisasjoner, elbilforeninger, bobil-, campingvogn-, tur- og reiseorganisasjoner en enkel måte å gi medlemmene noe genuint nyttig: de faktiske reisekostnadene før de kjører av gårde, pluss 25 % rabatt på AutoVere Pro som gjør valget lett.",
    proudStatement: "Vi er stolte av å samarbeide med organisasjoner som hjelper medlemmene sine å reise lenger, smartere og med færre overraskelser.",
    whyTitle: "Hvorfor samarbeide med AutoVere?",
    why1Title: "En medlemsfordel som faktisk blir brukt",
    why1Body: "Gi medlemmene noe de faktisk bruker når de planlegger og legger ut på tur — reelle bompenge-, vignett-, drivstoff- og ladekostnader, ikke gjetning.",
    why2Title: "Enkelt for organisasjonen deres",
    why2Body: "AutoVere tar seg av teknologien, abonnementene og medlemsopplevelsen. Dere trenger ikke bygge noe eller administrere fakturering — dere deler bare fordelen med medlemmene deres.",
    why3Title: "Laget for folk som reiser",
    why3Body: "AutoVere hjelper reisende å forstå hva en tur faktisk vil koste — bompenger, vignetter, drivstoff og lading — før de kjører hjemmefra.",
    stepsTitle: "Slik fungerer det",
    step1Title: "1. Vi setter opp medlemsfordelen deres",
    step1Body: "AutoVere oppretter partnerskapet og medlemstilgangen — uten arbeid på deres side.",
    step2Title: "2. Dere deler den med medlemmene",
    step2Body: "Vi gir dere medlemslenken og -koden, som dere kan dele slik det passer best for organisasjonen deres.",
    step3Title: "3. Medlemmene får 25 % rabatt på AutoVere Pro",
    step3Body: "Enkelt, nyttig og klart til bruk fra dag én.",
    previewLabel: "Slik ser det ut",
    previewCaption: "Demonstrasjon — kun eksempel. Denne organisasjonen er fiktiv.",
    directoryTitle: "Våre organisasjonspartnere",
    directoryEmptyTitle: "Partnernettverket vårt vokser",
    directoryEmptyBody: "Vi bygger et voksende nettverk av organisasjoner som ønsker å gi medlemmene sine mer verdi på reise. Vil dere være med? Vi hører gjerne fra dere.",
    memberBenefit: (percent) => `${percent} % medlemsfordel`,
    visitSite: "Besøk offisiell nettside",
    ctaTitle: "Interessert i å bli partner?",
    ctaText: "Vi hører gjerne fra dere, så finner vi sammen ut hvordan AutoVere kan bli en nyttig fordel for medlemmene deres.",
    ctaButton: "La oss snakke sammen",
    back: "Tilbake til AutoVere",
    checkoutBanner: (code, percent) => `Medlemskode ${code} → ${percent} % medlemsrabatt er lagt til`,
  },
  demo: { name: "European Touring Association", country: "Norge", note: "Fiktiv eksempelorganisasjon, kun til demonstrasjon." },
};

export const pl: PartnerCopy = {
  navLink: "Partnerzy",
  header: { visitWebsite: (name) => `Odwiedź oficjalną stronę ${name} (otwiera się w nowej karcie)`, partnerLabel: "Partner" },
  page: {
    eyebrow: "PARTNERZY AUTOVERE",
    title: "Podaruj swoim członkom 25% zniżki na AutoVere Pro.",
    intro: "AutoVere daje organizacjom motoryzacyjnym, elektromobilnym, kamperowym, caravaningowym, turystycznym i podróżniczym prosty sposób na zaoferowanie członkom czegoś naprawdę przydatnego: rzeczywistych kosztów podróży jeszcze przed wyjazdem, plus 25% zniżki na AutoVere Pro, dzięki czemu decyzja jest łatwa.",
    proudStatement: "Jesteśmy dumni ze współpracy z organizacjami, które pomagają swoim członkom podróżować dalej, mądrzej i z mniejszą liczbą niespodzianek.",
    whyTitle: "Dlaczego warto współpracować z AutoVere?",
    why1Title: "Korzyść, z której członkowie naprawdę skorzystają",
    why1Body: "Daj swoim członkom coś, czego rzeczywiście użyją, planując i odbywając podróże — prawdziwe koszty opłat drogowych, winiet, paliwa i ładowania, a nie zgadywanie.",
    why2Title: "Proste dla waszej organizacji",
    why2Body: "AutoVere zajmuje się technologią, subskrypcjami i obsługą członków. Nie musicie budować żadnego oprogramowania ani zarządzać rozliczeniami — po prostu udostępniacie korzyść swojej społeczności.",
    why3Title: "Stworzone dla osób, które podróżują",
    why3Body: "AutoVere pomaga podróżnym zrozumieć, ile naprawdę będzie kosztować podróż — opłaty drogowe, winiety, paliwo i ładowanie — jeszcze zanim wyruszą z domu.",
    stepsTitle: "Jak to działa",
    step1Title: "1. Konfigurujemy waszą korzyść członkowską",
    step1Body: "AutoVere tworzy partnerstwo i dostęp dla członków — bez żadnej pracy po waszej stronie.",
    step2Title: "2. Udostępniacie ją swoim członkom",
    step2Body: "Przekazujemy wam link i kod członkowski, którymi możecie podzielić się w sposób najlepiej pasujący do waszej organizacji.",
    step3Title: "3. Wasi członkowie otrzymują 25% zniżki na AutoVere Pro",
    step3Body: "Prosto, użytecznie i gotowe do użycia od pierwszego dnia.",
    previewLabel: "Tak to wygląda",
    previewCaption: "Demonstracja — wyłącznie przykład. Ta organizacja jest fikcyjna.",
    directoryTitle: "Nasi partnerzy organizacyjni",
    directoryEmptyTitle: "Nasza sieć partnerów rośnie",
    directoryEmptyBody: "Budujemy rosnącą sieć organizacji, które chcą dać swoim członkom więcej wartości w podróży. Jeśli chcecie do niej dołączyć, chętnie się z wami skontaktujemy.",
    memberBenefit: (percent) => `${percent}% korzyści dla członków`,
    visitSite: "Odwiedź oficjalną stronę",
    ctaTitle: "Chcecie zostać partnerem?",
    ctaText: "Chętnie się z wami skontaktujemy i wspólnie sprawdzimy, jak AutoVere może stać się przydatną korzyścią dla waszych członków.",
    ctaButton: "Porozmawiajmy",
    back: "Powrót do AutoVere",
    checkoutBanner: (code, percent) => `Kod członkowski organizacji ${code} → zastosowano ${percent}% zniżki dla członków`,
  },
  demo: { name: "European Touring Association", country: "Norwegia", note: "Fikcyjna organizacja przykładowa, wyłącznie do demonstracji." },
};

export const sv: PartnerCopy = {
  navLink: "Partners",
  header: { visitWebsite: (name) => `Besök ${name}s officiella webbplats (öppnas i ny flik)`, partnerLabel: "Partner" },
  page: {
    eyebrow: "AUTOVERE PARTNERS",
    title: "Ge dina medlemmar 25 % rabatt på AutoVere Pro.",
    intro: "AutoVere ger bilorganisationer, elbilsföreningar, husbils-, husvagns-, touring- och reseorganisationer ett enkelt sätt att ge sina medlemmar något genuint användbart: de verkliga resekostnaderna redan innan de kör iväg, plus 25 % rabatt på AutoVere Pro som gör valet enkelt.",
    proudStatement: "Vi är stolta över att samarbeta med organisationer som hjälper sina medlemmar att resa längre, smartare och med färre överraskningar.",
    whyTitle: "Varför samarbeta med AutoVere?",
    why1Title: "En medlemsförmån som faktiskt används",
    why1Body: "Ge era medlemmar något de faktiskt använder när de planerar och genomför resor — verkliga kostnader för vägtullar, vinjetter, bränsle och laddning, inte gissningar.",
    why2Title: "Enkelt för er organisation",
    why2Body: "AutoVere sköter tekniken, abonnemangen och medlemsupplevelsen. Ni behöver inte bygga någon programvara eller hantera fakturering — ni delar helt enkelt förmånen med er gemenskap.",
    why3Title: "Byggt för människor som reser",
    why3Body: "AutoVere hjälper resenärer att förstå vad en resa verkligen kommer att kosta — vägtullar, vinjetter, bränsle och laddning — redan innan de åker hemifrån.",
    stepsTitle: "Så här fungerar det",
    step1Title: "1. Vi sätter upp er medlemsförmån",
    step1Body: "AutoVere skapar partnerskapet och medlemsåtkomsten — utan arbete på er sida.",
    step2Title: "2. Ni delar den med era medlemmar",
    step2Body: "Vi ger er medlemslänken och koden, som ni kan dela på det sätt som passar er organisation bäst.",
    step3Title: "3. Era medlemmar får 25 % rabatt på AutoVere Pro",
    step3Body: "Enkelt, användbart och klart att använda från dag ett.",
    previewLabel: "Så här ser det ut",
    previewCaption: "Demonstration — endast exempel. Denna organisation är fiktiv.",
    directoryTitle: "Våra organisationspartners",
    directoryEmptyTitle: "Vårt partnernätverk växer",
    directoryEmptyBody: "Vi bygger ett växande nätverk av organisationer som vill ge sina medlemmar mer värde när de reser. Vill ni vara med? Vi hör gärna av oss till er.",
    memberBenefit: (percent) => `${percent} % medlemsförmån`,
    visitSite: "Besök officiell webbplats",
    ctaTitle: "Intresserad av att bli partner?",
    ctaText: "Vi hör gärna av oss och utforskar tillsammans hur AutoVere kan bli en användbar förmån för era medlemmar.",
    ctaButton: "Låt oss prata",
    back: "Tillbaka till AutoVere",
    checkoutBanner: (code, percent) => `Medlemskod ${code} → ${percent} % medlemsrabatt tillämpad`,
  },
  demo: { name: "European Touring Association", country: "Norge", note: "Fiktiv exempelorganisation, endast för demonstration." },
};

export const fr: PartnerCopy = {
  navLink: "Partenaires",
  header: { visitWebsite: (name) => `Visiter le site officiel de ${name} (ouvre un nouvel onglet)`, partnerLabel: "Partenaire" },
  page: {
    eyebrow: "PARTENAIRES AUTOVERE",
    title: "Offrez à vos membres 25 % de réduction sur AutoVere Pro.",
    intro: "AutoVere offre aux organisations automobiles, de mobilité électrique, de camping-car, de caravaning, de tourisme et de voyage un moyen simple d'apporter à leurs membres quelque chose de vraiment utile : le coût réel de leurs trajets avant même de partir, avec en plus 25 % de réduction sur AutoVere Pro qui rend la décision facile.",
    proudStatement: "Nous sommes fiers de collaborer avec des organisations qui aident leurs membres à voyager plus loin, plus intelligemment et avec moins de surprises.",
    whyTitle: "Pourquoi devenir partenaire d'AutoVere ?",
    why1Title: "Un avantage membre réellement utilisé",
    why1Body: "Offrez à vos membres quelque chose qu'ils utiliseront vraiment en planifiant leurs trajets — les coûts réels de péages, vignettes, carburant et recharge, sans avoir à deviner.",
    why2Title: "Simple pour votre organisation",
    why2Body: "AutoVere s'occupe de la technologie, des abonnements et de l'expérience membre. Vous n'avez aucun logiciel à développer ni aucune facturation à gérer — vous partagez simplement l'avantage avec votre communauté.",
    why3Title: "Pensé pour les personnes qui voyagent",
    why3Body: "AutoVere aide les voyageurs à savoir ce qu'un trajet va vraiment coûter — péages, vignettes, carburant et recharge — avant même de quitter la maison.",
    stepsTitle: "Comment ça marche",
    step1Title: "1. Nous mettons en place votre avantage membre",
    step1Body: "AutoVere crée votre partenariat et l'accès pour vos membres — sans aucun travail de votre côté.",
    step2Title: "2. Vous le partagez avec vos membres",
    step2Body: "Nous vous donnons le lien et le code membre, à partager comme il convient le mieux à votre organisation.",
    step3Title: "3. Vos membres bénéficient de 25 % de réduction sur AutoVere Pro",
    step3Body: "Simple, utile, et prêt à l'emploi dès le premier jour.",
    previewLabel: "Voici à quoi cela ressemble",
    previewCaption: "Démonstration — exemple uniquement. Cette organisation est fictive.",
    directoryTitle: "Nos partenaires organisationnels",
    directoryEmptyTitle: "Notre réseau de partenaires grandit",
    directoryEmptyBody: "Nous construisons un réseau grandissant d'organisations qui souhaitent apporter plus de valeur à leurs membres en voyage. Si vous souhaitez en faire partie, nous serions ravis d'échanger avec vous.",
    memberBenefit: (percent) => `${percent} % d'avantage membre`,
    visitSite: "Visiter le site officiel",
    ctaTitle: "Intéressé à devenir partenaire ?",
    ctaText: "Nous serions ravis d'échanger avec vous pour voir comment AutoVere pourrait devenir un avantage utile pour vos membres.",
    ctaButton: "Discutons-en",
    back: "Retour à AutoVere",
    checkoutBanner: (code, percent) => `Code membre ${code} → réduction membre de ${percent} % appliquée`,
  },
  demo: { name: "European Touring Association", country: "Norvège", note: "Organisation fictive d'exemple, à des fins de démonstration uniquement." },
};

export const da: PartnerCopy = {
  navLink: "Partnere",
  header: { visitWebsite: (name) => `Besøg ${name}s officielle hjemmeside (åbner i ny fane)`, partnerLabel: "Partner" },
  page: {
    eyebrow: "AUTOVERE PARTNERE",
    title: "Giv dine medlemmer 25 % rabat på AutoVere Pro.",
    intro: "AutoVere giver bilorganisationer, elbilsforeninger, autocamper-, campingvogns-, ferie- og rejseorganisationer en enkel måde at give deres medlemmer noget genuint nyttigt: de reelle rejseomkostninger, allerede før de kører af sted, plus 25 % rabat på AutoVere Pro, der gør valget let.",
    proudStatement: "Vi er stolte af at samarbejde med organisationer, der hjælper deres medlemmer med at rejse længere, smartere og med færre overraskelser.",
    whyTitle: "Hvorfor samarbejde med AutoVere?",
    why1Title: "En medlemsfordel, der rent faktisk bliver brugt",
    why1Body: "Giv jeres medlemmer noget, de faktisk bruger, når de planlægger og tager af sted — reelle omkostninger til vejafgifter, vignetter, brændstof og opladning, ikke gætværk.",
    why2Title: "Enkelt for jeres organisation",
    why2Body: "AutoVere står for teknologien, abonnementerne og medlemsoplevelsen. I skal hverken bygge software eller administrere fakturering — I deler bare fordelen med jeres fællesskab.",
    why3Title: "Skabt til mennesker, der rejser",
    why3Body: "AutoVere hjælper rejsende med at forstå, hvad en tur reelt kommer til at koste — vejafgifter, vignetter, brændstof og opladning — allerede før de kører hjemmefra.",
    stepsTitle: "Sådan fungerer det",
    step1Title: "1. Vi opsætter jeres medlemsfordel",
    step1Body: "AutoVere opretter partnerskabet og medlemsadgangen — uden arbejde på jeres side.",
    step2Title: "2. I deler den med jeres medlemmer",
    step2Body: "Vi giver jer medlemslinket og -koden, som I kan dele på den måde, der passer bedst til jeres organisation.",
    step3Title: "3. Jeres medlemmer får 25 % rabat på AutoVere Pro",
    step3Body: "Enkelt, nyttigt og klar til brug fra dag ét.",
    previewLabel: "Sådan ser det ud",
    previewCaption: "Demonstration — kun et eksempel. Denne organisation er fiktiv.",
    directoryTitle: "Vores organisationspartnere",
    directoryEmptyTitle: "Vores partnernetværk vokser",
    directoryEmptyBody: "Vi bygger et voksende netværk af organisationer, der gerne vil give deres medlemmer mere værdi på rejsen. Vil I være med, hører vi meget gerne fra jer.",
    memberBenefit: (percent) => `${percent} % medlemsfordel`,
    visitSite: "Besøg officiel hjemmeside",
    ctaTitle: "Interesseret i at blive partner?",
    ctaText: "Vi hører meget gerne fra jer og undersøger sammen, hvordan AutoVere kan blive en nyttig fordel for jeres medlemmer.",
    ctaButton: "Lad os tale sammen",
    back: "Tilbage til AutoVere",
    checkoutBanner: (code, percent) => `Medlemskode ${code} → ${percent} % medlemsrabat tilføjet`,
  },
  demo: { name: "European Touring Association", country: "Norge", note: "Fiktiv eksempelorganisation, kun til demonstration." },
};

export const partnerCopy: Record<Locale, PartnerCopy> = { en, de, nl, no, pl, sv, fr, da };
