import Link from "next/link";
import { CATEGORIES } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const accents = [
  "bg-[#e8f5ef]",
  "bg-[#f0f4ff]",
  "bg-[#fff6e8]",
  "bg-[#f8eef5]",
  "bg-[#eef8f4]",
  "bg-[#f3f1ff]",
];

export function CategoryGrid({
  limit,
  className,
}: {
  limit?: number;
  className?: string;
}) {
  const items = limit ? CATEGORIES.slice(0, limit) : CATEGORIES;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
        className
      )}
    >
      {items.map((category, index) => (
        <Link
          key={category.slug}
          href={`/category/${category.slug}`}
          className={cn(
            "rounded-lg border border-hairline px-3 py-4 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5 hover:border-brand/30",
            accents[index % accents.length]
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
