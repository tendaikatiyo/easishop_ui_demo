"use client";

import Image from "next/image";
import { SearchCapsule } from "@/components/search/search-capsule";
import { useReturningVisitor } from "@/hooks/use-returning-visitor";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80";

export function HomeHero() {
  const isReturning = useReturningVisitor();

  return (
    <section className="relative left-1/2 w-screen max-w-none -translate-x-1/2 -mt-6 overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={HERO_IMAGE}
          alt="Fresh groceries"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div
        className="absolute inset-0 [background:radial-gradient(120%_140%_at_0%_50%,rgba(10,56,37,0.97)_0%,rgba(15,79,52,0.9)_32%,rgba(21,102,68,0.55)_54%,rgba(27,128,86,0.12)_78%,transparent_95%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex min-h-[280px] w-full max-w-6xl flex-col justify-center px-4 py-10 md:min-h-[420px] md:py-16">
        <div className="w-full max-w-xl space-y-5 text-left md:space-y-6">
          <div className="space-y-3 md:space-y-4">
            <p className="font-accent text-[11px] font-normal uppercase tracking-[0.14em] text-white">
              {isReturning ? "Good to see you again" : "South Africa grocery prices"}
            </p>
            {isReturning ? (
              <>
                <h1 className="font-heading text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-5xl lg:text-[3.25rem]">
                  Welcome back
                  <span className="block text-[0.72em] font-normal text-white/90 md:hidden">
                    Find your best price
                  </span>
                  <span className="hidden md:inline">
                    <br />
                    <span className="text-white/90">Find your best price</span>
                  </span>
                </h1>
                <p className="max-w-md text-sm leading-relaxed text-white/80 md:text-base">
                  Find the best deals across South Africa&apos;s leading retailers.
                </p>
              </>
            ) : (
              <>
                <h1 className="font-heading text-4xl font-medium leading-[1.05] tracking-tight text-white md:text-5xl lg:text-[3.25rem]">
                  Search, compare, save
                  <span className="hidden md:inline">
                    <br />
                    <span className="text-white/90">
                      Find your next deal today
                    </span>
                  </span>
                </h1>
                <p className="max-w-md text-sm leading-relaxed text-white/80 md:text-base">
                  Compare prices across Checkers, Pick n Pay, Shoprite,
                  Woolworths and Dis-Chem — all in one search.
                </p>
              </>
            )}
          </div>
          <SearchCapsule
            variant="hero"
            className="w-full max-w-lg"
          />
        </div>
      </div>
    </section>
  );
}
