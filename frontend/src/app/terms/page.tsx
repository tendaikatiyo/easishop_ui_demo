import { LegalPage } from "@/components/layout/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      description="The basics of using EasiShop."
    >
      <p>
        EasiShop is a price-comparison experience. Prices and availability are
        provided for information and may be incomplete or out of date. Always
        confirm the final price with the retailer before you buy.
      </p>
      <p>
        Retailer names, logos and product imagery belong to their respective
        owners. EasiShop is not affiliated with or endorsed by those retailers
        unless stated otherwise.
      </p>
      <p>
        Use the app respectfully. Don&apos;t abuse search or automation in ways
        that disrupt the service.
      </p>
    </LegalPage>
  );
}
