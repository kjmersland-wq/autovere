import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, Battery, Thermometer, Zap, Car, Shield, Wind, BarChart3, Wrench, Sun, CheckCircle } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { SEO } from "@/components/SEO";

interface Guide {
  id: string;
  icon: typeof Battery;
  category: string;
  title: string;
  summary: string;
  body: string[];
  tips: string[];
}

const GUIDES: Guide[] = [
  {
    id: "battery-longevity",
    icon: Battery,
    category: "Battery",
    title: "How to maximise battery longevity",
    summary: "EV batteries degrade slowly — but your habits can significantly extend or shorten their life. Here's the evidence-based approach.",
    body: [
      "Most EV batteries retain 80–90% of their original capacity after 200,000 km, but charging habits matter enormously. Keeping your state of charge between 20% and 80% on a daily basis reduces electrochemical stress on the cells.",
      "Fast charging (DC/HPC) is convenient but generates heat — the primary enemy of lithium-ion cells. Use DC fast charging for journeys, not for routine top-ups. At home, AC charging overnight is always preferable.",
      "Extreme temperatures stress the battery regardless of direction. In cold climates, pre-condition the car while it's still plugged in. In hot climates, park in shade and avoid leaving the car with a high state of charge in direct sun.",
    ],
    tips: ["Charge to 80% daily, 100% only before long trips", "Avoid regular fast charging when not needed", "Pre-condition battery before driving in cold weather", "Don't leave the car at 0% or 100% for extended periods"],
  },
  {
    id: "winter-driving",
    icon: Thermometer,
    category: "Winter",
    title: "Winter EV driving: what to expect",
    summary: "Cold weather reduces real-world EV range by 15–40%. Understanding why — and planning around it — turns a potential frustration into a manageable reality.",
    body: [
      "Lithium-ion chemistry slows significantly below 10°C. At −10°C, internal resistance increases and the battery management system limits discharge rates to protect the cells. This is temporary — the battery warms up as you drive.",
      "Cabin heating is the larger factor. Unlike combustion engines, EVs don't produce waste heat you can repurpose. Heating a cabin from scratch at −15°C can consume 3–5 kW continuously — a significant draw on a 75 kWh battery.",
      "Pre-conditioning is the single most effective winter tool. Heating the cabin while plugged in uses grid power, not battery power — so you start every journey with a warm car and a full charge.",
    ],
    tips: ["Pre-condition while plugged in — not from battery power", "Use seat heaters instead of cabin fan where possible", "Plan 25–30% more charging stops on winter routes", "Keep tyres inflated 0.2–0.3 bar above summer setting"],
  },
  {
    id: "regen-braking",
    icon: Zap,
    category: "Driving",
    title: "Regenerative braking: how to use it properly",
    summary: "Regeneration is more than an efficiency feature — it fundamentally changes how you drive, and mastering it pays dividends in range and brake wear.",
    body: [
      "Regenerative braking converts kinetic energy back into electrical energy as you decelerate. In one-pedal driving mode, lifting your foot applies strong regen — enough to bring most vehicles to a near-complete stop.",
      "The efficiency of regen depends on your speed and SoC. At high speeds, kinetic energy is high and regen is most valuable. When the battery is nearly full (above 95%), regen capacity is limited to protect cells from overcharge.",
      "Friction brakes are now largely redundant for routine driving. This is a significant advantage — brake discs and pads last dramatically longer on EVs. However, brake discs on EVs are prone to surface corrosion if friction brakes are used very rarely.",
    ],
    tips: ["Use maximum regen in urban and hilly driving", "Plan regen on downhill sections to recover energy", "Apply friction brakes occasionally to clean disc surfaces", "Use regen in cold weather to warm the battery gently"],
  },
  {
    id: "brake-discs",
    icon: Car,
    category: "Maintenance",
    title: "Avoiding brake disc corrosion on EVs",
    summary: "EV brake discs can corrode faster than on combustion cars — not because they're used more, but because they're used less. Here's why and what to do.",
    body: [
      "Brake discs on combustion vehicles are naturally polished by frequent friction use. On EVs, regenerative braking handles most deceleration, so friction brakes can go weeks without significant application. Surface rust forms quickly on unused steel.",
      "This corrosion is mostly cosmetic at first, but in damp climates (Scandinavia, UK, coastal Europe) it can progress to pitting that reduces braking effectiveness and causes judder. It's not a safety issue initially, but it can become one if neglected.",
      "The solution is simple: apply the friction brakes firmly from time to time. Once a week, intentional hard braking from 80 km/h to 20 km/h is enough to keep the discs clean. Some manufacturers now build automated brake actuation into their software for this purpose.",
    ],
    tips: ["Apply friction brakes deliberately at least once a week", "Hard stops from motorway speeds are most effective", "In winter, check for disc icing before driving", "Consider zinc-coated or stainless discs on the next service"],
  },
  {
    id: "charging-etiquette",
    icon: Shield,
    category: "Charging",
    title: "EV charging etiquette: the unwritten rules",
    summary: "Public charging is a shared resource. The EV community has developed clear norms — here's what experienced drivers follow.",
    body: [
      "The most important rule: move your car when charging is complete. Leaving a fully charged vehicle at a supercharger blocks others who need power. Most charging networks impose 'idle fees' after the session ends — but the social expectation predates the fees.",
      "Don't unplug someone else's vehicle without their permission, even if their session appears complete. Some sessions are intentionally paused. And never park in an EV charging bay if you're not charging — this applies to both EVs and combustion vehicles.",
      "During peak times at shared stations, charging to 80% and leaving is courteous if others are waiting. The last 20% of charging is the slowest phase; others may benefit more from a faster partial charge than you benefit from a complete one.",
    ],
    tips: ["Move your car promptly when charging finishes", "Don't leave at 100% when others are waiting — use 80%", "Never unplug another vehicle without permission", "Use app-based notifications to return promptly"],
  },
  {
    id: "tyre-wear",
    icon: Car,
    category: "Maintenance",
    title: "EV tyre wear: why it happens faster and how to manage it",
    summary: "EVs are heavier and accelerate harder than equivalent combustion cars. Both factors accelerate tyre wear — but the right approach compensates significantly.",
    body: [
      "Battery weight adds 200–600 kg to most EVs compared to their ICE equivalents. This extra load increases tyre deformation with every rotation, generating more heat and wear. EV-specific tyres are reinforced to handle this and carry a sound-deadening layer to compensate for the absence of engine noise.",
      "Instant torque is the second factor. Even in everyday driving, EVs can deliver full torque from standstill — subjecting tyres to shear forces that combustion cars rarely reach in normal use. Aggressive acceleration is the fastest path to worn fronts.",
      "Rotation is essential. Most EVs are rear-biased for traction, so rear tyres wear faster on RWD models; the opposite on FWD. A 10,000 km rotation schedule — tighter than the combustion-car norm — significantly extends overall tyre life.",
    ],
    tips: ["Use EV-specific tyres (marked 'EL' or 'XL')", "Rotate tyres every 10,000 km — not 15,000", "Avoid aggressive acceleration for the first 3–5 km (cold tyres)", "Keep pressures 0.2 bar above minimum recommended"],
  },
  {
    id: "fast-charging",
    icon: Zap,
    category: "Charging",
    title: "Fast charging best practices",
    summary: "DC fast charging is powerful but requires a little discipline to use optimally. Here's what the evidence says about protecting your battery.",
    body: [
      "Peak charging speed occurs between 20% and 60% state of charge on most EVs. Below 20%, the BMS limits current to protect cells. Above 60%, it tapers power to prevent overheating. Planning stops in this range means faster sessions overall.",
      "Consecutive fast charges without cooling time generate heat that the BMS can't fully dissipate. On a multi-day road trip, this isn't a meaningful concern — the cells recover overnight. But three or four HPC sessions in one day can reduce that session's efficiency.",
      "Pre-conditioning the battery before a fast charge session is increasingly automated. Many EVs, when navigation is set to a charging station, begin warming the battery for optimal acceptance rate. Using the built-in navigation to charger locations activates this automatically.",
    ],
    tips: ["Charge between 20–80% for fastest throughput", "Use built-in navigation to trigger battery pre-conditioning", "Allow 15 min cool-down between consecutive fast charges", "Avoid 0–100% on HPC chargers whenever possible"],
  },
  {
    id: "long-term-ownership",
    icon: BarChart3,
    category: "Ownership",
    title: "Long-term EV ownership: what changes at 100,000 km",
    summary: "Three to five years in, the EV ownership experience shifts. Here's what long-term owners report — the good and the occasionally frustrating.",
    body: [
      "Battery capacity loss is real but slower than early EV owners feared. Most real-world data from Tesla, Nissan Leaf and Hyundai fleets shows 5–15% capacity loss at 150,000 km, with faster degraders being outliers linked to extreme climates or poor charging habits.",
      "Software updates continue to matter more than in combustion vehicles. Over-the-air updates frequently add range, improve charging curves and add features years after purchase — a genuinely different ownership experience from ICE vehicles.",
      "The total cost of ownership picture generally improves with time. Lower servicing costs (no oil, fewer brake replacements, simpler drivetrain) compound over years. Energy costs remain stable relative to fuel volatility.",
    ],
    tips: ["Track your battery health with manufacturer apps annually", "Keep software updated — curves and range improve over time", "Service focus shifts to tyres, cabin filters and coolant", "Consider extended warranty for battery beyond 8 years"],
  },
];

