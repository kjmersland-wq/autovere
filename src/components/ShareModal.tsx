import { useState } from "react";
import { Check, Copy, Facebook, Instagram, Link as LinkIcon, MessageCircle, Send, Share2, Smartphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type ShareModalProps = {
  url?: string;
  title?: string;
  compact?: boolean;
};

const defaultTitle = "AutoVere — European Toll & Route Planner";
const instagramTikTokMessage = "Link copied! Paste into Instagram/TikTok bio, story, or DM";

function activeUrl(url?: string) {
  return url || (typeof window !== "undefined" ? window.location.href : "https://www.autovere.com");
}

async function copyLink(url: string, message = "Link copied to clipboard!") {
  try {
    await navigator.clipboard.writeText(url);
    toast.success(message);
  } catch {
    toast.error("Could not copy the link. Please copy it from the address bar.");
  }
}

export function ShareModal({ url, title = defaultTitle, compact = false }: ShareModalProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const shareUrl = activeUrl(url);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(`${title} — ${shareUrl}`);

  async function nativeShare() {
    if (!navigator.share) {
      setOpen(true);
      return;
    }
    try {
      await navigator.share({ title, text: title, url: shareUrl });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      toast.error("Could not open the share menu.");
    }
  }

  async function handleCopy(message?: string) {
    await copyLink(shareUrl, message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function openShareWindow(target: string) {
    window.open(target, "autovere-share", "width=640,height=640,noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant={compact ? "ghost" : "secondary"}
        size={compact ? "icon" : "default"}
        className={compact ? "size-9 text-muted-foreground hover:text-foreground" : "min-h-11"}
        onClick={() => void nativeShare()}
        aria-label="Share AutoVere"
        title="Share AutoVere"
      >
        <Share2 className="size-4" />
        {!compact && "Share"}
      </Button>
      <DialogContent className="max-w-md border border-white/10 bg-surface/95 text-foreground shadow-[var(--shadow-elevated)] backdrop-blur-2xl sm:rounded-2xl">
        <DialogHeader className="space-y-2">
          <p className="font-display text-xs font-extrabold uppercase tracking-[0.2em] text-primary">AUTOVERE</p>
          <DialogTitle>Share with friends</DialogTitle>
          <DialogDescription>Pass along this route planner to someone heading out on the road.</DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" className="min-h-11 justify-start" onClick={() => openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}><Facebook className="size-4" /> Facebook</Button>
          <Button type="button" variant="outline" className="min-h-11 justify-start" onClick={() => openShareWindow(`https://api.whatsapp.com/send?text=${encodedText}`)}><MessageCircle className="size-4" /> WhatsApp</Button>
          <Button type="button" variant="outline" className="min-h-11 justify-start" onClick={() => openShareWindow(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title)}`)}><Send className="size-4" /> X (Twitter)</Button>
          <Button type="button" variant="outline" className="min-h-11 justify-start" onClick={() => void handleCopy(instagramTikTokMessage)}><Instagram className="size-4" /> Instagram</Button>
          <Button type="button" variant="outline" className="min-h-11 justify-start" onClick={() => void handleCopy(instagramTikTokMessage)}><Smartphone className="size-4" /> TikTok</Button>
          <Button type="button" variant="outline" className="min-h-11 justify-start" onClick={() => void handleCopy()}>{copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy Link"}</Button>
        </div>
        <DialogFooter className="mt-3">
          <p className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground"><LinkIcon className="size-3.5 shrink-0" /><span className="truncate">{shareUrl}</span></p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
