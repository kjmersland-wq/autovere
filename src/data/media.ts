import { CARS } from "@/data/cars";
import {
  CURATED_ROW_TEXT,
  MEDIA_TEXT,
  TRUSTED_REVIEWER_TEXT,
} from "@/data/catalog-content";
import {
  resolveCatalogLang,
  resolveLocalizedList,
  resolveLocalizedString,
} from "@/data/localized";

export type Reviewer = {
  channel: string;
  handle: string;
  trust: "Most trusted" | "Trusted" | "Independent";
};

export type Video = {
  id: string;
  title: string;
  reviewer: Reviewer;
  duration?: string;
  category: "Featured" | "Winter" | "Long distance" | "Quiet luxury" | "Family" | "Comparison";
};

export type CarMedia = {
  carSlug: string;
  videos: Video[];
  consensus: string[];
  official: { label: string; href: string; kind: "site" | "configure" | "specs" | "test-drive" | "dealers" }[];
  trusted: { label: string; org: string; href: string }[];
};

type VideoMeta = Omit<Video, "title"> & { title: string };
type OfficialMeta = { href: string; kind: "site" | "configure" | "specs" | "test-drive" | "dealers" };
type TrustedMeta = { org: string; href: string };
type CarMediaMeta = {
  carSlug: string;
  videos: VideoMeta[];
  official: OfficialMeta[];
  trusted: TrustedMeta[];
};

