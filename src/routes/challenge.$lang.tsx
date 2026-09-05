import { createFileRoute, notFound } from "@tanstack/react-router";

import { ChallengeLanding } from "@/components/challenge/ChallengeLanding";
import { challengeContent, isChallengeLang, type ChallengeLang } from "@/lib/challenge-content";
import { challengeOgImage, ogImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/challenge/$lang")({
  beforeLoad: ({ params }) => {
    // /challenge is the English (GB) root — /challenge/gb must never exist.
    if (!isChallengeLang(params.lang)) throw notFound();
  },
  head: ({ params }) => {
    const c = challengeContent(params.lang);
    const url = `https://www.autovere.com/challenge/${params.lang}`;
    return {
      meta: [
        { title: c.meta.title },
        { name: "description", content: c.meta.description },
        { property: "og:title", content: c.meta.title },
        { property: "og:description", content: c.meta.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: c.meta.title },
        { name: "twitter:description", content: c.meta.description },
        ...ogImageMeta(challengeOgImage(params.lang)),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: ChallengeLocale,
});

function ChallengeLocale() {
  const { lang } = Route.useParams();
  return <ChallengeLanding lang={lang as ChallengeLang} />;
}
