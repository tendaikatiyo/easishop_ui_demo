"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { Heart, Home, LayoutGrid, Percent, Search, User } from "lucide-react";

import { cn } from "@/lib/utils";

import { useDemoUser } from "@/hooks/use-demo-user";

import { totalListItems } from "@/lib/lists";

import { FloatingListPill } from "@/components/lists/floating-list-pill";

import { OnboardingSheet } from "@/components/onboarding/onboarding-sheet";

import { LocationPrompt } from "@/components/layout/location-prompt";

import { CategoryPickerProvider, useCategoryPicker } from "@/components/product/category-picker";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";



const nav = [

  { href: "/", label: "Home", icon: Home },

  { href: "/search", label: "Search", icon: Search },

  { href: "/deals", label: "Deals", icon: Percent },

  { href: "/lists", label: "Lists", icon: Heart },

  { href: "/profile", label: "You", icon: User },

];



function AppShellInner({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();

  const { user } = useDemoUser();

  const { toggle: toggleCategories, open: categoriesOpen } = useCategoryPicker();

  const listCount = user ? totalListItems() : 0;

  const onCategoryPage = pathname.startsWith("/category/");



  return (

    <>

      <header className="sticky top-0 z-40 border-b border-border/80 bg-background">

        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:h-16">

          <Link href="/" className="shrink-0">

            <span className="font-heading text-xl font-bold tracking-tight brand-green md:text-2xl">

              EasiShop

            </span>

          </Link>



          <Button

            type="button"

            variant="ghost"

            size="icon"

            className="ml-auto md:hidden"

            aria-label="Browse categories"

            aria-expanded={categoriesOpen}

            onClick={toggleCategories}

          >

            <LayoutGrid className="size-5" />

          </Button>



          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              if (item.href === "/profile") {
                return (
                  <span key="profile-group" className="contents">
                    <Button
                      type="button"
                      variant={onCategoryPage || categoriesOpen ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-2"
                      aria-expanded={categoriesOpen}
                      onClick={toggleCategories}
                    >
                      <LayoutGrid className="size-4" strokeWidth={2} />
                      Categories
                    </Button>
                    <Button
                      key={item.href}
                      variant={active ? "secondary" : "ghost"}
                      size="sm"
                      className="gap-2"
                      render={<Link href={item.href} />}
                    >
                      <Icon className="size-4" strokeWidth={active ? 2.4 : 2} />
                      {item.label}
                    </Button>
                  </span>
                );
              }

              return (
                <Button
                  key={item.href}
                  variant={active ? "secondary" : "ghost"}
                  size="sm"
                  className="gap-2"
                  render={<Link href={item.href} />}
                >
                  <Icon className="size-4" strokeWidth={active ? 2.4 : 2} />
                  {item.label}
                  {item.href === "/lists" && listCount > 0 ? (
                    <Badge variant="default" className="h-5 min-w-5 px-1">
                      {listCount}
                    </Badge>
                  ) : null}
                </Button>
              );
            })}
          </nav>

        </div>

      </header>



      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-6 md:pb-10">

        {children}

      </main>



      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background md:hidden">

        <ul className="mx-auto grid max-w-lg grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">

          {nav.map((item) => {

            const Icon = item.icon;

            const active =

              item.href === "/"

                ? pathname === "/"

                : pathname.startsWith(item.href);

            return (

              <li key={item.href}>

                <Link

                  href={item.href}

                  className={cn(

                    "relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",

                    active ? "text-foreground" : "text-foreground/50"

                  )}

                >

                  <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />

                  {item.label}

                  {item.href === "/lists" && listCount > 0 ? (

                    <Badge

                      variant="default"

                      className="absolute right-2 top-1 h-4 min-w-4 px-1 text-[9px]"

                    >

                      {listCount}

                    </Badge>

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

