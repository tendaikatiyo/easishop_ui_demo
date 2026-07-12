"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutGrid,
  ListChecks,
  Percent,
  Search,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoUser } from "@/hooks/use-demo-user";
import { totalListItems } from "@/lib/lists";
import { BackButton } from "@/components/layout/back-button";
import { FloatingListPill } from "@/components/lists/floating-list-pill";
import { OnboardingSheet } from "@/components/onboarding/onboarding-sheet";
import { LocationPrompt } from "@/components/layout/location-prompt";
import {
  CategoryPickerProvider,
  useCategoryPicker,
} from "@/components/product/category-picker";
import { useReturningVisitor } from "@/hooks/use-returning-visitor";
import { Button } from "@/components/ui/button";

const searchPlaceholder = (returning: boolean) =>
  returning ? "Milk, bread, or something new…" : "What are you shopping for?";

const mobileNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/deals", label: "Deals", icon: Percent },
  { href: "/lists", label: "Lists", icon: ListChecks },
  { href: "/profile", label: "You", icon: User },
] as const;

const desktopNav = [
  { href: "/", label: "Home" },
  { href: "/deals", label: "Deals" },
  { href: "/lists", label: "Lists" },
] as const;

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function AppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useDemoUser();
  const { toggle: toggleCategories, open: categoriesOpen } = useCategoryPicker();
  const listCount = user ? totalListItems() : 0;
  const onCategoryPage = pathname.startsWith("/category/");
  const isReturning = useReturningVisitor();
  const onHome = pathname === "/";

  return (
    <>
      <header className="sticky top-0 z-40 bg-background/75 backdrop-blur-lg supports-[backdrop-filter]:bg-background/65">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:h-[4.25rem] md:gap-4">
          {pathname !== "/" ? (
            <BackButton className="-ml-1 shrink-0 md:hidden" />
          ) : null}

          <Link href="/" className="shrink-0">
            <span className="font-heading text-xl font-bold tracking-tight brand-green md:text-[1.35rem]">
              EasiShop
            </span>
          </Link>

          <div className="ml-auto hidden min-w-0 flex-1 md:block md:max-w-sm">
            {!onHome ? (
              <Link
                href="/search"
                className="flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 text-sm text-foreground/45 shadow-xs transition-colors hover:text-foreground/70"
              >
                <Search className="size-4 shrink-0" strokeWidth={2} />
                <span className="truncate">{searchPlaceholder(isReturning)}</span>
              </Link>
            ) : null}
          </div>

          <nav className="hidden shrink-0 items-center gap-0.5 md:flex">
            {desktopNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-white text-foreground shadow-xs"
                      : "text-foreground/55 hover:text-foreground"
                  )}
                >
                  {item.label}
                  {item.href === "/lists" && listCount > 0 ? (
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[var(--brand-green)] text-[10px] font-medium text-white">
                      {listCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={toggleCategories}
              aria-expanded={categoriesOpen}
              className={cn(
                "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                onCategoryPage || categoriesOpen
                  ? "bg-white text-foreground shadow-xs"
                  : "text-foreground/55 hover:text-foreground"
              )}
            >
              Categories
            </button>

            <Link
              href="/profile"
              className={cn(
                "ml-1 flex size-9 items-center justify-center rounded-full transition-colors",
                isActive(pathname, "/profile")
                  ? "bg-white text-foreground shadow-xs"
                  : "bg-white/60 text-foreground/70 hover:bg-white hover:text-foreground hover:shadow-xs"
              )}
              aria-label="Your profile"
            >
              <User className="size-4" strokeWidth={2} />
            </Link>
          </nav>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="ml-auto shrink-0 rounded-full md:hidden"
            aria-label="Browse categories"
            aria-expanded={categoriesOpen}
            onClick={toggleCategories}
          >
            <LayoutGrid className="size-5" strokeWidth={2} />
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:pb-10">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/70 md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex flex-col items-center gap-1 py-1.5 text-[10px] font-medium transition-colors",
                    active ? "text-foreground" : "text-foreground/45"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-2xl transition-all",
                      active && "bg-white shadow-xs"
                    )}
                  >
                    <Icon className="size-5" strokeWidth={active ? 2.25 : 2} />
                  </span>
                  {item.label}
                  {item.href === "/lists" && listCount > 0 ? (
                    <span className="absolute right-3 top-0 flex size-4 items-center justify-center rounded-full bg-[var(--brand-green)] text-[9px] font-medium text-white">
                      {listCount}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <FloatingListPill />
      <OnboardingSheet />
      <LocationPrompt />
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <CategoryPickerProvider>
      <AppShellInner>{children}</AppShellInner>
    </CategoryPickerProvider>
  );
}