const CATEGORIES = ["All", ...Array.from(new Set(GUIDES.map((g) => g.category)))];

export default function EVGuides() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = activeCategory === "All" ? GUIDES : GUIDES.filter((g) => g.category === activeCategory);

  return (
    <PageShell>
      <SEO
        title="EV Ownership Guides | AUTOVERE"
        description="Expert EV ownership guides covering battery longevity, winter driving, charging etiquette, brake maintenance and long-term ownership."
      />

      {/* Hero */}
      <section className="relative bg-hero grid-bg overflow-hidden pt-40 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-transparent to-orange-950/20 pointer-events-none" />
        <div className="container relative">
          <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-amber-400 mb-5">
            <BookOpen className="w-3.5 h-3.5" /> EV Hub › Ownership Guides
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 max-w-2xl">
            Everything real EV owners <span className="text-gradient">need to know.</span>
          </h1>
          <p className="text-muted-foreground max-w-xl text-lg leading-relaxed">
            No hype, no vague optimism. Evidence-based guides written for drivers who want
            to understand their car — not just own it.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="border-b border-border/40 bg-background/80 backdrop-blur-xl sticky top-20 z-30">
        <div className="container py-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground border-primary" : "glass border-border/40 text-muted-foreground hover:text-foreground"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="container py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          {filtered.map((guide) => {
            const isOpen = expanded === guide.id;
            return (
              <div key={guide.id} className="glass rounded-2xl border border-border/40 overflow-hidden hover:border-border/70 transition-colors">
                {/* Header */}
                <button
                  onClick={() => setExpanded(isOpen ? null : guide.id)}
                  className="w-full flex items-start gap-5 p-6 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <guide.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-accent mb-1">{guide.category}</div>
                    <h3 className="font-semibold text-base md:text-lg mb-2 group-hover:text-foreground transition-colors">{guide.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guide.summary}</p>
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                  </div>
                </button>

                {/* Expanded body */}
                {isOpen && (
                  <div className="px-6 pb-6 border-t border-border/40 pt-5">
                    <div className="space-y-4 mb-6">
                      {guide.body.map((para, i) => (
                        <p key={i} className="text-sm text-muted-foreground leading-relaxed">{para}</p>
                      ))}
                    </div>
                    <div className="bg-card/50 rounded-xl p-4">
                      <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">Key takeaways</div>
                      <ul className="space-y-2">
                        {guide.tips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-sm">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
