/** When each loaded Norwegian toll dataset was last checked — kept beside the array so the estimator can show it. */
const asOfByDataset = new WeakMap<object, string>();

export function rememberTollAsOf(stations: object, asOf: string) {
  asOfByDataset.set(stations, asOf);
}

export function tollAsOf(stations: object | undefined): string | undefined {
  return stations ? asOfByDataset.get(stations) : undefined;
}
