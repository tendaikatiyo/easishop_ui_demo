import Image from "next/image";
import { Suspense } from "react";
import { SearchCapsule } from "@/components/search/search-capsule";
import { CategoryStrip } from "@/components/product/category-strip";
import { HomeDeals } from "@/components/home/home-deals";
import { HomeFeatured } from "@/components/home/home-featured";
import { ProductGridSkeleton } from "@/components/product/skeletons";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80";

export default function HomePage() {
  return (
    <div className="space-y-12 md:space-y-16">
      <section className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Fresh groceries"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1152px"
          />
        </div>

        {/* Feather gradient from the left */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#14120f]/92 from-0% via-[#14120f]/72 via-45% to-transparent to-85%"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#14120f]/30 via-transparent to-transparent"
          aria-hidden
        />

        <div className="relative z-10 flex min-h-[340px] flex-col justify-center px-6 py-12 md:min-h-[400px] md:px-10 md:py-14 lg:px-12">
          <div className="w-full max-w-xl space-y-6 text-left">
            <div className="space-y-4">
              <p className="font-accent text-[11px] font-normal uppercase tracking-[0.14em] text-white/70">
                South Africa grocery prices
              </p>
              <h1 className="font-heading text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-5xl lg:text-[3.25rem]">
                Search, compare, save
                <br />
                <span className="text-white/90">Find your next deal today</span>
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-white/75 md:text-base">
                Compare prices across Checkers, Pick n Pay, Shoprite, Woolworths
                and Dis-Chem — all in one search.
              </p>
            </div>
            <SearchCapsule variant="hero" className="w-full max-w-lg" />
          </div>
        </div>
      </section>

      <CategoryStrip />

      <Suspense fallback={<ProductGridSkeleton count={4} />}>
        <HomeDeals />
      </Suspense>

      <Suspense fallback={<ProductGridSkeleton />}>
        <HomeFeatured />
      </Suspense>
    </div>
  );
}
