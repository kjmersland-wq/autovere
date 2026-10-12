import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { GLOBAL_HOW_IT_WORKS } from "@/lib/global-content";
import { absUrl, appPageHreflangLinks, howToScript, ogImageMeta, ogImageUrl, breadcrumbScript } from "@/lib/seo";

const content = GLOBAL_HOW_IT_WORKS;

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:url", content: absUrl("/how-it-works") },
      ...ogImageMeta(ogImageUrl(null)),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: absUrl("/how-it-works") },
      ...appPageHreflangLinks("how-it-works"),
    ],
    scripts: [...howToScript(content.title, content.intro, content.sections), ...breadcrumbScript([{ name: "Home", url: absUrl("/") }, { name: "How it works", url: absUrl("/how-it-works") }])],
  }),
  component: GlobalHowItWorks,
});

function GlobalHowItWorks() {
  return (
    <InfoPage
      eyebrow={content.eyebrow}
      title={content.title}
      intro={content.intro}
      sections={content.sections}
      note={content.note}
    />
  );
}
