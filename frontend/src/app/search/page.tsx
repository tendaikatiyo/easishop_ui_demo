import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SearchCapsule } from "@/components/search/search-capsule";
import { SearchEmptyState } from "@/components/search/search-empty-state";
import { SearchNoMatches } from "@/components/search/search-no-matches";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/skeletons";
import { searchProducts } from "@/lib/products";
import { SearchTracker } from "./search-tracker";

async function SearchResults({ q }: { q: string }) {
  const results = await searchProducts(q);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {`${results.length} result${results.length === 1 ? "" : "s"} for “${q}”`}
      </p>
      {results.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <SearchNoMatches />
      )}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; scan?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
      />
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold md:text-3xl">
          Search
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Type a product name, or scan a barcode — then open a result to compare
          and add it to your list.
        </p>
      </div>
      <SearchCapsule initialQuery={q} autoFocus={!q} />
      {q ? <SearchTracker query={q} scan={params.scan === "1"} /> : null}

      {q ? (
        <Suspense fallback={<ProductGridSkeleton />}>
          <SearchResults q={q} />
        </Suspense>
      ) : (
        <SearchEmptyState />
      )}
    </div>
  );
}
