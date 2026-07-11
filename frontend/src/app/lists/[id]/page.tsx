"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { useDemoUser } from "@/hooks/use-demo-user";
import { deleteList, removeFromList } from "@/lib/lists";
import { formatRand, getLowestPrice } from "@/lib/catalog";
import { track } from "@/lib/analytics";
import type { Product } from "@/types";

export default function ListDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, refresh } = useDemoUser();
  const list = user?.lists.find((l) => l.id === params.id);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const productIds = useMemo(
    () => list?.items.map((item) => item.productId).join(",") ?? "",
    [list]
  );

  useEffect(() => {
    if (!productIds) {
      setProducts([]);
      return;
    }

    let cancelled = false;
    setLoadingProducts(true);
    fetch(`/api/products/batch?ids=${encodeURIComponent(productIds)}`)
      .then((res) => res.json())
      .then((data: { products: Product[] }) => {
        if (!cancelled) setProducts(data.products ?? []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productIds]);

  if (!user) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!list) {
    return (
      <div className="space-y-4 py-10 text-center">
        <p className="font-heading text-lg font-semibold">List not found</p>
        <Link
          href="/lists"
          className="inline-flex h-8 items-center rounded-lg border border-border px-3 text-sm"
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
        <div>
          <h1 className="font-heading text-2xl font-semibold">{list.name}</h1>
          <p className="text-sm text-muted-foreground">
            {list.items.length} items · about {formatRand(total)} if you pick the
            lowest each time
          </p>
        </div>
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
          <Trash2 className="size-4" />
        </Button>
      </div>

      {loadingProducts ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          Loading products…
        </div>
      ) : products.length ? (
        <ul className="space-y-2">
          {products.map((product) => {
            const lowest = getLowestPrice(product);
            return (
              <li
                key={product.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-white p-3"
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
                    <p className="text-sm text-muted-foreground">
                      from{" "}
                      <span className="font-medium text-primary">
                        {formatRand(lowest.price)}
                      </span>{" "}
                      at {lowest.retailer}
                    </p>
                  ) : null}
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
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-lg font-semibold">Some items couldn&apos;t load</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Saved products may have changed. Remove stale items or search again.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
          <p className="font-heading text-lg font-semibold">This list is empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tap the heart on any product to add it.
          </p>
          <Button className="mt-4 rounded-full" render={<Link href="/search" />}>
            Find products
          </Button>
        </div>
      )}
    </div>
  );
}
