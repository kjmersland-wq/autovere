import { createFileRoute, notFound } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";
import { ShareButton } from "@/components/ShareButton";
import { LOCALE_LANDING } from "@/lib/dictionaries";
import { isLocalePrefix, LOCALE_ROUTES, type LocalePrefix } from "@/lib/locales";
import { homepageHreflangLinks, ogImageMeta, ogImageUrl } from "@/lib/seo";

function landingFor(lang: string) {
  const entry = LOCALE_ROUTES.find((l) => l.prefix === lang);
  return (entry && LOCALE_LANDING[entry.code]) ?? null;
}

export const Route = createFileRoute("/$lang/")({
  beforeLoad: ({ params }) => {
    if (!isLocalePrefix(params.lang)) throw notFound();
  },
  head: ({ params }) => {
    const c = landingFor(params.lang);
    if (!c) return { meta: [{ title: "AutoVere" }] };
    const url = `https://www.autovere.com/${params.lang}`;
    const image = ogImageUrl(params.lang as LocalePrefix);
    const isFi = params.lang === "fi";
    const ogTitle = isFi ? "Tiedä jokaisen kilometrin todellinen hinta | AutoVere" : c.metaTitle;
    const ogDescription = isFi
      ? "Suunnittele unohtumaton automatka. Tarkat tietullit, polttoaineet ja EV-lataukset suoraan autosi navigaattoriin."
      : c.metaDescription;
    return {
      meta: [
        { title: c.metaTitle },
        { name: "description", content: c.metaDescription },
        { property: "og:title", content: ogTitle },
        { property: "og:description", content: ogDescription },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        ...ogImageMeta(image),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: url }, ...homepageHreflangLinks()],
    };
  },
  component: LocaleHome,
});

function LocaleHome() {
  const { lang } = Route.useParams();
  const c = landingFor(lang);
  return (
    <main>
      <HeroPlanner
        region="eu"
        eyebrow={c?.eyebrow ?? "Europe · 30+ countries"}
        title={c?.title ?? "Plan it once. Enjoy every kilometre."}
        subtitle={
          c?.subtitle ??
          "Tell us where you're starting and where you're dreaming of — we'll handle tolls, vignettes, fuel, charging and ferries."
        }
      />
      <div className="mx-auto w-full max-w-6xl px-4 pb-14">
        <ShareButton
          variant="bar"
          lang={lang === "pl" ? "pl" : lang === "no" ? "no" : "en"}
          url={`https://www.autovere.com/${lang}`}
        />
      </div>
    </main>
  );
}
