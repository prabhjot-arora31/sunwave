import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CtaBanner from "@/components/ui/CtaBanner";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { capacityGuide } from "@/data/content";

export const metadata: Metadata = {
  title: "Residential Solar",
  description:
    "Rooftop solar systems for homes and villas from 1kW to 20kW+ with subsidy and EMI support.",
  alternates: { canonical: "/residential" },
};

const benefits = [
  "Save up to 90% on your monthly electricity bill",
  "Government subsidy up to ₹78,000 on residential systems",
  "Easy EMI starting at low monthly installments",
  "25-year panel performance warranty",
  "Net metering support for on-grid systems",
  "Free site survey and system design",
];

export default function ResidentialPage() {
  return (
    <>
      <PageHero
        eyebrow="For Your Home"
        title="Residential Solar Solutions"
        description="Custom-designed rooftop solar systems for independent homes, villas and apartments - sized to your family's power needs."
      />

      <section className="py-20 bg-white">
        <Container className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <SectionHeading
              center={false}
              eyebrow="Why Go Solar at Home"
              title="Benefits of Residential Solar"
            />
            <ul className="space-y-3">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-leaf-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-100 p-6 sm:p-8">
            <h3 className="text-lg font-bold text-sky-950 mb-1">Capacity Guide</h3>
            <p className="text-sm text-slate-500 mb-5">
              Not sure what size you need? Use this as a starting reference.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="pb-3 pr-2 font-semibold">Capacity</th>
                    <th className="pb-3 pr-2 font-semibold">Monthly Bill</th>
                    <th className="pb-3 font-semibold">Ideal For</th>
                  </tr>
                </thead>
                <tbody>
                  {capacityGuide.map((row) => (
                    <tr key={row.capacity} className="border-b border-slate-100 last:border-0">
                      <td className="py-3 pr-2 font-semibold text-sky-950">{row.capacity}</td>
                      <td className="py-3 pr-2 text-slate-600">{row.monthlyBill}</td>
                      <td className="py-3 text-slate-600">{row.idealFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Container>
      </section>

      <CtaBanner
        title="Get a Free Quote for Your Home"
        description="Tell us your monthly bill and we'll recommend the right system size."
      />
    </>
  );
}
