"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function CategoryViewTracker({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  useEffect(() => {
    track("view_category", { slug, name });
  }, [slug, name]);
  return null;
}
