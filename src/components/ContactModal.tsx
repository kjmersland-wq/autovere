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
import { useT } from "@/lib/i18n";

const initialForm = { name: "", email: "", subject: "", message: "" };

type ContactModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ContactModal({ open, onOpenChange }: ContactModalProps) {
  const t = useT();
  const [form, setForm] = useState(initialForm);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  function updateField(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
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
      const result = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const payload = (await result.json()) as { error?: string };
      if (!result.ok) throw new Error(payload.error || t.contactError);
      setSent(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : t.contactError);
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
              <DialogTitle className="text-xl">{t.contactSuccess}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {t.contactSuccessText}
              </DialogDescription>
            </DialogHeader>
            <Button type="button" className="mt-6" onClick={() => handleOpenChange(false)}>
              {t.contactClose}
            </Button>
          </div>
        ) : (
          <form onSubmit={submit}>
            <DialogHeader className="space-y-2">
              <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE</p>
              <DialogTitle className="text-xl">{t.contactTitle}</DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {t.contactDescription}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-semibold">
                {t.contactName}
                <input
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  className="rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                  placeholder={t.contactNamePlaceholder}
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold">
                {t.contactEmail}
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  className="rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                  placeholder={t.contactEmailPlaceholder}
                />
              </label>
            </div>
            <label className="mt-4 grid gap-2 text-sm font-semibold">
              {t.contactSubject}
              <input
                value={form.subject}
                onChange={(event) => updateField("subject", event.target.value)}
                className="rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                placeholder={t.contactSubjectPlaceholder}
              />
            </label>
            <label className="mt-4 grid gap-2 text-sm font-semibold">
              {t.contactMessage}
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(event) => updateField("message", event.target.value)}
                className="resize-y rounded-xl border border-border bg-surface-raised px-3 py-2.5 font-normal outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary/60"
                placeholder={t.contactMessagePlaceholder}
              />
            </label>
            {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
            <DialogFooter className="mt-5">
              <Button type="submit" disabled={sending} className="w-full sm:w-auto">
                {sending ? <><Loader2 className="size-4 animate-spin" /> {t.contactSending}</> : <><Send className="size-4" /> {t.contactSend}</>}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
