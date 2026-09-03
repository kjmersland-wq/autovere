import { useEffect, useState } from "react";
import { Apple, Car, Map as MapIcon, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTr } from "@/lib/i18n";

function Qr({ url }: { url: string }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let alive = true;
    void import("qrcode").then(async (mod) => {
      const out = await mod.default.toString(url, {
        type: "svg",
        margin: 1,
        width: 192,
        color: { dark: "#0a0f1d", light: "#ffffff" },
      });
      if (alive) setSvg(out);
    });
    return () => {
      alive = false;
    };
  }, [url]);

  if (!svg) return <div className="size-48 animate-pulse rounded-xl bg-background/50" aria-hidden />;
  return (
    <div
      className="size-48 rounded-xl bg-white p-2 [&_svg]:size-full"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

/**
 * Navigation + "Send to car" hub. Sits immediately above the interactive map.
 * Mobile uses the native share sheet (Tesla / Polestar / MyBMW apps pick it up);
 * desktop falls back to a scannable QR popover.
 */
export default function SendToCarHub({
  googleUrl,
  appleUrl,
  shareUrl,
  title,
}: {
  googleUrl: string;
  appleUrl: string;
  shareUrl: string;
  title: string;
}) {
  const tr = useTr();
  const [qrOpen, setQrOpen] = useState(false);

  const sendToCar = () => {
    const nav = typeof navigator === "undefined" ? undefined : navigator;
    if (nav?.share) {
      void nav.share({ title: "AutoVere", text: title, url: shareUrl }).catch(() => setQrOpen(true));
      return;
    }
    setQrOpen(true);
  };

  return (
    <div
      id="send-to-car-hub"
      data-tour="send-to-car"
      className="mt-5 rounded-2xl border border-border bg-background/40 p-3"
    >
      <p className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {tr("Send to car & navigation")}
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={sendToCar}>
          <Car className="mr-1 size-4" /> {tr("Send to car (Tesla / app)")}
        </Button>
        <Button asChild size="sm" variant="secondary">
          <a href={googleUrl} target="_blank" rel="noopener noreferrer">
            <MapIcon className="mr-1 size-4" /> {tr("Open in Google Maps")}
          </a>
        </Button>
        <Button asChild size="sm" variant="outline">
          <a href={appleUrl} target="_blank" rel="noopener noreferrer">
            <Apple className="mr-1 size-4" /> {tr("Open in Apple Maps")}
          </a>
        </Button>
        <Button size="sm" variant="outline" onClick={() => window.print()}>
          <Printer className="mr-1 size-4" /> {tr("Print itinerary (PDF)")}
        </Button>
      </div>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{tr("Scan to send to your car")}</DialogTitle>
            <DialogDescription>
              {tr(
                "Scan the code with your phone camera, then share the route into your car app (Tesla, Polestar, MyBMW, CarPlay or Android Auto).",
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-2">
            <Qr url={shareUrl} />
          </div>
          <p className="text-center text-xs break-all text-muted-foreground">{shareUrl}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
