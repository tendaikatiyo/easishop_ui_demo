import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-[32px] bg-card p-3 md:rounded-[40px]">
      <Skeleton className="aspect-square w-full rounded-3xl md:rounded-[28px]" />
      <div className="space-y-2 px-1 pt-3">
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-1/2" />
      </div>
      <Skeleton className="mt-3 h-10 w-full rounded-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PriceRowSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 w-full rounded-3xl" />
      ))}
    </div>
  );
}
