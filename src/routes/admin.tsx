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
  const [partners, setPartners] = useState<AdminPartner[]>([]);
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

  useEffect(() => {
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
      setLoginError(data.error ?? "Incorrect admin key.");
      return;
    }
    setSecret("");
    void loadPartners();
  }

  async function handleLogout() {
    await fetch("/api/partners?action=admin-logout", { method: "POST" });
    setAuthed(false);
    setPartners([]);
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
      setFormError("Logo file is too large (max 250 KB). SVG is recommended.");
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
      setFormError(data.error ?? "Could not save this partner.");
      return;
    }
    setEditing(null);
    void loadPartners();
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
          <h1 className="mt-2 text-xl font-bold">Organisation Partners</h1>
          <label className="mt-6 block">
            <span className={labelClass}>Admin key</span>
            <input type="password" autoFocus value={secret} onChange={(event) => setSecret(event.target.value)} className={inputClass} />
          </label>
          {loginError && <p className="mt-2 text-sm text-destructive">{loginError}</p>}
          <Button type="submit" className="mt-5 w-full" disabled={loggingIn || !secret}>
            {loggingIn ? "Checking…" : "Sign in"}
          </Button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE ADMIN</p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Organisation Partners</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => void handleLogout()}>Sign out</Button>
            <Button size="sm" onClick={openNew}><Plus className="mr-1.5 size-4" /> Add organisation</Button>
          </div>
        </div>

        <section className="panel mt-8 overflow-x-auto p-5 sm:p-7">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-3 font-semibold">Organisation</th>
                <th className="px-3 py-3 font-semibold">Country</th>
                <th className="px-3 py-3 font-semibold">Discount</th>
                <th className="px-3 py-3 font-semibold">Code</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Members</th>
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
                      {partner.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-4">{partner.referralCount}</td>
                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => openEdit(partner)}><Pencil className="size-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => void toggleActive(partner)} title={partner.active ? "Deactivate" : "Activate"}>
                        <Power className={`size-4 ${partner.active ? "text-primary" : "text-muted-foreground"}`} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-sm text-muted-foreground">No partners yet. Add your first organisation above.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {editing && (
          <section className="panel mt-8 p-5 sm:p-7">
            <h2 className="text-lg font-bold">{editing === "new" ? "Add organisation" : `Edit ${form.name}`}</h2>
            <form onSubmit={handleSave} className="mt-5 grid gap-5 sm:grid-cols-2">
              <label>
                <span className={labelClass}>Organisation name</span>
                <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className={inputClass} />
              </label>
              <label>
                <span className={labelClass}>Country</span>
                <input value={form.country} onChange={(event) => setForm({ ...form, country: event.target.value })} className={inputClass} />
              </label>
              <label>
                <span className={labelClass}>Partner ID (e.g. ETA)</span>
                <input
                  required
                  disabled={editing !== "new"}
                  value={form.partnerId}
                  onChange={(event) => setForm({ ...form, partnerId: event.target.value.toUpperCase() })}
                  className={`${inputClass} ${editing !== "new" ? "opacity-60" : ""}`}
                />
              </label>
              <label>
                <span className={labelClass}>Official website</span>
                <input required type="url" placeholder="https://" value={form.website} onChange={(event) => setForm({ ...form, website: event.target.value })} className={inputClass} />
              </label>
              <label>
                <span className={labelClass}>Member discount %</span>
                <input required type="number" min={1} max={100} value={form.discountPercent} onChange={(event) => setForm({ ...form, discountPercent: Number(event.target.value) })} className={inputClass} />
              </label>
              <label>
                <span className={labelClass}>Member discount code</span>
                <input required value={form.discountCode} onChange={(event) => setForm({ ...form, discountCode: event.target.value.toUpperCase() })} className={inputClass} />
              </label>
              <label>
                <span className={labelClass}>Start date (optional)</span>
                <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className={inputClass} />
              </label>
              <label>
                <span className={labelClass}>End date (optional)</span>
                <input type="date" value={form.endDate} onChange={(event) => setForm({ ...form, endDate: event.target.value })} className={inputClass} />
              </label>
              <label className="sm:col-span-2">
                <span className={labelClass}>Logo (SVG or small image, max 250 KB)</span>
                <input type="file" accept="image/svg+xml,image/png,image/jpeg,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) handleLogoFile(file); }} className="mt-1 w-full text-sm" />
                {form.logo && <img src={form.logo} alt="Logo preview" className="mt-3 h-10 w-auto max-w-[160px] object-contain" />}
              </label>
              <label className="sm:col-span-2">
                <span className={labelClass}>Notes (internal, optional)</span>
                <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} className={`${inputClass} min-h-20`} />
              </label>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} /> Active — visible on the partner page and eligible for the discount
              </label>

              {formError && <p className="text-sm text-destructive sm:col-span-2">{formError}</p>}

              <div className="flex gap-3 sm:col-span-2">
                <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
                <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
              </div>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
