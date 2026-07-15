"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { ArrowUpRight2, ChevronRight, Medal } from "reicon-react";
import {
  checkedPartnersSentence,
  coverageNoteLabel,
  formatRand,
  getBestValue,
  getPriceCoverage,
  getSavingsAmount,
} from "@/lib/catalog";
import { getRetailerLogo } from "@/lib/retailers";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DealBadge } from "@/components/product/deal-badge";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function PriceComparisonPanel({ product }: { product: Product }) {
  const { available: prices, unavailable, checkedCount } =
    getPriceCoverage(product);
  const bestValue = getBestValue(product);
  const hasLowest =
    prices.length > 1 && prices[0].price < prices[prices.length - 1].price;
  const lowestPrice = hasLowest ? prices[0].price : null;
  const [coverageOpen, setCoverageOpen] = useState(false);
  const coveragePanelId = useId();

  if (!prices.length) {
    return (
      <Card className="border-dashed py-8 text-center">
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            No retailer prices available for this product right now.
          </p>
          <p className="text-sm text-muted-foreground">
            {checkedPartnersSentence()}
          </p>
        </CardContent>
      </Card>
    );
  }

  const showCoverage = unavailable.length > 0;

  function toggleCoverage() {
    const next = !coverageOpen;
    setCoverageOpen(next);
    track("toggle_unavailable_retailers", {
      productId: product.id,
      expanded: next,
      unavailableCount: unavailable.length,
      unavailableRetailers: unavailable.map((r) => r.apiName),
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2">
        <div>
          <h2 className="font-heading text-lg font-semibold">Compare prices</h2>
          <p className="text-sm text-muted-foreground">
            Tap + to add to a list, or buy from a store site.
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
          const isBest = lowestPrice != null && price.price === lowestPrice;
          const savings = getSavingsAmount(price);
          const logo = getRetailerLogo(price.retailer);
          return (
            <li key={price.retailer}>
              <Card
                size="sm"
                className={cn("py-0", isBest && "bg-accent/60")}
              >
                <CardContent className="flex items-center gap-3 py-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full border bg-background shadow-sm">
                    {logo ? (
                      <Image
                        src={logo}
                        alt={price.retailer}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center px-1 text-center text-[9px] font-semibold leading-tight">
                        {price.retailer}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    {isBest ? (
                      <Badge className="gap-1">
                        <Medal size={14} aria-hidden />
                        Lowest
                      </Badge>
                    ) : null}
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-2">
                      <span className="font-accent text-xl font-medium tracking-tight">
                        {formatRand(price.price)}
                      </span>
                      {price.previousPrice &&
                      price.previousPrice > price.price ? (
                        <span className="font-accent text-sm tracking-tight text-muted-foreground line-through">
                          {formatRand(price.previousPrice)}
                        </span>
                      ) : null}
                      {savings ? <DealBadge amount={savings} /> : null}
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
                      <ArrowUpRight2 size={14} aria-hidden />
                    </Button>
                  ) : null}
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>

      {showCoverage ? (
        <div className="space-y-1">
          <button
            type="button"
            onClick={toggleCoverage}
            aria-expanded={coverageOpen}
            aria-controls={coveragePanelId}
            className="flex min-h-11 w-full items-center gap-2 rounded-2xl px-1 py-2 text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronRight
              size={16}
              aria-hidden
              className={cn(
                "shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
                coverageOpen && "rotate-90"
              )}
            />
            <span className="min-w-0 truncate">
              {coverageNoteLabel(unavailable, checkedCount)}
            </span>
          </button>

          <div
            id={coveragePanelId}
            className={cn(
              "grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:duration-150",
              coverageOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="space-y-2 pb-1 pl-1">
                <p className="text-xs text-muted-foreground">
                  No live price from these stores right now.
                </p>
                <ul className="space-y-1.5">
                  {unavailable.map((retailer) => {
                    const logo = retailer.logo;
                    return (
                      <li
                        key={retailer.slug}
                        className="flex min-h-11 items-center gap-3 rounded-2xl px-1 py-1.5"
                      >
                        <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-border/60 bg-zinc-50 opacity-60">
                          <Image
                            src={logo}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        </div>
                        <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                          {retailer.name}
                        </span>
                        <span className="shrink-0 text-sm text-muted-foreground">
                          Unavailable
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
