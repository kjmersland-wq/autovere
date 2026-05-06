const en = {
  nav: {
    discover: "Discover",
    cars: "Cars",
    collections: "Collections",
    personalities: "Personalities",
    watch: "Watch",
    compare: "Compare",
    learn: "Learn",
    pricing: "Premium",
    contact: "Contact",
    help: "Help center",
    cta: "Try AUTOVERE",
  },
  hero: {
    eyebrow: "AUTOVERE intelligence",
    cta_primary: "Find your car",
    cta_secondary: "Explore the library",
  },
  footer: {
    tagline:
      "A calmer, more intelligent way to discover your next car. Built around transparency, responsible AI, and the people who drive what we make.",
    disclaimer:
      "AUTOVERE recommendations are AI-assisted and based on public data and reviewer consensus. Vehicle details vary by region — verify before purchase.",
    rights: "The future of choosing a car.",
    operated: "Operated with care from Kristiansand, Norway.",
    columns: {
      discover: "Discover",
      company: "Company",
      legal: "Legal",
    },
    links: {
      cars: "Cars",
      collections: "Collections",
      personalities: "Personalities",
      watch: "Watch",
      compare: "Compare",
      learn: "Learn",
      pricing: "Premium",
      help: "Help center",
      contact: "Contact",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      refund: "Refund Policy",
      subscriptions: "Subscription Terms",
    },
  },
  banner: {
    test_mode: "All payments made in the preview are in test mode.",
    read_more: "Read more",
  },
  region: {
    label: "Tailor experience to",
    aria: "Region",
  },
  language: {
    label: "Language",
  },
  common: {
    loading: "Loading…",
    error: "Something went wrong. Please try again.",
    retry: "Retry",
    save: "Save",
    cancel: "Cancel",
    close: "Close",
    back: "Back",
    next: "Next",
    continue: "Continue",
    submit: "Submit",
    sending: "Sending…",
    sent: "Sent",
    learn_more: "Learn more",
    view_all: "View all",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    clear: "Clear",
    optional: "Optional",
    required: "Required",
    empty: "Nothing to show yet.",
  },
  seo: {
    site_name: "AUTOVERE",
    default_title: "AUTOVERE — A calmer way to discover your next car",
    default_description:
      "AI-assisted automotive guidance with editorial depth. Discover, compare and understand cars with AUTOVERE.",
  },
} as const;

export default en;
export type Translation = typeof en;
