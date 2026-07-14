"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "reicon-react";
import { Button } from "@/components/ui/button";
import { canSafelyGoBack } from "@/components/layout/navigation-history";
import { getNavParent } from "@/lib/nav-parent";
import { cn } from "@/lib/utils";

export function BackButton({
  className,
  pathname,
  fallbackHref,
}: {
  className?: string;
  /** Current path — used to resolve a hierarchical parent. */
  pathname?: string;
  /** Override parent when the page knows it explicitly. */
  fallbackHref?: string;
}) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Go back"
      className={cn("rounded-full", className)}
      onClick={() => {
        if (fallbackHref) {
          router.push(fallbackHref);
          return;
        }

        const parent = pathname ? getNavParent(pathname) : null;
        if (parent?.force) {
          router.push(parent.href);
          return;
        }

        if (canSafelyGoBack()) {
          router.back();
          return;
        }

        router.push(parent?.href ?? "/");
      }}
    >
      <ChevronLeft size={20} aria-hidden />
    </Button>
  );
}
