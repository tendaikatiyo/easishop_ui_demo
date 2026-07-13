"use client";

import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Search } from "lucide-react";
import { CATEGORIES, getCategoryIcon } from "@/lib/catalog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type CategoryPickerContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
};

const CategoryPickerContext = createContext<CategoryPickerContextValue | null>(
  null
);

export function CategoryPickerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((current) => !current), []);

  const value = useMemo(
    () => ({ open, setOpen, toggle }),
    [open, toggle]
  );

  return (
    <CategoryPickerContext.Provider value={value}>
      {children}
      <CategoryPickerSheet open={open} onOpenChange={setOpen} />
    </CategoryPickerContext.Provider>
  );
}

export function useCategoryPicker() {
  const context = useContext(CategoryPickerContext);
  if (!context) {
    throw new Error("useCategoryPicker must be used within CategoryPickerProvider");
  }
  return context;
}

function CategoryPickerSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) setQuery("");
      }}
    >
      <SheetContent
        side={isDesktop ? "left" : "bottom"}
        className={
          isDesktop
            ? "w-full max-w-md"
            : "max-h-[85vh]"
        }
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-left">All categories</SheetTitle>
        </SheetHeader>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search categories..."
              className="rounded-full pl-9"
            />
          </div>
        </div>
        {filtered.length ? (
          <ul className="grid max-h-[52vh] grid-cols-3 gap-1 overflow-y-auto px-3 pb-6 md:max-h-none md:min-h-0 md:flex-1 md:content-start">
            {filtered.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              return (
                <li key={category.slug}>
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={() => onOpenChange(false)}
                    className="group flex h-full flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center transition-colors hover:bg-surface-soft active:bg-surface-soft"
                  >
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-surface-soft transition-colors group-hover:bg-block-cream">
                      <Icon className="size-5 text-foreground" strokeWidth={1.75} />
                    </span>
                    <span className="line-clamp-2 text-xs font-medium leading-tight text-foreground/80 group-hover:text-foreground">
                      {category.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="px-4 pb-6 text-center text-sm text-muted-foreground">
            No categories match &ldquo;{query}&rdquo;
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
