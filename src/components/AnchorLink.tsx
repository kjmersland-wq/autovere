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
      className={`inline-flex items-center text-muted-foreground/50 transition-colors hover:text-primary ${className}`}
    >
      <LinkIcon className="size-3.5" aria-hidden />
    </button>
  );
}
