import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import { buildPath, isLocalePage, splitPath } from "@/lib/locales";

type Props = {
  /** English path, e.g. "/planner" or "/" */
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
};

/**
 * Link that keeps the visitor inside the current language AND region:
 * on /fr/ca, "/planner" resolves to "/fr/ca/planner".
 */
export function LocaleLink({ to, children, className, activeClassName, onClick }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { prefix, region } = splitPath(pathname);
  const activeProps = activeClassName ? { activeProps: { className: activeClassName } } : {};

  const slug = to.replace(/^\/+/, "").split("/")[0] ?? "";
  const page = slug && isLocalePage(slug) ? slug : null;
  const target = page || !slug ? buildPath({ prefix, region, page }) : to;

  return (
    <Link to={target as "/"} className={className} {...activeProps} onClick={onClick}>
      {children}
    </Link>
  );
}
