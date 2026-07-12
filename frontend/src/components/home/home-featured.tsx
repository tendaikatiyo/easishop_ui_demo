import { ProductCard } from "@/components/product/product-card";
import { getFeaturedProducts } from "@/lib/products";

export async function HomeFeatured() {
  const featured = await getFeaturedProducts(8);

  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <p className="figma-eyebrow">Trending staples</p>
        <h2 className="font-heading text-2xl font-medium md:text-3xl">
          Popular right now
        </h2>
        <p className="text-sm font-light text-foreground">
          Everyday staples people compare most.
        </p>
      </div>
      {featured.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="figma-block bg-surface-soft text-center text-sm">
          Search for a product to start comparing prices.
        </div>
      )}
    </section>
  );
}
