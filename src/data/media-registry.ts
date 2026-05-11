/**
 * Legal Media Registry
 *
 * Centralized registry for all permitted image sources.
 * Zero tolerance for unlicensed or scraped imagery.
 * Every asset used in AUTOVERE must have an entry here.
 */

export type MediaLicense =
  | "oem-press-kit"        // OEM-issued press images — free to use with attribution for editorial
  | "unsplash"             // Unsplash License — free for editorial use with source credit
  | "cc0"                  // Creative Commons Zero — no rights reserved
  | "css-gradient"         // No image — CSS gradient placeholder, zero legal risk
  | "youtube-thumbnail"    // YouTube thumbnail — permitted only when embedding the video
  | "own-photography";     // AUTOVERE-owned imagery

export type MediaUsageContext = "article" | "ev-model" | "network" | "hero" | "card" | "og-image";

export interface MediaSource {
  id: string;
  name: string;
  homepage: string;
  license: MediaLicense;
  requiresAttribution: boolean;
  attributionFormat: string;
  allowsCommercialUse: boolean;
  allowsModification: boolean;
  maxResolutionPx?: number;
  notes?: string;
}

export const MEDIA_SOURCES: MediaSource[] = [
  {
    id: "tesla-press",
    name: "Tesla Press Media",
    homepage: "https://www.tesla.com/en_eu/presskit",
    license: "oem-press-kit",
    requiresAttribution: true,
    attributionFormat: "© Tesla, Inc. Press Kit",
    allowsCommercialUse: false,
    allowsModification: false,
    notes: "Editorial use only. Do not modify or remove watermarks.",
  },
  {
    id: "bmw-press",
    name: "BMW Group PressClub",
    homepage: "https://www.press.bmwgroup.com",
    license: "oem-press-kit",
    requiresAttribution: true,
    attributionFormat: "© BMW AG Press",
    allowsCommercialUse: false,
    allowsModification: false,
  },
  {
    id: "hyundai-press",
    name: "Hyundai Media",
    homepage: "https://www.hyundainewsroom.com",
    license: "oem-press-kit",
    requiresAttribution: true,
    attributionFormat: "© Hyundai Motor Company",
    allowsCommercialUse: false,
    allowsModification: false,
  },
  {
    id: "polestar-press",
    name: "Polestar Media",
    homepage: "https://media.polestar.com",
    license: "oem-press-kit",
    requiresAttribution: true,
    attributionFormat: "© Polestar Automotive",
    allowsCommercialUse: false,
    allowsModification: false,
  },
  {
    id: "skoda-press",
    name: "Škoda Auto Press",
    homepage: "https://www.skoda-auto.com/company/press-center",
    license: "oem-press-kit",
    requiresAttribution: true,
    attributionFormat: "© Škoda Auto a.s.",
    allowsCommercialUse: false,
    allowsModification: false,
  },
  {
    id: "vw-press",
    name: "Volkswagen AG Press",
    homepage: "https://www.volkswagen-newsroom.com",
    license: "oem-press-kit",
    requiresAttribution: true,
    attributionFormat: "© Volkswagen AG",
    allowsCommercialUse: false,
    allowsModification: false,
  },
  {
    id: "ionity-press",
    name: "Ionity GmbH Press",
    homepage: "https://ionity.eu",
    license: "oem-press-kit",
    requiresAttribution: true,
    attributionFormat: "© Ionity GmbH Press Kit",
    allowsCommercialUse: false,
    allowsModification: false,
  },
  {
    id: "fastned-press",
    name: "Fastned Press",
    homepage: "https://fastned.nl",
    license: "oem-press-kit",
    requiresAttribution: true,
    attributionFormat: "© Fastned B.V.",
    allowsCommercialUse: false,
    allowsModification: false,
  },
  {
    id: "unsplash",
    name: "Unsplash",
    homepage: "https://unsplash.com",
    license: "unsplash",
    requiresAttribution: true,
    attributionFormat: "Photo by [Photographer] on Unsplash",
    allowsCommercialUse: true,
    allowsModification: true,
    notes: "Must not be sold as standalone image. Attribution strongly recommended.",
  },
  {
    id: "css-gradient",
    name: "CSS Gradient Placeholder",
    homepage: "",
    license: "css-gradient",
    requiresAttribution: false,
    attributionFormat: "",
    allowsCommercialUse: true,
    allowsModification: true,
    notes: "Zero legal risk. Use when no compliant image is available.",
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Video Thumbnail",
    homepage: "https://youtube.com",
    license: "youtube-thumbnail",
    requiresAttribution: true,
    attributionFormat: "Video: [Channel Name] on YouTube",
    allowsCommercialUse: false,
    allowsModification: false,
    notes: "Only permitted when the associated video is actively embedded on the same page.",
  },
];

export interface MediaAsset {
  id: string;
  sourceId: string;
  url: string;
  gradient: string;
  alt: string;
  attribution: string;
  license: MediaLicense;
  context: MediaUsageContext[];
  vehicleSlug?: string;
  networkSlug?: string;
  validated: boolean;
  addedAt: string;
}

export interface MediaValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateMediaAsset(asset: MediaAsset): MediaValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const source = MEDIA_SOURCES.find((s) => s.id === asset.sourceId);

  if (!source) errors.push(`Unknown source ID: ${asset.sourceId}`);
  if (!asset.alt || asset.alt.trim().length < 5) errors.push("alt text is missing or too short");
  if (!asset.gradient || !asset.gradient.startsWith("from-")) errors.push("gradient fallback is required");

  if (source?.requiresAttribution && !asset.attribution) {
    errors.push(`Source '${source.name}' requires attribution text`);
  }

  if (asset.url && asset.license === "css-gradient") {
    warnings.push("Asset has URL but license is css-gradient — review source assignment");
  }

  if (!asset.validated) warnings.push("Asset has not been manually validated");

  return { valid: errors.length === 0, errors, warnings };
}

export function getSourceById(id: string): MediaSource | undefined {
  return MEDIA_SOURCES.find((s) => s.id === id);
}

export function isSafeToUse(asset: MediaAsset): boolean {
  const { valid } = validateMediaAsset(asset);
  return valid;
}
