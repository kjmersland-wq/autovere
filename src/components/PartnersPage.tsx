import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgePercent,
  Building2,
  CheckCircle2,
  Gift,
  Handshake,
  Lock,
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
import { sendContactMessage } from "@/lib/contact.functions";

type Lang = "no" | "en" | "pl";

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
      "AutoVere gives motoring clubs, EV groups, motorhome and caravan associations, touring and travel organisations — and independent new- and used-car dealers — a simple way to offer their members and customers something they will actually use: real trip costs before they set off, plus 25% off AutoVere Pro.",
    lead: "We're proud to work with people who help others travel further, smarter and with fewer surprises.",
    howItLooks: "HERE'S HOW IT LOOKS",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstration — example only. This organisation is fictional.",
    whyTitle: "Why partner with AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "A benefit people are glad to receive",
        body: "Your members get something they'll genuinely reach for before every journey: real toll, vignette, fuel and charging costs — never guesswork.",
      },
      {
        icon: Zap,
        heading: "Easy on your side",
        body: "We look after the technology, the subscriptions and the member experience. There's nothing to build, and no billing for you to keep track of.",
      },
      {
        icon: RouteIcon,
        heading: "Built for people who travel — and for those who help them get on the road",
        body: "Clubs, associations and independent dealers alike can show travellers what a journey will really cost, from tolls and vignettes to fuel and EV charging, long before they leave home.",
      },
    ],
    howTitle: "How it works",
    how: [
      {
        icon: Handshake,
        heading: "1. We set the benefit up for you",
        body: "Tell us a little about your organisation and we'll take care of the partner arrangement and member access. Nothing to configure at your end.",
      },
      {
        icon: Share2,
        heading: "2. You share it in your own way",
        body: "You'll get a member link and code. Share them in a newsletter, on your site, or hand them over in person — whatever suits you best.",
      },
      {
        icon: BadgePercent,
        heading: "3. Your members enjoy 25% off AutoVere Pro",
        body: "It works from day one, and we're here if anyone has a question along the way.",
      },
    ],
    partnersTitle: "Our organisation partners",
    partnersEmpty:
      "Partner logos will appear here as agreements are signed. We'd love to have you among the first.",
    trustTitle: "Safe, transparent and never a reseller",
    trust: [
      "Every toll and vignette purchase happens directly with the official operator — we never resell, and we never add a markup.",
      "Member data stays private; we never share it with third parties for marketing.",
      "One service covering Europe, the USA and Canada.",
      "Made with care by KM TECH LABS in Kristiansand, Norway.",
    ],
    ctaTitle: "We'd love to hear from you",
    ctaHeading: "Become an AutoVere Partner",
    ctaBody:
      "Register your organisation directly with AutoVere — it only takes a few minutes, and there's no commitment in asking.",
    ctaButton: "Become an AutoVere Partner",
    ctaFine:
      "You share your organisation details, logo, country, contact information and a little about the member benefit. Once approved, we'll email your partner code and partner link — and we're happy to help you present it to your members.",
    talkBody:
      "Not quite ready to sign up? Just say hello. We're always glad to talk through how AutoVere could help the people you look after.",
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
  pl: {
    eyebrow: "Partnerzy AutoVere",
    title: "Daj swoim członkom 25% zniżki na AutoVere Pro.",
    intro:
      "AutoVere daje klubom motoryzacyjnym, organizacjom EV, kamperowym, karawaningowym i turystycznym prosty sposób, by zaoferować członkom coś naprawdę przydatnego: realne koszty podróży jeszcze przed wyjazdem — oraz 25% zniżki na AutoVere Pro, dzięki czemu decyzja jest łatwa.",
    lead: "Z dumą współpracujemy z organizacjami, które pomagają swoim członkom podróżować dalej, mądrzej i bez przykrych niespodzianek.",
    howItLooks: "TAK TO WYGLĄDA",
    demoOrg: "European Touring Association",
    demoBadge: "PARTNER",
    demoNote: "Demonstracja — wyłącznie przykład. Ta organizacja jest fikcyjna.",
    whyTitle: "Dlaczego warto zostać partnerem AutoVere?",
    why: [
      {
        icon: Gift,
        heading: "Realna korzyść dla członków",
        body: "Dajesz członkom narzędzie, z którego naprawdę skorzystają przy planowaniu i w trasie — prawdziwe koszty opłat, winiet, paliwa i ładowania, bez zgadywania.",
      },
      {
        icon: Zap,
        heading: "Proste dla Twojej organizacji",
        body: "AutoVere zajmuje się technologią, subskrypcjami i obsługą członków. Nie musisz niczego programować ani rozliczać.",
      },
      {
        icon: RouteIcon,
        heading: "Stworzone dla ludzi w podróży",
        body: "AutoVere pokazuje, ile naprawdę kosztuje trasa — od opłat i winiet po paliwo i ładowanie — zanim ktokolwiek wyjedzie z domu.",
      },
    ],
    howTitle: "Jak to działa",
    how: [
      {
        icon: Handshake,
        heading: "1. Przygotowujemy korzyść dla członków",
        body: "AutoVere tworzy umowę partnerską i dostęp dla członków — po Waszej stronie nie ma żadnej pracy.",
      },
      {
        icon: Share2,
        heading: "2. Udostępniacie ją członkom",
        body: "Otrzymujecie link i kod dla członków, a udostępniacie je tak, jak najlepiej pasuje Waszej organizacji.",
      },
      {
        icon: BadgePercent,
        heading: "3. Członkowie dostają 25% zniżki na AutoVere Pro",
        body: "Prosto, praktycznie i gotowe do użycia od pierwszego dnia.",
      },
    ],
    partnersTitle: "Nasi partnerzy organizacyjni",
    partnersEmpty:
      "Loga partnerów pojawią się tutaj wraz z podpisywaniem umów. Chcecie być wśród pierwszych?",
    trustTitle: "Bezpiecznie, przejrzyście i nigdy w odsprzedaży",
    trust: [
      "Każdy zakup opłaty i winiety odbywa się u oficjalnego operatora — nigdy nie jesteśmy pośrednikiem.",
      "Żadne dane członków nie trafiają do stron trzecich w celach marketingowych.",
      "Europa, USA i Kanada w jednej usłudze.",
      "Tworzone przez KM TECH LABS, Norwegia.",
    ],
    ctaTitle: "Chcecie zostać partnerem?",
    ctaHeading: "Zostań partnerem AutoVere",
    ctaBody: "Zarejestrujcie organizację bezpośrednio w AutoVere. To tylko kilka minut.",
    ctaButton: "Zostań partnerem AutoVere",
    ctaFine:
      "Podajecie dane organizacji, logo, kraj, dane kontaktowe oraz informacje o korzyści dla członków. Po akceptacji AutoVere wyśle kod i link partnerski e-mailem.",
    talkBody:
      "Chętnie Was poznamy i wspólnie sprawdzimy, jak AutoVere może stać się realną korzyścią dla Waszych członków.",
    talkButton: "Porozmawiajmy",
    applyTitle: "Zgłoś się na partnera",
    applyBody:
      "Opowiedzcie nam o swojej organizacji, a my się odezwiemy. Po akceptacji kod i link dla członków są gotowe od razu — nic nie musicie konfigurować.",
    fields: {
      org: "Nazwa organizacji",
      orgPh: "np. Polski Związek Motorowy",
      country: "Kraj",
      countryPh: "np. Polska",
      site: "Oficjalna strona",
      name: "Twoje imię i nazwisko",
      namePh: "Imię i nazwisko",
      email: "Twój e-mail",
      emailPh: "imie@organizacja.pl",
      members: "Opowiedz krótko o członkach (opcjonalnie)",
      membersPh: "Kim są członkowie i mniej więcej ilu ich jest?",
      submit: "Wyślij zgłoszenie",
      msgTitle: "Napisz do nas",
      msgBody:
        "Masz pytanie albo pomysł, co moglibyśmy poprawić? Napisz — odpowiemy tak szybko, jak to możliwe.",
      yourName: "Imię i nazwisko",
      subject: "Temat",
      subjectPh: "Czego dotyczy wiadomość?",
      message: "Wiadomość",
      messagePh: "Napisz, co Ci chodzi po głowie …",
      send: "Wyślij wiadomość",
    },
  },
} as const;

