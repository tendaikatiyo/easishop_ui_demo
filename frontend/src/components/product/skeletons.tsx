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

export function ListProductRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3">
      <Skeleton className="size-14 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 shrink-0 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-8 w-16 shrink-0 rounded-full" />
    </div>
  );
}

export function ListProductSkeleton({ count = 4 }: { count?: number }) {
  return (
    <ul className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <ListProductRowSkeleton />
        </li>
      ))}
    </ul>
  );
}
