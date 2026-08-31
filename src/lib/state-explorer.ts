/* ------------------------------------------------------------------ *
 * US State & Canadian Province explorer data
 * Indicative averages — always verify with the official portals.
 * ------------------------------------------------------------------ */

export interface UsState {
  code: string;
  name: string;
  petrol: number; // USD / gallon regular
  diesel: number; // USD / gallon
  charging: number; // USD / kWh DC fast charge
  tollSystem: string;
  tollNote: string;
  helmet: "All riders" | "Under 18" | "Under 19" | "Under 21" | "No helmet law" | "Under 26";
  helmetNote: string;
  portal?: { label: string; url: string };
}

export interface CaProvince {
  code: string;
  name: string;
  frName: string;
  petrol: number; // CAD / litre regular
  diesel: number; // CAD / litre
  charging: number; // CAD / kWh DC fast
  networks: string[];
  winterTires: string;
  winterWindow: string;
  tollSystem: string;
  tollNote: string;
  portal?: { label: string; url: string };
}

const P = (label: string, url: string) => ({ label, url });

export const US_STATES: UsState[] = [
  { code: "AL", name: "Alabama", petrol: 3.02, diesel: 3.62, charging: 0.44, tollSystem: "Toll-by-Plate", tollNote: "Few tolls; Montgomery Expressway and Foley Beach Express bill by plate.", helmet: "All riders", helmetNote: "Universal helmet law — DOT-approved helmet required for every rider and passenger." },
  { code: "AK", name: "Alaska", petrol: 3.78, diesel: 3.95, charging: 0.52, tollSystem: "Toll-Free", tollNote: "No toll roads; Alaska Marine Highway ferries are the paid link between towns.", helmet: "Under 18", helmetNote: "Helmets required under 18 and for passengers/instruction permits." },
  { code: "AZ", name: "Arizona", petrol: 3.45, diesel: 3.79, charging: 0.48, tollSystem: "Toll-Free", tollNote: "No state toll roads; some tribal and border crossings charge fees.", helmet: "Under 18", helmetNote: "Riders 18+ may go without a helmet; eye protection required." },
  { code: "AR", name: "Arkansas", petrol: 2.96, diesel: 3.58, charging: 0.43, tollSystem: "Toll-Free", tollNote: "Interstates are free; nearby Oklahoma turnpikes accept PIKEPASS.", helmet: "Under 21", helmetNote: "Helmets required under 21." },
  { code: "CA", name: "California", petrol: 4.72, diesel: 5.18, charging: 0.58, tollSystem: "FasTrak", tollNote: "Bay Area & SoCal express lanes plus bridges — FasTrak transponder or toll-by-plate.", helmet: "All riders", helmetNote: "Universal helmet law; lane splitting is legal but must be done prudently.", portal: P("bayareafastrak.org", "https://www.bayareafastrak.org/") },
  { code: "CO", name: "Colorado", petrol: 3.24, diesel: 3.71, charging: 0.47, tollSystem: "ExpressToll", tollNote: "E-470, Northwest Parkway and I-70 mountain express lanes.", helmet: "Under 18", helmetNote: "Helmets required under 18 (rider or passenger); eye protection for all.", portal: P("expresstoll.com", "https://www.expresstoll.com/") },
  { code: "CT", name: "Connecticut", petrol: 3.38, diesel: 4.02, charging: 0.52, tollSystem: "Toll-Free", tollNote: "No car tolls; E-ZPass needed the moment you cross into NY/MA/RI.", helmet: "Under 18", helmetNote: "Helmets required under 18." },
  { code: "DE", name: "Delaware", petrol: 3.14, diesel: 3.83, charging: 0.49, tollSystem: "E-ZPass", tollNote: "I-95 Delaware Turnpike and SR-1 — busy, expensive short stretch.", helmet: "Under 19", helmetNote: "Helmet required under 19; all riders must carry one.", portal: P("ezpassde.com", "https://www.ezpassde.com/") },
  { code: "FL", name: "Florida", petrol: 3.19, diesel: 3.74, charging: 0.46, tollSystem: "SunPass / E-PASS", tollNote: "Florida's Turnpike, Alligator Alley and Orlando expressways — SunPass or Toll-by-Plate.", helmet: "Under 21", helmetNote: "21+ may ride helmet-free with $10,000 medical coverage; eye protection required.", portal: P("sunpass.com", "https://www.sunpass.com/") },
  { code: "GA", name: "Georgia", petrol: 3.02, diesel: 3.61, charging: 0.44, tollSystem: "Peach Pass", tollNote: "I-75/I-85 express lanes around Atlanta — dynamic pricing by traffic.", helmet: "All riders", helmetNote: "Universal helmet law.", portal: P("peachpass.com", "https://peachpass.com/") },
  { code: "HI", name: "Hawaii", petrol: 4.61, diesel: 5.12, charging: 0.61, tollSystem: "Toll-Free", tollNote: "No toll roads; inter-island travel is by air or barge.", helmet: "Under 18", helmetNote: "Helmets required under 18; eye protection for all." },
  { code: "ID", name: "Idaho", petrol: 3.41, diesel: 3.88, charging: 0.45, tollSystem: "Toll-Free", tollNote: "No toll roads statewide.", helmet: "Under 18", helmetNote: "Helmets required under 18." },
  { code: "IL", name: "Illinois", petrol: 3.52, diesel: 3.94, charging: 0.51, tollSystem: "I-PASS / E-ZPass", tollNote: "Chicago-area tollways charge double without a transponder.", helmet: "No helmet law", helmetNote: "No helmet requirement at any age; eye protection required.", portal: P("illinoistollway.com", "https://www.illinoistollway.com/") },
  { code: "IN", name: "Indiana", petrol: 3.16, diesel: 3.79, charging: 0.47, tollSystem: "E-ZPass", tollNote: "Indiana Toll Road (I-80/90) across the north — RV rates by axle.", helmet: "Under 18", helmetNote: "Helmets required under 18." },
  { code: "IA", name: "Iowa", petrol: 3.05, diesel: 3.66, charging: 0.44, tollSystem: "Toll-Free", tollNote: "No toll roads.", helmet: "No helmet law", helmetNote: "No helmet requirement at any age." },
  { code: "KS", name: "Kansas", petrol: 2.99, diesel: 3.60, charging: 0.43, tollSystem: "K-TAG", tollNote: "Kansas Turnpike (I-35/I-70) — K-TAG interoperable with PIKEPASS and EZ TAG.", helmet: "Under 18", helmetNote: "Helmets required under 18.", portal: P("ksturnpike.com", "https://www.ksturnpike.com/") },
  { code: "KY", name: "Kentucky", petrol: 3.04, diesel: 3.68, charging: 0.45, tollSystem: "RiverLink", tollNote: "Louisville Ohio River bridges — all-electronic, no cash booths.", helmet: "Under 21", helmetNote: "Helmets required under 21 or within a year of licensing.", portal: P("riverlink.com", "https://www.riverlink.com/") },
  { code: "LA", name: "Louisiana", petrol: 2.94, diesel: 3.57, charging: 0.43, tollSystem: "GeauxPass", tollNote: "LA-1 and Causeway bridge tolls; most interstates are free.", helmet: "All riders", helmetNote: "Universal helmet law." },
  { code: "ME", name: "Maine", petrol: 3.28, diesel: 3.92, charging: 0.50, tollSystem: "E-ZPass", tollNote: "Maine Turnpike (I-95) barrier tolls up the coast.", helmet: "Under 18", helmetNote: "Helmets required under 18, for permit holders and for passengers of helmetless-exempt riders.", portal: P("maineturnpike.com", "https://www.maineturnpike.com/") },
  { code: "MD", name: "Maryland", petrol: 3.29, diesel: 3.87, charging: 0.50, tollSystem: "E-ZPass MD", tollNote: "Bay Bridge, harbour tunnels and I-95 express lanes.", helmet: "All riders", helmetNote: "Universal helmet law.", portal: P("driveezmd.com", "https://www.driveezmd.com/") },
  { code: "MA", name: "Massachusetts", petrol: 3.32, diesel: 3.95, charging: 0.52, tollSystem: "E-ZPass MA", tollNote: "All-electronic gantries on I-90 Mass Pike and Boston tunnels.", helmet: "All riders", helmetNote: "Universal helmet law." },
  { code: "MI", name: "Michigan", petrol: 3.27, diesel: 3.83, charging: 0.47, tollSystem: "Bridge tolls", tollNote: "Mackinac, Ambassador and Blue Water bridges; no highway tolls.", helmet: "Under 21", helmetNote: "21+ may ride without a helmet with 2 years' experience or a safety course plus insurance." },
  { code: "MN", name: "Minnesota", petrol: 3.11, diesel: 3.72, charging: 0.46, tollSystem: "MnPASS E-ZPass", tollNote: "Twin Cities E-ZPass express lanes only.", helmet: "Under 18", helmetNote: "Helmets required under 18 and for permit holders; eye protection for all." },
  { code: "MS", name: "Mississippi", petrol: 2.89, diesel: 3.53, charging: 0.42, tollSystem: "Toll-Free", tollNote: "Effectively toll-free.", helmet: "All riders", helmetNote: "Universal helmet law." },
  { code: "MO", name: "Missouri", petrol: 2.98, diesel: 3.62, charging: 0.44, tollSystem: "Toll-Free", tollNote: "No toll roads; Lake of the Ozarks bridge charges a small fee.", helmet: "Under 26", helmetNote: "26+ may ride helmet-free with proof of insurance." },
  { code: "MT", name: "Montana", petrol: 3.34, diesel: 3.86, charging: 0.46, tollSystem: "Toll-Free", tollNote: "No tolls; Beartooth and Going-to-the-Sun are seasonal, not tolled.", helmet: "Under 18", helmetNote: "Helmets required under 18." },
  { code: "NE", name: "Nebraska", petrol: 3.07, diesel: 3.68, charging: 0.44, tollSystem: "Toll-Free", tollNote: "No toll roads.", helmet: "All riders", helmetNote: "Universal helmet law." },
  { code: "NV", name: "Nevada", petrol: 3.96, diesel: 4.35, charging: 0.53, tollSystem: "Toll-Free", tollNote: "No toll roads; long desert stretches — fuel before Highway 50.", helmet: "All riders", helmetNote: "Universal helmet law." },
  { code: "NH", name: "New Hampshire", petrol: 3.18, diesel: 3.86, charging: 0.50, tollSystem: "E-ZPass NH", tollNote: "Everett, Hooksett and Dover barrier tolls on I-93 / Spaulding.", helmet: "Under 18", helmetNote: "Helmets required under 18." },
  { code: "NJ", name: "New Jersey", petrol: 3.25, diesel: 3.88, charging: 0.51, tollSystem: "E-ZPass NJ", tollNote: "NJ Turnpike, Garden State Parkway and Hudson crossings — expensive for RVs by class.", helmet: "All riders", helmetNote: "Universal helmet law.", portal: P("ezpassnj.com", "https://www.ezpassnj.com/") },
  { code: "NM", name: "New Mexico", petrol: 3.12, diesel: 3.70, charging: 0.45, tollSystem: "Toll-Free", tollNote: "No toll roads.", helmet: "Under 18", helmetNote: "Helmets required under 18." },
  { code: "NY", name: "New York", petrol: 3.44, diesel: 4.09, charging: 0.54, tollSystem: "E-ZPass NY", tollNote: "Thruway cashless tolling, NYC bridges/tunnels and Manhattan congestion pricing.", helmet: "All riders", helmetNote: "Universal helmet law; eye protection required.", portal: P("e-zpassny.com", "https://www.e-zpassny.com/") },
  { code: "NC", name: "North Carolina", petrol: 3.03, diesel: 3.66, charging: 0.45, tollSystem: "NC Quick Pass", tollNote: "Triangle Expressway and Monroe Bypass; NC ferries on the Outer Banks.", helmet: "All riders", helmetNote: "Universal helmet law.", portal: P("ncquickpass.com", "https://www.ncquickpass.com/") },
  { code: "ND", name: "North Dakota", petrol: 3.16, diesel: 3.74, charging: 0.44, tollSystem: "Toll-Free", tollNote: "No toll roads.", helmet: "Under 18", helmetNote: "Helmets required under 18." },
  { code: "OH", name: "Ohio", petrol: 3.09, diesel: 3.70, charging: 0.46, tollSystem: "E-ZPass OH", tollNote: "Ohio Turnpike (I-80/90) ticket system — E-ZPass saves ~30%.", helmet: "Under 18", helmetNote: "Helmets required under 18 and for novice riders in their first year." },
  { code: "OK", name: "Oklahoma", petrol: 2.92, diesel: 3.55, charging: 0.43, tollSystem: "PIKEPASS", tollNote: "One of the biggest turnpike networks in the country — PlatePay bills by mail.", helmet: "Under 18", helmetNote: "Helmets required under 18.", portal: P("pikepass.com", "https://www.pikepass.com/") },
  { code: "OR", name: "Oregon", petrol: 3.98, diesel: 4.24, charging: 0.52, tollSystem: "Toll-Free", tollNote: "Bridge tolls only on the Columbia crossings to Washington.", helmet: "All riders", helmetNote: "Universal helmet law." },
  { code: "PA", name: "Pennsylvania", petrol: 3.41, diesel: 4.06, charging: 0.51, tollSystem: "E-ZPass PA", tollNote: "PA Turnpike is fully cashless; Toll-By-Plate costs far more than E-ZPass.", helmet: "Under 21", helmetNote: "21+ may ride helmet-free after 2 years' experience or a safety course.", portal: P("paturnpike.com", "https://www.paturnpike.com/") },
  { code: "RI", name: "Rhode Island", petrol: 3.27, diesel: 3.91, charging: 0.51, tollSystem: "E-ZPass RI", tollNote: "Newport Pell Bridge toll; truck-only gantries elsewhere.", helmet: "Under 21", helmetNote: "Helmets required under 21 and for all passengers." },
  { code: "SC", name: "South Carolina", petrol: 2.95, diesel: 3.57, charging: 0.44, tollSystem: "Palmetto Pass", tollNote: "Southern Connector and Cross Island Parkway (Hilton Head).", helmet: "Under 21", helmetNote: "Helmets required under 21." },
  { code: "SD", name: "South Dakota", petrol: 3.13, diesel: 3.71, charging: 0.44, tollSystem: "Toll-Free", tollNote: "No toll roads; Needles Highway and Iron Mountain Road are free scenic gems.", helmet: "Under 18", helmetNote: "Helmets required under 18." },
  { code: "TN", name: "Tennessee", petrol: 2.97, diesel: 3.60, charging: 0.44, tollSystem: "Toll-Free", tollNote: "No toll roads — the Tail of the Dragon is free.", helmet: "All riders", helmetNote: "Universal helmet law." },
  { code: "TX", name: "Texas", petrol: 2.88, diesel: 3.52, charging: 0.43, tollSystem: "TxTag / EZ TAG", tollNote: "Dense toll network around Austin, Dallas and Houston; Pay By Mail adds a surcharge.", helmet: "Under 21", helmetNote: "21+ exempt with a safety course or health insurance.", portal: P("txtag.org", "https://www.txtag.org/") },
  { code: "UT", name: "Utah", petrol: 3.42, diesel: 3.88, charging: 0.46, tollSystem: "Express Pass", tollNote: "I-15 express lanes; Zion park entry fees are separate.", helmet: "Under 21", helmetNote: "Helmets required under 21." },
  { code: "VT", name: "Vermont", petrol: 3.30, diesel: 3.95, charging: 0.51, tollSystem: "Toll-Free", tollNote: "No toll roads; ferries cross Lake Champlain.", helmet: "All riders", helmetNote: "Universal helmet law." },
  { code: "VA", name: "Virginia", petrol: 3.15, diesel: 3.78, charging: 0.48, tollSystem: "E-ZPass VA", tollNote: "I-495/I-95 dynamic express lanes, Chesapeake Bay Bridge-Tunnel, Dulles Toll Road.", helmet: "All riders", helmetNote: "Universal helmet law; face shield or windscreen required." },
  { code: "WA", name: "Washington", petrol: 4.21, diesel: 4.48, charging: 0.53, tollSystem: "Good To Go!", tollNote: "SR-520 bridge, SR-99 tunnel, I-405 express lanes and Washington State Ferries.", helmet: "All riders", helmetNote: "Universal helmet law.", portal: P("mygoodtogo.com", "https://www.mygoodtogo.com/") },
  { code: "WV", name: "West Virginia", petrol: 3.20, diesel: 3.82, charging: 0.47, tollSystem: "E-ZPass WV", tollNote: "WV Turnpike (I-77) barrier tolls; single-fee E-ZPass pass available.", helmet: "All riders", helmetNote: "Universal helmet law." },
  { code: "WI", name: "Wisconsin", petrol: 3.08, diesel: 3.69, charging: 0.45, tollSystem: "Toll-Free", tollNote: "No toll roads; Lake Michigan car ferries operate seasonally.", helmet: "Under 18", helmetNote: "Helmets required under 18 and for permit holders." },
  { code: "WY", name: "Wyoming", petrol: 3.29, diesel: 3.80, charging: 0.45, tollSystem: "Toll-Free", tollNote: "No tolls; Yellowstone and Beartooth close seasonally.", helmet: "Under 18", helmetNote: "Helmets required under 18." },
  { code: "DC", name: "District of Columbia", petrol: 3.63, diesel: 4.16, charging: 0.55, tollSystem: "E-ZPass", tollNote: "No city tolls, but every approach road is tolled or express-laned.", helmet: "All riders", helmetNote: "Universal helmet law." },
];

