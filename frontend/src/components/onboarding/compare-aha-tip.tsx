"use client";

import { useEffect, useState } from "react";
import { X } from "reicon-react";
import { track } from "@/lib/analytics";
import { hasSeenCompareAha, markCompareAhaSeen } from "@/lib/onboarding";
import { cn } from "@/lib/utils";

/** Layer 2 — one-time tip when a product has multiple available prices. */
export function CompareAhaTip({
  productId,
  priceCount,
  className,
}: {
  productId: string;
  priceCount: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (priceCount < 2 || hasSeenCompareAha()) return;
    setVisible(true);
    track("onboard_aha_compare", { productId, action: "shown" });
  }, [productId, priceCount]);

  if (!visible) return null;

  function dismiss() {
    markCompareAhaSeen();
    setVisible(false);
    track("onboard_aha_compare", { productId, action: "dismissed" });
  }

  return (
    <div
      role="status"
      className={cn(
        "flex items-start gap-3 rounded-[28px] bg-[var(--brand-green-light)]/70 px-4 py-3 text-sm text-foreground",
        className
      )}
    >
      <p className="min-w-0 flex-1 leading-snug">
        Lowest price is highlighted — tap{" "}
        <span className="font-medium">Buy</span> to open the store site, or{" "}
        <span className="font-medium">+</span> to save it to a list.
      </p>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss tip"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white/80 text-foreground/60 transition-colors hover:bg-white hover:text-foreground"
      >
        <X size={14} strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}
