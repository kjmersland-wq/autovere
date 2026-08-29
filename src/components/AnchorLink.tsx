import { Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

export function AnchorLink({ id, label, copiedLabel, className = "" }: { id: string; label: string; copiedLabel: string; className?: string }) {
  async function copy() {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(copiedLabel);
    } catch {
      toast.error(copiedLabel);
    }
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        void copy();
      }}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-primary transition-colors hover:border-primary/60 hover:bg-primary/20 ${className}`}
    >
      <LinkIcon className="size-3.5" aria-hidden />
    </button>
  );
}
