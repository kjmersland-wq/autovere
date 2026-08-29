import { createFileRoute } from "@tanstack/react-router";
import { AppLink as Link } from "@/components/AppLink";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { URL_LANG_TO_LOCALE, useT, useLocale } from "@/lib/i18n";
import { getAccountCopy } from "@/lib/account-i18n";
import { legalCopy } from "@/lib/legal-i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function PrivacyPage() {
  const t = useT();
  const { locale } = useLocale();
  const copy = legalCopy[locale] ?? legalCopy.en;
  const backLabel = getAccountCopy(locale).backToPlanner;

  return (
    <main className="bg-scenic min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="panel rounded-[var(--radius-3xl)] border border-border/70 bg-surface/90 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-md sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="size-4" />
              {t.brand}
            </Link>
            <LanguageSwitcher />
          </div>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t.privacyPolicy}</h1>

          <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {copy.privacy.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>

          <div className="mt-8">
            <Link to="/">
              <Button size="lg" className="rounded-xl px-6">
                {backLabel}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/{-$lang}/privacy")({
  head: (ctx) => {
    const lang = (ctx.params as { lang?: string }).lang;
    const locale = lang ? (URL_LANG_TO_LOCALE[lang] ?? "en") : "en";
    const copy = legalCopy[locale] ?? legalCopy.en;
    return {
      meta: [
        { title: `${copy.privacyTitle} — AutoVere` },
        { name: "description", content: copy.privacy.join(" ") },
      ],
    };
  },
  component: PrivacyPage,
});
