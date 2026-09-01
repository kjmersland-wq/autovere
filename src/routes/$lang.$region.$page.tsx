import { createFileRoute, notFound } from "@tanstack/react-router";

import { LocalizedRegionPage } from "@/components/LocalizedRegionPage";
import { infoForLang } from "@/lib/info-by-lang";
import { isLocalePage, isLocalePrefix, isRegionPrefix } from "@/lib/locales";
import { absUrl } from "@/lib/seo";
import type { RegionKey } from "@/lib/trip-data";

const REGION_NAME: Record<string, string> = { us: "USA", ca: "Canada" };

export const Route = createFileRoute("/$lang/$region/$page")({
  beforeLoad: ({ params }) => {
    if (!isLocalePrefix(params.lang) || !isRegionPrefix(params.region) || !isLocalePage(params.page))
      throw notFound();
  },
  head: ({ params }) => {
    const url = absUrl(`/${params.lang}/${params.region}/${params.page}`);
    const regionName = REGION_NAME[params.region] ?? "";
    const info = infoForLang(params.lang, params.page);
    const image = absUrl(`/og/autovere-og-${params.region}.jpg`);
    const title = info
      ? `${info.meta.title} — ${regionName}`
      : `AutoVere ${regionName} — ${params.page.replace(/-/g, " ")} (${params.lang.toUpperCase()})`;
    const description =
      info?.meta.description ??
      `Tolls, fuel, EV charging and ferry costs for ${regionName || "your"} road trips — in your language.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },

  component: MatrixPage,
});

function MatrixPage() {
  const { lang, region, page } = Route.useParams();
  return <LocalizedRegionPage lang={lang} region={region as RegionKey} page={page} />;
}
