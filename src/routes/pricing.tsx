import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n";
import { annualLabels, checkoutLabels, comparisonStateLabels, marketingCopy } from "@/lib/marketing-i18n";

function PricingPage() {
  const { locale } = useLocale();
  const copy = marketingCopy[locale];
  const [freePlan, proPlan, businessPlan] = copy.plans;
  const [yearly, setYearly] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  async function startCheckout(priceId: string) {
    setCheckoutPlan(priceId);
    setCheckoutError("");
    try {
      const result = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, locale }),
      });
      const data = (await result.json()) as { url?: string; error?: string };
      if (!result.ok || !data.url) throw new Error(data.error || checkoutLabels[locale].error);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      setCheckoutError(error instanceof Error ? error.message : checkoutLabels[locale].error);
      setCheckoutPlan(null);
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" /> {copy.back}
        </Link>
        <header className="mt-10 max-w-3xl">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{copy.pricingTitle}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{copy.pricingSubtitle}</p>
        </header>

        <div className="mt-8 inline-flex items-center gap-1 rounded-xl border border-border bg-surface-raised p-1" aria-label={`${copy.monthly} / ${copy.yearly}`}>
          <button type="button" onClick={() => setYearly(false)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${!yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{copy.monthly}</button>
          <button type="button" onClick={() => setYearly(true)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{copy.yearly}</button>
          <span className="px-2 text-xs font-bold text-primary">{copy.save}</span>
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-3" aria-label={copy.pricingTitle}>
          {copy.plans.map((plan, planIndex) => (
            <article key={plan.name} className={`panel flex flex-col p-5 sm:p-6 ${plan.featured ? "border-primary/60 panel-glow" : ""}`}>
              {plan.featured && <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary"><Sparkles className="size-3.5" /> AUTOVERE Pro</span>}
              <h2 className="text-xl font-bold">{plan.name}</h2>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{yearly ? plan.yearlyPrice : plan.price}</span>
                {plan.price !== "Free" && plan.price !== "Gratis" && plan.price !== "Kostenlos" && <span className="text-sm text-muted-foreground">{yearly ? annualLabels[locale] : copy.perMonth}</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                {plan.features.map((feature) => <li key={feature} className="flex gap-2"><Check className="mt-0.5 size-4 shrink-0 text-primary" /> <span>{feature}</span></li>)}
              </ul>
              {planIndex === 0 ? <Link to="/"><Button className="mt-7 w-full">{plan.action}</Button></Link> : <Button className="mt-7 w-full" variant={plan.featured ? "default" : "secondary"} disabled={checkoutPlan !== null} onClick={() => void startCheckout(`${planIndex === 2 ? "business" : "pro"}-${yearly ? "yearly" : "monthly"}`)}>{checkoutPlan ? checkoutLabels[locale].starting : plan.action}</Button>}
            </article>
          ))}
        </section>
        {checkoutError && <p className="mt-4 text-sm text-destructive" role="alert">{checkoutError}</p>}

        <section className="mt-12 panel overflow-hidden p-5 sm:p-7">
          <h2 className="text-xl font-bold">{copy.compareTitle}</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left text-sm">
              <thead><tr className="border-b border-border text-muted-foreground"><th className="px-3 py-3 font-semibold">{copy.compareFeature}</th><th className="px-3 py-3 font-semibold">{freePlan?.name}</th><th className="px-3 py-3 font-semibold">{proPlan?.name}</th><th className="px-3 py-3 font-semibold">{businessPlan?.name}</th></tr></thead>
              <tbody>{copy.comparison.map((row) => <tr key={row.feature} className="border-b border-border/60 last:border-0"><th className="px-3 py-4 font-medium text-foreground">{row.feature}</th>{[row.free, row.pro, row.business].map((included, index) => <td key={index} className="px-3 py-4">{included ? <Check className="size-5 text-primary" aria-label={comparisonStateLabels[locale].included} /> : <span className="text-muted-foreground/40" aria-label={comparisonStateLabels[locale].notIncluded}>—</span>}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export const Route = createFileRoute("/pricing")({ component: PricingPage });
