import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { HOW_IT_WORKS } from "@/lib/info-content";
import { appPageHreflangLinks } from "@/lib/seo";

const content = HOW_IT_WORKS["us"];

export const Route = createFileRoute("/us/how-it-works")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.autovere.com/us/how-it-works" },
      { property: "og:image", content: "https://www.autovere.com/og/og-us.jpg" },
      { property: "og:image:secure_url", content: "https://www.autovere.com/og/og-us.jpg" },
      { property: "og:image:type", content: "image/jpeg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "AutoVere — know the true cost of every mile" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://www.autovere.com/og/og-us.jpg" },
      { name: "twitter:image:alt", content: "AutoVere USA road trip cost planner" },
      { name: "thumbnail", content: "https://www.autovere.com/og/autovere-square-us.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://www.autovere.com/us/how-it-works" },
      ...appPageHreflangLinks("how-it-works"),
    ],
  }),
  component: UsHowItWorksPage,
});

function UsHowItWorksPage() {
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
