"use client";

import Link from "next/link";
import { Search } from "reicon-react";
import { cn } from "@/lib/utils";

/** Compact pivot to global Search from store/category browse pages. */
export function BrowseSearchLink({
  className,
  hint = "Search all stores",
}: {
  className?: string;
  hint?: string;
}) {
  return (
    <Link
      href="/search"
      className={cn(
        "glass glass-pill flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground/50 transition-colors hover:text-foreground/75",
        className
      )}
    >
      <Search size={16} aria-hidden className="shrink-0" />
      <span className="truncate">{hint}</span>
    </Link>
  );
}
