import { useReveal } from "@/hooks/use-reveal";

type Props = {
  image: string;
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  align?: "left" | "right" | "center";
  height?: string;
};

export const CinematicSection = ({ image, eyebrow, title, body, align = "left", height = "h-[90vh]" }: Props) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const alignClass =
    align === "right" ? "items-end text-right" : align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <section ref={ref} className={`relative ${height} overflow-hidden`}>
      <div
        className="absolute inset-0 bg-cover bg-center will-change-transform transition-transform duration-[1500ms] ease-out"
        style={{
          backgroundImage: `url(${image})`,
          transform: visible ? "scale(1.02)" : "scale(1.12)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/10 to-transparent" />

      <div className="container relative z-10 h-full flex flex-col justify-center">
        <div className={`max-w-xl flex flex-col gap-5 ${alignClass} ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-1000 ease-out`}>
          <div className="text-xs uppercase tracking-[0.3em] text-accent">{eyebrow}</div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter leading-[1.05]">{title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{body}</p>
        </div>
      </div>
    </section>
  );
};
