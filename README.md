# AutoVere

Build a high-end, premium Progressive Web App (PWA) called "AutoVere" (autovere.com) for desktop and mobile in English. 

You have full creative freedom on visual design, layout, spacing, and styling. Make it look sleek, authoritative, and trustworthy—like a polished automotive or fintech tool—while keeping the user flow completely frictionless and dead-simple for everyday drivers.

Core PWA & Technical Requirements:

- Configure full PWA support (web manifest, service worker for offline caching, installable on mobile and desktop).

- Base language: English (EN) with a scalable architecture prepared for future i18n localization.

- Client-side deterministic calculations using free open data / OpenStreetMap (no paid APIs, instant response).

Functional Requirements:

1. Search & Trip Input:

   - Clean, auto-completing 'From' and 'To' inputs for European cities and destinations.

   - Vehicle selector: Petrol, Diesel, Electric (EV).

   - If 'Electric (EV)' is selected: provide a simple battery size / range slider (e.g. 300–600 km).

   - Trip duration selector in days (to determine correct 1-day, 10-day, or annual vignette tiers).

   - Instant calculation trigger.

2. Interactive Map:

   - Render Leaflet / OpenStreetMap.

   - Display two high-contrast routes: "Fastest Route" vs. "Smart Bypass" (avoiding heavy toll sections).

   - Markers for start, destination, country borders, and major toll/vignette checkpoints.

   - EV Charging Layer: When EV is selected, plot suggested high-power charging stops (150kW+ corridor chargers) along the route at optimal intervals (every 250–350 km) using OpenStreetMap charging station data.

3. Premium Comparison View:

   - Compare "Fastest Route" vs. "Smart Bypass" vs. "100% Toll-Free".

   - Clear cost breakdown: Estimated fuel vs. charging costs, distance tolls (e.g. France, Italy), and required vignettes (Austria, Switzerland, Slovenia, Czech Republic, Slovakia).

   - For EV trips: Display total estimated charging time and number of recommended stops.

   - Prominently highlight time vs. money trade-offs (e.g., "+15 min bypass saves €38").

4. Actions & Conversions:

   - One-click "Open in Google Maps / Apple Maps" button with intermediate waypoints to enforce the bypass route and charging stops directly in navigation apps.

   - Downloadable GPX file for in-car GPS units.

   - "Official Vignette Checklist" with verified direct links to official government portals (ASFINAG, DARS, etc.) to protect users from reseller markups.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/32f52f19-8b10-49ce-9c74-7340cd0e926f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
