"use client";

import { useMemo, useState } from "react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";

const SAVINGS_PERCENT = 90;

export default function SavingsCalculator() {
  const [bill, setBill] = useState(3000);

  const monthlySavings = useMemo(() => (bill * SAVINGS_PERCENT) / 100, [bill]);
  const annualSavings = monthlySavings * 12;

  const format = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <section className="py-20 bg-slate-50">
      <Container>
        <SectionHeading eyebrow="Savings Calculator" title="See How Much You Could Save" />
        <div className="max-w-xl mx-auto rounded-2xl bg-white border border-slate-100 shadow-sm p-6 sm:p-8">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <label htmlFor="bill" className="font-medium text-slate-700">
                Monthly Electricity Bill
              </label>
              <span className="font-semibold text-sky-950">₹{format(bill)}</span>
            </div>
            <input
              id="bill"
              type="range"
              min={500}
              max={20000}
              step={100}
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="w-full accent-sun-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="rounded-2xl bg-leaf-500/10 border border-leaf-500/20 p-5 text-center">
              <p className="text-xs text-slate-500 mb-1.5">Est. Monthly Savings</p>
              <p className="text-2xl font-extrabold text-leaf-600">₹{format(monthlySavings)}</p>
            </div>
            <div className="rounded-2xl bg-sun-100 border border-sun-100 p-5 text-center">
              <p className="text-xs text-slate-500 mb-1.5">Est. Annual Savings</p>
              <p className="text-2xl font-extrabold text-sun-700">₹{format(annualSavings)}</p>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center mt-6">
            *Indicative estimate assuming up to {SAVINGS_PERCENT}% bill offset with a correctly
            sized rooftop solar system. Actual savings depend on roof area, consumption pattern
            and sanctioned load.
          </p>
        </div>
      </Container>
    </section>
  );
}
