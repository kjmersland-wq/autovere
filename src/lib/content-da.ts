/**
 * Danish translations for content that lives in data modules
 * (compliance, pass intel, corridor map, trip data).
 *
 * Keyed by the exact English source string so components can wrap any
 * data-driven label with `tr(...)` from `useTr()`.
 */
export const CONTENT_DA: Record<string, string> = {
  /* ---------------- Map layer: viewpoints ---------------- */
  "Scenic Viewpoints & Photo Stops": "Naturskønne udsigtspunkter og fotostop",
  "Panorama rest area": "Rasteplads med panorama",
  "Lakeside viewpoint": "Udsigtspunkt ved søen",
  "Alpine summit overlook": "Udsigt fra alpetop",
  "Coastal cliff lookout": "Udsigtspunkt på kystklippe",
  "Valley overlook · picnic tables · photo spot":
    "Udsigt over dalen · picnicborde · fotosted",
  "Free parking · short walk to the shoreline":
    "Gratis parkering · kort gåtur til kysten",
  "Glacier panorama · café · restrooms": "Gletsjerpanorama · café · toiletter",
  "Sunset viewpoint · motorhome-friendly parking":
    "Solnedgangsudsigt · autocampervenlig parkering",
  /* ---------------- Compliance: heavy motorhome systems ---------------- */
  Austria: "Østrig",
  Switzerland: "Schweiz",
  Slovenia: "Slovenien",
  Germany: "Tyskland",
  France: "Frankrig",
  Italy: "Italien",
  Norway: "Norge",
  Sweden: "Sverige",
  Denmark: "Danmark",
  Spain: "Spanien",
  Portugal: "Portugal",
  Netherlands: "Holland",
  Belgium: "Belgien",
  "United Kingdom": "Storbritannien",
  "Belgium & Netherlands": "Belgien og Holland",
  Ferries: "Færger",

  "GO-Box (ASFINAG)": "GO-Box (ASFINAG)",
  "Motorhomes over 3.5 t maximum permissible weight may not use the car vignette. You need a GO-Box on-board unit, charged per kilometre by axle count and EURO class. Pick one up at a GO point near the border before your first motorway kilometre.":
    "Autocampere med en tilladt totalvægt over 3,5 t må ikke bruge bilvignetten. Du skal bruge en GO-Box-enhed, som opkræver pr. kilometer efter akselantal og EURO-klasse. Hent en ved et GO-punkt nær grænsen, inden du kører den første motorvejskilometer.",
  "LSVA / PSVA heavy vehicle charge": "LSVA/PSVA-afgift for tunge køretøjer",
  "Above 3.5 t the Swiss motorway vignette no longer covers you. Foreign motorhomes normally pay the flat-rate PSVA (per-day or per-year) declared at the border customs post; ID-based LSVA applies to commercial units.":
    "Over 3,5 t dækker den schweiziske motorvejsvignet ikke længere. Udenlandske autocampere betaler normalt den faste PSVA-afgift (pr. dag eller pr. år) angivet ved grænsetoldstedet; ID-baseret LSVA gælder for erhvervskøretøjer.",
  "DarsGo unit": "DarsGo-enhed",
  "Slovenian motorways charge vehicles over 3.5 t through a DarsGo on-board unit with free-flow gantries. Register online or at a DarsGo service point; the e-vignette is invalid for your weight class.":
    "Slovenske motorveje opkræver afgift af køretøjer over 3,5 t via en DarsGo-enhed og automatiske portaler. Registrer dig online eller på et DarsGo-servicested; e-vignetten gælder ikke for din vægtklasse.",
  "No toll for private motorhomes": "Ingen afgift for private autocampere",
  "Privately used motorhomes are exempt from the German Lkw-Maut regardless of weight, but weight-based speed limits and overtaking bans still apply.":
    "Privat anvendte autocampere er fritaget for den tyske Lkw-Maut uanset vægt, men vægtbaserede fartgrænser og overhalingsforbud gælder stadig.",

  /* ---------------- Compliance: clearance advisories ---------------- */
  "Alpine underpasses & village arches": "Alpine underføringer og byporte",
  "Several Alpine valley roads (Susa, Vinschgau, Maurienne) and old town gateways drop below 3.2 m. Trust posted signs over your navigation app and follow the signed HGV/camper diversion where offered.":
    "Flere alpine dalveje (Susa, Vinschgau, Maurienne) og gamle byporte har en frihøjde under 3,2 m. Stol på skiltningen frem for din navigationsapp, og følg den skiltede omvej for lastbiler/autocampere, hvor den findes.",
  "Tunnel height & LPG restrictions": "Højde- og LPG-restriktioner i tunneler",
  "Mont Blanc, Fréjus and Gotthard road tunnels apply strict height, length and LPG-cylinder rules. Vehicles above 4.0 m are routed to dedicated lanes and may face convoy timing.":
    "Vejtunnelerne Mont Blanc, Fréjus og Gotthard har strenge regler for højde, længde og LPG-flasker. Køretøjer over 4,0 m ledes til særlige baner og kan møde konvojkørsel.",
  "Ferry deck clearance": "Frihøjde på færgedæk",
  "Book ferries in the correct height and length bracket. Under-declaring your height means a re-fare at the ramp or refused boarding.":
    "Book færger i den korrekte højde- og længdekategori. Underangivelse af højden betyder efterregulering ved rampen eller afvist ombordstigning.",
  "Roof box, aerials & solar": "Tagboks, antenner og solpaneler",
  "Measure to the highest fixed point — solar panels, satellite domes and roof boxes typically add 15–25 cm over the plate height.":
    "Mål til det højeste faste punkt — solpaneler, parabolantenner og tagbokse tilføjer typisk 15–25 cm i forhold til den registrerede højde.",

  /* ---------------- Compliance: speed rules ---------------- */
  "100 km/h (over 3.5 t)": "100 km/t (over 3,5 t)",
  "110 km/h (over 3.5 t)": "110 km/t (over 3,5 t)",
  "80 km/h with caravan/heavy load": "80 km/t med campingvogn/tung last",
  "Above 3.5 t you are capped at 100 km/h on the Autobahn and 80 km/h on rural roads, and overtaking bans for heavy vehicles apply to you.":
    "Over 3,5 t er du begrænset til 100 km/t på Autobahn og 80 km/t på landeveje, og overhalingsforbud for tunge køretøjer gælder også for dig.",
  "Over 3.5 t: 110 km/h motorway, 100 km/h dual carriageway, 80 km/h single carriageway. Keep 50 m from the vehicle ahead.":
    "Over 3,5 t: 110 km/t på motorvej, 100 km/t på dobbeltsporet vej, 80 km/t på enkeltsporet vej. Hold 50 m til køretøjet foran.",
  "100 km/h motorway and 80 km/h on main roads; the left-most lane of three is closed to vehicles over 3.5 t.":
    "100 km/t på motorvej og 80 km/t på hovedveje; den yderste venstre af tre baner er lukket for køretøjer over 3,5 t.",
  "Motorhomes over 3.5 t are limited to 80 km/h; many fjord roads sign 60 km/h with passing places only.":
    "Autocampere over 3,5 t er begrænset til 80 km/t; mange fjordveje har skiltet 60 km/t med kun vigepladser.",
  "Heavy motorhomes are limited to 100 km/h and must use the lorry lane in tunnels with lane separation.":
    "Tunge autocampere er begrænset til 100 km/t og skal bruge lastbilbanen i tunneler med baneadskillelse.",

  /* ---------------- Compliance: LEZ ---------------- */
  "Crit'Air vignette": "Crit'Air-mærke",
  "A Crit'Air sticker must be displayed inside the windscreen in every French ZFE. Classes are based on EURO standard and fuel; motorhomes are classed like the base vehicle.":
    "Et Crit'Air-mærke skal være synligt inde i forruden i alle franske ZFE-zoner. Klasserne følger EURO-standard og brændstoftype; autocampere klassificeres som grundkøretøjet.",
  "€3.81 incl. postage": "3,81 € inkl. porto",
  "Order 3–4 weeks ahead for delivery abroad": "Bestil 3-4 uger i forvejen ved levering til udlandet",
  "Required for motorcycles and scooters too.": "Kræves også for motorcykler og scootere.",
  "Umweltplakette (green zone 4)": "Umweltplakette (grøn zone 4)",
  "A green sticker (Schadstoffgruppe 4) is required in ~50 Umweltzonen. Enforcement is by camera and patrol; a missing badge is a €100 fine.":
    "Et grønt mærke (Schadstoffgruppe 4) kræves i ca. 50 Umweltzonen. Håndhævelse sker med kamera og patrulje; manglende mærke koster 100 € i bøde.",
  "€6–€30 depending on issuer": "6-30 € afhængigt af udsteder",
  "Order 2 weeks ahead or buy at a TÜV/DEKRA station on arrival":
    "Bestil 2 uger i forvejen, eller køb på en TÜV/DEKRA-station ved ankomst",
  "Motorcycles are exempt from German Umweltzonen.": "Motorcykler er fritaget for tyske Umweltzonen.",
  "LEZ online registration": "Online registrering til miljøzone",
  "No sticker — foreign plates must be registered online before the first entry into Brussels, Antwerp, Ghent, Rotterdam or Amsterdam. Cameras match plates automatically.":
    "Intet mærke — udenlandske nummerplader skal registreres online, inden første indkørsel i Bruxelles, Antwerpen, Gent, Rotterdam eller Amsterdam. Kameraer genkender pladerne automatisk.",
  "Free registration; fines from €150": "Gratis registrering; bøder fra 150 €",
  "Register at least 24 hours before entry": "Registrer dig mindst 24 timer før indkørsel",
  "Motorcycles are currently outside the Belgian and Dutch LEZ scope.":
    "Motorcykler er i øjeblikket ikke omfattet af de belgiske og hollandske miljøzoner.",
  "ULEZ + Congestion Charge": "ULEZ + trængselsafgift",
  "Greater London's ULEZ charges non-compliant vehicles £12.50/day, plus £15 Congestion Charge in the central zone on weekdays. Pay online or by Auto Pay.":
    "Storlondons ULEZ opkræver £12,50/dag for køretøjer, der ikke overholder kravene, plus £15 i trængselsafgift i centrumzonen på hverdage. Betal online eller via Auto Pay.",
  "£12.50/day ULEZ · £15/day Congestion Charge": "£12,50/dag ULEZ · £15/dag trængselsafgift",
  "Pay up to 3 days after travel": "Betal op til 3 dage efter turen",
  "Pre-Euro 3 motorcycles pay ULEZ; Congestion Charge does not apply to motorcycles.":
    "Motorcykler ældre end Euro 3 betaler ULEZ; trængselsafgiften gælder ikke for motorcykler.",

  /* ---------------- Compliance: toll tags ---------------- */
  "Norway, Sweden, Denmark — city rings, bridges, Øresund & Storebælt":
    "Norge, Sverige, Danmark — bomringe, broer, Øresund og Storebælt",
  "Free-flow gantries, no barrier stop": "Automatiske portaler, ingen stop ved bom",
  "France, Spain, Portugal, Italy — barrier motorways":
    "Frankrig, Spanien, Portugal, Italien — motorveje med bomme",
  "Yellow 'T' / télépéage lanes, barrier lifts automatically":
    "Gule „T”/télépéage-baner, bommen løftes automatisk",
  "US turnpikes, express lanes and bridges": "Amerikanske betalingsveje, ekspresbaner og broer",
  "Open-road tolling gantries, no cash booth": "Automatiske afgiftsportaler, ingen kontantboder",
  "Ontario Highway 407 ETR and 412/418": "Highway 407 ETR og 412/418 i Ontario",
  "Transponder rate instead of camera video-toll charge":
    "Brikpris i stedet for kameraafgift",

  /* ---------------- Corridor map ---------------- */
  "EV Fast Chargers": "Hurtigladere til elbiler",
  "Fuel Stations": "Tankstationer",
  "RV Campgrounds & Service Areas": "Campingpladser og servicesteder for autocampere",
  "Mountain Passes": "Bjergpas",
  "Ferry Terminals": "Færgeterminaler",
  "Live Government Fuel Data (prix-carburants)": "Aktuelle statslige brændstofdata (prix-carburants)",
  "Station prices published by the French Ministry of Economy open data feed.":
    "Stationspriser offentliggjort af det franske økonomiministeriums åbne datakilde.",
  "Live E-Control Spritpreisrechner": "Aktuel E-Control Spritpreisrechner",
  "Austrian regulator E-Control publishes station-level prices, updated through the day.":
    "Den østrigske tilsynsmyndighed E-Control offentliggør priser pr. station, som opdateres i løbet af dagen.",
  "National Average Benchmark (EAFO / EU Bulletin)": "National gennemsnitsreference (EAFO/EU-bulletin)",
  "Indicative national averages from EAFO and the EU Weekly Oil Bulletin.":
    "Vejledende landegennemsnit fra EAFO og EU's ugentlige oliebulletin.",
  "per gallon": "pr. gallon",
  "per litre": "pr. liter",
  "24/7 · restrooms · café": "Døgnåbent · toiletter · café",
  "Dump station · fresh water · overnight pitches": "Tømmestation · rent vand · overnatningspladser",
  "Ferry terminal · check-in 30 min before departure": "Færgeterminal · check-in 30 min før afgang",
  "24/7": "Døgnåbent",
  "HGV/RV lanes": "Baner for lastbiler/autocampere",
  "Café": "Café",
  AdBlue: "AdBlue",
  "Car wash": "Bilvask",
  Europe: "Europa",
  "United States": "USA",
  Canada: "Canada",

  /* Camp spots */
  "Aire de camping-car municipale": "Kommunal autocamperplads (aire)",
  "Aire · France": "Aire · Frankrig",
  "Stellplatz am Fluss": "Stellplatz ved floden",
  "Stellplatz · Germany/Austria": "Stellplatz · Tyskland/Østrig",
  "Camping Alpenblick": "Camping Alpenblick",
  "Rated campsite · Alps": "Bedømt campingplads · Alperne",
  "Bobilparkering Fjordsyn": "Bobilparkering Fjordsyn",
  "Bobil pitch · Norway": "Autocamperplads · Norge",
  "Sosta camper Lago": "Sosta camper Lago",
  "Sosta · Italy": "Sosta · Italien",
  "KOA Holiday Resort": "KOA Holiday Resort",
  "Full hook-up RV park": "Autocamperplads med fuld tilslutning",
  "State Park Campground": "Campingplads i statspark",
  "Public campground": "Offentlig campingplads",
  "Interstate Travel Plaza": "Interstate Travel Plaza",
  "Overnight service area": "Servicested til overnatning",
  "Lakeside RV Resort": "Lakeside RV Resort",
  "Premium RV resort": "Eksklusiv autocamperplads",
  "Provincial Park Campground": "Campingplads i provinspark",
  "Halte routière VR": "Halte routière VR",
  "Roadside VR halt": "Vejsidepladser for autocampere",
  "KOA Campground": "KOA Campground",
  "Mountain View RV Park": "Mountain View RV Park",
  "Rated RV park": "Bedømt autocamperplads",
  "Dump station": "Tømmestation",
  "Fresh water": "Rent vand",
  "Electric hook-up": "Eltilslutning",
  "Overnight pitches": "Overnatningspladser",
  "Grey water": "Gråt spildevand",
  WiFi: "Wi-Fi",
  Showers: "Brusere",
  Laundry: "Vaskeri",
  Restaurant: "Restaurant",
  "Fjord view": "Fjordudsigt",
  Toilets: "Toiletter",
  Shade: "Skygge",
  "Walk to town": "Gåafstand til byen",
  "50-amp": "50 A",
  "30/50-amp": "30/50 A",
  Sewer: "Kloak",
  Pool: "Pool",
  "Potable water": "Drikkevand",
  Trails: "Vandrestier",
  "RV dump": "Tømmested for autocampere",
  Propane: "Propan",
  "24/7 fuel": "Døgnåben brændstof",
  Firewood: "Brænde",
  "Full hook-up": "Fuld tilslutning",
  "Overnight parking": "Overnatningsparkering",

  /* ---------------- Mountain passes ---------------- */
  "Grossglockner High Alpine Road": "Grossglockner Hochalpenstrasse",
  "🇦🇹 Austria · Salzburg ↔ Carinthia": "🇦🇹 Østrig · Salzburg ↔ Kärnten",
  "2 504 m · Hochtor summit": "2504 m · Hochtor-toppen",
  "Early May – late October (gates close nightly)":
    "Tidlig maj – slutningen af oktober (bommene lukker hver aften)",
  "€40.00 car day ticket · €30.00 motorcycle · motorhomes €40.00 (over 3.5 t on request)":
    "40,00 € dagsbillet for bil · 30,00 € motorcykel · autocamper 40,00 € (over 3,5 t efter forespørgsel)",
  "Toll road, not part of the Austrian vignette network. Gates open ~05:30–06:00 and close 19:30–21:30 depending on the month — plan to be through before dusk and enjoy the Edelweissspitze detour.":
    "Betalingsvej, ikke en del af det østrigske vignetsystem. Bommene åbner ca. 05:30-06:00 og lukker 19:30-21:30 afhængigt af måneden — planlæg at være igennem inden mørkets frembrud, og nyd omvejen til Edelweissspitze.",
  "Riders get a reduced ticket and a dedicated Bikers Point at Fuschertörl.":
    "Motorcyklister får en reduceret billet og et dedikeret Bikers Point ved Fuschertörl.",
  "Passo dello Stelvio (Stelvio Pass)": "Passo dello Stelvio (Stelvio-passet)",
  "🇮🇹 Italy · Bormio ↔ Trafoi, South Tyrol": "🇮🇹 Italien · Bormio ↔ Trafoi, Sydtyrol",
  "2 758 m · 48 numbered hairpins on the north ramp":
    "2758 m · 48 nummererede hårnålesving på nordsiden",
  "Usually late May/June – early November, snow dependent":
    "Normalt sidst i maj/juni – begyndelsen af november, afhængigt af sne",
  "Free of charge": "Gratis",
  "Europe's most photogenic hairpin ladder. Ride or drive it early — coaches and cyclists fill the switchbacks from 10:00. Expect 8–12 °C colder at the summit than in Bormio.":
    "Europas mest fotogene stige af hårnålesving. Kør det tidligt — turistbusser og cyklister fylder svingene fra kl. 10:00. Forvent 8-12 °C koldere på toppen end i Bormio.",
  "Tight, off-camber hairpins: stay wide on entry and watch for gravel after rain.":
    "Snævre hårnålesving med skæv hældning: hold dig bredt ved indkørslen, og vær opmærksom på grus efter regn.",
  "Furka & Grimsel Passes": "Furka- og Grimsel-passene",
  "🇨🇭 Switzerland · Valais ↔ Uri ↔ Bern": "🇨🇭 Schweiz · Valais ↔ Uri ↔ Bern",
  "Furka 2 429 m · Grimsel 2 164 m": "Furka 2429 m · Grimsel 2164 m",
  "Roughly mid-June – late October": "Cirka midt i juni – slutningen af oktober",
  "Free passes · CHF 40 motorway vignette still required for Swiss motorways":
    "Gratis pas · schweizisk motorvejsvignet på CHF 40 er stadig påkrævet",
  "Check the live pass board before committing — snow chains can be mandated at short notice even in summer. The Furka–Grimsel–Susten triangle is a perfect full-day loop.":
    "Tjek den aktuelle statustavle, inden du begynder — snekæder kan blive påkrævet med kort varsel, selv om sommeren. Trekanten Furka-Grimsel-Susten er en perfekt heldagstur.",
  "Cool mornings at altitude: pack a thermal layer and waterproofs.":
    "Kolde morgener i højden: pak et termolag og regntøj.",
  "Trollstigen & Sognefjellet": "Trollstigen og Sognefjellet",
  "🇳🇴 Norway · Møre og Romsdal · Jotunheimen": "🇳🇴 Norge · Møre og Romsdal · Jotunheimen",
  "Trollstigen 858 m · Sognefjellet 1 434 m (highest road in Northern Europe)":
    "Trollstigen 858 m · Sognefjellet 1434 m (den højeste vej i Nordeuropa)",
  "Trollstigen late May – October · Sognefjellet May – November":
    "Trollstigen slut maj – oktober · Sognefjellet maj – november",
  "Free roads · parking fee at the Trollstigen viewpoint":
    "Gratis veje · parkeringsafgift ved Trollstigen-udsigtspunktet",
  "Both are National Tourist Routes with hairpins and narrow shoulders. Trollstigen has periodic rockfall closures — check the live status the morning you travel. Vehicles over 12.4 m are not permitted on Trollstigen.":
    "Begge er Nasjonale Turistveier med hårnålesving og smalle vejkanter. Trollstigen har periodiske lukninger pga. stenskred — tjek den aktuelle status om morgenen, inden du kører. Køretøjer over 12,4 m må ikke køre på Trollstigen.",
  "Wet granite and painted lines get slick in fjord drizzle — brake early into the hairpins.":
    "Vådt granit og malede linjer bliver glatte i fjordens støvregn — brems tidligt inden svingene.",
  "Icefields Parkway (Highway 93N)": "Icefields Parkway (Highway 93N)",
  "🇨🇦 Alberta · Lake Louise ↔ Jasper": "🇨🇦 Alberta · Lake Louise ↔ Jasper",
  "2 088 m · Bow Summit": "2088 m · Bow Summit",
  "Open year-round, with winter storm closures": "Åben hele året, med lukninger ved vinterstorme",
  "Parks Canada pass required: C$11.00 adult/day or C$75.25 Discovery Pass (annual, per vehicle)":
    "Parks Canada-billet påkrævet: 11,00 CAD pr. voksen/dag eller 75,25 CAD Discovery Pass (årligt, pr. køretøj)",
  "232 km of glaciers with no fuel between Lake Louise and Saskatchewan River Crossing — top up before you start. From 1 Nov to 31 Mar winter tires or carried chains are mandatory on Highway 93N.":
    "232 km med gletsjere uden brændstof mellem Lake Louise og Saskatchewan River Crossing — tank op, inden du starter. Fra 1. november til 31. marts er vinterdæk eller medbragte kæder obligatoriske på Highway 93N.",
  "Wildlife on the shoulder at dawn and dusk — ride the centre of your lane and keep speed down.":
    "Vildt ved vejkanten ved daggry og skumring — kør midt i din bane, og hold farten nede.",
  "Tail of the Dragon (US 129, Deals Gap)": "Tail of the Dragon (US 129, Deals Gap)",
  "🇺🇸 North Carolina ↔ Tennessee": "🇺🇸 North Carolina ↔ Tennessee",
  "318 curves in 11 miles (17.7 km)": "318 sving på 17,7 km",
  "Open year-round · best March – November, ice risk in winter":
    "Åben hele året · bedst marts – november, risiko for is om vinteren",
  "Free — no tolls": "Gratis — ingen afgifter",
  "Strictly enforced 30 mph (48 km/h) limit with unmarked patrols and roadside speed radar. No guardrails on many curves and zero fuel on the strip — fill up in Robbinsville or Tapoco.":
    "Strengt håndhævet grænse på 48 km/t med civile patruljer og fartradar. Ingen autoværn på mange sving, og ingen brændstof på strækningen — tank op i Robbinsville eller Tapoco.",
  "Photographers shoot every curve — ride your own pace, not the camera's. Trailers and RVs should use US 74 instead.":
    "Fotografer opstiller sig ved hvert sving — kør i dit eget tempo, ikke kameraets. Trailere og autocampere bør i stedet bruge US 74.",
  "Open · winter tyres / chains required": "Åben · vinterdæk/kæder påkrævet",
  Open: "Åben",
  "Closed for the season": "Lukket for sæsonen",
  "Opening/closing window · check live status": "Åbnings-/lukningsvindue · tjek aktuel status",
  "€30.00 motorcycle day ticket (reduced)": "30,00 € dagsbillet for motorcykel (reduceret)",

  /* ---------------- Border tips ---------------- */
  "Refuel in Austria before the Brenner Pass": "Tank op i Østrig før Brennerpasset",
  "Diesel and petrol run roughly 15% cheaper in Austria than in Italy. Fill the tank around Innsbruck or Matrei am Brenner — the last Austrian stations before the border are the cheapest on the corridor.":
    "Diesel og benzin er cirka 15% billigere i Østrig end i Italien. Fyld tanken op omkring Innsbruck eller Matrei am Brenner — de sidste østrigske stationer før grænsen er de billigste på hele ruten.",
  "≈ €12–18 saved on a 60 L tank": "≈ 12-18 € sparet på en 60 l tank",
  "Plan a fuel stop at Matrei am Brenner": "Planlæg et brændstofstop ved Matrei am Brenner",
  "Swiss motorways need the CHF 40 annual vignette":
    "Schweiziske motorveje kræver den årlige vignet på CHF 40",
  "Switzerland has no day or week option — one sticker (or the e-vignette) costs CHF 40 and is valid for the whole calendar year, even if you only transit for two hours. Motorcycles need their own vignette.":
    "Schweiz har ingen dags- eller ugeløsning — ét mærke (eller e-vignetten) koster CHF 40 og gælder hele kalenderåret, selv hvis du kun kører igennem i to timer. Motorcykler skal have deres egen vignet.",
  "Switch to Smart Bypass to route around Swiss motorways on a short transit leg":
    "Skift til Smart omvej for at undgå schweiziske motorveje på en kort gennemkørsel",
  "Try the 🧭 Smart Bypass variant": "Prøv varianten 🧭 Smart omvej",
  "Luxembourg fuel arbitrage on the Benelux corridor":
    "Brændstofarbitrage i Luxembourg på Benelux-ruten",
  "Luxembourg keeps some of the lowest excise duties in Western Europe — expect 15–25 cents/litre less than France, Belgium or Germany. Stations near Wasserbillig, Schengen and Berchem are the classic top-up points.":
    "Luxembourg har nogle af de laveste afgifter i Vesteuropa — forvent 15-25 cent/liter mindre end i Frankrig, Belgien eller Tyskland. Stationer nær Wasserbillig, Schengen og Berchem er de klassiske optankningssteder.",
  "≈ €10–15 per tank versus neighbouring countries": "≈ 10-15 € pr. tank sammenlignet med nabolandene",
  "Add a Luxembourg fuel stop": "Tilføj et brændstofstop i Luxembourg",
  "Cross into Spain (or Andorra) before you refuel":
    "Kør ind i Spanien (eller Andorra), inden du tanker op",
  "Spanish pump prices sit well below French ones, and Andorra is cheaper still. Coming down the A9/AP-7, hold out past La Jonquera; on the Atlantic side, Irún and Behobia are the border bargains.":
    "Spanske pumpepriser ligger langt under de franske, og Andorra er endnu billigere. Kommer du ned ad A9/AP-7, så vent til efter La Jonquera; på Atlanterhavssiden er Irún og Behobia grænsens gode tilbud.",
  "≈ 20–30 cents/litre versus France": "≈ 20-30 cent/liter i forhold til Frankrig",
  "Add a La Jonquera or Irún fuel stop": "Tilføj et brændstofstop ved La Jonquera eller Irún",
  "State fuel-tax arbitrage": "Arbitrage af statslige brændstofafgifter",
  "State excise makes a real difference: California and Pennsylvania sit at the top, while Texas, Missouri, Mississippi and Arizona are consistently cheap. Fill up just before entering a high-tax state.":
    "Statsafgifter gør en reel forskel: Californien og Pennsylvania ligger i top, mens Texas, Missouri, Mississippi og Arizona konsekvent er billige. Tank op lige inden du kører ind i en stat med høje afgifter.",
  "Up to US$0.70/gal between neighbouring states": "Op til 0,70 USD/gallon mellem nabostater",
  "Fuel is usually cheaper south of the 49th": "Brændstof er som regel billigere syd for den 49. breddegrad",
  "Once currency and litres-vs-gallons are converted, US fuel typically lands 20–30% below Canadian pumps — biggest gaps around BC and Québec. Cross with a low tank, return with a full one (within duty-free allowances).":
    "Når valuta og liter/gallon er omregnet, ligger amerikansk brændstof typisk 20-30% under canadiske priser — den største forskel er omkring British Columbia og Québec. Kør over med lav tank, vend hjem med fuld (inden for toldfrie grænser).",
  "≈ C$25–40 per tank on a border run": "≈ 25-40 CAD pr. tank på en grænsetur",

  /* ---------------- Border crossings ---------------- */
  "Germany → Austria": "Tyskland → Østrig",
  "Open border · random ID checks": "Åben grænse · stikprøvekontrol af ID",
  "Free movement inside Schengen. Bavaria runs intermittent spot checks on the A8/A93 — keep passports or ID cards within reach and you'll roll straight through.":
    "Fri bevægelighed inden for Schengen. Bayern gennemfører lejlighedsvis stikprøvekontrol på A8/A93 — hav pas eller ID-kort inden for rækkevidde, så kører du lige igennem.",
  "Photo ID for every occupant (random checks)": "Billed-ID for alle passagerer (stikprøvekontrol)",
  "Austrian motorway vignette valid before the first motorway metre":
    "Gyldig østrigsk motorvejsvignet inden den første motorvejsmeter",
  "Warning triangle, hi-vis vest and first-aid kit on board":
    "Advarselstrekant, refleksvest og førstehjælpskasse i bilen",
  "Typically 0–10 min": "Normalt 0-10 min",
  "Austria → Italy (Brenner)": "Østrig → Italien (Brenner)",
  "Open border · occasional customs patrol": "Åben grænse · lejlighedsvis toldpatrulje",
  "No passport control at the Brenner, but Italian Guardia di Finanza patrols do stop vehicles. Switch to Telepass lanes only if you have a transponder fitted.":
    "Ingen paskontrol ved Brenner, men den italienske Guardia di Finanza standser køretøjer. Brug kun Telepass-baner, hvis du har en brik monteret.",
  "Photo ID on board": "Billed-ID i bilen",
  "Brenner autostrada toll paid at the barrier (card, cash or Telepass)":
    "Afgiften for Brenner-motorvejen betales ved bommen (kort, kontant eller Telepass)",
  "Crit'Air-style city rules do not apply, but Italian ZTL zones do":
    "Crit'Air-lignende byregler gælder ikke, men italienske ZTL-zoner gør",
  "Typically 0–15 min at the toll plaza": "Normalt 0-15 min ved betalingsanlægget",
  "Swiss borders (Schengen, non-EU customs)": "Schweiziske grænser (Schengen, uden for EU's toldunion)",
  "Customs control · goods declaration": "Toldkontrol · vareangivelse",
  "Switzerland is in Schengen but outside the EU customs union, so customs officers can and do stop vehicles. Declare goods above the duty-free allowance and buy the vignette before the first motorway.":
    "Schweiz er med i Schengen, men uden for EU's toldunion, så toldere kan og vil standse køretøjer. Angiv varer over den toldfrie grænse, og køb vignetten inden den første motorvej.",
  "CHF 40 motorway vignette (annual) or e-vignette per vehicle":
    "Motorvejsvignet på CHF 40 (årlig) eller e-vignet pr. køretøj",
  "Customs declaration for goods over CHF 300 per person":
    "Toldangivelse for varer over CHF 300 pr. person",
  "Meat, dairy and alcohol allowances are strictly enforced":
    "Grænser for kød, mejeriprodukter og alkohol håndhæves strengt",
  "0–20 min · longer at Basel and Chiasso on weekends":
    "0-20 min · længere ved Basel og Chiasso i weekender",
  "UK ↔ France (Channel Tunnel & Dover–Calais)":
    "Storbritannien ↔ Frankrig (Kanaltunnelen og Dover-Calais)",
  "Full passport control & customs": "Fuld paskontrol og toldkontrol",
  "Post-Brexit juxtaposed controls mean both British and French officers check you before boarding. Arrive 60–90 min ahead in peak season and have every document to hand.":
    "Efter Brexit betyder sidestillet kontrol, at både britiske og franske betjente tjekker dig, inden du kører om bord. Ankom 60-90 min i forvejen i højsæsonen, og hav alle dokumenter klar.",
  "Valid passport for every traveller (ID cards no longer accepted for UK entry)":
    "Gyldigt pas for alle rejsende (ID-kort accepteres ikke længere ved indrejse i Storbritannien)",
  "EU Entry/Exit System biometric registration on first crossing":
    "Biometrisk registrering i EU's ind-/udrejsesystem ved første overgang",
  "Customs declaration for goods, alcohol, tobacco and pets (animal health certificate)":
    "Toldangivelse for varer, alkohol, tobak og kæledyr (sundhedsattest for dyr)",
  "UK sticker on the vehicle and headlamp beam deflectors":
    "UK-mærke på køretøjet og afblænding af forlygter",
  "30–120 min in summer peaks": "30-120 min i sommertravlheden",
  "Croatia ↔ Bosnia & Herzegovina (Neum corridor)":
    "Kroatien ↔ Bosnien-Hercegovina (Neum-korridoren)",
  "Passport control · EU external border": "Paskontrol · EU's ydre grænse",
  "The Neum corridor crosses out of and back into the EU within 9 km. Green card insurance is essential, and queues build sharply on July/August weekends. The Pelješac Bridge bypasses it entirely.":
    "Neum-korridoren fører ud af og tilbage til EU inden for 9 km. Grønt kort-forsikring er nødvendig, og der kan opstå lange køer i juli/august weekender. Pelješac-broen omgår korridoren helt.",
  "Passport for every occupant (two stamps in 20 minutes)":
    "Pas for alle passagerer (to stempler på 20 minutter)",
  "Green Card motor insurance valid for BiH": "Grønt kort-motorforsikring gyldig for Bosnien-Hercegovina",
  "Vehicle registration document in the driver's name or a notarised letter":
    "Registreringsattest i førerens navn eller et notarbekræftet dokument",
  "15–90 min in high season": "15-90 min i højsæsonen",
  "USA ↔ Canada land border": "Landegrænse USA ↔ Canada",
  "Passport control · CBP / CBSA inspection": "Paskontrol · CBP/CBSA-kontrol",
  "Every crossing is a full immigration and customs stop. NEXUS lanes cut the wait dramatically at Peace Arch, Detroit–Windsor and Niagara. Declare all food, alcohol, cannabis and firearms — penalties are steep.":
    "Hver grænseovergang er et fuldt indrejse- og toldstop. NEXUS-baner skærer ventetiden markant ved Peace Arch, Detroit-Windsor og Niagara. Angiv al mad, alkohol, cannabis og skydevåben — straffene er høje.",
  "Passport, NEXUS card or enhanced driver's licence":
    "Pas, NEXUS-kort eller udvidet kørekort",
  "Vehicle registration and proof of insurance valid in the destination country":
    "Registreringsattest og forsikringsbevis gyldigt i destinationslandet",
  "Declare food, alcohol, tobacco, cannabis and pets; firearms need advance paperwork":
    "Angiv mad, alkohol, tobak, cannabis og kæledyr; skydevåben kræver papirer i forvejen",
  "Electronic toll transponders (E-ZPass, 407 ETR) are not interchangeable across the border":
    "Elektroniske afgiftsbrikker (E-ZPass, 407 ETR) kan ikke bruges på tværs af grænsen",
  "10–60 min · check live CBP border wait times":
    "10-60 min · tjek de aktuelle ventetider hos CBP",

  "Rider Safety & Gear Radar": "Sikkerheds- og udstyrsradar for motorcyklister",
  "Camper Clearance & Weight Radar": "Radar for autocamperens frihøjde og vægt",
  "Driver Safety Radar": "Sikkerhedsradar for bilister",
  "🧤 Gear & legal kit": "🧤 Udstyr og lovpligtigt grej",
  "🏔️ Mountain pass alerts": "🏔️ Advarsler om bjergpas",
  "⛽ Long-stretch fuel alerts": "⛽ Advarsler om lange strækninger uden brændstof",
  "📏 Clearance warnings": "📏 Advarsler om frihøjde",
  "⚖️ Weight & axle limits": "⚖️ Vægt- og akselgrænser",
  "🛠️ Services": "🛠️ Service",
  "🚗 On the road": "🚗 På vejen",
  "🏔️ Pass conditions": "🏔️ Forhold på passet",
  "France: CE-approved gloves are mandatory for rider and pillion, and a high-vis vest must be carried within reach.": "Frankrig: CE-godkendte handsker er obligatoriske for fører og passager, og en refleksvest skal medbringes inden for rækkevidde.",
  "Austria & Germany: carry a first-aid kit meeting DIN 13167 (motorcycle standard) — small, and checked at roadside stops.": "Østrig og Tyskland: medbring en førstehjælpskasse, der opfylder DIN 13167 (motorcykelstandard) — lille, og bliver tjekket ved vejsidekontroller.",
  "Keep your vest, kit and documents on top of the pannier so a check takes seconds.": "Hold vest, kasse og dokumenter øverst i sidetasken, så en kontrol tager få sekunder.",
  "Two stretches exceed 180 km between open stations — top up before the pass climbs.": "To strækninger overstiger 180 km mellem åbne stationer — tank op, inden opkørslen til passet begynder.",
  "Night-time pumps on the alpine leg are card-only; carry a backup card.": "Natåbne pumper på den alpine strækning tager kun kort — medbring et reservekort.",
  "Two tunnels on this route cap height at 3.2 m — your 3.05 m profile clears with margin.": "To tunneler på denne rute har en maksimal højde på 3,2 m — din højde på 3,05 m klarer det med margin.",
  "One low village archway (2.9 m) was bypassed via the valley road automatically.": "En lav byport (2,9 m) blev automatisk omgået via dalvejen.",
  "Route verified for vehicles up to 3.5 t; a 7.5 t restriction on the old pass road is avoided.": "Ruten er verificeret for køretøjer op til 3,5 t; en 7,5 t-begrænsning på den gamle passvej er undgået.",
  "Crosswind advisory on the coastal bridge section — reduce speed with a high side profile.": "Advarsel om sidevind på kystbrostrækningen — sænk farten ved høj sideprofil.",
  "Three overnight-friendly service areas with fresh water and grey-water disposal along the way.": "Tre overnatningsvenlige servicesteder med rent vand og bortskaffelse af gråt spildevand undervejs.",
  "Winter equipment rules apply on the alpine section between October and April.": "Regler om vinterudstyr gælder på den alpine strækning mellem oktober og april.",
  "Rest stops are mapped every 2 hours so the drive stays fresh and relaxed.": "Der er lagt rastepladser ind hver 2. time, så turen forbliver frisk og afslappet.",
  "Every toll gantry on this route accepts contactless cards — no cash needed.": "Alle afgiftsportaler på denne rute accepterer kontaktløse kort — ingen kontanter nødvendige.",
  "Stelvio Pass (2,757 m) — 48 hairpins, open, dry tarmac forecast until early evening.": "Stelvio-passet (2757 m) — 48 hårnålesving, åbent, tør vejbane frem til tidlig aften.",
  "Grossglockner High Alpine Road — toll road, gates close at 21:00; ride it before dusk.": "Grossglockner Hochalpenstrasse — betalingsvej, bommene lukker kl. 21:00; kør den inden mørkets frembrud.",
  "Furka Pass — clear and open today, light crosswinds on the western ramp.": "Furka-passet — klart og åbent i dag, let sidevind på den vestlige side.",
  "Trollstigen — single-lane sections with tourist traffic; take the early morning slot.": "Trollstigen — enkeltsporede strækninger med turisttrafik; vælg det tidlige morgenslot.",
  "Tail of the Dragon (US-129) — 318 curves in 11 miles; watch for gravel on the inside lines.": "Tail of the Dragon (US-129) — 318 sving på 18 km; pas på grus på de indre linjer.",
  "Icefields Parkway — stunning but exposed; wildlife on the road at dawn and dusk.": "Icefields Parkway — betagende, men udsat; vildt på vejen ved daggry og skumring.",
  "🇩🇪 Germany": "🇩🇪 Tyskland",
  "🇦🇹 Austria": "🇦🇹 Østrig",
  "🇨🇭 Switzerland": "🇨🇭 Schweiz",
  "🇮🇹 Italy": "🇮🇹 Italien",
  "🇳🇴 Norway": "🇳🇴 Norge",
  "⛴️ Ferries": "⛴️ Færger",
  "🏙️ Illinois": "🏙️ Illinois",
  "🌄 Colorado": "🌄 Colorado",
  "🌉 California": "🌉 Californien",
  "🌴 Florida": "🌴 Florida",
  "🍁 Ontario": "🍁 Ontario",
  "🌲 Nova Scotia": "🌲 Nova Scotia",
  "🏔️ British Columbia": "🏔️ British Columbia",
  "No car tolls on German autobahns": "Ingen bilafgifter på tyske autobahner",
  "Ticket system, 8 checkpoints": "Billetsystem, 8 kontrolpunkter",
  "Ticket system, 5 checkpoints": "Billetsystem, 5 kontrolpunkter",
  "AutoPASS gantries — motorcycles pass free": "AutoPASS-portaler — motorcykler kører gratis igennem",
  "Vehicle + 2 passengers": "Køretøj + 2 passagerer",
  "Reserve seat": "Reserver plads",
  "Reserve": "Reserver",
  "Reserve ahead": "Reserver i forvejen",
  "6 gantries, I-PASS rate": "6 portaler, I-PASS-takst",
  "Plate-pay surcharge included": "Nummerpladegebyr inkluderet",
  "Peak weekend rate": "Takst i weekend-travlhed",
  "Southbound, FasTrak": "Sydgående, FasTrak",
  "Weekday peak": "Hverdagstravlhed",
  "Evening rate": "Aftentakst",
  "SunPass rate, 9 gantries": "SunPass-takst, 9 portaler",
  "Vehicle under 22ft + driver": "Køretøj under 6,7 m + fører",
  "Vehicle under 20ft + 2 adults": "Køretøj under 6,1 m + 2 voksne",
  "Peak rate, transponder": "Spidsbelastningstakst, brik",
  "Per-trip camera fee": "Kameraafgift pr. tur",
  "Two-axle vehicle": "Køretøj med to aksler",
  "Toll-free since 2008": "Afgiftsfri siden 2008",
  "Digital vignette": "Digital vignet",
  "🇳🇴 Norway · Fjord ferries": "🇳🇴 Norge · Fjordfærger",
  "🌊 Scandinavia & Baltic": "🌊 Skandinavien og Baltikum",
  "🇬🇧 English Channel": "🇬🇧 Den Engelske Kanal",
  "☘️ Irish Sea": "☘️ Det Irske Hav",
  "☀️ Mediterranean & Adriatic": "☀️ Middelhavet og Adriaterhavet",
  "🇺🇸 US marine highways": "🇺🇸 Amerikanske søveje",
  "🇨🇦 Canadian coastal ferries": "🇨🇦 Canadiske kystfærger",
  "10–45 min per crossing": "10-45 min pr. overfart",
  "Every 20–40 min, most run 24/7": "Hver 20-40 min, de fleste kører døgnet rundt",
  "NOK 120–290 per car": "120-290 NOK pr. bil",
  "NOK 55–120 per motorcycle": "55-120 NOK pr. motorcykel",
  "Register an AutoPASS ferjekort for an automatic ~50% discount — no cash, no queue at the booth.": "Registrer et AutoPASS ferjekort for automatisk ca. 50% rabat — ingen kontanter, ingen kø ved boden.",
  "AutoPASS ferjekort −50%": "AutoPASS ferjekort −50%",
  "45 min – 20 h depending on crossing": "45 min – 20 timer afhængigt af overfarten",
  "Scandlines every 30 min; overnight lines 1–2 sailings a day": "Scandlines hver 30. min; natlinjer 1-2 afgange dagligt",
  "€45–210 car + driver": "45-210 € bil + fører",
  "€28–120 motorcycle + rider": "28-120 € motorcykel + fører",
  "Book overnight cabins early in July and August — the Oslo–Kiel and Tallinn routes sell out weeks ahead.": "Book overnatningskahytter tidligt i juli og august — ruterne Oslo-Kiel og Tallinn bliver udsolgt uger i forvejen.",
  "Cabins book out early": "Kahytter bliver hurtigt udsolgt",
  "35 min (LeShuttle) · 90–120 min (ferry)": "35 min (LeShuttle) · 90-120 min (færge)",
  "Up to 4 departures an hour at peak": "Op til 4 afgange i timen i myldretiden",
  "£70–190 car + passengers": "£70-190 bil + passagerer",
  "£45–95 motorcycle + rider": "£45-95 motorcykel + fører",
  "LeShuttle keeps you in your vehicle — the fastest option with a roof box or a loaded bike.": "LeShuttle lader dig blive i køretøjet — den hurtigste løsning med en tagboks eller en pakket motorcykel.",
  "Flexi tickets recommended": "Flexi-billetter anbefales",
  "2 h (fast craft) – 3 h 30 min": "2 timer (hurtigfærge) – 3 timer 30 min",
  "4–8 sailings a day per route": "4-8 afgange dagligt pr. rute",
  "€95–230 car + driver": "95-230 € bil + fører",
  "€60–130 motorcycle + rider": "60-130 € motorcykel + fører",
  "Wild Atlantic Way traffic peaks at weekends — a midweek morning sailing is calmer and cheaper.": "Trafikken på Wild Atlantic Way topper i weekenderne — en morgenafgang midt i ugen er roligere og billigere.",
  "50 min (island hops) – 20 h (overnight)": "50 min (ø-hop) – 20 timer (nattefart)",
  "Island hops hourly; long crossings daily": "Ø-hop hver time; lange overfarter dagligt",
  "€55–260 car + driver": "55-260 € bil + fører",
  "€30–140 motorcycle + rider": "30-140 € motorcykel + fører",
  "Motorcycles usually board first and pay roughly 40% less — arrive 45 min before departure.": "Motorcykler kommer normalt om bord først og betaler ca. 40% mindre — ankom 45 min før afgang.",
  "Bikes board first": "Motorcykler kommer om bord først",
  "60 min – 38 h (Alaska)": "60 min – 38 timer (Alaska)",
  "San Juans hourly; Alaska weekly": "San Juans hver time; Alaska ugentligt",
  "$62–180 vehicle + driver": "62-180 USD køretøj + fører",
  "$28–70 motorcycle + rider": "28-70 USD motorcykel + fører",
  "Vehicle reservations open two months ahead on Washington State Ferries and are essential in summer.": "Reservationer for køretøjer åbner to måneder i forvejen hos Washington State Ferries og er nødvendige om sommeren.",
  "1 h 35 min – 7 h (Newfoundland)": "1 time 35 min – 7 timer (Newfoundland)",
  "Every 1–2 h on the Vancouver Island runs": "Hver 1-2 time på ruterne til Vancouver Island",
  "C$96–150 vehicle + 2 adults": "96-150 CAD køretøj + 2 voksne",
  "C$45–70 motorcycle + rider": "45-70 CAD motorcykel + fører",
  "Book a Saver fare on BC Ferries — cheapest sailings are before 09:00 and after 19:00.": "Book en Saver-billet hos BC Ferries — de billigste afgange er før kl. 9:00 og efter kl. 19:00.",
  "Saver fares available": "Saver-billetter tilgængelige",
  "⚡ Smart EV Charging Optimizer": "⚡ Smart optimering af elbilopladning",
  "⛽ Smart Fuel Stop Optimizer": "⛽ Smart optimering af brændstofstop",
  "24/7 forecourt": "Døgnåben tankstation",

  "I have AutoPASS / EPASS24": "Jeg har AutoPASS/EPASS24",
  "I have Telepass / Bip&Go / Fulli": "Jeg har Telepass/Bip&Go/Fulli",
  "I have SunPass / E-ZPass": "Jeg har SunPass/E-ZPass",
  "Vignettes & e-vignettes": "Vignetter og e-vignetter",
  "Ticket-based motorway tolls": "Billetbaserede motorvejsafgifter",
  "Urban low-emission zones": "Byernes miljøzoner",
  "State toll roads & turnpikes": "Statslige betalingsveje",
  "HOV / Express lanes": "HOV-/ekspresbaner",
  "Bridge & tunnel tolls": "Bro- og tunnelafgifter",
  "Highway 407 ETR": "Highway 407 ETR",
  "Provincial tolls & bridges": "Provinsafgifter og broer",
  "BC Ferries crossings": "BC Ferries-overfarter",

  "Fuel is ~15% cheaper in Austria than Italy — refuel before crossing the Brenner Pass.": "Brændstof er ca. 15% billigere i Østrig end i Italien — tank op, inden du krydser Brennerpasset.",
  "Luxembourg is the cheapest tank in Western Europe — top up before entering Belgium or France.": "Luxembourg har den billigste tank i Vesteuropa — tank op, inden du kører ind i Belgien eller Frankrig.",
  "Diesel in Norway runs well above Swedish prices — fill near the border at Svinesund.": "Diesel i Norge ligger langt over de svenske priser — tank tæt på grænsen ved Svinesund.",
  "Fuel in Georgia is ~20% cheaper than Florida — fill up before the state line on I-95.": "Brændstof i Georgia er ca. 20% billigere end i Florida — tank op inden statsgrænsen på I-95.",
  "Skip turnpike service plazas: prices run 10–15% above exits one mile off the highway.": "Undgå servicestationerne på betalingsvejene: priserne er 10-15% højere end ved afkørsler lidt væk fra motorvejen.",
  "California is the most expensive tank on the West Coast — fill in Nevada or Arizona first.": "Californien har den dyreste tank på vestkysten — tank først op i Nevada eller Arizona.",
  "Alberta fuel is ~20% cheaper than British Columbia — fill before Kicking Horse Pass.": "Brændstof i Alberta er ca. 20% billigere end i British Columbia — tank op inden Kicking Horse Pass.",
  "Québec charges more per litre than Ontario — top up before the provincial border on the 417.": "Québec opkræver mere pr. liter end Ontario — tank op inden provinsgrænsen på rute 417.",
  "Northern Ontario pumps run a premium — refuel in Sault Ste. Marie before Highway 17.": "Pumperne i det nordlige Ontario er dyrere — tank op i Sault Ste. Marie inden Highway 17.",
  "Sognefjell (RV55), Norway — 194 km without a verified 24/7 station. Fill in Lom.": "Sognefjellet (RV55), Norge — 194 km uden en bekræftet døgnåben station. Tank op i Lom.",
  "Grossglockner High Alpine Road — 186 km loop with no fuel above the toll gate.": "Grossglockner Hochalpenstrasse — 186 km rundtur uden brændstof ovenfor betalingsstedet.",
  "US-50 “Loneliest Road”, Nevada — 226 km between verified stations. Fill in Ely.": "US-50 „den mest ensomme vej”, Nevada — 226 km mellem bekræftede stationer. Tank op i Ely.",
  "I-10 Van Horn → Fort Stockton, Texas — 190 km with limited overnight service.": "I-10 Van Horn → Fort Stockton, Texas — 190 km med begrænset natservice.",
  "Highway 17 Wawa → White River — 198 km with no verified overnight fuel.": "Highway 17 Wawa → White River — 198 km uden bekræftet brændstof om natten.",
  "Icefields Parkway, Alberta — 232 km between Lake Louise and Jasper; Saskatchewan Crossing only.": "Icefields Parkway, Alberta — 232 km mellem Lake Louise og Jasper; kun Saskatchewan Crossing undervejs.",
  "Eleven hairpins climbing a sheer wall — viewing platform over the valley.": "Elleve hårnålesving op ad en stejl væg — udsigtsplatform over dalen.",
  "Eight bridges hopping island to island straight over the open sea.": "Otte broer, der springer fra ø til ø direkte over det åbne hav.",
  "48 km of alpine theatre topping out at 2,504 m.": "48 km alpint drama, der topper ved 2504 m.",
  "48 numbered hairpins — the classic rider pilgrimage.": "48 nummererede hårnålesving — den klassiske motorcyklistpilgrimsrejse.",
  "Glacier views, smooth tarmac and a lakeside descent.": "Udsigt til gletsjere, glat asfalt og en nedkørsel langs søen.",
  "Turquoise canyon rim road on the way to the Côte d'Azur.": "Vej langs den turkise kant af en kløft på vej til Côte d'Azur.",
  "469 miles of ridgeline overlooks, no trucks, no tolls.": "755 km med udsigt langs bjergkammen, ingen lastbiler, ingen afgifter.",
  "Big Sur cliffs, Bixby Bridge and endless Pacific vistas.": "Klipperne ved Big Sur, Bixby Bridge og uendelig udsigt over Stillehavet.",
  "318 curves in 11 miles — ride it early to beat traffic.": "318 sving på 18 km — kør det tidligt for at undgå trafik.",
  "Switchbacks to 10,947 ft on the doorstep of Yellowstone.": "Sving op til 3337 m lige ved Yellowstones dørtrin.",
  "Red-rock tunnels and canyon overlooks between two parks.": "Tunneler i rød klippe og udsigt over kløfter mellem to nationalparker.",
  "232 km between Lake Louise and Jasper past glaciers and turquoise lakes.": "232 km mellem Lake Louise og Jasper forbi gletsjere og turkise søer.",
  "Highland cliffs, whale lookouts and ocean switchbacks.": "Klipper i højlandet, hvalobservationspunkter og sving langs havet.",
  "Howe Sound fjord views from Vancouver up to Whistler.": "Udsigt over Howe Sound-fjorden fra Vancouver til Whistler.",
  "St. Lawrence riverside villages and beluga-watching stops.": "Landsbyer langs Sankt Laurens-floden og stop til belugahvalobservation.",
  "Late May – October": "Sidst i maj – oktober",
  "Year-round": "Hele året",
  "May – early November": "Maj – begyndelsen af november",
  "June – October": "Juni – oktober",
  "Year-round (peak: October)": "Hele året (spidsmåned: oktober)",
  "April – November": "April – november",
  "Late May – mid October": "Sidst i maj – midt i oktober",
  "Year-round (winter tyres Oct–Apr)": "Hele året (vinterdæk okt.-apr.)",
  "May – October": "Maj – oktober",
  "Rauma, Norway": "Rauma, Norge",
  "Møre og Romsdal, Norway": "Møre og Romsdal, Norge",
  "Provence, France": "Provence, Frankrig",
  "Virginia – North Carolina": "Virginia – North Carolina",
  "California": "Californien",
  "Tennessee": "Tennessee",
  "Montana – Wyoming": "Montana – Wyoming",
  "Utah": "Utah",
  "Alberta": "Alberta",
  "Cape Breton, Nova Scotia": "Cape Breton, Nova Scotia",
  "British Columbia": "British Columbia",
  "Québec": "Québec",
  "Fjord-side pitches, 5 min walk to the ferry quay.": "Pladser ved fjorden, 5 min gåtur til færgekajen.",
  "Great overnight before Grossglockner — book in July/August.": "Fint overnatningssted før Grossglockner — book i juli/august.",
  "France's aire network is the cheapest overnight option en route south.": "Frankrigs aire-netværk er den billigste overnatningsmulighed på vej sydpå.",
  "Large pitches; height/width friendly access road.": "Store pladser; adgangsvej velegnet til høje/brede køretøjer.",
  "EV hookup": "Eltilslutning til elbil",
  "Chemical WC": "Kemisk toilet",
  "Electricity": "El",
  "Bakery service": "Bagerservice",
  "Full hookup": "Fuld tilslutning",
  "24h access": "Adgang døgnet rundt",
  "Geiranger, Norway": "Geiranger, Norge",
  "Salzburg, Austria": "Salzburg, Østrig",
  "Haute-Savoie, France": "Haute-Savoie, Frankrig",
  "Lake Garda, Italy": "Gardasøen, Italien",
  "Motorcycles are exempt from this e-vignette — nothing to buy.": "Motorcykler er fritaget for denne e-vignet — intet at købe.",
  "Only one validity period exists — it covers the whole stay.": "Der findes kun én gyldighedsperiode — den dækker hele opholdet.",

  /* ---------------- Tolls guide ---------------- */
  "🇪🇺 Europe": "🇪🇺 Europa",
  "🇺🇸 United States": "🇺🇸 USA",
  "🇨🇦 Canada": "🇨🇦 Canada",
  "Tolls & vignettes": "Vejafgifter og vignetter",
  "Every barrier, badge and sticker — made simple.": "Hver bom, hvert mærke og hver klistermærke — gjort enkelt.",
  "No guesswork, no fines. Here's what you need in each country, and how to get it before you set off.": "Ingen gætterier, ingen bøder. Her er, hvad du skal bruge i hvert land, og hvordan du skaffer det, inden du kører af sted.",
  "Austria digital vignette": "Østrigsk digital vignet",
  "10-day, 2-month or annual. Plate-linked, activates instantly.": "10 dage, 2 måneder eller årlig. Knyttet til nummerpladen, aktiveres straks.",
  "Switzerland e-vignette": "Schweizisk e-vignet",
  "Annual only, valid 14 months. Motorcycles need their own.": "Kun årlig, gyldig i 14 måneder. Motorcykler skal have deres egen.",
  "France & Italy ticket tolls": "Billetbaserede afgifter i Frankrig og Italien",
  "Take a ticket, pay on exit. Telepass and Bip&Go tags speed it up.": "Tag en billet, betal ved udkørslen. Telepass- og Bip&Go-brikker fremskynder processen.",
  "Norway AutoPASS": "Norsk AutoPASS",
  "Automatic plate billing with discounts for registered EVs.": "Automatisk nummerpladefakturering med rabatter for registrerede elbiler.",
  "E-ZPass network": "E-ZPass-netværket",
  "One transponder covers 19 states from Maine to Illinois.": "Én brik dækker 19 stater fra Maine til Illinois.",
  "SunPass (Florida)": "SunPass (Florida)",
  "Best value for Turnpike and Miami express lanes.": "Bedst værdi for betalingsvejen og ekspresbanerne i Miami.",
  "FasTrak (California)": "FasTrak (Californien)",
  "Required for bridge and express-lane discounts.": "Kræves for at få rabatter på broer og ekspresbaner.",
  "Plate-pay tolling": "Nummerpladebaseret afgift",
  "Rental cars often add a daily admin fee — worth checking first.": "Lejebiler tilføjer ofte et dagligt administrationsgebyr — værd at tjekke først.",
  "Ontario's all-electronic toll road. A transponder beats camera billing.": "Ontarios fuldautomatiske betalingsvej. En brik er billigere end kamerafakturering.",
  "Cobequid Pass": "Cobequid Pass",
  "Nova Scotia's only mainline toll — cash and card accepted.": "Nova Scotias eneste hovedvejsafgift — kontant og kort accepteres.",
  "Bridge tolls": "Broafgifter",
  "Confederation Bridge is charged on the way off PEI only.": "Confederation Bridge opkræver kun afgift ved udkørsel fra Prince Edward Island.",

  /* ---------------- Corridor map: fuel & map extras ---------------- */
  "Est. rate": "Anslået pris",
  "Petrol 95": "Benzin 95",
  Diesel: "Diesel",
  "Open in Google Maps": "Åbn i Google Maps",

  /* ---------------- Trip results: EV optimizer extras ---------------- */
  "Preferred network": "Foretrukket netværk",
  "Nearest high-power CCS hub": "Nærmeste hurtiglader (CCS)",

  /* ---------------- Route tolls: distance & vignette details ---------------- */
  "Ticket system, charged per kilometre": "Billetsystem, afgift pr. kilometer",
  "Private concession segments only — state-run e-TOLL motorways are free for cars":
    "Kun private koncessionsstrækninger — statslige e-TOLL-motorveje er gratis for personbiler",
  "Remaining concession sections": "Resterende koncessionsstrækninger",
  "Includes electronic-only motorways": "Omfatter motorveje med udelukkende elektronisk betaling",
  "Fixed plaza charges along the corridor": "Faste afgifter ved betalingsanlæg langs ruten",
  "Automatic tolling — motorcycles pass free": "Automatisk afgiftsopkrævning — motorcykler kører gratis igennem",
  "10-day pass, valid nationwide": "10-dages billet, gyldig i hele landet",
  "Annual e-vignette, plate-linked (no short tier exists)":
    "Årlig e-vignet, knyttet til nummerpladen (der findes ingen kortere variant)",
  "7-day e-vignette": "7-dages e-vignet",
  "10-day electronic vignette": "10-dages elektronisk vignet",
  "10-day national e-vignette": "10-dages national e-vignet",
  "Weekend/weekly e-vignette": "Weekend-/ugevignet (e-vignet)",
  "7-day road vignette": "7-dages vejvignet",

  /* ---------------- Route tolls: toll-free country/province notes ---------------- */
  "No motorway toll in Denmark — only the Storebælt and Øresund bridges are charged, and only if you cross them.":
    "Ingen motorvejsafgift i Danmark — kun Storebælt- og Øresundsbroen koster penge, og kun hvis du krydser dem.",
  "German autobahns are toll-free for cars and motorhomes up to 7.5 t.":
    "Tyske Autobahn er afgiftsfrie for biler og autocampere op til 7,5 t.",
  "Dutch motorways are free — only the Westerschelde and Kil tunnels charge.":
    "Hollandske motorveje er gratis — kun Westerschelde- og Kil-tunnelen opkræver afgift.",
  "Belgian motorways are free for cars; the Liefkenshoek tunnel is the exception.":
    "Belgiske motorveje er gratis for biler; Liefkenshoek-tunnelen er undtagelsen.",
  "Luxembourg motorways are toll-free (and the cheapest fuel on the corridor).":
    "Luxembourgske motorveje er afgiftsfrie (og har det billigste brændstof på ruten).",
  "Swedish motorways are free; only Stockholm/Göteborg congestion charges apply.":
    "Svenske motorveje er gratis; kun trængselsafgiften i Stockholm/Göteborg gælder.",
  "Finnish roads are toll-free.": "Finske veje er afgiftsfrie.",
  "Estonian roads are toll-free for passenger vehicles.": "Estiske veje er afgiftsfrie for personbiler.",
  "Latvian roads are toll-free for passenger vehicles.": "Lettiske veje er afgiftsfrie for personbiler.",
  "Lithuanian roads are toll-free for passenger vehicles.": "Litauiske veje er afgiftsfrie for personbiler.",
  "Only individual toll plazas (M50 eFlow) charge — none on this corridor.":
    "Kun enkelte betalingsanlæg (M50 eFlow) opkræver afgift — ingen på denne rute.",
  "UK motorways are free apart from the M6 Toll and Dartford Crossing.":
    "Britiske motorveje er gratis, bortset fra M6 Toll og Dartford Crossing.",
  "New Brunswick highways are toll-free.": "Motorveje i New Brunswick er afgiftsfrie.",
  "BC highways are toll-free since the Port Mann and Golden Ears tolls ended.":
    "Motorveje i British Columbia er afgiftsfrie, siden afgifterne ved Port Mann og Golden Ears blev afskaffet.",
  "Alberta highways are toll-free.": "Motorveje i Alberta er afgiftsfrie.",
  "Manitoba highways are toll-free.": "Motorveje i Manitoba er afgiftsfrie.",
  "Saskatchewan highways are toll-free.": "Motorveje i Saskatchewan er afgiftsfrie.",

  /* ---------------- Vignette optimizer: tier labels ---------------- */
  "1-Day": "1 dag",
  "10-Day": "10 dage",
  "2-Month": "2 måneder",
  Annual: "Årlig",
  "7-Day": "7 dage",
  "1-Month": "1 måned",
  "30-Day": "30 dage",
};

