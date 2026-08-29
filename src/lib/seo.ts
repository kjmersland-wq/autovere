import { pathForLocale, type Locale } from "./i18n";

export type SeoCopy = {
  title: string;
  description: string;
  keywords: string;
  ogLocale: string;
};

export const seoCopy: Record<Locale, SeoCopy> = {
  no: { title: "AutoVere — Europeisk bompenge-, vignett- og elbilkalkulator", description: "Planlegg bilferien i Europa. Beregn nøyaktige bompenger, obligatoriske vignetter, drivstoff og Tesla/Ionity-ladestopp.", keywords: "bompengekalkulator, vignetter Europa, elbilkalkulator, Tesla ladestopp, Ionity ladestopp", ogLocale: "nb_NO" },
  en: { title: "AutoVere — European Toll, Vignette & EV Route Planner", description: "Plan your European road trip. Calculate accurate toll costs, mandatory vignettes, fuel, and Tesla/Ionity charging stops.", keywords: "toll calculator, vignette Europe, EV route planner, Tesla Supercharger route planner, Ionity charging", ogLocale: "en_GB" },
  de: { title: "AutoVere — Maut-, Vignetten- & E-Auto-Routenplaner für Europa", description: "Planen Sie Ihre Europareise. Genaue Mautkosten, Vignettenpflicht, Kraftstoff und Tesla/Ionity-Ladestopps berechnen.", keywords: "Maut Rechner, Vignette Europa, E-Auto Routenplaner, Tesla Ladestopp, Ionity", ogLocale: "de_DE" },
  nl: { title: "AutoVere — Europese Tol-, Vignet- en EV-Routeplanner", description: "Plan je autovakantie in Europa. Bereken tolkosten, verplichte vignetten, brandstof en Tesla/Ionity-laadpalen.", keywords: "tolkosten Frankrijk, vignet Europa, EV routeplanner, Tesla laadpalen, Ionity", ogLocale: "nl_NL" },
  pl: { title: "AutoVere — Europejski planer tras, opłat drogowych, winiet i ładowania EV", description: "Zaplanuj podróż po Europie. Oblicz opłaty drogowe, winiety, paliwo oraz stacje ładowania Tesla i Ionity.", keywords: "opłaty drogowe Europa, winiety Europa, planer tras EV, ładowarki Tesla, Ionity", ogLocale: "pl_PL" },
  sv: { title: "AutoVere — Europeisk resruttplanerare för tullar, vinjetter och elbilsladdning", description: "Planera din bilresa i Europa. Beräkna vägavgifter, vinjetter, drivmedel och laddstopp för Tesla och Ionity.", keywords: "vägavgifter Europa, motorvägsvinjett, elbil resruttplanerare, Tesla laddning, Ionity", ogLocale: "sv_SE" },
  fr: { title: "AutoVere — Planificateur européen de trajets, péages, vignettes et recharge VE", description: "Planifiez votre trajet en Europe. Calculez les péages, vignettes, coûts de carburant et arrêts de recharge Tesla et Ionity.", keywords: "calcul péage Europe, vignette Europe, planificateur trajet voiture électrique, recharge Tesla, Ionity", ogLocale: "fr_FR" },
  da: { title: "AutoVere — Europæisk vejafgifts-, vignet- og elbilberegner", description: "Planlæg din bilferie i Europa. Beregn nøjagtige vejafgifter, obligatoriske vignetter, brændstof og Tesla/Ionity-ladestop.", keywords: "vejafgiftsberegner, vignetter Europa, elbilberegner, Tesla ladestop, Ionity ladestop", ogLocale: "da_DK" },
};

// hreflang: the ISO alternate-language code search engines expect. locale: AutoVere's own
// internal locale, used to compute this page's real URL for that language via pathForLocale.
// ogLocale: the og:locale meta value. Swedish/Danish deliberately use country-style URL
// segments ("se"/"dk") that don't match their language codes ("sv"/"da") — see i18n.tsx.
export const seoAlternates: { hreflang: string; locale: Locale; ogLocale: string }[] = [
  { hreflang: "en", locale: "en", ogLocale: "en_GB" },
  { hreflang: "nb", locale: "no", ogLocale: "nb_NO" },
  { hreflang: "sv", locale: "sv", ogLocale: "sv_SE" },
  { hreflang: "da", locale: "da", ogLocale: "da_DK" },
  { hreflang: "de", locale: "de", ogLocale: "de_DE" },
  { hreflang: "nl", locale: "nl", ogLocale: "nl_NL" },
  { hreflang: "fr", locale: "fr", ogLocale: "fr_FR" },
  { hreflang: "pl", locale: "pl", ogLocale: "pl_PL" },
];

