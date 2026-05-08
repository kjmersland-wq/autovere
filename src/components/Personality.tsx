import { useState } from "react";
import { Wind, Crown, Building2, Mountain, Flame, Snowflake } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getCar, getPersonalities } from "@/data/cars";
import { getUiCopy, interpolate } from "@/i18n/localized-content";

const ICONS: Record<string, any> = {
  "calm-explorer": Wind,
  "quiet-executive": Crown,
  "urban-minimalist": Building2,
  "weekend-escapist": Mountain,
  "performance-romantic": Flame,
  "nordic-adventurer": Snowflake,
};

const VIBES: Record<string, string> = {
  "calm-explorer": "from-blue-500/30 to-cyan-400/10",
  "quiet-executive": "from-indigo-500/30 to-violet-400/10",
  "urban-minimalist": "from-slate-400/30 to-zinc-400/10",
  "weekend-escapist": "from-emerald-500/30 to-teal-400/10",
  "performance-romantic": "from-rose-500/30 to-orange-400/10",
  "nordic-adventurer": "from-sky-500/25 to-blue-400/10",
};

export const Personality = ({ onPick }: { onPick: (prompt: string) => void }) => {
  const { i18n } = useTranslation();
  const ui = getUiCopy(i18n.language).personalityChooser;
  const profiles = getPersonalities(i18n.language).map((profile) => ({
    id: profile.slug,
    name: profile.name,
    tagline: profile.tagline,
    desc: profile.description,
    prompt: profile.prompt,
    icon: ICONS[profile.slug] ?? Wind,
    vibe: VIBES[profile.slug] ?? "from-slate-400/30 to-zinc-400/10",
    matches: profile.matches
      .map((slug) => getCar(slug, i18n.language)?.name)
      .filter((x): x is string => Boolean(x)),
  }));
  const [activeId, setActiveId] = useState(profiles[0]?.id ?? "");
  const active = profiles.find((profile) => profile.id === activeId) ?? profiles[0];

  if (!active) return null;

  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-8">
      <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0">
        {profiles.map((p) => {
          const isActive = p.id === active.id;
          return (
            <button
              key={p.id}
                onClick={() => setActiveId(p.id)}
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
            onClick={() => onPick(active.prompt || interpolate(ui.prompt, { name: active.name, description: active.desc }))}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-medium hover:opacity-90 transition-all hover:gap-3 shadow-glow"
          >
            {ui.cta}
          </button>
        </div>
      </div>
    </div>
  );
};
