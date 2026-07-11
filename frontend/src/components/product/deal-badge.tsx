import { ArrowDown } from "lucide-react";
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
      <ArrowDown />
      <span className="font-accent tracking-tight">{formatRand(amount)}</span>
    </Badge>
  );
}
