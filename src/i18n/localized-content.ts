import type { Lang } from "@/i18n/config";

const SUPPORTED: Lang[] = ["en", "no", "de", "sv", "fr", "pl", "it", "es"];

export const resolveLang = (value?: string): Lang => {
  const candidate = (value || "en").toLowerCase().split("-")[0] as Lang;
  return SUPPORTED.includes(candidate) ? candidate : "en";
};

export const interpolate = (template: string, values: Record<string, string>) =>
  Object.entries(values).reduce(
    (acc, [key, value]) => acc.replaceAll(`{{${key}}}`, value),
    template,
  );

type UiCopy = {
  carCardMatch: string;
  carCardExplore: string;
  carMedia: {
    featuredEyebrow: string;
    featuredTitle: string;
    featuredBadge: string;
    consensusEyebrow: string;
    strengthsLabel: string;
    reservationsLabel: string;
    aiDisclaimer: string;
    moreReviewsEyebrow: string;
    moreReviewsTitle: string;
    officialEyebrow: string;
    officialTitle: string;
    trustedEyebrow: string;
    trustedTitle: string;
    trustedDisclaimer: string;
  };
  compareNext: {
    eyebrow: string;
    title: string;
    lead: string;
    tailoredFor: string;
    stepTestDrive: string;
    stepDealer: string;
    stepOfficial: string;
    stepCharging: string;
    stepIncentives: string;
  };
  continueExploring: {
    eyebrow: string;
    title: string;
    tailoredFor: string;
    lead: string;
    officialEyebrow: string;
    officialTitle: string;
    officialBody: string;
    configureEyebrow: string;
    configureTitle: string;
    configureBody: string;
    testDriveEyebrow: string;
    testDriveTitle: string;
    testDriveBody: string;
    regionEyebrow: string;
    regionTitle: string;
    regionBody: string;
    chargingEyebrow: string;
    chargingTitle: string;
    chargingBody: string;
    warrantyEyebrow: string;
    warrantyTitle: string;
    warrantyBody: string;
    open: string;
    ownershipEyebrow: string;
    ownershipTitle: string;
    whereYouLive: string;
  };
  editorialPulse: {
    title: string;
    featured: string;
    footer: string;
  };
  personalityChooser: {
    eyebrow: string;
    suggested: string;
    cta: string;
    prompt: string;
  };
  liveVideo: {
    close: string;
    watchOnYouTube: string;
    noReviews: string;
    loadError: string;
    views: string;
  };
  schema: {
    home: string;
    cars: string;
  };
};

type CarFields = {
  type: string;
  tagline: string;
  fit: string;
  tag: string;
  summary: string;
  personality: string;
  comfort: string;
  climate: string;
  practicality: string;
  ownership: string;
  strengths: string[];
  tradeoffs: string[];
  lifestyle: string;
};

type CollectionFields = {
  title: string;
  description: string;
  body: string;
};

type PersonalityFields = {
  name: string;
  tagline: string;
  description: string;
  whoYouAre: string;
  whatYouValue: string[];
  prompt: string;
};

type LearnFields = {
  title: string;
  category: string;
  excerpt: string;
  body: string[];
};

type MediaCopy = {
  consensus: string[];
  official: string[];
  trusted: string[];
};

type OwnershipText = { title: string; body: string };

