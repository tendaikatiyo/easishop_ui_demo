"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { ErrorPageView } from "@/components/layout/error-page-view";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorPageView
      code="Error"
      title="Something went wrong"
      description="We hit a snag loading this page. Try again, or pick up shopping from search, stores, or your lists."
      primaryHref="/"
      primaryLabel="Back home"
      secondaryAction={
        <Button
          type="button"
          variant="outline"
          className="h-11 rounded-full bg-white px-6"
          onClick={() => reset()}
        >
          <RotateCcw size={16} aria-hidden />
          Try again
        </Button>
      }
      showPopularSearches
    />
  );
}
