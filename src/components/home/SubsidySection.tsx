import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Container from "@/components/ui/Container";
import { getSiteSettings } from "@/lib/siteSettings";

export default async function SubsidySection() {
  const { subsidySlabs } = await getSiteSettings();

  return (
    <section className="py-20 bg-sky-950 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 90% 10%, #fbbf24 0%, transparent 40%)",
        }}
      />
      <Container className="relative">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8 mb-12">
          <Image
            src="/assets/pm_surya.png"
            alt="PM Surya Ghar Yojana"
            width={160}
            height={160}
            className="h-16 sm:h-24 w-auto shrink-0"
          />
          <p className="text-center text-lg sm:text-xl font-bold text-white flex-1">
            Sun Wave Energies - PM Surya Ghar Yojana Affiliated Partner
          </p>
          <Image
            src="/assets/pm_modi.png"
            alt="Hon'ble Prime Minister of India - PM Surya Ghar Yojana"
            width={400}
            height={200}
            className="h-20 sm:h-36 w-auto shrink-0"
          />
        </div>

        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 items-start">
          <div>
            <span className="inline-block text-sm font-semibold tracking-wide text-sun-400 uppercase mb-3">
              Government Subsidy
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-5">
              Get up to ₹78,000 Subsidy under PM Surya Ghar Yojana
            </h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              The Government of India offers direct subsidy for residential rooftop solar
              installations under the PM Surya Ghar Muft Bijli Yojana. Sun Wave handles the
              complete application and DISCOM approval process for you.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Free consultation & eligibility check",
                "End-to-end subsidy application support",
                "Subsidy credited directly to your bank account",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="h-5 w-5 text-leaf-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href="/subsidy"
              className="inline-flex items-center gap-2 rounded-full bg-sun-700 px-6 py-3 text-sm font-semibold text-white hover:bg-sun-800 hover:-translate-y-0.5 hover:shadow-lg transition-all"
            >
              View Subsidy Details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 py-10 sm:py-12 shadow-2xl max-w-sm mx-auto lg:mx-0 w-full">
            <h3 className="text-base font-bold text-sky-950 mb-6">
              Subsidy Slabs (Residential)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-slate-200">
                    <th className="pb-3 font-semibold">System Capacity</th>
                    <th className="pb-3 font-semibold">Subsidy Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {subsidySlabs.map((row) => (
                    <tr key={row.capacity} className="border-b border-slate-100 last:border-0">
                      <td className="py-4 text-slate-700">{row.capacity}</td>
                      <td className="py-4 font-semibold text-leaf-600">{row.subsidy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-6">
              *Subsidy amounts are indicative and subject to change as per government notification.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
