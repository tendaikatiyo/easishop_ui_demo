"use client";

import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { isInAnyList, toggleInDefaultList } from "@/lib/lists";
import { track } from "@/lib/analytics";
import { useDemoUser } from "@/hooks/use-demo-user";

export function AddToListButton({
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
      variant="ghost"
      aria-label={saved ? "Remove from list" : "Add to list"}
      onClick={onToggle}
      className={cn(
        "size-9 rounded-full shadow-sm transition-colors",
        saved
          ? "bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
        className
      )}
    >
      {saved ? (
        <Check className="size-4" strokeWidth={2.5} />
      ) : (
        <Plus className="size-4" strokeWidth={2.5} />
      )}
    </Button>
  );
}