export const CA_PROVINCES: CaProvince[] = [
  {
    code: "AB", name: "Alberta", frName: "Alberta",
    petrol: 1.42, diesel: 1.59, charging: 0.42,
    networks: ["Petro-Canada", "ChargePoint", "Tesla Supercharger"],
    winterTires: "Recommended, not mandatory",
    winterWindow: "Oct 1 – Apr 30 (mountain parks advise winter tyres or chains)",
    tollSystem: "Toll-Free",
    tollNote: "No toll highways. Icefields Parkway needs a Parks Canada pass, not a toll.",
    portal: P("Parks Canada pass", "https://parks.canada.ca/voyage-travel/admission"),
  },
  {
    code: "BC", name: "British Columbia", frName: "Colombie-Britannique",
    petrol: 1.73, diesel: 1.82, charging: 0.38,
    networks: ["BC Hydro EV", "FLO", "Tesla Supercharger", "Petro-Canada"],
    winterTires: "Mandatory on designated highways",
    winterWindow: "Oct 1 – Mar 31 (to Apr 30 on mountain passes) — M+S or 3PMSF, 3.5 mm tread",
    tollSystem: "BC Ferries (no road tolls)",
    tollNote: "Road tolls were removed in 2017; BC Ferries reservations are the real cost line.",
    portal: P("bcferries.com", "https://www.bcferries.com/"),
  },
  {
    code: "MB", name: "Manitoba", frName: "Manitoba",
    petrol: 1.39, diesel: 1.55, charging: 0.40,
    networks: ["Manitoba Hydro", "Petro-Canada", "Tesla Supercharger"],
    winterTires: "Recommended (low-interest financing program)",
    winterWindow: "Oct – Apr recommended",
    tollSystem: "Toll-Free",
    tollNote: "No toll roads anywhere in the province.",
  },
  {
    code: "NB", name: "New Brunswick", frName: "Nouveau-Brunswick",
    petrol: 1.58, diesel: 1.72, charging: 0.41,
    networks: ["eCharge NB", "FLO", "Petro-Canada"],
    winterTires: "Recommended",
    winterWindow: "Oct – Apr recommended",
    tollSystem: "Bridge tolls",
    tollNote: "Confederation Bridge to PEI is tolled on departure from the island (~CAD 50 car).",
    portal: P("confederationbridge.com", "https://www.confederationbridge.com/"),
  },
  {
    code: "NL", name: "Newfoundland and Labrador", frName: "Terre-Neuve-et-Labrador",
    petrol: 1.68, diesel: 1.83, charging: 0.45,
    networks: ["Takecharge NL", "FLO"],
    winterTires: "Strongly recommended",
    winterWindow: "Nov – Apr; snow tyres essential on the Trans-Canada",
    tollSystem: "Marine Atlantic ferries",
    tollNote: "Access is by ferry from North Sydney, NS — book vehicle deck space early.",
    portal: P("marineatlantic.ca", "https://www.marineatlantic.ca/"),
  },
  {
    code: "NS", name: "Nova Scotia", frName: "Nouvelle-Écosse",
    petrol: 1.61, diesel: 1.76, charging: 0.42,
    networks: ["FLO", "Petro-Canada", "Tesla Supercharger"],
    winterTires: "Recommended",
    winterWindow: "Oct 15 – Apr 30 recommended",
    tollSystem: "Cobequid Pass + Halifax bridges",
    tollNote: "Highway 104 Cobequid Pass toll plus MACPASS on the Halifax harbour bridges.",
    portal: P("halifaxharbourbridges.ca", "https://www.halifaxharbourbridges.ca/"),
  },
  {
    code: "NT", name: "Northwest Territories", frName: "Territoires du Nord-Ouest",
    petrol: 1.75, diesel: 1.92, charging: 0.48,
    networks: ["NTPC", "Limited — plan charging carefully"],
    winterTires: "Essential in practice",
    winterWindow: "Oct – May; carry chains and recovery gear",
    tollSystem: "Toll-Free",
    tollNote: "Deh Cho Bridge is free; ice roads and seasonal ferries govern access.",
  },
  {
    code: "NU", name: "Nunavut", frName: "Nunavut",
    petrol: 1.88, diesel: 2.02, charging: 0.55,
    networks: ["Very limited charging infrastructure"],
    winterTires: "Essential",
    winterWindow: "Year-round studded/winter tyres are common",
    tollSystem: "No connected highway network",
    tollNote: "Communities are not connected by road — travel is by air or sealift.",
  },
  {
    code: "ON", name: "Ontario", frName: "Ontario",
    petrol: 1.52, diesel: 1.66, charging: 0.44,
    networks: ["Ivy Charging Network", "FLO", "Tesla Supercharger", "Petro-Canada"],
    winterTires: "Recommended (insurance discount)",
    winterWindow: "Dec 1 – Mar 31 for the mandatory insurance discount",
    tollSystem: "407 ETR + border bridges",
    tollNote: "Highway 407 ETR bills by plate with a video fee; Peace Bridge, Ambassador Bridge and Blue Water Bridge charge at the US border.",
    portal: P("407etr.com", "https://www.407etr.com/"),
  },
  {
    code: "PE", name: "Prince Edward Island", frName: "Île-du-Prince-Édouard",
    petrol: 1.62, diesel: 1.78, charging: 0.42,
    networks: ["Maritime Electric", "FLO"],
    winterTires: "Recommended",
    winterWindow: "Nov – Apr recommended",
    tollSystem: "Confederation Bridge",
    tollNote: "Toll charged only when leaving the island; Northumberland Ferries is the alternative.",
    portal: P("confederationbridge.com", "https://www.confederationbridge.com/"),
  },
  {
    code: "QC", name: "Québec", frName: "Québec",
    petrol: 1.66, diesel: 1.74, charging: 0.36,
    networks: ["Circuit électrique", "FLO", "Tesla Supercharger", "Petro-Canada"],
    winterTires: "MANDATORY by law",
    winterWindow: "Dec 1 – Mar 15 — 3PMSF winter tyres required on every passenger vehicle, fines CAD 200–300",
    tollSystem: "A-25 / A-30 + ferries",
    tollNote: "Electronic tolls on the A-25 bridge and A-30 bypass; STQ ferries cross the St. Lawrence.",
    portal: P("a25.com", "https://a25.com/"),
  },
  {
    code: "SK", name: "Saskatchewan", frName: "Saskatchewan",
    petrol: 1.45, diesel: 1.61, charging: 0.41,
    networks: ["SaskPower", "Petro-Canada", "Tesla Supercharger"],
    winterTires: "Recommended",
    winterWindow: "Oct – Apr recommended; blizzard closures are common",
    tollSystem: "Toll-Free",
    tollNote: "No toll roads; free provincial ferries cross the North Saskatchewan River in summer.",
  },
  {
    code: "YT", name: "Yukon", frName: "Yukon",
    petrol: 1.71, diesel: 1.89, charging: 0.47,
    networks: ["Yukon Energy public chargers", "Sparse — plan 300 km hops"],
    winterTires: "Strongly recommended, studs allowed",
    winterWindow: "Oct 1 – Apr 30 (studded tyres permitted)",
    tollSystem: "Toll-Free",
    tollNote: "No tolls on the Alaska or Dempster Highways — fuel range is the real constraint.",
  },
];
