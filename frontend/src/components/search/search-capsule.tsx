"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ScanBarcode, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { BarcodeScanner } from "@/components/search/barcode-scanner";

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

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    track("search", { query: q, method: "text" });
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      <form
        onSubmit={onSubmit}
        className={cn(
          variant === "hero"
            ? "flex h-12 items-center gap-2 rounded-full border-0 bg-white px-2 shadow-lg ring-1 ring-black/5 focus-within:ring-2 focus-within:ring-white/40"
            : "flex items-center gap-2 rounded-lg border border-input bg-background px-2 ring-1 ring-foreground/5 focus-within:border-foreground focus-within:ring-2 focus-within:ring-foreground/10",
          className
        )}
      >
        <Search className="ml-1 size-4 shrink-0 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you shopping for?"
          autoFocus={autoFocus}
          className={cn(
            "border-0 bg-transparent shadow-none focus-visible:ring-0",
            variant === "hero" ? "h-11" : "h-10"
          )}
        />
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className={cn("shrink-0", variant === "hero" ? "text-foreground" : "text-primary")}
          aria-label="Scan barcode"
          onClick={() => setScanOpen(true)}
        >
          <ScanBarcode className="size-4" />
        </Button>
        {variant === "hero" ? (
          <Button
            type="submit"
            size="icon"
            className="size-9 shrink-0 rounded-full bg-foreground text-background hover:bg-foreground/90"
            aria-label="Search"
          >
            <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button type="submit" size="sm" className="hidden rounded-full sm:inline-flex">
            Search
          </Button>
        )}
      </form>
      <BarcodeScanner open={scanOpen} onOpenChange={setScanOpen} />
    </>
  );
}
