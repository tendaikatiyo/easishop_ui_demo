"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, ListCheck, Plus } from "reicon-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { startPageTransition } from "@/components/layout/navigation-loader";
import { cn } from "@/lib/utils";

type ListSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, user can add the product to an existing or new list. */
  productId?: string;
  productName?: string;
};

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function ListSheet({
  open,
  onOpenChange,
  productId,
  productName,
}: ListSheetProps) {
  const router = useRouter();
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

  function viewListAction(listId: string) {
    return {
      label: "View list",
      onClick: () => {
        startPageTransition();
        router.push(`/lists/${listId}`);
      },
    };
  }

  function notifyAdded(listId: string, listName: string) {
    toast.promise(
      wait(320).then(() => ({ listId, listName })),
      {
        loading: "Adding to list…",
        success: (data) => ({
          message: `Added to ${data.listName}`,
          action: viewListAction(data.listId),
        }),
        error: "Couldn't add to list",
      }
    );
  }

  function notifyCreated(listId: string, listName: string) {
    toast.promise(
      wait(320).then(() => ({ listId, listName })),
      {
        loading: "Creating list…",
        success: (data) => ({
          message: `Created ${data.listName}`,
          action: viewListAction(data.listId),
        }),
        error: "Couldn't create list",
      }
    );
  }

  function notifyRemoved(listName: string) {
    toast.promise(wait(280).then(() => listName), {
      loading: "Updating list…",
      success: (name) => `Removed from ${name}`,
      error: "Couldn't update list",
    });
  }

  function onCreateList() {
    const trimmed = name.trim() || "New list";
    const list = createList(trimmed);
    track("create_list", { name: trimmed });

    if (isPicker && productId) {
      addToList(productId, list.id);
      track("add_to_list", { productId, productName, listId: list.id });
      notifyAdded(list.id, trimmed);
    } else {
      notifyCreated(list.id, trimmed);
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
    if (added) {
      notifyAdded(listId, listName);
    } else {
      notifyRemoved(listName);
    }
    refresh();
    if (added) onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-5 sm:max-w-md">
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
          <Input
            id="list-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Braai Saturday"
            autoFocus
            className="h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
            onKeyDown={(e) => {
              if (e.key === "Enter") onCreateList();
            }}
          />
        ) : (
          <div className="grid gap-3">
            <ul className="max-h-[40vh] space-y-2 overflow-y-auto">
              {lists.map((list) => {
                const saved = isInList(list.id, productId!);
                return (
                  <li key={list.id}>
                    <button
                      type="button"
                      onClick={() => onToggleList(list.id, list.name)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[28px] p-3.5 text-left transition-colors",
                        saved
                          ? "bg-[var(--brand-green-light)]"
                          : "bg-zinc-100 hover:bg-zinc-200/80"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-10 shrink-0 items-center justify-center rounded-full",
                          saved ? "bg-white shadow-sm" : "bg-white/80"
                        )}
                      >
                        <ListCheck
                          size={20}
                          className={cn(
                            saved ? "brand-green" : "text-foreground/70"
                          )}
                          aria-hidden
                        />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {list.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {list.items.length} item
                          {list.items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "flex size-9 shrink-0 items-center justify-center rounded-full shadow-sm",
                          saved
                            ? "bg-[var(--brand-green)] text-white"
                            : "bg-white text-zinc-600"
                        )}
                      >
                        {saved ? (
                          <Check size={16} strokeWidth={2.5} aria-hidden />
                        ) : (
                          <Plus size={16} strokeWidth={2.5} aria-hidden />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <Button
              variant="ghost"
              className="h-12 w-full justify-start gap-3 rounded-[28px] bg-zinc-100 px-3.5 hover:bg-zinc-200/80"
              onClick={() => setCreating(true)}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
                <Plus size={16} strokeWidth={2.5} aria-hidden />
              </span>
              Create new list
            </Button>
          </div>
        )}

        {showCreate ? (
          <DialogFooter>
            {isPicker && lists.length > 0 ? (
              <Button
                variant="ghost"
                className="h-11 rounded-full px-5 bg-zinc-100 hover:bg-zinc-200"
                onClick={() => setCreating(false)}
              >
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="h-11 rounded-full px-5 bg-zinc-100 hover:bg-zinc-200"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            )}
            <Button className="h-11 rounded-full px-6" onClick={onCreateList}>
              {isPicker ? "Create & add" : "Create"}
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