export const siteUrl = "https://www.autovere.com";

export type PageSeoCopy = { title: string; description: string };

export const pricingSeoCopy: Record<Locale, PageSeoCopy> = {
  en: { title: "AutoVere Pricing — Free, Pro & Business Road-Trip Planning", description: "Compare AutoVere Free, Pro and Business plans: toll and vignette calculations, EV charging routes, weather-adjusted charging buffers and fleet tools for European road trips." },
  no: { title: "AutoVere Priser — Gratis, Pro og Business bilferieplanlegging", description: "Sammenlign AutoVere Gratis, Pro og Business: bompenge- og vignettberegning, elbil-ladeplanlegging, værjusterte ladebuffere og flåteverktøy for europeiske bilferier." },
  de: { title: "AutoVere Preise — Kostenlos, Pro & Business für Roadtrip-Planung", description: "Vergleichen Sie AutoVere Kostenlos, Pro und Business: Maut- und Vignettenberechnung, E-Auto-Laderouten, wetterangepasste Ladepuffer und Flottentools für Europareisen." },
  nl: { title: "AutoVere Prijzen — Gratis, Pro & Business voor je Roadtrip", description: "Vergelijk AutoVere Gratis, Pro en Business: tol- en vignetberekening, EV-laadroutes, weersafhankelijke laadbuffers en wagenparktools voor Europese roadtrips." },
  fr: { title: "Tarifs AutoVere — Gratuit, Pro et Business pour vos road trips", description: "Comparez les offres AutoVere Gratuit, Pro et Business : calcul des péages et vignettes, itinéraires de recharge VE, marges de recharge ajustées à la météo et outils de flotte pour vos road trips européens." },
  pl: { title: "Cennik AutoVere — Free, Pro i Business do planowania podróży", description: "Porównaj plany AutoVere Free, Pro i Business: obliczanie opłat drogowych i winiet, trasy ładowania EV, bufory ładowania dostosowane do pogody oraz narzędzia flotowe na podróże po Europie." },
  sv: { title: "AutoVere Priser — Free, Pro och Business för bilresor", description: "Jämför AutoVere Free, Pro och Business: beräkning av vägavgifter och vinjetter, elbilsladdningsrutter, väderjusterade laddbuffertar och flottverktyg för europeiska bilresor." },
  da: { title: "AutoVere Priser — Free, Pro og Business til roadtrip-planlægning", description: "Sammenlign AutoVere Free, Pro og Business: beregning af vejafgifter og vignetter, elbil-laderuter, vejrjusterede ladebuffere og flådeværktøjer til europæiske roadtrips." },
};

