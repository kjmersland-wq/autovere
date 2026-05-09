import carSnow from "@/assets/car-snow.jpg";
import carSedan from "@/assets/car-sedan.jpg";
import carFamily from "@/assets/car-family.jpg";
import sceneNight from "@/assets/scene-night-drive.jpg";
import sceneNordic from "@/assets/scene-nordic.jpg";
import sceneRoad from "@/assets/scene-roadtrip.jpg";
import sceneQuiet from "@/assets/scene-quiet.jpg";
import sceneCity from "@/assets/scene-city.jpg";
import {
  CAR_TEXT,
  COLLECTION_TEXT,
  LEARN_CATEGORY_TEXT,
  LEARN_TEXT,
  PERSONALITY_TEXT,
} from "@/data/catalog-content";
import {
  resolveCatalogLang,
  resolveLocalizedList,
  resolveLocalizedString,
} from "@/data/localized";

export type Car = {
  slug: string;
  name: string;
  brand: string;
  type: string;
  tagline: string;
  fit: string;
  score: number;
  tag: string;
  hero: string;
  gallery: string[];
  summary: string;
  personality: string;
  comfort: string;
  climate: string;
  practicality: string;
  ownership: string;
  strengths: string[];
  tradeoffs: string[];
  lifestyle: string;
  range?: string;
  seats?: number;
  startingPrice?: string;
  drivetrain?: string;
  comparesWellWith: string[];
};

type CarMeta = {
  slug: string;
  brand: string;
  score: number;
  hero: string;
  gallery: string[];
  seats?: number;
  comparesWellWith: string[];
};

const CAR_META: CarMeta[] = [
  {
    slug: "polestar-3",
    brand: "Polestar",
    score: 96,
    hero: carSnow,
    gallery: [carSnow, sceneNordic, sceneQuiet],
    seats: 5,
    comparesWellWith: ["volvo-ex90", "bmw-i5"],
  },
  {
    slug: "bmw-i5",
    brand: "BMW",
    score: 93,
    hero: carSedan,
    gallery: [carSedan, sceneNight, sceneCity],
    seats: 5,
    comparesWellWith: ["mercedes-eqe", "polestar-3"],
  },
  {
    slug: "volvo-ex90",
    brand: "Volvo",
    score: 95,
    hero: carFamily,
    gallery: [carFamily, sceneRoad, sceneNordic],
    seats: 7,
    comparesWellWith: ["kia-ev9", "polestar-3"],
  },
  {
    slug: "mercedes-eqe",
    brand: "Mercedes-Benz",
    score: 91,
    hero: sceneQuiet,
    gallery: [sceneQuiet, sceneNight, carSedan],
    seats: 5,
    comparesWellWith: ["bmw-i5"],
  },
  {
    slug: "kia-ev9",
    brand: "Kia",
    score: 92,
    hero: sceneRoad,
    gallery: [sceneRoad, carFamily, sceneCity],
    seats: 7,
    comparesWellWith: ["volvo-ex90"],
  },
];

