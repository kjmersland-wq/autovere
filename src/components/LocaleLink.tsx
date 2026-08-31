import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import { prefixFromPath, isLocalePage } from "@/lib/locales";
import { regionFromPath } from "@/lib/trip-data";

type Props = {
  /** English path, e.g. "/planner" or "/" */
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
};

const REGION_PAGES = ["planner", "tolls", "scenic", "garage", "pricing", "faq", "how-it-works", "partners"];

/**
 * Link that keeps the visitor inside the current language tree:
 * on /de, "/planner" resolves to "/de/planner".
 */
export function LocaleLink({ to, children, className, activeClassName, onClick }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prefix = prefixFromPath(pathname);
  const region = regionFromPath(pathname);
  const activeProps = activeClassName ? { activeProps: { className: activeClassName } } : {};

  if (!prefix) {
    // Regional trees (US/Canada) keep their own prefix so the page stays in-region.
    const regionPrefix = region === "us" ? "/us" : region === "ca" ? "/ca" : "";
    const regionSlug = to.replace(/^\/+/, "").split("/")[0] ?? "";
    const target =
      regionPrefix && REGION_PAGES.includes(regionSlug)
        ? `${regionPrefix}/${regionSlug}`
        : regionPrefix && !regionSlug
          ? regionPrefix
          : to;
    return (
      <Link to={target as "/"} className={className} {...activeProps} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const slug = to.replace(/^\/+/, "").split("/")[0] ?? "";
  if (!slug || !isLocalePage(slug)) {
    return (
      <Link to="/$lang" params={{ lang: prefix }} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <Link
      to="/$lang/$page"
      params={{ lang: prefix, page: slug }}
      className={className}
      {...activeProps}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
