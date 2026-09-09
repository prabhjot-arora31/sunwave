import type { Metadata } from "next";
import { CheckCircle2, Building2, Factory } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import CtaBanner from "@/components/ui/CtaBanner";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Commercial & Industrial Solar",
  description:
    "Solar solutions for offices, retail, factories and industrial units to reduce operating costs.",
  alternates: { canonical: "/commercial" },
};

const commercialBenefits = [
  "Accelerated depreciation benefit up to 40% in the first year",
  "Reduce operating costs and improve profit margins",
  "Custom capacity from 10 kW to 500 kW",
  "Enhances ESG and sustainability credentials",
];

const industrialBenefits = [
  "Large-scale rooftop and ground-mount systems (500kW - MW scale)",
  "Open access and group captive solar options",
  "Power Purchase Agreement (PPA) models available - zero upfront cost",
  "Dedicated project management and O&M support",
];

export default function CommercialPage() {
  return (
    <>
      <PageHero
        eyebrow="For Businesses"
        title="Commercial & Industrial Solar"
        description="Reduce your operating costs with solar solutions designed for offices, retail, factories and large industrial units."
      />

      <Reveal><section className="py-20 bg-white">
        <Container className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-7 sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-950 text-sun-400 mb-5">
              <Building2 className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-bold text-sky-950 mb-4">Commercial Solar</h2>
            <p className="text-slate-600 mb-5">
              Ideal for offices, shops, schools, hospitals and warehouses looking to cut
              electricity expenses and lock in long-term savings.
            </p>
            <ul className="space-y-3">
              {commercialBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-leaf-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-7 sm:p-8">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-950 text-sun-400 mb-5">
              <Factory className="h-6 w-6" />
            </span>
            <h2 className="text-2xl font-bold text-sky-950 mb-4">Industrial Solar</h2>
            <p className="text-slate-600 mb-5">
              Large-scale solar for factories, manufacturing plants and industrial estates,
              with flexible ownership and financing models.
            </p>
            <ul className="space-y-3">
              {industrialBenefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-leaf-500 shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section></Reveal>

      <Reveal><section className="py-20 bg-slate-50">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="How We Work with Businesses"
            description="A structured approach to deliver commercial and industrial solar projects on time and on budget."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Energy Audit", desc: "Analyze your load profile and consumption pattern." },
              { step: "02", title: "Feasibility & Design", desc: "Site assessment, capacity sizing and financial modeling." },
              { step: "03", title: "Execution", desc: "Procurement, installation and commissioning by certified teams." },
              { step: "04", title: "O&M Support", desc: "Ongoing monitoring, maintenance and performance reporting." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl bg-white border border-slate-100 p-6">
                <span
                  aria-hidden="true"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-sun-700 text-white text-sm font-bold"
                >
                  {s.step.replace(/^0/, "")}
                </span>
                <h3 className="font-bold text-sky-950 mt-3 mb-1.5">{s.title}</h3>
                <p className="text-sm text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section></Reveal>

      <Reveal>
        <CtaBanner
          title="Cut Your Business Electricity Costs"
          description="Request a free energy audit and custom proposal for your business."
        />
      </Reveal>
    </>
  );
}
