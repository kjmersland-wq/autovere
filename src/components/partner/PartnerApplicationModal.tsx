import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale } from "@/lib/i18n";
import { partnerCopy } from "@/lib/partner-i18n";

const initialForm = { organisationName: "", country: "", website: "", contactName: "", contactEmail: "", logo: "", message: "" };

type PartnerApplicationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function PartnerApplicationModal({ open, onOpenChange }: PartnerApplicationModalProps) {
  const { locale } = useLocale();
  const copy = (partnerCopy[locale] ?? partnerCopy.en).application;
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  }

  function handleLogoFile(file: File) {
    if (file.size > 250_000) {
      setError(copy.logoTooLarge);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, logo: String(reader.result) }));
    reader.readAsDataURL(file);
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setForm(initialForm);
      setSent(false);
      setError("");
    }
    onOpenChange(nextOpen);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    setError("");
    try {
      const result = await fetch("/api/partners?action=apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type: "member_organisation", locale }),
      });
      const payload = (await result.json()) as { error?: string };
      if (!result.ok) throw new Error(payload.error || copy.error);
      setSent(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : copy.error);
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg border border-white/10 bg-surface/95 text-foreground shadow-[var(--shadow-elevated)] backdrop-blur-2xl sm:rounded-2xl">
        {sent ? (
          <div className="py-5 text-center">
            <CheckCircle2 className="mx-auto size-12 text-success" aria-hidden />
            <DialogHeader className="mt-4 space-y-2">
              <DialogTitle className="text-xl">{copy.success}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {copy.successBody}
              </DialogDescription>
            </DialogHeader>
            <Button type="button" className="mt-6" onClick={() => handleOpenChange(false)}>
              {copy.close}
            </Button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <DialogHeader className="space-y-2">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE</p>
              <DialogTitle className="text-xl">{copy.title}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {copy.intro}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                {copy.orgName}
                <input
                  required
                  value={form.organisationName}
                  onChange={(event) => updateField("organisationName", event.target.value)}
                  className="rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                  placeholder={copy.orgNamePlaceholder}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                {copy.country}
                <input
                  value={form.country}
                  onChange={(event) => updateField("country", event.target.value)}
                  className="rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                  placeholder={copy.countryPlaceholder}
                />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold">
              {copy.website}
              <input
                required
                type="url"
                value={form.website}
                onChange={(event) => updateField("website", event.target.value)}
                className="rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                placeholder={copy.websitePlaceholder}
              />
            </label>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                {copy.contactName}
                <input
                  required
                  value={form.contactName}
                  onChange={(event) => updateField("contactName", event.target.value)}
                  className="rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                  placeholder={copy.contactNamePlaceholder}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                {copy.contactEmail}
                <input
                  required
                  type="email"
                  value={form.contactEmail}
                  onChange={(event) => updateField("contactEmail", event.target.value)}
                  className="rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                  placeholder={copy.contactEmailPlaceholder}
                />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold">
              {copy.logo}
              <input
                type="file"
                accept="image/svg+xml,image/png,image/jpeg,image/webp"
                onChange={(event) => { const file = event.target.files?.[0]; if (file) handleLogoFile(file); }}
                className="text-sm font-normal file:mr-3 file:rounded-lg file:border-0 file:bg-surface-raised file:px-3 file:py-2 file:text-xs file:font-semibold file:text-foreground"
              />
              <span className="text-xs font-normal text-muted-foreground">{copy.logoHint}</span>
              {form.logo && <img src={form.logo} alt="" className="mt-1 h-10 w-auto max-w-[160px] object-contain" />}
            </label>
            <label className="mt-4 grid gap-2 text-sm font-semibold">
              {copy.message}
              <textarea
                rows={3}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="resize-y rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                placeholder={copy.messagePlaceholder}
              />
            </label>
            {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
            <DialogFooter className="mt-5">
              <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                {sending ? <><Loader2 className="size-4 animate-spin" /> {copy.submitting}</> : <><Send className="size-4" /> {copy.submit}</>}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
