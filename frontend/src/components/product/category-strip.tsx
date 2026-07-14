"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronDown, ChevronRight, Grid } from "reicon-react";
import { CATEGORIES } from "@/lib/catalog";
import { getCategoryIcon } from "@/components/product/category-icons";
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
  const { openBrowse } = useCategoryPicker();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollNext() {
    scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" });
  }

  return (
    <section id="categories" className={cn("scroll-mt-20", className)}>
      <div className="mb-4 space-y-1 md:hidden">
        <p className="figma-eyebrow">Shop by aisle</p>
        <p className="font-heading text-xl font-medium">Categories</p>
      </div>
      <div className="relative md:hidden">
        <div
          ref={scrollRef}
          className="flex gap-2.5 overflow-x-auto pb-1.5 pr-16 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button
            type="button"
            onClick={() => openBrowse("aisles")}
            className="glass-dark flex shrink-0 items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-medium text-white transition-transform active:scale-[0.97]"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
              <Grid size={16} className="text-white" aria-hidden />
            </span>
            All categories
            <ChevronDown size={16} className="-ml-1 text-white/70" aria-hidden />
          </button>
          {featured.map((category) => {
            const Icon = getCategoryIcon(category.slug);
            return (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="glass glass-pill flex shrink-0 items-center gap-2.5 py-1.5 pl-1.5 pr-4 text-sm font-medium text-foreground transition-all active:scale-[0.97]"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-[var(--brand-green-light)]">
                  <Icon size={16} className="brand-green" aria-hidden />
                </span>
                {category.name}
              </Link>
            );
          })}
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent"
          aria-hidden
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          onClick={scrollNext}
          aria-label="Scroll categories"
          className="!absolute right-0 top-1/2 z-20 size-9 !-translate-y-1/2 rounded-full border-white/70 bg-white/85 shadow-sm backdrop-blur-md"
        >
          <ChevronRight size={16} aria-hidden />
        </Button>
      </div>

      <div className="hidden md:block">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div className="space-y-1">
            <p className="figma-eyebrow">Shop by aisle</p>
            <p className="font-heading text-xl font-medium">Categories</p>
          </div>
          <Button
            type="button"
            variant="link"
            size="sm"
            className="h-auto px-0"
            onClick={() => openBrowse("aisles")}
          >
            All categories
            <ChevronDown size={16} aria-hidden />
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
                <span className="flex size-14 items-center justify-center rounded-2xl bg-surface-soft text-foreground transition-colors group-hover:bg-block-cream">
                  <Icon size={28} strokeWidth={1.5} aria-hidden />
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