export const DA_PATTERNS: [RegExp, (m: RegExpMatchArray) => string][] = [
  [
    /^Arrive at ~25% state of charge, charge to 80% in about (\d+) min\.$/,
    (m) => `Ankom med ca. 25 % batteri, og oplad til 80 % på cirka ${m[1]} min.`,
  ],
  [
    /^Recommended refuel — keeps you above the 25% reserve on a (.+) tank range\.$/,
    (m) => `Anbefalet optankning — holder dig over 25 % reserve med en rækkevidde på ${m[1]}.`,
  ],
  [/^(.+) full battery range$/, (m) => `${m[1]} rækkevidde på fuldt batteri`],
  [/^(.+) full tank range$/, (m) => `${m[1]} rækkevidde på fuld tank`],
  [
    /^Single transit leg: (.+) is the cheapest legal cover\.$/,
    (m) => `Enkelt gennemkørsel: ${m[1]} er den billigste lovlige løsning.`,
  ],
  [
    /^Covers all (\d+) days? of your return trip within one validity window\.$/,
    (m) => `Dækker alle ${m[1]} dage af din tur-retur-rejse inden for én gyldighedsperiode.`,
  ],
  [
    /^💡 AutoVere optimized your vignette cost: saved (.+) — (.+) in (.+) instead of the usual (.+)\.$/,
    (m) => `💡 AutoVere optimerede din vignetpris: du sparede ${m[1]} — ${m[2]} i ${m[3]} i stedet for det sædvanlige ${m[4]}.`,
  ],
  [
    /^💡 AutoVere checked every validity window — the standard tiers are already the cheapest legal cover for (\d+) days?\.$/,
    (m) => `💡 AutoVere tjekkede alle gyldighedsperioder — standardniveauerne er allerede den billigste lovlige løsning for ${m[1]} dage.`,
  ],
  [
    /^Planned at 75% safety buffer — (.+) between stops$/,
    (m) => `Planlagt med 75 % sikkerhedsmargin — ${m[1]} mellem stoppene`,
  ],
];
