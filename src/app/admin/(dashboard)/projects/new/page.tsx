"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@prisma/client";
import { Loader2, Search, X } from "lucide-react";
import { PROJECT_STAGES } from "@/lib/projectStage";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function NewProjectPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [leadId, setLeadId] = useState<number | null>(null);
  const [leadSearch, setLeadSearch] = useState("");
  const [leadResults, setLeadResults] = useState<Lead[]>([]);
  const [searchingLeads, setSearchingLeads] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [capacity, setCapacity] = useState("");
  const [stage, setStage] = useState<string>(PROJECT_STAGES[0]);

  useEffect(() => {
    if (leadSearch.trim().length < 2) {
      setLeadResults([]);
      return;
    }
    let cancelled = false;
    setSearchingLeads(true);
    const t = setTimeout(() => {
      fetch(`/api/admin/leads?search=${encodeURIComponent(leadSearch)}&pageSize=8`)
        .then((res) => res.json())
        .then((data) => {
          if (!cancelled) setLeadResults(data.leads ?? []);
        })
        .finally(() => {
          if (!cancelled) setSearchingLeads(false);
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [leadSearch]);

  function pickLead(lead: Lead) {
    setLeadId(lead.id);
    setCustomerName(lead.fullName);
    setCustomerPhone(lead.mobile);
    setCustomerAddress(lead.address);
    if (lead.capacity) setCapacity(lead.capacity);
    setLeadSearch("");
    setLeadResults([]);
  }

  async function handleSubmit() {
    setError("");
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim() || !capacity.trim()) {
      setError("Customer name, phone, address and capacity are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: leadId ?? undefined,
          customerName,
          customerPhone,
          customerAddress,
          capacity,
          stage,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to create project");
      }
      const data = await res.json();
      router.push(`/admin/projects/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Project</h1>
        <p className="text-sm text-slate-500 mt-1">Start tracking an installation from site survey to subsidy credit.</p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
        {leadId ? (
          <div className="flex items-center justify-between rounded-lg bg-sun-50 border border-sun-100 px-4 py-2.5 text-sm">
            <span className="text-sun-700 font-medium">Linked to lead #{leadId}</span>
            <button onClick={() => setLeadId(null)} className="text-slate-500 hover:text-red-600" aria-label="Unlink lead">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={leadSearch}
              onChange={(e) => setLeadSearch(e.target.value)}
              placeholder="Search a lead to auto-fill, or skip and enter manually..."
              className={`${inputClass} pl-9`}
            />
            {searchingLeads && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
            )}
            {leadResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
                {leadResults.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => pickLead(lead)}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm border-b border-slate-50 last:border-0"
                  >
                    <p className="font-semibold text-slate-900">{lead.fullName}</p>
                    <p className="text-xs text-slate-500">{lead.mobile} · {lead.city ?? "-"}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address *</label>
            <textarea value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>System Capacity *</label>
            <input
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="e.g. 3 kW"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Starting Stage</label>
            <select value={stage} onChange={(e) => setStage(e.target.value)} className={inputClass}>
              {PROJECT_STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors disabled:opacity-70"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {submitting ? "Creating..." : "Create Project"}
        </button>
      </div>
    </div>
  );
}
