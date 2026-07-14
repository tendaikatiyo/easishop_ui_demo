"use client";

import { SearchMinus } from "reicon-react";
import { PopularSearchPills } from "@/components/search/search-empty-state";

export function SearchNoMatches() {
  return (
    <div className="rounded-[32px] bg-white px-6 py-14 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-surface-soft">
        <SearchMinus
          size={24}
          className="text-muted-foreground"
          aria-hidden
        />
      </div>
      <h2 className="mt-4 font-heading text-xl font-medium">No matches</h2>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
        Try another name, check the spelling, or start from one of these.
      </p>
      <div className="mt-6">
        <PopularSearchPills />
      </div>
    </div>
  );
}
