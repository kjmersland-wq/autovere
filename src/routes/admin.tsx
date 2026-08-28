import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Power } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "AutoVere Admin" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AdminPage,
});

type AdminPartner = {
  id: string;
  name: string;
  country: string | null;
  logo: string | null;
  website: string;
  discountPercent: number;
  discountCode: string;
  active: boolean;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  referralCount: number;
};

type PartnerForm = {
  partnerId: string;
  name: string;
  country: string;
  logo: string;
  website: string;
  discountPercent: number;
  discountCode: string;
  active: boolean;
  startDate: string;
  endDate: string;
  notes: string;
};

type Metrics = {
  users: { total: number; newLast30Days: number; weeklySignups: { week: string; count: number }[] };
  subscriptions: { free: number; pro: number; business: number; activeTotal: number };
  revenue: { mrrEur: number; recentPaidInvoicesEur: number; recentPaidInvoicesWindowDays: number };
  partners: { id: string; name: string; country: string | null; active: boolean; memberCount: number; referralCount: number }[];
  discountUsage: { totalMembers: number; totalReferrals: number };
};

const emptyForm: PartnerForm = {
  partnerId: "",
  name: "",
  country: "",
  logo: "",
  website: "",
  discountPercent: 25,
  discountCode: "",
  active: true,
  startDate: "",
  endDate: "",
  notes: "",
};

const inputClass = "mt-1 w-full rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60";
const labelClass = "text-xs uppercase tracking-wide text-muted-foreground";

