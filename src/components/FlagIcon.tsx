import { cn } from "@/lib/utils";

export type FlagCode = "GB" | "NO" | "SE" | "DK" | "FI" | "US" | "DE" | "NL" | "FR" | "PL" | "ES" | "IT";

type FlagProps = { code: FlagCode; className?: string; title?: string };

/** Nordic cross flag builder (60x40 viewBox). */
function NordicCross({ field, cross, inner }: { field: string; cross: string; inner?: string }) {
  return (
    <>
      <rect width="60" height="40" fill={field} />
      <rect x="16" y="0" width="8" height="40" fill={cross} />
      <rect x="0" y="16" width="60" height="8" fill={cross} />
      {inner ? (
        <>
          <rect x="18" y="0" width="4" height="40" fill={inner} />
          <rect x="0" y="18" width="60" height="4" fill={inner} />
        </>
      ) : null}
    </>
  );
}

const FLAGS: Record<FlagCode, { label: string; svg: React.ReactNode }> = {
  GB: {
    label: "United Kingdom",
    svg: (
      <>
        <rect width="60" height="40" fill="#012169" />
        <path d="M0 0 L60 40 M60 0 L0 40" stroke="#FFFFFF" strokeWidth="9" />
        <path d="M0 0 L60 40 M60 0 L0 40" stroke="#C8102E" strokeWidth="4" />
        <path d="M30 0 V40 M0 20 H60" stroke="#FFFFFF" strokeWidth="13" />
        <path d="M30 0 V40 M0 20 H60" stroke="#C8102E" strokeWidth="8" />
      </>
    ),
  },
  NO: { label: "Norway", svg: <NordicCross field="#BA0C2F" cross="#FFFFFF" inner="#00205B" /> },
  SE: { label: "Sweden", svg: <NordicCross field="#005293" cross="#FECB00" /> },
  DK: { label: "Denmark", svg: <NordicCross field="#C60C30" cross="#FFFFFF" /> },
  FI: { label: "Finland", svg: <NordicCross field="#FFFFFF" cross="#003580" /> },
  US: {
    label: "United States",
    svg: (
      <>
        <rect width="60" height="40" fill="#B22234" />
        <rect y="3.08" width="60" height="3.08" fill="#FFFFFF" />
        <rect y="9.23" width="60" height="3.08" fill="#FFFFFF" />
        <rect y="15.38" width="60" height="3.08" fill="#FFFFFF" />
        <rect y="21.54" width="60" height="3.08" fill="#FFFFFF" />
        <rect y="27.69" width="60" height="3.08" fill="#FFFFFF" />
        <rect y="33.85" width="60" height="3.08" fill="#FFFFFF" />
        <rect width="24" height="21.54" fill="#3C3B6E" />
        <g fill="#FFFFFF">
          <circle cx="4" cy="3.5" r="1" />
          <circle cx="9" cy="3.5" r="1" />
          <circle cx="14" cy="3.5" r="1" />
          <circle cx="19" cy="3.5" r="1" />
          <circle cx="6.5" cy="7" r="1" />
          <circle cx="11.5" cy="7" r="1" />
          <circle cx="16.5" cy="7" r="1" />
          <circle cx="4" cy="10.5" r="1" />
          <circle cx="9" cy="10.5" r="1" />
          <circle cx="14" cy="10.5" r="1" />
          <circle cx="19" cy="10.5" r="1" />
          <circle cx="6.5" cy="14" r="1" />
          <circle cx="11.5" cy="14" r="1" />
          <circle cx="16.5" cy="14" r="1" />
          <circle cx="4" cy="17.5" r="1" />
          <circle cx="9" cy="17.5" r="1" />
          <circle cx="14" cy="17.5" r="1" />
          <circle cx="19" cy="17.5" r="1" />
        </g>
      </>
    ),
  },
  DE: {
    label: "Germany",
    svg: (
      <>
        <rect width="60" height="40" fill="#000000" />
        <rect y="13.33" width="60" height="13.34" fill="#DD0000" />
        <rect y="26.67" width="60" height="13.33" fill="#FFCE00" />
      </>
    ),
  },
  NL: {
    label: "Netherlands",
    svg: (
      <>
        <rect width="60" height="40" fill="#AE1C28" />
        <rect y="13.33" width="60" height="13.34" fill="#FFFFFF" />
        <rect y="26.67" width="60" height="13.33" fill="#21468B" />
      </>
    ),
  },
  FR: {
    label: "France",
    svg: (
      <>
        <rect width="60" height="40" fill="#FFFFFF" />
        <rect width="20" height="40" fill="#002395" />
        <rect x="40" width="20" height="40" fill="#ED2939" />
      </>
    ),
  },
  PL: {
    label: "Poland",
    svg: (
      <>
        <rect width="60" height="40" fill="#FFFFFF" />
        <rect y="20" width="60" height="20" fill="#DC143C" />
      </>
    ),
  },
  ES: {
    label: "Spain",
    svg: (
      <>
        <rect width="60" height="40" fill="#AA151B" />
        <rect y="10" width="60" height="20" fill="#F1BF00" />
      </>
    ),
  },
  IT: {
    label: "Italy",
    svg: (
      <>
        <rect width="60" height="40" fill="#FFFFFF" />
        <rect width="20" height="40" fill="#008C45" />
        <rect x="40" width="20" height="40" fill="#CD212A" />
      </>
    ),
  },
};

export function FlagIcon({ code, className, title }: FlagProps) {
  const flag = FLAGS[code];
  return (
    <svg
      viewBox="0 0 60 40"
      role="img"
      aria-label={title ?? flag.label}
      className={cn("h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-inset ring-black/20", className)}
      preserveAspectRatio="none"
    >
      <title>{title ?? flag.label}</title>
      {flag.svg}
    </svg>
  );
}
