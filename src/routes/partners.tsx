import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink, Gift, Handshake, Percent, Route as RouteIcon, Share2, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { PartnerApplicationModal } from "@/components/partner/PartnerApplicationModal";
import { PartnerHeader } from "@/components/partner/PartnerHeader";
import { AnchorLink } from "@/components/AnchorLink";
import { useLocale } from "@/lib/i18n";
import { partnerCopy } from "@/lib/partner-i18n";
import { shareLinkCopy } from "@/lib/share-i18n";
import { fetchActivePartners, type PartnerRecord } from "@/lib/partners";

export const Route = createFileRoute("/partners")({
  head: () => ({
    meta: [
      { title: "AutoVere Organisation Partners — Give Your Members 25% Off" },
      {
        name: "description",
        content: "Partner with AutoVere to give your members a genuine travel benefit: 25% off AutoVere Pro's real toll, vignette, fuel and EV charging cost planning. Simple to offer, no technical work required.",
      },
    ],
  }),
  component: PartnersPage,
});

function PartnersPage() {
  const { locale } = useLocale();
  const copy = partnerCopy[locale] ?? partnerCopy.en;
  const share = shareLinkCopy[locale] ?? shareLinkCopy.en;
  const [partners, setPartners] = useState<PartnerRecord[] | null>(null);
  const [applicationOpen, setApplicationOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchActivePartners().then((list) => {
      if (!cancelled) setPartners(list);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground md:px-8">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="size-4" /> {copy.page.back}
        </Link>

        <header className="mt-10 max-w-3xl">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">{copy.page.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{copy.page.title}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{copy.page.intro}</p>
          <p className="mt-4 text-base font-semibold leading-relaxed text-foreground">{copy.page.proudStatement}</p>
        </header>

        <section className="mt-10">
          <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">{copy.page.previewLabel}</h2>
          <div className="mt-3 overflow-hidden rounded-xl border border-border">
            <PartnerHeader
              name={copy.demo.name}
              logo="/partners/eta-logo.svg"
              website="https://example.org"
              visitLabel={copy.header.visitWebsite}
              partnerLabel={copy.header.partnerLabel}
              demoNote={copy.page.previewCaption}
            />
          </div>
        </section>

        <section id="why" className="mt-12 scroll-mt-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{copy.page.whyTitle}</h2>
            <AnchorLink id="why" label={share.copyLink} copiedLabel={share.linkCopied} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Gift, title: copy.page.why1Title, body: copy.page.why1Body },
              { icon: Zap, title: copy.page.why2Title, body: copy.page.why2Body },
              { icon: RouteIcon, title: copy.page.why3Title, body: copy.page.why3Body },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="panel bg-gradient-to-br from-surface/90 via-surface/70 to-primary/5 p-4 backdrop-blur-sm transition-colors hover:border-primary/30">
                <Icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-3 text-sm font-bold text-foreground">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="mt-10 scroll-mt-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{copy.page.stepsTitle}</h2>
            <AnchorLink id="how-it-works" label={share.copyLink} copiedLabel={share.linkCopied} />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Handshake, title: copy.page.step1Title, body: copy.page.step1Body },
              { icon: Share2, title: copy.page.step2Title, body: copy.page.step2Body },
              { icon: Percent, title: copy.page.step3Title, body: copy.page.step3Body },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="panel p-4">
                <Icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-3 text-sm font-bold text-foreground">{title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="our-partners" className="mt-10 panel scroll-mt-6 p-5 sm:p-7">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{copy.page.directoryTitle}</h2>
            <AnchorLink id="our-partners" label={share.copyLink} copiedLabel={share.linkCopied} />
          </div>
          {partners === null && <p className="mt-4 text-sm text-muted-foreground">…</p>}
          {partners !== null && partners.length === 0 && (
            <div className="mt-6 flex flex-col items-center rounded-lg border border-dashed border-border py-12 text-center">
              <Handshake className="size-8 text-muted-foreground/50" />
              <p className="mt-4 text-sm font-semibold">{copy.page.directoryEmptyTitle}</p>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">{copy.page.directoryEmptyBody}</p>
            </div>
          )}
          {partners !== null && partners.length > 0 && (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {partners.map((partner) => (
                <li key={partner.id}>
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={copy.header.visitWebsite(partner.name)}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface-raised p-4 transition-colors hover:border-primary/50"
                  >
                    {partner.logo && <img src={partner.logo} alt={partner.name} className="h-8 w-auto max-w-[96px] shrink-0 object-contain" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{partner.name}</p>
                      {partner.country && <p className="text-xs text-muted-foreground">{partner.country}</p>}
                    </div>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary">{copy.page.memberBenefit(partner.discountPercent)}</span>
                    <ExternalLink className="size-4 shrink-0 text-muted-foreground" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="become-a-partner" className="mt-10 scroll-mt-6 border-t border-border pt-8">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">{copy.page.ctaTitle}</h2>
            <AnchorLink id="become-a-partner" label={share.copyLink} copiedLabel={share.linkCopied} />
          </div>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{copy.page.ctaText}</p>
          <Button className="mt-5" onClick={() => setApplicationOpen(true)}>{copy.page.ctaButton}</Button>
        </section>
      </div>
      <PartnerApplicationModal open={applicationOpen} onOpenChange={setApplicationOpen} />
    </main>
  );
}
