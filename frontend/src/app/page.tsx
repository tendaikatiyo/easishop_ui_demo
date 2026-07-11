import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SearchCapsule } from "@/components/search/search-capsule";
import { CategoryGrid } from "@/components/product/category-grid";
import { ProductCard } from "@/components/product/product-card";
import { getDeals, getFeaturedProducts } from "@/lib/products";
export default function HomePage() {
  const featured = getFeaturedProducts(8);
  const deals = getDeals().slice(0, 4);

  return (
    <div className="space-y-10 animate-rise">
      <section className="relative overflow-hidden rounded-2xl border border-hairline">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80"
            alt="Fresh groceries"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/45 to-black/20" />
        </div>
        <div className="relative z-10 flex min-h-[340px] flex-col justify-end gap-5 p-6 md:min-h-[420px] md:p-10">
          <div className="max-w-xl space-y-3 text-white">
            <p className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
              EasiShop
            </p>
            <h1 className="font-heading text-2xl font-semibold leading-tight md:text-3xl">
              Know who&apos;s cheapest before you leave home.
            </h1>
            <p className="max-w-md text-sm text-white/85 md:text-base">
              Compare grocery prices across SA&apos;s big retailers, build your
              list, and shop with a plan.
            </p>
          </div>
          <SearchCapsule className="max-w-xl" />
        </div>
      </section>

      <section id="categories" className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-semibold">Shop by category</h2>
            <p className="text-sm text-mute">Pick an aisle and start comparing.</p>
          </div>
          <Link href="/search" className="text-sm font-medium text-brand hover:underline">
            All categories
          </Link>
        </div>
        <CategoryGrid />
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-xl font-semibold">Top deals</h2>
            <p className="text-sm text-mute">Prices that dropped — worth a look.</p>
          </div>
          <Link
            href="/deals"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline"
          >
            See all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {deals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="font-heading text-xl font-semibold">Popular right now</h2>
          <p className="text-sm text-mute">Everyday staples people compare most.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
