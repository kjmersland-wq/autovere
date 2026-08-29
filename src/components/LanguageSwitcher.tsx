import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useLocale, useT } from "@/lib/i18n";

const LANGUAGE_OPTIONS = [
  { locale: "en", code: "GB" },
  { locale: "no", code: "NO" },
  { locale: "sv", code: "SE" },
  { locale: "da", code: "DK" },
  { locale: "de", code: "DE" },
  { locale: "nl", code: "NL" },
  { locale: "fr", code: "FR" },
  { locale: "pl", code: "PL" },
] as const;

function CountryFlag({ code }: { code: (typeof LANGUAGE_OPTIONS)[number]["code"] }) {
  const common = { width: 18, height: 12, viewBox: "0 0 18 12", className: "shrink-0 rounded-[2px]" };
  if (code === "GB") return <svg {...common} aria-hidden><rect width="18" height="12" fill="#1b3f8f" /><path d="M0 0 18 12M18 0 0 12" stroke="#fff" strokeWidth="3" /><path d="M0 0 18 12M18 0 0 12" stroke="#d71920" strokeWidth="1" /><path d="M9 0v12M0 6h18" stroke="#fff" strokeWidth="4" /><path d="M9 0v12M0 6h18" stroke="#d71920" strokeWidth="2" /></svg>;
  if (code === "SE") return <svg {...common} aria-hidden><rect width="18" height="12" fill="#006aa7" /><path d="M6 0v12M0 4h18" stroke="#fecc00" strokeWidth="2" /></svg>;
  if (code === "NO") return <svg {...common} aria-hidden><rect width="18" height="12" fill="#ba0c2f" /><path d="M5 0v12M0 6h18" stroke="#fff" strokeWidth="4" /><path d="M5 0v12M0 6h18" stroke="#00205b" strokeWidth="2" /></svg>;
  if (code === "DK") return <svg {...common} aria-hidden><rect width="18" height="12" fill="#c8102e" /><path d="M6 0v12M0 6h18" stroke="#fff" strokeWidth="2" /></svg>;
  if (code === "DE") return <svg {...common} aria-hidden><rect width="18" height="4" fill="#000" /><rect y="4" width="18" height="4" fill="#d00" /><rect y="8" width="18" height="4" fill="#ffce00" /></svg>;
  if (code === "NL") return <svg {...common} aria-hidden><rect width="18" height="4" fill="#ae1c28" /><rect y="4" width="18" height="4" fill="#fff" /><rect y="8" width="18" height="4" fill="#21468b" /></svg>;
  if (code === "FR") return <svg {...common} aria-hidden><rect width="6" height="12" fill="#0055a4" /><rect x="6" width="6" height="12" fill="#fff" /><rect x="12" width="6" height="12" fill="#ef4135" /></svg>;
  return <svg {...common} aria-hidden><rect width="18" height="6" fill="#fff" /><rect y="6" width="18" height="6" fill="#dc143c" /></svg>;
}

/**
 * The embedded AutoVere language selector — a permanent, visible part of the UI on every
 * public/account page. Selecting a language navigates to that language's URL root (e.g. NO ->
 * /no), per the AutoVere multilingual routing architecture: the URL is always authoritative.
 */
export function LanguageSwitcher() {
  const t = useT();
  const { locale, setLocale } = useLocale();
  const [open, setOpen] = useState(false);
  const activeLanguage = LANGUAGE_OPTIONS.find((option) => option.locale === locale) ?? LANGUAGE_OPTIONS[0];

  return (
    <div className="relative">
      <span className="sr-only">{t.language}</span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-2.5 py-2 text-xs font-bold text-foreground outline-none transition-colors hover:border-primary/60 focus:border-primary/60"
        aria-label={t.language}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <CountryFlag code={activeLanguage.code} />
        <span>{activeLanguage.code}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" aria-hidden />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-36 rounded-xl border border-border bg-popover p-1 shadow-[var(--shadow-elevated)]" role="listbox" aria-label={t.language}>
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.locale}
              type="button"
              role="option"
              aria-selected={locale === option.locale}
              onClick={() => {
                setLocale(option.locale);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-bold transition-colors ${locale === option.locale ? "bg-primary/12 text-primary" : "text-foreground hover:bg-accent"}`}
            >
              <CountryFlag code={option.code} />
              <span className="flex-1">{option.code}</span>
              {locale === option.locale && <Check className="size-3.5" aria-hidden />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
