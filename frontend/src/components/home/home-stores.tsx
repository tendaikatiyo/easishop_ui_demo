import Image from "next/image";
import Link from "next/link";
import { RETAILERS } from "@/lib/retailers";

export function HomeStores() {
  return (
    <section className="space-y-6">
      <div className="space-y-1">
        <p className="figma-eyebrow">Five stores</p>
        <h2 className="font-heading text-2xl font-medium md:text-3xl">
          Explore by store
        </h2>
        <p className="text-sm font-light text-foreground">
          Jump into a retailer and see what&apos;s priced right now.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        {RETAILERS.map((store) => (
          <li key={store.slug}>
            <Link
              href={`/store/${store.slug}`}
              className="group flex h-full flex-col items-center gap-3 rounded-[32px] bg-white p-5 text-center shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] md:p-6"
            >
              <span className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-zinc-100 shadow-sm md:size-[4.5rem]">
                <Image
                  src={store.logo}
                  alt=""
                  width={72}
                  height={72}
                  className="size-10 object-contain md:size-12"
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
