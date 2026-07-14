"use client";

import Image from "next/image";
import Link from "next/link";
import {
  formatRand,
  getLowestPrice,
  getSavingsAmount,
} from "@/lib/catalog";
import { getRetailerLogo } from "@/lib/retailers";
import { AddToListButton } from "@/components/product/add-to-list-button";
import { DealBadge } from "@/components/product/deal-badge";
import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const lowest = getLowestPrice(product);
  const savingsAmount = Math.max(
    ...product.prices.map((p) => getSavingsAmount(p) ?? 0)
  );
  const wasPrice =
    lowest?.previousPrice && lowest.previousPrice > lowest.price
      ? lowest.previousPrice
      : null;

  return (
    <article
      className={cn(
        "@container group relative flex flex-col rounded-[32px] border border-card bg-card p-3 ring-1 ring-card md:rounded-[40px]",
        "transition-colors hover:bg-card"
      )}
    >
      <div className="relative pr-2 pt-2">
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden rounded-3xl bg-white md:rounded-[28px]">
            <ProductImage
              src={product.image}
              alt={product.name}
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <DealBadge
              amount={savingsAmount}
              className="absolute left-3 top-3"
            />
          </div>
        </Link>

        <div className="absolute right-0 top-0 rounded-full bg-card p-1">
          <AddToListButton
            productId={product.id}
            productName={product.name}
          />
        </div>
      </div>

      <Link href={`/product/${product.id}`} className="flex flex-col gap-2.5">
        <div className="flex items-start gap-2 px-1">
          {lowest?.retailer && getRetailerLogo(lowest.retailer) ? (
            <span
              className="relative mt-px size-5 shrink-0 overflow-hidden rounded-full border border-border bg-white"
              title={lowest.retailer}
            >
              <Image
                src={getRetailerLogo(lowest.retailer)!}
                alt={lowest.retailer}
                fill
                className="object-cover"
                sizes="20px"
              />
            </span>
          ) : null}
          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground/75">
            {product.name}
          </p>
        </div>

        {lowest ? (
          <div className="flex items-baseline justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-[var(--brand-green)] px-4 py-2.5 text-center text-sm font-medium text-white">
            <span className="font-accent tracking-tight">
              {formatRand(lowest.price)}
            </span>
            {wasPrice ? (
              <span className="hidden font-accent tracking-tight text-white/60 line-through @[11rem]:inline">
                {formatRand(wasPrice)}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="rounded-full bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
            Price unavailable
          </div>
        )}
      </Link>
    </article>
  );
}