export const faqSeoCopy: Record<Locale, PageSeoCopy> = {
  en: { title: "AutoVere Help & FAQ — Tolls, Vignettes, EV Charging & Accounts", description: "Answers on how AutoVere calculates tolls and vignettes, EV charging and weather-adjusted range, what needs an account, and how your data is handled." },
  no: { title: "AutoVere Hjelp og ofte stilte spørsmål — Bompenger, vignetter, elbillading og konto", description: "Svar på hvordan AutoVere beregner bompenger og vignetter, elbillading og værjustert rekkevidde, hva som krever konto, og hvordan dine data behandles." },
  de: { title: "AutoVere Hilfe & FAQ — Maut, Vignetten, E-Auto-Laden & Konto", description: "Antworten dazu, wie AutoVere Maut und Vignetten berechnet, E-Auto-Laden und wetterangepasste Reichweite, was ein Konto erfordert und wie mit Ihren Daten umgegangen wird." },
  nl: { title: "AutoVere Hulp & Veelgestelde vragen — Tol, vignetten, EV-laden & account", description: "Antwoorden over hoe AutoVere tol en vignetten berekent, EV-laden en weersafhankelijke actieradius, wat een account vereist en hoe met je gegevens wordt omgegaan." },
  fr: { title: "Aide & FAQ AutoVere — Péages, vignettes, recharge VE et compte", description: "Réponses sur la façon dont AutoVere calcule les péages et vignettes, la recharge VE et l'autonomie ajustée à la météo, ce qui nécessite un compte, et la gestion de vos données." },
  pl: { title: "Pomoc i FAQ AutoVere — Opłaty drogowe, winiety, ładowanie EV i konto", description: "Odpowiedzi na temat obliczania opłat drogowych i winiet, ładowania EV i zasięgu dostosowanego do pogody, kiedy potrzebne jest konto oraz jak przetwarzane są Twoje dane." },
  sv: { title: "AutoVere Hjälp och Vanliga frågor — Vägavgifter, vinjetter, elbilsladdning och konto", description: "Svar på hur AutoVere beräknar vägavgifter och vinjetter, elbilsladdning och väderjusterad räckvidd, vad som kräver ett konto och hur dina uppgifter hanteras." },
  da: { title: "AutoVere Hjælp og Ofte stillede spørgsmål — Vejafgifter, vignetter, elbilopladning og konto", description: "Svar på, hvordan AutoVere beregner vejafgifter og vignetter, elbilopladning og vejrjusteret rækkevidde, hvad der kræver en konto, og hvordan dine data behandles." },
};

export const partnersSeoCopy: Record<Locale, PageSeoCopy> = {
  en: { title: "AutoVere Organisation Partners — Give Your Members 25% Off", description: "Partner with AutoVere to give your members a genuine travel benefit: 25% off AutoVere Pro's real toll, vignette, fuel and EV charging cost planning. Simple to offer, no technical work required." },
  no: { title: "AutoVere Organisasjonspartnere — Gi medlemmene dine 25 % rabatt", description: "Bli partner med AutoVere og gi medlemmene dine en reell reisefordel: 25 % rabatt på AutoVere Pro sin ekte bompenge-, vignett-, drivstoff- og elbilladeplanlegging. Enkelt å tilby, ingen teknisk arbeid kreves." },
  de: { title: "AutoVere Organisationspartner — 25 % Rabatt für Ihre Mitglieder", description: "Werden Sie Partner von AutoVere und bieten Sie Ihren Mitgliedern einen echten Reisevorteil: 25 % Rabatt auf AutoVere Pros echte Maut-, Vignetten-, Kraftstoff- und E-Auto-Ladeplanung. Einfach anzubieten, keine technische Arbeit erforderlich." },
  nl: { title: "AutoVere Organisatiepartners — Geef je leden 25% korting", description: "Word partner van AutoVere en geef je leden een écht reisvoordeel: 25% korting op AutoVere Pro's tol-, vignet-, brandstof- en EV-laadplanning. Eenvoudig aan te bieden, geen technisch werk nodig." },
  fr: { title: "Partenaires organisations AutoVere — 25 % de réduction pour vos membres", description: "Devenez partenaire d'AutoVere et offrez à vos membres un vrai avantage voyage : 25 % de réduction sur la planification réelle des péages, vignettes, carburant et recharge VE d'AutoVere Pro. Simple à proposer, aucun travail technique requis." },
  pl: { title: "Partnerzy organizacyjni AutoVere — 25% zniżki dla Twoich członków", description: "Zostań partnerem AutoVere i daj swoim członkom prawdziwą korzyść podróżniczą: 25% zniżki na rzeczywiste planowanie opłat drogowych, winiet, paliwa i ładowania EV w AutoVere Pro. Proste do zaoferowania, bez pracy technicznej." },
  sv: { title: "AutoVere Organisationspartner — Ge dina medlemmar 25 % rabatt", description: "Bli partner med AutoVere och ge dina medlemmar en verklig reseförmån: 25 % rabatt på AutoVere Pros verkliga beräkning av vägavgifter, vinjetter, drivmedel och elbilsladdning. Enkelt att erbjuda, inget tekniskt arbete krävs." },
  da: { title: "AutoVere Organisationspartnere — Giv dine medlemmer 25 % rabat", description: "Bliv partner med AutoVere, og giv dine medlemmer en reel rejsefordel: 25 % rabat på AutoVere Pros reelle beregning af vejafgifter, vignetter, brændstof og elbilopladning. Nemt at tilbyde, intet teknisk arbejde krævet." },
};

