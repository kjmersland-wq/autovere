import type { VehicleIntelligenceScore } from "@/data/vehicle-intelligence";
import type { UserPreferences } from "@/lib/personalization";
import { estimateAnnualChargingCost } from "@/data/ownership-tracking";

export type InsightType = "positive" | "warning" | "neutral" | "action";

export interface OwnershipInsight {
  id: string;
  type: InsightType;
  icon: "snowflake" | "zap" | "route" | "wallet" | "shield" | "trending-up" | "trending-down" | "users" | "map-pin" | "battery" | "alert";
  title: string;
  body: string;
  vehicleSlug?: string;
  actionLabel?: string;
  actionPath?: string;
  score?: number;
}

// ---------------------------------------------------------------------------
// Climate insights
// ---------------------------------------------------------------------------

function climateInsights(
  vehicle: VehicleIntelligenceScore,
  prefs: UserPreferences
): OwnershipInsight[] {
  const insights: OwnershipInsight[] = [];
  const { climate, country } = prefs;

  if ((climate === "arctic" || climate === "cold") && vehicle.winterSuitability >= 82) {
    insights.push({
      id: `winter-strong-${vehicle.slug}`,
      type: "positive",
      icon: "snowflake",
      title: "Strong winter suitability",
      body: `The ${vehicle.slug.replace(/-/g, " ")} scores ${vehicle.winterSuitability}/100 for winter — well above average for cold-climate drivers. Heat pump and battery thermal management are rated highly.`,
      vehicleSlug: vehicle.slug,
      score: vehicle.winterSuitability,
    });
  } else if ((climate === "arctic" || climate === "cold") && vehicle.winterSuitability < 72) {
    insights.push({
      id: `winter-warn-${vehicle.slug}`,
      type: "warning",
      icon: "snowflake",
      title: "Winter range considerations",
      body: `In ${climate === "arctic" ? "arctic" : "cold"} climates, this vehicle scores ${vehicle.winterSuitability}/100 on winter suitability. Expect range drops of 35–45% and slower DC charging in sub-zero temperatures.`,
      vehicleSlug: vehicle.slug,
      actionLabel: "See winter range data",
      actionPath: "/ev/news/real-world-winter-range-2025",
      score: vehicle.winterSuitability,
    });
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Charging insights
// ---------------------------------------------------------------------------

function chargingInsights(
  vehicle: VehicleIntelligenceScore,
  prefs: UserPreferences
): OwnershipInsight[] {
  const insights: OwnershipInsight[] = [];

  if (vehicle.chargingEcosystem >= 88) {
    insights.push({
      id: `charging-strong-${vehicle.slug}`,
      type: "positive",
      icon: "zap",
      title: "Class-leading charging speed",
      body: `This vehicle scores ${vehicle.chargingEcosystem}/100 on charging ecosystem — one of the fastest 10–80% sessions available. Ideal for regular long-distance routes.`,
      vehicleSlug: vehicle.slug,
      score: vehicle.chargingEcosystem,
    });
  } else if (vehicle.chargingEcosystem < 74 && prefs.drivingProfile === "touring") {
    insights.push({
      id: `charging-mismatch-${vehicle.slug}`,
      type: "warning",
      icon: "alert",
      title: "Charging may slow long trips",
      body: `With your touring driving profile, this vehicle's ${vehicle.chargingEcosystem}/100 charging score means noticeably longer motorway stops versus faster-charging alternatives. On a 600 km trip, expect 15–20 additional minutes.`,
      vehicleSlug: vehicle.slug,
      actionLabel: "Compare fastest-charging EVs",
      actionPath: "/ev/compare",
      score: vehicle.chargingEcosystem,
    });
  }

  if (prefs.chargingSetup === "public-only" && vehicle.chargingEcosystem < 80) {
    insights.push({
      id: `public-charging-warn-${vehicle.slug}`,
      type: "warning",
      icon: "zap",
      title: "Public-only charging: consider DC speed",
      body: "Without home charging, your total ownership cost is more sensitive to DC charging speed and network coverage. Vehicles with 150+ kW DC reduce reliance on long station dwell time.",
      vehicleSlug: vehicle.slug,
      actionLabel: "Home charging guide",
      actionPath: "/ev/news/home-charging-installation-guide-2025",
    });
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Motorway / road trip insights
// ---------------------------------------------------------------------------

function roadTripInsights(
  vehicle: VehicleIntelligenceScore,
  prefs: UserPreferences
): OwnershipInsight[] {
  const insights: OwnershipInsight[] = [];

  if (prefs.drivingProfile === "motorway" || prefs.drivingProfile === "touring") {
    if (vehicle.roadTripScore >= 88) {
      insights.push({
        id: `roadtrip-strong-${vehicle.slug}`,
        type: "positive",
        icon: "route",
        title: "Excellent road trip capability",
        body: `Road trip score: ${vehicle.roadTripScore}/100. This combination of real-world range, charging speed and motorway efficiency is among the best in the EV market.`,
        vehicleSlug: vehicle.slug,
        actionLabel: "Plan a route",
        actionPath: "/ev/route-planner",
        score: vehicle.roadTripScore,
      });
    } else if (vehicle.roadTripScore < 74) {
      insights.push({
        id: `roadtrip-warn-${vehicle.slug}`,
        type: "warning",
        icon: "route",
        title: "Road trip suitability below your driving profile",
        body: `Your motorway driving profile doesn't perfectly match this vehicle's road trip score of ${vehicle.roadTripScore}/100. Consider alternatives with 150+ kW DC and 450+ km real-world range for regular long trips.`,
        vehicleSlug: vehicle.slug,
        score: vehicle.roadTripScore,
      });
    }
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Family / urban insights
// ---------------------------------------------------------------------------

function lifestyleInsights(
  vehicle: VehicleIntelligenceScore,
  prefs: UserPreferences
): OwnershipInsight[] {
  const insights: OwnershipInsight[] = [];

  if (prefs.householdType === "family" && vehicle.familyPracticality >= 85) {
    insights.push({
      id: `family-strong-${vehicle.slug}`,
      type: "positive",
      icon: "users",
      title: "Strong family fit",
      body: `Family practicality score: ${vehicle.familyPracticality}/100. Cargo space, ISOFIX provision and rear comfort are all rated highly for family use.`,
      vehicleSlug: vehicle.slug,
      score: vehicle.familyPracticality,
    });
  }

  if (prefs.drivingProfile === "city" && vehicle.urbanSuitability >= 80) {
    insights.push({
      id: `urban-strong-${vehicle.slug}`,
      type: "positive",
      icon: "map-pin",
      title: "Well-suited for city driving",
      body: `Urban suitability: ${vehicle.urbanSuitability}/100. Compact footprint, one-pedal driving and good parking sensors make this a strong urban EV choice.`,
      vehicleSlug: vehicle.slug,
      score: vehicle.urbanSuitability,
    });
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Cost & value insights
// ---------------------------------------------------------------------------

function costInsights(
  vehicle: VehicleIntelligenceScore,
  prefs: UserPreferences
): OwnershipInsight[] {
  const insights: OwnershipInsight[] = [];

  if (vehicle.reliabilitySignal >= 85 && vehicle.maintenanceComplexity >= 83) {
    insights.push({
      id: `low-cost-${vehicle.slug}`,
      type: "positive",
      icon: "wallet",
      title: "Low long-term ownership cost",
      body: "High reliability and service simplicity scores indicate below-average annual maintenance costs. Service intervals are long and most updates arrive via OTA without dealer visits.",
      vehicleSlug: vehicle.slug,
      actionLabel: "TCO comparison",
      actionPath: "/ev/database",
    });
  }

  if (vehicle.maintenanceComplexity < 72) {
    insights.push({
      id: `maintenance-cost-${vehicle.slug}`,
      type: "neutral",
      icon: "wallet",
      title: "Factor in higher service costs",
      body: "This vehicle's maintenance complexity score suggests above-average annual service spend. Specialist servicing and complex technology mean budgeting €600–1,000/year for maintenance is realistic.",
      vehicleSlug: vehicle.slug,
    });
  }

  // Budget check
  if (prefs.annualKm > 20000 && vehicle.chargingEcosystem < 78) {
    insights.push({
      id: `high-mileage-cost-${vehicle.slug}`,
      type: "neutral",
      icon: "trending-up",
      title: "High mileage: charging efficiency matters",
      body: `At ${prefs.annualKm.toLocaleString()} km/year, a slower DC charging speed adds meaningful time cost to your journeys. A vehicle with 200+ kW DC saves approximately 25–40 hours of charging time annually.`,
      vehicleSlug: vehicle.slug,
      actionLabel: "Fastest-charging EVs",
      actionPath: "/ev/compare",
    });
  }

  return insights;
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export function generateOwnershipInsights(
  vehicles: VehicleIntelligenceScore[],
  prefs: UserPreferences,
  maxPerVehicle = 2
): OwnershipInsight[] {
  const all: OwnershipInsight[] = [];

  for (const vehicle of vehicles) {
    const vehicleInsights = [
      ...climateInsights(vehicle, prefs),
      ...chargingInsights(vehicle, prefs),
      ...roadTripInsights(vehicle, prefs),
      ...lifestyleInsights(vehicle, prefs),
      ...costInsights(vehicle, prefs),
    ];
    // Prioritise warnings then positives, cap per vehicle
    const sorted = [
      ...vehicleInsights.filter((i) => i.type === "warning"),
      ...vehicleInsights.filter((i) => i.type === "positive"),
      ...vehicleInsights.filter((i) => i.type === "action"),
      ...vehicleInsights.filter((i) => i.type === "neutral"),
    ].slice(0, maxPerVehicle);

    all.push(...sorted);
  }

  return all;
}

export function generateGarageInsights(
  vehicles: VehicleIntelligenceScore[],
  prefs: UserPreferences
): OwnershipInsight[] {
  if (vehicles.length === 0) return [];
  return generateOwnershipInsights(vehicles, prefs, 3);
}
