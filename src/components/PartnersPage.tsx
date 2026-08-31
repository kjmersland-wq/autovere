import { useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Building2,
  CheckCircle2,
  Gift,
  Handshake,
  Mail,
  Route as RouteIcon,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Lang = "no" | "en";

const COPY = {
  no: {
    eyebrow: "AutoVere Partnere",
    title: "Gi medlemmene dine 25 % rabatt på AutoVere Pro.",
    intro:
      "AutoVere gir bil-, EL-, bobil-, campingvogn- og reiseorganisasjoner en enkel måte å gi medlemmene noe de faktisk får bruk for: ekte reisekostnader før de kjører — og 25 % rabatt på AutoVere Pro som gjør det til et lett ja.",
    lead: "Vi er stolte av å samarbeide med organisasjoner som hjelper medlemmene sine å reise lenger, smartere og med færre overraskelser.",
    howItLooks: "SLIK SER DET UT",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstrasjon — kun eksempel. Denne organisasjonen er fiktiv.",
    whyTitle: "Hvorfor samarbeide med AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "En reell medlemsfordel",
        body: "Gi medlemmene noe de faktisk bruker når de planlegger og kjører: virkelige bom-, vignett-, drivstoff- og ladekostnader — ikke gjetting.",
      },
      {
        icon: Zap,
        heading: "Enkelt for organisasjonen",
        body: "AutoVere håndterer teknologien, abonnementene og medlemsopplevelsen. Ingen programvare å bygge og ingen fakturering å følge opp.",
      },
      {
        icon: RouteIcon,
        heading: "Bygget for folk som reiser",
        body: "AutoVere viser hva en reise faktisk koster — fra bom og vignetter til drivstoff og lading — før medlemmene forlater hjemmet.",
      },
    ],
    howTitle: "Slik fungerer det",
    how: [
      {
        icon: Handshake,
        heading: "1. Vi setter opp medlemsfordelen",
        body: "AutoVere oppretter partneravtalen og medlemstilgangen — ingen arbeid på deres side.",
      },
      {
        icon: Share2,
        heading: "2. Dere deler den med medlemmene",
        body: "Dere får medlemslenken og koden, og deler den slik det passer organisasjonen best.",
      },
      {
        icon: BadgePercent,
        heading: "3. Medlemmene får 25 % rabatt",
        body: "Enkelt, nyttig og klart til bruk fra første dag — uten ekstra administrasjon.",
      },
    ],
    partnersTitle: "Våre organisasjonspartnere",
    partnersEmpty:
      "Partnerlogoer vises her etter hvert som avtalene signeres. Vil dere være blant de første?",
    trustTitle: "Trygt, transparent og uten videresalg",
    trust: [
      "Alle bom- og vignettkjøp skjer hos den offisielle operatøren — vi er aldri videreselger.",
      "Ingen medlemsdata deles med tredjepart for markedsføring.",
      "Dekker Europa, USA og Canada i én tjeneste.",
      "Norsk selskap: KM TECH LABS, Kristiansand.",
    ],
    ctaTitle: "Interessert i å bli partner?",
    ctaHeading: "Bli AutoVere-partner",
    ctaBody: "Registrer organisasjonen direkte hos AutoVere. Det tar bare noen minutter.",
    ctaButton: "Bli AutoVere-partner",
    ctaFine:
      "Dere oppgir organisasjonsdetaljer, logo, land, kontaktinformasjon og informasjon om medlemsfordelen. Etter godkjenning sender AutoVere partnerkode og partnerlenke på e-post.",
    talkBody:
      "Vi hører gjerne fra dere og utforsker hvordan AutoVere kan bli en nyttig fordel for medlemmene deres.",
    talkButton: "La oss snakke",
    applyTitle: "Søk om å bli partner",
    applyBody:
      "Fortell oss om organisasjonen, så tar vi kontakt. Etter godkjenning er medlemskoden og lenken klar umiddelbart — ingenting for dere å sette opp.",
    fields: {
      org: "Organisasjonsnavn",
      orgPh: "f.eks. Norsk Motorklubb",
      country: "Land",
      countryPh: "f.eks. Norge",
      site: "Offisiell nettside",
      name: "Ditt navn",
      namePh: "Fullt navn",
      email: "Din e-post",
      emailPh: "navn@organisasjon.no",
      members: "Fortell litt om medlemmene (valgfritt)",
      membersPh: "Hvem er medlemmene, og omtrent hvor mange?",
      submit: "Send søknad",
      msgTitle: "Send oss en melding",
      msgBody:
        "Har dere et spørsmål eller noe vi bør forbedre? Skriv til oss, så svarer vi så raskt vi kan.",
      yourName: "Navn",
      subject: "Emne",
      subjectPh: "Hva gjelder det?",
      message: "Melding",
      messagePh: "Fortell oss hva du tenker på …",
      send: "Send melding",
    },
  },
  en: {
    eyebrow: "AutoVere Partners",
    title: "Give your members 25% off AutoVere Pro.",
    intro:
      "AutoVere offers motoring, EV, motorhome, caravan, touring and travel organisations a simple way to give their members something genuinely useful: real trip costs before they set off, and 25% off AutoVere Pro to make it an easy yes.",
    lead: "We're proud to work with organisations that help their members travel further, smarter and with fewer surprises.",
    howItLooks: "HERE'S HOW IT LOOKS",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstration — example only. This organisation is fictional.",
    whyTitle: "Why partner with AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "A useful member benefit",
        body: "Give your members something they'll actually use when planning and taking journeys — real toll, vignette, fuel and charging costs, not guesswork.",
      },
      {
        icon: Zap,
        heading: "Simple for your organisation",
        body: "AutoVere handles the technology, the subscriptions and the member experience. No software to build, no billing to manage.",
      },
      {
        icon: RouteIcon,
        heading: "Built for people who travel",
        body: "AutoVere helps travellers understand what a journey will really cost, from tolls and vignettes to fuel and EV charging, before they leave home.",
      },
    ],
    howTitle: "How it works",
    how: [
      {
        icon: Handshake,
        heading: "1. We set up your member benefit",
        body: "AutoVere creates your partner arrangement and member access — no work required on your side.",
      },
      {
        icon: Share2,
        heading: "2. You share it with your members",
        body: "We give you the member link and code to share however suits your organisation best.",
      },
      {
        icon: BadgePercent,
        heading: "3. Your members get 25% off AutoVere Pro",
        body: "Simple, useful, and ready to use from day one.",
      },
    ],
    partnersTitle: "Our organisation partners",
    partnersEmpty: "Partner logos appear here as agreements are signed. Want to be among the first?",
    trustTitle: "Safe, transparent and never a reseller",
    trust: [
      "Every toll and vignette purchase happens with the official operator — we never resell.",
      "No member data is shared with third parties for marketing.",
      "Europe, the USA and Canada covered in one service.",
      "Built by KM TECH LABS, Norway.",
    ],
    ctaTitle: "Interested in becoming a partner?",
    ctaHeading: "Become an AutoVere Partner",
    ctaBody: "Register your organisation directly with AutoVere. It only takes a few minutes.",
    ctaButton: "Become an AutoVere Partner",
    ctaFine:
      "You provide your organisation details, logo, country, contact information and member benefit information. Once approved, AutoVere sends your partner code and partner link by email.",
    talkBody:
      "We'd love to hear from you and explore how AutoVere could become a useful benefit for your members.",
    talkButton: "Let's talk",
    applyTitle: "Apply to become a partner",
    applyBody:
      "Tell us about your organisation and we'll be in touch. Once approved, your member code and link are ready immediately — nothing for you to configure.",
    fields: {
      org: "Organisation name",
      orgPh: "e.g. European Touring Association",
      country: "Country",
      countryPh: "e.g. Norway",
      site: "Official website",
      name: "Your name",
      namePh: "Full name",
      email: "Your email",
      emailPh: "name@organisation.org",
      members: "Tell us a bit about your members (optional)",
      membersPh: "Who are your members, and roughly how many?",
      submit: "Submit application",
      msgTitle: "Send us a message",
      msgBody: "Have a question or spotted something we should improve? Write to us and we will get back to you.",
      yourName: "Name",
      subject: "Subject",
      subjectPh: "What is this about?",
      message: "Message",
      messagePh: "Tell us what is on your mind…",
      send: "Send message",
    },
  },
} as const;

