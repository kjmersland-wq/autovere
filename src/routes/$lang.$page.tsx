import { createFileRoute, notFound } from "@tanstack/react-router";

import { GaragePage } from "@/components/GaragePage";
import { HeroPlanner } from "@/components/HeroPlanner";
import { InfoPage } from "@/components/InfoPage";
import { PartnersPage } from "@/components/PartnersPage";
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
  PL_FAQ,
  PL_HOW_IT_WORKS,
  PL_PARTNERS,
  PL_PRICING,
  PL_PRIVACY,
  PL_TERMS,
} from "@/lib/global-content-pl";
import { isLocalePage, isLocalePrefix, LOCALE_ROUTES } from "@/lib/locales";

const INFO = {
  faq: GLOBAL_FAQ,
  "how-it-works": GLOBAL_HOW_IT_WORKS,
  pricing: GLOBAL_PRICING,
  partners: GLOBAL_PARTNERS,
  privacy: GLOBAL_PRIVACY,
  terms: GLOBAL_TERMS,
} as const;

const INFO_PL = {
  faq: PL_FAQ,
  "how-it-works": PL_HOW_IT_WORKS,
  pricing: PL_PRICING,
  partners: PL_PARTNERS,
  privacy: PL_PRIVACY,
  terms: PL_TERMS,
} as const;

function infoFor(lang: string, page: string) {
  if (lang === "pl") return INFO_PL[page as keyof typeof INFO_PL] ?? null;
  return INFO[page as keyof typeof INFO] ?? null;
}

export const Route = createFileRoute("/$lang/$page")({
  beforeLoad: ({ params }) => {
    if (!isLocalePrefix(params.lang) || !isLocalePage(params.page)) throw notFound();
  },
  head: ({ params }) => {
    const info = infoFor(params.lang, params.page);
    if (info) {
      return {
        meta: [
          { title: info.meta.title },
          { name: "description", content: info.meta.description },
          { property: "og:title", content: info.meta.title },
          { property: "og:description", content: info.meta.description },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
        ],
      };
    }
    const entry = LOCALE_ROUTES.find((l) => l.prefix === params.lang);
    const landing = entry ? LOCALE_LANDING[entry.code] : null;
    const title = landing?.metaTitle ?? "AutoVere";
    const description = landing?.metaDescription ?? "Cross-border road trip cost intelligence.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: LocalePage,
});

function LocalePage() {
  const { lang, page } = Route.useParams();
  const entry = LOCALE_ROUTES.find((l) => l.prefix === lang);
  const landing = entry ? LOCALE_LANDING[entry.code] : null;

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
