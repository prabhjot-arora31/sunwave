"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Lead } from "@prisma/client";
import { Loader2, Plus, Trash2, Search, X } from "lucide-react";

type LineItem = { description: string; quantity: string; rate: string };

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function NewInvoicePage() {
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
  const [customerEmail, setCustomerEmail] = useState("");

  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: "1", rate: "" }]);
  const [gstRate, setGstRate] = useState("5");

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
    setCustomerEmail(lead.email ?? "");
    setLeadSearch("");
    setLeadResults([]);
  }

  function clearLead() {
    setLeadId(null);
  }

  function updateItem(index: number, field: keyof LineItem, value: string) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, { description: "", quantity: "1", rate: "" }]);
  }

  function removeItem(index: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  const parsedItems = items.map((it) => ({
    description: it.description,
    quantity: Number(it.quantity) || 0,
    rate: Number(it.rate) || 0,
    amount: (Number(it.quantity) || 0) * (Number(it.rate) || 0),
  }));
  const subtotal = parsedItems.reduce((sum, i) => sum + i.amount, 0);
  const gstAmount = (subtotal * (Number(gstRate) || 0)) / 100;
  const total = subtotal + gstAmount;
  const format = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  async function handleSubmit() {
    setError("");
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      setError("Customer name, phone and address are required.");
      return;
    }
    if (parsedItems.some((i) => !i.description.trim() || i.rate <= 0 || i.quantity <= 0)) {
      setError("Every line item needs a description, quantity and rate greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: leadId ?? undefined,
          customerName,
          customerPhone,
          customerAddress,
          customerEmail: customerEmail || undefined,
          items: parsedItems.map(({ description, quantity, rate }) => ({ description, quantity, rate })),
          gstRate: Number(gstRate) || 0,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to create invoice");
      }
      const data = await res.json();
      router.push(`/admin/invoices/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Invoice</h1>
        <p className="text-sm text-slate-500 mt-1">Create a GST invoice for a customer.</p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-sky-950 mb-1">Customer Details</h3>
          <p className="text-sm text-slate-500 mb-4">
            Link an existing lead to auto-fill details, or enter them manually.
          </p>

          {leadId ? (
            <div className="flex items-center justify-between rounded-lg bg-sun-50 border border-sun-100 px-4 py-2.5 mb-4 text-sm">
              <span className="text-sun-700 font-medium">Linked to lead #{leadId}</span>
              <button onClick={clearLead} className="text-slate-500 hover:text-red-600" aria-label="Unlink lead">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={leadSearch}
                onChange={(e) => setLeadSearch(e.target.value)}
                placeholder="Search a lead by name, mobile or email..."
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
              <label className={labelClass}>Email</label>
              <input value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className={inputClass} />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-sky-950 mb-1">Line Items</h3>
          <p className="text-sm text-slate-500 mb-4">Add each billable item - e.g. system capacity, installation, accessories.</p>

          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-start">
                <input
                  value={item.description}
                  onChange={(e) => updateItem(i, "description", e.target.value)}
                  placeholder="e.g. 3kW On-Grid Solar System"
                  className={`${inputClass} col-span-6`}
                />
                <input
                  type="number"
                  min={0}
                  value={item.quantity}
                  onChange={(e) => updateItem(i, "quantity", e.target.value)}
                  placeholder="Qty"
                  className={`${inputClass} col-span-2`}
                />
                <input
                  type="number"
                  min={0}
                  value={item.rate}
                  onChange={(e) => updateItem(i, "rate", e.target.value)}
                  placeholder="Rate (₹)"
                  className={`${inputClass} col-span-3`}
                />
                <button
                  onClick={() => removeItem(i)}
                  disabled={items.length === 1}
                  className="col-span-1 p-2.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-30"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800"
          >
            <Plus className="h-4 w-4" /> Add Line Item
          </button>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-3">
            <label className={labelClass}>GST Rate (%)</label>
            <input
              type="number"
              min={0}
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm text-right"
            />
          </div>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{format(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>GST ({gstRate || 0}%)</span>
              <span>₹{format(gstAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-sky-950 pt-2 border-t border-slate-100">
              <span>Total</span>
              <span>₹{format(total)}</span>
            </div>
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
          {submitting ? "Creating..." : "Create Invoice"}
        </button>
      </div>
    </div>
  );
}