const resolveCar = (meta: CarMeta, lang: string): Car => {
  const resolvedLang = resolveCatalogLang(lang);
  const text = CAR_TEXT[meta.slug];
  const personalityNames = text.personalitySlugs
    .map((personalitySlug) => {
      const personality = PERSONALITY_TEXT[personalitySlug];
      if (!personality) return personalitySlug;
      return resolveLocalizedString(
        personality.name,
        resolvedLang,
        `personality.${personalitySlug}.name`,
      );
    })
    .join(" · ");

  return {
    ...meta,
    name: resolveLocalizedString(text.name, resolvedLang, `car.${meta.slug}.name`),
    type: resolveLocalizedString(text.type, resolvedLang, `car.${meta.slug}.type`),
    tagline: resolveLocalizedString(
      text.tagline,
      resolvedLang,
      `car.${meta.slug}.tagline`,
    ),
    fit: resolveLocalizedString(text.fit, resolvedLang, `car.${meta.slug}.fit`),
    tag: resolveLocalizedString(text.tag, resolvedLang, `car.${meta.slug}.tag`),
    summary: resolveLocalizedString(
      text.summary,
      resolvedLang,
      `car.${meta.slug}.summary`,
    ),
    personality: personalityNames,
    comfort: resolveLocalizedString(
      text.comfort,
      resolvedLang,
      `car.${meta.slug}.comfort`,
    ),
    climate: resolveLocalizedString(
      text.climate,
      resolvedLang,
      `car.${meta.slug}.climate`,
    ),
    practicality: resolveLocalizedString(
      text.practicality,
      resolvedLang,
      `car.${meta.slug}.practicality`,
    ),
    ownership: resolveLocalizedString(
      text.ownership,
      resolvedLang,
      `car.${meta.slug}.ownership`,
    ),
    strengths: resolveLocalizedList(
      text.strengths,
      resolvedLang,
      `car.${meta.slug}.strengths`,
    ),
    tradeoffs: resolveLocalizedList(
      text.tradeoffs,
      resolvedLang,
      `car.${meta.slug}.tradeoffs`,
    ),
    lifestyle: resolveLocalizedString(
      text.lifestyle,
      resolvedLang,
      `car.${meta.slug}.lifestyle`,
    ),
    range: text.range
      ? resolveLocalizedString(text.range, resolvedLang, `car.${meta.slug}.range`)
      : undefined,
    startingPrice: text.startingPrice
      ? resolveLocalizedString(
          text.startingPrice,
          resolvedLang,
          `car.${meta.slug}.startingPrice`,
        )
      : undefined,
    drivetrain: text.drivetrain
      ? resolveLocalizedString(
          text.drivetrain,
          resolvedLang,
          `car.${meta.slug}.drivetrain`,
        )
      : undefined,
  };
};

export const getCars = (lang: string = "en"): Car[] =>
  CAR_META.map((meta) => resolveCar(meta, lang));

export const CARS: Car[] = getCars();

export const getCar = (slug: string, lang: string = "en") => {
  const meta = CAR_META.find((car) => car.slug === slug);
  return meta ? resolveCar(meta, lang) : undefined;
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  image: string;
  body: string;
  cars: string[];
};

type CollectionMeta = {
  slug: string;
  image: string;
  cars: string[];
};

const COLLECTION_META: CollectionMeta[] = [
  { slug: "nordic-winters", image: carSnow, cars: ["polestar-3", "volvo-ex90", "kia-ev9"] },
  { slug: "quiet-luxury", image: sceneQuiet, cars: ["mercedes-eqe", "polestar-3", "bmw-i5"] },
  { slug: "long-distance-comfort", image: sceneRoad, cars: ["mercedes-eqe", "volvo-ex90", "bmw-i5"] },
  { slug: "underestimated", image: sceneCity, cars: ["kia-ev9", "polestar-3"] },
  { slug: "best-family-evs", image: carFamily, cars: ["volvo-ex90", "kia-ev9", "polestar-3"] },
  { slug: "city-life", image: sceneCity, cars: ["bmw-i5", "polestar-3"] },
  { slug: "lowest-ownership-stress", image: sceneNight, cars: ["polestar-3", "volvo-ex90", "kia-ev9"] },
  { slug: "reviewers-unexpectedly-loved", image: sceneRoad, cars: ["kia-ev9", "polestar-3", "bmw-i5"] },
  { slug: "calm-highway-cruisers", image: sceneRoad, cars: ["mercedes-eqe", "bmw-i5", "volvo-ex90"] },
  { slug: "winter-confidence", image: carSnow, cars: ["polestar-3", "volvo-ex90", "kia-ev9"] },
];

const resolveCollection = (meta: CollectionMeta, lang: string): Collection => {
  const resolvedLang = resolveCatalogLang(lang);
  const text = COLLECTION_TEXT[meta.slug];
  return {
    ...meta,
    title: resolveLocalizedString(
      text.title,
      resolvedLang,
      `collection.${meta.slug}.title`,
    ),
    description: resolveLocalizedString(
      text.description,
      resolvedLang,
      `collection.${meta.slug}.description`,
    ),
    body: resolveLocalizedString(
      text.body,
      resolvedLang,
      `collection.${meta.slug}.body`,
    ),
  };
};

export const getCollections = (lang: string = "en"): Collection[] =>
  COLLECTION_META.map((meta) => resolveCollection(meta, lang));

export const COLLECTIONS: Collection[] = getCollections();

export const getCollection = (slug: string, lang: string = "en") => {
  const meta = COLLECTION_META.find((collection) => collection.slug === slug);
  return meta ? resolveCollection(meta, lang) : undefined;
};

