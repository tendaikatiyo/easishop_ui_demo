"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Heart, Home, Percent, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemoUser } from "@/hooks/use-demo-user";
import { totalListItems } from "@/lib/lists";
import { FloatingListPill } from "@/components/lists/floating-list-pill";
import { OnboardingSheet } from "@/components/onboarding/onboarding-sheet";
import { LocationPrompt } from "@/components/layout/location-prompt";

const nav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/deals", label: "Deals", icon: Percent },
  { href: "/lists", label: "Lists", icon: Heart },
  { href: "/profile", label: "You", icon: User },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useDemoUser();
  const listCount = user ? totalListItems() : 0;

  return (
    <>
      <header className="sticky top-0 z-40 glass-strong">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/easishop_FAV.svg"
              alt="EasiShop"
              width={28}
              height={28}
              className="size-7"
            />
            <span className="font-heading text-xl font-bold tracking-tight text-brand">
              EasiShop
            </span>
          </Link>

          <nav className="ml-auto hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-soft text-brand"
                      : "text-ink-soft hover:bg-muted"
                  )}
                >
                  {item.label}
                  {item.href === "/lists" && listCount > 0 ? (
                    <span className="ml-1.5 inline-flex size-5 items-center justify-center rounded-full bg-brand text-[11px] text-white">
                      {listCount}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-4 md:pb-10 md:pt-6">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline glass-strong md:hidden">
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
                    "relative flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium",
                    active ? "text-brand" : "text-mute"
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
                  {item.label}
                  {item.href === "/lists" && listCount > 0 ? (
                    <span className="absolute right-3 top-1.5 flex size-4 items-center justify-center rounded-full bg-brand text-[9px] text-white">
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
