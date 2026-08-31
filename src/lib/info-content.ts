import type { InfoSection } from "@/components/InfoPage";

export type InfoLocale = "us" | "ca" | "ca-fr";

export type InfoPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: InfoSection[];
  note?: string;
  meta: { title: string; description: string };
};

const DISCLAIMER_EN = "Indicative estimates only — verify with official portals.";
const DISCLAIMER_FR =
  "Estimations indicatives uniquement — vérifiez auprès des portails officiels.";

export const HOW_IT_WORKS: Record<InfoLocale, InfoPageContent> = {
  us: {
    eyebrow: "United States",
    title: "How AutoVere works in the USA",
    intro:
      "Tell us where you're starting and where you're heading, pick your vehicle, and we map every turnpike, express lane, bridge and ferry along the way — with a clear dollar figure before you turn the key.",
    sections: [
      {
        heading: "1. Choose your region and vehicle",
        body: "Switch to 🇺🇸 USA and we flip everything to imperial units — miles, gallons and USD. Then pick Car, RV/Motorhome or Motorcycle so class-based toll rates and axle counts are applied correctly.",
      },
      {
        heading: "2. Set your route preferences",
        items: [
          "Prefer scenic mountain and coastal bypasses for byways like the Blue Ridge Parkway or Pacific Coast Highway.",
          "Avoid paid toll roads if you'd rather route around turnpikes and express lanes.",
          "Include ferry crossings for routes such as Washington State Ferries or the Cape May–Lewes ferry.",
          "Pick petrol, diesel or electric — EV routes are priced on kWh at typical public DC fast-charge rates.",
        ],
      },
      {
        heading: "3. Read your cost breakdown",
        body: "You get a total trip budget, distance and drive time, then itemised tolls per state with the transponder or pay-by-plate option that applies — E-ZPass, SunPass, TxTag, FasTrak and friends — plus fuel or charging and any ferry tickets.",
      },
      {
        heading: "4. Save, export and share",
        items: [
          "Export a GPX file with toll checkpoints as waypoints for your GPS or app.",
          "Save the itinerary to My Garage alongside your saved vehicle profiles.",
          "Share the trip with a travel partner in one tap.",
        ],
      },
    ],
    note: DISCLAIMER_EN,
    meta: {
      title: "How AutoVere Works in the USA — Toll & Fuel Cost Planning",
      description:
        "Learn how AutoVere calculates US turnpike tolls, express lanes, fuel, EV charging and ferry costs for cars, RVs and motorcycles.",
    },
  },
  ca: {
    eyebrow: "Canada",
    title: "How AutoVere works in Canada",
    intro:
      "Enter your start and destination, choose your vehicle, and we surface every 407 ETR segment, provincial bridge toll, ferry sailing and fuel or charging stop — with a clear figure in Canadian dollars before you set off.",
    sections: [
      {
        heading: "1. Choose your region and vehicle",
        body: "Switch to 🇨🇦 Canada and everything stays metric — kilometres, litres and CAD. Pick Car, RV/Motorhome or Motorcycle so the right class-based rates and ferry fares apply.",
      },
      {
        heading: "2. Set your route preferences",
        items: [
          "Prefer scenic mountain and coastal bypasses for the Icefields Parkway, Sea-to-Sky or Cabot Trail.",
          "Avoid paid toll roads to route around Highway 407 ETR and tolled crossings.",
          "Include ferry crossings for BC Ferries, Marine Atlantic and the Québec traverses.",
          "Pick petrol, diesel or electric — EV routes are priced on kWh at typical public fast-charge rates.",
        ],
      },
      {
        heading: "3. Read your cost breakdown",
        body: "You get a total trip budget, distance and drive time, then itemised tolls by province — Highway 407 ETR, the Confederation Bridge, Halifax harbour bridges — plus fuel or charging and any ferry tickets, each with a link to the official portal.",
      },
      {
        heading: "4. Save, export and share",
        items: [
          "Export a GPX file with toll checkpoints as waypoints.",
          "Save the itinerary to My Garage with your vehicle profiles.",
          "Share the trip with your travel partner in one tap.",
        ],
      },
    ],
    note: DISCLAIMER_EN,
    meta: {
      title: "How AutoVere Works in Canada — Toll, Ferry & Fuel Planning",
      description:
        "See how AutoVere estimates Highway 407 ETR, provincial bridge tolls, BC Ferries, fuel and EV charging costs for Canadian road trips.",
    },
  },
  "ca-fr": {
    eyebrow: "Canada · Français",
    title: "Comment fonctionne AutoVere au Canada",
    intro:
      "Indiquez votre point de départ et votre destination, choisissez votre véhicule, et nous répertorions chaque segment de la 407 ETR, chaque pont à péage provincial, chaque traversier et chaque arrêt carburant ou recharge — en dollars canadiens, avant même de prendre la route.",
    sections: [
      {
        heading: "1. Choisissez votre région et votre véhicule",
        body: "Passez à 🇨🇦 Canada : tout reste métrique — kilomètres, litres et CAD. Sélectionnez Voiture, Autocaravane ou Moto pour appliquer les bons tarifs par catégorie.",
      },
      {
        heading: "2. Définissez vos préférences d'itinéraire",
        items: [
          "Privilégier les routes panoramiques de montagne et côtières : promenade des Glaciers, Sea-to-Sky, Cabot Trail.",
          "Éviter les routes à péage pour contourner l'autoroute 407 ETR et les traversées payantes.",
          "Inclure les traversiers : BC Ferries, Marine Atlantique et les traverses du Québec.",
          "Choisir essence, diesel ou électrique — les trajets EV sont calculés au kWh selon les tarifs publics de recharge rapide.",
        ],
      },
      {
        heading: "3. Consultez votre ventilation des coûts",
        body: "Vous obtenez un budget total, la distance et la durée, puis les péages détaillés par province — autoroute 407 ETR, pont de la Confédération, ponts du port d'Halifax — ainsi que le carburant ou la recharge et les billets de traversier, avec un lien vers le portail officiel.",
      },
      {
        heading: "4. Enregistrez, exportez et partagez",
        items: [
          "Exportez un fichier GPX avec les points de péage comme waypoints.",
          "Enregistrez l'itinéraire dans Mon Garage avec vos profils de véhicules.",
          "Partagez le trajet avec vos compagnons de route en un clic.",
        ],
      },
    ],
    note: DISCLAIMER_FR,
    meta: {
      title: "Comment fonctionne AutoVere au Canada — Péages, traversiers et carburant",
      description:
        "Découvrez comment AutoVere estime les péages de la 407 ETR, les ponts provinciaux, BC Ferries, le carburant et la recharge EV.",
    },
  },
};

