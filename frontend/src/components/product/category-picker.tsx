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
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
        side="bottom"
        className="max-h-[85vh] rounded-t-2xl md:mx-auto md:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-left">All categories</SheetTitle>
        </SheetHeader>
        <div className="relative px-4 pb-3">
          <Search className="absolute left-7 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories..."
            className="pl-9"
            autoFocus
          />
        </div>
        {filtered.length ? (
          <ul className="grid max-h-[52vh] grid-cols-2 gap-2 overflow-y-auto px-4 pb-6 sm:grid-cols-3">
            {filtered.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              return (
                <li key={category.slug}>
                  <Card
                    size="sm"
                    className="py-0 transition-colors hover:border-foreground/20 hover:bg-surface-soft"
                  >
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="block"
                    >
                      <CardContent className="flex items-center gap-2.5 py-3">
                        <Icon className="size-4 shrink-0 brand-green" strokeWidth={2} />
                        <span className="text-sm font-medium leading-snug">
                          {category.name}
                        </span>
                      </CardContent>
                    </Link>
                  </Card>
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
