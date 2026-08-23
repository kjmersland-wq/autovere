import { useState } from "react";
import { Car, Check, Download, ExternalLink, Map, Share2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { CurrencyCode } from "@/lib/currency";
import { formatCurrency } from "@/lib/currency";
import { useT } from "@/lib/i18n";

export type NavigationSheetProps = {
  totalEur: number;
  currency: CurrencyCode;
  googleUrl: string;
  appleUrl: string;
  wazeUrl: string;
  teslaUrl: string;
  gpx: string;
  kml: string;
  onShare: () => Promise<void>;
};

function downloadFile(filename: string, contents: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function NavigationSheet({
  totalEur,
  currency,
  googleUrl,
  appleUrl,
  wazeUrl,
  teslaUrl,
  gpx,
  kml,
  onShare,
}: NavigationSheetProps) {
  const t = useT();
  const [shared, setShared] = useState(false);

  async function share() {
    await onShare();
    setShared(true);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="lg" className="h-13 rounded-xl font-bold">
          <Car className="size-5" /> {t.sendToCar}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto sm:rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>{t.sendToCar}</SheetTitle>
          <SheetDescription>{t.sendDescription}</SheetDescription>
        </SheetHeader>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" className="min-h-11 justify-start" onClick={share}>
            {shared ? <Check className="size-4" /> : <Share2 className="size-4" />}
            {shared ? t.shared : t.sendMobile}
          </Button>
          <Button variant="outline" className="min-h-11 justify-start" asChild>
            <a href={teslaUrl} target="_blank" rel="noopener noreferrer">
              <Smartphone className="size-4" /> {t.tesla} <ExternalLink className="ml-auto size-3.5" />
            </a>
          </Button>
          <Button variant="outline" className="min-h-11 justify-start" asChild>
            <a href={googleUrl} target="_blank" rel="noopener noreferrer">
              <Map className="size-4" /> {t.googleMultiStop} <ExternalLink className="ml-auto size-3.5" />
            </a>
          </Button>
          <Button variant="outline" className="min-h-11 justify-start" asChild>
            <a href={appleUrl} target="_blank" rel="noopener noreferrer">
              <Map className="size-4" /> {t.appleWaypoints} <ExternalLink className="ml-auto size-3.5" />
            </a>
          </Button>
          <Button variant="outline" className="min-h-11 justify-start" asChild>
            <a href={wazeUrl} target="_blank" rel="noopener noreferrer">
              <Map className="size-4" /> {t.waze} <ExternalLink className="ml-auto size-3.5" />
            </a>
          </Button>
          <Button
            variant="outline"
            className="min-h-11 justify-start"
            onClick={() => downloadFile("autovere-route.gpx", gpx, "application/gpx+xml")}
          >
            <Download className="size-4" /> {t.downloadGpx}
          </Button>
          <Button
            variant="outline"
            className="min-h-11 justify-start"
            onClick={() => downloadFile("autovere-route.kml", kml, "application/vnd.google-earth.kml+xml")}
          >
            <Download className="size-4" /> {t.downloadKml}
          </Button>
        </div>

        <p className="mt-5 text-xs text-muted-foreground">
          {t.plannedTotal}: <span className="numeric font-bold text-foreground">{formatCurrency(totalEur, currency)}</span>
        </p>
      </SheetContent>
    </Sheet>
  );
}
