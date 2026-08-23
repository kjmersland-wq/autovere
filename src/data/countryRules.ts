export type CountryRule = {
  code: string;
  motorwayKmh: number;
  ruralKmh: number;
  urbanKmh: number;
  reflectiveVestPerPerson: boolean;
  warningTriangle: boolean;
  firstAidKit: boolean;
  alcoholLimit: string;
  environmentalSticker: string;
  daytimeLights: boolean;
};

const rule = (code: string, motorwayKmh: number, ruralKmh: number, urbanKmh: number, alcoholLimit: string, options: Partial<CountryRule> = {}): CountryRule => ({
  code,
  motorwayKmh,
  ruralKmh,
  urbanKmh,
  reflectiveVestPerPerson: true,
  warningTriangle: true,
  firstAidKit: true,
  alcoholLimit,
  environmentalSticker: "No national sticker; local zones may apply",
  daytimeLights: false,
  ...options,
});

export const countryRules: Record<string, CountryRule> = {
  AT: rule("AT", 130, 100, 50, "0.5 g/L", { environmentalSticker: "Required for some urban low-emission zones", daytimeLights: true }),
  BE: rule("BE", 120, 90, 50, "0.5 g/L", { environmentalSticker: "Local low-emission zones in Brussels, Antwerp and Ghent" }),
  BG: rule("BG", 140, 90, 50, "0.5 g/L", { daytimeLights: true }),
  CH: rule("CH", 120, 80, 50, "0.5 g/L", { environmentalSticker: "Motorway vignette required; local environmental rules may apply", firstAidKit: false }),
  CZ: rule("CZ", 130, 90, 50, "0.0 g/L", { daytimeLights: true }),
  DE: rule("DE", 130, 100, 50, "0.5 g/L", { environmentalSticker: "Umweltplakette required in designated German cities" }),
  DK: rule("DK", 130, 80, 50, "0.5 g/L", { daytimeLights: true, firstAidKit: false }),
  EE: rule("EE", 110, 90, 50, "0.2 g/L", { daytimeLights: true }),
  ES: rule("ES", 120, 90, 50, "0.5 g/L", { daytimeLights: true }),
  FI: rule("FI", 120, 100, 50, "0.5 g/L", { daytimeLights: true }),
  FR: rule("FR", 130, 80, 50, "0.5 g/L", { environmentalSticker: "Crit'Air required in designated low-emission zones", daytimeLights: true }),
  GR: rule("GR", 130, 90, 50, "0.5 g/L", { daytimeLights: true }),
  HR: rule("HR", 130, 90, 50, "0.5 g/L", { daytimeLights: true }),
  HU: rule("HU", 130, 90, 50, "0.0 g/L", { daytimeLights: true }),
  IE: rule("IE", 120, 100, 50, "0.5 g/L", { firstAidKit: false }),
  IT: rule("IT", 130, 90, 50, "0.5 g/L", { daytimeLights: true }),
  LT: rule("LT", 130, 90, 50, "0.4 g/L", { daytimeLights: true }),
  LU: rule("LU", 130, 90, 50, "0.5 g/L", { firstAidKit: false }),
  LV: rule("LV", 110, 90, 50, "0.5 g/L", { daytimeLights: true }),
  NL: rule("NL", 100, 80, 50, "0.5 g/L", { environmentalSticker: "Local low-emission zones; check before entering city centres" }),
  NO: rule("NO", 110, 80, 50, "0.2 g/L", { daytimeLights: true }),
  PL: rule("PL", 140, 90, 50, "0.2 g/L", { daytimeLights: true }),
  PT: rule("PT", 120, 90, 50, "0.5 g/L", { daytimeLights: true }),
  RO: rule("RO", 130, 90, 50, "0.0 g/L", { daytimeLights: true }),
  SE: rule("SE", 120, 80, 50, "0.2 g/L", { daytimeLights: true, firstAidKit: false }),
  SI: rule("SI", 130, 90, 50, "0.5 g/L", { daytimeLights: true }),
  SK: rule("SK", 130, 90, 50, "0.0 g/L", { daytimeLights: true }),
  UA: rule("UA", 130, 90, 50, "0.2 g/L", { daytimeLights: true }),
  GB: rule("GB", 112, 96, 48, "0.8 g/L", { reflectiveVestPerPerson: false, warningTriangle: false, firstAidKit: false }),
};

export const fallbackCountryRule: CountryRule = rule("EU", 130, 90, 50, "Check local limit", { reflectiveVestPerPerson: false, warningTriangle: false, firstAidKit: false });

export function getCountryRule(code: string): CountryRule {
  return countryRules[code] ?? { ...fallbackCountryRule, code };
}
