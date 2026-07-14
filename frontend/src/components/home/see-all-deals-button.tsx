"use client";

import Link from "next/link";
import { ArrowRight } from "reicon-react";
import { Button } from "@/components/ui/button";

export function SeeAllDealsButton() {
  return (
    <Button
      variant="ghost"
      className="h-10 shrink-0 glass px-5 hover:bg-white/70"
      render={<Link href="/deals" />}
    >
      See all
      <ArrowRight
        size={16}
        className="transition-transform group-hover/button:translate-x-0.5"
        aria-hidden
      />
    </Button>
  );
}
