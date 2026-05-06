import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Sparkles, Shield, CreditCard, Bot, MessageCircle, Lock } from "lucide-react";

const TOPICS = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: "Getting started",
    body: "How to use Lumen, save cars to collections, and discover models that match your taste.",
  },
  {
    icon: <CreditCard className="w-5 h-5" />,
    title: "Billing & subscriptions",
    body: "Plans, renewals, invoices, cancellation and refunds — see Subscription Terms and Refund Policy.",
  },
  {
    icon: <Bot className="w-5 h-5" />,
    title: "AI advisor",
    body: "How recommendations are generated, where the data comes from, and how to verify details.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Privacy & security",
    body: "What we collect, why, and how to exercise your data rights under GDPR.",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "Account",
    body: "Sign-in issues, account deletion, and keeping your account secure.",
  },
  {
    icon: <MessageCircle className="w-5 h-5" />,
    title: "Something else?",
    body: "Send us a message — every contact-form submission is read by a real person on our team.",
  },
];

export default function Help() {
  return (
    <PageShell>
      <SEO
        title="Help Center · AUTOVERE"
        description="Answers, guidance and a calm way to reach the AUTOVERE team."
      />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-gradient-glow blur-3xl opacity-40" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Help Center
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-5">
              How can we help?
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A short index of the most common topics. If you don't see what you need, our team
              is one calm form away.
            </p>
          </div>
        </div>
      </section>

      <section className="container pb-24 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOPICS.map((t) => (
          <Link
            key={t.title}
            to="/contact"
            className="glass rounded-2xl p-7 group hover:border-primary/40 transition-all hover:-translate-y-0.5"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-primary/20 border border-primary/20 flex items-center justify-center mb-5 text-primary">
              {t.icon}
            </div>
            <div className="font-semibold mb-2">{t.title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.body}</p>
          </Link>
        ))}
      </section>

      <section className="container pb-32">
        <div className="glass rounded-3xl p-10 md:p-14 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Still need a human?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Send us a message and we'll get back to you — usually within one business day.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity text-sm font-medium"
          >
            Contact our team <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
