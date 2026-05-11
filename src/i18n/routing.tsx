import { Link, LinkProps, useLocation, useParams } from "react-router-dom";
import { forwardRef } from "react";
import { SUPPORTED_LANGS, type Lang, DEFAULT_LANG } from "@/i18n/config";

export const detectLangFromPath = (pathname: string): Lang => {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg && (SUPPORTED_LANGS as readonly string[]).includes(seg)) return seg as Lang;
  return DEFAULT_LANG;
};

export const useLang = (): Lang => {
  const params = useParams<{ lang?: string }>();
  const location = useLocation();
  if (params.lang && (SUPPORTED_LANGS as readonly string[]).includes(params.lang))
    return params.lang as Lang;
  return detectLangFromPath(location.pathname);
};

export const localizePath = (path: string, lang: Lang): string => {
  // strip any existing /xx/ prefix
  let clean = path.startsWith("/") ? path : `/${path}`;
  const seg = clean.split("/")[1];
  if (seg && (SUPPORTED_LANGS as readonly string[]).includes(seg)) {
    clean = "/" + clean.split("/").slice(2).join("/");
  }
  if (clean === "/") return lang === DEFAULT_LANG ? "/" : `/${lang}`;
  return lang === DEFAULT_LANG ? clean : `/${lang}${clean}`;
};

export const stripLocalizedPath = (pathname: string): string => {
  const lang = detectLangFromPath(pathname);
  const localizedPrefix = lang === DEFAULT_LANG ? "" : `/${lang}`;
  return localizedPrefix && pathname.startsWith(localizedPrefix)
    ? pathname.slice(localizedPrefix.length) || "/"
    : pathname;
};

type LLinkProps = Omit<LinkProps, "to"> & { to: string };

export const LLink = forwardRef<HTMLAnchorElement, LLinkProps>(({ to, ...rest }, ref) => {
  const lang = useLang();
  return <Link ref={ref} to={localizePath(to, lang)} {...rest} />;
});
LLink.displayName = "LLink";
