import { LegalPage } from "@/components/layout/legal-page";

export default function AboutPage() {
  return (
    <LegalPage
      title="About"
      description="What EasiShop is for."
    >
      <p>
        EasiShop helps South Africans compare grocery prices across Checkers,
        Pick n Pay, Shoprite, Woolworths and Dis-Chem — so you can find a better
        deal before you leave home.
      </p>
      <p>
        Search products, build shopping lists, and see who&apos;s cheapest for
        each item. Prices come from live retailer listings and can change
        throughout the day.
      </p>
    </LegalPage>
  );
}
