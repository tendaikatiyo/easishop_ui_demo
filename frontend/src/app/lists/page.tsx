"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, ListCheck, Plus } from "reicon-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { ListSheet } from "@/components/lists/list-sheet";
import { useDemoUser } from "@/hooks/use-demo-user";

export default function ListsPage() {
  const { user } = useDemoUser();
  const [open, setOpen] = useState(false);
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
            Tap + on products as you browse — pick a list or start a new one.
          </p>
        </div>
        <Button
          className="h-10 shrink-0 rounded-full px-5 shadow-xs"
          onClick={() => setOpen(true)}
        >
          <Plus size={16} aria-hidden />
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
                  className="group flex items-center gap-4 rounded-3xl bg-white p-4 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <ListCheck
                      size={20}
                      className="text-muted-foreground"
                      aria-hidden
                    />
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
                  <span className="flex shrink-0 items-center gap-0.5 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                    Open
                    <ChevronRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 rounded-3xl bg-surface-soft px-4 py-3.5 text-sm text-muted-foreground">
            <Plus size={16} className="shrink-0" aria-hidden />
            <p>
              Tip: tap + on any product to add it to a list or create a new one.
            </p>
          </div>
        </>
      ) : (
        <div className="rounded-3xl bg-white px-6 py-14 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted">
            <ListCheck
              size={24}
              className="text-muted-foreground"
              aria-hidden
            />
          </div>
          <h2 className="mt-4 font-heading text-xl font-medium">
            No lists yet
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            Create a list, then tap + on products as you browse to build your
            weekly shop.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2.5">
            <Button
              className="h-10 rounded-full px-5"
              onClick={() => setOpen(true)}
            >
              <Plus size={16} aria-hidden />
              Create your first list
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-full px-5"
              render={<Link href="/deals" />}
            >
              View deals
            </Button>
          </div>
        </div>
      )}

      <ListSheet open={open} onOpenChange={setOpen} />
    </div>
  );
}