const MEDIA_META: CarMediaMeta[] = [
  {
    carSlug: "polestar-3",
    videos: [
      { id: "Xx6S7uH8oTk", title: "Polestar 3 — Scandinavian calm, reviewed", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "16:24", category: "Featured" },
      { id: "9bZkp7q19f0", title: "Polestar 3 in winter — AWD on snow", reviewer: { channel: "Bjørn Nyland", handle: "@bjornnyland", trust: "Most trusted" }, duration: "22:08", category: "Winter" },
      { id: "ScMzIvxBSi4", title: "Polestar 3 long-distance road trip", reviewer: { channel: "Out of Spec Reviews", handle: "@outofspecreviews", trust: "Trusted" }, duration: "31:42", category: "Long distance" },
    ],
    official: [
      { href: "https://www.polestar.com/global/polestar-3/", kind: "site" },
      { href: "https://www.polestar.com/global/polestar-3/specs/", kind: "configure" },
      { href: "https://www.polestar.com/global/polestar-3/specs/", kind: "specs" },
      { href: "https://www.polestar.com/global/test-drive/", kind: "test-drive" },
    ],
    trusted: [
      { org: "Euro NCAP", href: "https://www.euroncap.com/en/results/polestar/3/" },
      { org: "Fastned", href: "https://support.fastned.nl/hc/en-gb" },
      { org: "Bjørn Nyland", href: "https://www.youtube.com/@bjornnyland" },
    ],
  },
  {
    carSlug: "bmw-i5",
    videos: [
      { id: "VYOjWnS4cMY", title: "BMW i5 — the executive EV, properly reviewed", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "18:51", category: "Featured" },
      { id: "Qm9VZ3W7gLM", title: "BMW i5 vs Mercedes EQE — long-distance test", reviewer: { channel: "Out of Spec Reviews", handle: "@outofspecreviews", trust: "Trusted" }, duration: "27:14", category: "Comparison" },
      { id: "pAgnJDJN4VA", title: "Inside the i5 — quiet luxury done right", reviewer: { channel: "Throttle House", handle: "@throttlehouse", trust: "Most trusted" }, duration: "14:09", category: "Quiet luxury" },
    ],
    official: [
      { href: "https://www.bmw.com/en/all-models/5-series/sedan/2023/bmw-i5-overview.html", kind: "site" },
      { href: "https://www.bmw.com/en/configurator.html", kind: "configure" },
      { href: "https://www.bmw.com/en/all-models/5-series/sedan/2023/bmw-i5-overview.html", kind: "specs" },
      { href: "https://www.bmw.com/en/test-drive.html", kind: "test-drive" },
      { href: "https://www.bmw.com/en/find-a-dealer.html", kind: "dealers" },
    ],
    trusted: [
      { org: "Euro NCAP", href: "https://www.euroncap.com/en/results/bmw/i5/" },
      { org: "NHTSA", href: "https://www.nhtsa.gov/" },
      { org: "Fastned", href: "https://support.fastned.nl/hc/en-gb" },
    ],
  },
  {
    carSlug: "volvo-ex90",
    videos: [
      { id: "T1XgFcitWcg", title: "Volvo EX90 — the family EV, reviewed honestly", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "21:03", category: "Featured" },
      { id: "Jw5Lh0M6r8I", title: "EX90 in Nordic winter — full test", reviewer: { channel: "Bjørn Nyland", handle: "@bjornnyland", trust: "Most trusted" }, duration: "29:57", category: "Winter" },
      { id: "kZxQv4EHs2g", title: "EX90 family road-trip review", reviewer: { channel: "Fully Charged Show", handle: "@fullychargedshow", trust: "Trusted" }, duration: "19:24", category: "Family" },
    ],
    official: [
      { href: "https://www.volvocars.com/intl/cars/ex90-electric/", kind: "site" },
      { href: "https://www.volvocars.com/intl/cars/ex90-electric/", kind: "configure" },
      { href: "https://www.volvocars.com/intl/cars/ex90-electric/specifications/", kind: "specs" },
      { href: "https://www.volvocars.com/intl/v/test-drive/", kind: "test-drive" },
      { href: "https://www.volvocars.com/intl/v/dealers/", kind: "dealers" },
    ],
    trusted: [
      { org: "Euro NCAP", href: "https://www.euroncap.com/en/results/volvo/ex90/" },
      { org: "NHTSA", href: "https://www.nhtsa.gov/" },
      { org: "Bjørn Nyland", href: "https://www.youtube.com/@bjornnyland" },
    ],
  },
  {
    carSlug: "mercedes-eqe",
    videos: [
      { id: "kXYiU_JCYtU", title: "Mercedes EQE — the quiet way to travel", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "17:42", category: "Featured" },
      { id: "L_jWHffIx5E", title: "EQE long-distance review", reviewer: { channel: "Out of Spec Reviews", handle: "@outofspecreviews", trust: "Trusted" }, duration: "24:19", category: "Long distance" },
    ],
    official: [
      { href: "https://www.mercedes-benz.com/en/vehicles/passenger-cars/eqe/", kind: "site" },
      { href: "https://www.mercedes-benz.com/en/configurator/", kind: "configure" },
      { href: "https://www.mercedes-benz.com/en/vehicles/passenger-cars/eqe/", kind: "specs" },
      { href: "https://www.mercedes-benz.com/en/test-drive/", kind: "test-drive" },
    ],
    trusted: [
      { org: "Euro NCAP", href: "https://www.euroncap.com/en/results/mercedes-benz/eqe/" },
      { org: "Fastned", href: "https://support.fastned.nl/hc/en-gb" },
    ],
  },
  {
    carSlug: "kia-ev9",
    videos: [
      { id: "qH8j4f0Oj9g", title: "Kia EV9 — the underestimated family flagship", reviewer: { channel: "Carwow", handle: "@carwow", trust: "Most trusted" }, duration: "20:38", category: "Featured" },
      { id: "fJ9rUzIMcZQ", title: "EV9 winter test — the truth about cold range", reviewer: { channel: "Bjørn Nyland", handle: "@bjornnyland", trust: "Most trusted" }, duration: "26:52", category: "Winter" },
      { id: "M7lc1UVf-VE", title: "EV9 family review — three rows, real space", reviewer: { channel: "Fully Charged Show", handle: "@fullychargedshow", trust: "Trusted" }, duration: "18:11", category: "Family" },
    ],
    official: [
      { href: "https://www.kia.com/worldwide/vehicles/ev9/", kind: "site" },
      { href: "https://www.kia.com/worldwide/vehicles/ev9/", kind: "configure" },
      { href: "https://www.kia.com/worldwide/vehicles/ev9/", kind: "specs" },
      { href: "https://www.kia.com/worldwide/dealers/", kind: "dealers" },
    ],
    trusted: [
      { org: "Euro NCAP", href: "https://www.euroncap.com/en/results/kia/ev9/" },
      { org: "Bjørn Nyland", href: "https://www.youtube.com/@bjornnyland" },
    ],
  },
];

