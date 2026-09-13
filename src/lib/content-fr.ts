/**
 * French translations for content that lives in data modules
 * (compliance, pass intel, corridor map, trip data).
 *
 * Keyed by the exact English source string so components can wrap any
 * data-driven label with `tr(...)` from `useTr()`.
 */
export const CONTENT_FR: Record<string, string> = {
  /* ---------------- Map layer: viewpoints ---------------- */
  "Scenic Viewpoints & Photo Stops": "Points de vue pittoresques et arrêts photo",
  "Panorama rest area": "Aire de repos panoramique",
  "Lakeside viewpoint": "Point de vue au bord du lac",
  "Alpine summit overlook": "Belvédère de sommet alpin",
  "Coastal cliff lookout": "Belvédère sur falaise côtière",
  "Valley overlook · picnic tables · photo spot":
    "Vue sur la vallée · tables de pique-nique · spot photo",
  "Free parking · short walk to the shoreline":
    "Parking gratuit · courte marche jusqu'au rivage",
  "Glacier panorama · café · restrooms": "Panorama sur glacier · café · toilettes",
  "Sunset viewpoint · motorhome-friendly parking":
    "Point de vue au coucher du soleil · parking adapté aux camping-cars",
  /* ---------------- Compliance: heavy motorhome systems ---------------- */
  Austria: "Autriche",
  Switzerland: "Suisse",
  Slovenia: "Slovénie",
  Germany: "Allemagne",
  France: "France",
  Italy: "Italie",
  Norway: "Norvège",
  Sweden: "Suède",
  Denmark: "Danemark",
  Spain: "Espagne",
  Portugal: "Portugal",
  Netherlands: "Pays-Bas",
  Belgium: "Belgique",
  "United Kingdom": "Royaume-Uni",
  "Belgium & Netherlands": "Belgique et Pays-Bas",
  Ferries: "Ferries",

  "GO-Box (ASFINAG)": "GO-Box (ASFINAG)",
  "Motorhomes over 3.5 t maximum permissible weight may not use the car vignette. You need a GO-Box on-board unit, charged per kilometre by axle count and EURO class. Pick one up at a GO point near the border before your first motorway kilometre.":
    "Les camping-cars de plus de 3,5 t de PTAC ne peuvent pas utiliser la vignette autoroutière voiture. Vous avez besoin d'un boîtier embarqué GO-Box, facturé au kilomètre selon le nombre d'essieux et la classe EURO. Procurez-vous-en un dans un point GO près de la frontière avant votre premier kilomètre d'autoroute.",
  "LSVA / PSVA heavy vehicle charge": "Redevance poids lourds LSVA / PSVA",
  "Above 3.5 t the Swiss motorway vignette no longer covers you. Foreign motorhomes normally pay the flat-rate PSVA (per-day or per-year) declared at the border customs post; ID-based LSVA applies to commercial units.":
    "Au-delà de 3,5 t, la vignette autoroutière suisse ne vous couvre plus. Les camping-cars étrangers paient normalement la PSVA forfaitaire (par jour ou par an) déclarée au poste de douane frontalier ; la LSVA basée sur l'identifiant s'applique aux véhicules commerciaux.",
  "DarsGo unit": "Boîtier DarsGo",
  "Slovenian motorways charge vehicles over 3.5 t through a DarsGo on-board unit with free-flow gantries. Register online or at a DarsGo service point; the e-vignette is invalid for your weight class.":
    "Les autoroutes slovènes facturent les véhicules de plus de 3,5 t via un boîtier embarqué DarsGo et des portiques en flux libre. Inscrivez-vous en ligne ou dans un point de service DarsGo ; l'e-vignette n'est pas valable pour votre classe de poids.",
  "No toll for private motorhomes": "Aucun péage pour les camping-cars privés",
  "Privately used motorhomes are exempt from the German Lkw-Maut regardless of weight, but weight-based speed limits and overtaking bans still apply.":
    "Les camping-cars à usage privé sont exemptés de la Lkw-Maut allemande quel que soit leur poids, mais les limitations de vitesse et interdictions de dépasser liées au poids s'appliquent toujours.",

  /* ---------------- Compliance: clearance advisories ---------------- */
  "Alpine underpasses & village arches": "Passages souterrains alpins et arches de villages",
  "Several Alpine valley roads (Susa, Vinschgau, Maurienne) and old town gateways drop below 3.2 m. Trust posted signs over your navigation app and follow the signed HGV/camper diversion where offered.":
    "Plusieurs routes de vallées alpines (Suse, Val Venosta, Maurienne) et portes de vieilles villes descendent sous 3,2 m. Fiez-vous à la signalisation plutôt qu'à votre application de navigation et suivez la déviation poids lourds/camping-cars indiquée si elle existe.",
  "Tunnel height & LPG restrictions": "Restrictions de hauteur et de GPL dans les tunnels",
  "Mont Blanc, Fréjus and Gotthard road tunnels apply strict height, length and LPG-cylinder rules. Vehicles above 4.0 m are routed to dedicated lanes and may face convoy timing.":
    "Les tunnels routiers du Mont-Blanc, du Fréjus et du Gothard appliquent des règles strictes de hauteur, longueur et bouteilles de GPL. Les véhicules de plus de 4,0 m sont dirigés vers des voies dédiées et peuvent être soumis à des horaires de convoi.",
  "Ferry deck clearance": "Hauteur libre sur le pont du ferry",
  "Book ferries in the correct height and length bracket. Under-declaring your height means a re-fare at the ramp or refused boarding.":
    "Réservez les ferries dans la bonne catégorie de hauteur et de longueur. Sous-déclarer votre hauteur entraîne une refacturation à la rampe ou un refus d'embarquement.",
  "Roof box, aerials & solar": "Coffre de toit, antennes et panneaux solaires",
  "Measure to the highest fixed point — solar panels, satellite domes and roof boxes typically add 15–25 cm over the plate height.":
    "Mesurez jusqu'au point fixe le plus haut — panneaux solaires, dômes satellite et coffres de toit ajoutent généralement 15 à 25 cm à la hauteur inscrite sur la carte grise.",

  /* ---------------- Compliance: speed rules ---------------- */
  "100 km/h (over 3.5 t)": "100 km/h (au-delà de 3,5 t)",
  "110 km/h (over 3.5 t)": "110 km/h (au-delà de 3,5 t)",
  "80 km/h with caravan/heavy load": "80 km/h avec caravane/charge lourde",
  "Above 3.5 t you are capped at 100 km/h on the Autobahn and 80 km/h on rural roads, and overtaking bans for heavy vehicles apply to you.":
    "Au-delà de 3,5 t, vous êtes limité à 100 km/h sur l'Autobahn et 80 km/h sur les routes secondaires, et les interdictions de dépasser pour poids lourds s'appliquent à vous.",
  "Over 3.5 t: 110 km/h motorway, 100 km/h dual carriageway, 80 km/h single carriageway. Keep 50 m from the vehicle ahead.":
    "Au-delà de 3,5 t : 110 km/h sur autoroute, 100 km/h sur voie rapide à deux chaussées, 80 km/h sur route à une chaussée. Gardez 50 m avec le véhicule précédent.",
  "100 km/h motorway and 80 km/h on main roads; the left-most lane of three is closed to vehicles over 3.5 t.":
    "100 km/h sur autoroute et 80 km/h sur routes principales ; la voie la plus à gauche sur trois est interdite aux véhicules de plus de 3,5 t.",
  "Motorhomes over 3.5 t are limited to 80 km/h; many fjord roads sign 60 km/h with passing places only.":
    "Les camping-cars de plus de 3,5 t sont limités à 80 km/h ; de nombreuses routes de fjords indiquent 60 km/h avec seulement des zones de dépassement.",
  "Heavy motorhomes are limited to 100 km/h and must use the lorry lane in tunnels with lane separation.":
    "Les camping-cars lourds sont limités à 100 km/h et doivent utiliser la voie poids lourds dans les tunnels à voies séparées.",

  /* ---------------- Compliance: LEZ ---------------- */
  "Crit'Air vignette": "Vignette Crit'Air",
  "A Crit'Air sticker must be displayed inside the windscreen in every French ZFE. Classes are based on EURO standard and fuel; motorhomes are classed like the base vehicle.":
    "Une vignette Crit'Air doit être affichée à l'intérieur du pare-brise dans chaque ZFE française. Les classes sont basées sur la norme EURO et le carburant ; les camping-cars sont classés comme le véhicule de base.",
  "€3.81 incl. postage": "3,81 € frais de port inclus",
  "Order 3–4 weeks ahead for delivery abroad": "Commandez 3 à 4 semaines à l'avance pour une livraison à l'étranger",
  "Required for motorcycles and scooters too.": "Requise aussi pour les motos et scooters.",
  "Umweltplakette (green zone 4)": "Umweltplakette (zone verte 4)",
  "A green sticker (Schadstoffgruppe 4) is required in ~50 Umweltzonen. Enforcement is by camera and patrol; a missing badge is a €100 fine.":
    "Une vignette verte (Schadstoffgruppe 4) est requise dans environ 50 Umweltzonen. Le contrôle se fait par caméra et patrouille ; l'absence de vignette entraîne une amende de 100 €.",
  "€6–€30 depending on issuer": "6 à 30 € selon l'émetteur",
  "Order 2 weeks ahead or buy at a TÜV/DEKRA station on arrival":
    "Commandez 2 semaines à l'avance ou achetez-la sur place dans une station TÜV/DEKRA",
  "Motorcycles are exempt from German Umweltzonen.": "Les motos sont exemptées des Umweltzonen allemandes.",
  "LEZ online registration": "Inscription en ligne à la ZFE",
  "No sticker — foreign plates must be registered online before the first entry into Brussels, Antwerp, Ghent, Rotterdam or Amsterdam. Cameras match plates automatically.":
    "Pas de vignette — les plaques étrangères doivent être enregistrées en ligne avant la première entrée à Bruxelles, Anvers, Gand, Rotterdam ou Amsterdam. Les caméras reconnaissent automatiquement les plaques.",
  "Free registration; fines from €150": "Inscription gratuite ; amendes à partir de 150 €",
  "Register at least 24 hours before entry": "Inscrivez-vous au moins 24 heures avant l'entrée",
  "Motorcycles are currently outside the Belgian and Dutch LEZ scope.":
    "Les motos sont actuellement hors du champ des ZFE belges et néerlandaises.",
  "ULEZ + Congestion Charge": "ULEZ + péage urbain (Congestion Charge)",
  "Greater London's ULEZ charges non-compliant vehicles £12.50/day, plus £15 Congestion Charge in the central zone on weekdays. Pay online or by Auto Pay.":
    "L'ULEZ du Grand Londres facture 12,50 £/jour aux véhicules non conformes, plus 15 £ de péage urbain dans la zone centrale en semaine. Payez en ligne ou par Auto Pay.",
  "£12.50/day ULEZ · £15/day Congestion Charge": "12,50 £/jour ULEZ · 15 £/jour péage urbain",
  "Pay up to 3 days after travel": "Vous pouvez payer jusqu'à 3 jours après le trajet",
  "Pre-Euro 3 motorcycles pay ULEZ; Congestion Charge does not apply to motorcycles.":
    "Les motos antérieures à Euro 3 paient l'ULEZ ; le péage urbain ne s'applique pas aux motos.",

  /* ---------------- Compliance: toll tags ---------------- */
  "Norway, Sweden, Denmark — city rings, bridges, Øresund & Storebælt":
    "Norvège, Suède, Danemark — ceintures urbaines, ponts, Øresund et Storebælt",
  "Free-flow gantries, no barrier stop": "Portiques en flux libre, aucun arrêt à la barrière",
  "France, Spain, Portugal, Italy — barrier motorways":
    "France, Espagne, Portugal, Italie — autoroutes à barrières",
  "Yellow 'T' / télépéage lanes, barrier lifts automatically":
    "Voies jaunes « T » / télépéage, la barrière se lève automatiquement",
  "US turnpikes, express lanes and bridges": "Autoroutes à péage américaines, voies express et ponts",
  "Open-road tolling gantries, no cash booth": "Portiques de péage en flux libre, pas de guichet espèces",
  "Ontario Highway 407 ETR and 412/418": "Highway 407 ETR et 412/418 en Ontario",
  "Transponder rate instead of camera video-toll charge":
    "Tarif transpondeur au lieu de la facturation caméra vidéo-péage",

  /* ---------------- Corridor map ---------------- */
  "EV Fast Chargers": "Bornes de recharge rapide VE",
  "Fuel Stations": "Stations-service",
  "RV Campgrounds & Service Areas": "Campings et aires de service pour camping-cars",
  "Mountain Passes": "Cols de montagne",
  "Ferry Terminals": "Terminaux de ferry",
  "Live Government Fuel Data (prix-carburants)": "Données gouvernementales en direct sur le carburant (prix-carburants)",
  "Station prices published by the French Ministry of Economy open data feed.":
    "Prix des stations publiés par le flux de données ouvertes du ministère français de l'Économie.",
  "Live E-Control Spritpreisrechner": "Calculateur de prix E-Control en direct",
  "Austrian regulator E-Control publishes station-level prices, updated through the day.":
    "Le régulateur autrichien E-Control publie les prix par station, mis à jour tout au long de la journée.",
  "National Average Benchmark (EAFO / EU Bulletin)": "Référence de moyenne nationale (EAFO / Bulletin UE)",
  "Indicative national averages from EAFO and the EU Weekly Oil Bulletin.":
    "Moyennes nationales indicatives issues de l'EAFO et du Bulletin pétrolier hebdomadaire de l'UE.",
  "per gallon": "par gallon",
  "per litre": "par litre",
  "24/7 · restrooms · café": "24h/24 · toilettes · café",
  "Dump station · fresh water · overnight pitches": "Station de vidange · eau claire · emplacements pour la nuit",
  "Ferry terminal · check-in 30 min before departure": "Terminal de ferry · enregistrement 30 min avant le départ",
  "24/7": "24h/24",
  "HGV/RV lanes": "Voies poids lourds/camping-cars",
  "Café": "Café",
  AdBlue: "AdBlue",
  "Car wash": "Lavage auto",
  Europe: "Europe",
  "United States": "États-Unis",
  Canada: "Canada",

  /* Camp spots */
  "Aire de camping-car municipale": "Aire de camping-car municipale",
  "Aire · France": "Aire · France",
  "Stellplatz am Fluss": "Stellplatz au bord de la rivière",
  "Stellplatz · Germany/Austria": "Stellplatz · Allemagne/Autriche",
  "Camping Alpenblick": "Camping Alpenblick",
  "Rated campsite · Alps": "Camping noté · Alpes",
  "Bobilparkering Fjordsyn": "Bobilparkering Fjordsyn",
  "Bobil pitch · Norway": "Emplacement camping-car · Norvège",
  "Sosta camper Lago": "Sosta camper Lago",
  "Sosta · Italy": "Sosta · Italie",
  "KOA Holiday Resort": "KOA Holiday Resort",
  "Full hook-up RV park": "Camping camping-car tout raccordé",
  "State Park Campground": "Camping de parc d'État",
  "Public campground": "Camping public",
  "Interstate Travel Plaza": "Interstate Travel Plaza",
  "Overnight service area": "Aire de service pour la nuit",
  "Lakeside RV Resort": "Lakeside RV Resort",
  "Premium RV resort": "Camping camping-car haut de gamme",
  "Provincial Park Campground": "Camping de parc provincial",
  "Halte routière VR": "Halte routière VR",
  "Roadside VR halt": "Halte routière pour camping-cars",
  "KOA Campground": "KOA Campground",
  "Mountain View RV Park": "Mountain View RV Park",
  "Rated RV park": "Camping camping-car noté",
  "Dump station": "Station de vidange",
  "Fresh water": "Eau claire",
  "Electric hook-up": "Raccordement électrique",
  "Overnight pitches": "Emplacements pour la nuit",
  "Grey water": "Eaux grises",
  WiFi: "Wi-Fi",
  Showers: "Douches",
  Laundry: "Laverie",
  Restaurant: "Restaurant",
  "Fjord view": "Vue sur le fjord",
  Toilets: "Toilettes",
  Shade: "Ombre",
  "Walk to town": "À pied du centre-ville",
  "50-amp": "50 A",
  "30/50-amp": "30/50 A",
  Sewer: "Tout-à-l'égout",
  Pool: "Piscine",
  "Potable water": "Eau potable",
  Trails: "Sentiers",
  "RV dump": "Vidange camping-car",
  Propane: "Propane",
  "24/7 fuel": "Carburant 24h/24",
  Firewood: "Bois de chauffage",
  "Full hook-up": "Raccordement complet",
  "Overnight parking": "Parking de nuit",

  /* ---------------- Mountain passes ---------------- */
  "Grossglockner High Alpine Road": "Grossglockner Hochalpenstrasse",
  "🇦🇹 Austria · Salzburg ↔ Carinthia": "🇦🇹 Autriche · Salzbourg ↔ Carinthie",
  "2 504 m · Hochtor summit": "2 504 m · sommet du Hochtor",
  "Early May – late October (gates close nightly)":
    "Début mai – fin octobre (barrières fermées la nuit)",
  "€40.00 car day ticket · €30.00 motorcycle · motorhomes €40.00 (over 3.5 t on request)":
    "40,00 € billet journée voiture · 30,00 € moto · camping-car 40,00 € (au-delà de 3,5 t sur demande)",
  "Toll road, not part of the Austrian vignette network. Gates open ~05:30–06:00 and close 19:30–21:30 depending on the month — plan to be through before dusk and enjoy the Edelweissspitze detour.":
    "Route à péage, ne faisant pas partie du réseau de vignettes autoroutières autrichien. Les barrières ouvrent vers 5h30–6h00 et ferment entre 19h30 et 21h30 selon le mois — prévoyez de passer avant la tombée de la nuit et profitez du détour par l'Edelweissspitze.",
  "Riders get a reduced ticket and a dedicated Bikers Point at Fuschertörl.":
    "Les motards bénéficient d'un billet réduit et d'un Bikers Point dédié à Fuschertörl.",
  "Passo dello Stelvio (Stelvio Pass)": "Passo dello Stelvio (col du Stelvio)",
  "🇮🇹 Italy · Bormio ↔ Trafoi, South Tyrol": "🇮🇹 Italie · Bormio ↔ Trafoi, Tyrol du Sud",
  "2 758 m · 48 numbered hairpins on the north ramp":
    "2 758 m · 48 lacets numérotés sur le versant nord",
  "Usually late May/June – early November, snow dependent":
    "Généralement fin mai/juin – début novembre, selon la neige",
  "Free of charge": "Gratuit",
  "Europe's most photogenic hairpin ladder. Ride or drive it early — coaches and cyclists fill the switchbacks from 10:00. Expect 8–12 °C colder at the summit than in Bormio.":
    "L'échelle de lacets la plus photogénique d'Europe. Roulez-y tôt — cars et cyclistes envahissent les virages dès 10h00. Attendez-vous à 8 à 12 °C de moins au sommet qu'à Bormio.",
  "Tight, off-camber hairpins: stay wide on entry and watch for gravel after rain.":
    "Lacets serrés en dévers : restez large à l'entrée et attention au gravier après la pluie.",
  "Furka & Grimsel Passes": "Cols de la Furka et du Grimsel",
  "🇨🇭 Switzerland · Valais ↔ Uri ↔ Bern": "🇨🇭 Suisse · Valais ↔ Uri ↔ Berne",
  "Furka 2 429 m · Grimsel 2 164 m": "Furka 2 429 m · Grimsel 2 164 m",
  "Roughly mid-June – late October": "Environ mi-juin – fin octobre",
  "Free passes · CHF 40 motorway vignette still required for Swiss motorways":
    "Cols gratuits · vignette autoroutière de 40 CHF toujours requise pour les autoroutes suisses",
  "Check the live pass board before committing — snow chains can be mandated at short notice even in summer. The Furka–Grimsel–Susten triangle is a perfect full-day loop.":
    "Vérifiez le panneau d'état des cols en direct avant de vous engager — les chaînes à neige peuvent être imposées avec un court préavis, même en été. Le triangle Furka–Grimsel–Susten est une boucle idéale pour une journée entière.",
  "Cool mornings at altitude: pack a thermal layer and waterproofs.":
    "Matinées fraîches en altitude : prévoyez une couche thermique et des vêtements imperméables.",
  "Trollstigen & Sognefjellet": "Trollstigen et Sognefjellet",
  "🇳🇴 Norway · Møre og Romsdal · Jotunheimen": "🇳🇴 Norvège · Møre og Romsdal · Jotunheimen",
  "Trollstigen 858 m · Sognefjellet 1 434 m (highest road in Northern Europe)":
    "Trollstigen 858 m · Sognefjellet 1 434 m (route la plus haute d'Europe du Nord)",
  "Trollstigen late May – October · Sognefjellet May – November":
    "Trollstigen fin mai – octobre · Sognefjellet mai – novembre",
  "Free roads · parking fee at the Trollstigen viewpoint":
    "Routes gratuites · frais de parking au point de vue de Trollstigen",
  "Both are National Tourist Routes with hairpins and narrow shoulders. Trollstigen has periodic rockfall closures — check the live status the morning you travel. Vehicles over 12.4 m are not permitted on Trollstigen.":
    "Ce sont deux Routes touristiques nationales avec lacets et accotements étroits. Trollstigen connaît des fermetures périodiques dues aux chutes de pierres — vérifiez le statut en direct le matin de votre départ. Les véhicules de plus de 12,4 m sont interdits sur Trollstigen.",
  "Wet granite and painted lines get slick in fjord drizzle — brake early into the hairpins.":
    "Le granit mouillé et les marquages au sol deviennent glissants sous la bruine des fjords — freinez tôt avant les lacets.",
  "Icefields Parkway (Highway 93N)": "Icefields Parkway (Highway 93N)",
  "🇨🇦 Alberta · Lake Louise ↔ Jasper": "🇨🇦 Alberta · Lake Louise ↔ Jasper",
  "2 088 m · Bow Summit": "2 088 m · Bow Summit",
  "Open year-round, with winter storm closures": "Ouverte toute l'année, avec fermetures lors des tempêtes hivernales",
  "Parks Canada pass required: C$11.00 adult/day or C$75.25 Discovery Pass (annual, per vehicle)":
    "Laissez-passer Parcs Canada requis : 11,00 CAD adulte/jour ou 75,25 CAD Passe Découverte (annuelle, par véhicule)",
  "232 km of glaciers with no fuel between Lake Louise and Saskatchewan River Crossing — top up before you start. From 1 Nov to 31 Mar winter tires or carried chains are mandatory on Highway 93N.":
    "232 km de glaciers sans carburant entre Lake Louise et Saskatchewan River Crossing — faites le plein avant de partir. Du 1er novembre au 31 mars, pneus hiver ou chaînes à bord sont obligatoires sur la Highway 93N.",
  "Wildlife on the shoulder at dawn and dusk — ride the centre of your lane and keep speed down.":
    "Faune sur le bas-côté à l'aube et au crépuscule — roulez au centre de votre voie et réduisez votre vitesse.",
  "Tail of the Dragon (US 129, Deals Gap)": "Tail of the Dragon (US 129, Deals Gap)",
  "🇺🇸 North Carolina ↔ Tennessee": "🇺🇸 Caroline du Nord ↔ Tennessee",
  "318 curves in 11 miles (17.7 km)": "318 virages sur 17,7 km",
  "Open year-round · best March – November, ice risk in winter":
    "Ouverte toute l'année · idéale de mars à novembre, risque de verglas en hiver",
  "Free — no tolls": "Gratuit — aucun péage",
  "Strictly enforced 30 mph (48 km/h) limit with unmarked patrols and roadside speed radar. No guardrails on many curves and zero fuel on the strip — fill up in Robbinsville or Tapoco.":
    "Limite de 48 km/h strictement contrôlée par des patrouilles banalisées et des radars au bord de la route. Pas de glissières sur de nombreux virages et aucune station sur ce tronçon — faites le plein à Robbinsville ou Tapoco.",
  "Photographers shoot every curve — ride your own pace, not the camera's. Trailers and RVs should use US 74 instead.":
    "Des photographes se postent à chaque virage — roulez à votre rythme, pas au leur. Remorques et camping-cars devraient plutôt emprunter la US 74.",
  "Open · winter tyres / chains required": "Ouverte · pneus hiver/chaînes requis",
  Open: "Ouverte",
  "Closed for the season": "Fermée pour la saison",
  "Opening/closing window · check live status": "Fenêtre d'ouverture/fermeture · vérifiez le statut en direct",
  "€30.00 motorcycle day ticket (reduced)": "30,00 € billet journée moto (réduit)",

  /* ---------------- Border tips ---------------- */
  "Refuel in Austria before the Brenner Pass": "Faites le plein en Autriche avant le col du Brenner",
  "Diesel and petrol run roughly 15% cheaper in Austria than in Italy. Fill the tank around Innsbruck or Matrei am Brenner — the last Austrian stations before the border are the cheapest on the corridor.":
    "Diesel et essence coûtent environ 15 % moins cher en Autriche qu'en Italie. Faites le plein autour d'Innsbruck ou de Matrei am Brenner — les dernières stations autrichiennes avant la frontière sont les moins chères du trajet.",
  "≈ €12–18 saved on a 60 L tank": "≈ 12 à 18 € économisés sur un réservoir de 60 l",
  "Plan a fuel stop at Matrei am Brenner": "Prévoyez un arrêt carburant à Matrei am Brenner",
  "Swiss motorways need the CHF 40 annual vignette":
    "Les autoroutes suisses nécessitent la vignette autoroutière annuelle de 40 CHF",
  "Switzerland has no day or week option — one sticker (or the e-vignette) costs CHF 40 and is valid for the whole calendar year, even if you only transit for two hours. Motorcycles need their own vignette.":
    "La Suisse ne propose pas d'option journée ou semaine — une vignette (ou l'e-vignette) coûte 40 CHF et est valable toute l'année civile, même pour un simple transit de deux heures. Les motos ont besoin de leur propre vignette.",
  "Switch to Smart Bypass to route around Swiss motorways on a short transit leg":
    "Basculez sur Détour intelligent pour contourner les autoroutes suisses sur un court trajet de transit",
  "Try the 🧭 Smart Bypass variant": "Essayez la variante 🧭 Détour intelligent",
  "Luxembourg fuel arbitrage on the Benelux corridor":
    "Arbitrage carburant au Luxembourg sur le trajet Benelux",
  "Luxembourg keeps some of the lowest excise duties in Western Europe — expect 15–25 cents/litre less than France, Belgium or Germany. Stations near Wasserbillig, Schengen and Berchem are the classic top-up points.":
    "Le Luxembourg conserve certaines des accises les plus basses d'Europe de l'Ouest — attendez-vous à 15 à 25 centimes/litre de moins qu'en France, en Belgique ou en Allemagne. Les stations près de Wasserbillig, Schengen et Berchem sont les points de ravitaillement classiques.",
  "≈ €10–15 per tank versus neighbouring countries": "≈ 10 à 15 € par plein par rapport aux pays voisins",
  "Add a Luxembourg fuel stop": "Ajouter un arrêt carburant au Luxembourg",
  "Cross into Spain (or Andorra) before you refuel":
    "Passez en Espagne (ou en Andorre) avant de faire le plein",
  "Spanish pump prices sit well below French ones, and Andorra is cheaper still. Coming down the A9/AP-7, hold out past La Jonquera; on the Atlantic side, Irún and Behobia are the border bargains.":
    "Les prix à la pompe espagnols sont bien inférieurs aux prix français, et l'Andorre l'est encore plus. En descendant l'A9/AP-7, tenez bon jusqu'après La Jonquera ; côté atlantique, Irún et Behobia sont les bonnes affaires frontalières.",
  "≈ 20–30 cents/litre versus France": "≈ 20 à 30 centimes/litre par rapport à la France",
  "Add a La Jonquera or Irún fuel stop": "Ajouter un arrêt carburant à La Jonquera ou Irún",
  "State fuel-tax arbitrage": "Arbitrage de taxe carburant entre états",
  "State excise makes a real difference: California and Pennsylvania sit at the top, while Texas, Missouri, Mississippi and Arizona are consistently cheap. Fill up just before entering a high-tax state.":
    "La taxe d'État fait une vraie différence : la Californie et la Pennsylvanie sont en tête, tandis que le Texas, le Missouri, le Mississippi et l'Arizona sont constamment bon marché. Faites le plein juste avant d'entrer dans un état à forte taxe.",
  "Up to US$0.70/gal between neighbouring states": "Jusqu'à 0,70 USD/gallon entre états voisins",
  "Fuel is usually cheaper south of the 49th": "Le carburant est généralement moins cher au sud du 49e parallèle",
  "Once currency and litres-vs-gallons are converted, US fuel typically lands 20–30% below Canadian pumps — biggest gaps around BC and Québec. Cross with a low tank, return with a full one (within duty-free allowances).":
    "Une fois la devise et les litres/gallons convertis, le carburant américain se situe généralement 20 à 30 % en dessous des prix canadiens — les plus gros écarts se trouvent en Colombie-Britannique et au Québec. Traversez avec un réservoir presque vide, revenez avec le plein (dans les limites hors taxes).",
  "≈ C$25–40 per tank on a border run": "≈ 25 à 40 CAD par plein lors d'un aller-retour frontalier",

  /* ---------------- Border crossings ---------------- */
  "Germany → Austria": "Allemagne → Autriche",
  "Open border · random ID checks": "Frontière ouverte · contrôles d'identité aléatoires",
  "Free movement inside Schengen. Bavaria runs intermittent spot checks on the A8/A93 — keep passports or ID cards within reach and you'll roll straight through.":
    "Libre circulation au sein de l'espace Schengen. La Bavière effectue des contrôles ponctuels intermittents sur les A8/A93 — gardez passeports ou cartes d'identité à portée de main et vous passerez sans encombre.",
  "Photo ID for every occupant (random checks)": "Pièce d'identité avec photo pour chaque occupant (contrôles aléatoires)",
  "Austrian motorway vignette valid before the first motorway metre":
    "Vignette autoroutière autrichienne valable avant le premier mètre d'autoroute",
  "Warning triangle, hi-vis vest and first-aid kit on board":
    "Triangle de signalisation, gilet haute visibilité et trousse de secours à bord",
  "Typically 0–10 min": "Généralement 0 à 10 min",
  "Austria → Italy (Brenner)": "Autriche → Italie (Brenner)",
  "Open border · occasional customs patrol": "Frontière ouverte · patrouille douanière occasionnelle",
  "No passport control at the Brenner, but Italian Guardia di Finanza patrols do stop vehicles. Switch to Telepass lanes only if you have a transponder fitted.":
    "Pas de contrôle de passeport au Brenner, mais les patrouilles de la Guardia di Finanza italienne arrêtent bien des véhicules. N'empruntez les voies Telepass que si vous avez un transpondeur installé.",
  "Photo ID on board": "Pièce d'identité avec photo à bord",
  "Brenner autostrada toll paid at the barrier (card, cash or Telepass)":
    "Péage de l'autostrada du Brenner payé à la barrière (carte, espèces ou Telepass)",
  "Crit'Air-style city rules do not apply, but Italian ZTL zones do":
    "Les règles de type Crit'Air ne s'appliquent pas ici, mais les zones ZTL italiennes, oui",
  "Typically 0–15 min at the toll plaza": "Généralement 0 à 15 min à la gare de péage",
  "Swiss borders (Schengen, non-EU customs)": "Frontières suisses (Schengen, hors union douanière UE)",
  "Customs control · goods declaration": "Contrôle douanier · déclaration de marchandises",
  "Switzerland is in Schengen but outside the EU customs union, so customs officers can and do stop vehicles. Declare goods above the duty-free allowance and buy the vignette before the first motorway.":
    "La Suisse fait partie de Schengen mais pas de l'union douanière de l'UE, les douaniers peuvent donc arrêter des véhicules, et le font. Déclarez les marchandises au-delà de la franchise et achetez la vignette avant la première autoroute.",
  "CHF 40 motorway vignette (annual) or e-vignette per vehicle":
    "Vignette autoroutière de 40 CHF (annuelle) ou e-vignette par véhicule",
  "Customs declaration for goods over CHF 300 per person":
    "Déclaration en douane pour les marchandises au-delà de 300 CHF par personne",
  "Meat, dairy and alcohol allowances are strictly enforced":
    "Les franchises pour la viande, les produits laitiers et l'alcool sont strictement appliquées",
  "0–20 min · longer at Basel and Chiasso on weekends":
    "0 à 20 min · plus long à Bâle et Chiasso le week-end",
  "UK ↔ France (Channel Tunnel & Dover–Calais)":
    "Royaume-Uni ↔ France (tunnel sous la Manche et Douvres–Calais)",
  "Full passport control & customs": "Contrôle passeport complet et douane",
  "Post-Brexit juxtaposed controls mean both British and French officers check you before boarding. Arrive 60–90 min ahead in peak season and have every document to hand.":
    "Les contrôles juxtaposés post-Brexit signifient que les agents britanniques et français vous contrôlent avant l'embarquement. Arrivez 60 à 90 min à l'avance en haute saison et ayez tous vos documents à portée de main.",
  "Valid passport for every traveller (ID cards no longer accepted for UK entry)":
    "Passeport valide pour chaque voyageur (les cartes d'identité ne sont plus acceptées pour entrer au Royaume-Uni)",
  "EU Entry/Exit System biometric registration on first crossing":
    "Enregistrement biométrique du système Entrée/Sortie de l'UE lors du premier passage",
  "Customs declaration for goods, alcohol, tobacco and pets (animal health certificate)":
    "Déclaration en douane pour marchandises, alcool, tabac et animaux (certificat sanitaire)",
  "UK sticker on the vehicle and headlamp beam deflectors":
    "Autocollant UK sur le véhicule et déflecteurs de faisceau de phares",
  "30–120 min in summer peaks": "30 à 120 min aux pics d'été",
  "Croatia ↔ Bosnia & Herzegovina (Neum corridor)":
    "Croatie ↔ Bosnie-Herzégovine (corridor de Neum)",
  "Passport control · EU external border": "Contrôle de passeport · frontière extérieure de l'UE",
  "The Neum corridor crosses out of and back into the EU within 9 km. Green card insurance is essential, and queues build sharply on July/August weekends. The Pelješac Bridge bypasses it entirely.":
    "Le corridor de Neum fait sortir puis rentrer dans l'UE sur 9 km. L'assurance carte verte est indispensable, et les files d'attente s'allongent fortement les week-ends de juillet/août. Le pont de Pelješac permet de le contourner entièrement.",
  "Passport for every occupant (two stamps in 20 minutes)":
    "Passeport pour chaque occupant (deux tampons en 20 minutes)",
  "Green Card motor insurance valid for BiH": "Assurance auto carte verte valable pour la Bosnie-Herzégovine",
  "Vehicle registration document in the driver's name or a notarised letter":
    "Carte grise au nom du conducteur ou lettre notariée",
  "15–90 min in high season": "15 à 90 min en haute saison",
  "USA ↔ Canada land border": "Frontière terrestre États-Unis ↔ Canada",
  "Passport control · CBP / CBSA inspection": "Contrôle de passeport · inspection CBP / ASFC",
  "Every crossing is a full immigration and customs stop. NEXUS lanes cut the wait dramatically at Peace Arch, Detroit–Windsor and Niagara. Declare all food, alcohol, cannabis and firearms — penalties are steep.":
    "Chaque passage implique un arrêt complet d'immigration et de douane. Les voies NEXUS réduisent nettement l'attente à Peace Arch, Détroit–Windsor et Niagara. Déclarez toute nourriture, alcool, cannabis et armes à feu — les sanctions sont sévères.",
  "Passport, NEXUS card or enhanced driver's licence":
    "Passeport, carte NEXUS ou permis de conduire amélioré",
  "Vehicle registration and proof of insurance valid in the destination country":
    "Carte grise et attestation d'assurance valables dans le pays de destination",
  "Declare food, alcohol, tobacco, cannabis and pets; firearms need advance paperwork":
    "Déclarez nourriture, alcool, tabac, cannabis et animaux ; les armes à feu nécessitent des démarches préalables",
  "Electronic toll transponders (E-ZPass, 407 ETR) are not interchangeable across the border":
    "Les transpondeurs de télépéage électroniques (E-ZPass, 407 ETR) ne sont pas interchangeables entre les deux pays",
  "10–60 min · check live CBP border wait times":
    "10 à 60 min · vérifiez les temps d'attente frontaliers CBP en direct",

  "Rider Safety & Gear Radar": "Radar de sécurité et d'équipement motard",
  "Camper Clearance & Weight Radar": "Radar de hauteur et de poids pour camping-car",
  "Driver Safety Radar": "Radar de sécurité conducteur",
  "🧤 Gear & legal kit": "🧤 Équipement et matériel obligatoire",
  "🏔️ Mountain pass alerts": "🏔️ Alertes cols de montagne",
  "⛽ Long-stretch fuel alerts": "⛽ Alertes longs tronçons sans carburant",
  "📏 Clearance warnings": "📏 Alertes de gabarit",
  "⚖️ Weight & axle limits": "⚖️ Limites de poids et d'essieux",
  "🛠️ Services": "🛠️ Services",
  "🚗 On the road": "🚗 Sur la route",
  "🏔️ Pass conditions": "🏔️ Conditions des cols",
  "France: CE-approved gloves are mandatory for rider and pillion, and a high-vis vest must be carried within reach.": "France : des gants homologués CE sont obligatoires pour le conducteur et le passager, et un gilet haute visibilité doit être à portée de main.",
  "Austria & Germany: carry a first-aid kit meeting DIN 13167 (motorcycle standard) — small, and checked at roadside stops.": "Autriche et Allemagne : emportez une trousse de secours conforme à la norme DIN 13167 (norme moto) — petite, et contrôlée lors des arrêts routiers.",
  "Keep your vest, kit and documents on top of the pannier so a check takes seconds.": "Gardez votre gilet, votre trousse et vos documents sur le dessus de la sacoche pour qu'un contrôle ne prenne que quelques secondes.",
  "Two stretches exceed 180 km between open stations — top up before the pass climbs.": "Deux tronçons dépassent 180 km entre stations ouvertes — faites le plein avant la montée du col.",
  "Night-time pumps on the alpine leg are card-only; carry a backup card.": "Les pompes de nuit sur le tronçon alpin sont uniquement à carte ; ayez une carte de secours.",
  "Two tunnels on this route cap height at 3.2 m — your 3.05 m profile clears with margin.": "Deux tunnels sur cet itinéraire limitent la hauteur à 3,2 m — votre gabarit de 3,05 m passe avec une marge.",
  "One low village archway (2.9 m) was bypassed via the valley road automatically.": "Une arche de village basse (2,9 m) a été automatiquement contournée par la route de vallée.",
  "Route verified for vehicles up to 3.5 t; a 7.5 t restriction on the old pass road is avoided.": "Itinéraire vérifié pour les véhicules jusqu'à 3,5 t ; une restriction de 7,5 t sur l'ancienne route du col est évitée.",
  "Crosswind advisory on the coastal bridge section — reduce speed with a high side profile.": "Alerte vent traversier sur la section du pont côtier — réduisez votre vitesse avec un profil haut.",
  "Three overnight-friendly service areas with fresh water and grey-water disposal along the way.": "Trois aires de service adaptées aux nuitées, avec eau claire et vidange des eaux grises en cours de route.",
  "Winter equipment rules apply on the alpine section between October and April.": "Les règles d'équipement hivernal s'appliquent sur la section alpine entre octobre et avril.",
  "Rest stops are mapped every 2 hours so the drive stays fresh and relaxed.": "Des aires de repos sont prévues toutes les 2 heures pour un trajet reposant et détendu.",
  "Every toll gantry on this route accepts contactless cards — no cash needed.": "Chaque portique de péage sur cet itinéraire accepte les cartes sans contact — pas besoin d'espèces.",
  "Stelvio Pass (2,757 m) — 48 hairpins, open, dry tarmac forecast until early evening.": "Col du Stelvio (2 757 m) — 48 lacets, ouvert, prévision de bitume sec jusqu'en début de soirée.",
  "Grossglockner High Alpine Road — toll road, gates close at 21:00; ride it before dusk.": "Grossglockner Hochalpenstrasse — route à péage, barrières fermées à 21h00 ; roulez-y avant la tombée de la nuit.",
  "Furka Pass — clear and open today, light crosswinds on the western ramp.": "Col de la Furka — dégagé et ouvert aujourd'hui, léger vent traversier sur le versant ouest.",
  "Trollstigen — single-lane sections with tourist traffic; take the early morning slot.": "Trollstigen — sections à voie unique avec trafic touristique ; privilégiez tôt le matin.",
  "Tail of the Dragon (US-129) — 318 curves in 11 miles; watch for gravel on the inside lines.": "Tail of the Dragon (US-129) — 318 virages sur 18 km ; attention au gravier sur les lignes intérieures.",
  "Icefields Parkway — stunning but exposed; wildlife on the road at dawn and dusk.": "Icefields Parkway — magnifique mais exposée ; faune sur la route à l'aube et au crépuscule.",
  "🇩🇪 Germany": "🇩🇪 Allemagne",
  "🇦🇹 Austria": "🇦🇹 Autriche",
  "🇨🇭 Switzerland": "🇨🇭 Suisse",
  "🇮🇹 Italy": "🇮🇹 Italie",
  "🇳🇴 Norway": "🇳🇴 Norvège",
  "⛴️ Ferries": "⛴️ Ferries",
  "🏙️ Illinois": "🏙️ Illinois",
  "🌄 Colorado": "🌄 Colorado",
  "🌉 California": "🌉 Californie",
  "🌴 Florida": "🌴 Floride",
  "🍁 Ontario": "🍁 Ontario",
  "🌲 Nova Scotia": "🌲 Nouvelle-Écosse",
  "🏔️ British Columbia": "🏔️ Colombie-Britannique",
  "No car tolls on German autobahns": "Aucun péage voiture sur les autoroutes allemandes",
  "Ticket system, 8 checkpoints": "Système à tickets, 8 points de contrôle",
  "Ticket system, 5 checkpoints": "Système à tickets, 5 points de contrôle",
  "AutoPASS gantries — motorcycles pass free": "Portiques AutoPASS — les motos passent gratuitement",
  "Vehicle + 2 passengers": "Véhicule + 2 passagers",
  "Reserve seat": "Réserver une place",
  "Reserve": "Réserver",
  "Reserve ahead": "Réservez à l'avance",
  "6 gantries, I-PASS rate": "6 portiques, tarif I-PASS",
  "Plate-pay surcharge included": "Supplément lecture de plaque inclus",
  "Peak weekend rate": "Tarif de pointe le week-end",
  "Southbound, FasTrak": "Direction sud, FasTrak",
  "Weekday peak": "Heure de pointe en semaine",
  "Evening rate": "Tarif du soir",
  "SunPass rate, 9 gantries": "Tarif SunPass, 9 portiques",
  "Vehicle under 22ft + driver": "Véhicule de moins de 6,7 m + conducteur",
  "Vehicle under 20ft + 2 adults": "Véhicule de moins de 6,1 m + 2 adultes",
  "Peak rate, transponder": "Tarif de pointe, transpondeur",
  "Per-trip camera fee": "Frais caméra par trajet",
  "Two-axle vehicle": "Véhicule à deux essieux",
  "Toll-free since 2008": "Gratuit depuis 2008",
  "Digital vignette": "Vignette numérique",
  "🇳🇴 Norway · Fjord ferries": "🇳🇴 Norvège · Ferries des fjords",
  "🌊 Scandinavia & Baltic": "🌊 Scandinavie et Baltique",
  "🇬🇧 English Channel": "🇬🇧 Manche",
  "☘️ Irish Sea": "☘️ Mer d'Irlande",
  "☀️ Mediterranean & Adriatic": "☀️ Méditerranée et Adriatique",
  "🇺🇸 US marine highways": "🇺🇸 Voies maritimes américaines",
  "🇨🇦 Canadian coastal ferries": "🇨🇦 Ferries côtiers canadiens",
  "10–45 min per crossing": "10 à 45 min par traversée",
  "Every 20–40 min, most run 24/7": "Toutes les 20 à 40 min, la plupart 24h/24",
  "NOK 120–290 per car": "120 à 290 NOK par voiture",
  "NOK 55–120 per motorcycle": "55 à 120 NOK par moto",
  "Register an AutoPASS ferjekort for an automatic ~50% discount — no cash, no queue at the booth.": "Enregistrez une carte AutoPASS ferjekort pour une remise automatique d'environ 50 % — pas d'espèces, pas de file au guichet.",
  "AutoPASS ferjekort −50%": "AutoPASS ferjekort −50 %",
  "45 min – 20 h depending on crossing": "45 min – 20 h selon la traversée",
  "Scandlines every 30 min; overnight lines 1–2 sailings a day": "Scandlines toutes les 30 min ; lignes de nuit 1 à 2 départs par jour",
  "€45–210 car + driver": "45 à 210 € voiture + conducteur",
  "€28–120 motorcycle + rider": "28 à 120 € moto + conducteur",
  "Book overnight cabins early in July and August — the Oslo–Kiel and Tallinn routes sell out weeks ahead.": "Réservez tôt les cabines de nuit en juillet et août — les lignes Oslo–Kiel et vers Tallinn se remplissent des semaines à l'avance.",
  "Cabins book out early": "Les cabines partent vite",
  "35 min (LeShuttle) · 90–120 min (ferry)": "35 min (LeShuttle) · 90 à 120 min (ferry)",
  "Up to 4 departures an hour at peak": "Jusqu'à 4 départs par heure aux heures de pointe",
  "£70–190 car + passengers": "70 à 190 £ voiture + passagers",
  "£45–95 motorcycle + rider": "45 à 95 £ moto + conducteur",
  "LeShuttle keeps you in your vehicle — the fastest option with a roof box or a loaded bike.": "LeShuttle vous fait rester dans votre véhicule — l'option la plus rapide avec un coffre de toit ou une moto chargée.",
  "Flexi tickets recommended": "Billets flexibles recommandés",
  "2 h (fast craft) – 3 h 30 min": "2 h (navire rapide) – 3 h 30",
  "4–8 sailings a day per route": "4 à 8 départs par jour et par ligne",
  "€95–230 car + driver": "95 à 230 € voiture + conducteur",
  "€60–130 motorcycle + rider": "60 à 130 € moto + conducteur",
  "Wild Atlantic Way traffic peaks at weekends — a midweek morning sailing is calmer and cheaper.": "Le trafic de la Wild Atlantic Way culmine le week-end — une traversée en semaine le matin est plus calme et moins chère.",
  "50 min (island hops) – 20 h (overnight)": "50 min (sauts d'île en île) – 20 h (traversée de nuit)",
  "Island hops hourly; long crossings daily": "Sauts d'île en île toutes les heures ; longues traversées quotidiennes",
  "€55–260 car + driver": "55 à 260 € voiture + conducteur",
  "€30–140 motorcycle + rider": "30 à 140 € moto + conducteur",
  "Motorcycles usually board first and pay roughly 40% less — arrive 45 min before departure.": "Les motos embarquent généralement en premier et paient environ 40 % de moins — arrivez 45 min avant le départ.",
  "Bikes board first": "Les motos embarquent en premier",
  "60 min – 38 h (Alaska)": "60 min – 38 h (Alaska)",
  "San Juans hourly; Alaska weekly": "San Juan toutes les heures ; Alaska hebdomadaire",
  "$62–180 vehicle + driver": "62 à 180 USD véhicule + conducteur",
  "$28–70 motorcycle + rider": "28 à 70 USD moto + conducteur",
  "Vehicle reservations open two months ahead on Washington State Ferries and are essential in summer.": "Les réservations véhicules ouvrent deux mois à l'avance sur Washington State Ferries et sont indispensables en été.",
  "1 h 35 min – 7 h (Newfoundland)": "1 h 35 – 7 h (Terre-Neuve)",
  "Every 1–2 h on the Vancouver Island runs": "Toutes les 1 à 2 h sur les lignes de l'île de Vancouver",
  "C$96–150 vehicle + 2 adults": "96 à 150 CAD véhicule + 2 adultes",
  "C$45–70 motorcycle + rider": "45 à 70 CAD moto + conducteur",
  "Book a Saver fare on BC Ferries — cheapest sailings are before 09:00 and after 19:00.": "Réservez un tarif Saver sur BC Ferries — les traversées les moins chères sont avant 9h00 et après 19h00.",
  "Saver fares available": "Tarifs Saver disponibles",
  "⚡ Smart EV Charging Optimizer": "⚡ Optimiseur intelligent de recharge VE",
  "⛽ Smart Fuel Stop Optimizer": "⛽ Optimiseur intelligent d'arrêt carburant",
  "24/7 forecourt": "Station 24h/24",

  "I have AutoPASS / EPASS24": "J'ai AutoPASS / EPASS24",
  "I have Telepass / Bip&Go / Fulli": "J'ai Telepass / Bip&Go / Fulli",
  "I have SunPass / E-ZPass": "J'ai SunPass / E-ZPass",
  "Vignettes & e-vignettes": "Vignettes et e-vignettes",
  "Ticket-based motorway tolls": "Péages autoroutiers à ticket",
  "Urban low-emission zones": "Zones à faibles émissions urbaines",
  "State toll roads & turnpikes": "Autoroutes à péage d'État",
  "HOV / Express lanes": "Voies HOV / express",
  "Bridge & tunnel tolls": "Péages de ponts et tunnels",
  "Highway 407 ETR": "Highway 407 ETR",
  "Provincial tolls & bridges": "Péages provinciaux et ponts",
  "BC Ferries crossings": "Traversées BC Ferries",

  "Fuel is ~15% cheaper in Austria than Italy — refuel before crossing the Brenner Pass.": "Le carburant est environ 15 % moins cher en Autriche qu'en Italie — faites le plein avant de franchir le col du Brenner.",
  "Luxembourg is the cheapest tank in Western Europe — top up before entering Belgium or France.": "Le Luxembourg offre le plein le moins cher d'Europe de l'Ouest — faites le plein avant d'entrer en Belgique ou en France.",
  "Diesel in Norway runs well above Swedish prices — fill near the border at Svinesund.": "Le diesel en Norvège est bien plus cher qu'en Suède — faites le plein près de la frontière à Svinesund.",
  "Fuel in Georgia is ~20% cheaper than Florida — fill up before the state line on I-95.": "Le carburant en Géorgie est environ 20 % moins cher qu'en Floride — faites le plein avant la limite d'état sur l'I-95.",
  "Skip turnpike service plazas: prices run 10–15% above exits one mile off the highway.": "Évitez les aires de service des autoroutes à péage : les prix sont 10 à 15 % plus élevés qu'à une sortie proche de l'autoroute.",
  "California is the most expensive tank on the West Coast — fill in Nevada or Arizona first.": "La Californie a le plein le plus cher de la côte Ouest — faites d'abord le plein au Nevada ou en Arizona.",
  "Alberta fuel is ~20% cheaper than British Columbia — fill before Kicking Horse Pass.": "Le carburant en Alberta est environ 20 % moins cher qu'en Colombie-Britannique — faites le plein avant le col de Kicking Horse.",
  "Québec charges more per litre than Ontario — top up before the provincial border on the 417.": "Le Québec facture plus par litre que l'Ontario — faites le plein avant la frontière provinciale sur la 417.",
  "Northern Ontario pumps run a premium — refuel in Sault Ste. Marie before Highway 17.": "Les pompes du nord de l'Ontario sont plus chères — faites le plein à Sault-Sainte-Marie avant la Highway 17.",
  "Sognefjell (RV55), Norway — 194 km without a verified 24/7 station. Fill in Lom.": "Sognefjellet (RV55), Norvège — 194 km sans station 24h/24 vérifiée. Faites le plein à Lom.",
  "Grossglockner High Alpine Road — 186 km loop with no fuel above the toll gate.": "Grossglockner Hochalpenstrasse — boucle de 186 km sans carburant au-delà de la barrière de péage.",
  "US-50 “Loneliest Road”, Nevada — 226 km between verified stations. Fill in Ely.": "US-50 « la route la plus solitaire », Nevada — 226 km entre stations vérifiées. Faites le plein à Ely.",
  "I-10 Van Horn → Fort Stockton, Texas — 190 km with limited overnight service.": "I-10 Van Horn → Fort Stockton, Texas — 190 km avec un service nocturne limité.",
  "Highway 17 Wawa → White River — 198 km with no verified overnight fuel.": "Highway 17 Wawa → White River — 198 km sans carburant nocturne vérifié.",
  "Icefields Parkway, Alberta — 232 km between Lake Louise and Jasper; Saskatchewan Crossing only.": "Icefields Parkway, Alberta — 232 km entre Lake Louise et Jasper ; seul Saskatchewan Crossing sur le trajet.",
  "Eleven hairpins climbing a sheer wall — viewing platform over the valley.": "Onze lacets grimpant une paroi abrupte — plateforme d'observation surplombant la vallée.",
  "Eight bridges hopping island to island straight over the open sea.": "Huit ponts sautant d'île en île directement au-dessus de la mer ouverte.",
  "48 km of alpine theatre topping out at 2,504 m.": "48 km de théâtre alpin culminant à 2 504 m.",
  "48 numbered hairpins — the classic rider pilgrimage.": "48 lacets numérotés — le pèlerinage classique des motards.",
  "Glacier views, smooth tarmac and a lakeside descent.": "Vues sur les glaciers, bitume lisse et descente au bord d'un lac.",
  "Turquoise canyon rim road on the way to the Côte d'Azur.": "Route en corniche au-dessus d'un canyon turquoise en route vers la Côte d'Azur.",
  "469 miles of ridgeline overlooks, no trucks, no tolls.": "755 km de points de vue sur crête, sans camions, sans péages.",
  "Big Sur cliffs, Bixby Bridge and endless Pacific vistas.": "Falaises de Big Sur, pont de Bixby et vues infinies sur le Pacifique.",
  "318 curves in 11 miles — ride it early to beat traffic.": "318 virages sur 18 km — roulez-y tôt pour éviter la circulation.",
  "Switchbacks to 10,947 ft on the doorstep of Yellowstone.": "Lacets jusqu'à 3 337 m aux portes de Yellowstone.",
  "Red-rock tunnels and canyon overlooks between two parks.": "Tunnels dans la roche rouge et points de vue sur canyon entre deux parcs.",
  "232 km between Lake Louise and Jasper past glaciers and turquoise lakes.": "232 km entre Lake Louise et Jasper le long de glaciers et de lacs turquoise.",
  "Highland cliffs, whale lookouts and ocean switchbacks.": "Falaises des Highlands, points d'observation des baleines et lacets face à l'océan.",
  "Howe Sound fjord views from Vancouver up to Whistler.": "Vues sur le fjord Howe Sound de Vancouver jusqu'à Whistler.",
  "St. Lawrence riverside villages and beluga-watching stops.": "Villages au bord du Saint-Laurent et arrêts d'observation des bélugas.",
  "Late May – October": "Fin mai – octobre",
  "Year-round": "Toute l'année",
  "May – early November": "Mai – début novembre",
  "June – October": "Juin – octobre",
  "Year-round (peak: October)": "Toute l'année (pic : octobre)",
  "April – November": "Avril – novembre",
  "Late May – mid October": "Fin mai – mi-octobre",
  "Year-round (winter tyres Oct–Apr)": "Toute l'année (pneus hiver oct.–avr.)",
  "May – October": "Mai – octobre",
  "Rauma, Norway": "Rauma, Norvège",
  "Møre og Romsdal, Norway": "Møre og Romsdal, Norvège",
  "Provence, France": "Provence, France",
  "Virginia – North Carolina": "Virginie – Caroline du Nord",
  "California": "Californie",
  "Tennessee": "Tennessee",
  "Montana – Wyoming": "Montana – Wyoming",
  "Utah": "Utah",
  "Alberta": "Alberta",
  "Cape Breton, Nova Scotia": "Cap-Breton, Nouvelle-Écosse",
  "British Columbia": "Colombie-Britannique",
  "Québec": "Québec",
  "Fjord-side pitches, 5 min walk to the ferry quay.": "Emplacements au bord du fjord, 5 min à pied du quai des ferries.",
  "Great overnight before Grossglockner — book in July/August.": "Excellente étape avant le Grossglockner — réservez en juillet/août.",
  "France's aire network is the cheapest overnight option en route south.": "Le réseau d'aires françaises est l'option de nuit la moins chère en route vers le sud.",
  "Large pitches; height/width friendly access road.": "Grands emplacements ; route d'accès adaptée aux gabarits hauts/larges.",
  "EV hookup": "Raccordement VE",
  "Chemical WC": "WC chimiques",
  "Electricity": "Électricité",
  "Bakery service": "Service boulangerie",
  "Full hookup": "Raccordement complet",
  "24h access": "Accès 24h/24",
  "Geiranger, Norway": "Geiranger, Norvège",
  "Salzburg, Austria": "Salzbourg, Autriche",
  "Haute-Savoie, France": "Haute-Savoie, France",
  "Lake Garda, Italy": "Lac de Garde, Italie",
  "Motorcycles are exempt from this e-vignette — nothing to buy.": "Les motos sont exemptées de cette e-vignette — rien à acheter.",
  "Only one validity period exists — it covers the whole stay.": "Une seule période de validité existe — elle couvre tout le séjour.",

  /* ---------------- Tolls guide ---------------- */
  "🇪🇺 Europe": "🇪🇺 Europe",
  "🇺🇸 United States": "🇺🇸 États-Unis",
  "🇨🇦 Canada": "🇨🇦 Canada",
  "Tolls & vignettes": "Péages et vignettes",
  "Every barrier, badge and sticker — made simple.": "Chaque barrière, badge et vignette — expliqués simplement.",
  "No guesswork, no fines. Here's what you need in each country, and how to get it before you set off.": "Pas de suppositions, pas d'amendes. Voici ce dont vous avez besoin dans chaque pays, et comment l'obtenir avant de partir.",
  "Austria digital vignette": "Vignette numérique autrichienne",
  "10-day, 2-month or annual. Plate-linked, activates instantly.": "10 jours, 2 mois ou annuelle. Liée à la plaque, activation instantanée.",
  "Switzerland e-vignette": "E-vignette suisse",
  "Annual only, valid 14 months. Motorcycles need their own.": "Annuelle uniquement, valable 14 mois. Les motos ont besoin de la leur.",
  "France & Italy ticket tolls": "Péages à ticket en France et en Italie",
  "Take a ticket, pay on exit. Telepass and Bip&Go tags speed it up.": "Prenez un ticket, payez à la sortie. Les badges Telepass et Bip&Go accélèrent le passage.",
  "Norway AutoPASS": "AutoPASS norvégien",
  "Automatic plate billing with discounts for registered EVs.": "Facturation automatique par plaque avec remises pour les VE enregistrés.",
  "E-ZPass network": "Réseau E-ZPass",
  "One transponder covers 19 states from Maine to Illinois.": "Un seul transpondeur couvre 19 états, du Maine à l'Illinois.",
  "SunPass (Florida)": "SunPass (Floride)",
  "Best value for Turnpike and Miami express lanes.": "Le meilleur rapport qualité-prix pour le Turnpike et les voies express de Miami.",
  "FasTrak (California)": "FasTrak (Californie)",
  "Required for bridge and express-lane discounts.": "Requis pour les remises sur les ponts et voies express.",
  "Plate-pay tolling": "Péage par lecture de plaque",
  "Rental cars often add a daily admin fee — worth checking first.": "Les voitures de location ajoutent souvent des frais administratifs journaliers — à vérifier au préalable.",
  "Ontario's all-electronic toll road. A transponder beats camera billing.": "L'autoroute à péage entièrement électronique de l'Ontario. Un transpondeur bat la facturation par caméra.",
  "Cobequid Pass": "Cobequid Pass",
  "Nova Scotia's only mainline toll — cash and card accepted.": "Le seul péage principal de la Nouvelle-Écosse — espèces et carte acceptées.",
  "Bridge tolls": "Péages de pont",
  "Confederation Bridge is charged on the way off PEI only.": "Le pont de la Confédération n'est facturé qu'en sortant de l'Île-du-Prince-Édouard.",

  /* ---------------- Corridor map: fuel & map extras ---------------- */
  "Est. rate": "Tarif estimé",
  "Petrol 95": "Essence 95",
  Diesel: "Diesel",
  "Open in Google Maps": "Ouvrir dans Google Maps",

  /* ---------------- Trip results: EV optimizer extras ---------------- */
  "Preferred network": "Réseau préféré",
  "Nearest high-power CCS hub": "Borne CCS haute puissance la plus proche",

  /* ---------------- Route tolls: distance & vignette details ---------------- */
  "Ticket system, charged per kilometre": "Système à ticket, facturé au kilomètre",
  "Private concession segments only — state-run e-TOLL motorways are free for cars":
    "Uniquement les tronçons concédés privés — les autoroutes publiques e-TOLL sont gratuites pour les voitures",
  "Remaining concession sections": "Tronçons concédés restants",
  "Includes electronic-only motorways": "Inclut les autoroutes à péage uniquement électronique",
  "Fixed plaza charges along the corridor": "Tarifs fixes aux gares de péage sur le trajet",
  "Automatic tolling — motorcycles pass free": "Péage automatique — les motos passent gratuitement",
  "10-day pass, valid nationwide": "Forfait 10 jours, valable dans tout le pays",
  "Annual e-vignette, plate-linked (no short tier exists)":
    "E-vignette annuelle, liée à la plaque (pas de formule courte)",
  "7-day e-vignette": "E-vignette 7 jours",
  "10-day electronic vignette": "Vignette électronique 10 jours",
  "10-day national e-vignette": "E-vignette nationale 10 jours",
  "Weekend/weekly e-vignette": "E-vignette week-end/semaine",
  "7-day road vignette": "Vignette routière 7 jours",

  /* ---------------- Route tolls: toll-free country/province notes ---------------- */
  "No motorway toll in Denmark — only the Storebælt and Øresund bridges are charged, and only if you cross them.":
    "Aucun péage autoroutier au Danemark — seuls les ponts du Storebælt et de l'Øresund sont payants, et uniquement si vous les empruntez.",
  "German autobahns are toll-free for cars and motorhomes up to 7.5 t.":
    "Les autoroutes allemandes sont gratuites pour les voitures et les camping-cars jusqu'à 7,5 t.",
  "Dutch motorways are free — only the Westerschelde and Kil tunnels charge.":
    "Les autoroutes néerlandaises sont gratuites — seuls les tunnels de la Westerschelde et du Kil sont payants.",
  "Belgian motorways are free for cars; the Liefkenshoek tunnel is the exception.":
    "Les autoroutes belges sont gratuites pour les voitures ; le tunnel du Liefkenshoek fait exception.",
  "Luxembourg motorways are toll-free (and the cheapest fuel on the corridor).":
    "Les autoroutes luxembourgeoises sont gratuites (et offrent le carburant le moins cher du trajet).",
  "Swedish motorways are free; only Stockholm/Göteborg congestion charges apply.":
    "Les autoroutes suédoises sont gratuites ; seuls les péages urbains de Stockholm/Göteborg s'appliquent.",
  "Finnish roads are toll-free.": "Les routes finlandaises sont gratuites.",
  "Estonian roads are toll-free for passenger vehicles.": "Les routes estoniennes sont gratuites pour les véhicules particuliers.",
  "Latvian roads are toll-free for passenger vehicles.": "Les routes lettones sont gratuites pour les véhicules particuliers.",
  "Lithuanian roads are toll-free for passenger vehicles.": "Les routes lituaniennes sont gratuites pour les véhicules particuliers.",
  "Only individual toll plazas (M50 eFlow) charge — none on this corridor.":
    "Seules certaines gares de péage isolées (M50 eFlow) sont payantes — aucune sur ce trajet.",
  "UK motorways are free apart from the M6 Toll and Dartford Crossing.":
    "Les autoroutes britanniques sont gratuites, à l'exception du M6 Toll et du Dartford Crossing.",
  "New Brunswick highways are toll-free.": "Les autoroutes du Nouveau-Brunswick sont gratuites.",
  "BC highways are toll-free since the Port Mann and Golden Ears tolls ended.":
    "Les autoroutes de Colombie-Britannique sont gratuites depuis la suppression des péages du Port Mann et du Golden Ears.",
  "Alberta highways are toll-free.": "Les autoroutes de l'Alberta sont gratuites.",
  "Manitoba highways are toll-free.": "Les autoroutes du Manitoba sont gratuites.",
  "Saskatchewan highways are toll-free.": "Les autoroutes de la Saskatchewan sont gratuites.",

  /* ---------------- Vignette optimizer: tier labels ---------------- */
  "1-Day": "1 jour",
  "10-Day": "10 jours",
  "2-Month": "2 mois",
  Annual: "Annuelle",
  "7-Day": "7 jours",
  "1-Month": "1 mois",
  "30-Day": "30 jours",

  // Travel Party & Route Stop Cards (POI taxonomy, universal stop card)
  "Personalize stops for your travel party (POI & Rest Stops)": "Personnalisez les étapes pour vos compagnons de route (POI et aires de repos)",
  "Apply stops to route": "Ajouter les étapes à l'itinéraire",
  "Loading rating…": "Chargement de la note …",
  "Petrol/diesel stations, 24/7 pumps, LPG/autogas": "Stations essence/diesel, pompes 24 h/24, GPL",
  "Fast DC chargers along the corridor": "Bornes de recharge rapide le long du trajet",
  "Dump stations, fresh water, LPG/autogas": "Aires de vidange, eau potable, GPL",
  "Campgrounds, RV parks, permitted overnight zones": "Campings, aires pour camping-cars, zones de bivouac autorisées",
  "Mountain passes and tourist byways": "Cols de montagne et routes touristiques",
  "Overlooks and photo pull-offs": "Points de vue et arrêts photo",
  "National parks, waterfalls, gorges, reserves": "Parcs nationaux, cascades, gorges, réserves naturelles",
  "Swim spots, lakes, beaches, hot springs": "Baignades, lacs, plages, sources chaudes",
  "Botanical gardens, quiet parks, thermal spas": "Jardins botaniques, parcs paisibles, spas thermaux",
  "Historic sites, museums, UNESCO landmarks": "Sites historiques, musées, patrimoine UNESCO",
  "Castles, palaces, châteaux, manors": "Châteaux, palais, forteresses, manoirs",
  "Theme parks, playgrounds, waterparks": "Parcs d'attractions, aires de jeux, parcs aquatiques",
  "Zoos, sanctuaries, aquariums, farms": "Zoos, réserves animalières, aquariums, fermes",
  "Markets, farm shops, vineyards, food halls": "Marchés, fermes locales, vignobles, halles gourmandes",
  "Old towns, pedestrian markets, architecture": "Vieilles villes, rues piétonnes, architecture",
  "Via ferrata, climbing, whitewater, trailheads": "Via ferrata, escalade, eaux vives, sentiers de randonnée",

  // Border Crossing Advisories
  "Border Crossing Advisories": "Informations frontalières pour votre trajet",
  "General entry-requirement guidance for the countries on this route — medications, pets, customs, and gear that's banned or restricted at some borders. Always confirm with an official source before you travel.": "Conseils généraux sur les exigences d'entrée pour les pays de cet itinéraire — médicaments, animaux de compagnie, règles douanières et équipements interdits ou restreints à certaines frontières. Vérifiez toujours une source officielle avant de partir.",
  "Medications": "Médicaments",
  "Traveling with pets": "Voyager avec des animaux",
  "Customs · alcohol & tobacco": "Douane · alcool et tabac",
  "Prohibited vehicle gear": "Équipements interdits dans le véhicule",
  "Controlled substances": "Substances contrôlées",
  "Critical": "Critique",
  "Good to know": "Bon à savoir",
  "Info": "Info",
  "Carrying prescription medication across Schengen borders": "Transporter des médicaments sur ordonnance à travers les frontières Schengen",
  "Carrying controlled medications — ADHD medication, strong painkillers, sedatives? Bring your prescription, and for longer stays a Schengen medical certificate signed by your doctor. Requirements vary by country — check with the destination's embassy or a pharmacy if you're unsure.": "Vous transportez des médicaments contrôlés — traitement TDAH, antidouleurs puissants, sédatifs ? Emportez votre ordonnance, et pour un séjour prolongé un certificat médical Schengen signé par votre médecin. Les exigences varient selon les pays — vérifiez auprès de l'ambassade de destination ou d'une pharmacie en cas de doute.",
  "How long your prescription travels with you": "Combien de temps votre ordonnance reste valable en voyage",
  "A standard prescription typically covers up to a 30-day supply across a border without extra paperwork. For longer trips (up to 90 days), carry a doctor's certificate confirming the medication, dosage and your treatment.": "Une ordonnance standard couvre généralement jusqu'à 30 jours de traitement à travers une frontière sans formalité supplémentaire. Pour un séjour plus long (jusqu'à 90 jours), emportez un certificat médical confirmant le médicament, le dosage et votre traitement.",
  "Transiting non-Schengen countries (e.g. the UK) with medication": "Transiter par des pays hors Schengen (ex. le Royaume-Uni) avec des médicaments",
  "The UK sits outside Schengen and applies its own rules for controlled substances. Carry an official letter from your physician stating what you're carrying and why, and check current UK Border Force guidance before you travel.": "Le Royaume-Uni se trouve hors de l'espace Schengen et applique ses propres règles pour les substances contrôlées. Emportez une lettre officielle de votre médecin précisant ce que vous transportez et pourquoi, et vérifiez les directives actuelles des services frontaliers britanniques avant de partir.",
  "Microchip, rabies vaccination & EU Pet Passport": "Puce électronique, vaccination antirabique et passeport européen pour animaux",
  "Dogs and cats need an ISO microchip, a valid rabies vaccination (at least 21 days old) and an EU Pet Passport (or animal health certificate) to cross into and within the EU/Schengen area.": "Chiens et chats doivent avoir une puce électronique ISO, une vaccination antirabique valide (datant d'au moins 21 jours) et un passeport européen pour animaux (ou certificat sanitaire) pour entrer dans l'espace UE/Schengen et y circuler.",
  "Tapeworm (Echinococcus) treatment before entry": "Traitement contre le ténia (Echinococcus) avant l'entrée",
  "Norway, the UK, Ireland, Finland and Malta require dogs to be treated for tapeworm (Echinococcus) by a vet 24-120 hours before arrival, recorded in the pet passport. Time it carefully — too early or too late and it won't count.": "La Norvège, le Royaume-Uni, l'Irlande, la Finlande et Malte exigent que les chiens soient traités contre le ténia (Echinococcus) par un vétérinaire 24 à 120 heures avant l'arrivée, enregistré dans le passeport animalier. Calculez bien le timing — trop tôt ou trop tard, ça ne compte pas.",
  "Restricted dog breeds": "Races de chiens restreintes",
  "France, Germany and Denmark restrict or ban certain breeds (including Pit Bull-type and American Staffordshire Terriers) from entry, or require special permits and muzzling in public. Check the current breed list before you travel with one.": "La France, l'Allemagne et le Danemark restreignent ou interdisent certaines races (dont les types Pitbull et American Staffordshire Terrier) à l'entrée, ou exigent un permis spécial et une muselière en public. Vérifiez la liste des races en vigueur avant de voyager avec un tel chien.",
  "Moving alcohol & tobacco within the EU": "Transporter de l'alcool et du tabac au sein de l'UE",
  "Within the EU there's no fixed duty-free limit for personal alcohol and tobacco, but customs use indicative guidance levels (around 10L spirits, 90L wine, 800 cigarettes) as a rule of thumb for what counts as personal use.": "Au sein de l'UE, il n'existe pas de limite hors taxes fixe pour l'alcool et le tabac à usage personnel, mais les douanes utilisent des niveaux indicatifs (environ 10 L de spiritueux, 90 L de vin, 800 cigarettes) comme repère pour ce qui relève de l'usage personnel.",
  "Norway and Switzerland enforce strict duty-free limits": "La Norvège et la Suisse appliquent des limites hors taxes strictes",
  "Norway and Switzerland sit outside the EU customs union and apply tight, strictly enforced allowances for alcohol and tobacco — commonly around 1L spirits and 200 cigarettes per adult. Exceeding them means declaring and paying duty at the border.": "La Norvège et la Suisse se trouvent hors de l'union douanière de l'UE et appliquent des franchises strictement contrôlées pour l'alcool et le tabac — généralement environ 1 L de spiritueux et 200 cigarettes par adulte. Au-delà, il faut déclarer et payer les droits à la frontière.",
  "Radar and speed-camera detectors are illegal": "Les détecteurs de radars sont illégaux",
  "France, Switzerland and Germany ban radar/laser detectors outright — even carrying one switched off can mean a fine and confiscation. GPS apps with fixed speed-camera alerts are usually fine; live radar detection is not.": "La France, la Suisse et l'Allemagne interdisent totalement les détecteurs radar/laser — même en transporter un éteint peut entraîner amende et confiscation. Les applications GPS avec alertes de radars fixes sont généralement autorisées ; la détection radar en temps réel ne l'est pas.",
  "Dashcam privacy restrictions": "Restrictions de confidentialité pour les dashcams",
  "Austria and Switzerland treat continuous dashcam recording as a privacy-law issue — permanent recording of public roads can draw fines. Use event-triggered (loop) recording rather than always-on filming.": "L'Autriche et la Suisse considèrent l'enregistrement continu par dashcam comme une question de protection de la vie privée — filmer en permanence la voie publique peut entraîner des amendes. Utilisez un enregistrement déclenché par événement (boucle) plutôt qu'un filmage constant.",
  "Pepper spray counts as an illegal weapon": "La bombe lacrymogène est considérée comme une arme illégale",
  "The UK, Denmark and the Netherlands classify pepper spray and similar self-defence sprays as prohibited weapons for civilians — carrying one across the border can lead to seizure and prosecution, even if it's legal where you started.": "Le Royaume-Uni, le Danemark et les Pays-Bas classent les bombes lacrymogènes et sprays d'autodéfense similaires comme armes interdites aux civils — en transporter une à travers la frontière peut entraîner saisie et poursuites, même si c'était légal à votre point de départ.",
  "Cannabis and CBD never cross a border legally": "Le cannabis et le CBD ne franchissent jamais légalement une frontière",
  "Even where cannabis or CBD is decriminalised or tolerated domestically, carrying it across any international border remains a criminal offence under international drug-trafficking law — regardless of the rules in either country.": "Même là où le cannabis ou le CBD est décriminalisé ou toléré sur le plan national, le transporter à travers une frontière internationale reste une infraction pénale au regard du droit international sur les stupéfiants — quelles que soient les règles de chaque pays.",
  /* ---------------- Price basis, open sources & Norwegian gantry tolls ---------------- */
  "Price basis": "Base de prix",
  "your setting": "votre réglage",
  "class average": "moyenne de la catégorie",
  "weighted along the route": "pondéré le long de l'itinéraire",
  "live": "en direct",
  "reference level": "niveau de référence",
  "Source": "Source",
  "Country": "Pays",
  "Price": "Prix",
  "Total = tolls + ferries + energy. No hidden running-cost allowance.": "Total = péages + ferries + énergie. Aucun forfait kilométrique caché.",
  "Norwegian tolls are priced gantry by gantry from Statens vegvesen's national register (standard rate, before AutoPASS tag discount).": "Les péages norvégiens sont calculés portique par portique à partir du registre national de Statens vegvesen (tarif standard, avant remise badge AutoPASS).",
  "Local column shows the currency actually charged at the barrier.": "La colonne Local indique la devise réellement facturée à la barrière.",
  "ECB reference rates #-#-# — for planning, not for settlement.": "Taux de référence BCE #-#-# – pour la planification, pas pour le règlement.",
  "ECB reference rates #-#-#": "Taux de référence BCE #-#-#",
  "Indicative reference rates — refreshed for planning, not for settlement.": "Taux de référence indicatifs – pour la planification, pas pour le règlement.",
  "# AutoPASS gantry": "# portique AutoPASS",
  "# AutoPASS gantries": "# portiques AutoPASS",
  "standard rate, 20% less with an AutoPASS tag": "tarif standard, 20 % de moins avec un badge AutoPASS",
  "zero-emission rate (70% of standard where the scheme publishes no EV rate)": "tarif zéro émission (70 % du standard lorsque le réseau ne publie pas de tarif VE)",
  "at # km": "au km #",
  "2026 tariff, card/cash at the plaza": "tarif 2026, carte/espèces à la gare de péage",
  "205 DKK with Bizz or number-plate payment": "205 DKK avec Bizz ou paiement par plaque",
  "2026 standard price at the plaza": "prix standard 2026 à la gare de péage",
  "182 DKK per crossing with ØresundGO, online tickets in between": "182 DKK par traversée avec ØresundGO, billets en ligne entre les deux",
  "Fixed link": "Lien fixe",
  "⛴️ Bridges & Ferries": "⛴️ Ponts & ferries",
  "Storebælt Bridge (Fyn ↔ Sjælland)": "Pont du Grand Belt (Fionie ↔ Seeland)",
  "Øresund Bridge (Copenhagen ↔ Malmö)": "Pont de l'Øresund (Copenhague ↔ Malmö)",
  "No AutoPASS gantry on this corridor": "Aucun portique AutoPASS sur ce corridor",
  "Checked against Statens vegvesen's national gantry register — none of the tolled points lie on the routed road.": "Vérifié dans le registre national des portiques de Statens vegvesen – aucun point payant ne se trouve sur la route calculée.",
  "10-day digital vignette, 2026 tariff (EUR 12.80 car · EUR 5.10 motorcycle)": "Vignette numérique 10 jours, tarif 2026 (EUR 12,80 voiture · EUR 5,10 moto)",
  "10-day e-vignette, 2026 tariff (CZK 290 ≈ EUR 11.80)": "E-vignette 10 jours, tarif 2026 (CZK 290 ≈ EUR 11,80)",
  "Regional reference level": "Niveau de référence régional",
  "Indicative public DC fast-charging level": "Niveau indicatif de recharge rapide DC publique",
  "Reference level": "Niveau de référence",
  "EU Weekly Oil Bulletin (reference)": "Bulletin pétrolier hebdomadaire de l'UE (référence)",
  "EU Weekly Oil Bulletin": "Bulletin pétrolier hebdomadaire de l'UE",
  "EU Weekly Oil Bulletin (last available)": "Bulletin pétrolier hebdomadaire de l'UE (dernier disponible)",
  "Statistics Norway (SSB) monthly pump prices": "Statistics Norway (SSB), prix mensuels à la pompe",
  "Statistics Norway (reference)": "Statistics Norway (référence)",
  "Statistics Canada (reference)": "Statistique Canada (référence)",
  "U.S. EIA (reference)": "U.S. EIA (référence)",
  "U.S. EIA weekly retail gasoline & diesel update": "Mise à jour hebdomadaire U.S. EIA des prix essence et diesel",
  "UK weekly road fuel prices (reference)": "Prix hebdomadaires des carburants au Royaume-Uni (référence)",
  "TCS / BFS reference": "Référence TCS / OFS",
  "median of # stations": "médiane de # stations",
  "Statistics Canada monthly retail prices (diesel: #-city average)": "Statistique Canada, prix de détail mensuels (diesel : moyenne de # villes)",
};

