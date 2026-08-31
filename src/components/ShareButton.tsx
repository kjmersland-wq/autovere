import { useState } from "react";
import { Check, Copy, Facebook, Link2, Linkedin, Mail, MessageCircle, Share2 } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Lang = "en" | "no" | "pl";

type Copy = {
  button: string;
  heading: string;
  native: string;
  copy: string;
  copied: string;
  email: string;
  title: string;
  text: string;
};

const COPY: Record<Lang, Copy> = {
  en: {
    button: "Share",
    heading: "Share AutoVere",
    native: "Share via device",
    copy: "Copy link",
    copied: "Link copied",
    email: "Email",
    title: "AutoVere — know the true cost of every kilometre",
    text: "Tolls, vignettes, fuel, charging and ferries — calculated for your whole road trip.",
  },
  no: {
    button: "Del",
    heading: "Del AutoVere",
    native: "Del via enheten",
    copy: "Kopier lenke",
    copied: "Lenke kopiert",
    email: "E-post",
    title: "AutoVere — kjenn den ekte kostnaden per kilometer",
    text: "Bompenger, vignetter, drivstoff, lading og ferjer — beregnet for hele bilturen din.",
  },
  pl: {
    button: "Udostępnij",
    heading: "Udostępnij AutoVere",
    native: "Udostępnij przez urządzenie",
    copy: "Kopiuj link",
    copied: "Link skopiowany",
    email: "E-mail",
    title: "AutoVere — poznaj prawdziwy koszt każdego kilometra",
    text: "Opłaty drogowe, winiety, paliwo, ładowanie i promy — policzone dla całej trasy.",
  },
};

export function ShareButton({
  lang = "en",
  url,
  className = "",
  variant = "menu",
}: {
  lang?: Lang;
  url?: string;
  className?: string;
  variant?: "menu" | "bar";
}) {
  const t: Copy = COPY[lang] ?? COPY.en;
  const [copied, setCopied] = useState(false);

  const shareUrl = () =>
    url ?? (typeof window !== "undefined" ? window.location.href : "https://www.autovere.com/");

  const enc = (s: string) => encodeURIComponent(s);

  const openWindow = (href: string) => {
    if (typeof window !== "undefined") window.open(href, "_blank", "noopener,noreferrer,width=640,height=640");
  };

  const nativeShare = async () => {
    const nav = typeof navigator !== "undefined" ? (navigator as Navigator) : null;
    if (nav && "share" in nav) {
      try {
        await nav.share({ title: t.title, text: t.text, url: shareUrl() });
      } catch {
        /* dismissed */
      }
    } else {
      void copyLink();
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const items = [
    {
      key: "facebook",
      label: "Facebook",
      icon: <Facebook className="h-4 w-4" />,
      run: () => openWindow(`https://www.facebook.com/sharer/sharer.php?u=${enc(shareUrl())}`),
    },
    {
      key: "x",
      label: "X",
      icon: <span className="text-sm font-bold leading-none">𝕏</span>,
      run: () => openWindow(`https://twitter.com/intent/tweet?url=${enc(shareUrl())}&text=${enc(t.text)}`),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="h-4 w-4" />,
      run: () => openWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl())}`),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4" />,
      run: () => openWindow(`https://wa.me/?text=${enc(`${t.text} ${shareUrl()}`)}`),
    },
    {
      key: "email",
      label: t.email,
      icon: <Mail className="h-4 w-4" />,
      run: () => openWindow(`mailto:?subject=${enc(t.title)}&body=${enc(`${t.text}\n\n${shareUrl()}`)}`),
    },
  ];

  if (variant === "bar") {
    return (
      <div
        className={`flex w-full flex-col items-center gap-4 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur sm:flex-row sm:justify-between ${className}`}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Share2 className="h-4 w-4 text-primary" />
          {t.heading}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {items.map((i) => (
            <button
              key={i.key}
              type="button"
              onClick={() => i.run()}
              aria-label={i.label}
              title={i.label}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
            >
              <span className="flex h-4 w-4 items-center justify-center">{i.icon}</span>
              <span className="hidden sm:inline">{i.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => void copyLink()}
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? t.copied : t.copy}
          </button>
          <button
            type="button"
            onClick={() => void nativeShare()}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary sm:hidden"
          >
            <Link2 className="h-4 w-4" />
            {t.native}
          </button>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.button}
        className={`inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary shadow-sm transition-all hover:bg-primary/20 hover:shadow-md ${className}`}
      >
        <Share2 className="h-4 w-4" />
        {t.button}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel>{t.heading}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void nativeShare()} className="gap-2">
          <Link2 className="h-4 w-4" />
          {t.native}
        </DropdownMenuItem>
        {items.map((i) => (
          <DropdownMenuItem key={i.key} onSelect={() => i.run()} className="gap-2">
            <span className="flex h-4 w-4 items-center justify-center">{i.icon}</span>
            {i.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            void copyLink();
          }}
          className="gap-2"
        >
          {copied ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
          {copied ? t.copied : t.copy}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
