import { Link } from "@tanstack/react-router";
import { forwardRef, type AnchorHTMLAttributes } from "react";
import { pathForLocale, useLocale, type Locale } from "@/lib/i18n";

const NEVER_PREFIXED = ["/admin", "/api/"];

/**
 * Prefixes a clean internal path (e.g. "/account", "/") with the active language's URL segment
 * (e.g. "/no/account", "/no"), or leaves it unprefixed for English. Admin and API paths are
 * never part of the language architecture and pass through untouched.
 */
export function localizedPath(to: string, locale: Locale): string {
  if (!to.startsWith("/") || NEVER_PREFIXED.some((prefix) => to === prefix || to.startsWith(`${prefix}/`) || to.startsWith(prefix))) {
    return to;
  }
  return pathForLocale(to, locale);
}

type AppLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/**
 * Drop-in replacement for TanStack Router's <Link> that automatically keeps internal
 * navigation inside the currently active language — e.g. from /no/account, <Link to="/faq">
 * resolves to /no/faq. Import as `Link` (`import { AppLink as Link } from "@/components/AppLink"`)
 * so call sites never need to think about the current language, and can keep writing plain,
 * unprefixed paths ("/account", "/faq", "/") exactly as before, with ordinary anchor props
 * (className, children, onClick, target, rel, aria-label, ...).
 */
export const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>(function AppLink({ to, ...props }, ref) {
  const { locale } = useLocale();
  const resolvedTo = localizedPath(to, locale);
  return <Link ref={ref} to={resolvedTo as never} {...(props as Record<string, unknown>)} />;
});
