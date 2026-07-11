"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isInAnyList, toggleInDefaultList } from "@/lib/lists";
import { track } from "@/lib/analytics";
import { useDemoUser } from "@/hooks/use-demo-user";

export function HeartButton({
  productId,
  productName,
  className,
}: {
  productId: string;
  productName: string;
  className?: string;
}) {
  const { user, refresh } = useDemoUser();
  const saved = user ? isInAnyList(productId) : false;

  function onToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleInDefaultList(productId);
    refresh();
    track(added ? "add_to_list" : "remove_from_list", {
      productId,
      productName,
    });
    toast.success(added ? "Added to your list" : "Removed from your list");
  }

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      aria-label={saved ? "Remove from list" : "Add to list"}
      onClick={onToggle}
      className={cn(
        "size-9 rounded-full bg-white/90 shadow-sm hover:bg-white",
        className
      )}
    >
      <Heart
        className={cn("size-4", saved && "fill-brand text-brand")}
        strokeWidth={2}
      />
    </Button>
  );
}
