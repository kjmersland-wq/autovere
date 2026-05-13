import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Copy, Check, ExternalLink, Car, Navigation } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";

export interface SendToCarProps {
  from: { label: string; lat: number; lon: number };
  to:   { label: string; lat: number; lon: number };
  stops?: { lat: number; lon: number }[];
}

export function SendToCar({ from, to, stops = [] }: SendToCarProps) {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<"links" | "qr">("links");
  const [qrTarget, setQrTarget] = useState<string>("");

  // Universal map URLs — work with CarPlay (Apple Maps), Android Auto (Google Maps), Tesla app share-sheet
  const waypointStr = stops.map((s) => `${s.lat},${s.lon}`).join("/");
  const googleMaps = `https://www.google.com/maps/dir/?api=1&origin=${from.lat},${from.lon}&destination=${to.lat},${to.lon}${
    stops.length ? `&waypoints=${stops.map((s) => `${s.lat},${s.lon}`).join("|")}` : ""
  }&travelmode=driving`;

  const appleMaps = `https://maps.apple.com/?saddr=${from.lat},${from.lon}&daddr=${to.lat},${to.lon}&dirflg=d`;

  const waze = `https://www.waze.com/ul?ll=${to.lat},${to.lon}&navigate=yes&from=${from.lat},${from.lon}`;

  // Tesla: share a Google Maps link to the Tesla app via system share sheet (officially supported flow)
  const teslaShare = googleMaps;

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-foreground text-background font-medium text-sm hover:opacity-90 transition-opacity">
          <Navigation className="w-4 h-4" /> Send rute til bil
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-accent" /> Send til bilens navigasjon
          </DialogTitle>
          <DialogDescription>
            Velg appen bilen din bruker. Skann QR med telefonen for å åpne ruten der — så sendes den videre til bilskjermen via CarPlay, Android Auto eller Tesla-appen.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-1 p-1 bg-card/40 border border-border/30 rounded-xl">
          <button
            onClick={() => setTab("links")}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${tab === "links" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
          >
            Åpne på enheten
          </button>
          <button
            onClick={() => setTab("qr")}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium ${tab === "qr" ? "bg-accent text-accent-foreground" : "text-muted-foreground"}`}
          >
            <Smartphone className="w-3.5 h-3.5 inline mr-1" /> QR til mobil
          </button>
        </div>

        {tab === "links" ? (
          <div className="space-y-2">
            <CarOption
              brand="Tesla"
              hint="Åpner Google Maps. Velg «Del» → Tesla-appen sender turen til bilen."
              color="bg-rose-500/10 border-rose-500/30 text-rose-400"
              url={teslaShare}
              onQr={() => { setQrTarget(teslaShare); setTab("qr"); }}
            />
            <CarOption
              brand="Apple CarPlay"
              hint="iPhone-brukere: åpner Apple Maps og speiler til CarPlay automatisk."
              color="bg-zinc-500/10 border-zinc-400/30 text-zinc-200"
              url={appleMaps}
              onQr={() => { setQrTarget(appleMaps); setTab("qr"); }}
            />
            <CarOption
              brand="Android Auto"
              hint="Google Maps på Android-telefon → bilskjerm via Android Auto."
              color="bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              url={googleMaps}
              onQr={() => { setQrTarget(googleMaps); setTab("qr"); }}
            />
            <CarOption
              brand="Waze"
              hint="Brukes også av flere bilmerker via CarPlay/Android Auto."
              color="bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
              url={waze}
              onQr={() => { setQrTarget(waze); setTab("qr"); }}
            />

            <button
              onClick={() => copy(googleMaps)}
              className="w-full mt-3 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-border/40 bg-card/40 text-xs font-medium hover:bg-card/80 transition-colors"
            >
              {copied ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Lenke kopiert</> : <><Copy className="w-3.5 h-3.5" /> Kopier lenke (lim inn hvor som helst)</>}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="bg-white p-4 rounded-2xl">
              <QRCodeSVG value={qrTarget || googleMaps} size={220} level="M" />
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Skann med telefonkameraet ditt. Lenken åpnes i kart-appen, og du kan derfra sende den til bilen via CarPlay, Android Auto eller Tesla-appen.
            </p>
          </div>
        )}

        <div className="text-[10px] text-muted-foreground border-t border-border/30 pt-3 leading-relaxed">
          <strong className="text-foreground">Merk:</strong> Av bilmerkene i dag har bare Tesla et offentlig API for å sende navigasjon direkte til bilen.
          Andre merker (BMW, Mercedes, VW, Polestar osv.) krever at ruten går via telefon-appen og CarPlay/Android Auto. Denne flyten dekker alle.
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CarOption({
  brand, hint, color, url, onQr,
}: { brand: string; hint: string; color: string; url: string; onQr: () => void }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl border ${color}`}>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-semibold">{brand}</div>
        <div className="text-[10px] opacity-80 leading-snug mt-0.5">{hint}</div>
      </div>
      <button
        onClick={onQr}
        className="p-2 rounded-lg bg-background/40 hover:bg-background/70 transition-colors"
        title="Vis QR"
      >
        <Smartphone className="w-3.5 h-3.5" />
      </button>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-background/40 hover:bg-background/70 text-[11px] font-medium transition-colors"
      >
        Åpne <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}
