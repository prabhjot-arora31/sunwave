"use client";

import { useState, FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import StarRatingInput from "@/components/forms/StarRatingInput";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function ReviewForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const comment = String(formData.get("comment") ?? "").trim();
    const rating = Number(formData.get("rating") ?? 0);

    if (!name || !comment) {
      setError("Please fill your name and share a few words about your experience.");
      return;
    }
    if (comment.length < 10) {
      setError("Please share a bit more detail about your experience (at least 10 characters).");
      return;
    }
    if (rating < 1) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
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
          Your review has been submitted and will appear on our site after a quick review by our team.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <span className={labelClass}>Your Rating</span>
        <StarRatingInput name="rating" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" type="text" required className={inputClass} placeholder="e.g. Rajesh Mehta" />
        </div>
        <div>
          <label className={labelClass} htmlFor="city">
            City
          </label>
          <input id="city" name="city" type="text" className={inputClass} placeholder="e.g. Nagpur" />
        </div>
      </div>

      <div>
        <label className={labelClass} htmlFor="systemType">
          Your System (optional)
        </label>
        <input
          id="systemType"
          name="systemType"
          type="text"
          className={inputClass}
          placeholder="e.g. 5 kW Residential On-Grid"
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="comment">
          Your Experience <span className="text-red-500">*</span>
        </label>
        <textarea
          id="comment"
          name="comment"
          required
          rows={4}
          className={inputClass}
          placeholder="Tell us how your installation and experience with Sun Wave went..."
        />
      </div>

      {error && (
        <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors disabled:opacity-70"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Submitting..." : "Submit Your Review"}
      </button>
    </form>
  );
}