export const UI_COPY: Record<Lang, UiCopy> = {
  en: {
    carCardMatch: "Match",
    carCardExplore: "Explore {{name}}",
    carMedia: {
      featuredEyebrow: "Featured video review",
      featuredTitle: "What the most trusted reviewers say.",
      featuredBadge: "Most trusted",
      consensusEyebrow: "AI reviewer consensus",
      strengthsLabel: "Reviewers agree on",
      reservationsLabel: "Honest reservations",
      aiDisclaimer:
        "Synthesised by AutoVere AI from public expert reviews. We surface consensus, not opinion.",
      moreReviewsEyebrow: "More expert reviews",
      moreReviewsTitle: "Different drivers, different lenses.",
      officialEyebrow: "Official manufacturer resources",
      officialTitle: "Explore the {{name}} directly.",
      trustedEyebrow: "Trusted external sources",
      trustedTitle: "Independent verification.",
      trustedDisclaimer:
        "AutoVere does not own these resources. Links open on the publisher's site.",
    },
    compareNext: {
      eyebrow: "Continue with confidence",
      title: "Your next calm step.",
      lead: "No pressure, no funnels. Just the right doors to walk through when you're ready.",
      tailoredFor: "Tailored for {{region}}",
      stepTestDrive: "Book a calm test drive",
      stepDealer: "Find {{brand}} near {{region}}",
      stepOfficial: "Official manufacturer page",
      stepCharging: "{{standard}} charging compatibility",
      stepIncentives: "Local incentives in {{region}}",
    },
    continueExploring: {
      eyebrow: "Continue exploring",
      title: "Your next step with the {{name}}.",
      tailoredFor: "Tailored for {{region}}",
      lead:
        "Calm, curated links to the places that matter — official, regional, and trustworthy. No noise, no pressure.",
      officialEyebrow: "Official",
      officialTitle: "{{brand}} {{name}}",
      officialBody:
        "The manufacturer's editorial page — specifications, design, and craftsmanship.",
      configureEyebrow: "Configure",
      configureTitle: "Build it your way",
      configureBody: "Trim, paint, wheels, interior — see your {{name}} take shape.",
      testDriveEyebrow: "Test drive",
      testDriveTitle: "Feel it in person",
      testDriveBody:
        "Book a calm, no-pressure test drive at a {{brand}} location near you.",
      regionEyebrow: "In {{region}}",
      regionTitle: "Nearby experience centers",
      regionBody:
        "Discover trusted {{brand}} locations and EV specialists in your region.",
      chargingEyebrow: "Charging",
      chargingTitle: "{{standard}} ecosystem",
      chargingBody:
        "Understand how this car lives with the charging network in {{region}}.",
      warrantyEyebrow: "Warranty",
      warrantyTitle: "Long-term reassurance",
      warrantyBody: "Battery, drivetrain and bodywork coverage details for {{region}}.",
      open: "Open",
      ownershipEyebrow: "Owning it in {{region}}",
      ownershipTitle: "What this car feels like where you live.",
      whereYouLive: "where you live",
    },
    editorialPulse: {
      title: "The AutoVere Pulse",
      featured: "Featured this week",
      footer:
        "Written weekly by AutoVere's editorial intelligence — calm reflections grounded in verified reviewer consensus, never hype.",
    },
    personalityChooser: {
      eyebrow: "Driving personality",
      suggested: "AutoVere often suggests",
      cta: "That's me — show my matches →",
      prompt: "I think I'm a {{name}}. {{description}} What 3 cars should I look at?",
    },
    liveVideo: {
      close: "Close",
      watchOnYouTube: "Watch on YouTube",
      noReviews: "No reviews found for this search.",
      loadError: "Couldn't load fresh reviews right now.",
      views: "views",
    },
    schema: { home: "Home", cars: "Cars" },
  },
  no: {
    carCardMatch: "Match",
    carCardExplore: "Utforsk {{name}}",
    carMedia: {
      featuredEyebrow: "Utvalgt videotest",
      featuredTitle: "Hva de mest betrodde anmelderne sier.",
      featuredBadge: "Mest betrodd",
      consensusEyebrow: "AI-konsensus fra anmeldere",
      strengthsLabel: "Anmelderne er enige om",
      reservationsLabel: "Ærlige forbehold",
      aiDisclaimer:
        "Sammenfattet av AutoVere AI fra offentlige ekspertomtaler. Vi løfter frem konsensus, ikke synsing.",
      moreReviewsEyebrow: "Flere ekspertomtaler",
      moreReviewsTitle: "Ulike førere, ulike blikk.",
      officialEyebrow: "Offisielle produsentressurser",
      officialTitle: "Utforsk {{name}} direkte.",
      trustedEyebrow: "Betrodde eksterne kilder",
      trustedTitle: "Uavhengig bekreftelse.",
      trustedDisclaimer:
        "AutoVere eier ikke disse ressursene. Lenker åpnes på utgiverens nettsted.",
    },
    compareNext: {
      eyebrow: "Gå videre med trygghet",
      title: "Ditt neste rolige steg.",
      lead: "Ingen press, ingen salgstrakter. Bare de riktige dørene å gå gjennom når du er klar.",
      tailoredFor: "Tilpasset for {{region}}",
      stepTestDrive: "Bestill en rolig prøvekjøring",
      stepDealer: "Finn {{brand}} nær {{region}}",
      stepOfficial: "Offisiell produsentside",
      stepCharging: "Kompatibilitet med {{standard}}-lading",
      stepIncentives: "Lokale insentiver i {{region}}",
    },
    continueExploring: {
      eyebrow: "Utforsk videre",
      title: "Ditt neste steg med {{name}}.",
      tailoredFor: "Tilpasset for {{region}}",
      lead:
        "Rolige, kuraterte lenker til stedene som faktisk betyr noe — offisielle, regionale og tillitsvekkende. Uten støy, uten press.",
      officialEyebrow: "Offisielt",
      officialTitle: "{{brand}} {{name}}",
      officialBody: "Produsentens egen side — spesifikasjoner, design og håndverk.",
      configureEyebrow: "Konfigurer",
      configureTitle: "Bygg den på din måte",
      configureBody: "Utstyr, lakk, felger og interiør — se {{name}} ta form.",
      testDriveEyebrow: "Prøvekjøring",
      testDriveTitle: "Kjenn den på kroppen",
      testDriveBody: "Book en rolig, uforpliktende prøvekjøring hos {{brand}} nær deg.",
      regionEyebrow: "I {{region}}",
      regionTitle: "Nærliggende opplevelsessentre",
      regionBody: "Oppdag trygge {{brand}}-steder og EV-spesialister i regionen din.",
      chargingEyebrow: "Lading",
      chargingTitle: "{{standard}}-økosystem",
      chargingBody: "Forstå hvordan denne bilen lever med ladenettet i {{region}}.",
      warrantyEyebrow: "Garanti",
      warrantyTitle: "Langsiktig trygghet",
      warrantyBody: "Detaljer om dekning for batteri, drivlinje og karosseri i {{region}}.",
      open: "Åpne",
      ownershipEyebrow: "Å eie den i {{region}}",
      ownershipTitle: "Slik føles denne bilen der du bor.",
      whereYouLive: "der du bor",
    },
    editorialPulse: {
      title: "AutoVere Pulse",
      featured: "Utvalgt denne uken",
      footer:
        "Skrevet ukentlig av AutoVeres redaksjonelle intelligens — rolige refleksjoner forankret i verifisert anmelderkonsensus, aldri hype.",
    },
    personalityChooser: {
      eyebrow: "Kjørepersonlighet",
      suggested: "AutoVere foreslår ofte",
      cta: "Det er meg — vis mine matcher →",
      prompt: "Jeg tror jeg er en {{name}}. {{description}} Hvilke tre biler bør jeg se på?",
    },
    liveVideo: {
      close: "Lukk",
      watchOnYouTube: "Se på YouTube",
      noReviews: "Fant ingen omtaler for dette søket.",
      loadError: "Kunne ikke laste ferske omtaler akkurat nå.",
      views: "visninger",
    },
    schema: { home: "Hjem", cars: "Biler" },
  },
  de: {
    carCardMatch: "Match",
    carCardExplore: "{{name}} entdecken",
    carMedia: {
      featuredEyebrow: "Ausgewählter Videotest",
      featuredTitle: "Was die vertrauenswürdigsten Tester sagen.",
      featuredBadge: "Am vertrauenswürdigsten",
      consensusEyebrow: "KI-Konsens der Tester",
      strengthsLabel: "Tester sind sich einig bei",
      reservationsLabel: "Ehrliche Vorbehalte",
      aiDisclaimer:
        "Von AutoVere AI aus öffentlichen Expertenreviews zusammengefasst. Wir zeigen Konsens, keine Meinung.",
      moreReviewsEyebrow: "Weitere Expertenreviews",
      moreReviewsTitle: "Unterschiedliche Fahrer, unterschiedliche Blickwinkel.",
      officialEyebrow: "Offizielle Herstellerquellen",
      officialTitle: "{{name}} direkt entdecken.",
      trustedEyebrow: "Vertrauenswürdige externe Quellen",
      trustedTitle: "Unabhängige Verifikation.",
      trustedDisclaimer:
        "AutoVere besitzt diese Ressourcen nicht. Links öffnen auf der Website des Herausgebers.",
    },
    compareNext: {
      eyebrow: "Mit Vertrauen weitermachen",
      title: "Ihr nächster ruhiger Schritt.",
      lead: "Kein Druck, keine Funnels. Nur die richtigen Türen, durch die Sie gehen, wenn Sie bereit sind.",
      tailoredFor: "Zugeschnitten auf {{region}}",
      stepTestDrive: "Eine entspannte Probefahrt buchen",
      stepDealer: "{{brand}} in der Nähe von {{region}} finden",
      stepOfficial: "Offizielle Herstellerseite",
      stepCharging: "{{standard}}-Ladekompatibilität",
      stepIncentives: "Lokale Förderungen in {{region}}",
    },
    continueExploring: {
      eyebrow: "Weiter entdecken",
      title: "Ihr nächster Schritt mit dem {{name}}.",
      tailoredFor: "Zugeschnitten auf {{region}}",
      lead:
        "Ruhige, kuratierte Links zu den Orten, die wirklich zählen — offiziell, regional und vertrauenswürdig. Ohne Lärm, ohne Druck.",
      officialEyebrow: "Offiziell",
      officialTitle: "{{brand}} {{name}}",
      officialBody: "Die redaktionelle Herstellerseite — Spezifikationen, Design und Handwerk.",
      configureEyebrow: "Konfigurieren",
      configureTitle: "Ganz nach Ihrem Geschmack",
      configureBody: "Ausstattung, Lack, Räder, Interieur — sehen Sie, wie Ihr {{name}} Gestalt annimmt.",
      testDriveEyebrow: "Probefahrt",
      testDriveTitle: "Persönlich erleben",
      testDriveBody: "Buchen Sie eine entspannte, druckfreie Probefahrt bei {{brand}} in Ihrer Nähe.",
      regionEyebrow: "In {{region}}",
      regionTitle: "Erlebniszentren in Ihrer Nähe",
      regionBody: "Entdecken Sie vertrauenswürdige {{brand}}-Standorte und EV-Spezialisten in Ihrer Region.",
      chargingEyebrow: "Laden",
      chargingTitle: "{{standard}}-Ökosystem",
      chargingBody: "Verstehen Sie, wie dieses Auto mit dem Ladenetz in {{region}} lebt.",
      warrantyEyebrow: "Garantie",
      warrantyTitle: "Langfristige Sicherheit",
      warrantyBody: "Details zu Batterie-, Antriebs- und Karosserieabdeckung in {{region}}.",
      open: "Öffnen",
      ownershipEyebrow: "Besitz in {{region}}",
      ownershipTitle: "So fühlt sich dieses Auto dort an, wo Sie leben.",
      whereYouLive: "wo Sie leben",
    },
    editorialPulse: {
      title: "Der AutoVere Pulse",
      featured: "Diese Woche im Fokus",
      footer:
        "Wöchentlich geschrieben von AutoVeres redaktioneller Intelligenz — ruhige Reflexionen auf Basis verifizierten Testerkonsenses, nie Hype.",
    },
    personalityChooser: {
      eyebrow: "Fahrpersönlichkeit",
      suggested: "AutoVere schlägt oft vor",
      cta: "Das bin ich — zeig mir meine Treffer →",
      prompt: "Ich glaube, ich bin ein {{name}}. {{description}} Welche drei Autos sollte ich mir ansehen?",
    },
    liveVideo: {
      close: "Schließen",
      watchOnYouTube: "Auf YouTube ansehen",
      noReviews: "Für diese Suche wurden keine Reviews gefunden.",
      loadError: "Frische Reviews konnten gerade nicht geladen werden.",
      views: "Aufrufe",
    },
    schema: { home: "Startseite", cars: "Autos" },
  },
  sv: {
    carCardMatch: "Match",
    carCardExplore: "Utforska {{name}}",
    carMedia: {
      featuredEyebrow: "Utvald videorecension",
      featuredTitle: "Vad de mest betrodda testarna säger.",
      featuredBadge: "Mest betrodd",
      consensusEyebrow: "AI-konsensus från testare",
      strengthsLabel: "Testarna är överens om",
      reservationsLabel: "Ärliga reservationer",
      aiDisclaimer:
        "Sammanfattat av AutoVere AI från offentliga expertrecensioner. Vi lyfter fram konsensus, inte åsikter.",
      moreReviewsEyebrow: "Fler expertrecensioner",
      moreReviewsTitle: "Olika förare, olika perspektiv.",
      officialEyebrow: "Officiella tillverkarresurser",
      officialTitle: "Utforska {{name}} direkt.",
      trustedEyebrow: "Betrodda externa källor",
      trustedTitle: "Oberoende verifiering.",
      trustedDisclaimer:
        "AutoVere äger inte dessa resurser. Länkar öppnas på utgivarens webbplats.",
    },
    compareNext: {
      eyebrow: "Gå vidare med trygghet",
      title: "Ditt nästa lugna steg.",
      lead: "Ingen press, inga trattar. Bara rätt dörrar att gå igenom när du är redo.",
      tailoredFor: "Anpassat för {{region}}",
      stepTestDrive: "Boka en lugn provkörning",
      stepDealer: "Hitta {{brand}} nära {{region}}",
      stepOfficial: "Officiell tillverkarsida",
      stepCharging: "Kompatibilitet med {{standard}}-laddning",
      stepIncentives: "Lokala incitament i {{region}}",
    },
    continueExploring: {
      eyebrow: "Utforska vidare",
      title: "Ditt nästa steg med {{name}}.",
      tailoredFor: "Anpassat för {{region}}",
      lead:
        "Lugna, kurerade länkar till platserna som faktiskt betyder något — officiella, regionala och pålitliga. Utan brus, utan press.",
      officialEyebrow: "Officiellt",
      officialTitle: "{{brand}} {{name}}",
      officialBody: "Tillverkarens egen sida — specifikationer, design och hantverk.",
      configureEyebrow: "Konfigurera",
      configureTitle: "Bygg den på ditt sätt",
      configureBody: "Utrustning, lack, fälgar och interiör — se hur din {{name}} tar form.",
      testDriveEyebrow: "Provkörning",
      testDriveTitle: "Känn den på riktigt",
      testDriveBody: "Boka en lugn, kravlös provkörning hos {{brand}} nära dig.",
      regionEyebrow: "I {{region}}",
      regionTitle: "Upplevelsecenter i närheten",
      regionBody: "Upptäck pålitliga {{brand}}-platser och EV-specialister i din region.",
      chargingEyebrow: "Laddning",
      chargingTitle: "{{standard}}-ekosystem",
      chargingBody: "Förstå hur bilen fungerar med laddnätet i {{region}}.",
      warrantyEyebrow: "Garanti",
      warrantyTitle: "Långsiktig trygghet",
      warrantyBody: "Detaljer om batteri-, drivline- och karosskydd i {{region}}.",
      open: "Öppna",
      ownershipEyebrow: "Att äga den i {{region}}",
      ownershipTitle: "Så känns den här bilen där du bor.",
      whereYouLive: "där du bor",
    },
    editorialPulse: {
      title: "AutoVere Pulse",
      featured: "Utvalt den här veckan",
      footer:
        "Skrivet varje vecka av AutoVeres redaktionella intelligens — lugna reflektioner förankrade i verifierad testarkonsensus, aldrig hype.",
    },
    personalityChooser: {
      eyebrow: "Körpersonlighet",
      suggested: "AutoVere föreslår ofta",
      cta: "Det är jag — visa mina matchningar →",
      prompt: "Jag tror att jag är en {{name}}. {{description}} Vilka tre bilar ska jag titta på?",
    },
    liveVideo: {
      close: "Stäng",
      watchOnYouTube: "Titta på YouTube",
      noReviews: "Inga recensioner hittades för den här sökningen.",
      loadError: "Kunde inte ladda färska recensioner just nu.",
      views: "visningar",
    },
    schema: { home: "Hem", cars: "Bilar" },
  },
  fr: {
    carCardMatch: "Match",
    carCardExplore: "Découvrir {{name}}",
    carMedia: {
      featuredEyebrow: "Vidéo d'essai à la une",
      featuredTitle: "Ce que disent les essayeurs les plus fiables.",
      featuredBadge: "Le plus fiable",
      consensusEyebrow: "Consensus IA des essayeurs",
      strengthsLabel: "Les essayeurs s'accordent sur",
      reservationsLabel: "Réserves honnêtes",
      aiDisclaimer:
        "Synthétisé par l'IA AutoVere à partir d'essais publics d'experts. Nous faisons remonter un consensus, pas une opinion.",
      moreReviewsEyebrow: "Plus d'essais d'experts",
      moreReviewsTitle: "Des conducteurs différents, des regards différents.",
      officialEyebrow: "Ressources officielles du constructeur",
      officialTitle: "Découvrir {{name}} en direct.",
      trustedEyebrow: "Sources externes de confiance",
      trustedTitle: "Vérification indépendante.",
      trustedDisclaimer:
        "AutoVere n'est pas propriétaire de ces ressources. Les liens s'ouvrent sur le site de l'éditeur.",
    },
    compareNext: {
      eyebrow: "Avancer en confiance",
      title: "Votre prochaine étape sereine.",
      lead: "Aucune pression, aucun tunnel de vente. Juste les bonnes portes à pousser quand vous êtes prêt.",
      tailoredFor: "Pensé pour {{region}}",
      stepTestDrive: "Réserver un essai serein",
      stepDealer: "Trouver {{brand}} près de {{region}}",
      stepOfficial: "Page officielle du constructeur",
      stepCharging: "Compatibilité de recharge {{standard}}",
      stepIncentives: "Aides locales en {{region}}",
    },
    continueExploring: {
      eyebrow: "Continuer à explorer",
      title: "Votre prochaine étape avec {{name}}.",
      tailoredFor: "Pensé pour {{region}}",
      lead:
        "Des liens calmes et soigneusement choisis vers les endroits qui comptent — officiels, régionaux et fiables. Sans bruit, sans pression.",
      officialEyebrow: "Officiel",
      officialTitle: "{{brand}} {{name}}",
      officialBody: "La page éditoriale du constructeur — caractéristiques, design et savoir-faire.",
      configureEyebrow: "Configurer",
      configureTitle: "Composez-la à votre façon",
      configureBody: "Finition, teinte, jantes, habitacle — voyez votre {{name}} prendre forme.",
      testDriveEyebrow: "Essai",
      testDriveTitle: "La ressentir en vrai",
      testDriveBody: "Réservez un essai calme et sans pression dans un point {{brand}} près de chez vous.",
      regionEyebrow: "En {{region}}",
      regionTitle: "Centres d'expérience à proximité",
      regionBody: "Découvrez des sites {{brand}} fiables et des spécialistes EV dans votre région.",
      chargingEyebrow: "Recharge",
      chargingTitle: "Écosystème {{standard}}",
      chargingBody: "Comprenez comment cette voiture vit avec le réseau de recharge en {{region}}.",
      warrantyEyebrow: "Garantie",
      warrantyTitle: "Sérénité sur la durée",
      warrantyBody: "Détails de couverture batterie, chaîne de traction et carrosserie en {{region}}.",
      open: "Ouvrir",
      ownershipEyebrow: "La posséder en {{region}}",
      ownershipTitle: "Ce que cette voiture donne là où vous vivez.",
      whereYouLive: "là où vous vivez",
    },
    editorialPulse: {
      title: "Le Pulse AutoVere",
      featured: "À l'honneur cette semaine",
      footer:
        "Rédigé chaque semaine par l'intelligence éditoriale d'AutoVere — des réflexions calmes ancrées dans un consensus vérifié d'essayeurs, jamais dans le battage.",
    },
    personalityChooser: {
      eyebrow: "Personnalité de conduite",
      suggested: "AutoVere suggère souvent",
      cta: "C'est moi — montrez-moi mes affinités →",
      prompt: "Je pense être un {{name}}. {{description}} Quelles trois voitures devrais-je regarder ?",
    },
    liveVideo: {
      close: "Fermer",
      watchOnYouTube: "Regarder sur YouTube",
      noReviews: "Aucun essai trouvé pour cette recherche.",
      loadError: "Impossible de charger des essais récents pour le moment.",
      views: "vues",
    },
    schema: { home: "Accueil", cars: "Voitures" },
  },
  pl: {
    carCardMatch: "Match",
    carCardExplore: "Poznaj {{name}}",
    carMedia: {
      featuredEyebrow: "Polecana wideorecenzja",
      featuredTitle: "Co mówią najbardziej zaufani testerzy.",
      featuredBadge: "Najbardziej zaufany",
      consensusEyebrow: "Konsensus testerów AI",
      strengthsLabel: "Testerzy są zgodni co do",
      reservationsLabel: "Uczciwe zastrzeżenia",
      aiDisclaimer:
        "Zsyntetyzowane przez AutoVere AI na podstawie publicznych recenzji ekspertów. Pokazujemy konsensus, nie opinię.",
      moreReviewsEyebrow: "Więcej recenzji ekspertów",
      moreReviewsTitle: "Różni kierowcy, różne perspektywy.",
      officialEyebrow: "Oficjalne materiały producenta",
      officialTitle: "Poznaj {{name}} bezpośrednio.",
      trustedEyebrow: "Zaufane źródła zewnętrzne",
      trustedTitle: "Niezależna weryfikacja.",
      trustedDisclaimer:
        "AutoVere nie jest właścicielem tych materiałów. Linki otwierają się w serwisie wydawcy.",
    },
    compareNext: {
      eyebrow: "Idź dalej z pewnością",
      title: "Twój kolejny spokojny krok.",
      lead: "Bez presji, bez lejków sprzedażowych. Tylko właściwe drzwi, przez które wejdziesz, kiedy będziesz gotowy.",
      tailoredFor: "Dopasowane do {{region}}",
      stepTestDrive: "Umów spokojną jazdę próbną",
      stepDealer: "Znajdź {{brand}} w pobliżu {{region}}",
      stepOfficial: "Oficjalna strona producenta",
      stepCharging: "Zgodność z ładowaniem {{standard}}",
      stepIncentives: "Lokalne dopłaty w {{region}}",
    },
    continueExploring: {
      eyebrow: "Odkrywaj dalej",
      title: "Twój kolejny krok z {{name}}.",
      tailoredFor: "Dopasowane do {{region}}",
      lead:
        "Spokojne, starannie dobrane linki do miejsc, które naprawdę mają znaczenie — oficjalnych, regionalnych i wiarygodnych. Bez szumu, bez presji.",
      officialEyebrow: "Oficjalnie",
      officialTitle: "{{brand}} {{name}}",
      officialBody: "Redakcyjna strona producenta — specyfikacja, wzornictwo i rzemiosło.",
      configureEyebrow: "Konfiguracja",
      configureTitle: "Skonfiguruj po swojemu",
      configureBody: "Wersja, lakier, felgi, wnętrze — zobacz, jak {{name}} nabiera kształtu.",
      testDriveEyebrow: "Jazda próbna",
      testDriveTitle: "Poczuj go na żywo",
      testDriveBody: "Umów spokojną, bezpresyjną jazdę próbną w punkcie {{brand}} blisko Ciebie.",
      regionEyebrow: "W {{region}}",
      regionTitle: "Najbliższe centra doświadczeń",
      regionBody: "Odkryj zaufane punkty {{brand}} i specjalistów EV w swoim regionie.",
      chargingEyebrow: "Ładowanie",
      chargingTitle: "Ekosystem {{standard}}",
      chargingBody: "Zrozum, jak ten samochód żyje z siecią ładowania w {{region}}.",
      warrantyEyebrow: "Gwarancja",
      warrantyTitle: "Spokój na dłużej",
      warrantyBody: "Szczegóły ochrony baterii, układu napędowego i nadwozia w {{region}}.",
      open: "Otwórz",
      ownershipEyebrow: "Posiadanie w {{region}}",
      ownershipTitle: "Jak ten samochód sprawdza się tam, gdzie mieszkasz.",
      whereYouLive: "tam, gdzie mieszkasz",
    },
    editorialPulse: {
      title: "AutoVere Pulse",
      featured: "Wyróżnione w tym tygodniu",
      footer:
        "Pisane co tydzień przez redakcyjną inteligencję AutoVere — spokojne refleksje oparte na zweryfikowanym konsensusie testerów, nigdy na hype'ie.",
    },
    personalityChooser: {
      eyebrow: "Osobowość za kierownicą",
      suggested: "AutoVere często sugeruje",
      cta: "To ja — pokaż moje dopasowania →",
      prompt: "Myślę, że jestem {{name}}. {{description}} Jakie trzy auta powinienem sprawdzić?",
    },
    liveVideo: {
      close: "Zamknij",
      watchOnYouTube: "Oglądaj na YouTube",
      noReviews: "Nie znaleziono recenzji dla tego wyszukiwania.",
      loadError: "Nie udało się teraz wczytać świeżych recenzji.",
      views: "wyświetleń",
    },
    schema: { home: "Strona główna", cars: "Samochody" },
  },
  it: {
    carCardMatch: "Match",
    carCardExplore: "Scopri {{name}}",
    carMedia: {
      featuredEyebrow: "Videorecensione in evidenza",
      featuredTitle: "Cosa dicono i tester più affidabili.",
      featuredBadge: "Il più affidabile",
      consensusEyebrow: "Consenso AI dei tester",
      strengthsLabel: "I tester concordano su",
      reservationsLabel: "Riserve sincere",
      aiDisclaimer:
        "Sintetizzato da AutoVere AI a partire da recensioni pubbliche di esperti. Facciamo emergere il consenso, non l'opinione.",
      moreReviewsEyebrow: "Altre recensioni di esperti",
      moreReviewsTitle: "Guidatori diversi, lenti diverse.",
      officialEyebrow: "Risorse ufficiali del costruttore",
      officialTitle: "Esplora {{name}} direttamente.",
      trustedEyebrow: "Fonti esterne affidabili",
      trustedTitle: "Verifica indipendente.",
      trustedDisclaimer:
        "AutoVere non possiede queste risorse. I link si aprono sul sito dell'editore.",
    },
    compareNext: {
      eyebrow: "Prosegui con fiducia",
      title: "Il tuo prossimo passo sereno.",
      lead: "Nessuna pressione, nessun funnel. Solo le porte giuste da aprire quando sei pronto.",
      tailoredFor: "Pensato per {{region}}",
      stepTestDrive: "Prenota un test drive sereno",
      stepDealer: "Trova {{brand}} vicino a {{region}}",
      stepOfficial: "Pagina ufficiale del costruttore",
      stepCharging: "Compatibilità di ricarica {{standard}}",
      stepIncentives: "Incentivi locali in {{region}}",
    },
    continueExploring: {
      eyebrow: "Continua a esplorare",
      title: "Il tuo prossimo passo con {{name}}.",
      tailoredFor: "Pensato per {{region}}",
      lead:
        "Link calmi e curati verso i luoghi che contano davvero — ufficiali, regionali e affidabili. Niente rumore, niente pressione.",
      officialEyebrow: "Ufficiale",
      officialTitle: "{{brand}} {{name}}",
      officialBody: "La pagina editoriale del costruttore — specifiche, design e artigianalità.",
      configureEyebrow: "Configura",
      configureTitle: "Costruiscila a modo tuo",
      configureBody: "Allestimento, vernice, cerchi, interni — guarda la tua {{name}} prendere forma.",
      testDriveEyebrow: "Test drive",
      testDriveTitle: "Provala dal vivo",
      testDriveBody: "Prenota un test drive sereno e senza pressioni in una sede {{brand}} vicino a te.",
      regionEyebrow: "In {{region}}",
      regionTitle: "Experience center vicini",
      regionBody: "Scopri sedi {{brand}} affidabili e specialisti EV nella tua area.",
      chargingEyebrow: "Ricarica",
      chargingTitle: "Ecosistema {{standard}}",
      chargingBody: "Capisci come quest'auto convive con la rete di ricarica in {{region}}.",
      warrantyEyebrow: "Garanzia",
      warrantyTitle: "Serenità a lungo termine",
      warrantyBody: "Dettagli sulla copertura di batteria, catena cinematica e carrozzeria in {{region}}.",
      open: "Apri",
      ownershipEyebrow: "Possederla in {{region}}",
      ownershipTitle: "Come si sente quest'auto dove vivi.",
      whereYouLive: "dove vivi",
    },
    editorialPulse: {
      title: "AutoVere Pulse",
      featured: "In evidenza questa settimana",
      footer:
        "Scritto ogni settimana dall'intelligenza editoriale di AutoVere — riflessioni calme fondate su un consenso verificato dei tester, mai sull'hype.",
    },
    personalityChooser: {
      eyebrow: "Personalità di guida",
      suggested: "AutoVere suggerisce spesso",
      cta: "Sono io — mostrami i miei abbinamenti →",
      prompt: "Penso di essere un {{name}}. {{description}} Quali tre auto dovrei guardare?",
    },
    liveVideo: {
      close: "Chiudi",
      watchOnYouTube: "Guarda su YouTube",
      noReviews: "Nessuna recensione trovata per questa ricerca.",
      loadError: "Impossibile caricare recensioni aggiornate in questo momento.",
      views: "visualizzazioni",
    },
    schema: { home: "Home", cars: "Auto" },
  },
  es: {
    carCardMatch: "Match",
    carCardExplore: "Descubrir {{name}}",
    carMedia: {
      featuredEyebrow: "Videoprueba destacada",
      featuredTitle: "Lo que dicen los probadores más fiables.",
      featuredBadge: "El más fiable",
      consensusEyebrow: "Consenso AI de los probadores",
      strengthsLabel: "Los probadores coinciden en",
      reservationsLabel: "Reservas honestas",
      aiDisclaimer:
        "Sintetizado por AutoVere AI a partir de análisis públicos de expertos. Mostramos consenso, no opinión.",
      moreReviewsEyebrow: "Más análisis de expertos",
      moreReviewsTitle: "Conductores distintos, miradas distintas.",
      officialEyebrow: "Recursos oficiales del fabricante",
      officialTitle: "Explora {{name}} directamente.",
      trustedEyebrow: "Fuentes externas de confianza",
      trustedTitle: "Verificación independiente.",
      trustedDisclaimer:
        "AutoVere no es propietaria de estos recursos. Los enlaces se abren en el sitio del editor.",
    },
    compareNext: {
      eyebrow: "Sigue adelante con confianza",
      title: "Tu siguiente paso sereno.",
      lead: "Sin presión, sin embudos. Solo las puertas correctas para cruzar cuando estés listo.",
      tailoredFor: "Pensado para {{region}}",
      stepTestDrive: "Reserva una prueba serena",
      stepDealer: "Encuentra {{brand}} cerca de {{region}}",
      stepOfficial: "Página oficial del fabricante",
      stepCharging: "Compatibilidad de carga {{standard}}",
      stepIncentives: "Incentivos locales en {{region}}",
    },
    continueExploring: {
      eyebrow: "Seguir explorando",
      title: "Tu siguiente paso con {{name}}.",
      tailoredFor: "Pensado para {{region}}",
      lead:
        "Enlaces serenos y curados hacia los lugares que de verdad importan: oficiales, regionales y fiables. Sin ruido, sin presión.",
      officialEyebrow: "Oficial",
      officialTitle: "{{brand}} {{name}}",
      officialBody: "La página editorial del fabricante: especificaciones, diseño y artesanía.",
      configureEyebrow: "Configurar",
      configureTitle: "Constrúyelo a tu manera",
      configureBody: "Acabado, pintura, llantas, interior: mira cómo toma forma tu {{name}}.",
      testDriveEyebrow: "Prueba",
      testDriveTitle: "Sentirlo en persona",
      testDriveBody: "Reserva una prueba tranquila y sin presión en un punto {{brand}} cerca de ti.",
      regionEyebrow: "En {{region}}",
      regionTitle: "Centros de experiencia cercanos",
      regionBody: "Descubre ubicaciones fiables de {{brand}} y especialistas EV en tu zona.",
      chargingEyebrow: "Carga",
      chargingTitle: "Ecosistema {{standard}}",
      chargingBody: "Entiende cómo convive este coche con la red de carga en {{region}}.",
      warrantyEyebrow: "Garantía",
      warrantyTitle: "Tranquilidad a largo plazo",
      warrantyBody: "Detalles de cobertura de batería, cadena cinemática y carrocería en {{region}}.",
      open: "Abrir",
      ownershipEyebrow: "Tenerlo en {{region}}",
      ownershipTitle: "Cómo se siente este coche donde vives.",
      whereYouLive: "donde vives",
    },
    editorialPulse: {
      title: "El Pulse de AutoVere",
      featured: "Destacado esta semana",
      footer:
        "Escrito cada semana por la inteligencia editorial de AutoVere: reflexiones serenas apoyadas en consenso verificado de probadores, nunca en hype.",
    },
    personalityChooser: {
      eyebrow: "Personalidad al volante",
      suggested: "AutoVere suele sugerir",
      cta: "Ese soy yo — enséñame mis afinidades →",
      prompt: "Creo que soy un {{name}}. {{description}} ¿Qué tres coches debería mirar?",
    },
    liveVideo: {
      close: "Cerrar",
      watchOnYouTube: "Ver en YouTube",
      noReviews: "No se han encontrado análisis para esta búsqueda.",
      loadError: "No hemos podido cargar análisis recientes ahora mismo.",
      views: "visualizaciones",
    },
    schema: { home: "Inicio", cars: "Coches" },
  },
};

