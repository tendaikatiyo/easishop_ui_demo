"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronDown, ChevronRight, LayoutGrid } from "lucide-react";
import { CATEGORIES, getCategoryIcon } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCategoryPicker } from "@/components/product/category-picker";

const FEATURED_SLUGS = [
  "milk-dairy",
  "fruits-vegetables",
  "meat-poultry-fish",
  "bakery",
  "pantry",
  "beverages-juices",
  "cleaning",
  "toiletries",
  "frozen",
  "household",
  "skincare",
  "wine-bubbles",
];

const featured = CATEGORIES.filter((c) => FEATURED_SLUGS.includes(c.slug));

export function CategoryStrip({ className }: { className?: string }) {
  const { setOpen } = useCategoryPicker();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  }

  return (
    <section id="categories" className={cn("scroll-mt-20", className)}>
      <div className="mb-3 space-y-1 md:hidden">
        <p className="figma-eyebrow">Browse aisles</p>
        <p className="font-heading text-lg font-medium">Categories</p>
      </div>
      <div className="relative md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto pb-1 pr-12 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 rounded-full"
            onClick={() => setOpen(true)}
          >
            <LayoutGrid className="size-4 brand-green" />
            Choose category
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
          {featured.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Button
                key={category.slug}
                variant="outline"
                size="sm"
                className="shrink-0 rounded-full"
                render={<Link href={`/category/${category.slug}`} />}
              >
                <Icon className="size-4 brand-green" strokeWidth={2} />
                {category.name}
              </Button>
            );
          })}
        </div>
        <Button
          type="button"
          size="icon-sm"
          variant="outline"
          onClick={scrollNext}
          aria-label="Scroll categories"
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full shadow-sm"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="hidden md:block">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="figma-eyebrow">Browse aisles</p>
            <p className="font-heading text-lg font-medium">Categories</p>
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto px-0"
            onClick={() => setOpen(true)}
          >
            All categories
            <ChevronDown className="size-4" />
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group flex w-[88px] shrink-0 flex-col items-center gap-2.5 text-center"
              >
                <span className="flex size-14 items-center justify-center rounded-2xl border border-border bg-surface-soft text-foreground transition-colors group-hover:border-foreground/20 group-hover:bg-block-cream">
                  <Icon className="size-7" strokeWidth={1.5} />
                </span>
                <span className="line-clamp-2 text-xs font-medium leading-tight text-muted-foreground group-hover:text-foreground">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
