/** One-time passes: how many days of access a purchase gives, keyed by the internal price lookup key. */
export const PASS_DAYS: Record<string, number> = {
  trip_pass: 14,
  season_pass: 90,
};

export function passDays(priceKey: string): number | undefined {
  return PASS_DAYS[priceKey];
}
