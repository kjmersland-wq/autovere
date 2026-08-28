import type { Locale } from "./i18n";

export type PartnerCopy = {
  navLink: string;
  header: { visitWebsite: (name: string) => string; partnerLabel: string };
  page: {
    eyebrow: string;
    title: string;
    intro: string;
    proudStatement: string;
    body: string;
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
    intro: "AutoVere is offering relevant European organisations a simple, genuine benefit for members who travel by car, EV, motorhome, caravan or touring vehicle.",
    proudStatement: "We're proud to work with organisations that help their members travel further, smarter and with fewer surprises.",
    body: "Your members get real toll, vignette, fuel and EV charging costs before they set off, plus every AutoVere Pro feature, at 25% off. You get a genuine member benefit worth sharing, with no extra work on your side.",
    previewLabel: "Here's how it looks",
    previewCaption: "Demonstration — example only. This organisation is fictional.",
    directoryTitle: "Our Organisation Partners",
    directoryEmptyTitle: "New partnerships coming soon",
    directoryEmptyBody: "We're building relationships with European touring, EV, motorhome and mobility organisations. Check back soon, or get in touch if you'd like to be first.",
    memberBenefit: (percent) => `${percent}% member benefit`,
    visitSite: "Visit official website",
    ctaTitle: "Become a partner",
    ctaText: "Tell us about your organisation and we'll get back to you about setting up a member benefit for AutoVere Pro.",
    ctaButton: "Become a partner",
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
    intro: "AutoVere bietet ausgewählten europäischen Organisationen einen einfachen, echten Vorteil für Mitglieder, die mit dem Auto, Elektroauto, Wohnmobil, Caravan oder Tourenfahrzeug unterwegs sind.",
    proudStatement: "Wir sind stolz, mit Organisationen zusammenzuarbeiten, die ihren Mitgliedern helfen, weiter, klüger und mit weniger Überraschungen zu reisen.",
    body: "Ihre Mitglieder erhalten reale Maut-, Vignetten-, Kraftstoff- und Ladekosten schon vor der Abfahrt, dazu alle AutoVere-Pro-Funktionen, mit 25 % Rabatt. Sie erhalten einen echten Mitgliedervorteil, den es sich zu teilen lohnt, ohne zusätzlichen Aufwand.",
    previewLabel: "So sieht es aus",
    previewCaption: "Demonstration — nur Beispiel. Diese Organisation ist fiktiv.",
    directoryTitle: "Unsere Organisationspartner",
    directoryEmptyTitle: "Neue Partnerschaften folgen in Kürze",
    directoryEmptyBody: "Wir bauen Beziehungen zu europäischen Touring-, E-Mobilitäts-, Wohnmobil- und Mobilitätsorganisationen auf. Schauen Sie bald wieder vorbei oder melden Sie sich, wenn Sie die Ersten sein möchten.",
    memberBenefit: (percent) => `${percent} % Mitgliedervorteil`,
    visitSite: "Offizielle Website besuchen",
    ctaTitle: "Partner werden",
    ctaText: "Erzählen Sie uns von Ihrer Organisation, und wir melden uns bei Ihnen, um einen Mitgliedervorteil für AutoVere Pro einzurichten.",
    ctaButton: "Partner werden",
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
    intro: "AutoVere biedt relevante Europese organisaties een eenvoudig, oprecht voordeel voor leden die reizen met de auto, EV, camper, caravan of toercaravan.",
    proudStatement: "We zijn er trots op samen te werken met organisaties die hun leden helpen verder, slimmer en met minder verrassingen te reizen.",
    body: "Uw leden zien echte tol-, vignet-, brandstof- en laadkosten al vóór vertrek, plus alle functies van AutoVere Pro, met 25% korting. U krijgt een oprecht ledenvoordeel dat de moeite waard is om te delen, zonder extra werk aan uw kant.",
    previewLabel: "Zo ziet het eruit",
    previewCaption: "Demonstratie — alleen een voorbeeld. Deze organisatie is fictief.",
    directoryTitle: "Onze organisatiepartners",
    directoryEmptyTitle: "Nieuwe partnerschappen volgen binnenkort",
    directoryEmptyBody: "We bouwen relaties op met Europese touring-, EV-, camper- en mobiliteitsorganisaties. Kom snel terug, of neem contact op als u de eerste wilt zijn.",
    memberBenefit: (percent) => `${percent}% ledenvoordeel`,
    visitSite: "Bezoek officiële website",
    ctaTitle: "Word partner",
    ctaText: "Vertel ons over uw organisatie en we nemen contact met u op om een ledenvoordeel voor AutoVere Pro in te stellen.",
    ctaButton: "Word partner",
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
    intro: "AutoVere tilbyr relevante europeiske organisasjoner en enkel, ekte medlemsfordel for dem som reiser med bil, elbil, bobil, campingvogn eller turkjøretøy.",
    proudStatement: "Vi er stolte av å samarbeide med organisasjoner som hjelper medlemmene sine å reise lenger, smartere og med færre overraskelser.",
    body: "Medlemmene dine ser reelle bompenge-, vignett-, drivstoff- og ladekostnader før de kjører av gårde, i tillegg til alle funksjonene i AutoVere Pro, til 25 % rabatt. Dere får en ekte medlemsfordel som er verdt å dele, uten ekstra arbeid på deres side.",
    previewLabel: "Slik ser det ut",
    previewCaption: "Demonstrasjon — kun eksempel. Denne organisasjonen er fiktiv.",
    directoryTitle: "Våre organisasjonspartnere",
    directoryEmptyTitle: "Nye partnerskap kommer snart",
    directoryEmptyBody: "Vi bygger relasjoner med europeiske turist-, elbil-, bobil- og mobilitetsorganisasjoner. Sjekk igjen snart, eller ta kontakt hvis dere ønsker å være først ute.",
    memberBenefit: (percent) => `${percent} % medlemsfordel`,
    visitSite: "Besøk offisiell nettside",
    ctaTitle: "Bli partner",
    ctaText: "Fortell oss om organisasjonen deres, så tar vi kontakt for å sette opp en medlemsfordel for AutoVere Pro.",
    ctaButton: "Bli partner",
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
    intro: "AutoVere oferuje wybranym europejskim organizacjom prostą, prawdziwą korzyść dla członków podróżujących samochodem, autem elektrycznym, kamperem, przyczepą kempingową lub pojazdem turystycznym.",
    proudStatement: "Jesteśmy dumni ze współpracy z organizacjami, które pomagają swoim członkom podróżować dalej, mądrzej i z mniejszą liczbą niespodzianek.",
    body: "Twoi członkowie zobaczą realne koszty opłat drogowych, winiet, paliwa i ładowania jeszcze przed wyjazdem, a do tego wszystkie funkcje AutoVere Pro z 25% zniżką. Wy zyskujecie prawdziwą korzyść członkowską, którą warto się dzielić, bez dodatkowej pracy po waszej stronie.",
    previewLabel: "Tak to wygląda",
    previewCaption: "Demonstracja — wyłącznie przykład. Ta organizacja jest fikcyjna.",
    directoryTitle: "Nasi partnerzy organizacyjni",
    directoryEmptyTitle: "Nowe partnerstwa już wkrótce",
    directoryEmptyBody: "Budujemy relacje z europejskimi organizacjami turystycznymi, motoryzacyjnymi, kamperowymi i mobilnościowymi. Zajrzyj tu wkrótce albo skontaktuj się z nami, jeśli chcesz być pierwszy.",
    memberBenefit: (percent) => `${percent}% korzyści dla członków`,
    visitSite: "Odwiedź oficjalną stronę",
    ctaTitle: "Zostań partnerem",
    ctaText: "Opowiedz nam o swojej organizacji, a skontaktujemy się, aby ustalić korzyść członkowską dla AutoVere Pro.",
    ctaButton: "Zostań partnerem",
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
    intro: "AutoVere erbjuder relevanta europeiska organisationer en enkel, genuin förmån för medlemmar som reser med bil, elbil, husbil, husvagn eller turfordon.",
    proudStatement: "Vi är stolta över att samarbeta med organisationer som hjälper sina medlemmar att resa längre, smartare och med färre överraskningar.",
    body: "Era medlemmar ser verkliga kostnader för vägtullar, vinjetter, bränsle och laddning redan innan de kör iväg, plus alla funktioner i AutoVere Pro, till 25 % rabatt. Ni får en genuin medlemsförmån värd att dela, utan extra arbete på er sida.",
    previewLabel: "Så här ser det ut",
    previewCaption: "Demonstration — endast exempel. Denna organisation är fiktiv.",
    directoryTitle: "Våra organisationspartners",
    directoryEmptyTitle: "Nya partnerskap kommer snart",
    directoryEmptyBody: "Vi bygger relationer med europeiska touring-, elbils-, husbils- och mobilitetsorganisationer. Titta gärna in igen snart, eller hör av er om ni vill vara först.",
    memberBenefit: (percent) => `${percent} % medlemsförmån`,
    visitSite: "Besök officiell webbplats",
    ctaTitle: "Bli partner",
    ctaText: "Berätta om er organisation så hör vi av oss för att sätta upp en medlemsförmån för AutoVere Pro.",
    ctaButton: "Bli partner",
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
    intro: "AutoVere propose aux organisations européennes concernées un avantage simple et sincère pour les membres qui voyagent en voiture, en véhicule électrique, en camping-car, en caravane ou en véhicule de tourisme.",
    proudStatement: "Nous sommes fiers de collaborer avec des organisations qui aident leurs membres à voyager plus loin, plus intelligemment et avec moins de surprises.",
    body: "Vos membres découvrent les coûts réels de péages, vignettes, carburant et recharge avant même de partir, avec en plus toutes les fonctionnalités d'AutoVere Pro, à 25 % de réduction. Vous offrez un avantage membre authentique, sans travail supplémentaire de votre côté.",
    previewLabel: "Voici à quoi cela ressemble",
    previewCaption: "Démonstration — exemple uniquement. Cette organisation est fictive.",
    directoryTitle: "Nos partenaires organisationnels",
    directoryEmptyTitle: "De nouveaux partenariats arrivent bientôt",
    directoryEmptyBody: "Nous construisons des relations avec des organisations européennes de tourisme, de mobilité électrique, de camping-car et de mobilité. Revenez bientôt, ou contactez-nous si vous souhaitez être les premiers.",
    memberBenefit: (percent) => `${percent} % d'avantage membre`,
    visitSite: "Visiter le site officiel",
    ctaTitle: "Devenir partenaire",
    ctaText: "Parlez-nous de votre organisation et nous vous recontacterons pour mettre en place un avantage membre pour AutoVere Pro.",
    ctaButton: "Devenir partenaire",
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
    intro: "AutoVere tilbyder relevante europæiske organisationer en enkel, ægte fordel til medlemmer, der rejser i bil, elbil, autocamper, campingvogn eller turistkøretøj.",
    proudStatement: "Vi er stolte af at samarbejde med organisationer, der hjælper deres medlemmer med at rejse længere, smartere og med færre overraskelser.",
    body: "Dine medlemmer ser reelle omkostninger til vejafgifter, vignetter, brændstof og opladning, allerede før de kører af sted, samt alle funktioner i AutoVere Pro, med 25 % rabat. I får en ægte medlemsfordel, der er værd at dele, uden ekstra arbejde på jeres side.",
    previewLabel: "Sådan ser det ud",
    previewCaption: "Demonstration — kun et eksempel. Denne organisation er fiktiv.",
    directoryTitle: "Vores organisationspartnere",
    directoryEmptyTitle: "Nye partnerskaber kommer snart",
    directoryEmptyBody: "Vi opbygger relationer med europæiske turist-, elbil-, autocamper- og mobilitetsorganisationer. Kig forbi igen snart, eller kontakt os hvis I vil være de første.",
    memberBenefit: (percent) => `${percent} % medlemsfordel`,
    visitSite: "Besøg officiel hjemmeside",
    ctaTitle: "Bliv partner",
    ctaText: "Fortæl os om jeres organisation, så kontakter vi jer for at sætte en medlemsfordel op for AutoVere Pro.",
    ctaButton: "Bliv partner",
    back: "Tilbage til AutoVere",
    checkoutBanner: (code, percent) => `Medlemskode ${code} → ${percent} % medlemsrabat tilføjet`,
  },
  demo: { name: "European Touring Association", country: "Norge", note: "Fiktiv eksempelorganisation, kun til demonstration." },
};

export const partnerCopy: Record<Locale, PartnerCopy> = { en, de, nl, no, pl, sv, fr, da };
