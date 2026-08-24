import type { Locale } from "./i18n";

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
};

export const seoAlternates = [
  { lang: "en", locale: "en_GB", path: "en" },
  { lang: "nb", locale: "nb_NO", path: "no" },
  { lang: "de", locale: "de_DE", path: "de" },
  { lang: "nl", locale: "nl_NL", path: "nl" },
  { lang: "pl", locale: "pl_PL", path: "pl" },
  { lang: "sv", locale: "sv_SE", path: "sv" },
] as const;

export const siteUrl = "https://www.autovere.com";

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
  const copy = seoCopy[locale];
  const pathname = window.location.pathname;
  document.title = copy.title;
  upsertMeta("name", "description", copy.description);
  upsertMeta("name", "keywords", copy.keywords);
  upsertMeta("property", "og:title", copy.title);
  upsertMeta("property", "og:description", copy.description);
  upsertMeta("property", "og:locale", copy.ogLocale);
  upsertMeta("property", "og:url", `${siteUrl}${pathname}`);
  upsertMeta("name", "twitter:title", copy.title);
  upsertMeta("name", "twitter:description", copy.description);
  const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonical) canonical.href = `${siteUrl}${pathname}`;
  for (const alternate of seoAlternates) {
    const link = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${alternate.lang}"]`);
    if (link) link.href = `${siteUrl}${pathname}?lang=${alternate.path}`;
  }
}
