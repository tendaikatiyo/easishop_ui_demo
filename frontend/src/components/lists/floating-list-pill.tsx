"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ListChecks } from "lucide-react";
import { useDemoUser } from "@/hooks/use-demo-user";
import { totalListItems } from "@/lib/lists";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function FloatingListPill() {
  const pathname = usePathname();
  const { user } = useDemoUser();
  const count = user ? totalListItems() : 0;

  if (!count || pathname.startsWith("/lists")) return null;

  return (
    <Button
      size="lg"
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-30 rounded-full shadow-lg md:bottom-8"
      render={<Link href="/lists" />}
    >
      <ListChecks className="size-4" />
      Your list
      <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
        {count}
      </Badge>
    </Button>
  );
}
