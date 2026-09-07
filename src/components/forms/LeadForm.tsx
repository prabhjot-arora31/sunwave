"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const propertyTypes = ["Residential", "Commercial", "Industrial", "Agriculture"];
const capacities = ["1 kW", "2 kW", "3 kW", "5 kW", "6 kW", "10 kW", "15 kW", "20 kW+", "Not Sure"];
const roofTypes = ["RCC", "Tin Shed", "Ground Mount", "Other"];
const connectionTypes = ["Single Phase", "Three Phase", "Not Sure"];
const yesNo = ["Yes", "No", "Not Sure"];

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function LeadForm({
  source = "website",
  variant = "full",
}: {
  source?: string;
  variant?: "full" | "quick";
}) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const fullName = (form.elements.namedItem("fullName") as HTMLInputElement)?.value.trim();
    const mobile = (form.elements.namedItem("mobile") as HTMLInputElement)?.value.trim();
    const address = (form.elements.namedItem("address") as HTMLTextAreaElement)?.value.trim();

    if (!fullName || !mobile || !address) {
      setError("Please fill all required fields marked with *.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile.replace(/\D/g, "").slice(-10))) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    const payload = Object.fromEntries(new FormData(form).entries());

    setSubmitting(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl bg-leaf-500/5 border border-leaf-500/20">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-leaf-500/10 mb-5">
          <CheckCircle2 className="h-9 w-9 text-leaf-600" />
        </span>
        <h3 className="text-2xl font-bold text-sky-950 mb-2">Thank You!</h3>
        <p className="text-slate-600 max-w-md">
          Your request has been received. Our solar consultant will call you within 24 hours
          with a free consultation and quote.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <input type="hidden" name="source" value={source} />
      {variant === "quick" && <input type="hidden" name="propertyType" value="Residential" />}
      <div>
        {variant === "full" && (
          <>
            <h3 className="text-lg font-bold text-sky-950 mb-1">Basic Details</h3>
            <p className="text-sm text-slate-500 mb-5">Tell us a little about yourself.</p>
          </>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass} htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input id="fullName" name="fullName" type="text" required className={inputClass} placeholder="e.g. Rajesh Mehta" />
          </div>
          <div>
            <label className={labelClass} htmlFor="mobile">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input id="mobile" name="mobile" type="tel" required className={inputClass} placeholder="10-digit mobile number" />
          </div>
          {variant === "full" && (
            <>
              <div>
                <label className={labelClass} htmlFor="whatsapp">
                  WhatsApp Number
                </label>
                <input id="whatsapp" name="whatsapp" type="tel" className={inputClass} placeholder="If different from mobile" />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">
                  Email
                </label>
                <input id="email" name="email" type="email" className={inputClass} placeholder="you@example.com" />
              </div>
            </>
          )}
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="address">
              Address <span className="text-red-500">*</span>
            </label>
            <textarea id="address" name="address" required rows={2} className={inputClass} placeholder="House no., street, area" />
          </div>
          {variant === "full" && (
            <>
              <div>
                <label className={labelClass} htmlFor="city">
                  City
                </label>
                <input id="city" name="city" type="text" className={inputClass} placeholder="e.g. Nagpur" />
              </div>
              <div>
                <label className={labelClass} htmlFor="pincode">
                  Pincode
                </label>
                <input id="pincode" name="pincode" type="text" inputMode="numeric" maxLength={6} className={inputClass} placeholder="e.g. 440026" />
              </div>
            </>
          )}
        </div>
      </div>

      {variant === "full" && (
      <div>
        <h3 className="text-lg font-bold text-sky-950 mb-1">Solar Requirement</h3>
        <p className="text-sm text-slate-500 mb-5">
          Help us design the right system and quote for you.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <span className={labelClass}>Property Type</span>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-2 rounded-lg border border-slate-300 px-3.5 py-2 text-sm cursor-pointer has-[:checked]:border-sun-500 has-[:checked]:bg-sun-50 has-[:checked]:text-sun-700 transition"
                >
                  <input type="radio" name="propertyType" value={type} defaultChecked={type === "Residential"} className="accent-sun-500" />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="monthlyBill">
              Current Monthly Electricity Bill (₹)
            </label>
            <input id="monthlyBill" name="monthlyBill" type="number" min={0} className={inputClass} placeholder="e.g. 3500" />
          </div>
          <div>
            <label className={labelClass} htmlFor="monthlyUnits">
              Average Monthly Units (kWh)
            </label>
            <input id="monthlyUnits" name="monthlyUnits" type="number" min={0} className={inputClass} placeholder="e.g. 350" />
          </div>

          <div>
            <label className={labelClass} htmlFor="connectionType">
              Electricity Connection Type
            </label>
            <select id="connectionType" name="connectionType" className={inputClass} defaultValue="">
              <option value="" disabled>
                Select connection type
              </option>
              {connectionTypes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="capacity">
              Preferred Solar Capacity
            </label>
            <select id="capacity" name="capacity" className={inputClass} defaultValue="">
              <option value="" disabled>
                Select capacity
              </option>
              {capacities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={labelClass} htmlFor="roofType">
              Roof Type
            </label>
            <select id="roofType" name="roofType" className={inputClass} defaultValue="">
              <option value="" disabled>
                Select roof type
              </option>
              {roofTypes.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="installDate">
              Preferred Installation Date
            </label>
            <input id="installDate" name="installDate" type="date" className={inputClass} />
          </div>

          <div>
            <label className={labelClass} htmlFor="battery">
              Battery Required?
            </label>
            <select id="battery" name="battery" className={inputClass} defaultValue="Not Sure">
              {yesNo.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="finance">
              Finance Required?
            </label>
            <select id="finance" name="finance" className={inputClass} defaultValue="Not Sure">
              {yesNo.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="subsidy">
              Subsidy Required?
            </label>
            <select id="subsidy" name="subsidy" className={inputClass} defaultValue="Not Sure">
              {yesNo.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="message">
              Message / Requirement
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              className={inputClass}
              placeholder="Tell us anything else about your requirement..."
            />
          </div>
        </div>
      </div>
      )}

      {error && (
        <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      <div className="flex flex-col items-start gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors disabled:opacity-70"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Submitting..." : variant === "quick" ? "Request a Callback" : "Get My Free Quote"}
        </button>
        <p className="text-xs text-slate-500">
          By submitting, you agree to our{" "}
          <a href="/privacy-policy" className="underline hover:text-sun-700">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms-and-conditions" className="underline hover:text-sun-700">
            Terms & Conditions
          </a>
          .
        </p>
      </div>
    </form>
  );
}
