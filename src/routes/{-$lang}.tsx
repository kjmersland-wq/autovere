import { createFileRoute, notFound, Outlet } from "@tanstack/react-router";
import { stripLangPrefix, URL_LANG_CODES, URL_LANG_TO_LOCALE } from "@/lib/i18n";
import { localizedHeadLinks, seoCopy } from "@/lib/seo";

export const Route = createFileRoute("/{-$lang}")({
  beforeLoad: ({ params }) => {
    const lang = (params as { lang?: string }).lang;
    if (lang !== undefined && !URL_LANG_CODES.includes(lang)) {
      throw notFound();
    }
  },
  // Computed once per navigation for the actual leaf page being rendered (not just this layout's
  // own segment), so every page gets correct language metadata and a correct canonical/hreflang
  // set — including in the server-rendered HTML, before any client-side JS has run. A leaf
  // route's own head() (e.g. the homepage's more specific title) still wins where one is set.
  head: (ctx) => {
    const leafMatch = ctx.matches[ctx.matches.length - 1];
    const fullPathname = leafMatch?.pathname ?? "/";
    const cleanPath = stripLangPrefix(fullPathname);
    const lang = (ctx.params as { lang?: string }).lang;
    const locale = lang ? (URL_LANG_TO_LOCALE[lang] ?? "en") : "en";
    const copy = seoCopy[locale] ?? seoCopy.en;
    return {
      meta: [
        { title: copy.title },
        { name: "description", content: copy.description },
        { name: "keywords", content: copy.keywords },
        { property: "og:title", content: copy.title },
        { property: "og:description", content: copy.description },
        { property: "og:locale", content: copy.ogLocale },
        { name: "twitter:title", content: copy.title },
        { name: "twitter:description", content: copy.description },
      ],
      links: localizedHeadLinks(cleanPath, locale),
    };
  },
  component: () => <Outlet />,
});
