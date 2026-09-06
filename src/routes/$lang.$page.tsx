import { createFileRoute, notFound } from "@tanstack/react-router";

import { GaragePage } from "@/components/GaragePage";
import { HeroPlanner } from "@/components/HeroPlanner";
import { InfoPage } from "@/components/InfoPage";
import { PartnersPage } from "@/components/PartnersPage";
import { PricingPage } from "@/components/PricingPage";
import { ScenicGuide } from "@/components/ScenicGuide";
import { TollsGuide } from "@/components/TollsGuide";
import { LOCALE_LANDING } from "@/lib/dictionaries";
import {
  GLOBAL_FAQ,
  GLOBAL_HOW_IT_WORKS,
  GLOBAL_PARTNERS,
  GLOBAL_PRICING,
  GLOBAL_PRIVACY,
  GLOBAL_TERMS,
} from "@/lib/global-content";
import {
  DA_FAQ,
  DA_HOW_IT_WORKS,
  DA_PARTNERS,
  DA_PRICING,
  DA_PRIVACY,
  DA_TERMS,
} from "@/lib/global-content-da";
import {
  DE_FAQ,
  DE_HOW_IT_WORKS,
  DE_PARTNERS,
  DE_PRICING,
  DE_PRIVACY,
  DE_TERMS,
} from "@/lib/global-content-de";
import {
  ES_FAQ,
  ES_HOW_IT_WORKS,
  ES_PARTNERS,
  ES_PRICING,
  ES_PRIVACY,
  ES_TERMS,
} from "@/lib/global-content-es";
import { FI_FAQ, FI_HOW_IT_WORKS, FI_PARTNERS, FI_PRIVACY, FI_TERMS } from "@/lib/global-content-fi";
import {
  FR_FAQ,
  FR_HOW_IT_WORKS,
  FR_PARTNERS,
  FR_PRICING,
  FR_PRIVACY,
  FR_TERMS,
} from "@/lib/global-content-fr";
import {
  IT_FAQ,
  IT_HOW_IT_WORKS,
  IT_PARTNERS,
  IT_PRICING,
  IT_PRIVACY,
  IT_TERMS,
} from "@/lib/global-content-it";
import {
  NL_FAQ,
  NL_HOW_IT_WORKS,
  NL_PARTNERS,
  NL_PRICING,
  NL_PRIVACY,
  NL_TERMS,
} from "@/lib/global-content-nl";
import {
  PL_FAQ,
  PL_HOW_IT_WORKS,
  PL_PARTNERS,
  PL_PRICING,
  PL_PRIVACY,
  PL_TERMS,
} from "@/lib/global-content-pl";
import {
  PT_FAQ,
  PT_HOW_IT_WORKS,
  PT_PARTNERS,
  PT_PRICING,
  PT_PRIVACY,
  PT_TERMS,
} from "@/lib/global-content-pt";
import {
  SV_FAQ,
  SV_HOW_IT_WORKS,
  SV_PARTNERS,
  SV_PRICING,
  SV_PRIVACY,
  SV_TERMS,
} from "@/lib/global-content-sv";
import { LocalizedRegionPage } from "@/components/LocalizedRegionPage";
import {
  isLocalePage,
  isLocalePrefix,
  isRegionPrefix,
  LOCALE_ROUTES,
  type LocalePage,
  type LocalePrefix,
} from "@/lib/locales";
import { absUrl, appPageHreflangLinks, appPageMeta, faqScript, ogImageMeta, ogImageUrl, regionalize } from "@/lib/seo";

const INFO = {
  faq: GLOBAL_FAQ,
  "how-it-works": GLOBAL_HOW_IT_WORKS,
  pricing: GLOBAL_PRICING,
  partners: GLOBAL_PARTNERS,
  privacy: GLOBAL_PRIVACY,
  terms: GLOBAL_TERMS,
} as const;

/** Localised info-page content per URL language prefix. */
const INFO_BY_LANG: Record<string, typeof INFO> = {
  pl: {
    faq: PL_FAQ,
    "how-it-works": PL_HOW_IT_WORKS,
    pricing: PL_PRICING,
    partners: PL_PARTNERS,
    privacy: PL_PRIVACY,
    terms: PL_TERMS,
  },
  se: {
    faq: SV_FAQ,
    "how-it-works": SV_HOW_IT_WORKS,
    pricing: SV_PRICING,
    partners: SV_PARTNERS,
    privacy: SV_PRIVACY,
    terms: SV_TERMS,
  },
  dk: {
    faq: DA_FAQ,
    "how-it-works": DA_HOW_IT_WORKS,
    pricing: DA_PRICING,
    partners: DA_PARTNERS,
    privacy: DA_PRIVACY,
    terms: DA_TERMS,
  },
  de: {
    faq: DE_FAQ,
    "how-it-works": DE_HOW_IT_WORKS,
    pricing: DE_PRICING,
    partners: DE_PARTNERS,
    privacy: DE_PRIVACY,
    terms: DE_TERMS,
  },
  nl: {
    faq: NL_FAQ,
    "how-it-works": NL_HOW_IT_WORKS,
    pricing: NL_PRICING,
    partners: NL_PARTNERS,
    privacy: NL_PRIVACY,
    terms: NL_TERMS,
  },
  fr: {
    faq: FR_FAQ,
    "how-it-works": FR_HOW_IT_WORKS,
    pricing: FR_PRICING,
    partners: FR_PARTNERS,
    privacy: FR_PRIVACY,
    terms: FR_TERMS,
  },
  es: {
    faq: ES_FAQ,
    "how-it-works": ES_HOW_IT_WORKS,
    pricing: ES_PRICING,
    partners: ES_PARTNERS,
    privacy: ES_PRIVACY,
    terms: ES_TERMS,
  },
  it: {
    faq: IT_FAQ,
    "how-it-works": IT_HOW_IT_WORKS,
    pricing: IT_PRICING,
    partners: IT_PARTNERS,
    privacy: IT_PRIVACY,
    terms: IT_TERMS,
  },
  fi: {
    faq: FI_FAQ,
    "how-it-works": FI_HOW_IT_WORKS,
    pricing: GLOBAL_PRICING,
    partners: FI_PARTNERS,
    privacy: FI_PRIVACY,
    terms: FI_TERMS,
  },
  pt: {
    faq: PT_FAQ,
    "how-it-works": PT_HOW_IT_WORKS,
    pricing: PT_PRICING,
    partners: PT_PARTNERS,
    privacy: PT_PRIVACY,
    terms: PT_TERMS,
  },
};

