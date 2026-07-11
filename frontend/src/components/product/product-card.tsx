import Image from "next/image";
import Link from "next/link";
import { formatRand, getLowestPrice } from "@/lib/catalog";
import type { Product } from "@/types";
import { HeartButton } from "@/components/product/heart-button";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const lowest = getLowestPrice(product);
  const hasDeal = product.prices.some(
    (p) => p.previousPrice != null && p.previousPrice > p.price
  );

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-hairline bg-white transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-square bg-surface-warm">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute right-2 top-2">
          <HeartButton productId={product.id} productName={product.name} />
        </div>
        {hasDeal ? (
          <Badge className="absolute left-2 top-2 bg-brand text-white hover:bg-brand">
            Deal
          </Badge>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-sm font-medium text-ink leading-snug">
          {product.name}
        </p>
        <p className="text-xs text-mute">{product.category}</p>
        {lowest ? (
          <p className="mt-auto pt-2">
            <span className="text-xs text-mute">from </span>
            <span className="font-heading text-base font-semibold text-brand">
              {formatRand(lowest.price)}
            </span>
            <span className="text-xs text-mute"> at {lowest.retailer}</span>
          </p>
        ) : (
          <p className="mt-auto pt-2 text-sm text-mute">Price unavailable</p>
        )}
      </div>
    </Link>
  );
}
