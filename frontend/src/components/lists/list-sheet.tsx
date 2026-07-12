"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDemoUser } from "@/hooks/use-demo-user";
import {
  addToList,
  createList,
  isInList,
  toggleInList,
} from "@/lib/lists";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ListSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, user can add the product to an existing or new list. */
  productId?: string;
  productName?: string;
};

export function ListSheet({
  open,
  onOpenChange,
  productId,
  productName,
}: ListSheetProps) {
  const { user, refresh } = useDemoUser();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const isPicker = !!productId;
  const lists = user?.lists ?? [];
  const showCreate = !isPicker || creating || lists.length === 0;

  useEffect(() => {
    if (!open) {
      setName("");
      setCreating(false);
    }
  }, [open]);

  function onCreateList() {
    const trimmed = name.trim() || "New list";
    const list = createList(trimmed);
    track("create_list", { name: trimmed });

    if (isPicker && productId) {
      addToList(productId, list.id);
      track("add_to_list", { productId, productName, listId: list.id });
      toast.success(`Added to ${trimmed}`);
    } else {
      toast.success(`Created ${trimmed}`);
    }

    setName("");
    setCreating(false);
    refresh();
    onOpenChange(false);
  }

  function onToggleList(listId: string, listName: string) {
    if (!productId) return;

    const added = toggleInList(listId, productId);
    track(added ? "add_to_list" : "remove_from_list", {
      productId,
      productName,
      listId,
    });
    toast.success(
      added ? `Added to ${listName}` : `Removed from ${listName}`
    );
    refresh();
    if (added) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton>
        <DialogHeader>
          <DialogTitle>
            {showCreate
              ? isPicker
                ? "Create a list"
                : "New list"
              : "Add to list"}
          </DialogTitle>
          <DialogDescription>
            {showCreate
              ? "Give your list a name to get started."
              : productName
                ? `Choose a list for ${productName}.`
                : "Choose a list or create a new one."}
          </DialogDescription>
        </DialogHeader>

        {showCreate ? (
          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="list-name">List name</Label>
              <Input
                id="list-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Braai Saturday"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") onCreateList();
                }}
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <ul className="max-h-[40vh] space-y-1 overflow-y-auto">
              {lists.map((list) => {
                const saved = isInList(list.id, productId!);
                return (
                  <li key={list.id}>
                    <button
                      type="button"
                      onClick={() => onToggleList(list.id, list.name)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                        "hover:bg-muted focus-visible:bg-muted focus-visible:outline-none",
                        saved && "bg-muted"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {list.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {list.items.length} item
                          {list.items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      {saved ? (
                        <Check
                          className="size-4 shrink-0 text-primary"
                          strokeWidth={2.5}
                        />
                      ) : (
                        <Plus
                          className="size-4 shrink-0 text-muted-foreground"
                          strokeWidth={2}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>

            <Separator />

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setCreating(true)}
            >
              <Plus className="size-4" />
              Create new list
            </Button>
          </div>
        )}

        {showCreate ? (
          <DialogFooter>
            {isPicker && lists.length > 0 ? (
              <Button variant="outline" onClick={() => setCreating(false)}>
                Back
              </Button>
            ) : (
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
            )}
            <Button onClick={onCreateList}>
              {isPicker ? "Create & add" : "Create"}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
