/**
 * Personalization Engine
 *
 * User preference types, localStorage persistence, relevance scoring.
 * Architecture is Supabase-ready — swap localStorage calls for DB reads
 * when auth is active without changing the hook API.
 */

export type ClimateProfile = "arctic" | "cold" | "temperate" | "warm";
export type DrivingProfile = "city" | "mixed" | "motorway" | "touring";
export type HouseholdType = "single" | "couple" | "family" | "business";
export type ChargingSetup = "home" | "workplace" | "public-only";

export interface UserPreferences {
  favoriteVehicles: string[];
  favoriteBrands: string[];
  favoriteNetworks: string[];
  climate: ClimateProfile;
  country: string;
  drivingProfile: DrivingProfile;
  householdType: HouseholdType;
  chargingSetup: ChargingSetup;
  annualKm: number;
  budgetEur: number;
  prioritizeWinter: boolean;
  prioritizeRange: boolean;
  prioritizeCharging: boolean;
  prioritizeFamily: boolean;
  prioritizeEfficiency: boolean;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  favoriteVehicles: [],
  favoriteBrands: [],
  favoriteNetworks: [],
  climate: "temperate",
  country: "DE",
  drivingProfile: "mixed",
  householdType: "couple",
  chargingSetup: "home",
  annualKm: 15000,
  budgetEur: 55000,
  prioritizeWinter: false,
  prioritizeRange: false,
  prioritizeCharging: false,
  prioritizeFamily: false,
  prioritizeEfficiency: true,
};

const PREFS_KEY = "autovere_user_preferences_v1";

export function loadPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    // localStorage full or unavailable — degrade silently
  }
}

export function patchPreferences(patch: Partial<UserPreferences>): UserPreferences {
  const current = loadPreferences();
  const updated = { ...current, ...patch };
  savePreferences(updated);
  return updated;
}

// ---------------------------------------------------------------------------
// Relevance scoring — adapt content ranking to user preferences
// ---------------------------------------------------------------------------

import type { ArticleData } from "@/data/articles";

const CLIMATE_WINTER_BOOST: Record<ClimateProfile, number> = {
  arctic: 40,
  cold: 25,
  temperate: 0,
  warm: -10,
};

const PROFILE_CHARGING_BOOST: Record<DrivingProfile, number> = {
  city: -5,
  mixed: 0,
  motorway: 15,
  touring: 20,
};

export function getPersonalizedArticleBoost(
  article: ArticleData,
  prefs: UserPreferences
): number {
  let boost = 0;

  // Climate-based winter relevance
  if (article.tags.some((t) => /winter|cold|heat pump|snow/i.test(t))) {
    boost += CLIMATE_WINTER_BOOST[prefs.climate];
  }

  // Driving profile boosts
  if (article.tags.some((t) => /charging|ionity|fastned|dc/i.test(t))) {
    boost += PROFILE_CHARGING_BOOST[prefs.drivingProfile];
  }
  if (article.tags.some((t) => /range|motorway|long.distance/i.test(t)) && prefs.drivingProfile === "touring") {
    boost += 20;
  }

  // Household preferences
  if (article.tags.some((t) => /family|suv|7.seat/i.test(t)) && prefs.householdType === "family") {
    boost += 15;
  }

  // Country boosts
  const countryMap: Record<string, string[]> = {
    DE: ["germany", "german"],
    NO: ["norway", "norwegian", "nordic"],
    FR: ["france", "french"],
    SE: ["sweden", "swedish", "nordic"],
    GB: ["uk", "britain", "british"],
  };
  const countryTags = countryMap[prefs.country] ?? [];
  if (article.tags.some((t) => countryTags.some((c) => t.toLowerCase().includes(c)))) {
    boost += 12;
  }

  // Favorite vehicle boost
  if (article.relatedVehicles.some((v) => prefs.favoriteVehicles.includes(v))) {
    boost += 25;
  }

  // Priority boosts
  if (prefs.prioritizeWinter && article.tags.some((t) => /winter|cold/i.test(t))) boost += 18;
  if (prefs.prioritizeRange && article.tags.some((t) => /range|wltp/i.test(t))) boost += 15;
  if (prefs.prioritizeCharging && article.tags.some((t) => /charging/i.test(t))) boost += 15;
  if (prefs.prioritizeFamily && article.tags.some((t) => /family|suv/i.test(t))) boost += 12;
  if (prefs.prioritizeEfficiency && article.tags.some((t) => /efficiency|tco|cost/i.test(t))) boost += 10;

  return boost;
}

// ---------------------------------------------------------------------------
// Personalized vehicle ranking (for homepage "Recommended for You")
// ---------------------------------------------------------------------------

import type { VehicleIntelligenceScore } from "@/data/vehicle-intelligence";

export function getPersonalizedVehicleScore(
  vehicle: VehicleIntelligenceScore,
  prefs: UserPreferences
): number {
  let score = vehicle.overallIntelligence * 0.5;

  if (prefs.climate === "arctic" || prefs.climate === "cold") {
    score += vehicle.winterSuitability * 0.25;
  } else {
    score += vehicle.winterSuitability * 0.05;
  }

  if (prefs.drivingProfile === "touring" || prefs.drivingProfile === "motorway") {
    score += vehicle.roadTripScore * 0.20;
    score += vehicle.motorwayEfficiency * 0.10;
  } else if (prefs.drivingProfile === "city") {
    score += vehicle.urbanSuitability * 0.20;
  }

  if (prefs.householdType === "family") {
    score += vehicle.familyPracticality * 0.15;
  }

  if (prefs.prioritizeCharging) {
    score += vehicle.chargingEcosystem * 0.15;
  }

  // Favorite vehicle direct boost
  if (prefs.favoriteVehicles.includes(vehicle.slug)) {
    score += 20;
  }

  return Math.min(100, Math.round(score));
}