export type Personality = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  whoYouAre: string;
  whatYouValue: string[];
  matches: string[];
  prompt: string;
};

type PersonalityMeta = { slug: string; matches: string[] };

const PERSONALITY_META: PersonalityMeta[] = [
  { slug: "calm-explorer", matches: ["polestar-3", "volvo-ex90", "mercedes-eqe"] },
  { slug: "quiet-executive", matches: ["bmw-i5", "mercedes-eqe", "polestar-3"] },
  { slug: "weekend-escapist", matches: ["volvo-ex90", "kia-ev9", "polestar-3"] },
  { slug: "urban-minimalist", matches: ["bmw-i5", "polestar-3"] },
  { slug: "performance-romantic", matches: ["bmw-i5", "polestar-3"] },
  { slug: "nordic-adventurer", matches: ["volvo-ex90", "polestar-3", "kia-ev9"] },
];

const resolvePersonality = (meta: PersonalityMeta, lang: string): Personality => {
  const resolvedLang = resolveCatalogLang(lang);
  const text = PERSONALITY_TEXT[meta.slug];
  return {
    ...meta,
    name: resolveLocalizedString(
      text.name,
      resolvedLang,
      `personality.${meta.slug}.name`,
    ),
    tagline: resolveLocalizedString(
      text.tagline,
      resolvedLang,
      `personality.${meta.slug}.tagline`,
    ),
    description: resolveLocalizedString(
      text.description,
      resolvedLang,
      `personality.${meta.slug}.description`,
    ),
    whoYouAre: resolveLocalizedString(
      text.whoYouAre,
      resolvedLang,
      `personality.${meta.slug}.whoYouAre`,
    ),
    whatYouValue: resolveLocalizedList(
      text.whatYouValue,
      resolvedLang,
      `personality.${meta.slug}.whatYouValue`,
    ),
    prompt: resolveLocalizedString(
      text.prompt,
      resolvedLang,
      `personality.${meta.slug}.prompt`,
    ),
  };
};

export const getPersonalities = (lang: string = "en"): Personality[] =>
  PERSONALITY_META.map((meta) => resolvePersonality(meta, lang));

export const PERSONALITIES: Personality[] = getPersonalities();

export const getPersonality = (slug: string, lang: string = "en") => {
  const meta = PERSONALITY_META.find((personality) => personality.slug === slug);
  return meta ? resolvePersonality(meta, lang) : undefined;
};

export type LearnArticle = {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  category: string;
};

type LearnMeta = { slug: string };

const LEARN_META: LearnMeta[] = [
  { slug: "how-the-ai-works" },
  { slug: "how-recommendations-work" },
  { slug: "ev-explained-simply" },
  { slug: "suv-vs-crossover" },
  { slug: "winter-driving" },
  { slug: "compare-cars-intelligently" },
  { slug: "what-makes-a-car-feel-premium" },
  { slug: "how-comparisons-work" },
  { slug: "how-personalization-works" },
  { slug: "what-matters-in-pricing" },
];

const resolveLearnArticle = (meta: LearnMeta, lang: string): LearnArticle => {
  const resolvedLang = resolveCatalogLang(lang);
  const text = LEARN_TEXT[meta.slug];
  return {
    slug: meta.slug,
    title: resolveLocalizedString(text.title, resolvedLang, `learn.${meta.slug}.title`),
    excerpt: resolveLocalizedString(
      text.excerpt,
      resolvedLang,
      `learn.${meta.slug}.excerpt`,
    ),
    body: resolveLocalizedList(text.body, resolvedLang, `learn.${meta.slug}.body`),
    category: resolveLocalizedString(
      LEARN_CATEGORY_TEXT[text.categoryKey],
      resolvedLang,
      `learn-category.${text.categoryKey}`,
    ),
  };
};

export const getLearnArticles = (lang: string = "en"): LearnArticle[] =>
  LEARN_META.map((meta) => resolveLearnArticle(meta, lang));

export const LEARN: LearnArticle[] = getLearnArticles();

export const getArticle = (slug: string, lang: string = "en") => {
  const meta = LEARN_META.find((article) => article.slug === slug);
  return meta ? resolveLearnArticle(meta, lang) : undefined;
};
