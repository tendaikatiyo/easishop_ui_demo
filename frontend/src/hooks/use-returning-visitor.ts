"use client";

import { useEffect, useState } from "react";
import { isReturningVisitor, markVisited } from "@/lib/storage";

export function useReturningVisitor() {
  const [isReturning] = useState(
    () => typeof window !== "undefined" && isReturningVisitor()
  );

  useEffect(() => {
    if (!isReturning) markVisited();
  }, [isReturning]);

  return isReturning;
}
