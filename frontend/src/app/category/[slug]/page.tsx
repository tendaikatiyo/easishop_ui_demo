import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductCard } from "@/components/product/product-card";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/products";
import { CategoryViewTracker } from "./category-tracker";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const products = getProductsByCategory(slug);

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/#categories" },
          { label: category.name },
        ]}
      />
      <CategoryViewTracker slug={slug} name={category.name} />
      <div>
        <h1 className="font-heading text-2xl font-semibold">{category.name}</h1>
        <p className="text-sm text-mute">
          {products.length
            ? `${products.length} products to compare`
            : "No demo products in this category yet — try another aisle."}
        </p>
      </div>
      {products.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-hairline px-6 py-16 text-center text-sm text-mute">
          We&apos;ll fill this aisle as we expand the demo catalogue.
        </div>
      )}
    </div>
  );
}
