/** Product events we measure. Kept explicit so Admin can label them. */
export type ProductEventName =
  | "calculate_clicked"
  | "trip_calculated"
  | "result_viewed"
  | "save_trip_clicked"
  | "export_gpx"
  | "export_pdf"
  | "pro_upgrade_clicked"
  | "challenge_apply_clicked"
  | "calculate_blocked"
  | "trip_failed"
  | "trip_pass_cta_clicked"
  | "share_trip_clicked"
  | "export_csv"
  | "actual_cost_submitted"
  | "challenge_cta_clicked";

/** Records one product event. Never throws — analytics must not break the app. */
export async function trackEvent(_name: ProductEventName, _metadata: Record<string, unknown> = {}) {
  /* tracking removed */
}
