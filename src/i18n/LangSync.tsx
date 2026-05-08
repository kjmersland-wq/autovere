import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { detectLangFromPath } from "@/i18n/routing";
import { DEFAULT_LANG, SUPPORTED_LANGS, type Lang } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";

const STORAGE_KEY = "autovere.lang";

export const LangSync = () => {
  const navigate = useNavigate();
  const { pathname, search, hash } = useLocation();
  const { i18n } = useTranslation();
  useEffect(() => {
    const seg = pathname.split("/").filter(Boolean)[0];
    const hasExplicitLang = Boolean(seg && (SUPPORTED_LANGS as readonly string[]).includes(seg));
    const stored = (() => {
      try {
        return localStorage.getItem(STORAGE_KEY) as Lang | null;
      } catch {
        return null;
      }
    })();
    if (!hasExplicitLang && stored && stored !== DEFAULT_LANG) {
      const next = localizePath(pathname, stored) + search + hash;
      if (next !== pathname + search + hash) {
        navigate(next, { replace: true });
        return;
      }
    }
    const lang = detectLangFromPath(pathname);
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {}
  }, [pathname, search, hash, i18n, navigate]);
  return null;
};
