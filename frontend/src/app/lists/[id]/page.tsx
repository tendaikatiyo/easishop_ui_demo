"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Compass, Edit2, Refresh, Search, Trash2 } from "reicon-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { useCategoryPicker } from "@/components/product/category-picker";
import { ListProductSkeleton } from "@/components/product/skeletons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDemoUser } from "@/hooks/use-demo-user";
import { deleteList, removeFromList, renameList } from "@/lib/lists";
import { formatRand, getLowestPrice } from "@/lib/catalog";
import { getRetailerLogo } from "@/lib/retailers";
import { track } from "@/lib/analytics";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export default function ListDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { openBrowse } = useCategoryPicker();
  const { user, refresh } = useDemoUser();
  const list = user?.lists.find((l) => l.id === params.id);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [renameOpen, setRenameOpen] = useState(false);
  const [draftName, setDraftName] = useState("");

  const productIds = useMemo(
    () => list?.items.map((item) => item.productId).join(",") ?? "",
    [list]
  );

  const loadProducts = useCallback(
    async (opts?: { refresh?: boolean; signal?: AbortSignal }) => {
      if (!productIds) {
        setProducts([]);
        return;
      }

      const isRefresh = !!opts?.refresh;
      if (isRefresh) setRefreshing(true);
      else setLoadingProducts(true);

      const qs = new URLSearchParams({ ids: productIds });
      if (isRefresh) qs.set("refresh", "1");

      try {
        const res = await fetch(`/api/products/batch?${qs.toString()}`, {
          cache: isRefresh ? "no-store" : "default",
          signal: opts?.signal,
        });
        if (opts?.signal?.aborted) return;
        const data = (await res.json()) as { products?: Product[] };
        setProducts(data.products ?? []);
        if (isRefresh) toast.success("Prices updated");
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (isRefresh) {
          toast.error("Couldn't refresh prices");
        } else {
          setProducts([]);
        }
      } finally {
        if (opts?.signal?.aborted) return;
        if (isRefresh) setRefreshing(false);
        else setLoadingProducts(false);
      }
    },
    [productIds]
  );

  useEffect(() => {
    const controller = new AbortController();
    void loadProducts({ signal: controller.signal });
    return () => controller.abort();
  }, [loadProducts]);

  if (!user) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!list) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="font-heading text-lg font-semibold">List not found</p>
        <Link
          href="/lists"
          className="inline-flex h-8 items-center rounded-full bg-surface-soft px-4 text-sm font-medium"
        >
          Back to lists
        </Link>
      </div>
    );
  }

  const total = products.reduce((sum, product) => {
    const lowest = getLowestPrice(product);
    return sum + (lowest?.price ?? 0);
  }, 0);

  const skeletonCount = Math.max(list.items.length, 1);
  const showSkeleton = loadingProducts || refreshing;

  function openRename() {
    setDraftName(list!.name);
    setRenameOpen(true);
  }

  function onRename() {
    const trimmed = draftName.trim();
    if (!trimmed) {
      toast.error("Give your list a name.");
      return;
    }
    renameList(list!.id, trimmed);
    refresh();
    setRenameOpen(false);
    toast.success("List renamed");
  }

  return (
    <div className="space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Lists", href: "/lists" },
          { label: list.name },
        ]}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <h1 className="font-heading truncate text-2xl font-semibold">
              {list.name}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 shrink-0 rounded-full"
              aria-label="Rename list"
              onClick={openRename}
            >
              <Edit2 size={16} aria-hidden />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {list.items.length} item{list.items.length === 1 ? "" : "s"}
            {!showSkeleton && products.length
              ? ` · ${formatRand(total)}`
              : null}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {list.items.length > 0 ? (
            <Button
              variant="outline"
              size="icon"
              aria-label="Refresh prices"
              disabled={showSkeleton}
              onClick={() => void loadProducts({ refresh: true })}
            >
              <Refresh
                size={16}
                className={cn(refreshing && "animate-spin")}
                aria-hidden
              />
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="icon"
            aria-label="Delete list"
            onClick={() => {
              deleteList(list.id);
              refresh();
              router.push("/lists");
            }}
          >
            <Trash2 size={16} aria-hidden />
          </Button>
        </div>
      </div>

      {showSkeleton ? (
        <ListProductSkeleton count={skeletonCount} />
      ) : products.length ? (
        <ul className="space-y-2">
          {products.map((product) => {
            const lowest = getLowestPrice(product);
            const logo = lowest ? getRetailerLogo(lowest.retailer) : null;
            return (
              <li
                key={product.id}
                className="flex items-center gap-3 rounded-2xl bg-white p-3"
              >
                <Link
                  href={`/product/${product.id}`}
                  className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface-warm"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/product/${product.id}`}
                    className="line-clamp-1 font-medium hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  {lowest ? (
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="relative size-5 shrink-0 overflow-hidden rounded-full border border-border bg-white"
                        title={lowest.retailer}
                      >
                        {logo ? (
                          <Image
                            src={logo}
                            alt={lowest.retailer}
                            fill
                            className="object-contain p-0.5"
                            sizes="20px"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center text-[7px] font-semibold leading-none">
                            {lowest.retailer.slice(0, 2)}
                          </span>
                        )}
                      </span>
                      <span className="text-sm font-medium tabular-nums">
                        {formatRand(lowest.price)}
                      </span>
                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      Price unavailable
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    removeFromList(product.id, list.id);
                    track("remove_from_list", {
                      productId: product.id,
                      listId: list.id,
                    });
                    setProducts((prev) =>
                      prev.filter((p) => p.id !== product.id)
                    );
                    refresh();
                  }}
                >
                  Remove
                </Button>
              </li>
            );
          })}
        </ul>
      ) : list.items.length ? (
        <div className="rounded-3xl bg-white px-6 py-16 text-center">
          <p className="font-heading text-lg font-semibold">
            Some items couldn&apos;t load
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved products may have changed. Remove stale items or search again.
          </p>
          <Button
            className="mt-4 rounded-full"
            onClick={() => void loadProducts({ refresh: true })}
          >
            Try again
          </Button>
        </div>
      ) : (
        <div className="rounded-3xl bg-white px-6 py-16 text-center">
          <p className="font-heading text-lg font-semibold">This list is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the + on any product to add it.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Button className="rounded-full" render={<Link href="/search" />}>
              Find products
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => openBrowse("stores")}
            >
              Explore stores
            </Button>
          </div>
        </div>
      )}

      {list.items.length > 0 && !showSkeleton ? (
        <div className="flex flex-col gap-2.5 rounded-[28px] bg-surface-soft p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Add more from search or by store.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-10 rounded-full bg-white px-4"
              render={<Link href="/search" />}
            >
              <Search size={16} aria-hidden />
              Search
            </Button>
            <Button
              variant="outline"
              className="h-10 rounded-full bg-white px-4"
              onClick={() => openBrowse("stores")}
            >
              <Compass size={16} aria-hidden />
              Explore
            </Button>
          </div>
        </div>
      ) : null}

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rename list</DialogTitle>
            <DialogDescription>
              Choose a name that helps you spot this list later.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={draftName}
            onChange={(e) => setDraftName(e.target.value)}
            placeholder="e.g. Weekly shop"
            autoFocus
            className="h-12 rounded-full border-0 bg-zinc-100 px-5 shadow-none focus-visible:ring-2 focus-visible:ring-ring/40"
            onKeyDown={(e) => {
              if (e.key === "Enter") onRename();
            }}
          />
          <DialogFooter>
            <Button
              variant="ghost"
              className="h-11 rounded-full bg-zinc-100 px-5 hover:bg-zinc-200"
              onClick={() => setRenameOpen(false)}
            >
              Cancel
            </Button>
            <Button className="h-11 rounded-full px-6" onClick={onRename}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
