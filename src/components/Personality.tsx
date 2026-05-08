import { useState } from "react";
import { Wind, Crown, Building2, Mountain, Flame } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getUiCopy, interpolate } from "@/i18n/localized-content";

const PROFILES = [
  {
    id: "calm",
    name: "Calm Explorer",
    icon: Wind,
    tagline: "Long horizons, quiet thoughts.",
    desc: "You drive to clear your head. You'd rather glide than race. Comfort beats horsepower, every time.",
    matches: ["Volvo EX90", "Lexus RX", "Genesis Electrified GV70"],
    vibe: "from-blue-500/30 to-cyan-400/10",
  },
  {
    id: "exec",
    name: "Quiet Executive",
    icon: Crown,
    tagline: "Refinement without announcement.",
    desc: "You want presence, not attention. Tech that disappears into craft. A car that respects your time.",
    matches: ["BMW i5", "Mercedes EQE", "Lucid Air Pure"],
    vibe: "from-indigo-500/30 to-violet-400/10",
  },
  {
    id: "urban",
    name: "Urban Minimalist",
    icon: Building2,
    tagline: "Less, but better. Every day.",
    desc: "Tight streets, daily errands, occasional escape. Compact footprint, premium feel, zero compromise.",
    matches: ["MINI Countryman SE", "Volvo EX30", "Audi Q4 e-tron"],
    vibe: "from-slate-400/30 to-zinc-400/10",
  },
  {
    id: "weekend",
    name: "Weekend Escapist",
    icon: Mountain,
    tagline: "Monday city. Saturday wild.",
    desc: "Capable when it matters. Quiet when it doesn't. Built for the trips you take and the ones you'll take.",
    matches: ["Rivian R1S", "Land Rover Defender", "Polestar 3"],
    vibe: "from-emerald-500/30 to-teal-400/10",
  },
  {
    id: "romantic",
    name: "Performance Romantic",
    icon: Flame,
    tagline: "It should make you smile.",
    desc: "Specs are the language, but feeling is the point. You want the car you'll talk about in 20 years.",
    matches: ["Porsche Taycan", "Alpine A290", "BMW M2"],
    vibe: "from-rose-500/30 to-orange-400/10",
  },
];

export const Personality = ({ onPick }: { onPick: (prompt: string) => void }) => {
  const { i18n } = useTranslation();
  const ui = getUiCopy(i18n.language).personalityChooser;
  const [active, setActive] = useState(PROFILES[0]);

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0">
        {PROFILES.map((p) => {
          const isActive = p.id === active.id;
          return (
            <button
              key={p.id}
              onClick={() => setActive(p)}
              className={`group relative flex items-center gap-3 px-5 py-4 rounded-2xl text-left shrink-0 lg:shrink transition-all duration-500 border ${
                isActive
                  ? "glass border-primary/50 shadow-glow"
                  : "border-border/30 hover:border-border bg-card/40"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${isActive ? "bg-gradient-primary" : "bg-secondary"}`}>
                <p.icon className={`w-4 h-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
              </div>
              <div className="min-w-0">
                <div className={`font-semibold tracking-tight text-sm ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {p.name}
                </div>
                <div className="text-[11px] text-muted-foreground/70 truncate">{p.tagline}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative glass rounded-3xl p-8 md:p-12 overflow-hidden min-h-[420px]">
        <div className={`absolute -inset-20 bg-gradient-radial blur-3xl opacity-60 bg-gradient-to-br ${active.vibe} transition-all duration-700`} />
        <div className="relative z-10 animate-fade-up" key={active.id}>
          <div className="text-xs uppercase tracking-[0.3em] text-accent mb-4">{ui.eyebrow}</div>
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter mb-3">{active.name}</h3>
          <p className="text-lg text-muted-foreground italic mb-6">"{active.tagline}"</p>
          <p className="text-base leading-relaxed mb-8 max-w-xl">{active.desc}</p>

          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3">{ui.suggested}</div>
          <div className="flex flex-wrap gap-2 mb-8">
            {active.matches.map((m) => (
              <span key={m} className="px-3 py-1.5 rounded-full text-sm glass">{m}</span>
            ))}
          </div>

          <button
            onClick={() => onPick(interpolate(ui.prompt, { name: active.name, description: active.desc }))}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:gap-3 shadow-glow"
          >
            {ui.cta}
          </button>
        </div>
      </div>
    </div>
  );
};
