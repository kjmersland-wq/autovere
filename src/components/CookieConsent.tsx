import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { localizePath, detectLangFromPath } from "@/i18n/routing";

const STORAGE_KEY = "autovere_cookie_consent";

export function CookieConsent() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const lang = detectLangFromPath(pathname);
  const L = (p: string) => localizePath(p, lang);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[100] glass border border-border/40 rounded-2xl p-4 shadow-lg"
    >
      <button
        onClick={decline}
        aria-label="Close cookie notice"
        className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <p className="text-xs text-muted-foreground leading-relaxed pr-5 mb-3">
        {t("cookies.message")}{" "}
        <Link
          to={L("/legal/cookies")}
          className="text-accent hover:underline"
        >
          {t("cookies.learn_more")}
        </Link>
      </p>
      <div className="flex gap-2">
        <button
          onClick={accept}
          className="flex-1 px-3 py-1.5 rounded-xl bg-accent text-accent-foreground text-xs font-medium hover:opacity-90 transition-opacity"
        >
          {t("cookies.accept")}
        </button>
        <button
          onClick={decline}
          className="flex-1 px-3 py-1.5 rounded-xl glass border border-border/40 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {t("cookies.decline")}
        </button>
      </div>
    </div>
  );
}
