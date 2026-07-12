import { Suspense } from "react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { AddToListButton } from "@/components/product/add-to-list-button";
import { ProductImage } from "@/components/product/product-image";
import { PriceComparisonPanel } from "@/components/product/price-comparison-panel";
import { SimilarProducts } from "@/components/product/similar-products";
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

  const hasKnownCategory =
    product.categorySlug && product.categorySlug !== "general";

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          ...(hasKnownCategory
            ? [
                {
                  label: product.category,
                  href: `/category/${product.categorySlug}`,
                },
              ]
            : []),
          { label: product.name },
        ]}
      />
      <ProductViewTracker productId={product.id} productName={product.name} />

      {/* Mobile: price-first, compact image */}
      <div className="md:hidden space-y-5">
        <div className="flex gap-3">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-white">
            <ProductImage
              src={product.image}
              alt={product.name}
              className="object-contain p-1.5"
              sizes="80px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h1 className="font-heading text-lg font-semibold leading-snug">
                {product.name}
              </h1>
              <AddToListButton
                productId={product.id}
                productName={product.name}
              />
            </div>
          </div>
        </div>
        <PriceComparisonPanel product={product} />
      </div>

      {/* Desktop: efficient two-column */}
      <div className="hidden gap-8 md:grid md:grid-cols-[280px_1fr]">
        <div className="relative aspect-square overflow-hidden rounded-[32px] bg-white">
          <ProductImage
            src={product.image}
            alt={product.name}
            className="object-contain p-6"
            sizes="280px"
            priority
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-3xl font-semibold leading-tight">
                {product.name}
              </h1>
              {hasKnownCategory ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.category}
                </p>
              ) : null}
            </div>
            <AddToListButton productId={product.id} productName={product.name} />
          </div>
          <PriceComparisonPanel product={product} />
        </div>
      </div>

      <Suspense fallback={null}>
        <SimilarProducts product={product} />
      </Suspense>
    </div>
  );
}
