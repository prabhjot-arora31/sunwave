import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import LegalContent from "@/components/ui/LegalContent";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Disclaimer regarding solar savings, subsidy and finance information on this website.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <>
      <PageHero title="Disclaimer" description="Last updated: January 2026" />
      <LegalContent>
        <h2>Savings & Performance Estimates</h2>
        <p>
          Electricity bill savings, unit generation and payback period figures mentioned on this
          website are estimates based on average irradiation and consumption data. Actual
          savings may vary depending on location, shading, roof orientation, weather conditions
          and electricity tariffs.
        </p>

        <h2>Government Subsidy</h2>
        <p>
          Subsidy amounts referenced on this website are based on the PM Surya Ghar Muft Bijli
          Yojana guidelines available at the time of publishing. Subsidy disbursement is at the
          sole discretion of the Government of India / respective DISCOM and {company.fullName}
          {" "}does not guarantee any subsidy amount or approval timeline.
        </p>

        <h2>Finance & EMI</h2>
        <p>
          EMI calculations shown on this website are indicative only. Actual loan approval,
          interest rate and tenure are determined solely by the respective bank or NBFC based on
          their credit policy.
        </p>

        <h2>Third-Party Links</h2>
        <p>
          This website may contain links to third-party websites (such as bank or government
          portals) for your convenience. {company.fullName} is not responsible for the content
          or privacy practices of such external websites.
        </p>

        <h2>Product Images</h2>
        <p>
          Images used on this website are for illustrative purposes and actual products
          supplied may vary in appearance from the images shown.
        </p>
      </LegalContent>
    </>
  );
}
