import { createFileRoute } from "@tanstack/react-router";
import { AppLink as Link } from "@/components/AppLink";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useT } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

function TermsPage() {
  const t = useT();

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

          <h1 className="mt-6 text-3xl font-semibold tracking-tight">{t.termsDisclaimer}</h1>

          <div className="mt-6 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <p>Bompenge-, vignett-, lade- og drivstoffberegninger er veiledende estimater basert på åpne kilder (OpenStreetMap, OSRM, Overpass).</p>
            <p>Sjåføren er selv fullt ansvarlig for å overholde gjeldende skilting, fartsgrenser og offisielle takster.</p>
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

export const Route = createFileRoute("/{-$lang}/terms")({
  component: TermsPage,
});
