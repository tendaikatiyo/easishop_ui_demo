"use client";

import { useCallback, useEffect, useState } from "react";
import { getUser } from "@/lib/storage";
import type { DemoUser } from "@/types";

export function useDemoUser() {
  const [user, setUser] = useState<DemoUser | null>(null);

  const refresh = useCallback(() => {
    setUser(getUser());
  }, []);

  useEffect(() => {
    refresh();
    const onUpdate = () => refresh();
    window.addEventListener("easishop:user-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("easishop:user-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  return { user, refresh };
}