export const demoSeoTitles: Record<Locale, string> = {
  en: "AutoVere Demo — the full Pro experience",
  no: "AutoVere Demo — hele Pro-opplevelsen",
  de: "AutoVere Demo — das vollständige Pro-Erlebnis",
  nl: "AutoVere Demo — de volledige Pro-ervaring",
  fr: "Démo AutoVere — l'expérience Pro complète",
  pl: "Demo AutoVere — pełne doświadczenie Pro",
  sv: "AutoVere Demo — hela Pro-upplevelsen",
  da: "AutoVere Demo — hele Pro-oplevelsen",
};

/**
 * Correct, per-page canonical + hreflang <link> tags computed at render time (works during SSR,
 * not just after client-side hydration) — every language version of a page is its own real
 * canonical, and hreflang always lists the true equivalent URL for every language, never a
 * "?lang=" query string. cleanPath is the page's own logical path with no language prefix,
 * e.g. "/faq" or "/" for the homepage.
 */
export function localizedHeadLinks(cleanPath: string, locale: Locale) {
  return [
    { rel: "canonical", href: `${siteUrl}${pathForLocale(cleanPath, locale)}` },
    ...seoAlternates.map((alternate) => ({
      rel: "alternate",
      hrefLang: alternate.hreflang,
      href: `${siteUrl}${pathForLocale(cleanPath, alternate.locale)}`,
    })),
    { rel: "alternate", hrefLang: "x-default", href: `${siteUrl}${pathForLocale(cleanPath, "en" as Locale)}` },
  ];
}

export function applicationSchema() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "AutoVere",
        url: siteUrl,
        operatingSystem: "All",
        applicationCategory: ["TravelApplication", "NavigationApplication"],
        image: `${siteUrl}/og-image.png`,
        offers: [
          { "@type": "Offer", name: "AutoVere Free", price: "0", priceCurrency: "EUR" },
          { "@type": "Offer", name: "AutoVere Pro", price: "9", priceCurrency: "EUR", priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" } },
          { "@type": "Offer", name: "AutoVere Business / Fleet", price: "39", priceCurrency: "EUR", priceSpecification: { "@type": "UnitPriceSpecification", billingDuration: "P1M" } },
        ],
      },
      { "@type": "Organization", name: "AutoVere", url: siteUrl, logo: `${siteUrl}/favicon.png` },
    ],
  };
}

export function faqSchema(categories: { title: string; questions: { question: string; answer: string }[] }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) => category.questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    }))),
  };
}

export function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export function applyLocalizedSeo(locale: Locale) {
  const copy = seoCopy[locale] ?? seoCopy.en;
  const pathname = window.location.pathname;
  document.title = copy.title;
  document.documentElement.lang = locale;
  upsertMeta("name", "description", copy.description);
  upsertMeta("name", "keywords", copy.keywords);
  upsertMeta("property", "og:title", copy.title);
  upsertMeta("property", "og:description", copy.description);
  upsertMeta("property", "og:locale", copy.ogLocale);
  // The canonical URL is this exact page in its own language — the root English page is its
  // own canonical, /no is Norwegian's own canonical, and so on. Never point every language's
  // canonical back at English, which would tell search engines the translations don't matter.
  upsertMeta("property", "og:url", `${siteUrl}${pathname}`);
  upsertMeta("name", "twitter:title", copy.title);
  upsertMeta("name", "twitter:description", copy.description);
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `${siteUrl}${pathname}`;
  for (const alternate of seoAlternates) {
    const link = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${alternate.hreflang}"]`);
    if (link) link.href = `${siteUrl}${pathForLocale(pathname, alternate.locale)}`;
  }
  const defaultLink = document.head.querySelector<HTMLLinkElement>('link[rel="alternate"][hreflang="x-default"]');
  if (defaultLink) defaultLink.href = `${siteUrl}${pathForLocale(pathname, "en")}`;
}
