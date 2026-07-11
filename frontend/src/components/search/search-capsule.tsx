"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ScanBarcode, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { BarcodeScanner } from "@/components/search/barcode-scanner";

export function SearchCapsule({
  initialQuery = "",
  autoFocus = false,
  className,
}: {
  initialQuery?: string;
  autoFocus?: boolean;
  className?: string;
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
          "flex items-center gap-2 rounded-[28px] border border-hairline bg-white px-3 py-1.5 shadow-sm focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20",
          className
        )}
      >
        <Search className="ml-1 size-5 shrink-0 text-mute" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you shopping for?"
          autoFocus={autoFocus}
          className="h-11 border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="shrink-0 rounded-full text-brand"
          aria-label="Scan barcode"
          onClick={() => setScanOpen(true)}
        >
          <ScanBarcode className="size-5" />
        </Button>
        <Button
          type="submit"
          className="hidden rounded-full bg-brand px-5 hover:bg-brand/90 sm:inline-flex"
        >
          Search
        </Button>
      </form>
      <BarcodeScanner open={scanOpen} onOpenChange={setScanOpen} />
    </>
  );
}
