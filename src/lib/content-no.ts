/**
 * Norwegian translations for content that lives in data modules
 * (compliance, pass intel, corridor map, trip data).
 *
 * Keyed by the exact English source string so components can wrap any
 * data-driven label with `tr(...)` from `useTr()`.
 */
export const CONTENT_NO: Record<string, string> = {
  /* ---------------- Compliance: heavy motorhome systems ---------------- */
  Austria: "Østerrike",
  Switzerland: "Sveits",
  Slovenia: "Slovenia",
  Germany: "Tyskland",
  France: "Frankrike",
  Italy: "Italia",
  Norway: "Norge",
  Sweden: "Sverige",
  Denmark: "Danmark",
  Spain: "Spania",
  Portugal: "Portugal",
  Netherlands: "Nederland",
  Belgium: "Belgia",
  "United Kingdom": "Storbritannia",
  "Belgium & Netherlands": "Belgia og Nederland",
  Ferries: "Ferjer",

  "GO-Box (ASFINAG)": "GO-Box (ASFINAG)",
  "Motorhomes over 3.5 t maximum permissible weight may not use the car vignette. You need a GO-Box on-board unit, charged per kilometre by axle count and EURO class. Pick one up at a GO point near the border before your first motorway kilometre.":
    "Bobiler med tillatt totalvekt over 3,5 tonn kan ikke bruke personbilvignetten. Du trenger en GO-Box-enhet i bilen, som belastes per kilometer etter antall aksler og EURO-klasse. Hent den på et GO-punkt nær grensen før din første motorveikilometer.",
  "LSVA / PSVA heavy vehicle charge": "LSVA / PSVA tungbilavgift",
  "Above 3.5 t the Swiss motorway vignette no longer covers you. Foreign motorhomes normally pay the flat-rate PSVA (per-day or per-year) declared at the border customs post; ID-based LSVA applies to commercial units.":
    "Over 3,5 tonn dekker ikke den sveitsiske motorveivignetten deg lenger. Utenlandske bobiler betaler normalt fastprisavgiften PSVA (per dag eller per år) som deklareres i tollen på grensen; ID-basert LSVA gjelder for kommersielle kjøretøy.",
  "DarsGo unit": "DarsGo-enhet",
  "Slovenian motorways charge vehicles over 3.5 t through a DarsGo on-board unit with free-flow gantries. Register online or at a DarsGo service point; the e-vignette is invalid for your weight class.":
    "Slovenske motorveier krever DarsGo-enhet for kjøretøy over 3,5 tonn, med automatiske bomportaler. Registrer deg på nett eller hos et DarsGo-servicepunkt; e-vignetten er ugyldig for din vektklasse.",
  "No toll for private motorhomes": "Ingen bomavgift for private bobiler",
  "Privately used motorhomes are exempt from the German Lkw-Maut regardless of weight, but weight-based speed limits and overtaking bans still apply.":
    "Privat brukte bobiler er fritatt fra tyske Lkw-Maut uansett vekt, men vektbaserte fartsgrenser og forbikjøringsforbud gjelder fortsatt.",

  /* ---------------- Compliance: clearance advisories ---------------- */
  "Alpine underpasses & village arches": "Alpine underganger og landsbyporter",
  "Several Alpine valley roads (Susa, Vinschgau, Maurienne) and old town gateways drop below 3.2 m. Trust posted signs over your navigation app and follow the signed HGV/camper diversion where offered.":
    "Flere alpine dalveier (Susa, Vinschgau, Maurienne) og gamle bysporter har fri høyde under 3,2 m. Stol på skiltingen framfor navigasjonsappen, og følg skiltet omkjøring for tunge kjøretøy/bobil der den finnes.",
  "Tunnel height & LPG restrictions": "Tunnelhøyde og gassrestriksjoner",
  "Mont Blanc, Fréjus and Gotthard road tunnels apply strict height, length and LPG-cylinder rules. Vehicles above 4.0 m are routed to dedicated lanes and may face convoy timing.":
    "Mont Blanc-, Fréjus- og Gotthardtunnelen har strenge regler for høyde, lengde og gassflasker. Kjøretøy over 4,0 m sendes i egne felt og kan måtte vente på kolonnekjøring.",
  "Ferry deck clearance": "Fri høyde på ferjedekk",
  "Book ferries in the correct height and length bracket. Under-declaring your height means a re-fare at the ramp or refused boarding.":
    "Bestill ferje i riktig høyde- og lengdeklasse. Oppgir du for lav høyde, risikerer du ny prisberegning på rampa eller å bli avvist.",
  "Roof box, aerials & solar": "Takboks, antenner og solcellepanel",
  "Measure to the highest fixed point — solar panels, satellite domes and roof boxes typically add 15–25 cm over the plate height.":
    "Mål til det høyeste faste punktet — solcellepanel, parabolkupler og takbokser legger typisk 15–25 cm til høyden i vognkortet.",

  /* ---------------- Compliance: speed rules ---------------- */
  "100 km/h (over 3.5 t)": "100 km/t (over 3,5 t)",
  "110 km/h (over 3.5 t)": "110 km/t (over 3,5 t)",
  "80 km/h with caravan/heavy load": "80 km/t med campingvogn/tung last",
  "Above 3.5 t you are capped at 100 km/h on the Autobahn and 80 km/h on rural roads, and overtaking bans for heavy vehicles apply to you.":
    "Over 3,5 tonn er du begrenset til 100 km/t på Autobahn og 80 km/t på landevei, og forbikjøringsforbud for tunge kjøretøy gjelder deg.",
  "Over 3.5 t: 110 km/h motorway, 100 km/h dual carriageway, 80 km/h single carriageway. Keep 50 m from the vehicle ahead.":
    "Over 3,5 tonn: 110 km/t på motorvei, 100 km/t på firefeltsvei og 80 km/t på tofeltsvei. Hold 50 m til kjøretøyet foran.",
  "100 km/h motorway and 80 km/h on main roads; the left-most lane of three is closed to vehicles over 3.5 t.":
    "100 km/t på motorvei og 80 km/t på hovedvei; venstre felt av tre er stengt for kjøretøy over 3,5 tonn.",
  "Motorhomes over 3.5 t are limited to 80 km/h; many fjord roads sign 60 km/h with passing places only.":
    "Bobiler over 3,5 tonn er begrenset til 80 km/t; mange fjordveier er skiltet 60 km/t med kun møteplasser.",
  "Heavy motorhomes are limited to 100 km/h and must use the lorry lane in tunnels with lane separation.":
    "Tunge bobiler er begrenset til 100 km/t og må bruke lastebilfeltet i tunneler med feltseparering.",

  /* ---------------- Compliance: LEZ ---------------- */
  "Crit'Air vignette": "Crit'Air-vignett",
  "A Crit'Air sticker must be displayed inside the windscreen in every French ZFE. Classes are based on EURO standard and fuel; motorhomes are classed like the base vehicle.":
    "Et Crit'Air-merke må ligge synlig i frontruta i alle franske ZFE-soner. Klassen bestemmes av EURO-standard og drivstoff; bobiler klassifiseres som grunnkjøretøyet.",
  "€3.81 incl. postage": "€3,81 inkl. porto",
  "Order 3–4 weeks ahead for delivery abroad": "Bestill 3–4 uker i forveien for levering til utlandet",
  "Required for motorcycles and scooters too.": "Kreves også for motorsykler og scootere.",
  "Umweltplakette (green zone 4)": "Umweltplakette (grønn sone 4)",
  "A green sticker (Schadstoffgruppe 4) is required in ~50 Umweltzonen. Enforcement is by camera and patrol; a missing badge is a €100 fine.":
    "Grønt merke (Schadstoffgruppe 4) kreves i rundt 50 Umweltzonen. Kontrollen skjer med kamera og patrulje; manglende merke gir 100 € i gebyr.",
  "€6–€30 depending on issuer": "€6–€30 avhengig av utsteder",
  "Order 2 weeks ahead or buy at a TÜV/DEKRA station on arrival":
    "Bestill 2 uker i forveien, eller kjøp hos en TÜV/DEKRA-stasjon ved ankomst",
  "Motorcycles are exempt from German Umweltzonen.": "Motorsykler er unntatt fra tyske Umweltzonen.",
  "LEZ online registration": "LEZ-registrering på nett",
  "No sticker — foreign plates must be registered online before the first entry into Brussels, Antwerp, Ghent, Rotterdam or Amsterdam. Cameras match plates automatically.":
    "Ingen oblat — utenlandske skilt må registreres på nett før første innkjøring i Brussel, Antwerpen, Gent, Rotterdam eller Amsterdam. Kameraene leser skiltene automatisk.",
  "Free registration; fines from €150": "Gratis registrering; gebyr fra €150",
  "Register at least 24 hours before entry": "Registrer deg minst 24 timer før innkjøring",
  "Motorcycles are currently outside the Belgian and Dutch LEZ scope.":
    "Motorsykler er foreløpig utenfor de belgiske og nederlandske LEZ-ordningene.",
  "ULEZ + Congestion Charge": "ULEZ + rushtidsavgift",
  "Greater London's ULEZ charges non-compliant vehicles £12.50/day, plus £15 Congestion Charge in the central zone on weekdays. Pay online or by Auto Pay.":
    "ULEZ i Stor-London koster £12,50 per dag for kjøretøy som ikke oppfyller kravene, pluss £15 i rushtidsavgift i sentrumssonen på hverdager. Betal på nett eller med Auto Pay.",
  "£12.50/day ULEZ · £15/day Congestion Charge": "£12,50/dag ULEZ · £15/dag rushtidsavgift",
  "Pay up to 3 days after travel": "Kan betales inntil 3 dager etter turen",
  "Pre-Euro 3 motorcycles pay ULEZ; Congestion Charge does not apply to motorcycles.":
    "Motorsykler eldre enn Euro 3 betaler ULEZ; rushtidsavgiften gjelder ikke motorsykler.",

  /* ---------------- Compliance: toll tags ---------------- */
  "Norway, Sweden, Denmark — city rings, bridges, Øresund & Storebælt":
    "Norge, Sverige, Danmark — bomringer, broer, Øresund og Storebælt",
  "Free-flow gantries, no barrier stop": "Automatiske bomportaler, ingen bomstasjon å stoppe ved",
  "France, Spain, Portugal, Italy — barrier motorways":
    "Frankrike, Spania, Portugal, Italia — motorveier med bomstasjoner",
  "Yellow 'T' / télépéage lanes, barrier lifts automatically":
    "Gule «T»-felt / télépéage, bommen åpner automatisk",
  "US turnpikes, express lanes and bridges": "Amerikanske turnpikes, ekspressfelt og broer",
  "Open-road tolling gantries, no cash booth": "Automatiske bomportaler, ingen kontantbod",
  "Ontario Highway 407 ETR and 412/418": "Ontario Highway 407 ETR og 412/418",
  "Transponder rate instead of camera video-toll charge":
    "Brikkepris i stedet for kamerabasert videotakst",
};
