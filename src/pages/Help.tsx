import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";
import { Sparkles, Shield, CreditCard, Bot, MessageCircle, Lock, ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "What is AUTOVERE and who is it for?",
    a: "AUTOVERE is a premium European automotive intelligence platform. It's built for thoughtful buyers who want real data — range, charging, ownership costs, depreciation — before committing to a decision. It's not a listings site. It's a decision tool.",
  },
  {
    q: "How are recommendations generated?",
    a: "Recommendations combine real-world range data, verified pricing by country, reviewer consensus from trusted YouTube channels, and structured ownership analysis. No affiliate commissions influence the results.",
  },
  {
    q: "Is AUTOVERE free to use?",
    a: "Core browsing — car guides, EV tools, articles — is free. Premium features like AI safety intelligence, vehicle comparison intelligence, and video insights require a subscription. Pricing is transparent on the Pricing page.",
  },
  {
    q: "How do I cancel my subscription?",
    a: "Subscriptions can be cancelled any time from the Customer Portal — accessible from your account settings. Cancellation takes effect at the end of the current billing period. See the Subscription Terms and Refund Policy for details.",
  },
  {
    q: "Where does the EV range data come from?",
    a: "WLTP figures come from official manufacturer publications. Real-world and winter range figures are drawn from independent testing by Bjørn Nyland, Out of Spec Reviews, and ADAC — sourced and attributed transparently.",
  },
  {
    q: "Can I save cars and build a garage?",
    a: "Yes. Use the Garage feature to save vehicles you're considering. Your garage is stored in your browser (no account required for basic saving), or synced across devices when you're signed in.",
  },
  {
    q: "How does the EV Advisor work?",
    a: "The EV Advisor asks 7 structured questions about your budget, typical drive distance, climate, and charging access. It then matches those answers against the EV database to surface the most relevant 2–4 models — with a plain-language explanation for each match.",
  },
  {
    q: "Is my data private and GDPR-compliant?",
    a: "Yes. AUTOVERE processes minimal personal data, uses Supabase for authentication (EU data residency), and does not sell user data. Full details are in the Privacy Policy. You can request data deletion at any time via the contact form.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = `faq-${q.slice(0, 20).replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div className="border-b border-border/30 last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        aria-expanded={open}
        aria-controls={id}
      >
        <span className="font-medium leading-snug group-hover:text-accent transition-colors">{q}</span>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <p id={id} className="pb-5 text-sm text-muted-foreground leading-relaxed">{a}</p>
      )}
    </div>
  );
}

export default function Help() {
  const { t } = useTranslation();
  const TOPICS = [
    { icon: <Sparkles className="w-5 h-5" />, title: t("pages.help.topics.t1_t"), body: t("pages.help.topics.t1_b") },
    { icon: <CreditCard className="w-5 h-5" />, title: t("pages.help.topics.t2_t"), body: t("pages.help.topics.t2_b") },
    { icon: <Bot className="w-5 h-5" />, title: t("pages.help.topics.t3_t"), body: t("pages.help.topics.t3_b") },
    { icon: <Shield className="w-5 h-5" />, title: t("pages.help.topics.t4_t"), body: t("pages.help.topics.t4_b") },
    { icon: <Lock className="w-5 h-5" />, title: t("pages.help.topics.t5_t"), body: t("pages.help.topics.t5_b") },
    { icon: <MessageCircle className="w-5 h-5" />, title: t("pages.help.topics.t6_t"), body: t("pages.help.topics.t6_b") },
  ];

  return (
    <PageShell>
      <SEO title={t("pages.help.seo_title")} description={t("pages.help.seo_desc")} />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero opacity-90" />
        <div className="absolute inset-0 grid-bg opacity-25" />
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full bg-gradient-glow blur-3xl opacity-40" />
        <div className="container relative py-20 md:py-28">
          <div className="max-w-2xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5" /> {t("pages.help.eyebrow")}
            </div>
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight mb-5">{t("pages.help.h1")}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">{t("pages.help.lead")}</p>
          </div>
        </div>
      </section>

      {/* Topic cards */}
      <section className="container pt-16 pb-8 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOPICS.map((tt) => (
          <Link key={tt.title} to="/contact" className="glass rounded-2xl p-7 group hover:border-primary/40 transition-all hover:-translate-y-0.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary/20 border border-primary/20 flex items-center justify-center mb-5 text-primary">
              {tt.icon}
            </div>
            <div className="font-semibold mb-2">{tt.title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tt.body}</p>
          </Link>
        ))}
      </section>

      {/* FAQ accordion */}
      <section className="container py-16 max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-3">Common questions</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently asked</h2>
        </div>
        <div className="glass rounded-3xl border border-border/40 px-8 py-2">
          {FAQ_ITEMS.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-32">
        <div className="glass rounded-3xl p-10 md:p-14 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">{t("pages.help.still_human")}</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">{t("pages.help.still_human_lead")}</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity text-sm font-medium">
            {t("pages.help.contact_team")} <Sparkles className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
