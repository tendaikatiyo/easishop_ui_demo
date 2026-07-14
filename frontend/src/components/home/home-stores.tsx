"use client";

import Image from "next/image";
import Link from "next/link";
import { RETAILERS } from "@/lib/retailers";
import { useCategoryPicker } from "@/components/product/category-picker";
import { Button } from "@/components/ui/button";

export function HomeStores() {
  const { openBrowse } = useCategoryPicker();

  return (
    <section id="stores" className="scroll-mt-20 space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <p className="figma-eyebrow">Five stores</p>
          <h2 className="font-heading text-2xl font-medium md:text-3xl">
            Shop by store
          </h2>
          <p className="text-sm font-light text-foreground">
            Jump into a retailer and see what&apos;s priced right now.
          </p>
        </div>
        <Button
          variant="ghost"
          className="hidden h-10 shrink-0 rounded-full px-4 sm:inline-flex"
          onClick={() => openBrowse("stores")}
        >
          See all
        </Button>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        {RETAILERS.map((store) => (
          <li key={store.slug}>
            <Link
              href={`/store/${store.slug}`}
              className="group flex h-full flex-col items-center gap-3 rounded-[32px] bg-white p-5 text-center shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] md:p-6"
            >
              <span className="relative size-16 shrink-0 overflow-hidden rounded-full bg-zinc-100 shadow-sm md:size-[4.5rem]">
                <Image
                  src={store.logo}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              </span>
              <span className="block text-sm font-medium text-foreground">
                {store.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
