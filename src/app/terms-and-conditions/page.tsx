import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import LegalContent from "@/components/ui/LegalContent";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the Sun Wave Solar website and services.",
  alternates: { canonical: "/terms-and-conditions" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms & Conditions" description="Last updated: January 2026" />
      <LegalContent>
        <p>
          By accessing or using this website, you agree to be bound by the following terms and
          conditions. Please read them carefully.
        </p>

        <h2>Use of Website</h2>
        <p>
          This website is provided for informational purposes to help you learn about solar
          products and request a consultation or quote from {company.fullName}. You agree to
          provide accurate information when submitting any enquiry form.
        </p>

        <h2>Quotations & Pricing</h2>
        <p>
          Prices, subsidy amounts and EMI figures shown on this website are indicative and
          subject to change based on site conditions, government notifications and prevailing
          market rates. A final quotation will be shared after a site survey.
        </p>

        <h2>Installation Services</h2>
        <p>
          All installation services are subject to a separate service agreement executed at the
          time of order confirmation, including scope of work, timelines and payment terms.
        </p>

        <h2>Intellectual Property</h2>
        <p>
          All content on this website, including text, images and graphics, is the property of
          {" "}{company.fullName} and may not be reproduced without prior written consent.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          {company.fullName} shall not be liable for any indirect or consequential loss arising
          from the use of this website or reliance on information provided herein.
        </p>

        <h2>Governing Law</h2>
        <p>
          These terms shall be governed by the laws of India, with courts in Nagpur, Maharashtra
          having exclusive jurisdiction.
        </p>

        <h2>Contact</h2>
        <p>For any questions regarding these terms, contact us at {company.email}.</p>
      </LegalContent>
    </>
  );
}
