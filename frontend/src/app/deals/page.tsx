"use client";

import { useMemo, useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { getDeals } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { getSavingsPercent, getLowestPrice } from "@/lib/catalog";
import { cn } from "@/lib/utils";

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
  const deals = useMemo(() => getDeals(), []);

  useEffect(() => {
    track("view_deals", { filter });
  }, [filter]);

  const filtered = deals.filter((product) => {
    if (filter === "all") return true;
    if (filter === "grocery") return grocerySlugs.has(product.categorySlug);
    if (filter === "beauty") return beautySlugs.has(product.categorySlug);
    if (filter === "home") return homeSlugs.has(product.categorySlug);
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const saveA = Math.max(
      ...a.prices.map((p) => getSavingsPercent(p) ?? 0)
    );
    const saveB = Math.max(
      ...b.prices.map((p) => getSavingsPercent(p) ?? 0)
    );
    return saveB - saveA;
  });

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Deals" },
        ]}
      />
      <div>
        <h1 className="font-heading text-2xl font-semibold">Top deals</h1>
        <p className="text-sm text-mute">
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
              "rounded-full shrink-0",
              filter === item.id && "border-brand bg-brand-soft text-brand"
            )}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {sorted.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {sorted.map((product) => {
            const lowest = getLowestPrice(product);
            const savings = Math.max(
              ...product.prices.map((p) => getSavingsPercent(p) ?? 0)
            );
            return (
              <div key={product.id} className="relative">
                {savings > 0 ? (
                  <span className="absolute left-2 top-2 z-10 rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-white">
                    -{savings}%
                    {lowest ? ` · ${lowest.retailer}` : ""}
                  </span>
                ) : null}
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline px-6 py-16 text-center text-sm text-mute">
          No deals in this filter right now.
        </div>
      )}
    </div>
  );
}
