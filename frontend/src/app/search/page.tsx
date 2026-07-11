import { Suspense } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SearchCapsule } from "@/components/search/search-capsule";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/skeletons";
import { searchProducts } from "@/lib/products";
import { SearchTracker } from "./search-tracker";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; scan?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const results = q ? searchProducts(q) : searchProducts("");

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Search" },
        ]}
      />
      <div className="space-y-2">
        <h1 className="font-heading text-2xl font-semibold">Search</h1>
        <p className="text-sm text-mute">
          Type what you need, or scan a barcode on your phone.
        </p>
      </div>
      <SearchCapsule initialQuery={q} autoFocus={!q} />
      {q ? <SearchTracker query={q} scan={params.scan === "1"} /> : null}

      <Suspense fallback={<ProductGridSkeleton />}>
        <div className="space-y-3">
          <p className="text-sm text-mute">
            {q
              ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”`
              : "Browse everything in our demo catalogue"}
          </p>
          {results.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-hairline px-6 py-16 text-center">
              <p className="font-heading text-lg font-semibold">No matches</p>
              <p className="mt-1 text-sm text-mute">
                Try another name, or browse categories from home.
              </p>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
