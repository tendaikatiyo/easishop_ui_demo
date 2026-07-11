import Link from "next/link";
import { Suspense } from "react";
import { Search, SearchX, TrendingUp } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SearchCapsule } from "@/components/search/search-capsule";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/skeletons";
import { searchProducts } from "@/lib/products";
import { CATEGORIES, getCategoryIcon } from "@/lib/catalog";
import { SearchTracker } from "./search-tracker";

const POPULAR_SEARCHES = [
  "Milk",
  "Bread",
  "Eggs",
  "Coffee",
  "Rice",
  "Chicken",
  "Washing powder",
  "Yoghurt",
];

const QUICK_CATEGORY_SLUGS = [
  "fruits-vegetables",
  "milk-dairy",
  "meat-poultry-fish",
  "bakery",
  "cleaning",
  "beverages-juices",
];

function PopularSearchPills() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {POPULAR_SEARCHES.map((term) => (
        <Link
          key={term}
          href={`/search?q=${encodeURIComponent(term)}`}
          className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium shadow-xs transition-all hover:border-[var(--brand-green)]/40 hover:bg-[var(--brand-green-soft)] active:scale-[0.97]"
        >
          {term}
        </Link>
      ))}
    </div>
  );
}

function SearchEmptyState() {
  const quickCategories = CATEGORIES.filter((c) =>
    QUICK_CATEGORY_SLUGS.includes(c.slug)
  );

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-border bg-white px-6 py-12 text-center md:py-16">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--brand-green-light)]">
          <Search className="size-6 brand-green" strokeWidth={2} />
        </div>
        <h2 className="mt-4 font-heading text-xl font-medium">
          What are you shopping for?
        </h2>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          Search by name or scan a barcode to compare live prices across
          retailers.
        </p>
        <div className="mt-8 space-y-3">
          <p className="figma-eyebrow flex items-center justify-center gap-1.5">
            <TrendingUp className="size-3.5 brand-green" />
            Popular searches
          </p>
          <PopularSearchPills />
        </div>
      </div>

      <div className="rounded-3xl bg-surface-soft px-6 py-8 md:px-8">
        <p className="figma-eyebrow">Or browse aisles</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {quickCategories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex items-center gap-2.5 rounded-full border border-border bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium shadow-xs transition-all hover:border-[var(--brand-green)]/40 hover:shadow-sm active:scale-[0.97]"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-[var(--brand-green-light)]">
                  <Icon className="size-4 brand-green" strokeWidth={2} />
                </span>
                {category.name}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
        <div className="rounded-3xl border border-dashed border-border bg-white px-6 py-14 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-soft">
            <SearchX className="size-6 text-muted-foreground" strokeWidth={2} />
          </div>
          <h2 className="mt-4 font-heading text-xl font-medium">No matches</h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            Try another name, check the spelling, or start from one of these.
          </p>
          <div className="mt-6">
            <PopularSearchPills />
          </div>
        </div>
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
