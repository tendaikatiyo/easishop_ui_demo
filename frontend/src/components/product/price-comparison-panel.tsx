"use client";

import Image from "next/image";
import { ExternalLink, Medal } from "lucide-react";
import {
  formatRand,
  getAvailablePrices,
  getBestValue,
  getSavingsPercent,
} from "@/lib/catalog";
import { getRetailerLogo } from "@/lib/retailers";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function PriceComparisonPanel({ product }: { product: Product }) {
  const prices = getAvailablePrices(product).sort((a, b) => a.price - b.price);
  const bestValue = getBestValue(product);
  const lowestId = prices[0]?.retailer;

  if (!prices.length) {
    return (
      <Card className="border-dashed py-8 text-center">
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No retailer prices available for this product right now.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="font-heading text-lg font-semibold">Compare prices</h2>
          <p className="text-sm text-muted-foreground">
            Tap + to add to your list, or buy from a store site.
          </p>
        </div>
        {bestValue?.unitPrice != null && bestValue.unitLabel ? (
          <Badge variant="secondary">
            Best value {formatRand(bestValue.unitPrice)}
            {bestValue.unitLabel.replace(/^R/, "")} at {bestValue.retailer}
          </Badge>
        ) : null}
      </div>

      <ul className="space-y-2">
        {prices.map((price) => {
          const isBest = price.retailer === lowestId;
          const savings = getSavingsPercent(price);
          const logo = getRetailerLogo(price.retailer);
          return (
            <li key={price.retailer}>
              <Card
                size="sm"
                className={cn(
                  "py-0",
                  isBest && "border-primary/30 bg-accent/50"
                )}
              >
                <CardContent className="flex items-center gap-3 py-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full border bg-background shadow-sm">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={price.retailer}
                        fill
                        className="object-contain p-2"
                        sizes="44px"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center px-1 text-center text-[9px] font-semibold leading-tight">
                        {price.retailer}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {isBest ? (
                        <Badge className="gap-1">
                          <Medal className="size-3" />
                          Lowest
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                      <span className="font-heading text-xl font-semibold">
                        {formatRand(price.price)}
                      </span>
                      {price.previousPrice && price.previousPrice > price.price ? (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatRand(price.previousPrice)}
                        </span>
                      ) : null}
                      {savings ? (
                        <span className="text-xs font-medium text-primary">
                          Save {savings}%
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {price.url ? (
                    <Button
                      size="sm"
                      variant={isBest ? "default" : "outline"}
                      render={
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
                        />
                      }
                    >
                      Buy
                      <ExternalLink className="size-3.5" />
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
