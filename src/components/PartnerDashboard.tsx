import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import QRCode from "qrcode";
import { BarChart3, Copy, Download, KeyRound, Loader2, LogOut, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";
import { activatePartnerAccess, getPartnerDashboard, updatePartnerProfile, uploadPartnerLogo } from "@/lib/partner.functions";

type DashboardResult = Awaited<ReturnType<typeof getPartnerDashboard>>;

export function PartnerDashboard() {
  const { user, loading, openAuth, signOut } = useAuth();
  const getDashboard = useServerFn(getPartnerDashboard);
  const activate = useServerFn(activatePartnerAccess);
  const updateProfile = useServerFn(updatePartnerProfile);
  const uploadLogo = useServerFn(uploadPartnerLogo);
  const [result, setResult] = useState<DashboardResult | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = async () => setResult(await getDashboard());
  useEffect(() => { if (user) void refresh(); else setResult(null); }, [user]);

  if (loading) return <main className="min-h-screen"><SiteHeader /><p className="mx-auto max-w-5xl px-6 py-20 text-muted-foreground">Loading partner access…</p></main>;
  if (!user) return <main className="min-h-screen"><SiteHeader /><section className="mx-auto max-w-xl px-6 py-20"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Partner portal</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Sign in to your partner dashboard</h1><p className="mt-4 text-muted-foreground">Use the same email address as your approved partner application.</p><Button className="mt-7" onClick={() => openAuth("signin")}>Sign in</Button></section></main>;
  if (!result) return <main className="min-h-screen"><SiteHeader /><Loader2 className="mx-auto mt-24 size-6 animate-spin text-primary" /></main>;

  if (result.status === "no_access") {
    const submit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault(); setBusy(true);
      const code = String(new FormData(event.currentTarget).get("code") ?? "");
      try { await activate({ data: { code } }); toast.success("Partner access activated."); await refresh(); }
      catch (error) { toast.error(error instanceof Error ? error.message : "Activation failed."); }
      finally { setBusy(false); }
    };
    return <main className="min-h-screen"><SiteHeader /><section className="mx-auto max-w-xl px-6 py-20"><KeyRound className="size-8 text-primary" /><h1 className="mt-5 text-4xl font-semibold tracking-tight">Activate partner access</h1><p className="mt-4 text-muted-foreground">Enter the one-time code from your approval email. It only works with {user.email}.</p><form onSubmit={submit} className="mt-8 flex gap-3"><Input name="code" required placeholder="AVP-…" autoComplete="one-time-code" /><Button disabled={busy}>{busy ? <Loader2 className="size-4 animate-spin" /> : "Activate"}</Button></form></section></main>;
  }

  const { partner, codes, totals, redemptions } = result.data;
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setBusy(true); const data = new FormData(event.currentTarget);
    try { await updateProfile({ data: { organisationName: String(data.get("organisationName")), website: String(data.get("website")), contactName: String(data.get("contactName")) } }); toast.success("Partner profile saved."); await refresh(); }
    catch { toast.error("The profile could not be saved."); } finally { setBusy(false); }
  };
  const downloadQr = async (code: string) => {
    const url = `https://www.autovere.com/pricing?partner=${encodeURIComponent(code)}`;
    const href = await QRCode.toDataURL(url, { width: 900, margin: 3 });
    const a = document.createElement("a"); a.href = href; a.download = `autovere-${code}-qr.png`; a.click();
  };
  const changeLogo = async (file: File | undefined) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 2_000_000) { toast.error("Use a PNG, JPG or WebP logo smaller than 2 MB."); return; }
    setBusy(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(reader.error); reader.readAsDataURL(file); });
      await uploadLogo({ data: { dataUrl, mime: file.type as "image/png" | "image/jpeg" | "image/webp" } });
      toast.success("Partner logo updated."); await refresh();
    } catch { toast.error("The logo could not be uploaded."); } finally { setBusy(false); }
  };
  return <main className="min-h-screen"><SiteHeader /><section className="mx-auto w-full max-w-6xl px-6 py-14">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Official Partner</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">{partner.organisation_name}</h1><p className="mt-2 text-muted-foreground">Codes, profile and aggregated programme results.</p></div><Button variant="outline" onClick={() => void signOut()}><LogOut className="size-4" /> Sign out</Button></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Link clicks", totals.link_click],["Sign-ups", totals.signup],["Conversions", totals.conversion],["Code uses", redemptions]].map(([label,value]) => <div key={label} className="glass-panel rounded-2xl p-5"><BarChart3 className="size-5 text-primary" /><p className="mt-5 text-3xl font-semibold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div>)}</div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="glass-panel rounded-2xl p-6"><h2 className="text-xl font-semibold">Customer benefit codes</h2><p className="mt-2 text-sm text-muted-foreground">Share these codes with customers. Dashboard figures stay aggregated and never expose customer details.</p><div className="mt-5 space-y-3">{codes.map((code) => <div key={code.id} className="rounded-xl border border-border bg-background/40 p-4"><div className="flex flex-wrap items-center gap-2"><code className="text-base font-semibold text-primary">{code.code}</code><span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{code.discount_percent}% benefit</span></div><p className="mt-2 text-xs text-muted-foreground">{code.redemption_count} uses · {code.active ? "Active" : "Paused"}</p><div className="mt-3 flex gap-2"><Button size="sm" variant="outline" onClick={() => void navigator.clipboard.writeText(code.code).then(() => toast.success("Code copied."))}><Copy className="size-4" /> Copy</Button><Button size="sm" variant="outline" onClick={() => void downloadQr(code.code)}><Download className="size-4" /> QR</Button></div></div>)}</div></section>
    <section className="glass-panel rounded-2xl p-6"><h2 className="text-xl font-semibold">Partner profile</h2><form className="mt-5 grid gap-4" onSubmit={save}>{partner.logo_url && <img src={partner.logo_url} alt={`${partner.organisation_name} logo`} className="h-16 w-auto max-w-48 object-contain" />}<div className="grid gap-2"><Label htmlFor="partnerLogo">Logo</Label><Input id="partnerLogo" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={(event) => void changeLogo(event.target.files?.[0])} /></div><div className="grid gap-2"><Label htmlFor="organisationName">Organisation</Label><Input id="organisationName" name="organisationName" defaultValue={partner.organisation_name} required /></div><div className="grid gap-2"><Label htmlFor="contactName">Contact person</Label><Input id="contactName" name="contactName" defaultValue={partner.contact_name} required /></div><div className="grid gap-2"><Label htmlFor="website">Website</Label><Input id="website" name="website" type="url" defaultValue={partner.website ?? ""} placeholder="https://" /></div><p className="flex items-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4 text-primary" /> Account email: {partner.contact_email}</p><Button disabled={busy}><Save className="size-4" /> Save profile</Button></form></section></div>
    <section className="mt-6 glass-panel rounded-2xl p-6"><h2 className="text-xl font-semibold">Partner materials</h2><div className="mt-4 flex flex-wrap gap-3"><Button asChild variant="outline"><a href="/partner-kit/AutoVere-Partner-Programme-en.pdf" target="_blank" rel="noreferrer"><Download className="size-4" /> Programme PDF</a></Button><Button asChild variant="outline"><a href="/partner-kit/autovere-partner-logo-kit.zip"><Download className="size-4" /> Logo kit</a></Button></div></section>
  </section></main>;
}