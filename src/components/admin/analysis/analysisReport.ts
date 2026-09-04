import type { GlobalOverview, SiteBreakdown, MarketBreakdown, SubscriptionBreakdown, FinanceBreakdown, ExchangeRates } from "@/lib/admin-data.functions";
import type { AdminCurrency } from "@/components/admin/adminFormat";
import { formatAdminCurrency } from "@/components/admin/adminCurrency";
import { nf } from "@/components/admin/adminFormat";
import {
  computeTrend,
  sevenDayTrendFromDaily,
  ninetyDayRateTrend,
  TREND_LABEL_NO,
  formatPct,
  COUNTRIES_WITH_SITE,
  MIN_SAMPLE_7D,
  MIN_SAMPLE_30D,
  MIN_SAMPLE_MARKET_TOTAL,
  MARKET_DOMINANCE_PCT,
  MARKET_EVEN_MAX_PCT,
  UNCOVERED_MARKET_PCT,
  MIN_SAMPLE_SUBSCRIPTIONS,
  MIN_SAMPLE_MONTHLY_SUBS,
  CHURN_HIGH_PCT,
  CHURN_MODERATE_PCT,
  PLAN_CONCENTRATION_PCT,
  MANY_INSUFFICIENT_AREAS,
} from "@/components/admin/analysis/rules";

export type AnalysisAreaId = "trafikk" | "nettsteder" | "markeder" | "registreringer" | "abonnement" | "okonomi";

export type Finding = {
  id: string;
  area: AnalysisAreaId;
  /** The conclusion, in plain language — what the rule found. */
  headline: string;
  /** The measured numbers behind the conclusion, for display separation
   * (e.g. "156 besøk siste 7 dager (128 uken før)"). Purely additive/display
   * — does not change any threshold, classification, or computed value. */
  metric: string | null;
  recommendation: string | null;
  severity: "positive" | "neutral" | "warning" | "info";
};

export type AreaAnalysis = {
  area: AnalysisAreaId;
  title: string;
  findings: Finding[];
  insufficientNotes: string[];
};

export type AnalysisReport = {
  generatedAt: string;
  areas: AreaAnalysis[];
  unusualChanges: Finding[];
  followUps: Finding[];
  overallConclusion: string;
};

let idCounter = 0;
function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function trendFinding(
  area: AnalysisAreaId,
  scopeLabel: string,
  periodLabel: string,
  unitLabel: string,
  trend: ReturnType<typeof computeTrend>,
): { finding: Finding | null; note: string | null } {
  if (!trend.sufficient) {
    return { finding: null, note: `Ikke nok data til å vurdere ${periodLabel}-utvikling for ${scopeLabel} (krever et minimumsvolum i begge perioder).` };
  }
  const label = TREND_LABEL_NO[trend.classification];
  const headline = `${scopeLabel} har hatt ${label.toLowerCase()} i trafikk ${periodLabel} (${formatPct(trend.changePct)}).`;
  const metric = `${nf.format(trend.current)} ${unitLabel} (forrige periode: ${nf.format(trend.previous)})`;
  let recommendation: string | null = null;
  let severity: Finding["severity"] = "neutral";
  if (trend.classification === "strong_growth" || trend.classification === "growth") {
    recommendation = "Følg utviklingen og vurder om kapasitet/partneraktivitet bør økes.";
    severity = "positive";
  } else if (trend.classification === "decline" || trend.classification === "strong_decline") {
    recommendation = "Undersøk årsak (tekniske feil, sesongvariasjon, kampanjeslutt).";
    severity = "warning";
  }
  return { finding: { id: nextId(area), area, headline, metric, recommendation, severity }, note: null };
}

/* ------------------------------------------------------------------ */
/* B1 — Trafikk (globalt)                                              */
/* ------------------------------------------------------------------ */

export function analyzeTraffic(overview: GlobalOverview): AreaAnalysis {
  const findings: Finding[] = [];
  const insufficientNotes: string[] = [];

  const weekTrend = computeTrend(overview.traffic.last7, overview.traffic.prev7, MIN_SAMPLE_7D);
  const week = trendFinding("trafikk", "Total trafikk", "siste 7 dager", "besøk", weekTrend);
  if (week.finding) findings.push(week.finding);
  if (week.note) insufficientNotes.push(week.note);

  const rateTrend = ninetyDayRateTrend(overview.traffic.total90, overview.traffic.last30);
  const rate = trendFinding("trafikk", "Total trafikk", "siste 90 dager (daglig snittrate)", "besøk/30 dager", rateTrend);
  if (rate.finding) findings.push(rate.finding);
  if (rate.note) insufficientNotes.push(rate.note);

  return { area: "trafikk", title: "Trafikk", findings, insufficientNotes };
}

