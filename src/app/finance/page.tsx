import type { Metadata } from "next";
import { CheckCircle2, FileText } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CtaBanner from "@/components/ui/CtaBanner";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import EmiCalculator from "@/components/finance/EmiCalculator";
import { financeFeatures, financePartners } from "@/data/content";

export const metadata: Metadata = {
  title: "Solar Finance & EMI",
  description:
    "Solar loan and EMI options from leading banks and NBFCs. Calculate your monthly EMI and apply for solar financing.",
  alternates: { canonical: "/finance" },
};

const documents = [
  "PAN Card & Aadhaar Card",
  "Address proof",
  "Income proof / ITR (last 2 years)",
  "Latest electricity bill",
  "House tax receipt",
];

export default function FinancePage() {
  return (
    <>
      <PageHero
        eyebrow="Finance"
        title="Solar Finance & EMI Facility"
        description="Don't let upfront cost stop you from going solar. Convert your electricity bill into an affordable EMI with our financing partners."
      />

      <section className="py-20 bg-white">
        <Container className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <SectionHeading center={false} eyebrow="Loan Details" title="Financing Made Simple" />
            <div className="grid grid-cols-2 gap-4 mb-8">
              {financeFeatures.map((f) => (
                <div key={f.label} className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
                  <p className="text-xs text-slate-500 mb-1.5">{f.label}</p>
                  <p className="font-bold text-sky-950">{f.value}</p>
                </div>
              ))}
            </div>

            <h3 className="font-bold text-sky-950 mb-3">Our Financing Partners</h3>
            <div className="flex flex-wrap gap-2.5 mb-8">
              {financePartners.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-slate-100 text-slate-700 text-xs font-medium px-3.5 py-2"
                >
                  {p}
                </span>
              ))}
            </div>

            <h3 className="font-bold text-sky-950 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-sun-600" /> Documents Required
            </h3>
            <ul className="space-y-2.5">
              {documents.map((d) => (
                <li key={d} className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-4 w-4 text-leaf-500 shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          <EmiCalculator />
        </Container>
      </section>

      <CtaBanner
        title="Apply for Solar Financing"
        description="Share your details and our finance team will help you get pre-approved."
      />
    </>
  );
}
