"use client";

import { ArrowDown } from "reicon-react";
import { Badge } from "@/components/ui/badge";
import { formatRand } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function DealBadge({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  if (amount <= 0) return null;

  return (
    <Badge
      className={cn(
        "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
        className
      )}
    >
      <ArrowDown size={16} aria-hidden />
      <span className="font-accent tracking-tight">{formatRand(amount)}</span>
    </Badge>
  );
}
