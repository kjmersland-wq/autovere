import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";

function LegalPage() {
  const t = useT();

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="panel rounded-[var(--radius-3xl)] border border-border/70 bg-surface/90 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-md sm:p-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" />
            {t.brand}
          </Link>

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t.legalNotice}</h1>

          <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>Utviklet og driftes av: KM TECH LABS</p>
            <p>Sted: Kristiansand, Norge</p>
            <p>Organisasjonsnummer: 934 044 029</p>
            <p>E-post: contact@autovere.com</p>
            <p>Formål: Uavhengig ruteøkonomi, bompenge- og ladekalkulator for europeiske veier.</p>
          </div>

          <div className="mt-8">
            <Link to="/">
              <Button size="lg" className="rounded-xl px-6">
                Tilbake til kalkulatoren
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/legal")({
  component: LegalPage,
});
