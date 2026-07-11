"use client";

import { ExternalLink, Medal } from "lucide-react";
import { formatRand, getAvailablePrices, getBestValue, getSavingsPercent } from "@/lib/catalog";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function PriceComparisonPanel({ product }: { product: Product }) {
  const prices = getAvailablePrices(product).sort((a, b) => a.price - b.price);
  const bestValue = getBestValue(product);
  const lowestId = prices[0]?.retailer;

  if (!prices.length) {
    return (
      <p className="rounded-lg border border-dashed border-hairline p-6 text-center text-sm text-mute">
        No retailer prices available for this product right now.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="font-heading text-lg font-semibold text-ink">
            Compare prices
          </h2>
          <p className="text-sm text-mute">
            Only stores that stock this item are shown.
          </p>
        </div>
        {bestValue?.unitPrice != null && bestValue.unitLabel ? (
          <Badge variant="secondary" className="bg-brand-soft text-brand">
            Best value {formatRand(bestValue.unitPrice)}
            {bestValue.unitLabel.replace(/^R/, "")} at {bestValue.retailer}
          </Badge>
        ) : null}
      </div>

      <ul className="space-y-2 animate-stagger">
        {prices.map((price) => {
          const isBest = price.retailer === lowestId;
          const savings = getSavingsPercent(price);
          return (
            <li
              key={price.retailer}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-3 py-3",
                isBest
                  ? "border-brand/40 bg-brand-soft/60"
                  : "border-hairline bg-white"
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-ink">{price.retailer}</p>
                  {isBest ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[11px] font-medium text-white">
                      <Medal className="size-3" />
                      Lowest
                    </span>
                  ) : null}
                </div>
                <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                  <span className="font-heading text-xl font-semibold text-ink">
                    {formatRand(price.price)}
                  </span>
                  {price.previousPrice && price.previousPrice > price.price ? (
                    <span className="text-sm text-mute line-through">
                      {formatRand(price.previousPrice)}
                    </span>
                  ) : null}
                  {savings ? (
                    <span className="text-xs font-medium text-brand">
                      Save {savings}%
                    </span>
                  ) : null}
                  {price.unitPrice != null && price.unitLabel ? (
                    <span className="text-xs text-mute">
                      {formatRand(price.unitPrice)}
                      {price.unitLabel.replace(/^R/, "")}
                    </span>
                  ) : null}
                </div>
              </div>
              {price.url ? (
                <a
                  href={price.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("open_retailer", {
                      productId: product.id,
                      retailer: price.retailer,
                    })
                  }
                  className={cn(
                    "inline-flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-sm font-medium",
                    isBest
                      ? "border-transparent bg-brand text-white hover:bg-brand/90"
                      : "border-border bg-white hover:bg-muted"
                  )}
                >
                  Visit
                  <ExternalLink className="size-3.5" />
                </a>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
