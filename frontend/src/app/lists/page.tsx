"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Heart, ListChecks, Plus } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDemoUser } from "@/hooks/use-demo-user";
import { createList } from "@/lib/lists";
import { track } from "@/lib/analytics";

export default function ListsPage() {
  const { user, refresh } = useDemoUser();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  function onCreate() {
    const trimmed = name.trim() || "New list";
    createList(trimmed);
    track("create_list", { name: trimmed });
    setName("");
    setOpen(false);
    refresh();
  }

  const lists = user?.lists ?? [];

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Lists" },
        ]}
      />
      <div className="flex items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-heading text-2xl font-semibold md:text-3xl">
            Your lists
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            Heart products as you browse — they land here.
          </p>
        </div>
        <Button
          className="h-10 shrink-0 rounded-full px-5 shadow-xs"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />
          New list
        </Button>
      </div>

      {lists.length ? (
        <>
          <ul className="grid gap-3 sm:grid-cols-2">
            {lists.map((list) => (
              <li key={list.id}>
                <Link
                  href={`/lists/${list.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:border-[var(--brand-green)]/30 hover:shadow-md"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-green-light)]">
                    <ListChecks className="size-5 brand-green" strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-foreground">
                      {list.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {list.items.length} item
                      {list.items.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="flex shrink-0 items-center gap-0.5 text-sm font-medium brand-green">
                    Open
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 rounded-2xl bg-surface-soft px-4 py-3.5 text-sm text-muted-foreground">
            <Heart className="size-4 shrink-0 brand-green" strokeWidth={2} />
            <p>
              Tip: tap the heart on any product to add it straight to a list.
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-white px-6 py-14 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--brand-green-light)]">
            <Heart className="size-6 brand-green" strokeWidth={2} />
          </div>
          <h2 className="mt-4 font-heading text-xl font-medium">
            No lists yet
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            Create a list, then heart products as you browse to build your
            weekly shop.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Button
              className="h-10 rounded-full px-5"
              onClick={() => setOpen(true)}
            >
              <Plus className="size-4" />
              Create your first list
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-full px-5"
              render={<Link href="/deals" />}
            >
              Browse deals
            </Button>
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-heading">Create a list</DialogTitle>
          </DialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Braai Saturday"
            autoFocus
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
