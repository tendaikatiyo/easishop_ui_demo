import Image from "next/image";
import Link from "next/link";
import { formatRand, getLowestPrice, getSavingsAmount } from "@/lib/catalog";
import type { Product } from "@/types";
import { HeartButton } from "@/components/product/heart-button";
import { DealBadge } from "@/components/product/deal-badge";
import { Card, CardContent } from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  const lowest = getLowestPrice(product);
  const savingsAmount = Math.max(
    ...product.prices.map((p) => getSavingsAmount(p) ?? 0)
  );

  return (
    <Card
      size="sm"
      className="group overflow-hidden rounded-2xl border-border bg-card py-0 shadow-none transition-colors hover:bg-surface-soft"
    >
      <Link href={`/product/${product.id}`} className="flex flex-col">
        <div className="relative aspect-square bg-surface-soft">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute right-2 top-2">
            <HeartButton productId={product.id} productName={product.name} />
          </div>
          <DealBadge amount={savingsAmount} className="absolute left-2 top-2" />
        </div>
        <CardContent className="flex flex-1 flex-col gap-1 pt-3">
          <p className="line-clamp-2 font-medium leading-snug">
            {product.name}
          </p>
          {lowest ? (
            <p className="mt-auto pt-2">
              <span className="font-accent text-base font-medium tracking-tight text-foreground/85">
                {formatRand(lowest.price)}
              </span>
            </p>
          ) : (
            <p className="mt-auto pt-2 text-sm text-muted-foreground">
              Price unavailable
            </p>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
