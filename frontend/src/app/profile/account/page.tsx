"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Settings2 } from "reicon-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProfileSectionHeader } from "@/components/profile/profile-ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDemoUser } from "@/hooks/use-demo-user";
import { deleteAccount } from "@/lib/storage";

export default function AccountSettingsPage() {
  const router = useRouter();
  const { user, refresh } = useDemoUser();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!user) {
    return (
      <div className="py-20 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  function onDelete() {
    deleteAccount();
    refresh();
    setConfirmOpen(false);
    toast.success("Account deleted");
    router.push("/");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-rise">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Profile", href: "/profile" },
          { label: "Account" },
        ]}
      />

      <section className="space-y-5 rounded-3xl bg-white p-5 md:p-6">
        <ProfileSectionHeader
          icon={Settings2}
          title="Account settings"
          description="Manage your EasiShop account."
        />

        <div className="space-y-3 rounded-3xl bg-red-50 px-4 py-4">
          <div className="space-y-1">
            <p className="font-medium text-destructive">Delete account</p>
            <p className="text-sm text-muted-foreground">
              This permanently clears your profile, lists, and preferences. You
              can’t undo it.
            </p>
          </div>
          <Button
            variant="destructive"
            className="rounded-full px-5"
            onClick={() => setConfirmOpen(true)}
          >
            Delete my account
          </Button>
        </div>
      </section>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete your account?</DialogTitle>
            <DialogDescription>
              Your profile, lists, and preferences will be wiped and reset. This
              can’t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              className="h-11 rounded-full bg-zinc-100 px-5 hover:bg-zinc-200"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="h-11 rounded-full px-5"
              onClick={onDelete}
            >
              Yes, delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
