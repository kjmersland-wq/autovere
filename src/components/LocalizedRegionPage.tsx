import { GaragePage } from "@/components/GaragePage";
import { HeroPlanner } from "@/components/HeroPlanner";
import { InfoPage } from "@/components/InfoPage";
import { PricingPage } from "@/components/PricingPage";
import { ScenicGuide } from "@/components/ScenicGuide";
import { TollsGuide } from "@/components/TollsGuide";
import { LOCALE_LANDING } from "@/lib/dictionaries";
import { infoForLang } from "@/lib/info-by-lang";
import { LOCALE_ROUTES } from "@/lib/locales";
import { regionStrings } from "@/lib/region-i18n";
import type { Locale } from "@/lib/i18n";
import type { RegionKey } from "@/lib/trip-data";

/**
 * Renders a page for any (language × region) combination — e.g. /fr/ca or /no/us/planner.
 * Language and region are independent inputs.
 */
export function LocalizedRegionPage({
  lang,
  region,
  page,
}: {
  lang: string;
  region: RegionKey;
  page: string | null;
}) {
  const entry = LOCALE_ROUTES.find((l) => l.prefix === lang);
  const code = (entry?.code ?? "en") as Locale;
  const landing = entry ? LOCALE_LANDING[code] : null;
  const rs = regionStrings(code, region);

  if (page === "pricing") return <PricingPage region={region} />;
  if (page === "garage") return <GaragePage />;
  if (page === "tolls") return <TollsGuide />;
  if (page === "scenic") return <ScenicGuide />;

  // faq / how-it-works / partners / privacy / terms — localized info content.
  const info = page ? infoForLang(lang, page) : null;
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


  return (
    <main>
      <HeroPlanner
        region={region}
        eyebrow={rs.eyebrow}
        title={landing?.title ?? "Plan it once. Enjoy every kilometre."}
        subtitle={
          landing?.subtitle ??
          "Tell us where you're starting and where you're dreaming of — we'll handle tolls, vignettes, fuel, charging and ferries."
        }
      />
    </main>
  );
}
