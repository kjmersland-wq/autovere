import { createFileRoute, notFound } from "@tanstack/react-router";

import { SeoRoutePage } from "@/components/SeoRoutePage";
import { corridorBySlug, corridorFaqJsonLd, corridorTripJsonLd } from "@/data/seo-corridors";
import { seoRouteCopy } from "@/lib/seo-route-i18n";
import { isLocalePrefix, LOCALE_ROUTES, type LocalePrefix } from "@/lib/locales";
import { absUrl, corridorHreflangLinks, ogImageMeta, ogImageUrl } from "@/lib/seo";

export const Route = createFileRoute("/$lang/routes/$slug")({
  beforeLoad: ({ params }) => {
    if (!isLocalePrefix(params.lang)) throw notFound();
    if (!corridorBySlug(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const corridor = corridorBySlug(params.slug);
    if (!corridor) return {};
    const prefix = params.lang as LocalePrefix;
    const entry = LOCALE_ROUTES.find((l) => l.prefix === prefix);
    const locale = entry?.code ?? "en";
    const copy = seoRouteCopy(locale);
    const year = new Date().getFullYear();
    const title = copy.pageTitle(corridor.origin.name, corridor.destination.name, year);
    const description = copy.metaDescription(corridor.origin.name, corridor.destination.name);
    const url = absUrl(`/${params.lang}/routes/${params.slug}`);
    const faqs = copy.faqQuestions(corridor.origin.name, corridor.destination.name);

    return {
      meta: [
        { title: `${title} | AutoVere` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...ogImageMeta(ogImageUrl(prefix)),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }, ...corridorHreflangLinks(params.slug)],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(corridorTripJsonLd(corridor)) },
        { type: "application/ld+json", children: JSON.stringify(corridorFaqJsonLd(faqs)) },
      ],
    };
  },
  component: LangRoutePage,
});

function LangRoutePage() {
  const { lang, slug } = Route.useParams();
  const corridor = corridorBySlug(slug);
  if (!corridor) return null;
  const params = new URLSearchParams({ origin: corridor.origin.name, destination: corridor.destination.name });
  return <SeoRoutePage corridor={corridor} plannerHref={`/${lang}/planner?${params.toString()}`} />;
}
