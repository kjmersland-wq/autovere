import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, Copy, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/admin/AdminUi";
import { listPartnerApplications, reviewPartnerApplication } from "@/lib/partner.functions";

export function PartnersPanel() {
  const list = useServerFn(listPartnerApplications); const review = useServerFn(reviewPartnerApplication);
  const [result, setResult] = useState<Awaited<ReturnType<typeof listPartnerApplications>> | null>(null); const [busy, setBusy] = useState<string | null>(null);
  const refresh = async () => setResult(await list()); useEffect(() => { void refresh(); }, []);
  const decide = async (id: string, decision: "approved" | "rejected") => { setBusy(id); try { const r = await review({ data: { id, decision } }); if (r.status !== "ok") throw new Error("message" in r ? r.message : "Feil"); if (decision === "approved" && "accessCode" in r) { await navigator.clipboard.writeText(`Tilgangskode: ${r.accessCode}\nKundekode: ${r.referralCode}`); toast.success(r.emailSent ? "Godkjent og sendt. Kodene er kopiert." : "Godkjent. E-post feilet; kodene er kopiert."); } else toast.success("Søknaden er avslått."); await refresh(); } catch { toast.error("Kunne ikke behandle søknaden."); } finally { setBusy(null); } };
  if (!result) return <p className="text-sm text-muted-foreground">Henter partnersøknader …</p>;
  if (result.status !== "ok") return <p className="text-sm text-destructive">{"message" in result ? result.message : "Ingen tilgang."}</p>;
  return <div className="space-y-6"><Panel title="Partnersøknader"><div className="space-y-3">{result.data.length === 0 ? <p className="text-sm text-muted-foreground">Ingen søknader ennå.</p> : result.data.map((app) => <article key={app.id} className="rounded-xl border border-border bg-background/35 p-4"><div className="flex flex-wrap justify-between gap-3"><div><h3 className="font-semibold">{app.organisation_name}</h3><p className="text-sm text-muted-foreground">{app.contact_name} · {app.contact_email} · {app.country}</p>{app.website && <a href={app.website} target="_blank" rel="noreferrer" className="text-xs text-primary">{app.website}</a>}</div><span className="h-fit rounded-full border border-border px-3 py-1 text-xs capitalize">{app.status}</span></div>{app.description && <p className="mt-3 text-sm text-foreground/75">{app.description}</p>}{app.status === "pending" && <div className="mt-4 flex gap-2"><Button size="sm" onClick={() => void decide(app.id, "approved")} disabled={busy === app.id}>{busy === app.id ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />} Godkjenn</Button><Button size="sm" variant="outline" onClick={() => void decide(app.id, "rejected")} disabled={busy === app.id}><X className="size-4" /> Avslå</Button></div>}{app.status === "approved" && <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Copy className="size-3.5" /> Koder ble opprettet ved godkjenning.</p>}</article>)}</div></Panel></div>;
}