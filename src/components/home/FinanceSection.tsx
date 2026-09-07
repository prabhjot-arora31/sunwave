import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function FinanceSection() {
  const settings = await getSiteSettings();
  const financeFeatures = [
    { label: "Loan amount", value: settings.loanAmount },
    { label: "Interest rate", value: settings.interestRate },
    { label: "Tenure", value: settings.loanTenure },
    { label: "Processing", value: settings.loanProcessing },
  ];
  const financePartners = settings.financePartners;

  return (
    <section className="py-20 bg-slate-50">
      <Container>
        <SectionHeading
          eyebrow="EMI / Finance Facility"
          title="Own Your Solar System with Easy EMI"
          description="No need to pay the full cost upfront - convert your electricity bill into an affordable monthly EMI."
        />
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-5">
            {financeFeatures.map((f) => (
              <div key={f.label} className="rounded-2xl bg-white border border-slate-100 p-6">
                <p className="text-xs text-slate-500 mb-1.5">{f.label}</p>
                <p className="text-lg font-bold text-sky-950">{f.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 p-7">
            <h3 className="text-base font-bold text-sky-950 mb-4">Our Financing Partners</h3>
            <div className="flex flex-wrap gap-2.5 mb-6">
              {financePartners.map((p) => (
                <span
                  key={p}
                  className="rounded-full bg-slate-100 text-slate-700 text-xs font-medium px-3.5 py-2"
                >
                  {p}
                </span>
              ))}
            </div>
            <Link
              href="/finance"
              className="inline-flex items-center gap-2 rounded-full bg-sky-950 px-6 py-3 text-sm font-semibold text-white hover:bg-sky-900 transition-colors"
            >
              Explore Finance Options <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