export const FAQ: Record<InfoLocale, InfoPageContent> = {
  us: {
    eyebrow: "United States",
    title: "Frequently asked questions — USA",
    intro:
      "Everything travellers ask us about planning a US road trip with AutoVere. Still stuck? We're happy to help.",
    sections: [
      {
        heading: "Are the toll amounts exact?",
        body: "They're careful indicative estimates based on published class-based rates. Turnpike operators adjust tariffs, and peak-hour express lane pricing is dynamic, so always confirm the final amount with the operator's official portal before you travel.",
      },
      {
        heading: "Do I need a transponder?",
        body: "On many corridors, yes — and it's usually cheaper. E-ZPass covers most of the Northeast and Midwest, SunPass covers Florida, TxTag covers Texas and FasTrak covers California. Where a tag isn't available, pay-by-plate tolling by mail applies, typically at a higher rate.",
      },
      {
        heading: "How are RV and motorhome tolls calculated?",
        body: "US tolling is largely axle- and height-based, so a Class 3 motorhome can pay two to four times the car rate. We apply the vehicle class you select to every checkpoint on the route.",
      },
      {
        heading: "Do motorcycles pay less?",
        body: "On many facilities yes — we apply an indicative motorcycle reduction on distance-based tolls. A handful of authorities charge the standard car rate, so treat the figure as a planning guide.",
      },
      {
        heading: "How is EV charging priced?",
        body: "We model consumption per mile for your vehicle type and price it at typical public DC fast-charging rates. Home or hotel charging will come out considerably cheaper.",
      },
      {
        heading: "Do you store my trips?",
        body: "Saved trips and vehicle profiles live in your browser's local storage on this device. Nothing is uploaded unless you explicitly choose to share a trip.",
      },
    ],
    note: DISCLAIMER_EN,
    meta: {
      title: "USA Road Trip FAQ — Tolls, Transponders & EV Charging | AutoVere",
      description:
        "Answers on US turnpike tolls, E-ZPass and SunPass transponders, RV toll classes, motorcycle rates and EV charging costs.",
    },
  },
  ca: {
    eyebrow: "Canada",
    title: "Frequently asked questions — Canada",
    intro:
      "Everything travellers ask us about planning a Canadian road trip with AutoVere. Still stuck? We're happy to help.",
    sections: [
      {
        heading: "Are the toll amounts exact?",
        body: "They're careful indicative estimates. Highway 407 ETR rates vary by time of day, zone and vehicle class, and ferry fares change seasonally — always confirm with the official operator before you travel.",
      },
      {
        heading: "How does Highway 407 ETR billing work?",
        body: "The 407 is all-electronic. With a transponder you pay a lease fee but avoid the camera charge; without one, a video toll charge per trip applies and the invoice arrives by mail to the plate holder — including for out-of-province and rental vehicles.",
      },
      {
        heading: "Should I reserve BC Ferries in advance?",
        body: "On peak summer sailings and for oversize vehicles, absolutely. Motorhomes and vehicles over 20 ft are charged an over-length fare, and reservations carry a separate booking fee that we include in the ferry subtotal.",
      },
      {
        heading: "Do motorcycles pay less in Canada?",
        body: "Frequently yes — most ferries and several crossings have a reduced motorcycle fare, and we apply an indicative reduction on distance-based tolls.",
      },
      {
        heading: "Is winter driving factored in?",
        body: "Drive times assume good conditions. From October to April, mountain corridors such as the Coquihalla and the Icefields Parkway can require winter tyres or chains by law — plan extra time and check DriveBC or 511 before departure.",
      },
      {
        heading: "Do you store my trips?",
        body: "Saved trips and vehicle profiles stay in your browser's local storage on this device. Nothing is uploaded unless you choose to share a trip.",
      },
    ],
    note: DISCLAIMER_EN,
    meta: {
      title: "Canada Road Trip FAQ — 407 ETR, BC Ferries & Winter Driving | AutoVere",
      description:
        "Answers on Highway 407 ETR billing, BC Ferries reservations, motorcycle fares, RV over-length charges and Canadian winter driving.",
    },
  },
  "ca-fr": {
    eyebrow: "Canada · Français",
    title: "Foire aux questions — Canada",
    intro:
      "Tout ce que les voyageurs nous demandent pour planifier un road trip canadien avec AutoVere. Une autre question ? Écrivez-nous avec plaisir.",
    sections: [
      {
        heading: "Les montants des péages sont-ils exacts ?",
        body: "Ce sont des estimations indicatives soignées. Les tarifs de l'autoroute 407 ETR varient selon l'heure, la zone et la catégorie de véhicule, et les tarifs des traversiers changent selon la saison — confirmez toujours auprès de l'exploitant officiel.",
      },
      {
        heading: "Comment fonctionne la facturation de la 407 ETR ?",
        body: "La 407 est entièrement électronique. Avec un transpondeur, vous payez des frais de location mais évitez les frais de caméra ; sans transpondeur, des frais de péage vidéo s'appliquent et la facture est envoyée au titulaire de la plaque — y compris hors province et pour les véhicules de location.",
      },
      {
        heading: "Faut-il réserver les traversiers ?",
        body: "En haute saison et pour les véhicules surdimensionnés, oui. Les autocaravanes de plus de 6 m paient un tarif hors gabarit, et la réservation comporte des frais distincts inclus dans notre sous-total traversiers.",
      },
      {
        heading: "Les motos paient-elles moins cher ?",
        body: "Souvent oui — la plupart des traversiers et plusieurs traversées offrent un tarif moto réduit, et nous appliquons une réduction indicative sur les péages kilométriques.",
      },
      {
        heading: "La conduite hivernale est-elle prise en compte ?",
        body: "Les durées supposent de bonnes conditions. D'octobre à avril, les corridors de montagne peuvent exiger des pneus d'hiver ou des chaînes — prévoyez du temps et consultez Québec 511 ou DriveBC avant le départ.",
      },
      {
        heading: "Conservez-vous mes trajets ?",
        body: "Les trajets et profils de véhicules enregistrés restent dans le stockage local de votre navigateur, sur cet appareil. Rien n'est téléversé sauf si vous choisissez de partager un trajet.",
      },
    ],
    note: DISCLAIMER_FR,
    meta: {
      title: "FAQ road trip au Canada — 407 ETR, traversiers et hiver | AutoVere",
      description:
        "Réponses sur la facturation de la 407 ETR, les réservations de traversiers, les tarifs moto et la conduite hivernale au Canada.",
    },
  },
};

