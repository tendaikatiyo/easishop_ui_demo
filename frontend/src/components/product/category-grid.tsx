import Link from "next/link";
import { CATEGORIES, getCategoryIcon } from "@/lib/catalog";
import { cn } from "@/lib/utils";

const accents = [
  "bg-[#e8f5ef] text-primary",
  "bg-[#f0f4ff] text-[#3b5bcc]",
  "bg-[#fff6e8] text-[#b86a1a]",
  "bg-[#f8eef5] text-[#9b3d7a]",
  "bg-[#eef8f4] text-[#1b8056]",
  "bg-[#f3f1ff] text-[#5b4db8]",
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
      {items.map((category, index) => {
        const Icon = getCategoryIcon(category.slug);
        return (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className={cn(
              "flex items-center gap-3 rounded-xl border border-border px-3 py-3.5 text-sm font-medium text-foreground transition-transform hover:-translate-y-0.5 hover:border-primary/30",
              accents[index % accents.length].split(" ")[0]
            )}
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                accents[index % accents.length]
              )}
            >
              <Icon className="size-5" strokeWidth={2} />
            </span>
            <span className="leading-snug">{category.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
