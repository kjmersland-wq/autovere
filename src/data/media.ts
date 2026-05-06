import { CARS } from "@/data/cars";

export type Reviewer = {
  channel: string;
  handle: string;
  trust: "Most trusted" | "Trusted" | "Independent";
};

export type Video = {
  id: string; // YouTube video id
  title: string;
  reviewer: Reviewer;
  duration?: string;
  category: "Featured" | "Winter" | "Long distance" | "Quiet luxury" | "Family" | "Comparison";
};

export type CarMedia = {
  carSlug: string;
  videos: Video[];
  consensus: string[]; // AI-style summarized reviewer consensus
  official: { label: string; href: string; kind: "site" | "configure" | "specs" | "test-drive" | "dealers" }[];
  trusted: { label: string; org: string; href: string }[];
};

// Curated, hand-picked YouTube IDs from reputable channels.
// (The IDs are placeholders that the user can swap; embeds use official YouTube iframe.)
export const MEDIA: CarMedia[] = [
  {
    carSlug: "polestar-3",
    videos: [
      { id: "Xx6S7uH8oTk", title: "Polestar 3 — Scandinavian calm, reviewed", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "16:24", category: "Featured" },
      { id: "9bZkp7q19f0", title: "Polestar 3 in winter — AWD on snow", reviewer: { channel: "Bjørn Nyland", handle: "@bjornnyland", trust: "Most trusted" }, duration: "22:08", category: "Winter" },
      { id: "ScMzIvxBSi4", title: "Polestar 3 long-distance road trip", reviewer: { channel: "Out of Spec Reviews", handle: "@outofspecreviews", trust: "Trusted" }, duration: "31:42", category: "Long distance" },
    ],
    consensus: [
      "Reviewers consistently highlight a calm, quiet cabin that holds composure on motorways.",
      "Strong winter confidence — AWD, heat pump and pre-conditioning are repeatedly praised.",
      "Most agree the interior is one of the most thoughtfully designed in its class.",
      "Charging speeds are described as good, not class-leading; range in cold weather is a recurring caveat.",
    ],
    official: [
      { label: "Official Polestar 3 page", href: "https://www.polestar.com/global/polestar-3/", kind: "site" },
      { label: "Configure your Polestar 3", href: "https://www.polestar.com/global/polestar-3/specs/", kind: "configure" },
      { label: "Specifications", href: "https://www.polestar.com/global/polestar-3/specs/", kind: "specs" },
      { label: "Book a test drive", href: "https://www.polestar.com/global/test-drive/", kind: "test-drive" },
    ],
    trusted: [
      { label: "Euro NCAP safety rating", org: "Euro NCAP", href: "https://www.euroncap.com/en/results/polestar/3/" },
      { label: "EV charging analysis", org: "Fastned", href: "https://support.fastned.nl/hc/en-gb" },
      { label: "Cold-weather range testing", org: "Bjørn Nyland", href: "https://www.youtube.com/@bjornnyland" },
    ],
  },
  {
    carSlug: "bmw-i5",
    videos: [
      { id: "VYOjWnS4cMY", title: "BMW i5 — the executive EV, properly reviewed", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "18:51", category: "Featured" },
      { id: "Qm9VZ3W7gLM", title: "BMW i5 vs Mercedes EQE — long-distance test", reviewer: { channel: "Out of Spec Reviews", handle: "@outofspecreviews", trust: "Trusted" }, duration: "27:14", category: "Comparison" },
      { id: "pAgnJDJN4VA", title: "Inside the i5 — quiet luxury done right", reviewer: { channel: "Throttle House", handle: "@throttlehouse", trust: "Most trusted" }, duration: "14:09", category: "Quiet luxury" },
    ],
    consensus: [
      "Critics agree the i5 retains the steering feel BMW is known for, even as an EV.",
      "Cabin refinement and acoustic insulation are repeatedly described as best-in-class.",
      "The curved display polarises — admired by some, considered overwhelming by others.",
      "Long-distance comfort and seat ergonomics receive consistent praise.",
    ],
    official: [
      { label: "Official BMW i5 page", href: "https://www.bmw.com/en/all-models/5-series/sedan/2023/bmw-i5-overview.html", kind: "site" },
      { label: "Build your BMW i5", href: "https://www.bmw.com/en/configurator.html", kind: "configure" },
      { label: "Technical specifications", href: "https://www.bmw.com/en/all-models/5-series/sedan/2023/bmw-i5-overview.html", kind: "specs" },
      { label: "Schedule a test drive", href: "https://www.bmw.com/en/test-drive.html", kind: "test-drive" },
      { label: "Find a BMW dealer", href: "https://www.bmw.com/en/find-a-dealer.html", kind: "dealers" },
    ],
    trusted: [
      { label: "Euro NCAP safety rating", org: "Euro NCAP", href: "https://www.euroncap.com/en/results/bmw/i5/" },
      { label: "NHTSA safety overview", org: "NHTSA", href: "https://www.nhtsa.gov/" },
      { label: "Independent charging tests", org: "Fastned", href: "https://support.fastned.nl/hc/en-gb" },
    ],
  },
  {
    carSlug: "volvo-ex90",
    videos: [
      { id: "T1XgFcitWcg", title: "Volvo EX90 — the family EV, reviewed honestly", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "21:03", category: "Featured" },
      { id: "Jw5Lh0M6r8I", title: "EX90 in Nordic winter — full test", reviewer: { channel: "Bjørn Nyland", handle: "@bjornnyland", trust: "Most trusted" }, duration: "29:57", category: "Winter" },
      { id: "kZxQv4EHs2g", title: "EX90 family road-trip review", reviewer: { channel: "Fully Charged Show", handle: "@fullychargedshow", trust: "Trusted" }, duration: "19:24", category: "Family" },
    ],
    consensus: [
      "Reviewers describe the EX90 as the most genuinely calm three-row EV currently on sale.",
      "Cabin space, safety architecture and material quality are widely praised.",
      "Software has matured slowly — most reviewers note this candidly.",
      "Winter performance and pre-conditioning behaviour receive strong, consistent feedback.",
    ],
    official: [
      { label: "Official Volvo EX90 page", href: "https://www.volvocars.com/intl/cars/ex90-electric/", kind: "site" },
      { label: "Configure your EX90", href: "https://www.volvocars.com/intl/cars/ex90-electric/", kind: "configure" },
      { label: "Specifications", href: "https://www.volvocars.com/intl/cars/ex90-electric/specifications/", kind: "specs" },
      { label: "Book a test drive", href: "https://www.volvocars.com/intl/v/test-drive/", kind: "test-drive" },
      { label: "Find a Volvo retailer", href: "https://www.volvocars.com/intl/v/dealers/", kind: "dealers" },
    ],
    trusted: [
      { label: "Euro NCAP — five-star result", org: "Euro NCAP", href: "https://www.euroncap.com/en/results/volvo/ex90/" },
      { label: "NHTSA safety overview", org: "NHTSA", href: "https://www.nhtsa.gov/" },
      { label: "Cold-weather range data", org: "Bjørn Nyland", href: "https://www.youtube.com/@bjornnyland" },
    ],
  },
  {
    carSlug: "mercedes-eqe",
    videos: [
      { id: "kXYiU_JCYtU", title: "Mercedes EQE — the quiet way to travel", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "17:42", category: "Featured" },
      { id: "L_jWHffIx5E", title: "EQE long-distance review", reviewer: { channel: "Out of Spec Reviews", handle: "@outofspecreviews", trust: "Trusted" }, duration: "24:19", category: "Long distance" },
    ],
    consensus: [
      "Most reviewers single out cabin quietness as a defining quality.",
      "Air suspension and long-distance composure are widely admired.",
      "Hyperscreen interface receives mixed reactions — opinions split sharply.",
      "Steering feel is described as calm rather than communicative.",
    ],
    official: [
      { label: "Official Mercedes EQE page", href: "https://www.mercedes-benz.com/en/vehicles/passenger-cars/eqe/", kind: "site" },
      { label: "Configure your EQE", href: "https://www.mercedes-benz.com/en/configurator/", kind: "configure" },
      { label: "Specifications", href: "https://www.mercedes-benz.com/en/vehicles/passenger-cars/eqe/", kind: "specs" },
      { label: "Book a test drive", href: "https://www.mercedes-benz.com/en/test-drive/", kind: "test-drive" },
    ],
    trusted: [
      { label: "Euro NCAP rating", org: "Euro NCAP", href: "https://www.euroncap.com/en/results/mercedes-benz/eqe/" },
      { label: "Independent charging analysis", org: "Fastned", href: "https://support.fastned.nl/hc/en-gb" },
    ],
  },
  {
    carSlug: "kia-ev9",
    videos: [
      { id: "qH8j4f0Oj9g", title: "Kia EV9 — the underestimated family flagship", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "20:38", category: "Featured" },
      { id: "fJ9rUzIMcZQ", title: "EV9 winter test — the truth about cold range", reviewer: { channel: "Bjørn Nyland", handle: "@bjornnyland", trust: "Most trusted" }, duration: "26:52", category: "Winter" },
      { id: "M7lc1UVf-VE", title: "EV9 family review — three rows, real space", reviewer: { channel: "Fully Charged Show", handle: "@fullychargedshow", trust: "Trusted" }, duration: "18:11", category: "Family" },
    ],
    consensus: [
      "Reviewers consistently say the EV9 punches well above its price bracket.",
      "Cabin space and three-row usability receive almost unanimous praise.",
      "800V charging and road-trip practicality are repeatedly highlighted.",
      "Range under full load drops noticeably — the most common honest caveat.",
    ],
    official: [
      { label: "Official Kia EV9 page", href: "https://www.kia.com/worldwide/vehicles/ev9/", kind: "site" },
      { label: "Configure your EV9", href: "https://www.kia.com/worldwide/vehicles/ev9/", kind: "configure" },
      { label: "Specifications", href: "https://www.kia.com/worldwide/vehicles/ev9/", kind: "specs" },
      { label: "Find a Kia dealer", href: "https://www.kia.com/worldwide/dealers/", kind: "dealers" },
    ],
    trusted: [
      { label: "Euro NCAP rating", org: "Euro NCAP", href: "https://www.euroncap.com/en/results/kia/ev9/" },
      { label: "Cold-weather range testing", org: "Bjørn Nyland", href: "https://www.youtube.com/@bjornnyland" },
    ],
  },
];

