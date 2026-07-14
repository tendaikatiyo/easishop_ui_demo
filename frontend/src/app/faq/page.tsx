import { LegalPage } from "@/components/layout/legal-page";

export default function FaqPage() {
  return (
    <LegalPage
      title="FAQ"
      description="Quick answers about using EasiShop."
    >
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-medium text-foreground">How are prices updated?</h2>
          <p>
            We pull live prices from retailer listings. Refresh a list when you
            want the latest numbers — some pages also cache results for a few
            minutes.
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="font-medium text-foreground">
            Can I buy through EasiShop?
          </h2>
          <p>
            Not yet. Compare here, then tap through to the retailer&apos;s own
            site to complete your shop.
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="font-medium text-foreground">Where are my lists saved?</h2>
          <p>
            Lists and profile details for this experience are stored on this
            device. Clearing browser data will reset them.
          </p>
        </div>
        <div className="space-y-1">
          <h2 className="font-medium text-foreground">
            Why is a store missing a price?
          </h2>
          <p>
            Not every product is available at every retailer, and some API
            fields can be empty. Try search again or open another store.
          </p>
        </div>
      </div>
    </LegalPage>
  );
}