const PARTNER_EMAIL = "partners@autovere.com";

function mailto(subject: string, body: string) {
  return `mailto:${PARTNER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function PartnersPage({ lang = "en" }: { lang?: Lang }) {
  const c = COPY[lang];
  const [applyOpen, setApplyOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);

  function submitApplication(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `${c.fields.org}: ${f.get("org")}`,
      `${c.fields.country}: ${f.get("country")}`,
      `${c.fields.site}: ${f.get("site")}`,
      `${c.fields.name}: ${f.get("name")}`,
      `${c.fields.email}: ${f.get("email")}`,
      "",
      `${c.fields.members}:`,
      String(f.get("members") ?? ""),
    ].join("\n");
    window.location.href = mailto(`${c.applyTitle} — ${f.get("org")}`, body);
    setApplyOpen(false);
  }

  function submitMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [`${f.get("name")} <${f.get("email")}>`, "", String(f.get("message") ?? "")].join("\n");
    window.location.href = mailto(String(f.get("subject") ?? c.fields.msgTitle), body);
    setTalkOpen(false);
  }

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-32 top-[-14rem] size-[34rem] rounded-full bg-primary/15 blur-[120px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 bottom-[-18rem] size-[30rem] rounded-full bg-primary/10 blur-[130px]"
        />
        <div className="relative mx-auto w-full max-w-5xl px-6 py-20 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{c.eyebrow}</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {c.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{c.intro}</p>
          <p className="mt-5 max-w-2xl text-base font-medium leading-relaxed text-foreground/90">
            {c.lead}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" onClick={() => setApplyOpen(true)}>
              {c.ctaButton} <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => setTalkOpen(true)}>
              <Mail className="size-4" /> {c.talkButton}
            </Button>
          </div>

          <p className="mt-12 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {c.howItLooks}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/60 px-6 py-5 backdrop-blur">
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
              Auto<span className="text-primary">Vere</span>
            </span>
            <span className="text-muted-foreground">×</span>
            <span className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1.5 text-sm text-foreground/90">
              <Building2 className="size-4 text-primary" /> {c.demoOrg}
            </span>
            <span className="rounded-full bg-primary/15 px-3 py-1 text-[0.65rem] font-bold tracking-[0.16em] text-primary">
              {c.demoBadge}
            </span>
            <span className="text-xs text-muted-foreground">{c.demoNote}</span>
          </div>
        </div>
      </section>

      {/* Why partner */}
      <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8">
        <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground">
          <Sparkles className="size-5 text-primary" /> {c.whyTitle}
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {c.why.map((item) => (
            <article
              key={item.heading}
              className="group rounded-2xl border border-border bg-card/50 p-6 backdrop-blur transition-colors hover:border-primary/40 hover:bg-card/80"
            >
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{item.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{c.howTitle}</h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {c.how.map((item) => (
            <article key={item.heading} className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-primary/12 text-primary">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{item.heading}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16 sm:px-8">
        <div className="rounded-3xl border border-border bg-card/50 p-8 backdrop-blur">
          <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight text-foreground">
            <ShieldCheck className="size-5 text-primary" /> {c.trustTitle}
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {c.trust.map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partner logos */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-16 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{c.partnersTitle}</h2>
        <div className="mt-6 rounded-3xl border border-dashed border-border bg-card/30 px-8 py-14 text-center">
          <Building2 className="mx-auto size-8 text-muted-foreground/60" />
          <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{c.partnersEmpty}</p>
          <Button className="mt-6" variant="outline" onClick={() => setApplyOpen(true)}>
            {c.ctaButton} <ArrowRight className="size-4" />
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{c.ctaTitle}</h2>
        <div className="mt-6 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/12 via-card/60 to-card/30 p-8 backdrop-blur">
          <h3 className="text-xl font-semibold text-foreground">{c.ctaHeading}</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{c.ctaBody}</p>
          <Button size="lg" className="mt-6" onClick={() => setApplyOpen(true)}>
            {c.ctaButton} <ArrowRight className="size-4" />
          </Button>
          <p className="mt-5 max-w-2xl text-xs leading-relaxed text-muted-foreground">{c.ctaFine}</p>
        </div>
        <p className="mt-8 max-w-xl text-sm leading-relaxed text-muted-foreground">{c.talkBody}</p>
        <Button variant="secondary" className="mt-4" onClick={() => setTalkOpen(true)}>
          {c.talkButton}
        </Button>
      </section>

      {/* Apply modal */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary">
              AUTOVERE
            </p>
            <DialogTitle className="text-2xl">{c.applyTitle}</DialogTitle>
            <DialogDescription>{c.applyBody}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitApplication}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="org">{c.fields.org}</Label>
                <Input id="org" name="org" required placeholder={c.fields.orgPh} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="country">{c.fields.country}</Label>
                <Input id="country" name="country" required placeholder={c.fields.countryPh} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="site">{c.fields.site}</Label>
              <Input id="site" name="site" type="url" placeholder="https://" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name">{c.fields.name}</Label>
                <Input id="name" name="name" required placeholder={c.fields.namePh} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">{c.fields.email}</Label>
                <Input id="email" name="email" type="email" required placeholder={c.fields.emailPh} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="members">{c.fields.members}</Label>
              <Textarea id="members" name="members" rows={4} placeholder={c.fields.membersPh} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Send className="size-4" /> {c.fields.submit}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contact modal */}
      <Dialog open={talkOpen} onOpenChange={setTalkOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-primary">
              AUTOVERE
            </p>
            <DialogTitle className="text-2xl">{c.fields.msgTitle}</DialogTitle>
            <DialogDescription>{c.fields.msgBody}</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitMessage}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="c-name">{c.fields.yourName}</Label>
                <Input id="c-name" name="name" required placeholder={c.fields.namePh} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="c-email">{c.fields.email}</Label>
                <Input id="c-email" name="email" type="email" required placeholder={c.fields.emailPh} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-subject">{c.fields.subject}</Label>
              <Input id="c-subject" name="subject" required placeholder={c.fields.subjectPh} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-message">{c.fields.message}</Label>
              <Textarea id="c-message" name="message" rows={5} required placeholder={c.fields.messagePh} />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Send className="size-4" /> {c.fields.send}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}
