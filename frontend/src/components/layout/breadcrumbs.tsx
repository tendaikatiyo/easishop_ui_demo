import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-1 text-sm text-mute">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 ? <ChevronRight className="size-3.5 shrink-0" /> : null}
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="rounded-sm hover:text-brand transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "font-medium text-ink" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