export const PARTNERS: Record<InfoLocale, InfoPageContent> = {
  us: {
    eyebrow: "United States",
    title: "Partners & official sources — USA",
    intro:
      "We never resell tolls. Every payment happens directly with the official operator, and these are the sources our US estimates are built on.",
    sections: [
      {
        heading: "Tolling authorities & transponders",
        items: [
          "E-ZPass — interoperable across 19 states in the Northeast, Midwest and Southeast.",
          "SunPass — Florida's Turnpike and statewide facilities.",
          "TxTag / TollTag / EZ TAG — Texas toll roads and managed lanes.",
          "FasTrak — California bridges, express lanes and the toll roads of Orange County.",
        ],
        links: [
          { label: "E-ZPass", url: "https://www.e-zpassiag.com/" },
          { label: "SunPass", url: "https://www.sunpass.com/" },
          { label: "TxTag", url: "https://www.txtag.org/" },
          { label: "FasTrak", url: "https://www.bayareafastrak.org/" },
        ],
      },
      {
        heading: "Ferries",
        items: [
          "Washington State Ferries — the largest ferry system in the country.",
          "Cape May–Lewes Ferry — Delaware Bay crossing.",
          "Alaska Marine Highway — long-haul coastal sailings.",
        ],
        links: [
          { label: "WSDOT Ferries", url: "https://wsdot.com/travel/washington-state-ferries" },
          { label: "Alaska Marine Highway", url: "https://dot.alaska.gov/amhs/" },
        ],
      },
      {
        heading: "Road conditions & safety",
        items: [
          "State 511 services for live construction, closures and weather.",
          "National Park Service alerts for seasonal road openings such as Going-to-the-Sun Road.",
        ],
      },
      {
        heading: "Work with us",
        body: "Are you a tolling authority, ferry operator, EV network, campsite chain or motorcycle tour brand? We'd love to talk about data partnerships and referral integrations. Reach out through KM TECH LABS.",
      },
    ],
    note: DISCLAIMER_EN,
    meta: {
      title: "Partners & Official Toll Sources — USA | AutoVere",
      description:
        "The tolling authorities, transponder programs, ferry operators and road-condition services behind AutoVere's US estimates.",
    },
  },
  ca: {
    eyebrow: "Canada",
    title: "Partners & official sources — Canada",
    intro:
      "We never resell tolls or tickets. Payment always happens with the official operator, and these are the sources our Canadian estimates are built on.",
    sections: [
      {
        heading: "Tolls & crossings",
        items: [
          "Highway 407 ETR — Greater Toronto Area, all-electronic tolling.",
          "Confederation Bridge — PEI to New Brunswick, tolled westbound.",
          "Halifax Harbour Bridges — Macdonald and MacKay crossings.",
          "A25 and A30 Express — tolled links around Montréal.",
        ],
        links: [
          { label: "407 ETR", url: "https://www.407etr.com/" },
          { label: "Confederation Bridge", url: "https://www.confederationbridge.com/" },
          { label: "Halifax Harbour Bridges", url: "https://halifaxharbourbridges.ca/" },
        ],
      },
      {
        heading: "Ferries",
        items: [
          "BC Ferries — Vancouver Island, the Gulf Islands and the Inside Passage.",
          "Marine Atlantic — Nova Scotia to Newfoundland.",
          "Société des traversiers du Québec — St. Lawrence crossings.",
        ],
        links: [
          { label: "BC Ferries", url: "https://www.bcferries.com/" },
          { label: "Marine Atlantic", url: "https://www.marineatlantic.ca/" },
          { label: "STQ", url: "https://www.traversiers.com/" },
        ],
      },
      {
        heading: "Road conditions & safety",
        items: [
          "DriveBC, Alberta 511, Ontario 511 and Québec 511 for live conditions.",
          "Parks Canada for seasonal mountain-parkway openings and wildlife advisories.",
        ],
      },
      {
        heading: "Work with us",
        body: "Toll operators, ferry lines, EV networks, campgrounds and tour brands: we'd love to discuss data partnerships and referral integrations. Reach out through KM TECH LABS.",
      },
    ],
    note: DISCLAIMER_EN,
    meta: {
      title: "Partners & Official Toll Sources — Canada | AutoVere",
      description:
        "The toll operators, ferry lines and road-condition services behind AutoVere's Canadian cost estimates.",
    },
  },
  "ca-fr": {
    eyebrow: "Canada · Français",
    title: "Partenaires et sources officielles — Canada",
    intro:
      "Nous ne revendons ni péages ni billets. Le paiement se fait toujours auprès de l'exploitant officiel ; voici les sources de nos estimations canadiennes.",
    sections: [
      {
        heading: "Péages et traversées",
        items: [
          "Autoroute 407 ETR — région du Grand Toronto, péage entièrement électronique.",
          "Pont de la Confédération — Î.-P.-É. vers le Nouveau-Brunswick, péage vers l'ouest.",
          "Ponts du port d'Halifax — Macdonald et MacKay.",
          "A25 et A30 Express — liaisons à péage autour de Montréal.",
        ],
        links: [
          { label: "407 ETR", url: "https://www.407etr.com/" },
          { label: "Pont de la Confédération", url: "https://www.confederationbridge.com/" },
          { label: "A25", url: "https://a25.com/" },
        ],
      },
      {
        heading: "Traversiers",
        items: [
          "BC Ferries — île de Vancouver, îles Gulf et passage intérieur.",
          "Marine Atlantique — Nouvelle-Écosse vers Terre-Neuve.",
          "Société des traversiers du Québec — traverses du Saint-Laurent.",
        ],
        links: [
          { label: "BC Ferries", url: "https://www.bcferries.com/" },
          { label: "Marine Atlantique", url: "https://www.marineatlantic.ca/" },
          { label: "STQ", url: "https://www.traversiers.com/" },
        ],
      },
      {
        heading: "État des routes et sécurité",
        items: [
          "Québec 511, Ontario 511, Alberta 511 et DriveBC pour les conditions en direct.",
          "Parcs Canada pour l'ouverture saisonnière des promenades de montagne.",
        ],
      },
      {
        heading: "Travailler avec nous",
        body: "Exploitants de péages, traversiers, réseaux de recharge, campings et voyagistes : parlons partenariats de données et intégrations. Contactez-nous via KM TECH LABS.",
      },
    ],
    note: DISCLAIMER_FR,
    meta: {
      title: "Partenaires et sources officielles — Canada | AutoVere",
      description:
        "Les exploitants de péages, traversiers et services routiers derrière les estimations canadiennes d'AutoVere.",
    },
  },
};