function infoFor(lang: string, page: string) {
  const set = INFO_BY_LANG[lang] ?? INFO;
  return set[page as keyof typeof INFO] ?? null;
}

export const Route = createFileRoute("/$lang/$page")({
  beforeLoad: ({ params }) => {
    if (!isLocalePrefix(params.lang)) throw notFound();
    if (!isLocalePage(params.page) && !isRegionPrefix(params.page)) throw notFound();
  },
  head: ({ params }) => {
    const prefix = params.lang as LocalePrefix;
    const page = params.page as LocalePage;
    const url = absUrl(`/${params.lang}/${params.page}`);

    // /<lang>/us and /<lang>/ca are regional homes, not content pages.
    if (isRegionPrefix(params.page)) {
      const regionName = params.page === "ca" ? "Canada" : "USA";
      const regionImage = absUrl(`/og/autovere-og-${params.page}.jpg`);
      const rTitle = `AutoVere ${regionName} — Road Trip Toll & Fuel Cost Planner (${params.lang.toUpperCase()})`;
      const rDesc =
        params.page === "ca"
          ? "Plan Canadian road trips with exact toll, fuel, EV charging and ferry costs — in your language."
          : "Plan American road trips with exact toll, gas, EV charging and ferry costs — in your language.";
      return {
        meta: [
          { title: rTitle },
          { name: "description", content: rDesc },
          { property: "og:title", content: rTitle },
          { property: "og:description", content: rDesc },
          { property: "og:type", content: "website" },
          { property: "og:url", content: url },
          ...ogImageMeta(regionImage),
          { name: "twitter:card", content: "summary_large_image" },
        ],
        links: [{ rel: "canonical", href: url }],
      };
    }

    const image = ogImageUrl(prefix);
    const info = infoFor(params.lang, params.page);
    const localized = INFO_BY_LANG[prefix] != null;

    let title: string;
    let description: string;
    if (info) {
      const meta = localized ? info.meta : regionalize(prefix, info.meta);
      title = meta.title;
      description = meta.description;
    } else {
      const app = appPageMeta(prefix, page);
      const entry = LOCALE_ROUTES.find((l) => l.prefix === params.lang);
      const landing = entry ? LOCALE_LANDING[entry.code] : null;
      title = app?.title ?? landing?.metaTitle ?? "AutoVere";
      description =
        app?.description ?? landing?.metaDescription ?? "Cross-border road trip cost intelligence.";
    }

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...ogImageMeta(image),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: url },
        ...appPageHreflangLinks(page, page !== "privacy" && page !== "terms"),
      ],
      ...(info && params.page === "faq" ? { scripts: faqScript(info.sections) } : {}),
    };
  },
  component: LocalePage,
});

function LocalePage() {
  const { lang, page } = Route.useParams();
  // /<lang>/us and /<lang>/ca — regional home in the active language.
  if (page === "us" || page === "ca") {
    return <LocalizedRegionPage lang={lang} region={page} page={null} />;
  }
  const entry = LOCALE_ROUTES.find((l) => l.prefix === lang);
  const landing = entry ? LOCALE_LANDING[entry.code] : null;

  if (page === "pricing") return <PricingPage />;

  if (page === "partners" && lang === "pl") return <PartnersPage lang="pl" />;

  const info = infoFor(lang, page);
  if (info) {
    return (
      <InfoPage
        eyebrow={info.eyebrow}
        title={info.title}
        intro={info.intro}
        sections={info.sections}
        note={info.note}
      />
    );
  }

  if (page === "garage") return <GaragePage />;
  if (page === "tolls") return <TollsGuide />;
  if (page === "scenic") return <ScenicGuide />;

  return (
    <main>
      <HeroPlanner
        region="eu"
        eyebrow={landing?.eyebrow ?? "Europe · 30+ countries"}
        title={landing?.title ?? "Plan it once. Enjoy every kilometre."}
        subtitle={
          landing?.subtitle ??
          "Tell us where you're starting and where you're dreaming of — we'll handle tolls, vignettes, fuel, charging and ferries."
        }
      />
    </main>
  );
}
