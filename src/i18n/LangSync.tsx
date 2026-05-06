import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { detectLangFromPath } from "@/i18n/routing";

export const LangSync = () => {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  useEffect(() => {
    const lang = detectLangFromPath(pathname);
    if (i18n.language !== lang) i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [pathname, i18n]);
  return null;
};
