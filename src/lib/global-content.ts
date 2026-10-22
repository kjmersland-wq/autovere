import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Indicative estimates only — verify with official portals.";

export const GLOBAL_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "How it works",
  title: "Plan, price, and drive — in three high-impact steps.",
  intro:
    "AutoVere turns a start and a destination into a transparent, cross-border cost picture — tolls, vignettes, fuel, charging and ferries — for cars, motorhomes and touring motorcycles. Instant calculation with zero account required to test.",
  sections: [
    {
      heading: "1 — Enter your route & vehicle specs",
      body: "Tell us where you are going, what you are driving and how you want to get there. AutoVere handles cars, motorhomes and touring motorcycles, including EV battery sizes, weight tiers and axle classes that affect toll pricing.",
      items: [
        "Car, motorhome/campervan or touring motorcycle profiles with weight-class awareness",
        "Petrol, diesel or electric with your own tank, battery and consumption figures",
        "Route preferences: scenic bypasses, avoid tolls, include ferries, EV-only charging networks",
        "Toll tags such as AutoPASS, Telepass, Bip&Go, SunPass or E-ZPass",
      ],
    },
    {
      heading: "2 — Get deterministic cost calculations",
      body: "Every country or state on your route is priced using its own toll model and official 2026 rate data — not guessed. Electronic vignettes, distance barriers, city rings, weight-class tariffs, fuel, fast-charging and ferries are all broken down line by line.",
      items: [
        "Official 2026 toll and vignette rates per country or state",
        "Vehicle-class-aware pricing for motorhomes, heavy vehicles and motorcycles",
        "Ferry and mountain pass costs listed as separate line items",
        "Smart fuel and EV charging optimizer with a 75% range safety buffer",
      ],
    },
    {
      heading: "3 — Export & Drive with Trip Pass",
      body: "Unlock instant exports with a one-time 14-day Trip Pass. Send the route to Google Maps, download a GPX file for your sat-nav or in-car system, and get a printable offline trip kit with direct links to every official vignette and toll portal.",
      items: [
        "Google Maps, Apple Maps and Waze deep-links from your results",
        "GPX export with toll gates, charging stops and ferry waypoints",
        "Printable PDF itinerary and official vignette checklist",
        "One-time Trip Pass — no subscription required",
      ],
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
    title: "Pricing — Free, Trip Pass, Pro and Business | AutoVere",
    description:
      "Plan road trips for free. Trip Pass unlocks exports for 14 days with one payment; Pro and Business add unlimited saved trips, vehicles and team tools.",
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
      heading: "Are the vignette and toll prices official?",
      body: "Yes. AutoVere links directly to official government and operator portals — ASFINAG, via.admin.ch, AutoPASS, Telepass, DARS, 407 ETR, SunPass and others. We never resell vignettes or toll passes, so there is no middleman markup and you always pay the real price on the official site.",
    },
    {
      heading: "Why use AutoVere instead of standard Google Maps?",
      body: "Google Maps shows the road; AutoVere prices it. We calculate automated toll costs, flag missing vignettes, respect vehicle weight classes and motorhome clearances, and give you direct links to the official portals where you actually buy the pass — all before you reach the border.",
    },
    {
      heading: "Can I export my stops directly to my phone or in-car navigation?",
      body: "Yes. With the one-time 14-day Trip Pass you can export a GPX file for your sat-nav or in-car system, open Google Maps, Apple Maps or Waze deep-links, and print a PDF trip kit with toll gates, charging stops and ferry waypoints.",
    },
    {
      heading: "What makes AutoVere unique for Pro and Trip Pass users?",
      body: "Only AutoVere lets you shape the route around who is actually in the car. Pick from 14 unified interest categories — RV services, camping and overnight, scenic drives, viewpoints, history and culture, castles and palaces, nature and outdoors, kids and play, wildlife, food and culinary, beach and water, towns and cities, adventure and active, peaceful and relaxing — and Pro or Trip Pass injects matching stops along your exact corridor, into the map, the offline PDF kit and the GPX, Google Maps and Apple Maps exports. Your travel party and interests are saved in My Garage, so every future trip is personalised from the first calculation.",
    },
    {
      heading: "Where do I find the travel party and stop filter?",
      body: "In two places, and it is never hidden away. In My Garage open the \"Travel party & stops\" tab in the left menu to save who is travelling and which of the 14 interest categories matter to you. In the planner, right under your calculated route breakdown, open \"Personalize stops for your travel party\" to toggle the same categories for that specific trip. Both places share the same saved selection, so a change in one shows up in the other.",
    },
    {
      heading: "Is the Trip Pass a recurring subscription?",
      body: "No. Trip Pass is a one-time payment for 14 full days of export access. There is zero auto-renewal, no subscription trap and no cancellation needed. If you want ongoing unlimited exports you can upgrade to Pro, but Trip Pass itself is strictly one-time.",
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
      body: "No. Instant calculation with zero account required to test. My Garage stores your vehicles and trips on your own device; exports (GPX, PDF itinerary, send-to-car) are unlocked with the one-time 14-day Trip Pass or Pro.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "FAQ — Tolls, Vignettes, Fuel and EV Charging Questions | AutoVere",
    description:
      "Answers on estimate accuracy, official toll portals, motorcycle and motorhome classes, EV charging planning, exports and accounts.",
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
      body: "We work with partners wherever they are. If you run a fleet, a tour business or a toll service and want to talk integration, co-marketing or data partnerships, get in touch at kjell@autovere.com.",
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
    "AutoVere is operated by KM TECH LABS. We keep data collection to the minimum needed to give you an accurate cost estimate.",
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
        "We do not require an account to plan or preview a trip — exports are part of Trip Pass and Pro",
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
      heading: "Who we share data with",
      items: [
        "Paddle, our Merchant of Record, processes payments, subscriptions, tax and invoicing when you buy a plan — Paddle acts as an independent controller for that data",
        "Hosting and infrastructure providers that keep the site running",
        "Professional advisers (legal, accounting) where needed",
        "Authorities, only where required by law",
      ],
    },
    {
      heading: "Legal basis and retention",
      body: "We process trip inputs to perform the service you asked for (contract), use aggregated statistics under our legitimate interest in improving the planner, and meet legal obligations where required. Data is kept only as long as needed for these purposes, then deleted or anonymised.",
    },
    {
      heading: "Contact",
      body: "Privacy questions: kjell@autovere.com — KM TECH LABS. Regional notices: US privacy is covered on /us/legal, and Canadian PIPEDA and Québec Law 25 rights are covered on /ca/legal.",
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
      heading: "Payments and subscriptions",
      body: "Our order process is conducted by our online reseller Paddle.com. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns. Payment, billing, tax, cancellation and refund mechanics are governed by Paddle's Buyer Terms (https://www.paddle.com/legal/checkout-buyer-terms). Subscriptions renew automatically until cancelled, and you can manage or cancel your plan at any time via the Paddle customer portal.",
    },
    {
      heading: "Intellectual property and acceptable use",
      body: "AutoVere, its software, design and branding are owned by KM TECH LABS. We grant you a limited, non-exclusive, non-transferable right to use the service within your plan. You must not misuse the service: no unlawful use, fraud or spam, no infringement of others' rights, and no interference with the service (malware, probing, scraping or circumvention of technical limits). We may suspend or terminate access for material breach, non-payment, security or fraud risk, or repeated violations.",
    },
    {
      heading: "Liability",
      body: "AutoVere is provided \u201cas is\u201d. To the extent permitted by law, KM TECH LABS is not liable for costs, fines, missed crossings or losses arising from reliance on an estimate.",
    },
    {
      heading: "Governing law",
      body: "These terms are governed by Norwegian law, without prejudice to mandatory consumer protections in your country of residence.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Terms of Service — Estimate Disclaimer and Fair Use | AutoVere",
    description:
      "AutoVere's terms of service from KM TECH LABS: indicative estimates, safe use, third-party links, liability and governing law.",
  },
};

export const GLOBAL_REFUND: InfoPageContent = {
  eyebrow: "Refund policy",
  title: "30-day money-back guarantee.",
  intro:
    "We want you to feel safe trying AutoVere. If a paid plan is not what you expected, you can get your money back.",
  sections: [
    {
      heading: "Our guarantee",
      body: "We offer a 30-day money-back guarantee. If you are not satisfied with your purchase, you can request a full refund within 30 days of your order date — no questions asked.",
    },
    {
      heading: "How to request a refund",
      body: "Refunds are processed by our payment provider and Merchant of Record, Paddle. To request a refund, visit paddle.net or email us at kjell@autovere.com and we will help you. Refunds are returned to the original payment method.",
    },
    {
      heading: "Subscriptions",
      body: "You can cancel a subscription at any time via the Paddle customer portal. Cancellation stops future renewals; the 30-day guarantee above applies to the most recent payment.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Refund Policy — 30-Day Money-Back Guarantee | AutoVere",
    description:
      "AutoVere offers a 30-day money-back guarantee on all paid plans, processed by Paddle. How to request a refund.",
  },
};
