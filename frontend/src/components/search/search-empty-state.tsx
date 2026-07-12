"use client";

import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { CATEGORIES, getCategoryIcon } from "@/lib/catalog";
import { useReturningVisitor } from "@/hooks/use-returning-visitor";

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

export function PopularSearchPills() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {POPULAR_SEARCHES.map((term) => (
        <Link
          key={term}
          href={`/search?q=${encodeURIComponent(term)}`}
          className="rounded-full bg-surface-soft px-4 py-2 text-sm font-medium transition-all hover:bg-[var(--brand-green-soft)] active:scale-[0.97]"
        >
          {term}
        </Link>
      ))}
    </div>
  );
}

export function SearchEmptyState() {
  const isReturning = useReturningVisitor();
  const quickCategories = CATEGORIES.filter((c) =>
    QUICK_CATEGORY_SLUGS.includes(c.slug)
  );

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-white px-6 py-12 text-center md:py-16">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--brand-green-light)]">
          <Search className="size-6 brand-green" strokeWidth={2} />
        </div>
        <h2 className="mt-4 font-heading text-xl font-medium">
          {isReturning ? "Welcome back" : "What are you shopping for?"}
        </h2>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          {isReturning
            ? "Find your best price across five stores."
            : "Search by name or scan a barcode to compare live prices across retailers."}
        </p>
        <div className="mt-8 space-y-3">
          <p className="figma-eyebrow flex items-center justify-center gap-1.5">
            <TrendingUp className="size-3.5 brand-green" />
            Popular searches
          </p>
          <PopularSearchPills />
        </div>
      </div>

      <div className="rounded-[32px] bg-surface-soft px-6 py-8 md:px-8">
        <p className="figma-eyebrow">Or browse aisles</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {quickCategories.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium shadow-xs transition-all hover:shadow-sm active:scale-[0.97]"
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