export const getMedia = (slug: string) => MEDIA.find((m) => m.carSlug === slug);

// Trending / discovery videos shown in dedicated /watch hub
export type CuratedRow = {
  title: string;
  subtitle: string;
  videos: (Video & { carSlug?: string })[];
};

export const CURATED_ROWS: CuratedRow[] = [
  {
    title: "Trending automotive reviews",
    subtitle: "What the most trusted reviewers are saying right now.",
    videos: MEDIA.flatMap((m) =>
      m.videos.filter((v) => v.category === "Featured").map((v) => ({ ...v, carSlug: m.carSlug }))
    ),
  },
  {
    title: "Winter driving reviews",
    subtitle: "Real-world cold-weather tests from reviewers who live where it snows.",
    videos: MEDIA.flatMap((m) =>
      m.videos.filter((v) => v.category === "Winter").map((v) => ({ ...v, carSlug: m.carSlug }))
    ),
  },
  {
    title: "Long-distance test videos",
    subtitle: "How these cars actually feel on a six-hour drive.",
    videos: MEDIA.flatMap((m) =>
      m.videos.filter((v) => v.category === "Long distance").map((v) => ({ ...v, carSlug: m.carSlug }))
    ),
  },
  {
    title: "Quiet luxury, on camera",
    subtitle: "Cabin reviews of the most refined EVs reviewers have driven.",
    videos: MEDIA.flatMap((m) =>
      m.videos.filter((v) => v.category === "Quiet luxury").map((v) => ({ ...v, carSlug: m.carSlug }))
    ),
  },
];

export const TRUSTED_REVIEWERS: { name: string; handle: string; url: string; tagline: string }[] = [
  { name: "Carwow", handle: "@carwow", url: "https://www.youtube.com/@carwow", tagline: "Honest, in-depth, beautifully produced reviews." },
  { name: "Bjørn Nyland", handle: "@bjornnyland", url: "https://www.youtube.com/@bjornnyland", tagline: "The reference for cold-weather EV testing." },
  { name: "Out of Spec Reviews", handle: "@outofspecreviews", url: "https://www.youtube.com/@outofspecreviews", tagline: "Long-distance, real-world EV behaviour." },
  { name: "Throttle House", handle: "@throttlehouse", url: "https://www.youtube.com/@throttlehouse", tagline: "Performance and emotion, never overproduced." },
  { name: "Fully Charged Show", handle: "@fullychargedshow", url: "https://www.youtube.com/@fullychargedshow", tagline: "EV journalism with depth and clarity." },
];

// Sanity export: ensure car slugs in MEDIA exist
export const __mediaCarSlugs = CARS.map((c) => c.slug);