function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [secret, setSecret] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState<"metrics" | "partners">("metrics");
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<PartnerForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadPartners() {
    const response = await fetch("/api/partners?admin=1");
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    if (response.ok) {
      const data = (await response.json()) as { partners?: AdminPartner[] };
      setPartners(data.partners ?? []);
      setAuthed(true);
    }
  }

  async function loadMetrics() {
    const response = await fetch("/api/partners?admin=1&view=metrics");
    if (response.status === 401) {
      setAuthed(false);
      return;
    }
    if (response.ok) {
      setMetrics((await response.json()) as Metrics);
      setAuthed(true);
    }
  }

  useEffect(() => {
    void loadMetrics();
    void loadPartners();
  }, []);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setLoginError("");
    setLoggingIn(true);
    const response = await fetch("/api/partners?action=admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    setLoggingIn(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setLoginError(data.error ?? "Feil admin-nøkkel.");
      return;
    }
    setSecret("");
    void loadMetrics();
    void loadPartners();
  }

  async function handleLogout() {
    await fetch("/api/partners?action=admin-logout", { method: "POST" });
    setAuthed(false);
    setPartners([]);
    setMetrics(null);
  }

  function openNew() {
    setForm(emptyForm);
    setFormError("");
    setEditing("new");
  }

  function openEdit(partner: AdminPartner) {
    setForm({
      partnerId: partner.id,
      name: partner.name,
      country: partner.country ?? "",
      logo: partner.logo ?? "",
      website: partner.website,
      discountPercent: partner.discountPercent,
      discountCode: partner.discountCode,
      active: partner.active,
      startDate: partner.startDate ?? "",
      endDate: partner.endDate ?? "",
      notes: partner.notes ?? "",
    });
    setFormError("");
    setEditing(partner.id);
  }

  function handleLogoFile(file: File) {
    if (file.size > 250_000) {
      setFormError("Logofilen er for stor (maks 250 KB). SVG anbefales.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, logo: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    const isNew = editing === "new";
    const url = isNew ? "/api/partners" : `/api/partners?id=${encodeURIComponent(form.partnerId)}`;
    const response = await fetch(url, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partnerId: form.partnerId,
        name: form.name,
        country: form.country || null,
        logo: form.logo || null,
        website: form.website,
        discountPercent: Number(form.discountPercent),
        discountCode: form.discountCode,
        active: form.active,
        startDate: form.startDate || null,
        endDate: form.endDate || null,
        notes: form.notes || null,
      }),
    });
    setSaving(false);
    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setFormError(data.error ?? "Kunne ikke lagre denne partneren.");
      return;
    }
    setEditing(null);
    void loadPartners();
    void loadMetrics();
  }

  async function toggleActive(partner: AdminPartner) {
    await fetch(`/api/partners?id=${encodeURIComponent(partner.id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: partner.name,
        country: partner.country,
        logo: partner.logo,
        website: partner.website,
        discountPercent: partner.discountPercent,
        discountCode: partner.discountCode,
        active: !partner.active,
        startDate: partner.startDate,
        endDate: partner.endDate,
        notes: partner.notes,
      }),
    });
    void loadPartners();
  }

  if (authed === null) {
    return <main className="flex min-h-screen items-center justify-center bg-background text-foreground" />;
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
        <form onSubmit={handleLogin} className="panel w-full max-w-sm p-6">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE ADMIN</p>
          <h1 className="mt-2 text-xl font-bold">Logg inn</h1>
          <label className="mt-6 block">
            <span className={labelClass}>Admin-nøkkel</span>
            <input type="password" autoFocus value={secret} onChange={(event) => setSecret(event.target.value)} className={inputClass} />
          </label>
          {loginError && <p className="mt-2 text-sm text-destructive">{loginError}</p>}
          <Button type="submit" className="mt-5 w-full" disabled={loggingIn || !secret}>
            {loggingIn ? "Sjekker…" : "Logg inn"}
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">Du kan også logge inn med din vanlige AutoVere-e-post hvis den er registrert som admin-konto.</p>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE ADMIN</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">{tab === "metrics" ? "Nøkkeltall" : "Partnerorganisasjoner"}</h1>
          </div>
          <div className="flex gap-2">
            <div className="flex rounded-lg border border-border bg-surface-raised p-1">
              <button type="button" onClick={() => setTab("metrics")} className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${tab === "metrics" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Nøkkeltall</button>
              <button type="button" onClick={() => setTab("partners")} className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${tab === "partners" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>Partnere</button>
            </div>
            <Button variant="secondary" size="sm" onClick={() => void handleLogout()}>Logg ut</Button>
          </div>
        </div>

        {tab === "metrics" && (
          <div className="mt-8 space-y-6">
            {!metrics ? (
              <p className="text-sm text-muted-foreground">Laster nøkkeltall…</p>
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <KpiCard label="Registrerte brukere" value={metrics.users.total} sub={`+${metrics.users.newLast30Days} siste 30 dager`} />
                  <KpiCard label="Aktive abonnement" value={metrics.subscriptions.activeTotal} sub={`${metrics.subscriptions.pro} Pro · ${metrics.subscriptions.business} Business`} />
                  <KpiCard label="Anslått MRR" value={`€${metrics.revenue.mrrEur.toLocaleString("no-NO")}`} sub="Normalisert til per måned" />
                  <KpiCard label="Betalt siste 30 dager" value={`€${metrics.revenue.recentPaidInvoicesEur.toLocaleString("no-NO")}`} sub="Fra betalte Stripe-fakturaer" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <KpiCard label="Free-brukere" value={metrics.subscriptions.free} sub="Ingen aktivt abonnement" />
                  <KpiCard label="Pro-abonnenter" value={metrics.subscriptions.pro} />
                  <KpiCard label="Business-abonnenter" value={metrics.subscriptions.business} />
                </div>

                <section className="panel p-5 sm:p-7">
                  <h2 className="text-lg font-bold">Nye brukere per uke</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Siste {metrics.users.weeklySignups.length} uker, basert på første innlogging.</p>
                  <div className="mt-5 space-y-2">
                    {metrics.users.weeklySignups.map((week) => {
                      const max = Math.max(...metrics.users.weeklySignups.map((w) => w.count), 1);
                      return (
                        <div key={week.week} className="flex items-center gap-3">
                          <span className="w-24 shrink-0 text-xs text-muted-foreground">{week.week}</span>
                          <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface-raised">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${Math.max((week.count / max) * 100, week.count > 0 ? 4 : 0)}%` }} />
                          </div>
                          <span className="w-8 shrink-0 text-right text-xs font-semibold">{week.count}</span>
                        </div>
                      );
                    })}
                    {metrics.users.weeklySignups.length === 0 && <p className="text-sm text-muted-foreground">Ingen data ennå.</p>}
                  </div>
                </section>

                <section className="panel overflow-x-auto p-5 sm:p-7">
                  <h2 className="text-lg font-bold">Partnere og medlemsfordeler</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Totalt {metrics.discountUsage.totalMembers} medlemmer registrert via partnere · {metrics.discountUsage.totalReferrals} fullførte kjøp med partnerkobling.
                  </p>
                  <table className="mt-5 w-full min-w-[560px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="px-3 py-3 font-semibold">Organisasjon</th>
                        <th className="px-3 py-3 font-semibold">Land</th>
                        <th className="px-3 py-3 font-semibold">Status</th>
                        <th className="px-3 py-3 font-semibold">Medlemmer</th>
                        <th className="px-3 py-3 font-semibold">Henvisninger</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metrics.partners.map((partner) => (
                        <tr key={partner.id} className="border-b border-border/60 last:border-0">
                          <td className="px-3 py-3 font-semibold">{partner.name}</td>
                          <td className="px-3 py-3 text-muted-foreground">{partner.country ?? "—"}</td>
                          <td className="px-3 py-3">
                            <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${partner.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>{partner.active ? "Aktiv" : "Inaktiv"}</span>
                          </td>
                          <td className="px-3 py-3">{partner.memberCount}</td>
                          <td className="px-3 py-3">{partner.referralCount}</td>
                        </tr>
                      ))}
                      {metrics.partners.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-3 py-8 text-center text-sm text-muted-foreground">Ingen partnere registrert ennå.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </>
            )}
          </div>
        )}

        {tab === "partners" && (
          <>
            <div className="mt-8 flex justify-end">
              <Button size="sm" onClick={openNew}><Plus className="mr-1.5 size-4" /> Legg til organisasjon</Button>
            </div>

            <section className="panel mt-4 overflow-x-auto p-5 sm:p-7">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-3 py-3 font-semibold">Organisasjon</th>
                    <th className="px-3 py-3 font-semibold">Land</th>
                    <th className="px-3 py-3 font-semibold">Rabatt</th>
                    <th className="px-3 py-3 font-semibold">Kode</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-3 py-3 font-semibold">Henvisninger</th>
                    <th className="px-3 py-3 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id} className="border-b border-border/60 last:border-0">
                      <td className="px-3 py-4">
                        <p className="font-semibold">{partner.name}</p>
                        <p className="text-xs text-muted-foreground">{partner.id}</p>
                      </td>
                      <td className="px-3 py-4 text-muted-foreground">{partner.country ?? "—"}</td>
                      <td className="px-3 py-4">{partner.discountPercent}%</td>
                      <td className="px-3 py-4 font-mono text-xs">{partner.discountCode}</td>
                      <td className="px-3 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${partner.active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                          {partner.active ? "Aktiv" : "Inaktiv"}
                        </span>
                      </td>
                      <td className="px-3 py-4">{partner.referralCount}</td>
                      <td className="px-3 py-4">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="ghost" onClick={() => openEdit(partner)}><Pencil className="size-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => void toggleActive(partner)} title={partner.active ? "Deaktiver" : "Aktiver"}>
                            <Power className={`size-4 ${partner.active ? "text-primary" : "text-muted-foreground"}`} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {partners.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-10 text-center text-sm text-muted-foreground">Ingen partnere ennå. Legg til den første organisasjonen over.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            {editing && (
              <section className="panel mt-8 p-5 sm:p-7">
                <h2 className="text-lg font-bold">{editing === "new" ? "Legg til organisasjon" : `Rediger ${form.name}`}</h2>
                <form onSubmit={handleSave} className="mt-5 grid gap-5 sm:grid-cols-2">
                  <label>
                    <span className={labelClass}>Organisasjonsnavn</span>
                    <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Land</span>
                    <input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Partner-ID (f.eks. ETA)</span>
                    <input
                      required
                      disabled={editing !== "new"}
                      value={form.partnerId}
                      onChange={(event) => setForm({ ...form, partnerId: event.target.value.toUpperCase() })}
                      className={`${inputClass} ${editing !== "new" ? "opacity-60" : ""}`}
                    />
                  </label>
                  <label>
                    <span className={labelClass}>Offisiell nettside</span>
                    <input required type="url" placeholder="https://" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Medlemsrabatt %</span>
                    <input required type="number" min={1} max={100} value={form.discountPercent} onChange={(event) => setForm({ ...form, discountPercent: Number(event.target.value) })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Medlemskode</span>
                    <input required value={form.discountCode} onChange={(event) => setForm({ ...form, discountCode: event.target.value.toUpperCase() })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Startdato (valgfritt)</span>
                    <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className={inputClass} />
                  </label>
                  <label>
                    <span className={labelClass}>Sluttdato (valgfritt)</span>
                    <input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} className={inputClass} />
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelClass}>Logo (SVG eller lite bilde, maks 250 KB)</span>
                    <input type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) handleLogoFile(file); }} className="mt-1 w-full text-sm" />
                    {form.logo && <img src={form.logo} alt="Forhåndsvisning av logo" className="mt-3 h-10 w-auto max-w-[160px] object-contain" />}
                  </label>
                  <label className="sm:col-span-2">
                    <span className={labelClass}>Interne notater (valgfritt)</span>
                    <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className={`${inputClass} min-h-20`} />
                  </label>
                  <label className="flex items-center gap-2 text-sm sm:col-span-2">
                    <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Aktiv — synlig på partnersiden og gir rett på rabatt
                  </label>

                  {formError && <p className="text-sm text-destructive sm:col-span-2">{formError}</p>}

                  <div className="flex gap-3 sm:col-span-2">
                    <Button type="submit" disabled={saving}>{saving ? "Lagrer…" : "Lagre"}</Button>
                    <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Avbryt</Button>
                  </div>
                </form>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="panel p-4 sm:p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="numeric mt-2 text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
