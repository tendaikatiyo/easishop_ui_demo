import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { HeartButton } from "@/components/product/heart-button";
import { PriceComparisonPanel } from "@/components/product/price-comparison-panel";
import { formatRand, getLowestPrice } from "@/lib/catalog";
import { getProductById } from "@/lib/products";
import { ProductViewTracker } from "./product-tracker";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const lowest = getLowestPrice(product);

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          {
            label: product.category,
            href: `/category/${product.categorySlug}`,
          },
          { label: product.name },
        ]}
      />
      <ProductViewTracker productId={product.id} productName={product.name} />

      {/* Mobile: price-first, compact image */}
      <div className="md:hidden space-y-5">
        <div className="flex gap-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="font-heading text-lg font-semibold leading-snug">
                {product.name}
              </h1>
              <HeartButton
                productId={product.id}
                productName={product.name}
              />
            </div>
            {lowest ? (
              <p className="mt-1 text-sm">
                <span className="font-heading text-xl font-bold text-primary">
                  {formatRand(lowest.price)}
                </span>
                <span className="text-muted-foreground"> lowest at {lowest.retailer}</span>
              </p>
            ) : null}
          </div>
        </div>
        <PriceComparisonPanel product={product} />
      </div>

      {/* Desktop: efficient two-column */}
      <div className="hidden gap-8 md:grid md:grid-cols-[280px_1fr]">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              sizes="280px"
              priority
            />
          </div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="font-heading text-2xl font-semibold leading-tight">
                {product.name}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
            </div>
            <HeartButton productId={product.id} productName={product.name} />
          </div>
        </div>
        <PriceComparisonPanel product={product} />
      </div>
    </div>
  );
}
