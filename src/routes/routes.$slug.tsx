import { createFileRoute, notFound } from "@tanstack/react-router";

import { SeoRoutePage } from "@/components/SeoRoutePage";
import { corridorBySlug, corridorFaqJsonLd, corridorTripJsonLd } from "@/data/seo-corridors";
import { seoRouteCopy } from "@/lib/seo-route-i18n";
import { absUrl, corridorHreflangLinks, ogImageMeta, ogImageUrl } from "@/lib/seo";

export const Route = createFileRoute("/routes/$slug")({
  beforeLoad: ({ params }) => {
    if (!corridorBySlug(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const corridor = corridorBySlug(params.slug);
    if (!corridor) return {};
    const copy = seoRouteCopy("en");
    const year = new Date().getFullYear();
    const title = copy.pageTitle(corridor.origin.name, corridor.destination.name, year);
    const description = copy.metaDescription(corridor.origin.name, corridor.destination.name);
    const url = absUrl(`/routes/${params.slug}`);
    const faqs = copy.faqQuestions(corridor.origin.name, corridor.destination.name);

    return {
      meta: [
        { title: `${title} | AutoVere` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...ogImageMeta(ogImageUrl(null)),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }, ...corridorHreflangLinks(params.slug)],
      scripts: [
        { type: "application/ld+json", children: JSON.stringify(corridorTripJsonLd(corridor)) },
        { type: "application/ld+json", children: JSON.stringify(corridorFaqJsonLd(faqs)) },
      ],
    };
  },
  component: RoutePage,
});

function RoutePage() {
  const { slug } = Route.useParams();
  const corridor = corridorBySlug(slug);
  if (!corridor) return null;
  const params = new URLSearchParams({ origin: corridor.origin.name, destination: corridor.destination.name });
  return <SeoRoutePage corridor={corridor} plannerHref={`/planner?${params.toString()}`} />;
}
