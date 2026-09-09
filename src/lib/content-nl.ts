/**
 * Dutch translations for content that lives in data modules
 * (compliance, pass intel, corridor map, trip data).
 *
 * Keyed by the exact English source string so components can wrap any
 * data-driven label with `tr(...)` from `useTr()`.
 */
export const CONTENT_NL: Record<string, string> = {
  /* ---------------- Map layer: viewpoints ---------------- */
  "Scenic Viewpoints & Photo Stops": "Uitzichtpunten en fotostops",
  "Panorama rest area": "Panorama-rustplaats",
  "Lakeside viewpoint": "Uitzichtpunt aan het meer",
  "Alpine summit overlook": "Uitzicht vanaf de alpentop",
  "Coastal cliff lookout": "Uitzichtpunt op de kliffen",
  "Valley overlook · picnic tables · photo spot":
    "Uitzicht op de vallei · picknicktafels · fotoplek",
  "Free parking · short walk to the shoreline":
    "Gratis parkeren · korte wandeling naar de kust",
  "Glacier panorama · café · restrooms": "Gletsjerpanorama · café · toiletten",
  "Sunset viewpoint · motorhome-friendly parking":
    "Uitzichtpunt zonsondergang · camper-vriendelijk parkeren",
  /* ---------------- Compliance: heavy motorhome systems ---------------- */
  Austria: "Oostenrijk",
  Switzerland: "Zwitserland",
  Slovenia: "Slovenië",
  Germany: "Duitsland",
  France: "Frankrijk",
  Italy: "Italië",
  Norway: "Noorwegen",
  Sweden: "Zweden",
  Denmark: "Denemarken",
  Spain: "Spanje",
  Portugal: "Portugal",
  Netherlands: "Nederland",
  Belgium: "België",
  "United Kingdom": "Verenigd Koninkrijk",
  "Belgium & Netherlands": "België en Nederland",
  Ferries: "Veerboten",

  "GO-Box (ASFINAG)": "GO-Box (ASFINAG)",
  "Motorhomes over 3.5 t maximum permissible weight may not use the car vignette. You need a GO-Box on-board unit, charged per kilometre by axle count and EURO class. Pick one up at a GO point near the border before your first motorway kilometre.":
    "Campers met een toegestane maximale massa boven 3,5 t mogen geen autovignet gebruiken. Je hebt een GO-Box aan boord nodig, waarmee per kilometer wordt afgerekend op basis van asaantal en EURO-klasse. Haal er een op bij een GO-punt nabij de grens voordat je de snelweg oprijdt.",
  "LSVA / PSVA heavy vehicle charge": "LSVA/PSVA-heffing voor zware voertuigen",
  "Above 3.5 t the Swiss motorway vignette no longer covers you. Foreign motorhomes normally pay the flat-rate PSVA (per-day or per-year) declared at the border customs post; ID-based LSVA applies to commercial units.":
    "Boven 3,5 t geldt het Zwitserse snelwegvignet niet meer. Buitenlandse campers betalen doorgaans de vaste PSVA-heffing (per dag of per jaar), aan te geven bij de grensdouane; op ID gebaseerde LSVA geldt voor commerciële voertuigen.",
  "DarsGo unit": "DarsGo-apparaat",
  "Slovenian motorways charge vehicles over 3.5 t through a DarsGo on-board unit with free-flow gantries. Register online or at a DarsGo service point; the e-vignette is invalid for your weight class.":
    "Sloveense snelwegen berekenen voertuigen boven 3,5 t via een DarsGo-boordapparaat met free-flow-poorten. Registreer online of bij een DarsGo-servicepunt; het e-vignet is niet geldig voor jouw gewichtsklasse.",
  "No toll for private motorhomes": "Geen tol voor privé-campers",
  "Privately used motorhomes are exempt from the German Lkw-Maut regardless of weight, but weight-based speed limits and overtaking bans still apply.":
    "Privé gebruikte campers zijn vrijgesteld van de Duitse Lkw-Maut, ongeacht het gewicht, maar snelheidslimieten en inhaalverboden op basis van gewicht blijven van toepassing.",

  /* ---------------- Compliance: clearance advisories ---------------- */
  "Alpine underpasses & village arches": "Alpine onderdoorgangen en dorpspoorten",
  "Several Alpine valley roads (Susa, Vinschgau, Maurienne) and old town gateways drop below 3.2 m. Trust posted signs over your navigation app and follow the signed HGV/camper diversion where offered.":
    "Verschillende alpine dalwegen (Susa, Vinschgau, Maurienne) en oude stadspoorten hebben minder dan 3,2 m doorrijhoogte. Vertrouw op de bebording in plaats van je navigatie-app en volg de gemarkeerde omleiding voor vrachtwagens/campers waar aangeboden.",
  "Tunnel height & LPG restrictions": "Beperkingen voor tunnelhoogte en LPG",
  "Mont Blanc, Fréjus and Gotthard road tunnels apply strict height, length and LPG-cylinder rules. Vehicles above 4.0 m are routed to dedicated lanes and may face convoy timing.":
    "De wegtunnels Mont Blanc, Fréjus en Gotthard hanteren strikte regels voor hoogte, lengte en LPG-flessen. Voertuigen boven 4,0 m worden naar aparte rijstroken geleid en kunnen te maken krijgen met konvooitijden.",
  "Ferry deck clearance": "Vrije hoogte op het veerbootdek",
  "Book ferries in the correct height and length bracket. Under-declaring your height means a re-fare at the ramp or refused boarding.":
    "Boek veerboten in de juiste hoogte- en lengtecategorie. Onjuiste opgave van je hoogte betekent bijbetalen bij de oprit of geweigerde instap.",
  "Roof box, aerials & solar": "Dakkoffer, antennes en zonnepanelen",
  "Measure to the highest fixed point — solar panels, satellite domes and roof boxes typically add 15–25 cm over the plate height.":
    "Meet tot het hoogste vaste punt — zonnepanelen, satellietkoepels en dakkoffers voegen meestal 15–25 cm toe aan de hoogte op het kentekenbewijs.",

  /* ---------------- Compliance: speed rules ---------------- */
  "100 km/h (over 3.5 t)": "100 km/u (boven 3,5 t)",
  "110 km/h (over 3.5 t)": "110 km/u (boven 3,5 t)",
  "80 km/h with caravan/heavy load": "80 km/u met caravan/zware lading",
  "Above 3.5 t you are capped at 100 km/h on the Autobahn and 80 km/h on rural roads, and overtaking bans for heavy vehicles apply to you.":
    "Boven 3,5 t geldt een limiet van 100 km/u op de Autobahn en 80 km/u op landwegen, en gelden ook voor jou inhaalverboden voor zware voertuigen.",
  "Over 3.5 t: 110 km/h motorway, 100 km/h dual carriageway, 80 km/h single carriageway. Keep 50 m from the vehicle ahead.":
    "Boven 3,5 t: 110 km/u op de snelweg, 100 km/u op een tweebaansweg, 80 km/u op een enkelbaansweg. Houd 50 m afstand tot het voertuig voor je.",
  "100 km/h motorway and 80 km/h on main roads; the left-most lane of three is closed to vehicles over 3.5 t.":
    "100 km/u op de snelweg en 80 km/u op hoofdwegen; de meest linkse van drie rijstroken is gesloten voor voertuigen boven 3,5 t.",
  "Motorhomes over 3.5 t are limited to 80 km/h; many fjord roads sign 60 km/h with passing places only.":
    "Campers boven 3,5 t zijn beperkt tot 80 km/u; veel fjordwegen geven 60 km/u aan, met alleen inhaalstroken.",
  "Heavy motorhomes are limited to 100 km/h and must use the lorry lane in tunnels with lane separation.":
    "Zware campers zijn beperkt tot 100 km/u en moeten de vrachtwagenstrook gebruiken in tunnels met rijstrookscheiding.",

  /* ---------------- Compliance: LEZ ---------------- */
  "Crit'Air vignette": "Crit'Air-vignet",
  "A Crit'Air sticker must be displayed inside the windscreen in every French ZFE. Classes are based on EURO standard and fuel; motorhomes are classed like the base vehicle.":
    "Een Crit'Air-sticker moet zichtbaar achter de voorruit zitten in elke Franse ZFE. Klassen zijn gebaseerd op EURO-norm en brandstof; campers worden geclassificeerd als het basisvoertuig.",
  "€3.81 incl. postage": "€ 3,81 incl. verzending",
  "Order 3–4 weeks ahead for delivery abroad": "Bestel 3–4 weken van tevoren voor levering in het buitenland",
  "Required for motorcycles and scooters too.": "Ook vereist voor motoren en scooters.",
  "Umweltplakette (green zone 4)": "Umweltplakette (groene zone 4)",
  "A green sticker (Schadstoffgruppe 4) is required in ~50 Umweltzonen. Enforcement is by camera and patrol; a missing badge is a €100 fine.":
    "Een groene sticker (Schadstoffgruppe 4) is vereist in ~50 Umweltzonen. Handhaving gebeurt met camera's en patrouilles; een ontbrekende sticker levert een boete van € 100 op.",
  "€6–€30 depending on issuer": "€ 6–30 afhankelijk van de uitgever",
  "Order 2 weeks ahead or buy at a TÜV/DEKRA station on arrival":
    "Bestel 2 weken van tevoren of koop bij aankomst bij een TÜV/DEKRA-station",
  "Motorcycles are exempt from German Umweltzonen.": "Motoren zijn vrijgesteld van Duitse Umweltzonen.",
  "LEZ online registration": "LEZ online registratie",
  "No sticker — foreign plates must be registered online before the first entry into Brussels, Antwerp, Ghent, Rotterdam or Amsterdam. Cameras match plates automatically.":
    "Geen sticker — buitenlandse kentekens moeten online worden geregistreerd vóór de eerste rit naar Brussel, Antwerpen, Gent, Rotterdam of Amsterdam. Camera's herkennen kentekens automatisch.",
  "Free registration; fines from €150": "Gratis registratie; boetes vanaf € 150",
  "Register at least 24 hours before entry": "Registreer minstens 24 uur vóór binnenkomst",
  "Motorcycles are currently outside the Belgian and Dutch LEZ scope.":
    "Motoren vallen momenteel buiten het bereik van de Belgische en Nederlandse milieuzones.",
  "ULEZ + Congestion Charge": "ULEZ + Congestion Charge",
  "Greater London's ULEZ charges non-compliant vehicles £12.50/day, plus £15 Congestion Charge in the central zone on weekdays. Pay online or by Auto Pay.":
    "De ULEZ van Groot-Londen rekent £ 12,50 per dag voor niet-conforme voertuigen, plus £ 15 Congestion Charge in de centrale zone op weekdagen. Betaal online of via Auto Pay.",
  "£12.50/day ULEZ · £15/day Congestion Charge": "£ 12,50/dag ULEZ · £ 15/dag Congestion Charge",
  "Pay up to 3 days after travel": "Betalen kan tot 3 dagen na de rit",
  "Pre-Euro 3 motorcycles pay ULEZ; Congestion Charge does not apply to motorcycles.":
    "Motoren van vóór Euro 3 betalen ULEZ; Congestion Charge geldt niet voor motoren.",

  /* ---------------- Compliance: toll tags ---------------- */
  "Norway, Sweden, Denmark — city rings, bridges, Øresund & Storebælt":
    "Noorwegen, Zweden, Denemarken — stadsringen, bruggen, Øresund en Storebælt",
  "Free-flow gantries, no barrier stop": "Free-flow-poorten, geen slagboomstop",
  "France, Spain, Portugal, Italy — barrier motorways":
    "Frankrijk, Spanje, Portugal, Italië — snelwegen met slagbomen",
  "Yellow 'T' / télépéage lanes, barrier lifts automatically":
    "Gele 'T'/télépéage-rijstroken, slagboom gaat automatisch open",
  "US turnpikes, express lanes and bridges": "Amerikaanse tolwegen, expresstroken en bruggen",
  "Open-road tolling gantries, no cash booth": "Open-road tolling-poorten, geen kassa",
  "Ontario Highway 407 ETR and 412/418": "Highway 407 ETR en 412/418 in Ontario",
  "Transponder rate instead of camera video-toll charge":
    "Transpondertarief in plaats van cameragebaseerde tolheffing",

  /* ---------------- Corridor map ---------------- */
  "EV Fast Chargers": "Snelladers voor EV's",
  "Fuel Stations": "Tankstations",
  "RV Campgrounds & Service Areas": "Camperplaatsen en servicezones",
  "Mountain Passes": "Bergpassen",
  "Ferry Terminals": "Veerbootterminals",
  "Live Government Fuel Data (prix-carburants)": "Actuele overheidsdata brandstof (prix-carburants)",
  "Station prices published by the French Ministry of Economy open data feed.":
    "Stationprijzen gepubliceerd via de open data-feed van het Franse Ministerie van Economie.",
  "Live E-Control Spritpreisrechner": "Actuele E-Control Spritpreisrechner",
  "Austrian regulator E-Control publishes station-level prices, updated through the day.":
    "De Oostenrijkse toezichthouder E-Control publiceert prijzen per station, gedurende de dag bijgewerkt.",
  "National Average Benchmark (EAFO / EU Bulletin)": "Nationaal gemiddelde referentie (EAFO / EU-bulletin)",
  "Indicative national averages from EAFO and the EU Weekly Oil Bulletin.":
    "Indicatieve nationale gemiddelden uit EAFO en het wekelijkse EU-oliebulletin.",
  "per gallon": "per gallon",
  "per litre": "per liter",
  "24/7 · restrooms · café": "24/7 · toiletten · café",
  "Dump station · fresh water · overnight pitches": "Stortplaats · drinkwater · overnachtingsplekken",
  "Ferry terminal · check-in 30 min before departure": "Veerbootterminal · inchecken 30 min voor vertrek",
  "24/7": "24/7",
  "HGV/RV lanes": "Rijstroken voor vrachtwagens/campers",
  "Café": "Café",
  AdBlue: "AdBlue",
  "Car wash": "Wasstraat",
  Europe: "Europa",
  "United States": "Verenigde Staten",
  Canada: "Canada",

  /* Camp spots */
  "Aire de camping-car municipale": "Gemeentelijke camperplaats (aire)",
  "Aire · France": "Aire · Frankrijk",
  "Stellplatz am Fluss": "Stellplatz aan de rivier",
  "Stellplatz · Germany/Austria": "Stellplatz · Duitsland/Oostenrijk",
  "Camping Alpenblick": "Camping Alpenblick",
  "Rated campsite · Alps": "Beoordeelde camping · Alpen",
  "Bobilparkering Fjordsyn": "Bobilparkering Fjordsyn",
  "Bobil pitch · Norway": "Camperplaats · Noorwegen",
  "Sosta camper Lago": "Sosta camper Lago",
  "Sosta · Italy": "Sosta · Italië",
  "KOA Holiday Resort": "KOA Holiday Resort",
  "Full hook-up RV park": "Camperpark met volledige aansluiting",
  "State Park Campground": "Camping in staatspark",
  "Public campground": "Openbare camping",
  "Interstate Travel Plaza": "Interstate Travel Plaza",
  "Overnight service area": "Overnachtingsservicezone",
  "Lakeside RV Resort": "Lakeside RV Resort",
  "Premium RV resort": "Premium camperresort",
  "Provincial Park Campground": "Camping in provinciaal park",
  "Halte routière VR": "Halte routière VR",
  "Roadside VR halt": "Camperpleisterplaats langs de weg",
  "KOA Campground": "KOA Campground",
  "Mountain View RV Park": "Mountain View RV Park",
  "Rated RV park": "Beoordeeld camperpark",
  "Dump station": "Stortplaats",
  "Fresh water": "Drinkwater",
  "Electric hook-up": "Elektra-aansluiting",
  "Overnight pitches": "Overnachtingsplekken",
  "Grey water": "Grijs water",
  WiFi: "Wifi",
  Showers: "Douches",
  Laundry: "Wasserette",
  Restaurant: "Restaurant",
  "Fjord view": "Fjorduitzicht",
  Toilets: "Toiletten",
  Shade: "Schaduw",
  "Walk to town": "Wandeling naar het centrum",
  "50-amp": "50 A",
  "30/50-amp": "30/50 A",
  Sewer: "Riolering",
  Pool: "Zwembad",
  "Potable water": "Drinkwater",
  Trails: "Wandelpaden",
  "RV dump": "Camper-stortplaats",
  Propane: "Propaan",
  "24/7 fuel": "24/7 brandstof",
  Firewood: "Brandhout",
  "Full hook-up": "Volledige aansluiting",
  "Overnight parking": "Overnachtingsparking",

  /* ---------------- Mountain passes ---------------- */
  "Grossglockner High Alpine Road": "Grossglockner Hochalpenstrasse",
  "🇦🇹 Austria · Salzburg ↔ Carinthia": "🇦🇹 Oostenrijk · Salzburg ↔ Karinthië",
  "2 504 m · Hochtor summit": "2504 m · top Hochtor",
  "Early May – late October (gates close nightly)":
    "Begin mei – eind oktober (poorten sluiten elke avond)",
  "€40.00 car day ticket · €30.00 motorcycle · motorhomes €40.00 (over 3.5 t on request)":
    "€ 40,00 dagticket auto · € 30,00 motor · camper € 40,00 (boven 3,5 t op aanvraag)",
  "Toll road, not part of the Austrian vignette network. Gates open ~05:30–06:00 and close 19:30–21:30 depending on the month — plan to be through before dusk and enjoy the Edelweissspitze detour.":
    "Tolweg, geen onderdeel van het Oostenrijkse vignetsysteem. Poorten gaan open rond 05:30–06:00 en sluiten 19:30–21:30 afhankelijk van de maand — plan om er voor de schemering doorheen te zijn en geniet van de omweg naar de Edelweissspitze.",
  "Riders get a reduced ticket and a dedicated Bikers Point at Fuschertörl.":
    "Motorrijders krijgen een gereduceerd ticket en een speciaal Bikers Point bij Fuschertörl.",
  "Passo dello Stelvio (Stelvio Pass)": "Passo dello Stelvio (Stelviopas)",
  "🇮🇹 Italy · Bormio ↔ Trafoi, South Tyrol": "🇮🇹 Italië · Bormio ↔ Trafoi, Zuid-Tirol",
  "2 758 m · 48 numbered hairpins on the north ramp":
    "2758 m · 48 genummerde haarspeldbochten aan de noordkant",
  "Usually late May/June – early November, snow dependent":
    "Meestal eind mei/juni – begin november, afhankelijk van sneeuw",
  "Free of charge": "Gratis",
  "Europe's most photogenic hairpin ladder. Ride or drive it early — coaches and cyclists fill the switchbacks from 10:00. Expect 8–12 °C colder at the summit than in Bormio.":
    "De meest fotogenieke haarspeldbochtenladder van Europa. Rijd er vroeg — touringcars en fietsers vullen de haarspeldbochten vanaf 10:00. Verwacht 8–12 °C kouder op de top dan in Bormio.",
  "Tight, off-camber hairpins: stay wide on entry and watch for gravel after rain.":
    "Krappe, scheefhellende haarspeldbochten: blijf breed bij het inrijden en let op grind na regen.",
  "Furka & Grimsel Passes": "Furka- en Grimselpas",
  "🇨🇭 Switzerland · Valais ↔ Uri ↔ Bern": "🇨🇭 Zwitserland · Wallis ↔ Uri ↔ Bern",
  "Furka 2 429 m · Grimsel 2 164 m": "Furka 2429 m · Grimsel 2164 m",
  "Roughly mid-June – late October": "Ongeveer half juni – eind oktober",
  "Free passes · CHF 40 motorway vignette still required for Swiss motorways":
    "Gratis passen · CHF 40 snelwegvignet nog steeds verplicht voor Zwitserse snelwegen",
  "Check the live pass board before committing — snow chains can be mandated at short notice even in summer. The Furka–Grimsel–Susten triangle is a perfect full-day loop.":
    "Controleer het actuele passbord voordat je vertrekt — sneeuwkettingen kunnen op korte termijn verplicht worden, zelfs in de zomer. De Furka-Grimsel-Susten-driehoek is een perfecte dagtocht.",
  "Cool mornings at altitude: pack a thermal layer and waterproofs.":
    "Koude ochtenden op hoogte: neem een thermolaag en regenkleding mee.",
  "Trollstigen & Sognefjellet": "Trollstigen en Sognefjellet",
  "🇳🇴 Norway · Møre og Romsdal · Jotunheimen": "🇳🇴 Noorwegen · Møre og Romsdal · Jotunheimen",
  "Trollstigen 858 m · Sognefjellet 1 434 m (highest road in Northern Europe)":
    "Trollstigen 858 m · Sognefjellet 1434 m (hoogste weg van Noord-Europa)",
  "Trollstigen late May – October · Sognefjellet May – November":
    "Trollstigen eind mei – oktober · Sognefjellet mei – november",
  "Free roads · parking fee at the Trollstigen viewpoint":
    "Gratis wegen · parkeergeld bij het uitzichtpunt Trollstigen",
  "Both are National Tourist Routes with hairpins and narrow shoulders. Trollstigen has periodic rockfall closures — check the live status the morning you travel. Vehicles over 12.4 m are not permitted on Trollstigen.":
    "Beide zijn Nationale Toeristische Routes met haarspeldbochten en smalle bermen. Trollstigen kent periodieke sluitingen door steenlawines — controleer de actuele status op de ochtend van je reis. Voertuigen boven 12,4 m zijn niet toegestaan op de Trollstigen.",
  "Wet granite and painted lines get slick in fjord drizzle — brake early into the hairpins.":
    "Natte graniet en geverfde belijning worden glad bij fjordmotregen — rem vroeg voor de haarspeldbochten.",
  "Icefields Parkway (Highway 93N)": "Icefields Parkway (Highway 93N)",
  "🇨🇦 Alberta · Lake Louise ↔ Jasper": "🇨🇦 Alberta · Lake Louise ↔ Jasper",
  "2 088 m · Bow Summit": "2088 m · Bow Summit",
  "Open year-round, with winter storm closures": "Het hele jaar open, met sluitingen door winterstormen",
  "Parks Canada pass required: C$11.00 adult/day or C$75.25 Discovery Pass (annual, per vehicle)":
    "Parks Canada-pas vereist: C$ 11,00 volwassene/dag of C$ 75,25 Discovery Pass (jaarlijks, per voertuig)",
  "232 km of glaciers with no fuel between Lake Louise and Saskatchewan River Crossing — top up before you start. From 1 Nov to 31 Mar winter tires or carried chains are mandatory on Highway 93N.":
    "232 km gletsjers zonder brandstof tussen Lake Louise en Saskatchewan River Crossing — tank vol voor vertrek. Van 1 nov tot 31 mrt zijn winterbanden of meegevoerde kettingen verplicht op Highway 93N.",
  "Wildlife on the shoulder at dawn and dusk — ride the centre of your lane and keep speed down.":
    "Wilde dieren langs de weg bij zonsopgang en -ondergang — rijd in het midden van je rijstrook en houd de snelheid laag.",
  "Tail of the Dragon (US 129, Deals Gap)": "Tail of the Dragon (US 129, Deals Gap)",
  "🇺🇸 North Carolina ↔ Tennessee": "🇺🇸 North Carolina ↔ Tennessee",
  "318 curves in 11 miles (17.7 km)": "318 bochten in 17,7 km",
  "Open year-round · best March – November, ice risk in winter":
    "Het hele jaar open · het best maart – november, ijskans in de winter",
  "Free — no tolls": "Gratis — geen tol",
  "Strictly enforced 30 mph (48 km/h) limit with unmarked patrols and roadside speed radar. No guardrails on many curves and zero fuel on the strip — fill up in Robbinsville or Tapoco.":
    "Streng gehandhaafde limiet van 48 km/u, met onopvallende patrouilles en flitspalen langs de weg. Veel bochten zonder vangrail en geen brandstof op dit traject — tank in Robbinsville of Tapoco.",
  "Photographers shoot every curve — ride your own pace, not the camera's. Trailers and RVs should use US 74 instead.":
    "Fotografen staan bij elke bocht — rijd op je eigen tempo, niet dat van de camera. Aanhangers en campers kunnen beter US 74 nemen.",
  "Open · winter tyres / chains required": "Open · winterbanden/kettingen verplicht",
  Open: "Open",
  "Closed for the season": "Gesloten voor het seizoen",
  "Opening/closing window · check live status": "Openings-/sluitingsvenster · controleer actuele status",
  "€30.00 motorcycle day ticket (reduced)": "€ 30,00 dagticket motor (gereduceerd)",

  /* ---------------- Border tips ---------------- */
  "Refuel in Austria before the Brenner Pass": "Tank in Oostenrijk voor de Brennerpas",
  "Diesel and petrol run roughly 15% cheaper in Austria than in Italy. Fill the tank around Innsbruck or Matrei am Brenner — the last Austrian stations before the border are the cheapest on the corridor.":
    "Diesel en benzine zijn in Oostenrijk ongeveer 15% goedkoper dan in Italië. Tank rond Innsbruck of Matrei am Brenner — de laatste Oostenrijkse stations voor de grens zijn het goedkoopst op de hele route.",
  "≈ €12–18 saved on a 60 L tank": "≈ € 12–18 bespaard op een tank van 60 l",
  "Plan a fuel stop at Matrei am Brenner": "Plan een tankstop bij Matrei am Brenner",
  "Swiss motorways need the CHF 40 annual vignette":
    "Zwitserse snelwegen vereisen het jaarlijkse vignet van CHF 40",
  "Switzerland has no day or week option — one sticker (or the e-vignette) costs CHF 40 and is valid for the whole calendar year, even if you only transit for two hours. Motorcycles need their own vignette.":
    "Zwitserland heeft geen dag- of weekoptie — één sticker (of het e-vignet) kost CHF 40 en is geldig voor het hele kalenderjaar, ook als je maar twee uur doorreist. Motoren hebben hun eigen vignet nodig.",
  "Switch to Smart Bypass to route around Swiss motorways on a short transit leg":
    "Schakel over naar Slimme omleiding om Zwitserse snelwegen te omzeilen bij een kort transittraject",
  "Try the 🧭 Smart Bypass variant": "Probeer de variant 🧭 Slimme omleiding",
  "Luxembourg fuel arbitrage on the Benelux corridor":
    "Brandstofarbitrage in Luxemburg op de Benelux-route",
  "Luxembourg keeps some of the lowest excise duties in Western Europe — expect 15–25 cents/litre less than France, Belgium or Germany. Stations near Wasserbillig, Schengen and Berchem are the classic top-up points.":
    "Luxemburg heeft enkele van de laagste accijnzen van West-Europa — reken op 15–25 cent per liter minder dan in Frankrijk, België of Duitsland. Stations bij Wasserbillig, Schengen en Berchem zijn de klassieke tankpunten.",
  "≈ €10–15 per tank versus neighbouring countries": "≈ € 10–15 per tank vergeleken met buurlanden",
  "Add a Luxembourg fuel stop": "Voeg een tankstop in Luxemburg toe",
  "Cross into Spain (or Andorra) before you refuel":
    "Steek de grens over naar Spanje (of Andorra) voordat je tankt",
  "Spanish pump prices sit well below French ones, and Andorra is cheaper still. Coming down the A9/AP-7, hold out past La Jonquera; on the Atlantic side, Irún and Behobia are the border bargains.":
    "Spaanse pompprijzen liggen ruim onder de Franse, en Andorra is nog goedkoper. Kom je via de A9/AP-7, wacht dan tot na La Jonquera; aan de Atlantische kant zijn Irún en Behobia de grenskoopjes.",
  "≈ 20–30 cents/litre versus France": "≈ 20–30 cent/liter vergeleken met Frankrijk",
  "Add a La Jonquera or Irún fuel stop": "Voeg een tankstop toe bij La Jonquera of Irún",
  "State fuel-tax arbitrage": "Arbitrage van staatsbrandstofbelasting",
  "State excise makes a real difference: California and Pennsylvania sit at the top, while Texas, Missouri, Mississippi and Arizona are consistently cheap. Fill up just before entering a high-tax state.":
    "De staatsaccijns maakt echt verschil: Californië en Pennsylvania staan bovenaan, terwijl Texas, Missouri, Mississippi en Arizona consequent goedkoop zijn. Tank net voor je een staat met hoge belasting binnenrijdt.",
  "Up to US$0.70/gal between neighbouring states": "Tot US$ 0,70/gallon verschil tussen buurstaten",
  "Fuel is usually cheaper south of the 49th": "Brandstof is meestal goedkoper ten zuiden van de 49e breedtegraad",
  "Once currency and litres-vs-gallons are converted, US fuel typically lands 20–30% below Canadian pumps — biggest gaps around BC and Québec. Cross with a low tank, return with a full one (within duty-free allowances).":
    "Na omrekening van valuta en liters versus gallons ligt Amerikaanse brandstof doorgaans 20–30% onder de Canadese prijs — de grootste verschillen rond Brits-Columbia en Québec. Steek de grens over met een lege tank, kom terug met een volle (binnen de belastingvrije limieten).",
  "≈ C$25–40 per tank on a border run": "≈ C$ 25–40 per tank bij een grensrit",

  /* ---------------- Border crossings ---------------- */
  "Germany → Austria": "Duitsland → Oostenrijk",
  "Open border · random ID checks": "Open grens · willekeurige identiteitscontroles",
  "Free movement inside Schengen. Bavaria runs intermittent spot checks on the A8/A93 — keep passports or ID cards within reach and you'll roll straight through.":
    "Vrij verkeer binnen Schengen. Beieren voert af en toe steekproefcontroles uit op de A8/A93 — houd paspoort of ID-kaart binnen handbereik en je rijdt zo door.",
  "Photo ID for every occupant (random checks)": "Foto-ID voor elke inzittende (steekproefsgewijze controle)",
  "Austrian motorway vignette valid before the first motorway metre":
    "Geldig Oostenrijks snelwegvignet vóór de eerste snelwegmeter",
  "Warning triangle, hi-vis vest and first-aid kit on board":
    "Gevarendriehoek, veiligheidsvest en verbanddoos aan boord",
  "Typically 0–10 min": "Meestal 0–10 min",
  "Austria → Italy (Brenner)": "Oostenrijk → Italië (Brenner)",
  "Open border · occasional customs patrol": "Open grens · af en toe douanepatrouille",
  "No passport control at the Brenner, but Italian Guardia di Finanza patrols do stop vehicles. Switch to Telepass lanes only if you have a transponder fitted.":
    "Geen paspoortcontrole bij de Brenner, maar Italiaanse Guardia di Finanza-patrouilles houden wel voertuigen aan. Gebruik alleen Telepass-rijstroken als je een transponder hebt.",
  "Photo ID on board": "Foto-ID aan boord",
  "Brenner autostrada toll paid at the barrier (card, cash or Telepass)":
    "Tol Brenner-autostrada betaald bij de slagboom (kaart, contant of Telepass)",
  "Crit'Air-style city rules do not apply, but Italian ZTL zones do":
    "Crit'Air-achtige stadsregels gelden niet, maar Italiaanse ZTL-zones wel",
  "Typically 0–15 min at the toll plaza": "Meestal 0–15 min bij het tolplein",
  "Swiss borders (Schengen, non-EU customs)": "Zwitserse grenzen (Schengen, geen EU-douane-unie)",
  "Customs control · goods declaration": "Douanecontrole · aangifte van goederen",
  "Switzerland is in Schengen but outside the EU customs union, so customs officers can and do stop vehicles. Declare goods above the duty-free allowance and buy the vignette before the first motorway.":
    "Zwitserland zit in Schengen maar niet in de EU-douane-unie, dus douanebeambten kunnen en zullen voertuigen aanhouden. Geef goederen boven de belastingvrije limiet aan en koop het vignet voor de eerste snelweg.",
  "CHF 40 motorway vignette (annual) or e-vignette per vehicle":
    "CHF 40 snelwegvignet (jaarlijks) of e-vignet per voertuig",
  "Customs declaration for goods over CHF 300 per person":
    "Douaneaangifte voor goederen boven CHF 300 per persoon",
  "Meat, dairy and alcohol allowances are strictly enforced":
    "Limieten voor vlees, zuivel en alcohol worden strikt gehandhaafd",
  "0–20 min · longer at Basel and Chiasso on weekends":
    "0–20 min · langer bij Basel en Chiasso in het weekend",
  "UK ↔ France (Channel Tunnel & Dover–Calais)":
    "VK ↔ Frankrijk (Kanaaltunnel en Dover–Calais)",
  "Full passport control & customs": "Volledige paspoortcontrole en douane",
  "Post-Brexit juxtaposed controls mean both British and French officers check you before boarding. Arrive 60–90 min ahead in peak season and have every document to hand.":
    "Na de brexit gelden gecombineerde controles — zowel Britse als Franse ambtenaren controleren je voor het inschepen. Kom in het hoogseizoen 60–90 minuten van tevoren en houd alle documenten bij de hand.",
  "Valid passport for every traveller (ID cards no longer accepted for UK entry)":
    "Geldig paspoort voor elke reiziger (ID-kaarten worden niet meer geaccepteerd bij binnenkomst in het VK)",
  "EU Entry/Exit System biometric registration on first crossing":
    "Biometrische registratie in het EU Entry/Exit-systeem bij eerste overtocht",
  "Customs declaration for goods, alcohol, tobacco and pets (animal health certificate)":
    "Douaneaangifte voor goederen, alcohol, tabak en huisdieren (dierengezondheidscertificaat)",
  "UK sticker on the vehicle and headlamp beam deflectors":
    "UK-sticker op het voertuig en koplampafschermers",
  "30–120 min in summer peaks": "30–120 min in de zomerdrukte",
  "Croatia ↔ Bosnia & Herzegovina (Neum corridor)":
    "Kroatië ↔ Bosnië en Herzegovina (Neum-corridor)",
  "Passport control · EU external border": "Paspoortcontrole · buitengrens van de EU",
  "The Neum corridor crosses out of and back into the EU within 9 km. Green card insurance is essential, and queues build sharply on July/August weekends. The Pelješac Bridge bypasses it entirely.":
    "De Neum-corridor verlaat en betreedt de EU weer binnen 9 km. Groene kaart-verzekering is essentieel, en er ontstaan flinke files in juli/augustus-weekenden. De Pelješac-brug omzeilt dit traject volledig.",
  "Passport for every occupant (two stamps in 20 minutes)":
    "Paspoort voor elke inzittende (twee stempels in 20 minuten)",
  "Green Card motor insurance valid for BiH": "Groene Kaart-autoverzekering geldig voor BiH",
  "Vehicle registration document in the driver's name or a notarised letter":
    "Kentekenbewijs op naam van de bestuurder of een notariële volmacht",
  "15–90 min in high season": "15–90 min in het hoogseizoen",
  "USA ↔ Canada land border": "Landgrens VS ↔ Canada",
  "Passport control · CBP / CBSA inspection": "Paspoortcontrole · CBP/CBSA-inspectie",
  "Every crossing is a full immigration and customs stop. NEXUS lanes cut the wait dramatically at Peace Arch, Detroit–Windsor and Niagara. Declare all food, alcohol, cannabis and firearms — penalties are steep.":
    "Elke oversteek is een volledige immigratie- en douanestop. NEXUS-rijstroken verkorten de wachttijd aanzienlijk bij Peace Arch, Detroit–Windsor en Niagara. Geef al je voedsel, alcohol, cannabis en vuurwapens aan — de boetes zijn hoog.",
  "Passport, NEXUS card or enhanced driver's licence":
    "Paspoort, NEXUS-kaart of verbeterd rijbewijs",
  "Vehicle registration and proof of insurance valid in the destination country":
    "Kentekenbewijs en bewijs van verzekering geldig in het bestemmingsland",
  "Declare food, alcohol, tobacco, cannabis and pets; firearms need advance paperwork":
    "Geef voedsel, alcohol, tabak, cannabis en huisdieren aan; vuurwapens vereisen papierwerk vooraf",
  "Electronic toll transponders (E-ZPass, 407 ETR) are not interchangeable across the border":
    "Elektronische tolapparaten (E-ZPass, 407 ETR) werken niet over de grens heen",
  "10–60 min · check live CBP border wait times":
    "10–60 min · controleer actuele CBP-wachttijden aan de grens",

  "Rider Safety & Gear Radar": "Radar voor rijveiligheid en uitrusting",
  "Camper Clearance & Weight Radar": "Radar voor camperhoogte en -gewicht",
  "Driver Safety Radar": "Radar voor bestuurdersveiligheid",
  "🧤 Gear & legal kit": "🧤 Uitrusting en verplichte spullen",
  "🏔️ Mountain pass alerts": "🏔️ Waarschuwingen voor bergpassen",
  "⛽ Long-stretch fuel alerts": "⛽ Waarschuwingen voor lange trajecten zonder brandstof",
  "📏 Clearance warnings": "📏 Waarschuwingen voor doorrijhoogte",
  "⚖️ Weight & axle limits": "⚖️ Gewichts- en aslimieten",
  "🛠️ Services": "🛠️ Services",
  "🚗 On the road": "🚗 Onderweg",
  "🏔️ Pass conditions": "🏔️ Passomstandigheden",
  "France: CE-approved gloves are mandatory for rider and pillion, and a high-vis vest must be carried within reach.": "Frankrijk: CE-goedgekeurde handschoenen zijn verplicht voor bestuurder en passagier, en een veiligheidsvest moet binnen handbereik zijn.",
  "Austria & Germany: carry a first-aid kit meeting DIN 13167 (motorcycle standard) — small, and checked at roadside stops.": "Oostenrijk en Duitsland: neem een verbanddoos mee volgens DIN 13167 (motorstandaard) — klein, en gecontroleerd bij wegcontroles.",
  "Keep your vest, kit and documents on top of the pannier so a check takes seconds.": "Houd je vest, verbanddoos en documenten bovenop de zijtas, zodat een controle maar seconden duurt.",
  "Two stretches exceed 180 km between open stations — top up before the pass climbs.": "Twee trajecten overschrijden 180 km tussen open stations — tank vol voordat de klim begint.",
  "Night-time pumps on the alpine leg are card-only; carry a backup card.": "Pompen 's nachts op het alpentraject accepteren alleen kaart — neem een reservekaart mee.",
  "Two tunnels on this route cap height at 3.2 m — your 3.05 m profile clears with margin.": "Twee tunnels op deze route hebben een hoogtelimiet van 3,2 m — je profiel van 3,05 m past ruim.",
  "One low village archway (2.9 m) was bypassed via the valley road automatically.": "Eén lage dorpspoort (2,9 m) werd automatisch omzeild via de dalweg.",
  "Route verified for vehicles up to 3.5 t; a 7.5 t restriction on the old pass road is avoided.": "Route geverifieerd voor voertuigen tot 3,5 t; een beperking van 7,5 t op de oude passweg wordt vermeden.",
  "Crosswind advisory on the coastal bridge section — reduce speed with a high side profile.": "Zijwindwaarschuwing op het kustbrugtraject — verminder snelheid bij een hoog zijprofiel.",
  "Three overnight-friendly service areas with fresh water and grey-water disposal along the way.": "Drie overnachtingsvriendelijke servicezones met drinkwater en afvoer van grijs water onderweg.",
  "Winter equipment rules apply on the alpine section between October and April.": "Op het alpentraject gelden regels voor winteruitrusting tussen oktober en april.",
  "Rest stops are mapped every 2 hours so the drive stays fresh and relaxed.": "Rustplaatsen zijn ingepland om de 2 uur, zodat de rit fris en ontspannen blijft.",
  "Every toll gantry on this route accepts contactless cards — no cash needed.": "Elke tolpoort op deze route accepteert contactloze kaarten — contant geld is niet nodig.",
  "Stelvio Pass (2,757 m) — 48 hairpins, open, dry tarmac forecast until early evening.": "Stelviopas (2757 m) — 48 haarspeldbochten, open, droog asfalt verwacht tot vroeg in de avond.",
  "Grossglockner High Alpine Road — toll road, gates close at 21:00; ride it before dusk.": "Grossglockner Hochalpenstrasse — tolweg, poorten sluiten om 21:00; rijd er voor de schemering.",
  "Furka Pass — clear and open today, light crosswinds on the western ramp.": "Furkapas — vandaag helder en open, lichte zijwind aan de westkant.",
  "Trollstigen — single-lane sections with tourist traffic; take the early morning slot.": "Trollstigen — trajecten met één rijstrook en toeristisch verkeer; kies de vroege ochtend.",
  "Tail of the Dragon (US-129) — 318 curves in 11 miles; watch for gravel on the inside lines.": "Tail of the Dragon (US-129) — 318 bochten in 18 km; let op grind aan de binnenkant van de bochten.",
  "Icefields Parkway — stunning but exposed; wildlife on the road at dawn and dusk.": "Icefields Parkway — prachtig maar onbeschut; wilde dieren op de weg bij zonsopgang en -ondergang.",
  "🇩🇪 Germany": "🇩🇪 Duitsland",
  "🇦🇹 Austria": "🇦🇹 Oostenrijk",
  "🇨🇭 Switzerland": "🇨🇭 Zwitserland",
  "🇮🇹 Italy": "🇮🇹 Italië",
  "🇳🇴 Norway": "🇳🇴 Noorwegen",
  "⛴️ Ferries": "⛴️ Veerboten",
  "🏙️ Illinois": "🏙️ Illinois",
  "🌄 Colorado": "🌄 Colorado",
  "🌉 California": "🌉 Californië",
  "🌴 Florida": "🌴 Florida",
  "🍁 Ontario": "🍁 Ontario",
  "🌲 Nova Scotia": "🌲 Nova Scotia",
  "🏔️ British Columbia": "🏔️ Brits-Columbia",
  "No car tolls on German autobahns": "Geen autotol op Duitse autobahns",
  "Ticket system, 8 checkpoints": "Ticketsysteem, 8 controlepunten",
  "Ticket system, 5 checkpoints": "Ticketsysteem, 5 controlepunten",
  "AutoPASS gantries — motorcycles pass free": "AutoPASS-poorten — motoren rijden gratis door",
  "Vehicle + 2 passengers": "Voertuig + 2 passagiers",
  "Reserve seat": "Zitplaats reserveren",
  "Reserve": "Reserveren",
  "Reserve ahead": "Vooraf reserveren",
  "6 gantries, I-PASS rate": "6 poorten, I-PASS-tarief",
  "Plate-pay surcharge included": "Toeslag voor kentekenbetaling inbegrepen",
  "Peak weekend rate": "Piektarief weekend",
  "Southbound, FasTrak": "Richting zuid, FasTrak",
  "Weekday peak": "Piekuren doordeweeks",
  "Evening rate": "Avondtarief",
  "SunPass rate, 9 gantries": "SunPass-tarief, 9 poorten",
  "Vehicle under 22ft + driver": "Voertuig onder 6,7 m + bestuurder",
  "Vehicle under 20ft + 2 adults": "Voertuig onder 6,1 m + 2 volwassenen",
  "Peak rate, transponder": "Piektarief, transponder",
  "Per-trip camera fee": "Camera-vergoeding per rit",
  "Two-axle vehicle": "Voertuig met twee assen",
  "Toll-free since 2008": "Tolvrij sinds 2008",
  "Digital vignette": "Digitaal vignet",
  "🇳🇴 Norway · Fjord ferries": "🇳🇴 Noorwegen · Fjordveerboten",
  "🌊 Scandinavia & Baltic": "🌊 Scandinavië en Baltische staten",
  "🇬🇧 English Channel": "🇬🇧 Het Kanaal",
  "☘️ Irish Sea": "☘️ Ierse Zee",
  "☀️ Mediterranean & Adriatic": "☀️ Middellandse Zee en Adriatische Zee",
  "🇺🇸 US marine highways": "🇺🇸 Amerikaanse veerbootroutes",
  "🇨🇦 Canadian coastal ferries": "🇨🇦 Canadese kustveerboten",
  "10–45 min per crossing": "10–45 min per overtocht",
  "Every 20–40 min, most run 24/7": "Elke 20–40 min, de meeste varen 24/7",
  "NOK 120–290 per car": "NOK 120–290 per auto",
  "NOK 55–120 per motorcycle": "NOK 55–120 per motor",
  "Register an AutoPASS ferjekort for an automatic ~50% discount — no cash, no queue at the booth.": "Registreer een AutoPASS ferjekort voor automatisch ~50% korting — geen contant geld, geen rij bij de kassa.",
  "AutoPASS ferjekort −50%": "AutoPASS ferjekort −50%",
  "45 min – 20 h depending on crossing": "45 min – 20 uur afhankelijk van de overtocht",
  "Scandlines every 30 min; overnight lines 1–2 sailings a day": "Scandlines elke 30 min; nachtlijnen 1–2 afvaarten per dag",
  "€45–210 car + driver": "€ 45–210 auto + bestuurder",
  "€28–120 motorcycle + rider": "€ 28–120 motor + bestuurder",
  "Book overnight cabins early in July and August — the Oslo–Kiel and Tallinn routes sell out weeks ahead.": "Boek nachtcabines vroeg in juli en augustus — de routes Oslo–Kiel en naar Tallinn zijn weken van tevoren uitverkocht.",
  "Cabins book out early": "Cabines raken snel volgeboekt",
  "35 min (LeShuttle) · 90–120 min (ferry)": "35 min (LeShuttle) · 90–120 min (veerboot)",
  "Up to 4 departures an hour at peak": "Tot 4 afvaarten per uur op het piekmoment",
  "£70–190 car + passengers": "£ 70–190 auto + passagiers",
  "£45–95 motorcycle + rider": "£ 45–95 motor + bestuurder",
  "LeShuttle keeps you in your vehicle — the fastest option with a roof box or a loaded bike.": "Met LeShuttle blijf je in je voertuig — de snelste optie met een dakkoffer of een beladen motor.",
  "Flexi tickets recommended": "Flexi-tickets aanbevolen",
  "2 h (fast craft) – 3 h 30 min": "2 uur (snelboot) – 3 uur 30 min",
  "4–8 sailings a day per route": "4–8 afvaarten per dag per route",
  "€95–230 car + driver": "€ 95–230 auto + bestuurder",
  "€60–130 motorcycle + rider": "€ 60–130 motor + bestuurder",
  "Wild Atlantic Way traffic peaks at weekends — a midweek morning sailing is calmer and cheaper.": "Verkeer op de Wild Atlantic Way piekt in het weekend — een ochtendafvaart doordeweeks is rustiger en goedkoper.",
  "50 min (island hops) – 20 h (overnight)": "50 min (eilandhoppen) – 20 uur (nacht)",
  "Island hops hourly; long crossings daily": "Eilandhoppen elk uur; lange overtochten dagelijks",
  "€55–260 car + driver": "€ 55–260 auto + bestuurder",
  "€30–140 motorcycle + rider": "€ 30–140 motor + bestuurder",
  "Motorcycles usually board first and pay roughly 40% less — arrive 45 min before departure.": "Motoren gaan meestal als eerste aan boord en betalen ongeveer 40% minder — kom 45 min voor vertrek.",
  "Bikes board first": "Motoren gaan als eerste aan boord",
  "60 min – 38 h (Alaska)": "60 min – 38 uur (Alaska)",
  "San Juans hourly; Alaska weekly": "San Juans elk uur; Alaska wekelijks",
  "$62–180 vehicle + driver": "$ 62–180 voertuig + bestuurder",
  "$28–70 motorcycle + rider": "$ 28–70 motor + bestuurder",
  "Vehicle reservations open two months ahead on Washington State Ferries and are essential in summer.": "Voertuigreserveringen bij Washington State Ferries openen twee maanden van tevoren en zijn essentieel in de zomer.",
  "1 h 35 min – 7 h (Newfoundland)": "1 uur 35 min – 7 uur (Newfoundland)",
  "Every 1–2 h on the Vancouver Island runs": "Elke 1–2 uur op de routes naar Vancouver Island",
  "C$96–150 vehicle + 2 adults": "C$ 96–150 voertuig + 2 volwassenen",
  "C$45–70 motorcycle + rider": "C$ 45–70 motor + bestuurder",
  "Book a Saver fare on BC Ferries — cheapest sailings are before 09:00 and after 19:00.": "Boek een Saver-tarief bij BC Ferries — de goedkoopste afvaarten zijn voor 09:00 en na 19:00.",
  "Saver fares available": "Saver-tarieven beschikbaar",
  "⚡ Smart EV Charging Optimizer": "⚡ Slimme EV-laadoptimalisator",
  "⛽ Smart Fuel Stop Optimizer": "⛽ Slimme optimalisator voor tankstops",
  "24/7 forecourt": "24/7 tankstation",

  "I have AutoPASS / EPASS24": "Ik heb AutoPASS / EPASS24",
  "I have Telepass / Bip&Go / Fulli": "Ik heb Telepass / Bip&Go / Fulli",
  "I have SunPass / E-ZPass": "Ik heb SunPass / E-ZPass",
  "Vignettes & e-vignettes": "Vignetten en e-vignetten",
  "Ticket-based motorway tolls": "Op tickets gebaseerde snelwegtol",
  "Urban low-emission zones": "Stedelijke milieuzones",
  "State toll roads & turnpikes": "Staatstolwegen en turnpikes",
  "HOV / Express lanes": "HOV-/expresstroken",
  "Bridge & tunnel tolls": "Tol voor bruggen en tunnels",
  "Highway 407 ETR": "Highway 407 ETR",
  "Provincial tolls & bridges": "Provinciale tol en bruggen",
  "BC Ferries crossings": "Oversteken met BC Ferries",

  "Fuel is ~15% cheaper in Austria than Italy — refuel before crossing the Brenner Pass.": "Brandstof is ~15% goedkoper in Oostenrijk dan in Italië — tank voordat je de Brennerpas oversteekt.",
  "Luxembourg is the cheapest tank in Western Europe — top up before entering Belgium or France.": "Luxemburg heeft de goedkoopste brandstof van West-Europa — tank vol voordat je België of Frankrijk binnenrijdt.",
  "Diesel in Norway runs well above Swedish prices — fill near the border at Svinesund.": "Diesel in Noorwegen ligt ruim boven de Zweedse prijzen — tank bij de grens in Svinesund.",
  "Fuel in Georgia is ~20% cheaper than Florida — fill up before the state line on I-95.": "Brandstof in Georgia is ~20% goedkoper dan in Florida — tank voor de staatsgrens op I-95.",
  "Skip turnpike service plazas: prices run 10–15% above exits one mile off the highway.": "Sla servicestations op tolwegen over: prijzen liggen 10–15% hoger dan bij afritten net buiten de snelweg.",
  "California is the most expensive tank on the West Coast — fill in Nevada or Arizona first.": "Californië heeft de duurste brandstof van de westkust — tank eerst in Nevada of Arizona.",
  "Alberta fuel is ~20% cheaper than British Columbia — fill before Kicking Horse Pass.": "Brandstof in Alberta is ~20% goedkoper dan in Brits-Columbia — tank voor de Kicking Horse Pass.",
  "Québec charges more per litre than Ontario — top up before the provincial border on the 417.": "Québec rekent meer per liter dan Ontario — tank vol voor de provinciegrens op de 417.",
  "Northern Ontario pumps run a premium — refuel in Sault Ste. Marie before Highway 17.": "Pompen in Noord-Ontario zijn duurder — tank in Sault Ste. Marie voor Highway 17.",
  "Sognefjell (RV55), Norway — 194 km without a verified 24/7 station. Fill in Lom.": "Sognefjellet (RV55), Noorwegen — 194 km zonder geverifieerd 24/7-station. Tank in Lom.",
  "Grossglockner High Alpine Road — 186 km loop with no fuel above the toll gate.": "Grossglockner Hochalpenstrasse — 186 km rondrit zonder brandstof boven de tolpoort.",
  "US-50 “Loneliest Road”, Nevada — 226 km between verified stations. Fill in Ely.": "US-50 „Eenzaamste weg”, Nevada — 226 km tussen geverifieerde stations. Tank in Ely.",
  "I-10 Van Horn → Fort Stockton, Texas — 190 km with limited overnight service.": "I-10 Van Horn → Fort Stockton, Texas — 190 km met beperkte nachtservice.",
  "Highway 17 Wawa → White River — 198 km with no verified overnight fuel.": "Highway 17 Wawa → White River — 198 km zonder geverifieerde brandstof 's nachts.",
  "Icefields Parkway, Alberta — 232 km between Lake Louise and Jasper; Saskatchewan Crossing only.": "Icefields Parkway, Alberta — 232 km tussen Lake Louise en Jasper; alleen Saskatchewan Crossing onderweg.",
  "Eleven hairpins climbing a sheer wall — viewing platform over the valley.": "Elf haarspeldbochten langs een steile wand — uitzichtplatform boven de vallei.",
  "Eight bridges hopping island to island straight over the open sea.": "Acht bruggen die van eiland naar eiland springen, recht over de open zee.",
  "48 km of alpine theatre topping out at 2,504 m.": "48 km alpien spektakel tot een hoogte van 2504 m.",
  "48 numbered hairpins — the classic rider pilgrimage.": "48 genummerde haarspeldbochten — de klassieke pelgrimstocht voor motorrijders.",
  "Glacier views, smooth tarmac and a lakeside descent.": "Gletsjeruitzichten, gladde asfalt en een afdaling langs het meer.",
  "Turquoise canyon rim road on the way to the Côte d'Azur.": "Weg langs een turquoise canyonrand op weg naar de Côte d'Azur.",
  "469 miles of ridgeline overlooks, no trucks, no tolls.": "755 km bergkamuitzichten, geen vrachtwagens, geen tol.",
  "Big Sur cliffs, Bixby Bridge and endless Pacific vistas.": "Kliffen van Big Sur, de Bixby Bridge en eindeloze uitzichten op de Stille Oceaan.",
  "318 curves in 11 miles — ride it early to beat traffic.": "318 bochten in 18 km — rijd er vroeg om het verkeer voor te blijven.",
  "Switchbacks to 10,947 ft on the doorstep of Yellowstone.": "Haarspeldbochten tot 3337 m, vlak bij Yellowstone.",
  "Red-rock tunnels and canyon overlooks between two parks.": "Rood-rotstunnels en canyonuitzichten tussen twee parken.",
  "232 km between Lake Louise and Jasper past glaciers and turquoise lakes.": "232 km tussen Lake Louise en Jasper, langs gletsjers en turquoise meren.",
  "Highland cliffs, whale lookouts and ocean switchbacks.": "Hooglandkliffen, walvisuitkijkpunten en oceaanbochten.",
  "Howe Sound fjord views from Vancouver up to Whistler.": "Uitzicht op de Howe Sound-fjord van Vancouver tot Whistler.",
  "St. Lawrence riverside villages and beluga-watching stops.": "Dorpjes langs de Saint Lawrence-rivier en stops om beluga's te spotten.",
  "Late May – October": "Eind mei – oktober",
  "Year-round": "Het hele jaar",
  "May – early November": "Mei – begin november",
  "June – October": "Juni – oktober",
  "Year-round (peak: October)": "Het hele jaar (piek: oktober)",
  "April – November": "April – november",
  "Late May – mid October": "Eind mei – half oktober",
  "Year-round (winter tyres Oct–Apr)": "Het hele jaar (winterbanden okt–apr)",
  "May – October": "Mei – oktober",
  "Rauma, Norway": "Rauma, Noorwegen",
  "Møre og Romsdal, Norway": "Møre og Romsdal, Noorwegen",
  "Provence, France": "Provence, Frankrijk",
  "Virginia – North Carolina": "Virginia – North Carolina",
  "California": "Californië",
  "Tennessee": "Tennessee",
  "Montana – Wyoming": "Montana – Wyoming",
  "Utah": "Utah",
  "Alberta": "Alberta",
  "Cape Breton, Nova Scotia": "Cape Breton, Nova Scotia",
  "British Columbia": "Brits-Columbia",
  "Québec": "Québec",
  "Fjord-side pitches, 5 min walk to the ferry quay.": "Plekken aan het fjord, 5 minuten lopen naar de veerbootsteiger.",
  "Great overnight before Grossglockner — book in July/August.": "Goede overnachting voor de Grossglockner — boek in juli/augustus.",
  "France's aire network is the cheapest overnight option en route south.": "Het Franse aire-netwerk is de goedkoopste overnachtingsoptie op weg naar het zuiden.",
  "Large pitches; height/width friendly access road.": "Grote plekken; toegangsweg vriendelijk voor hoogte en breedte.",
  "EV hookup": "EV-aansluiting",
  "Chemical WC": "Chemisch toilet legen",
  "Electricity": "Elektriciteit",
  "Bakery service": "Broodservice",
  "Full hookup": "Volledige aansluiting",
  "24h access": "24 uur toegang",
  "Geiranger, Norway": "Geiranger, Noorwegen",
  "Salzburg, Austria": "Salzburg, Oostenrijk",
  "Haute-Savoie, France": "Haute-Savoie, Frankrijk",
  "Lake Garda, Italy": "Gardameer, Italië",
  "Motorcycles are exempt from this e-vignette — nothing to buy.": "Motoren zijn vrijgesteld van dit e-vignet — niets te kopen.",
  "Only one validity period exists — it covers the whole stay.": "Er bestaat maar één geldigheidsperiode — die dekt het hele verblijf.",

  /* ---------------- Tolls guide ---------------- */
  "🇪🇺 Europe": "🇪🇺 Europa",
  "🇺🇸 United States": "🇺🇸 Verenigde Staten",
  "🇨🇦 Canada": "🇨🇦 Canada",
  "Tolls & vignettes": "Tol en vignetten",
  "Every barrier, badge and sticker — made simple.": "Elke slagboom, badge en sticker — eenvoudig uitgelegd.",
  "No guesswork, no fines. Here's what you need in each country, and how to get it before you set off.": "Geen giswerk, geen boetes. Dit heb je nodig in elk land, en zo regel je het voor vertrek.",
  "Austria digital vignette": "Digitaal Oostenrijks vignet",
  "10-day, 2-month or annual. Plate-linked, activates instantly.": "10 dagen, 2 maanden of jaarlijks. Gekoppeld aan kenteken, direct actief.",
  "Switzerland e-vignette": "Zwitsers e-vignet",
  "Annual only, valid 14 months. Motorcycles need their own.": "Alleen jaarlijks, geldig 14 maanden. Motoren hebben hun eigen vignet nodig.",
  "France & Italy ticket tolls": "Tickettol in Frankrijk en Italië",
  "Take a ticket, pay on exit. Telepass and Bip&Go tags speed it up.": "Neem een ticket, betaal bij de uitrit. Telepass- en Bip&Go-tags versnellen het proces.",
  "Norway AutoPASS": "Noors AutoPASS",
  "Automatic plate billing with discounts for registered EVs.": "Automatische facturering op kenteken met korting voor geregistreerde EV's.",
  "E-ZPass network": "E-ZPass-netwerk",
  "One transponder covers 19 states from Maine to Illinois.": "Eén transponder dekt 19 staten van Maine tot Illinois.",
  "SunPass (Florida)": "SunPass (Florida)",
  "Best value for Turnpike and Miami express lanes.": "Beste keuze voor Turnpike en de expresstroken van Miami.",
  "FasTrak (California)": "FasTrak (Californië)",
  "Required for bridge and express-lane discounts.": "Vereist voor kortingen op bruggen en expresstroken.",
  "Plate-pay tolling": "Tolheffing op kenteken",
  "Rental cars often add a daily admin fee — worth checking first.": "Huurauto's rekenen vaak een dagelijkse administratiekost — vooraf controleren loont.",
  "Ontario's all-electronic toll road. A transponder beats camera billing.": "Ontario's volledig elektronische tolweg. Een transponder is voordeliger dan facturering via camera.",
  "Cobequid Pass": "Cobequid Pass",
  "Nova Scotia's only mainline toll — cash and card accepted.": "De enige hoofdtol van Nova Scotia — contant en kaart geaccepteerd.",
  "Bridge tolls": "Brugtol",
  "Confederation Bridge is charged on the way off PEI only.": "Voor de Confederation Bridge wordt alleen betaald bij het verlaten van PEI.",

  /* ---------------- Corridor map: fuel & map extras ---------------- */
  "Est. rate": "Geschatte prijs",
  "Petrol 95": "Benzine 95",
  Diesel: "Diesel",
  "Open in Google Maps": "Openen in Google Maps",

  /* ---------------- Trip results: EV optimizer extras ---------------- */
  "Preferred network": "Voorkeursnetwerk",
  "Nearest high-power CCS hub": "Dichtstbijzijnde CCS-snellader",

  /* ---------------- Route tolls: distance & vignette details ---------------- */
  "Ticket system, charged per kilometre": "Ticketsysteem, tarief per kilometer",
  "Private concession segments only — state-run e-TOLL motorways are free for cars":
    "Alleen particuliere concessietrajecten — door de staat beheerde e-TOLL-snelwegen zijn gratis voor auto's",
  "Remaining concession sections": "Overige concessietrajecten",
  "Includes electronic-only motorways": "Inclusief volledig elektronisch beheerde snelwegen",
  "Fixed plaza charges along the corridor": "Vaste tarieven bij tolpleinen langs de route",
  "Automatic tolling — motorcycles pass free": "Automatische tolheffing — motoren rijden gratis door",
  "10-day pass, valid nationwide": "10-dagenpas, landelijk geldig",
  "Annual e-vignette, plate-linked (no short tier exists)":
    "Jaarlijks e-vignet, gekoppeld aan kenteken (geen kortere variant beschikbaar)",
  "7-day e-vignette": "7-daags e-vignet",
  "10-day electronic vignette": "10-daags elektronisch vignet",
  "10-day national e-vignette": "10-daags nationaal e-vignet",
  "Weekend/weekly e-vignette": "Weekend-/weekvignet (e-vignet)",
  "7-day road vignette": "7-daags wegvignet",

  /* ---------------- Route tolls: toll-free country/province notes ---------------- */
  "No motorway toll in Denmark — only the Storebælt and Øresund bridges are charged, and only if you cross them.":
    "Geen snelwegtol in Denemarken — alleen de Storebælt- en de Øresundbrug kosten geld, en alleen als je ze oversteekt.",
  "German autobahns are toll-free for cars and motorhomes up to 7.5 t.":
    "Duitse autobahns zijn tolvrij voor auto's en campers tot 7,5 t.",
  "Dutch motorways are free — only the Westerschelde and Kil tunnels charge.":
    "Nederlandse snelwegen zijn gratis — alleen de Westerscheldetunnel en de Kiltunnel rekenen tol.",
  "Belgian motorways are free for cars; the Liefkenshoek tunnel is the exception.":
    "Belgische snelwegen zijn gratis voor auto's; de Liefkenshoektunnel is de uitzondering.",
  "Luxembourg motorways are toll-free (and the cheapest fuel on the corridor).":
    "Luxemburgse snelwegen zijn tolvrij (en hebben de goedkoopste brandstof op de route).",
  "Swedish motorways are free; only Stockholm/Göteborg congestion charges apply.":
    "Zweedse snelwegen zijn gratis; alleen de congestieheffing in Stockholm/Göteborg geldt.",
  "Finnish roads are toll-free.": "Finse wegen zijn tolvrij.",
  "Estonian roads are toll-free for passenger vehicles.": "Estse wegen zijn tolvrij voor personenauto's.",
  "Latvian roads are toll-free for passenger vehicles.": "Letse wegen zijn tolvrij voor personenauto's.",
  "Lithuanian roads are toll-free for passenger vehicles.": "Litouwse wegen zijn tolvrij voor personenauto's.",
  "Only individual toll plazas (M50 eFlow) charge — none on this corridor.":
    "Alleen individuele tolpleinen (M50 eFlow) rekenen tol — geen op deze route.",
  "UK motorways are free apart from the M6 Toll and Dartford Crossing.":
    "Britse snelwegen zijn gratis, behalve de M6 Toll en de Dartford Crossing.",
  "New Brunswick highways are toll-free.": "Snelwegen in New Brunswick zijn tolvrij.",
  "BC highways are toll-free since the Port Mann and Golden Ears tolls ended.":
    "Snelwegen in Brits-Columbia zijn tolvrij sinds de tol op Port Mann en Golden Ears is afgeschaft.",
  "Alberta highways are toll-free.": "Snelwegen in Alberta zijn tolvrij.",
  "Manitoba highways are toll-free.": "Snelwegen in Manitoba zijn tolvrij.",
  "Saskatchewan highways are toll-free.": "Snelwegen in Saskatchewan zijn tolvrij.",

  /* ---------------- Vignette optimizer: tier labels ---------------- */
  "1-Day": "1 dag",
  "10-Day": "10 dagen",
  "2-Month": "2 maanden",
  Annual: "Jaarlijks",
  "7-Day": "7 dagen",
  "1-Month": "1 maand",
  "30-Day": "30 dagen",

  // Travel Party & Route Stop Cards (POI taxonomy, universal stop card)
  "Personalize stops for your travel party (POI & Rest Stops)": "Stops afstemmen op je reisgezelschap (POI's & pleisterplaatsen)",
  "Apply stops to route": "Stops toevoegen aan route",
  "Loading rating…": "Beoordeling laden …",
  "Petrol/diesel stations, 24/7 pumps, LPG/autogas": "Benzine-/dieselstations, 24/7 open, LPG/autogas",
  "Fast DC chargers along the corridor": "Snelladers langs de route",
  "Dump stations, fresh water, LPG/autogas": "Stortpunten, drinkwater, LPG/autogas",
  "Campgrounds, RV parks, permitted overnight zones": "Campings, camperplaatsen, toegestane overnachtingszones",
  "Mountain passes and tourist byways": "Bergpassen en toeristische routes",
  "Overlooks and photo pull-offs": "Uitzichtpunten en fotostops",
  "National parks, waterfalls, gorges, reserves": "Nationale parken, watervallen, kloven, natuurreservaten",
  "Swim spots, lakes, beaches, hot springs": "Zwemplekken, meren, stranden, warmwaterbronnen",
  "Botanical gardens, quiet parks, thermal spas": "Botanische tuinen, rustige parken, thermale baden",
  "Historic sites, museums, UNESCO landmarks": "Historische plekken, musea, UNESCO-erfgoed",
  "Castles, palaces, châteaux, manors": "Kastelen, paleizen, burchten, landhuizen",
  "Theme parks, playgrounds, waterparks": "Pretparken, speeltuinen, waterparken",
  "Zoos, sanctuaries, aquariums, farms": "Dierentuinen, reservaten, aquaria, boerderijen",
  "Markets, farm shops, vineyards, food halls": "Markten, boerderijwinkels, wijngaarden, foodhallen",
  "Old towns, pedestrian markets, architecture": "Oude binnensteden, voetgangersgebieden, architectuur",
  "Via ferrata, climbing, whitewater, trailheads": "Via ferrata, klimmen, wildwater, wandelpaden",
};

