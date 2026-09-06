"use client";

import { useMemo, useState } from "react";

export default function EmiCalculator() {
  const [amount, setAmount] = useState(200000);
  const [rate, setRate] = useState(5);
  const [tenure, setTenure] = useState(5);

  const emi = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = tenure * 12;
    if (monthlyRate === 0) return amount / months;
    const factor = Math.pow(1 + monthlyRate, months);
    return (amount * monthlyRate * factor) / (factor - 1);
  }, [amount, rate, tenure]);

  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - amount;

  const format = (n: number) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 sm:p-8">
      <h3 className="text-lg font-bold text-sky-950 mb-6">Solar Loan EMI Calculator</h3>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <label htmlFor="amount" className="font-medium text-slate-700">
              Loan Amount
            </label>
            <span className="font-semibold text-sky-950">₹{format(amount)}</span>
          </div>
          <input
            id="amount"
            type="range"
            min={50000}
            max={1500000}
            step={10000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-sun-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <label htmlFor="rate" className="font-medium text-slate-700">
              Interest Rate (p.a.)
            </label>
            <span className="font-semibold text-sky-950">{rate.toFixed(1)}%</span>
          </div>
          <input
            id="rate"
            type="range"
            min={5}
            max={15}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-sun-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <label htmlFor="tenure" className="font-medium text-slate-700">
              Loan Tenure
            </label>
            <span className="font-semibold text-sky-950">{tenure} years</span>
          </div>
          <input
            id="tenure"
            type="range"
            min={1}
            max={10}
            step={1}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className="w-full accent-sun-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-slate-100">
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Monthly EMI</p>
          <p className="text-lg sm:text-xl font-extrabold text-sun-600">₹{format(emi)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Total Interest</p>
          <p className="text-lg sm:text-xl font-extrabold text-sky-950">₹{format(totalInterest)}</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-500 mb-1">Total Payment</p>
          <p className="text-lg sm:text-xl font-extrabold text-sky-950">₹{format(totalPayment)}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-5">
        *This is an indicative calculation. Actual EMI depends on the lender&apos;s terms and your
        credit profile.
      </p>
    </div>
  );
}
