"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ScanBarcode2, Search } from "reicon-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { BarcodeScanner } from "@/components/search/barcode-scanner";

const SAMPLE_QUERIES = [
  "Milk",
  "Bread",
  "Eggs",
  "Chicken breast",
  "Coffee",
  "Rice",
  "Shampoo",
  "Yoghurt",
  "Washing powder",
  "Bananas",
  "Olive oil",
  "Toothpaste",
  "Cheddar cheese",
];

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

export function SearchCapsule({
  initialQuery = "",
  autoFocus = false,
  className,
  variant = "default",
}: {
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
  variant?: "default" | "hero";
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [scanOpen, setScanOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [queries, setQueries] = useState(SAMPLE_QUERIES);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setQueries(shuffle(SAMPLE_QUERIES));
  }, []);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (focused || query) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % queries.length);
    }, 2400);
    return () => window.clearInterval(id);
  }, [focused, query, queries.length]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    track("search", { query: q, method: "text" });
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const showFlicker = !focused && !query;
  const sample = queries[index % queries.length];

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={cn(
          "glass-strong glass-pill flex items-center gap-2 px-2",
          variant === "hero"
            ? "h-12 focus-within:ring-2 focus-within:ring-white/55"
            : "focus-within:ring-2 focus-within:ring-foreground/10",
          className
        )}
      >
        <Search size={20} aria-hidden className="ml-1 shrink-0 text-foreground/55" />
      <div className="relative min-w-0 flex-1">
          {showFlicker ? (
            <span
              key={sample}
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-base text-foreground/80 md:text-sm animate-placeholder-flicker"
            >
              {sample}
            </span>
          ) : null}
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder=""
            aria-label={showFlicker ? `Search, for example ${sample}` : "Search"}
            autoFocus={autoFocus}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={cn(
              "relative z-10 border-0 bg-transparent shadow-none focus-visible:ring-0",
              variant === "hero" ? "h-11" : "h-10"
            )}
          />
        </div>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className={cn(
            "shrink-0",
            variant === "hero" ? "text-foreground" : "text-primary"
          )}
          aria-label="Scan barcode"
          onClick={() => setScanOpen(true)}
        >
          <ScanBarcode2 size={16} aria-hidden />
        </Button>
        {variant === "hero" ? (
          <Button
            type="submit"
            size="icon"
            className="size-9 shrink-0 rounded-full glass-dark"
            aria-label="Search"
          >
            <ArrowRight size={16} aria-hidden />
          </Button>
        ) : (
          <Button type="submit" size="sm" className="hidden sm:inline-flex">
            Search
          </Button>
        )}
      </form>
      <BarcodeScanner open={scanOpen} onOpenChange={setScanOpen} />
    </>
  );
}
