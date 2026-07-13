"use client";

import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getUser, updateUser } from "@/lib/storage";
import { track } from "@/lib/analytics";

const LOCATION_ASKED_KEY = "easishop.demo.locationAsked";

export function LocationPrompt() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const asked = localStorage.getItem(LOCATION_ASKED_KEY);
    const user = getUser();
    if (!asked && !user.location && user.onboardingSeen) {
      const t = setTimeout(() => setOpen(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  function markAsked() {
    localStorage.setItem(LOCATION_ASKED_KEY, "1");
    setOpen(false);
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      markAsked();
      track("location_denied", { reason: "unsupported" });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateUser({
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            label: "Near you",
            updatedAt: new Date().toISOString(),
          },
        });
        track("location_granted");
        markAsked();
      },
      () => {
        track("location_denied");
        markAsked();
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && markAsked()}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="font-heading flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Shop deals near you
          </SheetTitle>
          <SheetDescription>
            We&apos;re adding location-based pricing. Share your location so we
            can show the right store prices for your area.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 flex gap-2 px-4 pb-6">
          <Button
            variant="ghost"
            className="h-11 flex-1 rounded-full bg-zinc-100 hover:bg-zinc-200"
            onClick={markAsked}
          >
            Not now
          </Button>
          <Button
            className="h-11 flex-1 rounded-full bg-primary hover:bg-primary/90"
            onClick={requestLocation}
          >
            Use my location
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
