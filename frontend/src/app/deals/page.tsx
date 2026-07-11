"use client";

import { useEffect, useMemo, useState } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { ProductGridSkeleton } from "@/components/product/skeletons";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { getSavingsPercent } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

const filters = [
  { id: "all", label: "All deals" },
  { id: "grocery", label: "Grocery" },
  { id: "beauty", label: "Beauty & care" },
  { id: "home", label: "Home" },
] as const;

const grocerySlugs = new Set([
  "milk-dairy",
  "bakery",
  "pantry",
  "beverages-juices",
  "fruits-vegetables",
  "meat-poultry-fish",
  "deli",
  "frozen",
  "wine-bubbles",
]);
const beautySlugs = new Set([
  "toiletries",
  "skincare",
  "makeup",
  "haircare",
  "fragrance",
  "bath-and-body",
  "mens-grooming",
  "kids-baby",
]);
const homeSlugs = new Set(["cleaning", "household"]);

export default function DealsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch("/api/deals")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load deals");
        return res.json();
      })
      .then((data: { products: Product[] }) => {
        if (!cancelled) setDeals(data.products ?? []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load deals. Try again in a moment.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    track("view_deals", { filter });
  }, [filter]);

  const filtered = useMemo(
    () =>
      deals.filter((product) => {
        if (filter === "all") return true;
        if (filter === "grocery") return grocerySlugs.has(product.categorySlug);
        if (filter === "beauty") return beautySlugs.has(product.categorySlug);
        if (filter === "home") return homeSlugs.has(product.categorySlug);
        return true;
      }),
    [deals, filter]
  );

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) => {
        const saveA = Math.max(
          ...a.prices.map((p) => getSavingsPercent(p) ?? 0)
        );
        const saveB = Math.max(
          ...b.prices.map((p) => getSavingsPercent(p) ?? 0)
        );
        return saveB - saveA;
      }),
    [filtered]
  );

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Deals" },
        ]}
      />
      <div className="space-y-1">
        <p className="figma-eyebrow">Savings</p>
        <h1 className="font-heading text-2xl font-medium md:text-3xl">Top deals</h1>
        <p className="text-sm font-light">
          Products where the price has dropped. Sorted by biggest cut.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {filters.map((item) => (
          <Button
            key={item.id}
            size="sm"
            variant="outline"
            onClick={() => setFilter(item.id)}
            className={cn(
              "shrink-0 rounded-full",
              filter === item.id && "bg-foreground text-background"
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <ProductGridSkeleton />
      ) : error ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          {error}
        </div>
      ) : sorted.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center text-sm text-muted-foreground">
          No deals in this filter right now.
        </div>
      )}
    </div>
  );
}
