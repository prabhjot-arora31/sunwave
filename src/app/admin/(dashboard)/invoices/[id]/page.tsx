"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Invoice } from "@prisma/client";
import { ArrowLeft, Printer, Trash2, Loader2, AlertCircle } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { INVOICE_STATUSES, INVOICE_STATUS_COLORS, type InvoiceStatus } from "@/lib/invoiceStatus";
import { company } from "@/data/site";

type InvoiceItem = { description: string; quantity: number; rate: number; amount: number };

const format = (n: number) =>
  new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export default function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/invoices/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invoice not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setInvoice(data.invoice);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function updateStatus(newStatus: InvoiceStatus) {
    if (!invoice) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setInvoice({ ...invoice, status: newStatus });
    } catch {
      setError("Failed to update invoice status");
    } finally {
      setUpdating(false);
    }
  }

  async function confirmDeleteInvoice() {
    if (!invoice) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete invoice");
      router.push("/admin/invoices");
    } catch {
      setError("Failed to delete invoice");
      setDeleting(false);
    }
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const items = (invoice.items as unknown as InvoiceItem[]) ?? [];
  const cgst = invoice.gstAmount / 2;
  const sgst = invoice.gstAmount / 2;

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Link href="/admin/invoices" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-950">
          <ArrowLeft className="h-4 w-4" /> Back to Invoices
        </Link>
        <div className="flex items-center gap-2">
          <select
            aria-label="Update invoice status"
            value={invoice.status}
            disabled={updating}
            onChange={(e) => updateStatus(e.target.value as InvoiceStatus)}
            className={`text-xs font-semibold rounded-full px-3 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-sun-500/30 ${INVOICE_STATUS_COLORS[invoice.status as InvoiceStatus] ?? "bg-slate-100 text-slate-600"}`}
          >
            {INVOICE_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-full bg-sun-700 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors"
          >
            <Printer className="h-4 w-4" /> Print
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600"
            aria-label="Delete invoice"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 shadow-sm print:border-0 print:shadow-none print:rounded-none p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div>
            <Image src="/logo.png" alt={company.name} width={395} height={182} className="h-12 w-auto mb-3" />
            <p className="font-bold text-sky-950">{company.fullName}</p>
            <p className="text-xs text-slate-500 max-w-xs mt-0.5">{company.address}</p>
            <p className="text-xs text-slate-500 mt-0.5">{company.phone} · {company.email}</p>
            {company.gstin && <p className="text-xs text-slate-500 mt-0.5">GSTIN: {company.gstin}</p>}
          </div>
          <div className="text-left sm:text-right">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">TAX INVOICE</h1>
            <p className="text-sm text-slate-500 mt-1">
              Invoice #: <span className="font-semibold text-slate-900">{invoice.invoiceNumber}</span>
            </p>
            <p className="text-sm text-slate-500">
              Date:{" "}
              <span className="font-semibold text-slate-900">
                {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            </p>
          </div>
        </div>

        <div className="py-6 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">Bill To</p>
          <p className="font-bold text-slate-900">{invoice.customerName}</p>
          <p className="text-sm text-slate-600 max-w-sm">{invoice.customerAddress}</p>
          <p className="text-sm text-slate-600">{invoice.customerPhone}</p>
          {invoice.customerEmail && <p className="text-sm text-slate-600">{invoice.customerEmail}</p>}
        </div>

        <table className="w-full text-sm mt-6">
          <thead>
            <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b-2 border-slate-900">
              <th className="pb-2.5 font-semibold">Description</th>
              <th className="pb-2.5 font-semibold text-right">Qty</th>
              <th className="pb-2.5 font-semibold text-right">Rate (₹)</th>
              <th className="pb-2.5 font-semibold text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-3 text-slate-800">{item.description}</td>
                <td className="py-3 text-right text-slate-600">{item.quantity}</td>
                <td className="py-3 text-right text-slate-600">{format(item.rate)}</td>
                <td className="py-3 text-right font-medium text-slate-900">{format(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-6">
          <div className="w-full max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{format(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>CGST ({(invoice.gstRate / 2).toFixed(2)}%)</span>
              <span>₹{format(cgst)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>SGST ({(invoice.gstRate / 2).toFixed(2)}%)</span>
              <span>₹{format(sgst)}</span>
            </div>
            <div className="flex justify-between text-lg font-extrabold text-slate-900 pt-2.5 border-t-2 border-slate-900">
              <span>Total</span>
              <span>₹{format(invoice.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-between items-end">
          <p className="text-xs text-slate-400 max-w-xs">
            This is a computer-generated invoice. GST assumes intra-state supply (CGST + SGST) -
            confirm applicable rate and place of supply with your accountant.
          </p>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-800 border-t border-slate-300 pt-2 px-6">
              Authorized Signatory
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-10">
          Thank you for choosing {company.name}!
        </p>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this invoice?"
        description={`Invoice ${invoice.invoiceNumber} will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeleteInvoice}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
