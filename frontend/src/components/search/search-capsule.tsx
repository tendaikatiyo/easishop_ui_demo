"use client";

import { FormEvent, KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
// Barcode feature temporarily disabled
// import { ArrowRight, ScanBarcode } from "lucide-react";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  SearchSuggestPanel,
  type SearchSuggestion,
} from "@/components/search/search-suggest-panel";
// import { BarcodeScanner } from "@/components/search/barcode-scanner";
import { startPageTransition } from "@/components/layout/navigation-loader";

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
  const listboxId = useId();
  const blurTimer = useRef<number | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [query, setQuery] = useState(initialQuery);
  // const [scanOpen, setScanOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [queries, setQueries] = useState(SAMPLE_QUERIES);
  const [index, setIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loadingSuggest, setLoadingSuggest] = useState(false);

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

  useEffect(() => {
    if (!isDesktop) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const q = query.trim();
    if (q.length < 2 || !focused) {
      setSuggestions([]);
      setActiveIndex(-1);
      setLoadingSuggest(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoadingSuggest(true);
      try {
        const res = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error("suggest failed");
        const data = (await res.json()) as { suggestions?: SearchSuggestion[] };
        setSuggestions(data.suggestions ?? []);
        setActiveIndex(-1);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setSuggestions([]);
      } finally {
        setLoadingSuggest(false);
      }
    }, 160);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, focused, isDesktop]);

  useEffect(() => {
    return () => {
      if (blurTimer.current) window.clearTimeout(blurTimer.current);
    };
  }, []);

  function goSearch(raw: string) {
    const q = raw.trim();
    if (!q) return;
    track("search", { query: q, method: "text" });
    setSuggestions([]);
    setFocused(false);
    startPageTransition();
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      goSearch(suggestions[activeIndex].name);
      return;
    }
    goSearch(query);
  }

  function onSelectSuggestion(suggestion: SearchSuggestion) {
    setQuery(suggestion.name);
    track("search", {
      query: suggestion.name,
      method: "suggest",
      productId: suggestion.id,
    });
    setSuggestions([]);
    setFocused(false);
    startPageTransition();
    router.push(`/search?q=${encodeURIComponent(suggestion.name)}`);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!isDesktop || !suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  }

  const showFlicker = !focused && !query;
  const sample = queries[index % queries.length];
  const showSuggestions =
    isDesktop && focused && query.trim().length >= 2 && suggestions.length > 0;

  return (
    <>
      <div className={cn("relative", className)}>
        <form
          onSubmit={onSubmit}
          className={cn(
            "glass-strong glass-pill flex items-center gap-2 px-2",
            variant === "hero"
              ? "h-12 focus-within:ring-2 focus-within:ring-white/55"
              : "focus-within:ring-2 focus-within:ring-foreground/10"
          )}
          aria-expanded={showSuggestions}
          aria-owns={showSuggestions ? listboxId : undefined}
        >
          <Search
            size={20}
            aria-hidden
            className="ml-1 shrink-0 text-foreground/55"
          />
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
              aria-label={
                showFlicker ? `Search, for example ${sample}` : "Search"
              }
              aria-autocomplete="list"
              aria-controls={showSuggestions ? listboxId : undefined}
              aria-activedescendant={
                showSuggestions && activeIndex >= 0
                  ? `${listboxId}-opt-${activeIndex}`
                  : undefined
              }
              autoFocus={autoFocus}
              autoComplete="off"
              onFocus={() => {
                if (blurTimer.current) {
                  window.clearTimeout(blurTimer.current);
                  blurTimer.current = null;
                }
                setFocused(true);
              }}
              onBlur={() => {
                blurTimer.current = window.setTimeout(() => {
                  setFocused(false);
                  setActiveIndex(-1);
                }, 140);
              }}
              onKeyDown={onKeyDown}
              className={cn(
                "relative z-10 border-0 bg-transparent shadow-none focus-visible:ring-0",
                variant === "hero" ? "h-11" : "h-10"
              )}
            />
          </div>
          {/* Barcode feature temporarily disabled
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
            <ScanBarcode size={16} aria-hidden />
          </Button>
          */}
          {variant === "hero" ? (
            <Button
              type="submit"
              size="icon"
              className="size-9 shrink-0 cursor-pointer rounded-full glass-dark"
              aria-label="Search"
            >
              <ArrowRight size={16} aria-hidden />
            </Button>
          ) : (
            <Button
              type="submit"
              size="sm"
              className="hidden cursor-pointer sm:inline-flex"
            >
              Search
            </Button>
          )}
        </form>

        {showSuggestions ? (
          <SearchSuggestPanel
            id={listboxId}
            query={query}
            suggestions={suggestions}
            activeIndex={activeIndex}
            onHover={setActiveIndex}
            onSelect={onSelectSuggestion}
          />
        ) : null}
      </div>
      {/* <BarcodeScanner open={scanOpen} onOpenChange={setScanOpen} /> */}
    </>
  );
}
