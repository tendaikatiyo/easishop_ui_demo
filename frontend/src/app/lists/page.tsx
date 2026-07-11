"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
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

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Lists" },
        ]}
      />
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Your lists</h1>
          <p className="text-sm text-mute">
            Heart products as you browse — they land here.
          </p>
        </div>
        <Button
          className="rounded-full bg-brand hover:bg-brand/90"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-4" />
          New list
        </Button>
      </div>

      <ul className="space-y-2">
        {(user?.lists ?? []).map((list) => (
          <li key={list.id}>
            <Link
              href={`/lists/${list.id}`}
              className="flex items-center justify-between rounded-xl border border-hairline bg-white px-4 py-4 transition-colors hover:border-brand/30"
            >
              <div>
                <p className="font-medium text-ink">{list.name}</p>
                <p className="text-sm text-mute">
                  {list.items.length} item{list.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <span className="text-sm text-brand">Open</span>
            </Link>
          </li>
        ))}
      </ul>

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
            <Button className="bg-brand hover:bg-brand/90" onClick={onCreate}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
