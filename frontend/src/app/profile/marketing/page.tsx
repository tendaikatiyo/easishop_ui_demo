"use client";

import { Megaphone } from "lucide-react";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProfileSectionHeader } from "@/components/profile/profile-ui";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDemoUser } from "@/hooks/use-demo-user";
import { updateUser } from "@/lib/storage";

export default function MarketingPreferencesPage() {
  const { user, refresh } = useDemoUser();

  if (!user) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  function toggleEmailMarketing(checked: boolean) {
    updateUser({
      marketingPrefs: {
        ...user!.marketingPrefs,
        emailMarketing: checked,
      },
    });
    refresh();
    toast.success(
      checked
        ? "You’re opted in to marketing emails"
        : "Marketing emails turned off"
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Profile", href: "/profile" },
          { label: "Marketing" },
        ]}
      />

      <section className="space-y-5 rounded-3xl bg-white p-5 md:p-6">
        <ProfileSectionHeader
          icon={Megaphone}
          title="Marketing preferences"
          description="Control whether we can email you about deals and updates."
        />

        <div className="flex items-center justify-between gap-4 rounded-3xl bg-surface-soft px-4 py-4">
          <div className="space-y-0.5">
            <Label htmlFor="emailMarketing" className="font-medium">
              Marketing emails
            </Label>
            <p className="text-sm text-muted-foreground">
              I consent to receiving marketing emails from EasiShop.
            </p>
          </div>
          <Switch
            id="emailMarketing"
            checked={user.marketingPrefs.emailMarketing}
            onCheckedChange={toggleEmailMarketing}
          />
        </div>
      </section>
    </div>
  );
}
