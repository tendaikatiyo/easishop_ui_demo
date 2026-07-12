"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { LucideIcon } from "lucide-react";
import { MapPin, Megaphone, Share2, UserRound } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDemoUser } from "@/hooks/use-demo-user";
import { updateUser } from "@/lib/storage";

const SOCIAL_LINKS = [
  ["TikTok", "https://www.tiktok.com/@easishop_za"],
  ["Instagram", "https://www.instagram.com/easishop_za"],
  ["Facebook", "https://www.facebook.com/easishopza"],
  ["LinkedIn", "https://www.linkedin.com/company/easishop"],
] as const;

const MARKETING_PREFS = [
  [
    "emailDeals",
    "Email me weekly deals",
    "A short digest of the best price drops.",
  ],
  [
    "pushAlerts",
    "Push notifications for price drops",
    "Instant alerts on products you follow.",
  ],
  ["smsOffers", "SMS offers (sparingly)", "Occasional standout offers by text."],
] as const;

function getInitials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "?"
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-green-light)]">
        <Icon className="size-4 brand-green" strokeWidth={2} />
      </span>
      <div className="space-y-0.5">
        <h2 className="font-heading text-lg font-semibold leading-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, refresh } = useDemoUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!user) return;
    setName((current) => current || user.name);
    setEmail((current) => current || user.email);
  }, [user]);

  if (!user) {
    return <div className="py-20 text-center text-sm text-muted-foreground">Loading…</div>;
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

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Profile" },
        ]}
      />

      <section className="relative overflow-hidden rounded-3xl bg-[#0e4a30] p-6 text-white md:p-8">
        <div
          className="absolute -right-20 -top-24 size-64 rounded-full bg-[var(--brand-green)]/50 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-28 -left-16 size-56 rounded-full bg-white/10 blur-3xl"
          aria-hidden
        />
        <div className="relative flex items-center gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/15 font-heading text-xl font-medium ring-1 ring-white/20">
            {getInitials(user.name)}
          </span>
          <div className="min-w-0">
            <h1 className="font-heading text-2xl font-semibold">
              Your account
            </h1>
            <p className="truncate text-sm text-white/70">{user.email}</p>
          </div>
        </div>
        <p className="relative mt-5 inline-flex items-center rounded-full bg-white/10 px-3.5 py-1.5 text-xs text-white/80 ring-1 ring-white/15">
          Demo account — changes stay on this device
        </p>
      </section>

      <section className="space-y-5 rounded-3xl bg-white p-5 md:p-6">
        <SectionHeader
          icon={UserRound}
          title="Profile"
          description="How we address you and where updates go."
        />
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
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 brand-green" />
            Location saved for local pricing (
            {user.location.label ?? "Near you"}).
          </p>
        ) : null}
        <Button className="rounded-full px-5" onClick={saveProfile}>
          Save changes
        </Button>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-5 md:p-6">
        <SectionHeader
          icon={Megaphone}
          title="Marketing preferences"
          description="Choose how we keep you in the loop."
        />
        <div className="divide-y divide-border">
          {MARKETING_PREFS.map(([key, label, description]) => (
            <div
              key={key}
              className="flex items-center justify-between gap-4 py-3.5 first:pt-1 last:pb-1"
            >
              <div className="space-y-0.5">
                <Label htmlFor={key} className="font-medium">
                  {label}
                </Label>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Switch
                id={key}
                checked={user.marketingPrefs[key]}
                onCheckedChange={() => togglePref(key)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl bg-white p-5 md:p-6">
        <SectionHeader
          icon={Share2}
          title="Follow EasiShop"
          description="Deals, drops and updates on your feed."
        />
        <div className="flex flex-wrap gap-2">
          {SOCIAL_LINKS.map(([label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-surface-soft px-4 py-2 text-sm font-medium transition-all hover:bg-block-cream active:scale-[0.97]"
            >
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
