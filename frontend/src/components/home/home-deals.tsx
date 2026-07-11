import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { getDeals } from "@/lib/products";

export async function HomeDeals() {
  const deals = (await getDeals()).slice(0, 4);

  if (!deals.length) {
    return (
      <section className="figma-block space-y-5 bg-block-cream">
        <div className="space-y-1">
          <p className="figma-eyebrow">Price drops</p>
          <h2 className="font-heading text-2xl font-medium md:text-3xl">
            Top deals of the day
          </h2>
        </div>
        <div className="rounded-2xl border border-dashed border-foreground/15 bg-background/50 px-6 py-10 text-center text-sm">
          No price drops right now. Check back soon or browse categories.
        </div>
      </section>
    );
  }

  return (
    <section className="figma-block space-y-6 bg-block-cream">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="figma-eyebrow">Price drops</p>
          <h2 className="font-heading text-2xl font-medium md:text-3xl">
            Top deals of the day
          </h2>
          <p className="text-sm font-light">
            Prices that dropped — worth a look.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="h-auto rounded-full px-4"
          render={<Link href="/deals" />}
        >
          See all
          <ArrowRight className="size-4" />
        </Button>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {deals.map((product) => (
          <div key={product.id} className="w-[min(46vw,200px)] shrink-0 sm:w-[200px]">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
