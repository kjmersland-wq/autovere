import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import { prefixFromPath, isLocalePage } from "@/lib/locales";

type Props = {
  /** English path, e.g. "/planner" or "/" */
  to: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
};

/**
 * Link that keeps the visitor inside the current language tree:
 * on /de, "/planner" resolves to "/de/planner".
 */
export function LocaleLink({ to, children, className, activeClassName, onClick }: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const prefix = prefixFromPath(pathname);
  const activeProps = activeClassName ? { className: activeClassName } : undefined;

  if (!prefix) {
    return (
      <Link to={to} className={className} activeProps={activeProps} onClick={onClick}>
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
      activeProps={activeProps}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
