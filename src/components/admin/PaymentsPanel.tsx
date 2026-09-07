"use client";

import { useEffect, useState } from "react";
import type { Payment } from "@prisma/client";
import { Loader2, Plus, Trash2, AlertCircle } from "lucide-react";
import { PAYMENT_METHODS } from "@/lib/paymentSchema";

const format = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function PaymentsPanel({
  invoiceId,
  total,
  onStatusChange,
}: {
  invoiceId: number;
  total: number;
  onStatusChange?: () => void;
}) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<string>(PAYMENT_METHODS[0]);
  const [paidOn, setPaidOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch(`/api/admin/invoices/${invoiceId}/payments`)
      .then((res) => res.json())
      .then((data) => setPayments(data.payments ?? []))
      .finally(() => setLoading(false));
  }

  useEffect(load, [invoiceId]);

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const due = Math.max(0, total - totalPaid);

  async function handleAddPayment() {
    setError("");
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid payment amount.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, method, paidOn, notes: notes || undefined }),
      });
      if (!res.ok) throw new Error("Failed to record payment");
      setAmount("");
      setNotes("");
      setShowForm(false);
      load();
      onStatusChange?.();
    } catch {
      setError("Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(paymentId: number) {
    setDeletingId(paymentId);
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}/payments/${paymentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete payment");
      load();
      onStatusChange?.();
    } catch {
      setError("Failed to delete payment");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="print:hidden rounded-2xl bg-white border border-slate-200 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-sky-950">Payments</h3>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sun-700 hover:text-sun-800"
        >
          <Plus className="h-4 w-4" /> Record Payment
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
          <p className="text-xs text-slate-500">Total</p>
          <p className="font-bold text-slate-900">₹{format(total)}</p>
        </div>
        <div className="rounded-xl bg-leaf-500/10 border border-leaf-500/20 p-3">
          <p className="text-xs text-slate-500">Paid</p>
          <p className="font-bold text-leaf-700">₹{format(totalPaid)}</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
          <p className="text-xs text-slate-500">Due</p>
          <p className="font-bold text-amber-700">₹{format(due)}</p>
        </div>
      </div>

      {showForm && (
        <div className="rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount (₹)"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
            />
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={paidOn}
              onChange={(e) => setPaidOn(e.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
            />
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
            />
          </div>
          <button
            onClick={handleAddPayment}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-sun-700 px-5 py-2 text-sm font-semibold text-white hover:bg-sun-800 transition-colors disabled:opacity-70"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Saving..." : "Save Payment"}
          </button>
        </div>
      )}

      {error && (
        <p className="flex items-center gap-2 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}

      {loading ? (
        <p className="text-xs text-slate-400">Loading payments...</p>
      ) : payments.length === 0 ? (
        <p className="text-xs text-slate-400">No payments recorded yet.</p>
      ) : (
        <ul className="space-y-2">
          {payments.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3.5 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-900">₹{format(p.amount)} · {p.method}</p>
                <p className="text-xs text-slate-500">
                  {new Date(p.paidOn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  {p.notes ? ` · ${p.notes}` : ""}
                </p>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                disabled={deletingId === p.id}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-50"
                aria-label="Delete payment"
              >
                {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
