"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  Compass,
  Home,
  ListChecks,
  Search,
  BadgePercent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PopularSearchPills } from "@/components/search/search-empty-state";
import { cn } from "@/lib/utils";

const FLOW_LINKS = [
  {
    href: "/search",
    label: "Search products",
    description: "Find by name",
    icon: Search,
  },
  {
    href: "/#stores",
    label: "Shop by store",
    description: "Browse retailers",
    icon: Compass,
  },
  {
    href: "/deals",
    label: "View deals",
    description: "Price drops",
    icon: BadgePercent,
  },
  {
    href: "/lists",
    label: "Your lists",
    description: "Saved items",
    icon: ListChecks,
  },
] as const;

export function ErrorPageView({
  code,
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Back home",
  secondaryAction,
  showPopularSearches = true,
}: {
  code?: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryAction?: ReactNode;
  showPopularSearches?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-lg space-y-6 animate-rise py-6 md:py-10">
      <div className="rounded-[32px] bg-white px-6 py-12 text-center shadow-xs md:px-10 md:py-14">
        {code ? (
          <p className="font-accent text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {code}
          </p>
        ) : null}
        <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          {title}
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <Button
            className="h-11 rounded-full px-6"
            render={<Link href={primaryHref} />}
          >
            <Home size={16} aria-hidden />
            {primaryLabel}
          </Button>
          {secondaryAction}
        </div>
      </div>

      <section className="space-y-3">
        <p className="figma-eyebrow px-1">Keep shopping</p>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {FLOW_LINKS.map(({ href, label, description: desc, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-[28px] bg-white p-3.5 shadow-xs transition-all",
                  "hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                )}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-foreground transition-colors group-hover:bg-[var(--brand-green-light)] group-hover:text-[var(--brand-green)]">
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block text-sm font-medium">{label}</span>
                  <span className="block text-xs text-muted-foreground">
                    {desc}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {showPopularSearches ? (
        <section className="rounded-[32px] bg-surface-soft px-5 py-6 text-center md:px-6">
          <p className="figma-eyebrow">Popular searches</p>
          <div className="mt-3">
            <PopularSearchPills />
          </div>
        </section>
      ) : null}
    </div>
  );
}
