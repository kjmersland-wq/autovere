import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { AnchorLink } from "@/components/AnchorLink";
import { useLocale } from "@/lib/i18n";
import { annualLabels, checkoutLabels, comparisonStateLabels, marketingCopy } from "@/lib/marketing-i18n";
import { usePartner } from "@/lib/partner-context";
import { partnerCopy } from "@/lib/partner-i18n";
import { shareLinkCopy } from "@/lib/share-i18n";
import { fetchPartnerByCode, storePartner, type PartnerRecord } from "@/lib/partners";

const PLAN_ANCHORS = ["free", "pro", "business"];

function PricingPage() {
  const { locale } = useLocale();
    const copy = marketingCopy[locale] ?? marketingCopy.en;
    const urlPartner = usePartner();
    const [manualPartner, setManualPartner] = useState<PartnerRecord | null>(null);
    const [codeInput, setCodeInput] = useState("");
    const [applyingCode, setApplyingCode] = useState(false);
    const [codeError, setCodeError] = useState("");
    const partner = manualPartner ?? urlPartner;
    const partnerLabels = partnerCopy[locale] ?? partnerCopy.en;
    const share = shareLinkCopy[locale] ?? shareLinkCopy.en;
  const [freePlan, proPlan, businessPlan] = copy.plans;
  const [yearly, setYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number>(1);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState("");

  async function applyCode() {
    if (!codeInput.trim()) return;
    setApplyingCode(true);
    setCodeError("");
    const found = await fetchPartnerByCode(codeInput.trim());
    setApplyingCode(false);
    if (!found) {
      setCodeError(partnerLabels.memberCode.invalid);
      return;
    }
    storePartner(found);
    setManualPartner(found);
  }

  async function startCheckout(priceId: string) {
    setCheckoutPlan(priceId);
    setCheckoutError("");
    try {
      const result = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, locale, ...(partner ? { partnerId: partner.id } : {}) }),
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

        {partner ? (
          <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            {partnerLabels.page.checkoutBanner(partner.discountCode, partner.discountPercent)}
          </p>
        ) : (
          <div className="mt-6 flex flex-wrap items-end gap-2">
            <label>
              <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">{partnerLabels.memberCode.label}</span>
              <input
                value={codeInput}
                onChange={(event) => setCodeInput(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && void applyCode()}
                placeholder={partnerLabels.memberCode.placeholder}
                className="w-48 rounded-lg border border-border bg-surface-raised px-3 py-2 text-sm text-foreground outline-none focus:border-primary/60"
              />
            </label>
            <Button type="button" variant="secondary" disabled={applyingCode || !codeInput.trim()} onClick={() => void applyCode()}>
              {applyingCode ? partnerLabels.memberCode.applying : partnerLabels.memberCode.apply}
            </Button>
          </div>
        )}
        {codeError && <p className="mt-2 text-sm text-destructive">{codeError}</p>}

        <div className="mt-8 inline-flex items-center gap-1 rounded-xl border border-border bg-surface-raised p-1" aria-label={`${copy.monthly} / ${copy.yearly}`}>
          <button type="button" onClick={() => setYearly(false)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${!yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{copy.monthly}</button>
          <button type="button" onClick={() => setYearly(true)} className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${yearly ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{copy.yearly}</button>
          <span className="px-2 text-xs font-bold text-primary">{copy.save}</span>
        </div>

        <section className="mt-6 grid gap-4 lg:grid-cols-3" aria-label={copy.pricingTitle}>
          {copy.plans.map((plan, planIndex) => (
            <article key={plan.name} id={PLAN_ANCHORS[planIndex]} onClick={() => setSelectedPlan(planIndex)} className={`panel flex scroll-mt-6 flex-col p-5 sm:p-6 ${selectedPlan === planIndex ? "border-primary/60 panel-glow" : ""}`}>
              {planIndex === 1 && selectedPlan === 1 && <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary"><Sparkles className="size-3.5" /> AUTOVERE Pro</span>}
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold">{plan.name}</h2>
                {PLAN_ANCHORS[planIndex] && <AnchorLink id={PLAN_ANCHORS[planIndex]} label={share.copyLink} copiedLabel={share.linkCopied} />}
              </div>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-muted-foreground">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">{yearly ? plan.yearlyPrice : plan.price}</span>
                {!plan.isFree && <span className="text-sm text-muted-foreground">{yearly ? annualLabels[locale] : copy.perMonth}</span>}
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-muted-foreground">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    {typeof feature === "string" ? (
                      <span>{feature}</span>
                    ) : (
                      <span>
                        <span className="block font-semibold text-foreground">{feature.title}</span>
                        <span className="mt-0.5 block text-xs leading-relaxed">{feature.detail}</span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {planIndex === 0 ? <Link to="/" onClick={() => setSelectedPlan(planIndex)}><Button className="mt-7 w-full">{plan.action}</Button></Link> : <Button className="mt-7 w-full" variant={selectedPlan === planIndex ? "default" : "secondary"} disabled={checkoutPlan !== null} onClick={() => { setSelectedPlan(planIndex); void startCheckout(`${planIndex === 2 ? "business" : "pro"}-${yearly ? "yearly" : "monthly"}`); }}>{checkoutPlan ? checkoutLabels[locale].starting : plan.action}</Button>}
            </article>
          ))}
        </section>
        {checkoutError && <p className="mt-4 text-sm text-destructive" role="alert">{checkoutError}</p>}

        <section id="compare" className="mt-12 panel scroll-mt-6 overflow-hidden p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{copy.compareTitle}</h2>
            <AnchorLink id="compare" label={share.copyLink} copiedLabel={share.linkCopied} />
          </div>
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

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "AutoVere Pricing — Free, Pro & Business Road-Trip Planning" },
      {
        name: "description",
        content:
          "Compare AutoVere Free, Pro and Business plans: toll and vignette calculations, EV charging routes, weather-adjusted charging buffers and fleet tools for European road trips.",
      },
    ],
  }),
  component: PricingPage,
});
