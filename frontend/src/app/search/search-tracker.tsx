"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function SearchTracker({
  query,
  scan,
}: {
  query: string;
  scan?: boolean;
}) {
  useEffect(() => {
    track("search", { query, method: scan ? "barcode" : "text" });
  }, [query, scan]);

  return null;
}
