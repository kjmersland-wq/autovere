import { createFileRoute, notFound } from "@tanstack/react-router";

import { LocalizedRegionPage } from "@/components/LocalizedRegionPage";
import { infoForLang } from "@/lib/info-by-lang";
import { isLocalePage, isLocalePrefix, isRegionPrefix, type LocalePrefix } from "@/lib/locales";
import { absUrl, ogImageMeta, ogImageUrl, ogLocaleFor } from "@/lib/seo";
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
    const image = ogImageUrl(params.lang as LocalePrefix);
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
        { property: "og:locale", content: ogLocaleFor(params.lang as LocalePrefix) },
        { property: "og:url", content: url },
        ...ogImageMeta(image),
        { name: "twitter:card", content: "summary_large_image" },
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
