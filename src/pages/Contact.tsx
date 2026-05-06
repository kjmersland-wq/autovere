import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Shield, Lock, MessageCircle, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

const initial = {
  name: "",
  email: "",
  subject: "",
  message: "",
  country: "",
  vehicle_of_interest: "",
};

export default function Contact() {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof initial) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      toast.error("Please fill in name, email, subject and message.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("contact-submit", { body: form });
    setLoading(false);
    if (error || !data?.ok) {
      toast.error(data?.error || "Could not send your message. Please try again.");
      return;
    }
    setDone(true);
    setForm(initial);
  };

  return (
    <PageShell>
      <SEO
        title="Contact AUTOVERE — Talk to our team"
        description="Reach the AUTOVERE team. A calm, secure way to ask questions, share feedback, or start a conversation about your next car."
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[680px] h-[680px] rounded-full bg-gradient-glow blur-3xl opacity-60 animate-glow-pulse" />
        <div className="container relative py-24 md:py-32">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
              <MessageCircle className="w-3.5 h-3.5" /> Contact AUTOVERE
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-5">
              A calmer way to <span className="text-gradient">talk to us.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Questions, ideas, or something you want us to build next — share it here.
              Every message is read by a real person on our team.
            </p>
          </div>
        </div>
      </section>

      {/* Form + Trust */}
      <section className="container pb-24 grid lg:grid-cols-[1.4fr_1fr] gap-10">
        <div className="glass rounded-3xl p-8 md:p-10 shadow-elegant">
          {done ? (
            <div className="py-16 text-center animate-fade-up">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
                <Check className="w-7 h-7 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Message received</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you. Our team will get back to you shortly — usually within one business day.
              </p>
              <Button
                variant="outline"
                className="mt-8 rounded-xl"
                onClick={() => setDone(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Your name">
                  <Input value={form.name} onChange={set("name")} placeholder="Alex Morgan" required maxLength={120} />
                </Field>
                <Field label="Email">
                  <Input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required maxLength={254} />
                </Field>
              </div>
              <Field label="Subject">
                <Input value={form.subject} onChange={set("subject")} placeholder="How can we help?" required maxLength={200} />
              </Field>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Country" optional>
                  <Input value={form.country} onChange={set("country")} placeholder="Norway" maxLength={80} />
                </Field>
                <Field label="Vehicle of interest" optional>
                  <Input value={form.vehicle_of_interest} onChange={set("vehicle_of_interest")} placeholder="e.g. Lucid Air, Polestar 4" maxLength={120} />
                </Field>
              </div>
              <Field label="Message">
                <Textarea
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell us a little about what you're looking for…"
                  required
                  maxLength={5000}
                  className="min-h-[160px] resize-none"
                />
              </Field>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
                <p className="text-xs text-muted-foreground flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5" />
                  Your details are encrypted in transit and never shared.
                </p>
                <Button
                  type="submit"
                  disabled={loading}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 rounded-xl shadow-glow min-w-[180px]"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  ) : (
                    <>Send message <Sparkles className="w-4 h-4" /></>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>

        <aside className="space-y-5">
          <TrustCard
            icon={<Shield className="w-5 h-5" />}
            title="Privacy by design"
            body="We collect only what's needed to reply to you. No tracking pixels in messages, no third-party resale, ever."
          />
          <TrustCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Responsible AI"
            body="AutoVere, our advisor, is built to inform — not to manipulate. We don't use your conversations to train external models."
          />
          <TrustCard
            icon={<MessageCircle className="w-5 h-5" />}
            title="A real human reply"
            body="Every message is reviewed by our team in Kristiansand. Most replies arrive within one business day."
          />
          <div className="glass rounded-2xl p-6 text-xs text-muted-foreground leading-relaxed">
            Developed and operated by <span className="text-foreground/90 font-medium">KM TECH LABS</span>, Kristiansand, Norway.
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

const Field = ({ label, optional, children }: { label: string; optional?: boolean; children: React.ReactNode }) => (
  <div className="space-y-2">
    <Label className="text-xs uppercase tracking-wider text-muted-foreground">
      {label} {optional && <span className="normal-case tracking-normal text-muted-foreground/60">· optional</span>}
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