/* ------------------------------------------------------------------ */
/* B2 — AutoVere-nettsteder                                             */
/* ------------------------------------------------------------------ */

export function analyzeSites(siteBreakdown: SiteBreakdown): AreaAnalysis {
  const findings: Finding[] = [];
  const insufficientNotes: string[] = [];
  const activeSites = siteBreakdown.sites.filter((s) => s.visits90 > 0);
  let insufficientCount = 0;

  for (const site of activeSites) {
    const trend = sevenDayTrendFromDaily(site.daily);
    if (!trend.sufficient) {
      insufficientCount += 1;
      continue;
    }
    if (trend.classification === "stable") continue;
    const label = TREND_LABEL_NO[trend.classification];
    const headline = `${site.flag} ${site.label} har hatt ${label.toLowerCase()} i trafikk siste 7 dager (${formatPct(trend.changePct)}).`;
    const positive = trend.classification === "strong_growth" || trend.classification === "growth";
    findings.push({
      id: nextId("nettsteder"),
      area: "nettsteder",
      headline,
      metric: `${nf.format(trend.current)} besøk (forrige 7-dagersperiode: ${nf.format(trend.previous)})`,
      recommendation: positive
        ? `Følg utviklingen og vurder økt partneraktivitet/markedsføring på ${site.label}.`
        : `Undersøk årsak til nedgangen på ${site.label} snarest.`,
      severity: positive ? "positive" : "warning",
    });
  }

  if (insufficientCount > 0) {
    insufficientNotes.push(
      `Ikke nok data til å vurdere ukentlig utvikling for ${insufficientCount} av ${activeSites.length} nettsteder med trafikk (krever minst ${MIN_SAMPLE_7D} besøk i hver 7-dagersperiode).`,
    );
  }

  const leader = [...activeSites].sort((a, b) => b.visits90 - a.visits90)[0];
  if (leader) {
    findings.push({
      id: nextId("nettsteder"),
      area: "nettsteder",
      headline: `${leader.flag} ${leader.label} er AutoVere sitt mest besøkte nettsted siste 90 dager.`,
      metric: `${nf.format(leader.visits90)} besøk · ${leader.shareOfTotalPct} % av total trafikk`,
      recommendation: null,
      severity: "info",
    });
  }

  return { area: "nettsteder", title: "AutoVere-nettsteder", findings, insufficientNotes };
}

/* ------------------------------------------------------------------ */
/* B3 — Markeder/land                                                   */
/* ------------------------------------------------------------------ */

export function analyzeMarkets(marketBreakdown: MarketBreakdown): AreaAnalysis {
  const findings: Finding[] = [];
  const insufficientNotes: string[] = [];
  const total = marketBreakdown.regions.reduce((sum, r) => sum + r.views, 0);

  insufficientNotes.push(
    "Utvikling over tid per land («Sverige har økt X %» som besøkende-land) er ikke tilgjengelig — dagens data gir kun et øyeblikksbilde per land, ingen historisk serie.",
  );

  if (total < MIN_SAMPLE_MARKET_TOTAL) {
    insufficientNotes.push(`Ikke nok data til å vurdere markedsfordeling (krever minst ${MIN_SAMPLE_MARKET_TOTAL} besøk totalt, har ${total}).`);
    return { area: "markeder", title: "Markeder/land", findings, insufficientNotes };
  }

  const withPct = marketBreakdown.countries
    .filter((c) => c.country !== "Ukjent")
    .map((c) => ({ ...c, pct: Math.round((c.views / total) * 1000) / 10 }));
  const top = withPct[0];

  if (top && top.pct >= MARKET_DOMINANCE_PCT) {
    findings.push({
      id: nextId("markeder"),
      area: "markeder",
      headline: `${top.country} dominerer trafikken.`,
      metric: `${top.pct} % av total trafikk (${nf.format(top.views)} besøk)`,
      recommendation: "Vurder om avhengigheten av ett marked er en risiko.",
      severity: "warning",
    });
  } else if (!withPct.some((c) => c.pct > MARKET_EVEN_MAX_PCT)) {
    findings.push({
      id: nextId("markeder"),
      area: "markeder",
      headline: "Trafikken er jevnt fordelt mellom flere land.",
      metric: top ? `Største enkeltland: ${top.country} (${top.pct} %)` : null,
      recommendation: null,
      severity: "positive",
    });
  }

  for (const c of withPct) {
    if (c.pct >= UNCOVERED_MARKET_PCT && !COUNTRIES_WITH_SITE.has(c.country)) {
      findings.push({
        id: nextId("markeder"),
        area: "markeder",
        headline: `${c.country} gir betydelig trafikk uten et dedikert AutoVere-nettsted.`,
        metric: `${c.pct} % av total trafikk (${nf.format(c.views)} besøk)`,
        recommendation: "Vurder om et eget nettsted/marked bør etableres.",
        severity: "info",
      });
    }
  }

  return { area: "markeder", title: "Markeder/land", findings, insufficientNotes };
}

