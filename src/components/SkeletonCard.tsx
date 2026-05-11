interface SkeletonProps {
  className?: string;
}

function Shimmer({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-card/60 rounded-lg ${className}`} />
  );
}

export function ArticleSkeleton() {
  return (
    <div className="glass rounded-2xl border border-border/40 overflow-hidden">
      <Shimmer className="aspect-[16/9] rounded-none" />
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shimmer className="h-4 w-20 rounded-full" />
          <Shimmer className="h-3 w-12 ml-auto" />
        </div>
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-5/6" />
        <Shimmer className="h-3 w-full" />
        <Shimmer className="h-3 w-4/5" />
        <div className="pt-2 border-t border-border/20 flex justify-between">
          <Shimmer className="h-3 w-16" />
          <Shimmer className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="glass rounded-2xl border border-border/40 p-6">
      <Shimmer className="h-3 w-24 mb-2" />
      <Shimmer className="h-5 w-36 mb-1" />
      <Shimmer className="h-3 w-full mb-4" />
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Shimmer className="h-14 rounded-lg" />
        <Shimmer className="h-14 rounded-lg" />
      </div>
      <div className="flex justify-between">
        <Shimmer className="h-3 w-24" />
        <Shimmer className="h-3 w-6" />
      </div>
    </div>
  );
}

export function SignalSkeleton() {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/20 last:border-0">
      <Shimmer className="w-16 h-5 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Shimmer className="h-3.5 w-full" />
        <Shimmer className="h-3 w-3/4" />
      </div>
      <Shimmer className="h-3 w-12 flex-shrink-0" />
    </div>
  );
}

export function IntelligenceScoreSkeleton() {
  return (
    <div className="glass rounded-2xl border border-border/40 p-6 space-y-4">
      <Shimmer className="h-4 w-40 mb-2" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Shimmer className="h-3 w-28" />
          <div className="flex-1 h-2 rounded-full bg-card/60" />
          <Shimmer className="h-3 w-6" />
        </div>
      ))}
    </div>
  );
}
