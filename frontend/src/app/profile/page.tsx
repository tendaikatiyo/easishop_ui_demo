"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useDemoUser } from "@/hooks/use-demo-user";
import { updateUser } from "@/lib/storage";
import { getAllProducts } from "@/lib/products";
import { track } from "@/lib/analytics";
import { formatRand, getLowestPrice } from "@/lib/catalog";
import type { LoyaltyCard, PriceAlert } from "@/types";

const RETAILERS = [
  "Checkers",
  "Pick n Pay",
  "Shoprite",
  "Woolworths",
  "Dischem",
];

export default function ProfilePage() {
  const { user, refresh } = useDemoUser();
  const products = useMemo(() => getAllProducts().slice(0, 12), []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardRetailer, setCardRetailer] = useState(RETAILERS[0]);
  const [cardNumber, setCardNumber] = useState("");
  const [cardLabel, setCardLabel] = useState("");

  useEffect(() => {
    if (!user) return;
    setName((current) => current || user.name);
    setEmail((current) => current || user.email);
  }, [user]);

  if (!user) {
    return <div className="py-20 text-center text-sm text-mute">Loading…</div>;
  }

  function saveProfile() {
    updateUser({ name: name.trim() || user!.name, email: email.trim() || user!.email });
    refresh();
    toast.success("Profile updated");
  }

  function togglePref(key: "emailDeals" | "pushAlerts" | "smsOffers") {
    updateUser({
      marketingPrefs: {
        ...user!.marketingPrefs,
        [key]: !user!.marketingPrefs[key],
      },
    });
    refresh();
  }

  function addLoyaltyCard() {
    if (!cardNumber.trim()) {
      toast.error("Add a card number");
      return;
    }
    const card: LoyaltyCard = {
      id: `loy-${Math.random().toString(36).slice(2, 8)}`,
      retailer: cardRetailer,
      cardNumber: cardNumber.trim(),
      label: cardLabel.trim() || `${cardRetailer} card`,
    };
    updateUser({ loyaltyCards: [...user!.loyaltyCards, card] });
    setCardNumber("");
    setCardLabel("");
    refresh();
    toast.success("Loyalty card added");
  }

  function removeCard(id: string) {
    updateUser({
      loyaltyCards: user!.loyaltyCards.filter((c) => c.id !== id),
    });
    refresh();
  }

  function toggleAlert(productId: string) {
    const existing = user!.priceAlerts.find((a) => a.productId === productId);
    let next: PriceAlert[];
    if (existing) {
      next = user!.priceAlerts.map((a) =>
        a.productId === productId ? { ...a, enabled: !a.enabled } : a
      );
    } else {
      next = [...user!.priceAlerts, { productId, enabled: true }];
    }
    updateUser({ priceAlerts: next });
    track("toggle_alert", {
      productId,
      enabled: !existing || !existing.enabled,
    });
    refresh();
  }

  const alertMap = new Map(
    user.priceAlerts.map((a) => [a.productId, a.enabled])
  );

  return (
    <div className="mx-auto max-w-2xl space-y-8 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Profile" },
        ]}
      />

      <div>
        <h1 className="font-heading text-2xl font-semibold">Your account</h1>
        <p className="text-sm text-mute">
          Demo account — changes stay on this device.
        </p>
      </div>

      <section className="space-y-4 rounded-xl border border-hairline bg-white p-4 md:p-5">
        <h2 className="font-heading text-lg font-semibold">Profile</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        {user.location ? (
          <p className="text-sm text-mute">
            Location saved for local pricing ({user.location.label ?? "Near you"}
            ).
          </p>
        ) : null}
        <Button className="bg-brand hover:bg-brand/90" onClick={saveProfile}>
          Save changes
        </Button>
      </section>

      <section className="space-y-4 rounded-xl border border-hairline bg-white p-4 md:p-5">
        <h2 className="font-heading text-lg font-semibold">Marketing preferences</h2>
        <div className="space-y-4">
          {(
            [
              ["emailDeals", "Email me weekly deals"],
              ["pushAlerts", "Push notifications for price drops"],
              ["smsOffers", "SMS offers (sparingly)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between gap-3">
              <Label htmlFor={key} className="font-normal">
                {label}
              </Label>
              <Switch
                id={key}
                checked={user.marketingPrefs[key]}
                onCheckedChange={() => togglePref(key)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-hairline bg-white p-4 md:p-5">
        <h2 className="font-heading text-lg font-semibold">Loyalty cards</h2>
        <p className="text-sm text-mute">
          Keep your store cards handy for checkout.
        </p>
        <ul className="space-y-2">
          {user.loyaltyCards.map((card) => (
            <li
              key={card.id}
              className="flex items-center justify-between rounded-lg border border-hairline px-3 py-3"
            >
              <div>
                <p className="font-medium">{card.label}</p>
                <p className="text-sm text-mute">
                  {card.retailer} · •••• {card.cardNumber.slice(-4)}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeCard(card.id)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="retailer">Retailer</Label>
            <select
              id="retailer"
              value={cardRetailer}
              onChange={(e) => setCardRetailer(e.target.value)}
              className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
            >
              {RETAILERS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cardNumber">Card number</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cardLabel">Label</Label>
            <Input
              id="cardLabel"
              value={cardLabel}
              onChange={(e) => setCardLabel(e.target.value)}
              placeholder="My Xtra Savings"
            />
          </div>
        </div>
        <Button variant="outline" onClick={addLoyaltyCard}>
          Add card
        </Button>
      </section>

      <section className="space-y-4 rounded-xl border border-hairline bg-white p-4 md:p-5">
        <h2 className="font-heading text-lg font-semibold">Price alerts</h2>
        <p className="text-sm text-mute">
          Toggle alerts on products you care about. We&apos;ll notify you when
          prices drop (demo toggle only).
        </p>
        <ul className="space-y-2">
          {products.map((product) => {
            const lowest = getLowestPrice(product);
            const enabled = alertMap.get(product.id) ?? false;
            return (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-hairline px-3 py-3"
              >
                <div className="min-w-0">
                  <Link
                    href={`/product/${product.id}`}
                    className="line-clamp-1 font-medium hover:text-brand"
                  >
                    {product.name}
                  </Link>
                  {lowest ? (
                    <p className="text-xs text-mute">
                      Now from {formatRand(lowest.price)} at {lowest.retailer}
                    </p>
                  ) : null}
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => toggleAlert(product.id)}
                  aria-label={`Alert for ${product.name}`}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-xl border border-hairline bg-surface-warm p-4 text-sm text-mute">
        <p className="font-medium text-ink">Follow EasiShop</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <a
            className="text-brand hover:underline"
            href="https://www.tiktok.com/@easishop_za"
            target="_blank"
            rel="noreferrer"
          >
            TikTok
          </a>
          <a
            className="text-brand hover:underline"
            href="https://www.instagram.com/easishop_za"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
          <a
            className="text-brand hover:underline"
            href="https://www.facebook.com/easishopza"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>
          <a
            className="text-brand hover:underline"
            href="https://www.linkedin.com/company/easishop"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}