/* ------------------------------------------------------------------ */
/* B4 — Registreringer og konvertering                                  */
/* ------------------------------------------------------------------ */

export function analyzeRegistrations(overview: GlobalOverview): AreaAnalysis {
  const findings: Finding[] = [];
  const insufficientNotes = [
    "Ikke nok data til å beregne konverteringsrate — dagens datamodell kobler ikke besøk til registrering.",
    "Ikke nok data til å vurdere utvikling i registreringer — kun nåværende totaltall er tilgjengelig, ingen historikk.",
  ];

  if (overview.totalUsers !== null) {
    findings.push({
      id: nextId("registreringer"),
      area: "registreringer",
      headline: "Nåværende antall registrerte brukere (øyeblikksbilde).",
      metric: `${nf.format(overview.totalUsers)} registrerte brukere`,
      recommendation: null,
      severity: "info",
    });
  } else {
    insufficientNotes.push("Brukertall er ikke tilgjengelig for øyeblikket.");
  }

  return { area: "registreringer", title: "Registreringer og konvertering", findings, insufficientNotes };
}

/* ------------------------------------------------------------------ */
/* B5 — Abonnement                                                      */
/* ------------------------------------------------------------------ */

export function analyzeSubscriptions(sub: SubscriptionBreakdown): AreaAnalysis {
  const findings: Finding[] = [];
  const insufficientNotes: string[] = [];

  if (sub.pastDue >= 1) {
    findings.push({
      id: nextId("abonnement"),
      area: "abonnement",
      headline: "Abonnement med forfalt betaling krever oppfølging.",
      metric: `${nf.format(sub.pastDue)} abonnement`,
      recommendation: "Følg opp betalingsproblemer.",
      severity: "warning",
    });
  }

  if (sub.total < MIN_SAMPLE_SUBSCRIPTIONS) {
    insufficientNotes.push(`Ikke nok data til å vurdere kansellering/plansammensetning pålitelig (${sub.total} abonnement, krever minst ${MIN_SAMPLE_SUBSCRIPTIONS}).`);
  } else {
    const churnRate = Math.round((sub.canceled / sub.total) * 1000) / 10;
    if (churnRate > CHURN_HIGH_PCT) {
      findings.push({
        id: nextId("abonnement"),
        area: "abonnement",
        headline: "Høy kanselleringsrate.",
        metric: `${churnRate} % (${nf.format(sub.canceled)} av ${nf.format(sub.total)} abonnement)`,
        recommendation: "Undersøk årsaker (pris, produkt-fit, onboarding).",
        severity: "warning",
      });
    } else if (churnRate >= CHURN_MODERATE_PCT) {
      findings.push({
        id: nextId("abonnement"),
        area: "abonnement",
        headline: "Moderat kanselleringsrate.",
        metric: `${churnRate} %`,
        recommendation: null,
        severity: "neutral",
      });
    } else {
      findings.push({
        id: nextId("abonnement"),
        area: "abonnement",
        headline: "Sunn kanselleringsrate.",
        metric: `${churnRate} %`,
        recommendation: null,
        severity: "positive",
      });
    }

    const totalMrr = sub.byPlan.reduce((s, p) => s + p.mrr, 0);
    const topPlan = [...sub.byPlan].sort((a, b) => b.mrr - a.mrr)[0];
    if (topPlan && totalMrr > 0) {
      const pct = Math.round((topPlan.mrr / totalMrr) * 1000) / 10;
      if (pct >= PLAN_CONCENTRATION_PCT) {
        findings.push({
          id: nextId("abonnement"),
          area: "abonnement",
          headline: `Sterk avhengighet av ${topPlan.label}.`,
          metric: `${pct} % av MRR`,
          recommendation: "Vurder bredere plantilbud/oppsalg.",
          severity: "warning",
        });
      }
    }
  }

  if (sub.monthly.length >= 2) {
    const last = sub.monthly[sub.monthly.length - 1]!;
    const prev = sub.monthly[sub.monthly.length - 2]!;
    const trend = computeTrend(last.count, prev.count, MIN_SAMPLE_MONTHLY_SUBS);
    const result = trendFinding("abonnement", "Nye abonnement per måned", "måned-mot-måned", "nye abonnement", trend);
    if (result.finding) findings.push(result.finding);
    if (result.note) insufficientNotes.push(result.note);
  } else {
    insufficientNotes.push("Ikke nok historikk til å vurdere måned-mot-måned-utvikling i nye abonnement.");
  }

  return { area: "abonnement", title: "Abonnement", findings, insufficientNotes };
}

