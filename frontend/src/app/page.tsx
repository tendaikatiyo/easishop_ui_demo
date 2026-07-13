import { Suspense } from "react";
import { CategoryStrip } from "@/components/product/category-strip";
import { HomeDeals } from "@/components/home/home-deals";
import { HomeFeatured } from "@/components/home/home-featured";
import { HomeHero } from "@/components/home/home-hero";
import { HomeStores } from "@/components/home/home-stores";
import { ProductGridSkeleton } from "@/components/product/skeletons";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <HomeHero />

      <div className="space-y-12 pt-8 md:space-y-16 md:pt-12">
        <CategoryStrip />

        <Suspense fallback={<ProductGridSkeleton count={4} />}>
          <HomeDeals />
        </Suspense>

        <HomeStores />

        <Suspense fallback={<ProductGridSkeleton />}>
          <HomeFeatured />
        </Suspense>
      </div>
    </>
  );
}
