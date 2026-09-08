import type { ProductEventStats } from "@/lib/admin-data.functions";

/** Norwegian labels for the product events AutoVere records. */
export const EVENT_LABEL_NO: Record<string, string> = {
  calculate_clicked: "Beregn-knapp trykket",
  trip_calculated: "Reise beregnet",
  result_viewed: "Resultat vist",
  save_trip_clicked: "Lagre reise trykket",
  export_gpx: "Eksport GPX",
  export_pdf: "Eksport PDF",
  pro_upgrade_clicked: "Pro-oppgradering trykket",
  challenge_apply_clicked: "Challenge-søknad trykket",
};

export function eventLabel(name: string) {
  return EVENT_LABEL_NO[name] ?? name;
}

/** Deterministic, plain-language conclusions about the planner funnel.
 * Pure arithmetic on the measured counts — no AI, no invented numbers. */
export function funnelFindings(stats: ProductEventStats): { text: string; tone: "positive" | "warning" | "neutral" }[] {
  const f = stats.funnel;
  const out: { text: string; tone: "positive" | "warning" | "neutral" }[] = [];
  if (f.calculateClicked < 10) {
    out.push({
      text: `For lite datagrunnlag ennå — ${f.calculateClicked} beregninger startet siste 30 dager. Konklusjoner krever minst 10.`,
      tone: "neutral",
    });
    return out;
  }
  out.push({
    text: `${f.calcSuccessRate} % av startede beregninger ble fullført (${f.tripCalculated} av ${f.calculateClicked}).`,
    tone: f.calcSuccessRate >= 90 ? "positive" : f.calcSuccessRate >= 70 ? "neutral" : "warning",
  });
  out.push({
    text: `${f.resultViewRate} % av fullførte beregninger ble faktisk sett i resultatpanelet (${f.resultViewed} av ${f.tripCalculated}).`,
    tone: f.resultViewRate >= 90 ? "positive" : f.resultViewRate >= 70 ? "neutral" : "warning",
  });
  if (f.calcSuccessRate < 70) {
    out.push({
      text: "Anbefaling: mange beregninger fullføres ikke — se på stedssøk og feilmeldinger i planleggeren.",
      tone: "warning",
    });
  }
  return out;
}
