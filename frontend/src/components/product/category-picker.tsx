"use client";

import Image from "next/image";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Search } from "reicon-react";
import { CATEGORIES } from "@/lib/catalog";
import { RETAILERS } from "@/lib/retailers";
import { getCategoryIcon } from "@/components/product/category-icons";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export type BrowseTab = "aisles" | "stores";

type BrowsePickerContextValue = {
  open: boolean;
  tab: BrowseTab;
  setOpen: (open: boolean) => void;
  openBrowse: (tab?: BrowseTab) => void;
  toggle: () => void;
};

const BrowsePickerContext = createContext<BrowsePickerContextValue | null>(
  null
);

export function CategoryPickerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<BrowseTab>("stores");

  const openBrowse = useCallback((nextTab: BrowseTab = "stores") => {
    setTab(nextTab);
    setOpen(true);
  }, []);

  const toggle = useCallback(() => {
    setOpen((current) => {
      if (!current) setTab("stores");
      return !current;
    });
  }, []);

  const value = useMemo(
    () => ({ open, tab, setOpen, openBrowse, toggle }),
    [open, tab, openBrowse, toggle]
  );

  return (
    <BrowsePickerContext.Provider value={value}>
      {children}
      <BrowsePickerSheet
        open={open}
        tab={tab}
        onTabChange={setTab}
        onOpenChange={setOpen}
      />
    </BrowsePickerContext.Provider>
  );
}

export function useCategoryPicker() {
  const context = useContext(BrowsePickerContext);
  if (!context) {
    throw new Error(
      "useCategoryPicker must be used within CategoryPickerProvider"
    );
  }
  return context;
}

/** @deprecated alias — prefer useCategoryPicker / openBrowse */
export const useBrowsePicker = useCategoryPicker;

function BrowsePickerSheet({
  open,
  tab,
  onTabChange,
  onOpenChange,
}: {
  open: boolean;
  tab: BrowseTab;
  onTabChange: (tab: BrowseTab) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const filteredStores = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return RETAILERS;
    return RETAILERS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) || s.blurb.toLowerCase().includes(q)
    );
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
        className={isDesktop ? "w-full max-w-md" : "max-h-[85vh]"}
      >
        <SheetHeader>
          <SheetTitle className="font-heading text-left">
            {tab === "stores" ? "Stores" : "Aisles"}
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-3 px-4 pb-3">
          <div className="grid grid-cols-2 gap-1 rounded-full bg-zinc-100 p-1">
            {(
              [
                ["stores", "Stores"],
                ["aisles", "Aisles"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onTabChange(id);
                  setQuery("");
                }}
                className={cn(
                  "h-9 rounded-full text-sm font-medium transition-colors",
                  tab === id
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search
              size={16}
              aria-hidden
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === "aisles"
                  ? "Search categories..."
                  : "Search stores..."
              }
              className="rounded-full border-0 bg-zinc-100 pl-9 shadow-none"
            />
          </div>
        </div>

        {tab === "aisles" ? (
          filteredCategories.length ? (
            <ul className="grid max-h-[52vh] grid-cols-3 gap-1 overflow-y-auto px-3 pb-6 md:max-h-none md:min-h-0 md:flex-1 md:content-start">
              {filteredCategories.map((category) => {
                const Icon = getCategoryIcon(category.slug);
                return (
                  <li key={category.slug}>
                    <Link
                      href={`/category/${category.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="group flex h-full flex-col items-center gap-2 rounded-2xl px-1 py-3 text-center transition-colors hover:bg-surface-soft active:bg-surface-soft"
                    >
                      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-surface-soft transition-colors group-hover:bg-block-cream">
                        <Icon
                          size={20}
                          className="text-foreground"
                          strokeWidth={1.75}
                          aria-hidden
                        />
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
          )
        ) : filteredStores.length ? (
          <ul className="max-h-[52vh] space-y-2 overflow-y-auto px-3 pb-6 md:max-h-none md:min-h-0 md:flex-1">
            {filteredStores.map((store) => (
              <li key={store.slug}>
                <Link
                  href={`/store/${store.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center gap-3 rounded-[28px] bg-zinc-100 p-3.5 transition-colors hover:bg-zinc-200/80"
                >
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-white shadow-sm">
                    <Image
                      src={store.logo}
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{store.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {store.blurb}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 pb-6 text-center text-sm text-muted-foreground">
            No stores match &ldquo;{query}&rdquo;
          </p>
        )}
      </SheetContent>
    </Sheet>
  );
}
