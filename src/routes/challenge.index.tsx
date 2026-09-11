import { createFileRoute } from "@tanstack/react-router";

import { ChallengeLanding } from "@/components/challenge/ChallengeLanding";
import { CHALLENGE_EN } from "@/lib/challenge-content";
import { challengeHreflangLinks, challengeOgImage, ogImageMeta } from "@/lib/seo";

const URL = "https://www.autovere.com/challenge";

export const Route = createFileRoute("/challenge/")({
  head: () => ({
    meta: [
      { title: CHALLENGE_EN.meta.title },
      { name: "description", content: CHALLENGE_EN.meta.description },
      { property: "og:title", content: CHALLENGE_EN.meta.title },
      { property: "og:description", content: CHALLENGE_EN.meta.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_GB" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: CHALLENGE_EN.meta.title },
      { name: "twitter:description", content: CHALLENGE_EN.meta.description },
      ...ogImageMeta(challengeOgImage(null)),
    ],
    links: [{ rel: "canonical", href: URL }, ...challengeHreflangLinks()],
  }),
  component: () => <ChallengeLanding />,
});
