/**
 * Presentation-only helpers for the Analyse UI/PDF. These select and label
 * among the already-computed findings in an AnalysisReport — they never
 * introduce a new threshold, calculation, or data source. Purely about how
 * to headline and group results that analysisReport.ts already produced.
 */
import type { AnalysisReport, Finding } from "@/components/admin/analysis/analysisReport";

export type Tone = "positive" | "neutral" | "warning";

export type ReportSummary = {
  statusLabel: string;
  statusTone: Tone;
  topPositive: Finding | null;
  topFollowUp: Finding | null;
  dataQualityLabel: string;
  dataQualityTone: Tone;
  areasWithFindings: number;
  totalAreas: number;
  positiveCount: number;
  followUpCount: number;
};

function isStrong(f: Finding): boolean {
  return f.headline.includes("Sterk") || f.headline.includes("Kraftig") || f.headline.includes("Høy");
}

function pickHeadliner(findings: Finding[]): Finding | null {
  if (findings.length === 0) return null;
  return [...findings].sort((a, b) => Number(isStrong(b)) - Number(isStrong(a)))[0] ?? null;
}

export function summarizeReport(report: AnalysisReport): ReportSummary {
  const allFindings = report.areas.flatMap((a) => a.findings);
  const positiveCount = allFindings.filter((f) => f.severity === "positive").length;
  const followUpCount = report.followUps.length;

  let statusLabel: string;
  let statusTone: Tone;
  if (followUpCount === 0 && positiveCount > 0) {
    statusLabel = "God utvikling";
    statusTone = "positive";
  } else if (followUpCount === 0) {
    statusLabel = "Stabil drift";
    statusTone = "neutral";
  } else if (positiveCount >= followUpCount) {
    statusLabel = "Blandet bilde — noe å følge opp";
    statusTone = "neutral";
  } else {
    statusLabel = "Krever oppmerksomhet";
    statusTone = "warning";
  }

  const areasWithFindings = report.areas.filter((a) => a.findings.length > 0).length;
  const totalAreas = report.areas.length;
  let dataQualityLabel: string;
  let dataQualityTone: Tone;
  if (areasWithFindings >= totalAreas - 1) {
    dataQualityLabel = "Godt datagrunnlag";
    dataQualityTone = "positive";
  } else if (areasWithFindings >= totalAreas / 2) {
    dataQualityLabel = "Delvis datagrunnlag";
    dataQualityTone = "neutral";
  } else {
    dataQualityLabel = "Begrenset datagrunnlag ennå";
    dataQualityTone = "warning";
  }

  return {
    statusLabel,
    statusTone,
    topPositive: pickHeadliner(allFindings.filter((f) => f.severity === "positive")),
    topFollowUp: pickHeadliner(report.followUps),
    dataQualityLabel,
    dataQualityTone,
    areasWithFindings,
    totalAreas,
    positiveCount,
    followUpCount,
  };
}
