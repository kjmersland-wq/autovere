import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Estimations indicatives uniquement — vérifiez auprès des portails officiels.";

export const FR_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "Comment ça marche",
  title: "D'une idée vague à un road trip entièrement chiffré en trois étapes tranquilles.",
  intro:
    "AutoVere transforme un départ et une destination en un tableau de coûts transfrontalier transparent — péages, vignettes, carburant, recharge et ferries — pour les voitures, camping-cars et motos de tourisme.",
  sections: [
    {
      heading: "1 — Parlez-nous de votre voyage",
      body: "Indiquez votre point de départ et votre destination, choisissez votre type de véhicule et votre source d'énergie, puis sélectionnez vos préférences d'itinéraire comme les détours pittoresques, l'évitement des péages ou l'inclusion des ferries.",
      items: [
        "Profils voiture, camping-car/fourgon aménagé ou moto de tourisme",
        "Essence, diesel ou électrique avec vos propres données de réservoir, batterie et consommation",
        "Badges de télépéage comme AutoPASS, Telepass, Bip&Go, SunPass ou E-ZPass",
      ],
    },
    {
      heading: "2 — Nous calculons le coût réel de chaque kilomètre",
      body: "Chaque pays ou état de votre trajet est chiffré séparément, selon son propre système de péage — vignettes électroniques, barrières de péage kilométriques, ceintures urbaines ou autoroutes gratuites — auquel s'ajoutent les prix locaux du carburant et de la recharge rapide.",
      items: [
        "Répartition pays par pays des péages et vignettes, avec le détail de chaque gare de péage",
        "Réductions moto appliquées là où les opérateurs publient des tarifs réduits",
        "Coûts des ferries et cols de montagne listés comme des lignes distinctes",
        "Optimiseur intelligent de carburant et de recharge VE avec une marge de sécurité de 75 % de l'autonomie",
      ],
    },
    {
      heading: "3 — Prenez la route",
      body: "Exportez un fichier GPX pour votre GPS, enregistrez l'itinéraire dans Mon Garage, ou partagez-le avec vos compagnons de route. Chaque ligne de péage renvoie vers le portail officiel pour que vous puissiez payer avant de passer la frontière.",
      links: [
        { label: "ASFINAG (Autriche)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Norvège)", url: "https://www.autopass.no/" },
        { label: "Telepass (Italie)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Comment fonctionne AutoVere — Planification des coûts de road trip transfrontaliers",
    description:
      "Découvrez comment AutoVere calcule les péages, vignettes, carburant, recharge VE et ferries pays par pays pour les voitures, camping-cars et motos de tourisme.",
  },
};

export const FR_PRICING: InfoPageContent = {
  eyebrow: "Tarifs",
  title: "Planifiez librement. Passez à un forfait seulement quand la route devient ambitieuse.",
  intro:
    "La planification de voyage au quotidien est gratuite. Les forfaits payants sont pour les voyageurs qui vivent dans leur véhicule pendant des semaines et veulent un itinéraire plus poussé, des exports hors ligne et un nombre illimité d'aventures enregistrées.",
  sections: [
    {
      heading: "Explorer — Gratuit",
      body: "Tout ce qu'il vous faut pour une escapade d'un week-end ou une traversée de deux pays.",
      items: [
        "Estimations de voyage illimitées en Europe, aux États-Unis et au Canada",
        "Répartitions des péages, vignettes et ferries par pays et par état",
        "Estimations de carburant et de recharge VE avec liens vers les portails officiels",
        "Jusqu'à 3 véhicules et 5 voyages enregistrés dans Mon Garage",
      ],
    },
    {
      heading: "Voyager — 4,90 € / mois",
      body: "Pour la longue tournée estivale, la traversée des fjords et la route côte à côte.",
      items: [
        "Nombre illimité de véhicules et d'aventures enregistrés",
        "Export GPX avec les points de passage péage et recharge",
        "Astuces intelligentes d'arbitrage carburant et alertes de longs tronçons",
        "Mises à jour prioritaires en cas de changement des prix des péages ou vignettes",
      ],
    },
    {
      heading: "Flotte & Partenaires — à partir de 29 € / mois",
      body: "Pour les flottes de location, les concessionnaires de camping-cars, les clubs motards et les organisateurs de circuits.",
      items: [
        "Profils multi-véhicules et itinéraires partagés pour toute votre équipe",
        "Fiches de voyage personnalisées à remettre à vos clients",
        "Accès API aux estimations de coûts (actuellement en avant-première privée)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Tarifs — Planification de voyage gratuite, forfait Voyager en option | AutoVere",
    description:
      "AutoVere est gratuit pour la planification de voyage au quotidien. Les forfaits Voyager et Flotte ajoutent des voyages illimités, l'export GPX et des outils partenaires.",
  },
};

export const FR_FAQ: InfoPageContent = {
  eyebrow: "Questions fréquentes",
  title: "Tout ce que les voyageurs nous demandent avant de prendre la route.",
  intro:
    "Des réponses franches sur la façon dont nos estimations sont construites, d'où viennent les données et ce que vous devez encore acheter vous-même.",
  sections: [
    {
      heading: "Quelle est la précision des estimations de coûts ?",
      body: "Nous nous basons sur les tarifs de péage publiés, les prix des vignettes et les prix moyens régionaux du carburant et de la recharge. Les coûts réels varient selon les marchés du carburant, les tarifs saisonniers, les tarifs selon l'heure et les règles de classe de véhicule — considérez donc chaque chiffre comme une indication bien informée et confirmez-le sur le portail officiel avant de voyager.",
    },
    {
      heading: "Vendez-vous des vignettes ou des passes de péage ?",
      body: "Non. Nous ne les revendons jamais, délibérément. Chaque ligne de péage renvoie directement à l'opérateur officiel — ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass et autres — pour que vous payiez toujours le vrai prix, sans marge de revendeur.",
    },
    {
      heading: "Comment les motos sont-elles traitées ?",
      body: "Les motos de tourisme sont chiffrées comme leur propre classe de véhicule. Là où les opérateurs publient des tarifs moto réduits, nous appliquons une remise indicative, les ceintures urbaines norvégiennes sont indiquées comme gratuites pour les deux-roues, et vous bénéficiez d'un radar de sécurité et d'équipement dédié aux motards pour les cols de montagne.",
    },
    {
      heading: "Qu'en est-il des camping-cars et des fourgons aménagés ?",
      body: "Les camping-cars sont chiffrés selon le poids et la classe d'essieux lorsque cela s'applique, et nous signalons les alertes de hauteur, longueur et poids pour les tunnels, cols et ponts bas sur votre trajet.",
    },
    {
      heading: "Prenez-vous en charge les véhicules électriques ?",
      body: "Oui. Choisissez Électrique (VE) et indiquez la capacité de votre batterie et votre consommation. Nous planifions des arrêts de recharge rapide avec une marge de sécurité de 75 % de l'autonomie et affichons les réseaux que vous rencontrerez — Ionity, Fastned, Tesla Supercharger, Electrify America et FLO.",
    },
    {
      heading: "Ai-je besoin d'un compte ?",
      body: "Non. Calcul instantané — aucun compte requis pour l'aperçu. Mon Garage enregistre vos véhicules et vos voyages localement sur votre appareil ; les exports (GPX, itinéraire PDF, envoi vers la voiture) se débloquent avec le Trip Pass unique de 14 jours ou avec Pro.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "FAQ — Péages, vignettes, carburant et recharge VE | AutoVere",
    description:
      "Réponses sur la précision des estimations, les portails de péage officiels, les classes moto et camping-car, la planification de recharge VE et les comptes.",
  },
};

export const FR_PARTNERS: InfoPageContent = {
  eyebrow: "Partenaires",
  title: "Nous avançons aux côtés de ceux qui font vivre la route.",
  intro:
    "Nous renvoyons toujours vers les opérateurs officiels de péage et de vignette, et nous sommes heureux de collaborer avec des acteurs du tourisme, de la location et du monde de la moto, en Europe, aux États-Unis et au Canada.",
  sections: [
    {
      heading: "Les opérateurs officiels de péage et de vignette vers qui nous vous orientons",
      body: "Chaque paiement se fait directement sur le site de l'opérateur — nous ne prenons jamais de commission au passage.",
      links: [
        { label: "ASFINAG — Autriche", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Suisse", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Norvège", url: "https://www.autopass.no/" },
        { label: "Telepass — Italie", url: "https://www.telepass.com/" },
        { label: "DARS — Slovénie", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Floride", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Voici qui travaille avec nous",
      items: [
        "Loueurs de camping-cars et de caravanes qui veulent offrir à leurs clients des devis de voyage clairs et honnêtes",
        "Organisateurs de circuits moto et clubs qui préparent des itinéraires dans les Alpes ou le long des fjords norvégiens",
        "Réseaux de recharge pour véhicules électriques et applications de planification d'itinéraires",
        "Offices de tourisme qui souhaitent mettre en avant des cols pittoresques, des routes côtières et des liaisons en ferry",
      ],
    },
    {
      heading: "Rejoignez le réseau",
      body: "Nous sommes basés à Kristiansand, en Norvège, mais nous aimons collaborer avec des partenaires où qu'ils se trouvent. Vous gérez une flotte, une entreprise de circuits ou un service de péage et souhaitez parler intégration, co-marketing ou partenariat de données ? Écrivez-nous à partners@autovere.com, nous avons hâte d'échanger avec vous.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Partenaires — Opérateurs de péage officiels et partenaires de voyage | AutoVere",
    description:
      "AutoVere renvoie directement vers les opérateurs officiels de péage et de vignette, et collabore avec des flottes de location, organisateurs de circuits et réseaux de recharge.",
  },
};

export const FR_PRIVACY: InfoPageContent = {
  eyebrow: "Politique de confidentialité",
  title: "Votre itinéraire vous appartient.",
  intro:
    "AutoVere est exploité par KM TECH LABS, à Kristiansand, en Norvège. Nous limitons la collecte de données au strict nécessaire pour vous fournir une estimation de coût précise.",
  sections: [
    {
      heading: "Ce que nous conservons",
      items: [
        "Les données de voyage (départ, destination, véhicule et préférences) utilisées pour produire votre estimation",
        "Les véhicules et voyages enregistrés — stockés localement dans votre propre navigateur, pas sur nos serveurs",
        "Des statistiques d'utilisation agrégées et non identifiantes pour améliorer le planificateur",
      ],
    },
    {
      heading: "Ce que nous ne faisons pas",
      items: [
        "Nous ne vendons ni ne louons jamais de données personnelles",
        "Nous ne suivons pas votre position en temps réel",
        "Nous n'exigeons pas de compte pour planifier, exporter ou partager un voyage",
      ],
    },
    {
      heading: "Vos droits selon le RGPD",
      body: "En tant qu'opérateur basé en Norvège/EEE, nous respectons le RGPD. Vous pouvez demander l'accès, la rectification, la suppression, la limitation, la portabilité, ou vous opposer au traitement. Effacer les données stockées dans votre navigateur supprime immédiatement vos véhicules et voyages enregistrés.",
    },
    {
      heading: "Cookies et analytique",
      body: "Nous utilisons un stockage essentiel pour mémoriser votre région, votre langue et votre garage. Toute analytique que nous menons est agrégée et ne peut pas vous identifier individuellement.",
    },
    {
      heading: "Contact",
      body: "Questions sur la confidentialité : privacy@autovere.com — KM TECH LABS, Kristiansand, Norvège. Mentions régionales : la confidentialité aux États-Unis est couverte sur /us/legal, et les droits PIPEDA canadiens ainsi que la loi 25 du Québec sont couverts sur /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Confidentialité — RGPD, stockage local et vos données | AutoVere",
    description:
      "Comment KM TECH LABS traite les données de voyage, le garage stocké localement, les cookies et vos droits RGPD sur AutoVere.",
  },
};

export const FR_TERMS: InfoPageContent = {
  eyebrow: "Conditions d'utilisation",
  title: "Des conditions claires, pour planifier en toute confiance.",
  intro:
    "En utilisant AutoVere, vous acceptez ces conditions. Elles existent pour préciser honnêtement ce qu'est — et ce que n'est pas — une estimation de coût.",
  sections: [
    {
      heading: "Des estimations, pas des factures",
      body: "Tous les coûts affichés sont des estimations indicatives basées sur des tarifs publiés et des prix régionaux moyens. Les péages, vignettes, carburant, recharge et tarifs de ferry réels peuvent varier selon la classe du véhicule, la saison, l'heure de la journée et les changements des opérateurs. Vérifiez toujours auprès du portail officiel avant de voyager.",
    },
    {
      heading: "Utilisation sûre et légale",
      items: [
        "N'utilisez pas AutoVere en conduisant — planifiez avant de prendre la route",
        "Respectez le code de la route local, les règles de classe de véhicule et les restrictions de tunnels ou de cols",
        "Le scraping automatisé, la revente de notre contenu ou sa présentation comme des tarifs officiels ne sont pas autorisés",
      ],
    },
    {
      heading: "Liens et services tiers",
      body: "Les liens vers les opérateurs de péage, compagnies de ferry et réseaux de recharge sont fournis par commodité. Ces services ont leurs propres conditions et tarifs, et KM TECH LABS n'est pas responsable de leur contenu ni de leurs transactions.",
    },
    {
      heading: "Responsabilité",
      body: "AutoVere est fourni « en l'état ». Dans la mesure permise par la loi, KM TECH LABS n'est pas responsable des coûts, amendes, traversées manquées ou pertes résultant de la confiance accordée à une estimation.",
    },
    {
      heading: "Droit applicable",
      body: "Ces conditions sont régies par le droit norvégien, avec Kristiansand comme lieu de règlement convenu, sans préjudice des protections consommateurs impératives de votre pays de résidence.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Conditions d'utilisation — Avertissement sur les estimations et usage loyal | AutoVere",
    description:
      "Conditions d'utilisation d'AutoVere par KM TECH LABS : estimations indicatives, utilisation sûre, liens tiers, responsabilité et droit applicable.",
  },
};