export function PartnersPage({ lang = "en" }: { lang?: Lang }) {
  const c = COPY[lang];
  const [applyOpen, setApplyOpen] = useState(false);
  const [talkOpen, setTalkOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const t = {
    sending: lang === "no" ? "Sender …" : lang === "pl" ? "Wysyłamy …" : "Sending …",
    ok:
      lang === "no"
        ? "Takk! Meldingen er sendt."
        : lang === "pl"
          ? "Dziękujemy! Wiadomość została wysłana."
          : "Thank you! Your message has been sent.",
    fail:
      lang === "no"
        ? "Kunne ikke sende akkurat nå. Prøv igjen om litt."
        : lang === "pl"
          ? "Nie udało się wysłać w tej chwili. Spróbuj ponownie za moment."
          : "We couldn't send that right now. Please try again shortly.",
  };

  async function submit(form: HTMLFormElement, kind: "partner" | "message", close: () => void) {
    const f = new FormData(form);
    setSending(true);
    try {
      await sendContactMessage({
        data: {
          kind,
          name: String(f.get("name") ?? ""),
          email: String(f.get("email") ?? ""),
          subject: f.get("subject") ? String(f.get("subject")) : undefined,
          organisation: f.get("org") ? String(f.get("org")) : undefined,
          country: f.get("country") ? String(f.get("country")) : undefined,
          website: f.get("site") ? String(f.get("site")) : undefined,
          message: String(f.get("message") ?? f.get("members") ?? ""),
        },
      });
      toast.success(t.ok);
      form.reset();
      close();
    } catch {
      toast.error(t.fail);
    } finally {
      setSending(false);
    }
  }

  function submitApplication(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(e.currentTarget, "partner", () => setApplyOpen(false));
  }

  function submitMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    void submit(e.currentTarget, "message", () => setTalkOpen(false));
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

          {lang === "en" ? (
            <p className="mt-4 text-sm italic text-muted-foreground">
              Let&rsquo;s make planning easier for the people you care about.
            </p>
          ) : null}

          <p className="mt-12 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {c.howItLooks}
          </p>
          <div className="mt-3 max-w-xl rounded-2xl border border-border bg-gradient-to-br from-card/80 via-card/50 to-primary/[0.06] p-6 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3">
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
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-primary/20 bg-background/50 px-4 py-3">
              <BadgePercent className="size-5 shrink-0 text-primary" />
              <p className="text-sm font-medium text-foreground">
                25% off AutoVere Pro <span className="font-normal text-muted-foreground">— member benefit</span>
              </p>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">{c.demoNote}</p>
          </div>
        </div>
      </section>

      {/* Why partner */}
      <div className="bg-gradient-to-b from-primary/[0.05] via-transparent to-transparent">
        <section className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-8">
          <h2 className="flex items-center gap-3 text-2xl font-semibold tracking-tight text-foreground">
            <Sparkles className="size-5 text-primary" /> {c.whyTitle}
          </h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {c.why.map((item) => (
              <article
                key={item.heading}
                className="group rounded-2xl border border-border bg-card/50 p-6 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card/80"
              >
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
                  <item.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">{item.heading}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* How it works */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-4 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">{c.howTitle}</h2>
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {c.how.map((item, i) => (
            <article
              key={item.heading}
              className="relative rounded-2xl border border-border bg-gradient-to-b from-card/70 to-card/30 p-6 backdrop-blur"
            >
              <span className="absolute right-5 top-5 text-4xl font-semibold leading-none text-primary/15">
                {i + 1}
              </span>
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15">
                <item.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">{item.heading}</h3>
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
              <Button type="submit" disabled={sending}>
                <Send className="size-4" /> {sending ? t.sending : c.fields.submit}
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
              <Button type="submit" disabled={sending}>
                <Send className="size-4" /> {sending ? t.sending : c.fields.send}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="border-t border-white/5 py-6 text-center">
        <a
          href="/partners/in-car"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground"
        >
          <Lock className="size-3" /> OEM &amp; In-Car Intelligence Portal
        </a>
      </div>
    </main>
  );
}
