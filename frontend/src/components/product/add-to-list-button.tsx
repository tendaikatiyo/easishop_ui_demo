"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ListSheet } from "@/components/lists/list-sheet";
import { cn } from "@/lib/utils";
import { isInAnyList } from "@/lib/lists";
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
  const { user } = useDemoUser();
  const [open, setOpen] = useState(false);
  const saved = user ? isInAnyList(productId) : false;

  function onOpen(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }

  return (
    <>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        aria-label={saved ? "Manage lists" : "Add to list"}
        onClick={onOpen}
        className={cn(
          "size-9 rounded-full shadow-sm transition-colors",
        saved
          ? "glass-soft text-green-800 hover:bg-white/55 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900"
          : "glass-soft text-zinc-600 hover:bg-white/55",
          className
        )}
      >
        {saved ? (
          <Check className="size-4" strokeWidth={2.5} />
        ) : (
          <Plus className="size-4" strokeWidth={2.5} />
        )}
      </Button>

      <ListSheet
        open={open}
        onOpenChange={setOpen}
        productId={productId}
        productName={productName}
      />
    </>
  );
}
