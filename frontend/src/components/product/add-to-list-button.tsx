"use client";

import { useState } from "react";
import { Check, Plus } from "reicon-react";
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
            ? "bg-[var(--brand-green-light)] text-green-800 ring-1 ring-black/5 hover:bg-[var(--brand-green-light)]/80"
            : "bg-zinc-100 text-zinc-700 ring-1 ring-black/10 hover:bg-zinc-200/90",
          className
        )}
      >
        {saved ? (
          <Check size={16} strokeWidth={2.5} aria-hidden />
        ) : (
          <Plus size={16} strokeWidth={2.5} aria-hidden />
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
