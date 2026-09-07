import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CtaBanner from "@/components/ui/CtaBanner";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { subsidySteps } from "@/data/content";
import { getSiteSettings } from "@/lib/siteSettings";

export const metadata: Metadata = {
  title: "Solar Subsidy",
  description:
    "Everything you need to know about the PM Surya Ghar Muft Bijli Yojana subsidy for residential rooftop solar.",
  alternates: { canonical: "/subsidy" },
};

const eligibility = [
  "Applicant should be an Indian resident with a valid electricity connection.",
  "Property should have a suitable, shadow-free rooftop for solar installation.",
  "Subsidy applies to residential rooftop systems only (up to 3kW per household for full slab benefit).",
  "The installation must be carried out by an empanelled vendor such as Sun Wave.",
];

export default async function SubsidyPage() {
  const { subsidySlabs } = await getSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="Government Scheme"
        title="Solar Subsidy - PM Surya Ghar Yojana"
        description="Get up to ₹78,000 subsidy from the Government of India on your residential rooftop solar system."
      />

      <section className="py-10 bg-white border-b border-slate-100">
        <Container className="flex flex-col items-center text-center gap-4">
          <Image
            src="/assets/pm_surya.png"
            alt="PM Surya Ghar Yojana"
            width={160}
            height={160}
            className="h-16 w-auto"
          />
          <p className="text-2xl sm:text-3xl font-extrabold text-sky-950">
            Get up to <span className="text-leaf-600">₹78,000</span> Subsidy from the Government
          </p>
          <span className="inline-flex items-center rounded-full bg-sun-100 text-sun-700 text-sm font-bold px-5 py-2">
            0 Down Payment
          </span>
        </Container>
      </section>

      <section className="py-20 bg-white">
        <Container className="grid lg:grid-cols-2 gap-12">
          <div>
            <SectionHeading center={false} eyebrow="Subsidy Slabs" title="How Much Can You Save?" />
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left bg-slate-50 text-slate-500">
                    <th className="px-5 py-3 font-semibold">System Capacity</th>
                    <th className="px-5 py-3 font-semibold">Subsidy Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {subsidySlabs.map((row) => (
                    <tr key={row.capacity} className="border-t border-slate-100">
                      <td className="px-5 py-3.5 text-slate-700">{row.capacity}</td>
                      <td className="px-5 py-3.5 font-semibold text-leaf-600">{row.subsidy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-3">
              *Indicative figures based on the PM Surya Ghar Muft Bijli Yojana. Actual subsidy is
              disbursed by the government and subject to change.
            </p>
          </div>

          <div>
            <SectionHeading center={false} eyebrow="Eligibility" title="Who Can Apply?" />
            <ul className="space-y-3">
              {eligibility.map((e) => (
                <li key={e} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-leaf-500 shrink-0 mt-0.5" />
                  {e}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-20 bg-slate-50">
        <Container>
          <SectionHeading
            eyebrow="Application Process"
            title="How to Apply for Solar Subsidy"
            description="Sun Wave manages this entire process for you, end-to-end."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subsidySteps.map((step, i) => (
              <div key={step} className="rounded-2xl bg-white border border-slate-100 p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sun-700 text-white text-sm font-bold mb-4">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Check Your Subsidy Eligibility"
        description="Share your electricity bill details and we'll calculate your subsidy amount for free."
      />
    </>
  );
}
