import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

import { trackPageView } from "@/lib/analytics";

/** Records one page view per route the visitor lands on, including the initial load. */
export function PageViewTracker() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    void trackPageView(pathname);
  }, [pathname]);

  return null;
}