const FR_PATTERNS: [RegExp, (m: RegExpMatchArray) => string][] = [
  [
    /^Arrive at ~25% state of charge, charge to 80% in about (\d+) min\.$/,
    (m) => `Arrivez avec environ 25 % de batterie et rechargez jusqu'à 80 % en environ ${m[1]} min.`,
  ],
  [
    /^Recommended refuel — keeps you above the 25% reserve on a (.+) tank range\.$/,
    (m) => `Ravitaillement recommandé — vous maintient au-dessus de la réserve de 25 % pour une autonomie de ${m[1]}.`,
  ],
  [/^(.+) full battery range$/, (m) => `${m[1]} d'autonomie batterie pleine`],
  [/^(.+) full tank range$/, (m) => `${m[1]} d'autonomie réservoir plein`],
  [
    /^Single transit leg: (.+) is the cheapest legal cover\.$/,
    (m) => `Trajet de transit unique : ${m[1]} est l'option légale la moins chère.`,
  ],
  [
    /^Covers all (\d+) days? of your return trip within one validity window\.$/,
    (m) => `Couvre les ${m[1]} jours de votre aller-retour dans une seule période de validité.`,
  ],
  [
    /^💡 AutoVere optimized your vignette cost: saved (.+) — (.+) in (.+) instead of the usual (.+)\.$/,
    (m) => `💡 AutoVere a optimisé le coût de votre vignette : ${m[1]} économisés — ${m[2]} en ${m[3]} au lieu du ${m[4]} habituel.`,
  ],
  [
    /^💡 AutoVere checked every validity window — the standard tiers are already the cheapest legal cover for (\d+) days?\.$/,
    (m) => `💡 AutoVere a vérifié chaque période de validité — les formules standards sont déjà l'option légale la moins chère pour ${m[1]} jours.`,
  ],
  [
    /^Planned at 75% safety buffer — (.+) between stops$/,
    (m) => `Planifié avec une marge de sécurité de 75 % — ${m[1]} entre les arrêts`,
  ],
];

export { FR_PATTERNS };
