"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function ProductViewTracker({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  useEffect(() => {
    track("view_product", { productId, productName });
  }, [productId, productName]);
  return null;
}
