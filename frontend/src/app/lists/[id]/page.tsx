"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { useDemoUser } from "@/hooks/use-demo-user";
import { deleteList, removeFromList } from "@/lib/lists";
import { getProductById } from "@/lib/products";
import { formatRand, getLowestPrice } from "@/lib/catalog";
import { track } from "@/lib/analytics";

export default function ListDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, refresh } = useDemoUser();
  const list = user?.lists.find((l) => l.id === params.id);

  if (!user) {
    return <div className="py-20 text-center text-sm text-mute">Loading…</div>;
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

  const items = list.items
    .map((item) => getProductById(item.productId))
    .filter(Boolean);

  const total = items.reduce((sum, product) => {
    const lowest = product ? getLowestPrice(product) : null;
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
          <p className="text-sm text-mute">
            {items.length} items · about {formatRand(total)} if you pick the
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

      {items.length ? (
        <ul className="space-y-2">
          {items.map((product) => {
            if (!product) return null;
            const lowest = getLowestPrice(product);
            return (
              <li
                key={product.id}
                className="flex items-center gap-3 rounded-xl border border-hairline bg-white p-3"
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
                    className="line-clamp-1 font-medium hover:text-brand"
                  >
                    {product.name}
                  </Link>
                  {lowest ? (
                    <p className="text-sm text-mute">
                      from{" "}
                      <span className="font-medium text-brand">
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
      ) : (
        <div className="rounded-xl border border-dashed border-hairline px-6 py-16 text-center">
          <p className="font-heading text-lg font-semibold">This list is empty</p>
          <p className="mt-1 text-sm text-mute">
            Tap the heart on any product to add it.
          </p>
          <Link
            href="/search"
            className="mt-4 inline-flex h-10 items-center rounded-full bg-brand px-5 text-sm font-medium text-white hover:bg-brand/90"
          >
            Find products
          </Link>
        </div>
      )}
    </div>
  );
}
