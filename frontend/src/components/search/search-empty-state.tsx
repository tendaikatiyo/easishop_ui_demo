"use client";

import Link from "next/link";
import { Search, TrendingUp } from "lucide-react";
import { CATEGORIES } from "@/lib/catalog";
import { getCategoryIcon } from "@/components/product/category-icons";
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
          className="glass glass-pill px-4 py-2 text-sm font-medium transition-all hover:bg-white/70 active:scale-[0.97]"
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
          <Search size={24} className="brand-green" aria-hidden />
        </div>
        <h2 className="mt-4 font-heading text-xl font-medium">
          {isReturning ? "Welcome back" : "What are you shopping for?"}
        </h2>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
          {isReturning
            ? "Find your best price across five stores."
            : "Search by name to compare live prices across retailers."}
        </p>
        <div className="mt-8 space-y-3">
          <p className="figma-eyebrow flex items-center justify-center gap-1.5">
            <TrendingUp size={14} className="brand-green" aria-hidden />
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
                className="glass glass-pill flex items-center gap-2.5 py-1.5 pl-1.5 pr-4 text-sm font-medium transition-all active:scale-[0.97]"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-[var(--brand-green-light)]">
                  <Icon size={16} className="brand-green" aria-hidden />
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