export const REGION_NAMES: Record<Lang, Record<string, string>> = {
  en: { NO: "Norway", SE: "Sweden", DK: "Denmark", FI: "Finland", DE: "Germany", GB: "United Kingdom", FR: "France", NL: "Netherlands", IT: "Italy", ES: "Spain", US: "United States", CA: "Canada", AU: "Australia", EU: "Europe", GLOBAL: "Global" },
  no: { NO: "Norge", SE: "Sverige", DK: "Danmark", FI: "Finland", DE: "Tyskland", GB: "Storbritannia", FR: "Frankrike", NL: "Nederland", IT: "Italia", ES: "Spania", US: "USA", CA: "Canada", AU: "Australia", EU: "Europa", GLOBAL: "Globalt" },
  de: { NO: "Norwegen", SE: "Schweden", DK: "Dänemark", FI: "Finnland", DE: "Deutschland", GB: "Vereinigtes Königreich", FR: "Frankreich", NL: "Niederlande", IT: "Italien", ES: "Spanien", US: "Vereinigte Staaten", CA: "Kanada", AU: "Australien", EU: "Europa", GLOBAL: "Global" },
  sv: { NO: "Norge", SE: "Sverige", DK: "Danmark", FI: "Finland", DE: "Tyskland", GB: "Storbritannien", FR: "Frankrike", NL: "Nederländerna", IT: "Italien", ES: "Spanien", US: "USA", CA: "Kanada", AU: "Australien", EU: "Europa", GLOBAL: "Globalt" },
  fr: { NO: "Norvège", SE: "Suède", DK: "Danemark", FI: "Finlande", DE: "Allemagne", GB: "Royaume-Uni", FR: "France", NL: "Pays-Bas", IT: "Italie", ES: "Espagne", US: "États-Unis", CA: "Canada", AU: "Australie", EU: "Europe", GLOBAL: "Monde" },
  pl: { NO: "Norwegia", SE: "Szwecja", DK: "Dania", FI: "Finlandia", DE: "Niemcy", GB: "Wielka Brytania", FR: "Francja", NL: "Holandia", IT: "Włochy", ES: "Hiszpania", US: "Stany Zjednoczone", CA: "Kanada", AU: "Australia", EU: "Europa", GLOBAL: "Globalnie" },
  it: { NO: "Norvegia", SE: "Svezia", DK: "Danimarca", FI: "Finlandia", DE: "Germania", GB: "Regno Unito", FR: "Francia", NL: "Paesi Bassi", IT: "Italia", ES: "Spagna", US: "Stati Uniti", CA: "Canada", AU: "Australia", EU: "Europa", GLOBAL: "Globale" },
  es: { NO: "Noruega", SE: "Suecia", DK: "Dinamarca", FI: "Finlandia", DE: "Alemania", GB: "Reino Unido", FR: "Francia", NL: "Países Bajos", IT: "Italia", ES: "España", US: "Estados Unidos", CA: "Canadá", AU: "Australia", EU: "Europa", GLOBAL: "Global" },
};

