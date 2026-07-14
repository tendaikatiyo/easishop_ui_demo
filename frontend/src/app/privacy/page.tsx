import { LegalPage } from "@/components/layout/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy policy"
      description="How we think about your data on EasiShop."
    >
      <p>
        EasiShop is built to help you compare prices. Profile details, lists and
        preferences you enter in this experience are stored locally in your
        browser on this device.
      </p>
      <p>
        We use product search against the EasiShop API to show live prices and
        images. We don&apos;t sell your personal information.
      </p>
      <p>
        If you use marketing email preferences, that choice is saved with your
        local profile so we can respect it in this demo. Contact us via Feedback
        if you have privacy questions.
      </p>
    </LegalPage>
  );
}
