import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Indicative estimates only — verify with official portals.";

export const GLOBAL_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "How it works",
  title: "From a rough idea to a costed road trip in three calm steps.",
  intro:
    "AutoVere turns a start and a destination into a transparent, cross-border cost picture — tolls, vignettes, fuel, charging and ferries — for cars, motorhomes and touring motorcycles.",
  sections: [
    {
      heading: "1 — Tell us about the journey",
      body: "Enter your origin and destination, pick your vehicle type and fuel or power source, and choose route preferences such as scenic bypasses, avoiding tolls or including ferries.",
      items: [
        "Car, motorhome/campervan or touring motorcycle profiles",
        "Petrol, diesel or electric with your own tank, battery and consumption figures",
        "Toll tags such as AutoPASS, Telepass, Bip&Go, SunPass or E-ZPass",
      ],
    },
    {
      heading: "2 — We model the true cost of every kilometre",
      body: "Each country or state on your route is costed separately, using its own toll model — electronic vignettes, distance barriers, city rings or toll-free motorways — plus local fuel and fast-charging prices.",
      items: [
        "Country-by-country toll and vignette breakdown with checkpoint detail",
        "Motorcycle discounts applied where operators publish reduced classes",
        "Ferry and mountain pass costs listed as separate line items",
        "Smart fuel and EV charging optimizer with a 75% range safety buffer",
      ],
    },
    {
      heading: "3 — Take it on the road",
      body: "Export a GPX file for your sat-nav, save the itinerary to My Garage, or share it with your travel companions. Every toll line links to the official portal so you can buy before you cross the border.",
      links: [
        { label: "ASFINAG (Austria)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Norway)", url: "https://www.autopass.no/" },
        { label: "Telepass (Italy)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "How AutoVere Works — Cross-Border Road Trip Cost Planning",
    description:
      "See how AutoVere costs tolls, vignettes, fuel, EV charging and ferries country by country for cars, motorhomes and touring motorcycles.",
  },
};

export const GLOBAL_PRICING: InfoPageContent = {
  eyebrow: "Pricing",
  title: "Plan freely. Upgrade only when the road gets ambitious.",
  intro:
    "Everyday trip planning is free. Paid plans are for travellers who live in their vehicle for weeks at a time and want deeper routing, offline exports and unlimited saved adventures.",
  sections: [
    {
      heading: "Explorer — Free",
      body: "Everything you need for a weekend away or a two-country crossing.",
      items: [
        "Unlimited trip estimates across Europe, the USA and Canada",
        "Country and state toll, vignette and ferry breakdowns",
        "Fuel and EV charging estimates with official portal links",
        "Up to 3 saved vehicles and 5 saved trips in My Garage",
      ],
    },
    {
      heading: "Voyager — €4.90 / month",
      body: "For the long summer tour, the fjord run and the coast-to-coast.",
      items: [
        "Unlimited saved vehicles and adventures",
        "GPX export with toll and charging waypoints",
        "Smart fuel arbitrage tips and long-stretch fuel alerts",
        "Priority updates when toll or vignette prices change",
      ],
    },
    {
      heading: "Fleet & Partners — from €29 / month",
      body: "For rental fleets, motorhome dealers, rider clubs and tour operators.",
      items: [
        "Multi-vehicle profiles and shared itineraries for your team",
        "Branded trip sheets to hand to your customers",
        "API access to cost estimates (currently in private preview)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Pricing — Free Road Trip Planning, Optional Voyager Plan | AutoVere",
    description:
      "AutoVere is free for everyday trip planning. Voyager and Fleet plans add unlimited saved trips, GPX export and partner tools.",
  },
};

export const GLOBAL_FAQ: InfoPageContent = {
  eyebrow: "Frequently asked questions",
  title: "Everything travellers ask us before setting off.",
  intro:
    "Straight answers about how our estimates are built, where the data comes from and what you still need to buy yourself.",
  sections: [
    {
      heading: "How accurate are the cost estimates?",
      body: "We model published toll tariffs, vignette prices and average regional fuel and charging prices. Real costs shift with fuel markets, seasonal tariffs, time-of-day pricing and vehicle class rules, so treat every figure as a well-informed indication and confirm with the official portal before you travel.",
    },
    {
      heading: "Do you sell vignettes or toll passes?",
      body: "No. We deliberately never resell them. Each toll line links straight to the official operator — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass and others — so you always pay the real price with no reseller markup.",
    },
    {
      heading: "How are motorcycles handled?",
      body: "Touring motorcycles are costed as their own vehicle class. Where operators publish reduced motorcycle tariffs we apply an indicative discount, Norwegian city rings are shown as free for two-wheelers, and you get a rider-specific safety and gear radar for mountain passes.",
    },
    {
      heading: "What about motorhomes and campervans?",
      body: "Motorhomes are costed by weight and axle class where that applies, and we surface clearance, length and weight warnings for tunnels, passes and low bridges along the route.",
    },
    {
      heading: "Do you support electric vehicles?",
      body: "Yes. Choose Electric (EV) and enter your battery size and consumption. We plan high-power charging stops with a 75% range safety buffer and show the networks you will meet — Ionity, Fastned, Tesla Supercharger, Electrify America and FLO.",
    },
    {
      heading: "Do I need an account?",
      body: "No. You can plan and export without signing up. My Garage stores your vehicles and trips on your own device so nothing leaves your browser unless you choose to share it.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "FAQ — Tolls, Vignettes, Fuel and EV Charging Questions | AutoVere",
    description:
      "Answers on estimate accuracy, official toll portals, motorcycle and motorhome classes, EV charging planning and accounts.",
  },
};

export const GLOBAL_PARTNERS: InfoPageContent = {
  eyebrow: "Partners",
  title: "We work with the people who keep the road moving.",
  intro:
    "AutoVere links to official toll operators and works alongside travel, rental and rider businesses across Europe, the USA and Canada.",
  sections: [
    {
      heading: "Official toll and vignette operators we link to",
      body: "Every purchase happens on the operator's own site. We never act as a reseller.",
      links: [
        { label: "ASFINAG — Austria", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Switzerland", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Norway", url: "https://www.autopass.no/" },
        { label: "Telepass — Italy", url: "https://www.telepass.com/" },
        { label: "DARS — Slovenia", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Florida", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Who partners with us",
      items: [
        "Motorhome and campervan rental fleets wanting transparent trip quotes",
        "Motorcycle tour operators and rider clubs planning alpine and fjord routes",
        "EV charging networks and route-planning apps",
        "Tourism boards promoting scenic passes, coastal roads and ferry crossings",
      ],
    },
    {
      heading: "Work with us",
      body: "KM TECH LABS is based in Kristiansand, Norway. If you run a fleet, a tour business or a toll service and want to talk integration, co-marketing or data partnerships, get in touch at partners@autovere.com.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Partners — Official Toll Operators and Travel Partners | AutoVere",
    description:
      "AutoVere links directly to official toll and vignette operators and partners with rental fleets, tour operators and charging networks.",
  },
};

export const GLOBAL_PRIVACY: InfoPageContent = {
  eyebrow: "Privacy policy",
  title: "Your route is your business.",
  intro:
    "AutoVere is operated by KM TECH LABS, Kristiansand, Norway. We keep data collection to the minimum needed to give you an accurate cost estimate.",
  sections: [
    {
      heading: "What we store",
      items: [
        "Trip inputs (origin, destination, vehicle and preferences) used to produce your estimate",
        "Saved vehicles and saved trips — stored locally in your own browser, not on our servers",
        "Aggregated, non-identifying usage statistics to improve the planner",
      ],
    },
    {
      heading: "What we do not do",
      items: [
        "We do not sell or rent personal data",
        "We do not track your live location",
        "We do not require an account to plan, export or share a trip",
      ],
    },
    {
      heading: "Your rights under the GDPR",
      body: "As a Norway/EEA-based operator we follow the GDPR. You may request access, correction, deletion, restriction, portability, or object to processing. Clearing your browser storage removes your saved vehicles and trips immediately.",
    },
    {
      heading: "Cookies and analytics",
      body: "We use essential storage to remember your region, language and garage. Any analytics we run is aggregated and cannot identify you individually.",
    },
    {
      heading: "Contact",
      body: "Privacy questions: privacy@autovere.com — KM TECH LABS, Kristiansand, Norway. Regional notices: US privacy is covered on /us/legal, and Canadian PIPEDA and Québec Law 25 rights are covered on /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Privacy Policy — GDPR, Local Storage and Your Data | AutoVere",
    description:
      "How KM TECH LABS handles trip inputs, locally stored garage data, cookies and your GDPR rights on AutoVere.",
  },
};

export const GLOBAL_TERMS: InfoPageContent = {
  eyebrow: "Terms of service",
  title: "Clear terms, so you can plan with confidence.",
  intro:
    "By using AutoVere you agree to these terms. They exist to keep expectations honest about what a cost estimate is — and what it is not.",
  sections: [
    {
      heading: "Estimates, not invoices",
      body: "All costs shown are indicative estimates based on published tariffs and average regional prices. Actual tolls, vignettes, fuel, charging and ferry fares may differ by vehicle class, season, time of day and operator changes. Always verify with the official portal before travelling.",
    },
    {
      heading: "Safe and lawful use",
      items: [
        "Do not use AutoVere while driving — plan before you set off",
        "Follow local traffic law, vehicle class rules and pass or tunnel restrictions",
        "Automated scraping, resale of our output or misrepresenting it as official pricing is not permitted",
      ],
    },
    {
      heading: "Third-party links and services",
      body: "Links to toll operators, ferry companies and charging networks are provided for convenience. Those services have their own terms and pricing, and KM TECH LABS is not responsible for their content or transactions.",
    },
    {
      heading: "Liability",
      body: "AutoVere is provided \u201cas is\u201d. To the extent permitted by law, KM TECH LABS is not liable for costs, fines, missed crossings or losses arising from reliance on an estimate.",
    },
    {
      heading: "Governing law",
      body: "These terms are governed by Norwegian law, with Kristiansand as the agreed venue, without prejudice to mandatory consumer protections in your country of residence.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Terms of Service — Estimate Disclaimer and Fair Use | AutoVere",
    description:
      "AutoVere's terms of service from KM TECH LABS: indicative estimates, safe use, third-party links, liability and governing law.",
  },
};