const resolveMediaEntry = (meta: CarMediaMeta, lang: string): CarMedia => {
  const resolvedLang = resolveCatalogLang(lang);
  const localized = MEDIA_TEXT[meta.carSlug];

  return {
    carSlug: meta.carSlug,
    videos: meta.videos.map((video) => ({
      ...video,
      title: resolveLocalizedString(
        localized.videos[video.id],
        resolvedLang,
        `media.${meta.carSlug}.video.${video.id}`,
      ),
    })),
    consensus: resolveLocalizedList(
      localized.consensus,
      resolvedLang,
      `media.${meta.carSlug}.consensus`,
    ),
    official: meta.official.map((item) => ({
      ...item,
      label: resolveLocalizedString(
        localized.official[item.kind]!,
        resolvedLang,
        `media.${meta.carSlug}.official.${item.kind}`,
      ),
    })),
    trusted: meta.trusted.map((item, index) => ({
      ...item,
      label:
        resolveLocalizedList(
          localized.trusted,
          resolvedLang,
          `media.${meta.carSlug}.trusted`,
        )[index] ??
        resolveLocalizedList(localized.trusted, "en", `media.${meta.carSlug}.trusted.en`)[
          index
        ] ??
        item.org,
    })),
  };
};

export const getMediaEntries = (lang: string = "en"): CarMedia[] =>
  MEDIA_META.map((meta) => resolveMediaEntry(meta, lang));

export const MEDIA: CarMedia[] = getMediaEntries();

export const getMedia = (slug: string, lang: string = "en") => {
  const meta = MEDIA_META.find((media) => media.carSlug === slug);
  return meta ? resolveMediaEntry(meta, lang) : undefined;
};

export type CuratedRow = {
  title: string;
  subtitle: string;
  videos: (Video & { carSlug?: string })[];
};

const CURATED_ROW_META: Array<{ key: keyof typeof CURATED_ROW_TEXT; category: Video["category"] }> = [
  { key: "trending", category: "Featured" },
  { key: "winter", category: "Winter" },
  { key: "long", category: "Long distance" },
  { key: "luxury", category: "Quiet luxury" },
];

export const getCuratedRows = (lang: string = "en"): CuratedRow[] => {
  const resolvedLang = resolveCatalogLang(lang);
  const media = getMediaEntries(resolvedLang);

  return CURATED_ROW_META.map((row) => ({
    title: resolveLocalizedString(
      CURATED_ROW_TEXT[row.key].title,
      resolvedLang,
      `curated.${row.key}.title`,
    ),
    subtitle: resolveLocalizedString(
      CURATED_ROW_TEXT[row.key].subtitle,
      resolvedLang,
      `curated.${row.key}.subtitle`,
    ),
    videos: media.flatMap((item) =>
      item.videos
        .filter((video) => video.category === row.category)
        .map((video) => ({ ...video, carSlug: item.carSlug })),
    ),
  }));
};

export const CURATED_ROWS: CuratedRow[] = getCuratedRows();

export const getTrustedReviewers = (lang: string = "en") => {
  const resolvedLang = resolveCatalogLang(lang);
  const reviewers = [
    { name: "Carwow", handle: "@carwow", url: "https://www.youtube.com/@carwow" },
    { name: "Bjørn Nyland", handle: "@bjornnyland", url: "https://www.youtube.com/@bjornnyland" },
    { name: "Out of Spec Reviews", handle: "@outofspecreviews", url: "https://www.youtube.com/@outofspecreviews" },
    { name: "Throttle House", handle: "@throttlehouse", url: "https://www.youtube.com/@throttlehouse" },
    { name: "Fully Charged Show", handle: "@fullychargedshow", url: "https://www.youtube.com/@fullychargedshow" },
  ];

  return reviewers.map((reviewer) => ({
    ...reviewer,
    tagline: resolveLocalizedString(
      TRUSTED_REVIEWER_TEXT[reviewer.handle].tagline,
      resolvedLang,
      `reviewer.${reviewer.handle}.tagline`,
    ),
  }));
};

export const TRUSTED_REVIEWERS = getTrustedReviewers();

export const __mediaCarSlugs = CARS.map((c) => c.slug);
