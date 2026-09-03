import { useEffect } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";

import { LOCALE_ROUTES } from "@/lib/locales";

const FLAG_KEY = "autovere.localeAuto";

/**
 * Cold-visit language detection: a first-time visitor landing on the language-neutral
 * root is forwarded once to the language tree matching their browser locale.
 * Runs only on "/", never overrides an explicit language choice, and only fires once.
 */
export function LocaleAutoDetect() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname !== "/") return;
    try {
      if (localStorage.getItem(FLAG_KEY)) return;
      localStorage.setItem(FLAG_KEY, "1");
    } catch {
      return;
    }
    const tags = [...(navigator.languages ?? []), navigator.language]
      .filter(Boolean)
      .map((l) => l.toLowerCase());
    for (const tag of tags) {
      const [langRaw = "", regionRaw = ""] = tag.split("-");
      const region = regionRaw.toUpperCase();
      if (langRaw === "en" && region === "US") {
        void navigate({ to: "/usa" });
        return;
      }
      if (langRaw === "en") return; // English visitors stay on the root tree
      const lang = langRaw === "nb" || langRaw === "nn" ? "no" : langRaw;
      const match = LOCALE_ROUTES.find((l) => l.code === lang);
      if (match) {
        void navigate({ to: `/${match.prefix}` });
        return;
      }
    }
  }, [pathname, navigate]);

  return null;
}