export const OWNERSHIP_COPY: Record<Exclude<Lang, "en">, Record<string, OwnershipText[]>> = {
  no: {
    "nordic-winter": [
      { title: "Vinterrekkevidde", body: "Regn med rundt 25–30 % rekkeviddetap ved −10 °C. Varmepumpe og forvarming mens bilen står tilkoblet beskytter den brukbare hverdagsrekkevidden i {{region}}." },
      { title: "Ro på vinterføre", body: "AWD med progressiv momentfordeling holder bilen trygg på hardpakket snø og slaps — selvtillit på mørke vinterpendlinger." },
      { title: "{{standard}}-nettverk", body: "{{region}} har et av verdens tetteste hurtigladenettverk. Planlegg stopp omtrent hver 250–300 km om vinteren." },
    ],
    continental: [
      { title: "Autobahn-ro", body: "Stabil også i høy fart, med en stille kupé og regenerering som passer lange, raske kontinentetapper." },
      { title: "Europeisk HPC-dekning", body: "IONITY, EnBW, Fastned og Teslas åpne nettverk gir 250–350 kW-korridorer gjennom Tyskland og videre." },
      { title: "Firmabiløkonomi", body: "Gunstig firmabilbeskatning gjør premium-EVer merkbart mer attraktive som tjenestebiler enn tilsvarende fossilbiler." },
    ],
    oceanic: [
      { title: "Lett i byen", body: "Stram svingradius og slankt fotavtrykk gjør bilen hjemmevant i trange gater og parkeringshus." },
      { title: "Offentlig lading", body: "Tett hurtigladenett på motorveier; hjemmelading med 7 kW wallbox dekker det meste av ukesbehovet." },
      { title: "Skattefordeler og bysoner", body: "Lav firmabilbeskatning og gunstige byfordeler holder månedskostnaden konkurransedyktig i urbant bruk." },
    ],
    mediterranean: [
      { title: "Hverdagskomfort", body: "Fin fjæring, rolig kupé og intuitivt eierskap — den typen bil som gjør dagliglivet lettere, ikke tyngre." },
      { title: "{{standard}}-kompatibilitet", body: "Standard hurtiglading som fungerer sømløst med det regionale ladenettet." },
      { title: "Lokale insentiver", body: "Sjekk de gjeldende elbilinsentivene i {{region}} — de justeres ofte kvartalsvis." },
    ],
    "north-american": [
      { title: "Langtur på motorvei", body: "Bygget for åpne avstander. Stabil 110 km/t og Supercharger-lignende hurtiglading gjør store etapper enkle." },
      { title: "{{standard}}-kompatibilitet", body: "Klar for et voksende NACS-økosystem — Tesla Superchargers og Electrify America dekker de fleste korridorene i {{region}}." },
      { title: "Føderale og lokale fradrag", body: "Inntil 7 500 dollar i føderalt fradrag på kvalifiserte EV-er, i tillegg til lokale og energiselskapsbaserte støtteordninger." },
    ],
    temperate: [
      { title: "Hverdagsbruk", body: "Komfortabel fjæring, rolig kupé og intuitivt eierskap — en bil som bare passer sømløst inn i hverdagen." },
      { title: "{{standard}}-kompatibilitet", body: "Hurtiglading som passer det regionale ladenettet uten unødvendig friksjon." },
      { title: "Lokale insentiver", body: "Sjekk aktuelle elbilfordeler i {{region}} — ordningene kan endres raskt." },
    ],
  },
  de: {
    "nordic-winter": [
      { title: "Winterreichweite", body: "Rechnen Sie bei −10 °C mit etwa 25–30 % Reichweitenverlust. Wärmepumpe und Vorkonditionierung am Kabel schützen die alltagstaugliche Reichweite in {{region}}." },
      { title: "Souverän auf Schnee", body: "AWD mit progressiver Momentverteilung bleibt auf festgefahrenem Schnee und Schneematsch gelassen — Sicherheit auf dunklen Winterpendelstrecken." },
      { title: "{{standard}}-Netz", body: "{{region}} bietet eines der dichtesten Schnellladenetze weltweit. Im Winter sind Stopps alle 250–300 km realistisch." },
    ],
    continental: [
      { title: "Autobahn-Komfort", body: "Stabil auch jenseits von 180 km/h, mit ruhiger Akustik und Rekuperation, die für lange kontinentale Etappen passt." },
      { title: "Europäisches HPC-Netz", body: "IONITY, EnBW, Fastned und Teslas offenes Netz liefern 250–350-kW-Korridore quer durch Deutschland und darüber hinaus." },
      { title: "Dienstwagen-Vorteil", body: "Die günstige Dienstwagenbesteuerung macht Premium-EVs als Firmenwagen deutlich attraktiver als vergleichbare Verbrenner." },
    ],
    oceanic: [
      { title: "Stadttauglich", body: "Kleiner Wendekreis und kompakte Außenmaße — ideal für enge Straßen und Parkhäuser." },
      { title: "Öffentliche Ladeabdeckung", body: "Dichtes Schnellladenetz auf Autobahnen; zuhause deckt eine 7-kW-Wallbox den Großteil des Wochenbedarfs ab." },
      { title: "Steuer- und Umweltzonen-Vorteile", body: "Niedrige BIK-Sätze und Vorteile in Umweltzonen halten die Monatskosten im urbanen Alltag konkurrenzfähig." },
    ],
    mediterranean: [
      { title: "Alltagstauglichkeit", body: "Souveräner Fahrkomfort, ruhiger Innenraum und unkomplizierter Besitz — ein Auto, das den Alltag leichter macht." },
      { title: "{{standard}}-Kompatibilität", body: "Serienmäßige Schnellladefähigkeit, passend zum regionalen öffentlichen Netz." },
      { title: "Lokale Förderungen", body: "Prüfen Sie die aktuellen EV-Förderungen in {{region}} — sie ändern sich oft quartalsweise." },
    ],
    "north-american": [
      { title: "Langstrecke auf Highways", body: "Gemacht für große Distanzen. Konstantes Reisetempo und Supercharger-artiges Schnellladen machen weite Etappen leicht." },
      { title: "{{standard}}-Kompatibilität", body: "Bereit für das wachsende NACS-Ökosystem — Tesla Supercharger und Electrify America decken die meisten Korridore in {{region}} ab." },
      { title: "Bundes- und Landesförderung", body: "Bis zu 7.500 Dollar Bundesförderung auf qualifizierte EVs plus regionale und Versorger-Boni je nach Standort." },
    ],
    temperate: [
      { title: "Alltagskomfort", body: "Feine Federung, ruhiger Innenraum und intuitiver Besitz — ein Auto, das im Alltag auf angenehme Weise verschwindet." },
      { title: "{{standard}}-Kompatibilität", body: "Schnelllade-Standard, der sauber mit dem regionalen Netz harmoniert." },
      { title: "Lokale Förderungen", body: "Prüfen Sie die aktuellen EV-Anreize in {{region}} — sie können sich schnell ändern." },
    ],
  },
  sv: {
    "nordic-winter": [
      { title: "Räckvidd i kyla", body: "Räkna med cirka 25–30 % räckviddsförlust vid −10 °C. Värmepump och förkonditionering när bilen är inkopplad skyddar den användbara vardagsräckvidden i {{region}}." },
      { title: "Trygg på vinterväg", body: "AWD med progressiv kraftfördelning håller bilen trygg på packad snö och slask — självförtroende på mörka vinterpendlingar." },
      { title: "{{standard}}-nätet", body: "{{region}} har ett av världens tätaste snabbladdningsnät. Planera stopp ungefär var 250–300 km vintertid." },
    ],
    continental: [
      { title: "Autobahn-lugn", body: "Stabil även i hög fart, med tyst kupé och regenerering som passar långa, snabba kontinentresor." },
      { title: "Europeiskt HPC-nät", body: "IONITY, EnBW, Fastned och Teslas öppna nät ger 250–350 kW-korridorer genom Tyskland och vidare." },
      { title: "Tjänstebilslogik", body: "Förmånlig tjänstebilsbeskattning gör premium-elbilar märkbart mer attraktiva än motsvarande fossilbilar." },
    ],
    oceanic: [
      { title: "Smidig i staden", body: "Snäv vändradie och kompakt fotavtryck gör bilen hemma i trånga gator och parkeringshus." },
      { title: "Publik laddning", body: "Tätt snabbladdningsnät på motorvägar; hemmaladdning via 7 kW-wallbox täcker det mesta av veckobehovet." },
      { title: "Skatte- och stadslättnader", body: "Låga förmånsvärden och lokala stadsfördelar håller månadskostnaden konkurrenskraftig i urban vardag." },
    ],
    mediterranean: [
      { title: "Vardagsvänlig", body: "Fin gångkomfort, lugn kupé och intuitivt ägande — en bil som gör vardagen lättare." },
      { title: "{{standard}}-kompatibilitet", body: "Snabbladdning som fungerar naturligt med det regionala publika nätet." },
      { title: "Lokala incitament", body: "Se över aktuella elbilsstöd i {{region}} — de ändras ofta kvartalsvis." },
    ],
    "north-american": [
      { title: "Långfärd på highway", body: "Byggd för stora avstånd. Stabil marschfart och Supercharger-lik snabbladdning gör långa etapper lätta." },
      { title: "{{standard}}-kompatibilitet", body: "Redo för ett växande NACS-ekosystem — Tesla Superchargers och Electrify America täcker de flesta korridorerna i {{region}}." },
      { title: "Federala och lokala stöd", body: "Upp till 7 500 dollar i federalt stöd på kvalificerade elbilar, plus lokala och energibolagsbaserade bidrag." },
    ],
    temperate: [
      { title: "Vardagskomfort", body: "Fin fjädring, lugn kupé och intuitivt ägande — bilen som bara passar in i livet på bästa sätt." },
      { title: "{{standard}}-kompatibilitet", body: "Snabbladdning som passar det regionala nätet utan onödig friktion." },
      { title: "Lokala stöd", body: "Kontrollera aktuella elbilsincitament i {{region}} — regelverket kan ändras snabbt." },
    ],
  },
  fr: {
    "nordic-winter": [
      { title: "Autonomie par temps froid", body: "Comptez environ 25 à 30 % de perte d'autonomie à −10 °C. Pompe à chaleur et préconditionnement sur prise protègent l'autonomie utile au quotidien en {{region}}." },
      { title: "Sang-froid sur la neige", body: "La transmission intégrale à répartition progressive du couple reste posée sur neige tassée et gadoue — un vrai sentiment de sécurité lors des trajets d'hiver." },
      { title: "Réseau {{standard}}", body: "{{region}} dispose de l'un des réseaux de charge rapide les plus denses au monde. En hiver, prévoyez des arrêts tous les 250 à 300 km." },
    ],
    continental: [
      { title: "Confort d'Autobahn", body: "Stable à très haute vitesse, avec une acoustique feutrée et une récupération calibrée pour les longs parcours continentaux." },
      { title: "Réseau HPC européen", body: "IONITY, EnBW, Fastned et le réseau ouvert Tesla offrent des corridors 250 à 350 kW à travers l'Allemagne et au-delà." },
      { title: "Fiscalité flotte", body: "La fiscalité favorable des voitures de société rend les EV premium nettement plus intéressants que leurs équivalents thermiques." },
    ],
    oceanic: [
      { title: "À l'aise en ville", body: "Rayon de braquage serré et encombrement maîtrisé — parfaitement à son aise dans les rues étroites et les parkings à étages." },
      { title: "Accès à la recharge publique", body: "Réseau rapide dense sur autoroute ; à domicile, une wallbox 7 kW couvre l'essentiel des besoins hebdomadaires." },
      { title: "Avantages fiscaux et urbains", body: "Fiscalité avantageuse et bénéfices urbains permettent de garder un coût mensuel compétitif en usage citadin." },
    ],
    mediterranean: [
      { title: "Facilité au quotidien", body: "Suspension raffinée, habitacle calme et usage intuitif — le genre d'auto qui simplifie la vie de tous les jours." },
      { title: "Compatibilité {{standard}}", body: "Recharge rapide standard compatible avec le réseau public régional." },
      { title: "Aides locales", body: "Vérifiez les aides EV du moment en {{region}} — elles évoluent souvent d'un trimestre à l'autre." },
    ],
    "north-american": [
      { title: "Grand voyage sur autoroute", body: "Conçue pour les grands espaces. Vitesse stabilisée et charge rapide façon Supercharger rendent les longues étapes faciles." },
      { title: "Compatibilité {{standard}}", body: "Prête pour l'écosystème NACS en expansion — Tesla Superchargers et Electrify America couvrent l'essentiel des corridors en {{region}}." },
      { title: "Crédits fédéraux et locaux", body: "Jusqu'à 7 500 dollars de crédit fédéral sur les EV éligibles, auxquels s'ajoutent aides locales et remises des utilities." },
    ],
    temperate: [
      { title: "Confort de tous les jours", body: "Suspension douce, habitacle serein et usage intuitif — la voiture qui s'efface dans le bon sens au quotidien." },
      { title: "Compatibilité {{standard}}", body: "Charge rapide naturellement adaptée au réseau régional." },
      { title: "Aides locales", body: "Consultez les incitations EV en vigueur en {{region}} — elles peuvent changer rapidement." },
    ],
  },
  pl: {
    "nordic-winter": [
      { title: "Zasięg zimą", body: "Przy −10 °C trzeba liczyć się ze spadkiem zasięgu o około 25–30%. Pompa ciepła i wstępne przygotowanie auta na kablu pomagają zachować realny zasięg w codziennym użytkowaniu w {{region}}." },
      { title: "Spokój na śniegu", body: "AWD z progresywnym rozdziałem momentu daje opanowanie na ubitym śniegu i błocie pośniegowym — pewność na zimowych dojazdach." },
      { title: "Sieć {{standard}}", body: "{{region}} ma jedną z najgęstszych sieci szybkiego ładowania na świecie. Zimą rozsądnie planować postoje co 250–300 km." },
    ],
    continental: [
      { title: "Komfort na autobahnie", body: "Stabilność przy wysokich prędkościach, wyciszona kabina i rekuperacja zestrojona pod długie, szybkie przeloty po kontynencie." },
      { title: "Europejska sieć HPC", body: "IONITY, EnBW, Fastned i otwarta sieć Tesli tworzą korytarze 250–350 kW przez Niemcy i dalej." },
      { title: "Korzyści dla aut firmowych", body: "Korzystne zasady opodatkowania aut służbowych sprawiają, że premium EV wypadają znacznie atrakcyjniej niż podobne auta spalinowe." },
    ],
    oceanic: [
      { title: "Zwinność w mieście", body: "Mały promień skrętu i kompaktowy obrys sprawiają, że auto dobrze czuje się w wąskich ulicach i piętrowych parkingach." },
      { title: "Publiczne ładowanie", body: "Gęsta sieć szybkich ładowarek na trasach; domowa wallbox 7 kW pokrywa większość tygodniowych potrzeb." },
      { title: "Korzyści podatkowe i miejskie", body: "Preferencyjne zasady i lokalne udogodnienia utrzymują miesięczny koszt użytkowania na konkurencyjnym poziomie." },
    ],
    mediterranean: [
      { title: "Codzienna wygoda", body: "Dopracowane tłumienie, cicha kabina i intuicyjne użytkowanie — auto, które ułatwia codzienność." },
      { title: "Zgodność z {{standard}}", body: "Szybkie ładowanie zgodne z regionalną siecią publiczną." },
      { title: "Lokalne dopłaty", body: "Sprawdź aktualne zachęty do EV w {{region}} — potrafią zmieniać się z kwartału na kwartał." },
    ],
    "north-american": [
      { title: "Długie trasy po highway", body: "Stworzone do wielkich odległości. Stabilna jazda autostradowa i ładowanie klasy Supercharger ułatwiają naprawdę długie etapy." },
      { title: "Zgodność z {{standard}}", body: "Gotowe na rosnący ekosystem NACS — Tesla Supercharger i Electrify America pokrywają większość korytarzy w {{region}}." },
      { title: "Ulgi federalne i stanowe", body: "Nawet 7 500 dolarów federalnej ulgi na kwalifikowane EV plus dodatkowe dopłaty stanowe i od operatorów energii." },
    ],
    temperate: [
      { title: "Komfort na co dzień", body: "Dojrzałe tłumienie, spokojna kabina i intuicyjne użytkowanie — samochód, który po prostu naturalnie wpisuje się w życie." },
      { title: "Zgodność z {{standard}}", body: "Szybkie ładowanie dobrze współpracujące z regionalną siecią." },
      { title: "Lokalne zachęty", body: "Sprawdź aktualne programy wsparcia EV w {{region}} — potrafią szybko się zmieniać." },
    ],
  },
  it: {
    "nordic-winter": [
      { title: "Autonomia in inverno", body: "A −10 °C è realistico aspettarsi un calo di autonomia del 25–30%. Pompa di calore e precondizionamento alla presa proteggono l'autonomia utile quotidiana in {{region}}." },
      { title: "Padronanza sulla neve", body: "La trazione integrale con ripartizione progressiva della coppia resta composta su neve compatta e fango — una vera rassicurazione nei tragitti invernali." },
      { title: "Rete {{standard}}", body: "{{region}} offre una delle reti di ricarica rapida più dense al mondo. In inverno è sensato pianificare una sosta ogni 250–300 km." },
    ],
    continental: [
      { title: "Comfort da Autobahn", body: "Stabile anche ad alta velocità, con abitacolo silenzioso e rigenerazione calibrata per le lunghe tratte continentali." },
      { title: "Rete HPC europea", body: "IONITY, EnBW, Fastned e la rete aperta Tesla garantiscono corridoi da 250–350 kW attraverso la Germania e oltre." },
      { title: "Vantaggi da auto aziendale", body: "La fiscalità favorevole sulle auto aziendali rende le EV premium sensibilmente più interessanti delle equivalenti termiche." },
    ],
    oceanic: [
      { title: "Agile in città", body: "Raggio di sterzata contenuto e ingombri ben gestiti: si muove con naturalezza fra strade strette e parcheggi multipiano." },
      { title: "Ricarica pubblica", body: "Rete rapida fitta sulle arterie principali; una wallbox domestica da 7 kW copre la maggior parte del fabbisogno settimanale." },
      { title: "Vantaggi fiscali e urbani", body: "Una fiscalità favorevole e i benefici urbani aiutano a mantenere competitivo il costo mensile in uso cittadino." },
    ],
    mediterranean: [
      { title: "Vivibilità quotidiana", body: "Assetto raffinato, abitacolo quieto e gestione intuitiva: l'auto che rende più semplice la vita di tutti i giorni." },
      { title: "Compatibilità {{standard}}", body: "Ricarica rapida standard in sintonia con la rete pubblica regionale." },
      { title: "Incentivi locali", body: "Controlla gli incentivi EV attivi in {{region}}: possono cambiare rapidamente, anche da un trimestre all'altro." },
    ],
    "north-american": [
      { title: "Lunga percorrenza in highway", body: "Pensata per grandi distanze. Andatura autostradale stabile e ricarica stile Supercharger rendono facili le lunghe tappe." },
      { title: "Compatibilità {{standard}}", body: "Pronta per il crescente ecosistema NACS: Tesla Supercharger ed Electrify America coprono la maggior parte dei corridoi in {{region}}." },
      { title: "Crediti federali e statali", body: "Fino a 7.500 dollari di credito federale sulle EV idonee, più eventuali incentivi statali e utility locali." },
    ],
    temperate: [
      { title: "Comfort di tutti i giorni", body: "Sospensioni ben filtrate, abitacolo sereno e proprietà intuitiva: l'auto che si inserisce nella vita con naturalezza." },
      { title: "Compatibilità {{standard}}", body: "Ricarica rapida armoniosa con la rete regionale." },
      { title: "Incentivi locali", body: "Verifica gli incentivi EV in vigore in {{region}}: possono cambiare rapidamente." },
    ],
  },
  es: {
    "nordic-winter": [
      { title: "Autonomía en invierno", body: "A −10 °C es realista contar con una pérdida de autonomía del 25–30%. La bomba de calor y el preacondicionamiento enchufado ayudan a proteger la autonomía útil diaria en {{region}}." },
      { title: "Templanza sobre nieve", body: "La tracción total con reparto progresivo del par mantiene el coche asentado sobre nieve compacta y aguanieve: confianza real en los trayectos invernales." },
      { title: "Red {{standard}}", body: "{{region}} cuenta con una de las redes de carga rápida más densas del mundo. En invierno conviene planificar paradas cada 250–300 km." },
    ],
    continental: [
      { title: "Confort de Autobahn", body: "Estable a alta velocidad, con un habitáculo silencioso y una regeneración afinada para largas tiradas continentales." },
      { title: "Red HPC europea", body: "IONITY, EnBW, Fastned y la red abierta de Tesla ofrecen corredores de 250–350 kW a través de Alemania y más allá." },
      { title: "Ventaja fiscal de empresa", body: "La fiscalidad favorable para coches de empresa hace que los EV premium resulten claramente más atractivos que sus equivalentes térmicos." },
    ],
    oceanic: [
      { title: "Ágil en ciudad", body: "Radio de giro contenido y tamaño exterior razonable: se mueve con naturalidad por calles estrechas y aparcamientos de varias plantas." },
      { title: "Acceso a carga pública", body: "Red rápida densa en autopista; una wallbox doméstica de 7 kW cubre la mayor parte del uso semanal." },
      { title: "Ventajas fiscales y urbanas", body: "Una fiscalidad favorable y ventajas urbanas mantienen competitivo el coste mensual en uso ciudadano." },
    ],
    mediterranean: [
      { title: "Facilidad diaria", body: "Suspensión refinada, habitáculo calmado y propiedad intuitiva: el tipo de coche que hace más fácil el día a día." },
      { title: "Compatibilidad {{standard}}", body: "Carga rápida estándar plenamente alineada con la red pública regional." },
      { title: "Incentivos locales", body: "Consulta las ayudas EV vigentes en {{region}}: pueden variar con rapidez, incluso cada trimestre." },
    ],
    "north-american": [
      { title: "Gran viaje por autopista", body: "Pensado para largas distancias. Un ritmo de crucero estable y una carga de estilo Supercharger hacen sencillos los grandes recorridos." },
      { title: "Compatibilidad {{standard}}", body: "Preparado para el creciente ecosistema NACS: Tesla Supercharger y Electrify America cubren la mayoría de corredores en {{region}}." },
      { title: "Créditos federales y estatales", body: "Hasta 7.500 dólares de crédito federal en EV elegibles, más incentivos estatales y de compañías eléctricas." },
    ],
    temperate: [
      { title: "Confort cotidiano", body: "Suspensión refinada, habitáculo sereno y propiedad intuitiva: el coche que encaja en la vida con naturalidad." },
      { title: "Compatibilidad {{standard}}", body: "Carga rápida bien integrada con la red regional." },
      { title: "Ayudas locales", body: "Revisa los incentivos EV activos en {{region}}: pueden cambiar con rapidez." },
    ],
  },
};

export const getRegionLabel = (lang: string, code: string) =>
  REGION_NAMES[resolveLang(lang)][code] || REGION_NAMES.en[code] || code;

export const getUiCopy = (lang: string) => UI_COPY[resolveLang(lang)];

export const getOwnershipText = (
  lang: string,
  climate: string,
): OwnershipText[] | undefined =>
  resolveLang(lang) === "en" ? undefined : OWNERSHIP_COPY[resolveLang(lang) as Exclude<Lang, "en">]?.[climate];
