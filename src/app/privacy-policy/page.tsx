import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import LegalContent from "@/components/ui/LegalContent";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Sun Wave Solar's privacy policy on how we collect, use and protect your data.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" description="Last updated: January 2026" />
      <LegalContent>
        <p>
          {company.fullName} (&quot;Sun Wave&quot;, &quot;we&quot;, &quot;us&quot;) respects your
          privacy. This policy explains what information we collect through this website and
          how it is used.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>Contact details such as name, phone number, WhatsApp number and email address.</li>
          <li>Property details such as address, city, pincode and roof type.</li>
          <li>Electricity usage details such as monthly bill and average consumption.</li>
          <li>Any additional information you choose to share in the enquiry form.</li>
        </ul>

        <h2>How We Use Your Information</h2>
        <ul>
          <li>To respond to your enquiry and provide a free consultation or quote.</li>
          <li>To design a solar system suited to your property and requirements.</li>
          <li>To assist with subsidy applications and financing, where requested.</li>
          <li>To contact you via call, SMS or WhatsApp regarding your enquiry.</li>
        </ul>

        <h2>Data Sharing</h2>
        <p>
          We do not sell your personal information. Data may be shared with our financing and
          subsidy-processing partners strictly to fulfil services you have requested.
        </p>

        <h2>Data Security</h2>
        <p>
          We take reasonable technical and organizational measures to protect your information
          from unauthorized access, alteration or disclosure.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data at any
          time by contacting us at {company.email}.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on
          this page.
        </p>
      </LegalContent>
    </>
  );
}
