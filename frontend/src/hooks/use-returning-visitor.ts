"use client";

import { useEffect, useState } from "react";
import { isReturningVisitor, markVisited } from "@/lib/storage";

/**
 * Returning-visitor flag from localStorage.
 * Always starts `false` so SSR and the first client render match, then
 * updates after mount (avoids hydration mismatches).
 */
export function useReturningVisitor() {
  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const returning = isReturningVisitor();
    setIsReturning(returning);
    markVisited();
  }, []);

  return isReturning;
}
