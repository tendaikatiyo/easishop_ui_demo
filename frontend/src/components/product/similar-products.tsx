import { ProductCard } from "@/components/product/product-card";
import { searchProducts } from "@/lib/products";
import type { Product } from "@/types";

export async function SimilarProducts({ product }: { product: Product }) {
  const query = product.name.split(" ")[0] ?? product.name;
  const results = await searchProducts(query);
  const similar = results.filter((p) => p.id !== product.id).slice(0, 4);

  if (!similar.length) return null;

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="figma-eyebrow">Keep browsing</p>
        <h2 className="font-heading text-xl font-medium md:text-2xl">
          Similar products
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
        {similar.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
