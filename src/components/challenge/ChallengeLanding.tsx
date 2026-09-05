import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { CHALLENGE_CURRENCY, CHALLENGE_LANGS, challengeContent, type ChallengeLang } from "@/lib/challenge-content";
import { convert, formatCurrency } from "@/lib/currency";
// Served from public/ so the photo resolves on every host (custom domains don't proxy /__l5e asset URLs).
const FOUNDER_PHOTO_URL = "/kjell-mersland.jpg";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=2000&q=75";
const INVITATION_IMAGE =
  "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1400&q=72";
const ROAD_IMAGE =
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1800&q=72";

type Props = { lang?: ChallengeLang | undefined };

function Eyebrow({ children }: { children: string }) {
  return <p className="text-xs uppercase tracking-[0.28em] text-primary/90">{children}</p>;
}

/** Subtle emphasis on a few key founder phrases — no extra styling elsewhere. */
function emphasise(text: string, phrases: readonly string[]) {
  const hit = phrases.find((phrase) => text.includes(phrase));
  if (!hit) return text;
  const [before, after] = text.split(hit);
  return (
    <>
      {before}
      <em className="not-italic font-medium text-foreground">{hit}</em>
      {after}
    </>
  );
}

export function ChallengeLanding({ lang }: Props) {
  const c = challengeContent(lang);
  const base = lang ? `/challenge/${lang}` : "/challenge";
  const [sent, setSent] = useState(false);
  const currency = CHALLENGE_CURRENCY[lang ?? "en"];
  const money = (amountEur: number) => formatCurrency(convert(amountEur, "EUR", currency), currency);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    try {
      window.localStorage.setItem(
        "autovere_challenge_registration",
        JSON.stringify({ ...data, lang: lang ?? "gb", at: new Date().toISOString() }),
      );
    } catch {
      /* storage unavailable — the confirmation still stands */
    }
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <img
          src={HERO_IMAGE}
          alt="A car photographed at sunset before a long road test"
          className="absolute inset-0 -z-10 size-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgba(10,15,29,0.96)_0%,rgba(10,15,29,0.86)_45%,rgba(10,15,29,0.55)_100%)]" />
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-32 lg:py-40">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {c.hero.kicker}
          </span>
          <h1 className="mt-7 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            {c.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/80 sm:text-lg">
            {c.hero.lede}
          </p>
          <div className="mt-10 flex flex-col gap-1 text-2xl font-semibold uppercase tracking-tight text-foreground sm:text-3xl">
            {c.hero.statement.map((line, i) => (
              <span key={line} className={i === 2 ? "text-primary" : undefined}>
                {line}
              </span>
            ))}
          </div>
          <div className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="rounded-full px-7 text-sm font-semibold uppercase tracking-[0.12em]">
              <a href="#register">{c.hero.primaryCta}</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-white/25 bg-white/5 px-7 text-sm font-semibold uppercase tracking-[0.12em] backdrop-blur"
            >
              <Link to="/">{c.hero.secondaryCta}</Link>
            </Button>
          </div>
          <p className="mt-10 text-[0.7rem] uppercase tracking-[0.2em] text-foreground/40">
            {c.hero.imageCredit}
          </p>
        </div>
      </section>

      {/* Personal invitation */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <Eyebrow>{c.invitation.eyebrow}</Eyebrow>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {c.invitation.title}
            </h2>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-muted-foreground">
              {c.invitation.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <p className="mt-8 text-sm font-medium tracking-wide text-foreground/70">
              {c.invitation.signature}
            </p>
          </div>
          <div className="relative">
            <img
              src={INVITATION_IMAGE}
              alt="A car parked beside an open road on a long-distance journey"
              className="aspect-[4/3] w-full rounded-3xl object-cover shadow-2xl shadow-black/40 ring-1 ring-white/10"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Journalist freedom */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-28">
          <Eyebrow>{c.freedom.eyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl">
            {c.freedom.title}
          </h2>
          <div className="mt-6 space-y-2 text-xl font-medium tracking-tight text-foreground/85 sm:text-2xl">
            {c.freedom.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">{c.freedom.body}</p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {c.freedom.items.map((item) => (
              <article key={item.title} className="rounded-3xl border border-white/10 bg-background/40 p-6">
                <CheckCircle2 className="size-5 text-teal" />
                <h3 className="mt-4 text-base font-semibold uppercase tracking-[0.12em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>


      {/* How it works */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-28">
          <Eyebrow>{c.steps.eyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {c.steps.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{c.steps.intro}</p>
          <ol className="mt-14 grid gap-x-12 gap-y-11 sm:grid-cols-2 lg:grid-cols-3">
            {c.steps.items.map((step) => (
              <li key={step.number} className="border-t border-white/10 pt-6">
                <span className="text-sm font-semibold tracking-[0.2em] text-primary">{step.number}</span>
                <h3 className="mt-3 text-lg font-semibold uppercase tracking-wide text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Not a separate calculator */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <div>
            <Eyebrow>{c.notCalculator.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {c.notCalculator.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">{c.notCalculator.body}</p>
            <p className="mt-6 text-base font-medium text-teal">{c.notCalculator.footnote}</p>
          </div>
          <ul className="space-y-3">
            {c.notCalculator.flow.map((item, i) => (
              <li
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-foreground/90">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Journey selection */}
      <section className="relative isolate overflow-hidden border-y border-white/10">
        <img
          src={ROAD_IMAGE}
          alt="An open road stretching through dramatic scenery"
          className="absolute inset-0 -z-10 size-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 -z-10 bg-[rgba(10,15,29,0.9)]" />
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-28">
          <Eyebrow>{c.journey.eyebrow}</Eyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {c.journey.title}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70">{c.journey.intro}</p>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {c.journey.options.map((opt) => (
              <article
                key={opt.title}
                className="glass-panel rounded-3xl p-8 transition-colors hover:border-primary/40"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  {opt.label}
                </span>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{opt.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-foreground/75">{opt.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {opt.bullets.map((b) => (
                    <span
                      key={b}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-foreground/80"
                    >
                      <MapPin className="size-3.5 text-teal" />
                      {b}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicles */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-28">
        <Eyebrow>{c.vehicles.eyebrow}</Eyebrow>
        <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {c.vehicles.title}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">{c.vehicles.intro}</p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {c.vehicles.items.map((v) => (
            <figure key={v.label} className="group overflow-hidden rounded-3xl ring-1 ring-white/10">
              <div className="relative">
                <img
                  src={v.image}
                  alt={v.alt}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,15,29,0.95)] via-[rgba(10,15,29,0.25)] to-transparent" />
              </div>
              <figcaption className="bg-white/[0.03] px-6 pb-7 pt-5">
                <h3 className="text-lg font-semibold uppercase tracking-[0.14em] text-foreground">
                  {v.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* EV comparison + prediction vs reality */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 py-24 sm:px-8 md:py-28 lg:grid-cols-2 lg:gap-16">
          <div>
            <Eyebrow>{c.evCompare.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {c.evCompare.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{c.evCompare.body}</p>
            <div className="mt-8 rounded-3xl border border-white/10 bg-background/60 p-7">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-foreground/45">
                {c.evCompare.exampleLabel}
              </p>
              <div className="mt-5 space-y-4">
                {c.evCompare.rows.map((row) => (
                  <div key={row.label} className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{row.label}</p>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{row.sub}</p>
                    </div>
                    <p className="text-2xl font-semibold tabular-nums text-foreground">{money(row.amountEur)}</p>
                  </div>
                ))}
                <div className="flex items-end justify-between gap-4 pt-1">
                  <p className="text-sm font-medium uppercase tracking-wide text-teal">
                    {c.evCompare.differenceLabel}
                  </p>
                  <p className="text-3xl font-semibold tabular-nums text-teal">
                    {money(c.evCompare.differenceAmountEur)}
                  </p>
                </div>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">{c.evCompare.caveat}</p>
            </div>
          </div>

          <div>
            <Eyebrow>{c.reality.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {c.reality.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{c.reality.body}</p>
            <div className="mt-8 rounded-3xl border border-primary/25 bg-primary/[0.06] p-7">
              <p className="text-[0.68rem] uppercase tracking-[0.18em] text-foreground/45">
                {c.reality.exampleLabel}
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {[
                  { label: c.reality.calculation.label, text: money(c.reality.calculation.amountEur) },
                  { label: c.reality.actual.label, text: money(c.reality.actual.amountEur) },
                  { label: c.reality.difference.label, text: c.reality.difference.value },
                ].map((cell, i) => (
                  <div key={cell.label}>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{cell.label}</p>
                    <p
                      className={`mt-2 text-3xl font-semibold tabular-nums ${
                        i === 2 ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {cell.text}
                    </p>
                  </div>
                ))}
              </div>
              <p className="mt-7 text-xs leading-relaxed text-muted-foreground">{c.reality.caveat}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge report */}
      <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <Eyebrow>{c.report.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {c.report.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{c.report.body}</p>
            <p className="mt-5 text-sm leading-relaxed text-foreground/60">{c.report.future}</p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="mt-8 rounded-full border-primary/40 px-6 text-sm font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary/10"
            >
              <Link to="/planner">
                {c.report.cta}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <p className="mt-4 max-w-md text-xs leading-relaxed text-muted-foreground">{c.report.ctaNote}</p>
          </div>
          <ul className="grid grid-cols-2 gap-3 self-start">
            {c.report.contents.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2.5 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-foreground/85"
              >
                <CheckCircle2 className="size-4 shrink-0 text-teal" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Founder story */}
      <section className="border-t border-white/10">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 py-24 sm:px-8 md:py-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <Eyebrow>{c.founder.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {c.founder.title}
            </h2>
            <p className="mt-8 text-xl leading-relaxed text-foreground/90 sm:text-2xl">
              {c.founder.opening}
            </p>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted-foreground">
              {c.founder.paragraphs.map((p) => (
                <p key={p}>{emphasise(p, c.founder.emphasis)}</p>
              ))}
            </div>
            <div className="mt-10 space-y-5 border-l border-primary/40 pl-6 text-base leading-relaxed text-foreground/85">
              {c.founder.closing.map((p) => (
                <p key={p}>{emphasise(p, c.founder.emphasis)}</p>
              ))}
            </div>
          </div>
          <figure className="lg:sticky lg:top-28 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02]">
              <img
                src={FOUNDER_PHOTO_URL}
                alt={c.founder.alt}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover object-top"
              />
            </div>
            <figcaption className="mt-5 text-sm text-foreground/80">
              <span className="font-medium text-foreground">{c.founder.name}</span>
              <span className="mt-1 block text-muted-foreground">{c.founder.role}</span>
              <span className="mt-3 block text-xs italic text-muted-foreground">{c.founder.note}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Press registration */}
      <section id="register" className="border-y border-white/10 bg-white/[0.02] scroll-mt-24">
        <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 py-24 sm:px-8 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <Eyebrow>{c.register.eyebrow}</Eyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {c.register.title}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground">{c.register.body}</p>
            <p className="mt-6 text-sm leading-relaxed text-foreground/60">{c.register.note}</p>
          </div>

          {sent ? (
            <div className="glass-panel flex flex-col justify-center rounded-3xl p-9">
              <CheckCircle2 className="size-8 text-teal" />
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                {c.register.successTitle}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{c.register.successBody}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="glass-panel rounded-3xl p-7 sm:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                {(
                  [
                    ["name", "text", true],
                    ["email", "email", true],
                    ["outlet", "text", true],
                    ["role", "text", false],
                    ["country", "text", false],
                  ] as const
                ).map(([key, type, required]) => (
                  <label key={key} className={key === "outlet" ? "sm:col-span-2" : undefined}>
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-foreground/60">
                      {c.register.fields[key]}
                    </span>
                    <input
                      name={key}
                      type={type}
                      required={required}
                      placeholder={c.register.placeholders[key]}
                      className="mt-2 w-full rounded-xl border border-white/15 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-primary/60"
                    />
                  </label>
                ))}
                <label className="sm:col-span-2">
                  <span className="text-xs font-medium uppercase tracking-[0.14em] text-foreground/60">
                    {c.register.fields.message}
                  </span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={c.register.placeholders.message}
                    className="mt-2 w-full resize-none rounded-xl border border-white/15 bg-background/50 px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-primary/60"
                  />
                </label>
              </div>
              <Button
                type="submit"
                size="lg"
                className="mt-7 w-full rounded-full text-sm font-semibold uppercase tracking-[0.12em]"
              >
                {c.register.submit}
              </Button>
            </form>
          )}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 py-24 text-center sm:px-8 md:py-32">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {c.finalCta.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {c.finalCta.body}
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-7 text-sm font-semibold uppercase tracking-[0.12em]">
            <a href="#register">{c.finalCta.primary}</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full border-white/25 px-7 text-sm font-semibold uppercase tracking-[0.12em]"
          >
            <Link to="/">{c.finalCta.secondary}</Link>
          </Button>
        </div>

        <div className="mt-16 border-t border-white/10 pt-8">
          <p className="text-xs uppercase tracking-[0.2em] text-foreground/45">{c.languageLabel}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Link
              to="/challenge"
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                base === "/challenge"
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-white/12 text-foreground/70 hover:text-foreground"
              }`}
            >
              🇬🇧 English
            </Link>
            {CHALLENGE_LANGS.map((l) => (
              <Link
                key={l.prefix}
                to="/challenge/$lang"
                params={{ lang: l.prefix }}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  lang === l.prefix
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-white/12 text-foreground/70 hover:text-foreground"
                }`}
              >
                {l.flag} {l.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
