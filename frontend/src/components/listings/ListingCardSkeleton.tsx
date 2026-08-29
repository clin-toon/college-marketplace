export function ListingCardSkeleton() {
  return (
    <div className="glass-surface flex flex-col overflow-hidden rounded-2xl">
      <div className="aspect-[4/3] w-full animate-pulse bg-white/[0.04]" />
      <div className="flex flex-col gap-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.04]" />
        <div className="mt-1 h-9 w-full animate-pulse rounded-xl bg-white/[0.05]" />
      </div>
    </div>
  );
}
