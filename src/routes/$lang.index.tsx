import { createFileRoute, notFound } from "@tanstack/react-router";

import { HeroPlanner } from "@/components/HeroPlanner";
import { LOCALE_LANDING } from "@/lib/dictionaries";
import { isLocalePrefix, LOCALE_ROUTES } from "@/lib/locales";

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
    return {
      meta: [
        { title: c.metaTitle },
        { name: "description", content: c.metaDescription },
        { property: "og:title", content: c.metaTitle },
        { property: "og:description", content: c.metaDescription },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
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
    </main>
  );
}
