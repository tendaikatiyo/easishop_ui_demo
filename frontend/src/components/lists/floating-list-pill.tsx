"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListChecks } from "lucide-react";
import { useDemoUser } from "@/hooks/use-demo-user";
import { totalListItems } from "@/lib/lists";

export function FloatingListPill() {
  const pathname = usePathname();
  const { user } = useDemoUser();
  const count = user ? totalListItems() : 0;

  if (!count || pathname.startsWith("/lists")) return null;

  return (
    <Link
      href="/lists"
      className="fixed bottom-20 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] md:bottom-8"
    >
      <ListChecks className="size-4" />
      Your list
      <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-xs">
        {count}
      </span>
    </Link>
  );
}