export const LEGAL: Record<InfoLocale, InfoPageContent> = {
  us: {
    eyebrow: "United States",
    title: "Legal, privacy & terms — USA",
    intro:
      "AutoVere is operated by KM TECH LABS. This page explains what we collect, how estimates should be used, and your rights as a US visitor.",
    sections: [
      {
        heading: "Estimates and liability",
        body: "All costs shown are indicative planning estimates generated from published tariffs and typical fuel and charging prices. They are not quotes, invoices or guarantees. Toll authorities may change rates, apply dynamic pricing or add administrative fees. Always verify with the official portal before travelling. KM TECH LABS accepts no liability for costs, fines or losses arising from reliance on these estimates.",
      },
      {
        heading: "Data we process",
        items: [
          "Trip inputs (origin, destination, vehicle, preferences) used to generate your estimate.",
          "Saved trips and vehicle profiles stored locally in your browser, not on our servers.",
          "Aggregate, non-identifying usage analytics to improve the product.",
        ],
      },
      {
        heading: "Your privacy choices",
        body: "We do not sell or share personal information for cross-context behavioural advertising. Residents of California (CCPA/CPRA), Colorado, Connecticut, Virginia, Texas and other states with comprehensive privacy laws may request access to, correction of, or deletion of personal information, and may appeal a refusal. Requests can be made through KM TECH LABS.",
      },
      {
        heading: "Children",
        body: "AutoVere is not directed at children under 13 and we do not knowingly collect their personal information.",
      },
      {
        heading: "Contact",
        body: "KM TECH LABS — privacy and legal enquiries can be sent through the contact channel listed on autovere.com.",
      },
    ],
    note: DISCLAIMER_EN,
    meta: {
      title: "Legal, Privacy & Terms — USA | AutoVere",
      description:
        "AutoVere's US legal terms and privacy notice, including CCPA/CPRA rights and the limits of our indicative cost estimates.",
    },
  },
  ca: {
    eyebrow: "Canada",
    title: "Legal, privacy & terms — Canada",
    intro:
      "AutoVere is operated by KM TECH LABS. This notice describes how we handle personal information under Canada's PIPEDA and Québec's Law 25, and how our estimates should be used.",
    sections: [
      {
        heading: "Estimates and liability",
        body: "All figures are indicative planning estimates based on published tariffs and typical fuel, charging and ferry prices. They are not quotes or guarantees. Highway 407 ETR pricing varies by time, zone and vehicle class, and ferry fares change seasonally. Always verify with the official operator before travelling. KM TECH LABS accepts no liability for costs, fines or losses arising from reliance on these estimates.",
      },
      {
        heading: "PIPEDA — the ten principles",
        body: "We handle personal information in line with the Personal Information Protection and Electronic Documents Act: accountability, identifying purposes, consent, limiting collection, limiting use and disclosure, accuracy, safeguards, openness, individual access, and the right to challenge compliance. KM TECH LABS is accountable for information under its control, including anything processed by service providers.",
      },
      {
        heading: "Québec Law 25 (Act 25)",
        items: [
          "Privacy officer: KM TECH LABS designates a Privacy Officer responsible for the protection of personal information; contact details are available on request.",
          "Consent: we collect only what is necessary to produce your estimate, and consent for any non-essential purpose is requested separately and in clear language.",
          "Transparency about technology: we tell you when technology that identifies, locates or profiles you is in use, and such functions are off by default.",
          "Portability and deletion: you may request a copy of your personal information in a structured, commonly used technological format, and request correction, de-indexing or deletion.",
          "Cross-border transfers: before transferring personal information outside Québec we assess whether it will receive adequate protection.",
          "Breach notification: confidentiality incidents presenting a risk of serious injury are reported to the Commission d'accès à l'information and to affected individuals.",
        ],
      },
      {
        heading: "Data we process",
        items: [
          "Trip inputs (origin, destination, vehicle, preferences) used to generate your estimate.",
          "Saved trips and vehicle profiles stored locally in your browser, not on our servers.",
          "Aggregate, non-identifying usage analytics to improve the product.",
        ],
      },
      {
        heading: "Exercising your rights",
        body: "To access, correct, port or delete your personal information, or to withdraw consent, contact KM TECH LABS. We respond within 30 days. If you are unsatisfied you may complain to the Office of the Privacy Commissioner of Canada, or, in Québec, to the Commission d'accès à l'information.",
      },
    ],
    note: DISCLAIMER_EN,
    meta: {
      title: "Legal, Privacy & Terms — Canada (PIPEDA & Law 25) | AutoVere",
      description:
        "AutoVere's Canadian privacy notice covering PIPEDA principles, Québec Law 25 rights, data handling and estimate disclaimers.",
    },
  },
  "ca-fr": {
    eyebrow: "Canada · Français",
    title: "Mentions légales, vie privée et conditions — Canada",
    intro:
      "AutoVere est exploité par KM TECH LABS. Cet avis décrit le traitement des renseignements personnels selon la LPRPDE (PIPEDA) et la Loi 25 du Québec, ainsi que l'usage de nos estimations.",
    sections: [
      {
        heading: "Estimations et responsabilité",
        body: "Tous les montants sont des estimations indicatives fondées sur les tarifs publiés et les prix courants du carburant, de la recharge et des traversiers. Il ne s'agit ni de devis ni de garanties. Les tarifs de la 407 ETR varient selon l'heure, la zone et la catégorie de véhicule. Vérifiez toujours auprès de l'exploitant officiel. KM TECH LABS décline toute responsabilité pour les frais, amendes ou pertes découlant de l'utilisation de ces estimations.",
      },
      {
        heading: "LPRPDE — les dix principes",
        body: "Nous traitons les renseignements personnels conformément à la Loi sur la protection des renseignements personnels et les documents électroniques : responsabilité, détermination des fins, consentement, limitation de la collecte, limitation de l'utilisation et de la communication, exactitude, mesures de sécurité, transparence, accès aux renseignements et possibilité de porter plainte.",
      },
      {
        heading: "Loi 25 (Québec)",
        items: [
          "Responsable de la protection des renseignements personnels : KM TECH LABS en désigne un ; ses coordonnées sont fournies sur demande.",
          "Consentement : nous ne recueillons que le nécessaire à votre estimation ; tout usage non essentiel fait l'objet d'un consentement distinct et en termes clairs.",
          "Transparence technologique : nous vous informons de l'usage de toute technologie d'identification, de localisation ou de profilage ; ces fonctions sont désactivées par défaut.",
          "Portabilité et effacement : vous pouvez obtenir vos renseignements dans un format technologique structuré et couramment utilisé, et demander leur rectification, désindexation ou suppression.",
          "Transferts hors Québec : nous réalisons une évaluation des facteurs relatifs à la vie privée avant tout transfert.",
          "Incidents de confidentialité : tout incident présentant un risque de préjudice sérieux est signalé à la Commission d'accès à l'information et aux personnes concernées.",
        ],
      },
      {
        heading: "Renseignements traités",
        items: [
          "Données du trajet (départ, destination, véhicule, préférences) servant à produire l'estimation.",
          "Trajets et profils de véhicules enregistrés localement dans votre navigateur, pas sur nos serveurs.",
          "Statistiques d'utilisation agrégées et non identifiantes.",
        ],
      },
      {
        heading: "Exercer vos droits",
        body: "Pour accéder, rectifier, transférer ou supprimer vos renseignements, ou retirer votre consentement, contactez KM TECH LABS. Nous répondons dans un délai de 30 jours. En cas d'insatisfaction, vous pouvez vous adresser à la Commission d'accès à l'information du Québec ou au Commissariat à la protection de la vie privée du Canada.",
      },
    ],
    note: DISCLAIMER_FR,
    meta: {
      title: "Mentions légales et vie privée — Canada (LPRPDE et Loi 25) | AutoVere",
      description:
        "Avis de confidentialité canadien d'AutoVere : principes de la LPRPDE, droits prévus par la Loi 25 et limites des estimations.",
    },
  },
};
