import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Shield, Lock, MessageCircle, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { SmartEmailField } from "@/components/SmartEmailField";
import { rememberEmail, checkEmail } from "@/lib/email-suggest";

const initial = {
  name: "",
  email: "",
  subject: "",
  message: "",
  country: "",
  vehicle_of_interest: "",
};

export default function Contact() {
  const { t } = useTranslation();
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error(t("pages.contact.validation_required"));
      return;
    }
    const emailCheck = checkEmail(form.email);
    if (!emailCheck.valid) {
      toast.error(emailCheck.error || t("pages.contact.validation_email"));
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("contact-submit", { body: form });
    setLoading(false);
    if (error || !data?.ok) {
      toast.error(data?.error || t("pages.contact.send_error"));
      return;
    }
    rememberEmail(form.email);
    setDone(true);
    setForm(initial);
  };

  return (
    <PageShell>
      <SEO title={t("pages.contact.seo_title")} description={t("pages.contact.seo_desc")} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-gradient-glow blur-3xl opacity-60 animate-glow-pulse" />
        <div className="container relative py-24 md:py-32">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
              <MessageCircle className="w-3.5 h-3.5" /> {t("pages.contact.eyebrow")}
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-5">
              {t("pages.contact.h1_a")} <span className="text-gradient">{t("pages.contact.h1_b")}</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.contact.lead")}</p>
          </div>
        </div>
      </section>

      <section className="container pb-24 grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <div className="glass rounded-3xl p-8 md:p-10 shadow-elegant">
          {done ? (
            <div className="py-16 text-center animate-fade-up">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Check className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">{t("pages.contact.received_h")}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">{t("pages.contact.received_b")}</p>
              <Button variant="outline" className="mt-8 rounded-xl" onClick={() => setDone(false)}>
                {t("pages.contact.send_another")}
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label={t("pages.contact.name")}>
                  <Input value={form.name} onChange={set("name")} placeholder={t("pages.contact.name_ph") as string} required maxLength={120} />
                </Field>
                <SmartEmailField
                  label={t("pages.contact.email")}
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  required
                />
              </div>
              <Field label={t("pages.contact.subject")}>
                <Input value={form.subject} onChange={set("subject")} placeholder={t("pages.contact.subject_ph") as string} required maxLength={200} />
              </Field>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label={t("pages.contact.country")} optional optionalLabel={t("common.optional") as string}>
                  <Input value={form.country} onChange={set("country")} placeholder={t("pages.contact.country_ph") as string} maxLength={80} />
                </Field>
                <Field label={t("pages.contact.vehicle")} optional optionalLabel={t("common.optional") as string}>
                  <Input value={form.vehicle_of_interest} onChange={set("vehicle_of_interest")} placeholder={t("pages.contact.vehicle_ph") as string} maxLength={120} />
                </Field>
              </div>
              <Field label={t("pages.contact.message")}>
                <Textarea
                  value={form.message}
                  onChange={set("message")}
                  placeholder={t("pages.contact.message_ph") as string}
                  required
                  maxLength={5000}
                  className="min-h-[160px] resize-none"
                />
              </Field>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  {t("pages.contact.encrypted")}
                </p>
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 rounded-xl shadow-glow min-w-[180px]"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {t("common.sending")}</>
                  ) : (
                    <>{t("pages.contact.send")} <Sparkles className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <TrustCard icon={<Shield className="w-5 h-5" />} title={t("pages.contact.trust_t1")} body={t("pages.contact.trust_b1")} />
          <TrustCard icon={<Sparkles className="w-5 h-5" />} title={t("pages.contact.trust_t2")} body={t("pages.contact.trust_b2")} />
          <TrustCard icon={<MessageCircle className="w-5 h-5" />} title={t("pages.contact.trust_t3")} body={t("pages.contact.trust_b3")} />
          <div className="glass rounded-2xl p-6 text-xs text-muted-foreground leading-relaxed">
            {t("pages.contact.developed_by")} <span className="text-foreground/90 font-medium">KM TECH LABS</span>, Kristiansand, Norway.
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

const Field = ({ label, optional, optionalLabel, children }: { label: string; optional?: boolean; optionalLabel?: string; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
      {label} {optional && <span className="normal-case tracking-normal text-muted-foreground/60">· {optionalLabel ?? "optional"}</span>}
    </Label>
    {children}
  </div>
);

const TrustCard = ({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) => (
  <div className="glass rounded-2xl p-6">
    <div className="w-10 h-10 rounded-xl bg-gradient-primary/20 border border-primary/20 flex items-center justify-center mb-4 text-primary">
      {icon}
    </div>
    <div className="font-semibold mb-1.5">{title}</div>
    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
  </div>
);
