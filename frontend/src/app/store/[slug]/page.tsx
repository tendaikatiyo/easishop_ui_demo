import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { BrowseSearchLink } from "@/components/search/browse-search-link";
import { Button } from "@/components/ui/button";
import { getProductsByRetailer } from "@/lib/products";
import { getRetailerBySlug } from "@/lib/retailers";

export const dynamic = "force-dynamic";

export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const store = getRetailerBySlug(slug);
  if (!store) notFound();

  const products = await getProductsByRetailer(store.apiName, 24);

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Stores", href: "/#stores" },
          { label: store.name },
        ]}
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 rounded-[32px] bg-white p-5 shadow-xs md:p-6 sm:min-w-0 sm:flex-1">
          <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-zinc-100 shadow-sm md:size-20">
            <Image
              src={store.logo}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </span>
          <div className="min-w-0 space-y-1">
            <h1 className="font-heading text-2xl font-semibold md:text-3xl">
              {store.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {store.blurb}. Prices compared with other stores on each product.
            </p>
          </div>
        </div>
        <BrowseSearchLink className="w-full sm:w-auto sm:min-w-[14rem] md:hidden" />
      </div>

      {products.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] bg-white px-6 py-14 text-center">
          <h2 className="font-heading text-xl font-medium">
            Nothing from {store.name} right now
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            We couldn&apos;t load prices for this store. Try searching, or check
            another retailer.
          </p>
          <Button
            className="mt-6 h-11 rounded-full px-6"
            render={<Link href="/search" />}
          >
            Search products
          </Button>
        </div>
      )}
    </div>
  );
}
