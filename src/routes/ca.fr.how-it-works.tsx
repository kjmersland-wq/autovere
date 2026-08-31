import { createFileRoute } from "@tanstack/react-router";

import { InfoPage } from "@/components/InfoPage";
import { HOW_IT_WORKS } from "@/lib/info-content";

const content = HOW_IT_WORKS["ca-fr"];

export const Route = createFileRoute("/ca/fr/how-it-works")({
  head: () => ({
    meta: [
      { title: content.meta.title },
      { name: "description", content: content.meta.description },
      { property: "og:title", content: content.meta.title },
      { property: "og:description", content: content.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/ca/fr/how-it-works" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/ca/fr/how-it-works" }],
  }),
  component: CaFrHowItWorksPage,
});

function CaFrHowItWorksPage() {
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