/* ------------------------------------------------------------------ */
/* B6 — Økonomi                                                         */
/* ------------------------------------------------------------------ */

export function analyzeFinance(
  finance: FinanceBreakdown,
  sub: SubscriptionBreakdown,
  currency: AdminCurrency,
  rates: ExchangeRates | null,
): AreaAnalysis {
  const fmt = (v: number) => formatAdminCurrency(v, currency, rates);
  const findings: Finding[] = [
    {
      id: nextId("okonomi"),
      area: "okonomi",
      headline: "Nåværende inntektsstatus (øyeblikksbilde).",
      metric: `MRR ${fmt(finance.mrr)} · ARR ${fmt(finance.arr)} · ARPU ${fmt(finance.arpu)}`,
      recommendation: null,
      severity: "info",
    },
  ];
  const insufficientNotes = [
    "Utvikling i MRR/ARR over tid er ikke tilgjengelig — ingen historisk serie er lagret, kun nåværende beløp.",
  ];

  if (sub.total >= MIN_SAMPLE_SUBSCRIPTIONS) {
    if (finance.churnRate > CHURN_HIGH_PCT) {
      findings.push({
        id: nextId("okonomi"),
        area: "okonomi",
        headline: "Høy kanselleringsrate påvirker inntekten.",
        metric: `${finance.churnRate} % churn`,
        recommendation: "Se Abonnement-analysen for oppfølgingspunkter.",
        severity: "warning",
      });
    }
  } else {
    insufficientNotes.push(`Ikke nok data til å vurdere økonomisk stabilitet pålitelig (${sub.total} abonnement, krever minst ${MIN_SAMPLE_SUBSCRIPTIONS}).`);
  }

  return { area: "okonomi", title: "Økonomi", findings, insufficientNotes };
}

/* ------------------------------------------------------------------ */
/* Composition                                                          */
/* ------------------------------------------------------------------ */

export function buildAnalysisReport(input: {
  overview: GlobalOverview;
  siteBreakdown: SiteBreakdown;
  marketBreakdown: MarketBreakdown;
  subscriptionBreakdown: SubscriptionBreakdown;
  financeBreakdown: FinanceBreakdown;
  currency: AdminCurrency;
  rates: ExchangeRates | null;
}): AnalysisReport {
  const areas: AreaAnalysis[] = [
    analyzeTraffic(input.overview),
    analyzeSites(input.siteBreakdown),
    analyzeMarkets(input.marketBreakdown),
    analyzeRegistrations(input.overview),
    analyzeSubscriptions(input.subscriptionBreakdown),
    analyzeFinance(input.financeBreakdown, input.subscriptionBreakdown, input.currency, input.rates),
  ];

  const allFindings = areas.flatMap((a) => a.findings);
  const unusualChanges = allFindings.filter(
    (f) => f.headline.includes("Sterk") || f.headline.includes("Kraftig") || f.severity === "warning",
  );
  const followUps = allFindings.filter((f) => f.severity === "warning");

  const insufficientAreaCount = areas.filter((a) => a.insufficientNotes.length > 0 && a.findings.length === 0).length;
  const growthCount = allFindings.filter((f) => f.severity === "positive").length;
  const warningCount = followUps.length;

  const conclusionParts: string[] = [];
  conclusionParts.push(
    `Analysen identifiserte ${growthCount} positive utviklingstrekk og ${warningCount} forhold som bør følges opp.`,
  );
  if (followUps.length > 0) {
    conclusionParts.push(`Bør følges opp: ${followUps.map((f) => f.headline).join(" ")}`);
  }
  if (insufficientAreaCount >= MANY_INSUFFICIENT_AREAS) {
    conclusionParts.push(
      `Datagrunnlaget er foreløpig tynt på ${insufficientAreaCount} område(r). Anbefaling: samle mer data over tid før konklusjoner trekkes der.`,
    );
  }

  return {
    generatedAt: new Date().toISOString(),
    areas,
    unusualChanges,
    followUps,
    overallConclusion: conclusionParts.join(" "),
  };
}
