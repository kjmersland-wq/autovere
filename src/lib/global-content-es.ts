import type { InfoPageContent } from "@/lib/info-content";

const DISCLAIMER = "Estimaciones orientativas — verifica siempre con los portales oficiales.";

export const ES_HOW_IT_WORKS: InfoPageContent = {
  eyebrow: "Cómo funciona",
  title: "De una idea aproximada a un viaje por carretera con coste calculado, en tres pasos tranquilos.",
  intro:
    "AutoVere convierte un origen y un destino en una imagen de costes transparente y transfronteriza —peajes, viñetas, combustible, recarga y ferris— para coches, autocaravanas y motos de viaje.",
  sections: [
    {
      heading: "1 — Cuéntanos tu viaje",
      body: "Introduce tu origen y destino, elige el tipo de vehículo y la fuente de combustible o energía, y selecciona tus preferencias de ruta, como desvíos escénicos, evitar peajes o incluir ferris.",
      items: [
        "Perfiles de coche, autocaravana/camper o moto de viaje",
        "Gasolina, diésel o eléctrico, con tus propios datos de depósito, batería y consumo",
        "Dispositivos de telepeaje como AutoPASS, Telepass, Bip&Go, SunPass o E-ZPass",
      ],
    },
    {
      heading: "2 — Calculamos el coste real de cada kilómetro",
      body: "Cada país o estado de tu ruta se calcula por separado, según su propio modelo de peaje —viñetas electrónicas, barreras de peaje por distancia, cinturones urbanos o autopistas gratuitas— además de los precios locales de combustible y recarga rápida.",
      items: [
        "Desglose de peajes y viñetas país por país, con el detalle de cada estación de peaje",
        "Descuentos para moto aplicados allí donde los operadores publican tarifas reducidas",
        "Costes de ferris y puertos de montaña detallados como partidas independientes",
        "Optimizador inteligente de combustible y recarga eléctrica con un margen de seguridad del 75 % de la autonomía",
      ],
    },
    {
      heading: "3 — Sal a la carretera",
      body: "Exporta un archivo GPX para tu GPS, guarda el itinerario en Mi Garaje o compártelo con tus compañeros de viaje. Cada línea de peaje enlaza con el portal oficial para que puedas pagar antes de cruzar la frontera.",
      links: [
        { label: "ASFINAG (Austria)", url: "https://www.asfinag.at/" },
        { label: "AutoPASS (Noruega)", url: "https://www.autopass.no/" },
        { label: "Telepass (Italia)", url: "https://www.telepass.com/" },
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Cómo funciona AutoVere — Planificación de costes de viajes por carretera transfronterizos",
    description:
      "Descubre cómo AutoVere calcula los peajes, viñetas, combustible, recarga eléctrica y ferris país por país para coches, autocaravanas y motos de viaje.",
  },
};

export const ES_PRICING: InfoPageContent = {
  eyebrow: "Precios",
  title: "Planifica con libertad. Pasa a un plan de pago solo cuando el viaje se vuelva ambicioso.",
  intro:
    "La planificación de viajes del día a día es gratuita. Los planes de pago son para quienes viven en su vehículo durante semanas y quieren rutas más avanzadas, exportaciones sin conexión y aventuras guardadas ilimitadas.",
  sections: [
    {
      heading: "Explorer — Gratis",
      body: "Todo lo que necesitas para una escapada de fin de semana o un cruce de dos países.",
      items: [
        "Estimaciones de viaje ilimitadas por Europa, Estados Unidos y Canadá",
        "Desgloses de peajes, viñetas y ferris por país y por estado",
        "Estimaciones de combustible y recarga eléctrica con enlaces a los portales oficiales",
        "Hasta 3 vehículos y 5 viajes guardados en Mi Garaje",
      ],
    },
    {
      heading: "Voyager — 4,90 € / mes",
      body: "Para el gran tour de verano, la ruta por los fiordos y el trayecto de costa a costa.",
      items: [
        "Vehículos y aventuras guardados ilimitados",
        "Exportación GPX con los puntos de paso de peajes y recarga",
        "Consejos inteligentes de arbitraje de combustible y alertas en tramos largos",
        "Actualizaciones prioritarias cuando cambian los precios de peajes o viñetas",
      ],
    },
    {
      heading: "Flota y Socios — desde 29 € / mes",
      body: "Para flotas de alquiler, concesionarios de autocaravanas, clubes de motociclistas y operadores turísticos.",
      items: [
        "Perfiles multivehículo e itinerarios compartidos para tu equipo",
        "Hojas de viaje personalizadas para entregar a tus clientes",
        "Acceso a la API de estimaciones de costes (actualmente en vista previa privada)",
      ],
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Precios — Planificación de viajes gratuita, plan Voyager opcional | AutoVere",
    description:
      "AutoVere es gratuito para la planificación de viajes del día a día. Los planes Voyager y Flota añaden viajes guardados ilimitados, exportación GPX y herramientas para socios.",
  },
};

export const ES_FAQ: InfoPageContent = {
  eyebrow: "Preguntas frecuentes",
  title: "Todo lo que los viajeros nos preguntan antes de ponerse en marcha.",
  intro:
    "Respuestas claras sobre cómo se elaboran nuestras estimaciones, de dónde proceden los datos y qué es lo que aún tienes que comprar tú mismo.",
  sections: [
    {
      heading: "¿Qué precisión tienen las estimaciones de costes?",
      body: "Nos basamos en las tarifas de peaje publicadas, los precios de las viñetas y los precios medios regionales de combustible y recarga. Los costes reales varían según los mercados del combustible, las tarifas estacionales, los precios según la hora del día y las normas de clase de vehículo, así que trata cada cifra como una indicación bien fundamentada y confírmala en el portal oficial antes de viajar.",
    },
    {
      heading: "¿Vendéis viñetas o pases de peaje?",
      body: "No. Deliberadamente nunca los revendemos. Cada línea de peaje enlaza directamente con el operador oficial —ASFINAG, via.admin.ch, AutoPASS, Telepass, 407 ETR, SunPass y otros— para que siempre pagues el precio real, sin margen de reventa.",
    },
    {
      heading: "¿Cómo se gestionan las motos?",
      body: "Las motos de viaje se calculan como su propia clase de vehículo. Allí donde los operadores publican tarifas reducidas para moto aplicamos un descuento orientativo, los cinturones urbanos noruegos se muestran como gratuitos para las dos ruedas, y dispones de un radar de seguridad y equipo específico para motoristas en los puertos de montaña.",
    },
    {
      heading: "¿Qué ocurre con las autocaravanas y campers?",
      body: "Las autocaravanas se calculan por peso y clase de eje cuando corresponde, y mostramos avisos de altura, longitud y peso para túneles, puertos de montaña y puentes bajos a lo largo de la ruta.",
    },
    {
      heading: "¿Dais soporte a los vehículos eléctricos?",
      body: "Sí. Elige Eléctrico (VE) e introduce el tamaño de tu batería y tu consumo. Planificamos paradas de recarga de alta potencia con un margen de seguridad del 75 % de la autonomía y te mostramos las redes que encontrarás —Ionity, Fastned, Tesla Supercharger, Electrify America y FLO.",
    },
    {
      heading: "¿Necesito una cuenta?",
      body: "No. Cálculo instantáneo — no necesitas cuenta para previsualizar. Mi Garaje guarda tus vehículos y viajes en tu propio dispositivo; las exportaciones (GPX, itinerario PDF, enviar al coche) se desbloquean con el Trip Pass único de 14 días o con Pro.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Preguntas frecuentes — Peajes, viñetas, combustible y recarga VE | AutoVere",
    description:
      "Respuestas sobre la precisión de las estimaciones, los portales oficiales de peaje, las clases de moto y autocaravana, la planificación de recarga VE y las cuentas.",
  },
};

export const ES_PARTNERS: InfoPageContent = {
  eyebrow: "Socios",
  title: "Trabajamos con quienes mantienen la carretera en movimiento.",
  intro:
    "AutoVere enlaza con operadores oficiales de peaje y colabora con empresas de viajes, alquiler y motociclismo en Europa, Estados Unidos y Canadá.",
  sections: [
    {
      heading: "Operadores oficiales de peaje y viñetas con los que enlazamos",
      body: "Cada compra se realiza en el propio sitio del operador. Nunca actuamos como revendedores.",
      links: [
        { label: "ASFINAG — Austria", url: "https://www.asfinag.at/" },
        { label: "via.admin.ch — Suiza", url: "https://via.admin.ch/" },
        { label: "AutoPASS — Noruega", url: "https://www.autopass.no/" },
        { label: "Telepass — Italia", url: "https://www.telepass.com/" },
        { label: "DARS — Eslovenia", url: "https://www.dars.si/" },
        { label: "407 ETR — Ontario", url: "https://www.407etr.com/" },
        { label: "SunPass — Florida", url: "https://www.sunpass.com/" },
      ],
    },
    {
      heading: "Quién colabora con nosotros",
      items: [
        "Flotas de alquiler de autocaravanas y campers que buscan presupuestos de viaje transparentes",
        "Operadores de tours en moto y clubes de motociclistas que planifican rutas alpinas y por los fiordos",
        "Redes de recarga eléctrica y aplicaciones de planificación de rutas",
        "Oficinas de turismo que promocionan puertos de montaña escénicos, carreteras costeras y cruces en ferri",
      ],
    },
    {
      heading: "Trabaja con nosotros",
      body: "KM TECH LABS tiene su sede en Kristiansand, Noruega. Si gestionas una flota, un negocio de tours o un servicio de peaje y quieres hablar de integración, comarketing o alianzas de datos, escríbenos a partners@autovere.com.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Socios — Operadores oficiales de peaje y socios de viaje | AutoVere",
    description:
      "AutoVere enlaza directamente con operadores oficiales de peaje y viñetas, y colabora con flotas de alquiler, operadores turísticos y redes de recarga.",
  },
};

export const ES_PRIVACY: InfoPageContent = {
  eyebrow: "Política de privacidad",
  title: "Tu ruta es asunto tuyo.",
  intro:
    "AutoVere está operado por KM TECH LABS, Kristiansand, Noruega. Reducimos la recopilación de datos al mínimo necesario para ofrecerte una estimación de costes precisa.",
  sections: [
    {
      heading: "Qué almacenamos",
      items: [
        "Los datos del viaje (origen, destino, vehículo y preferencias) usados para generar tu estimación",
        "Los vehículos y viajes guardados —almacenados localmente en tu propio navegador, no en nuestros servidores",
        "Estadísticas de uso agregadas y no identificativas para mejorar el planificador",
      ],
    },
    {
      heading: "Qué no hacemos",
      items: [
        "No vendemos ni alquilamos datos personales",
        "No rastreamos tu ubicación en tiempo real",
        "No exigimos una cuenta para planificar, exportar o compartir un viaje",
      ],
    },
    {
      heading: "Tus derechos conforme al RGPD",
      body: "Como operador con sede en Noruega/EEE, cumplimos el RGPD. Puedes solicitar acceso, rectificación, supresión, limitación o portabilidad, u oponerte al tratamiento. Borrar el almacenamiento de tu navegador elimina de inmediato tus vehículos y viajes guardados.",
    },
    {
      heading: "Cookies y analítica",
      body: "Utilizamos almacenamiento esencial para recordar tu región, idioma y garaje. Cualquier analítica que llevemos a cabo está agregada y no puede identificarte individualmente.",
    },
    {
      heading: "Contacto",
      body: "Preguntas sobre privacidad: privacy@autovere.com — KM TECH LABS, Kristiansand, Noruega. Avisos regionales: la privacidad en Estados Unidos se recoge en /us/legal, y los derechos de la PIPEDA canadiense y la Ley 25 de Quebec se recogen en /ca/legal.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Política de privacidad — RGPD, almacenamiento local y tus datos | AutoVere",
    description:
      "Cómo trata KM TECH LABS los datos del viaje, el garaje almacenado localmente, las cookies y tus derechos RGPD en AutoVere.",
  },
};

export const ES_TERMS: InfoPageContent = {
  eyebrow: "Términos de servicio",
  title: "Términos claros, para que planifiques con confianza.",
  intro:
    "Al usar AutoVere aceptas estos términos. Existen para mantener expectativas honestas sobre lo que es —y lo que no es— una estimación de costes.",
  sections: [
    {
      heading: "Estimaciones, no facturas",
      body: "Todos los costes mostrados son estimaciones orientativas basadas en tarifas publicadas y precios medios regionales. Los peajes, viñetas, combustible, recarga y tarifas de ferri reales pueden variar según la clase de vehículo, la temporada, la hora del día y los cambios de los operadores. Verifica siempre con el portal oficial antes de viajar.",
    },
    {
      heading: "Uso seguro y lícito",
      items: [
        "No utilices AutoVere mientras conduces —planifica antes de salir",
        "Cumple las normas de tráfico locales, las normas de clase de vehículo y las restricciones de puertos de montaña o túneles",
        "No se permite el scraping automatizado, la reventa de nuestro contenido ni presentarlo como precios oficiales",
      ],
    },
    {
      heading: "Enlaces y servicios de terceros",
      body: "Los enlaces a operadores de peaje, compañías de ferris y redes de recarga se ofrecen por comodidad. Esos servicios tienen sus propios términos y precios, y KM TECH LABS no es responsable de su contenido ni de sus transacciones.",
    },
    {
      heading: "Responsabilidad",
      body: "AutoVere se ofrece «tal cual». En la medida permitida por la ley, KM TECH LABS no es responsable de costes, multas, cruces perdidos o pérdidas derivadas de la confianza depositada en una estimación.",
    },
    {
      heading: "Ley aplicable",
      body: "Estos términos se rigen por la legislación noruega, con Kristiansand como sede acordada, sin perjuicio de las protecciones obligatorias al consumidor de tu país de residencia.",
    },
  ],
  note: DISCLAIMER,
  meta: {
    title: "Términos de servicio — Aviso sobre estimaciones y uso justo | AutoVere",
    description:
      "Los términos de servicio de AutoVere de KM TECH LABS: estimaciones orientativas, uso seguro, enlaces de terceros, responsabilidad y ley aplicable.",
  },
};
