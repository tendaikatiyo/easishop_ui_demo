import type { Metadata } from "next";
import { ErrorPageView } from "@/components/layout/error-page-view";

export const metadata: Metadata = {
  title: "Page not found | EasiShop",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <ErrorPageView
      code="404"
      title="We couldn’t find that page"
      description="The link may be outdated, or the product / store moved. Search for what you need, or jump back into stores and deals."
      primaryHref="/"
      primaryLabel="Back home"
    />
  );
}