const NL_PATTERNS: [RegExp, (m: RegExpMatchArray) => string][] = [
  [
    /^Arrive at ~25% state of charge, charge to 80% in about (\d+) min\.$/,
    (m) => `Kom aan met ~25% batterij en laad in ongeveer ${m[1]} min op tot 80%.`,
  ],
  [
    /^Recommended refuel — keeps you above the 25% reserve on a (.+) tank range\.$/,
    (m) => `Aanbevolen tankstop — houdt je boven de 25% reserve bij een tankbereik van ${m[1]}.`,
  ],
  [/^(.+) full battery range$/, (m) => `${m[1]} bereik op een volle batterij`],
  [/^(.+) full tank range$/, (m) => `${m[1]} bereik op een volle tank`],
  [
    /^Single transit leg: (.+) is the cheapest legal cover\.$/,
    (m) => `Eén doorreistraject: ${m[1]} is de goedkoopste legale dekking.`,
  ],
  [
    /^Covers all (\d+) days? of your return trip within one validity window\.$/,
    (m) => `Dekt alle ${m[1]} dagen van je heen-en-terugreis binnen één geldigheidsperiode.`,
  ],
  [
    /^💡 AutoVere optimized your vignette cost: saved (.+) — (.+) in (.+) instead of the usual (.+)\.$/,
    (m) => `💡 AutoVere heeft je vignetkosten geoptimaliseerd: je bespaart ${m[1]} — ${m[2]} in ${m[3]} in plaats van het gebruikelijke ${m[4]}.`,
  ],
  [
    /^💡 AutoVere checked every validity window — the standard tiers are already the cheapest legal cover for (\d+) days?\.$/,
    (m) => `💡 AutoVere heeft elke geldigheidsperiode gecontroleerd — de standaardopties zijn al de goedkoopste legale dekking voor ${m[1]} dagen.`,
  ],
  [
    /^Planned at 75% safety buffer — (.+) between stops$/,
    (m) => `Gepland met 75% veiligheidsbuffer — ${m[1]} tussen stops`,
  ],
];

export { NL_PATTERNS };
