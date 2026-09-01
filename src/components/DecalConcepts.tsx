/**
 * AutoVere Decal Concepts — pure visual showcase.
 * No shop, cart or checkout logic: two print-ready decal designs
 * presented inside realistic car-glass and vehicle-paint panels.
 */

function StripDecal() {
  return (
    <div
      className="flex w-full items-center gap-4 rounded-[6px] border px-5 py-3"
      style={{
        background: "linear-gradient(180deg, #1b2230 0%, #0d121c 100%)",
        borderColor: "rgba(56,189,248,0.55)",
        boxShadow: "0 0 22px rgba(56,189,248,0.18), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Route ribbon crest */}
      <svg viewBox="0 0 48 48" className="h-10 w-10 shrink-0" aria-hidden="true">
        <path
          d="M8 40c10-2 12-9 8-14S8 18 12 12s16-6 24-2"
          fill="none"
          stroke="#38bdf8"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="37" cy="11" r="5" fill="#f59e0b" />
      </svg>

      <div className="min-w-0 flex-1">
        <div
          className="truncate text-[1.35rem] font-semibold leading-none tracking-[0.28em]"
          style={{ color: "#f8fafc", textShadow: "0 0 14px rgba(56,189,248,0.45)" }}
        >
          AUTOVERÉ
        </div>
        <div
          className="mt-1.5 truncate text-[0.62rem] font-medium uppercase tracking-[0.22em]"
          style={{ color: "#38bdf8" }}
        >
          Know the true cost of every kilometre
        </div>
      </div>

      <div className="h-9 w-px shrink-0" style={{ background: "rgba(148,163,184,0.35)" }} />

      <div className="shrink-0 text-right">
        <div
          className="text-[0.78rem] font-semibold tracking-[0.12em]"
          style={{ color: "#f59e0b" }}
        >
          autovere.com
        </div>
        <div
          className="text-[0.55rem] uppercase tracking-[0.2em]"
          style={{ color: "#94a3b8" }}
        >
          Plan · Charge · Explore
        </div>
      </div>
    </div>
  );
}

function BadgeDecal() {
  return (
    <div
      className="relative aspect-square w-[15rem] rounded-full"
      style={{
        background: "radial-gradient(circle at 50% 35%, #1e293b 0%, #0b1120 70%)",
        boxShadow:
          "0 0 0 2px #38bdf8, 0 0 0 8px #0b1120, 0 0 0 10px #f59e0b, 0 0 28px rgba(56,189,248,0.35)",
      }}
    >
      {/* Curved perimeter text */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <path id="decal-arc-top" d="M28,100 A72,72 0 0 1 172,100" fill="none" />
          <path id="decal-arc-bottom" d="M32,100 A68,68 0 0 0 168,100" fill="none" />
        </defs>
        <text
          fill="#f8fafc"
          fontSize="13"
          fontWeight="600"
          letterSpacing="4.2"
          textAnchor="middle"
        >
          <textPath href="#decal-arc-top" startOffset="50%">
            EUROPEAN EV EXPLORER
          </textPath>
        </text>
        <text fill="#f59e0b" fontSize="9.5" fontWeight="600" letterSpacing="3" textAnchor="middle">
          <textPath href="#decal-arc-bottom" startOffset="50%">
            CHARGED FOR THE LONG WAY ROUND
          </textPath>
        </text>
      </svg>

      {/* Centred compass / route crest */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <svg viewBox="0 0 64 64" className="h-16 w-16" aria-hidden="true">
          <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(148,163,184,0.35)" strokeWidth="1" />
          <path d="M32 6v6M32 52v6M6 32h6M52 32h6" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          <path
            d="M18 44c8-1 10-7 7-11s-7-6-4-10 11-5 17-2"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3.4"
            strokeLinecap="round"
          />
          <circle cx="39" cy="20" r="4" fill="#f59e0b" />
        </svg>
        <div
          className="text-[0.72rem] font-semibold tracking-[0.3em]"
          style={{ color: "#f8fafc" }}
        >
          AUTOVERÉ
        </div>
        <div className="text-[0.5rem] tracking-[0.22em]" style={{ color: "#38bdf8" }}>
          AUTOVERE.COM
        </div>
      </div>
    </div>
  );
}

export function DecalConcepts() {
  return (
    <section className="mt-14 rounded-3xl border border-border/60 bg-card/50 p-6 sm:p-8">
      <p className="text-xs uppercase tracking-[0.24em] text-primary">Design preview</p>
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">AutoVere Decal Concepts</h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Two print-ready concepts for official AutoVere car decals, shown on realistic tinted glass
        and vehicle paint so proportions, contrast and readability are immediately clear.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Concept 1 — rear window strip */}
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-semibold">Concept 1 · Rear Window Strip</h3>
            <span className="text-xs text-muted-foreground">Horizontal banner · 45 × 8 cm</span>
          </div>
          <div
            className="rounded-2xl p-6"
            style={{
              background:
                "linear-gradient(160deg, rgba(30,41,59,0.95) 0%, rgba(2,6,23,0.98) 55%, rgba(15,23,42,0.95) 100%)",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.7)",
            }}
          >
            <div
              className="rounded-xl p-5"
              style={{
                background:
                  "linear-gradient(115deg, rgba(148,163,184,0.16) 0%, rgba(148,163,184,0.04) 40%, rgba(255,255,255,0.09) 55%, rgba(148,163,184,0.03) 70%)",
              }}
            >
              <StripDecal />
            </div>
            <p className="mt-3 text-center text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              Shown on tinted rear glass
            </p>
          </div>
        </div>

        {/* Concept 2 — circular badge */}
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h3 className="font-semibold">Concept 2 · Circular Explorer Badge</h3>
            <span className="text-xs text-muted-foreground">Round emblem · 10 × 10 cm</span>
          </div>
          <div
            className="flex flex-col items-center rounded-2xl p-6"
            style={{
              background:
                "linear-gradient(145deg, #223047 0%, #16203a 45%, #0b1120 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -40px 80px rgba(0,0,0,0.55)",
            }}
          >
            <BadgeDecal />
            <p className="mt-4 text-center text-[0.7rem] uppercase tracking-[0.18em] text-muted-foreground">
              Shown on metallic vehicle paint
            </p>
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        Visual concepts only — print-ready artwork, vinyl spec and ordering are not part of this preview.
      </p>
    </section>
  );
}
