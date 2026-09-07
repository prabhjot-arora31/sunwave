"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Invoice } from "@prisma/client";
import { Search, Loader2, Eye, Trash2, Plus, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { INVOICE_STATUSES, INVOICE_STATUS_COLORS, type InvoiceStatus } from "@/lib/invoiceStatus";

type Pagination = { page: number; pageSize: number; total: number; totalPages: number };

const format = (n: number) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Invoice | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const filtersKey = `${debouncedSearch}|${status}`;
  const [prevFiltersKey, setPrevFiltersKey] = useState(filtersKey);
  let effectivePage = page;
  if (filtersKey !== prevFiltersKey) {
    setPrevFiltersKey(filtersKey);
    setPage(1);
    effectivePage = 1;
  }

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const currentParamsKey = `${effectivePage}|${debouncedSearch}|${status}`;
  const [resolvedParamsKey, setResolvedParamsKey] = useState("");
  const loading = currentParamsKey !== resolvedParamsKey;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    params.set("page", String(effectivePage));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status) params.set("status", status);

    fetch(`/api/admin/invoices?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load invoices");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setInvoices(data.invoices);
        setPagination(data.pagination);
        setError("");
        setResolvedParamsKey(currentParamsKey);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Something went wrong");
        setResolvedParamsKey(currentParamsKey);
      });

    return () => {
      cancelled = true;
    };
  }, [currentParamsKey, effectivePage, debouncedSearch, status]);

  async function updateStatus(id: number, newStatus: InvoiceStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setInvoices((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
    } catch {
      setError("Failed to update invoice status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmDeleteInvoice() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete invoice");
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      setPagination((prev) => (prev ? { ...prev, total: prev.total - 1 } : prev));
      setPendingDelete(null);
    } catch {
      setError("Failed to delete invoice");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
          <p className="text-sm text-slate-500 mt-1">
            {pagination ? `${pagination.total} total invoices` : "Loading..."}
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Invoice
        </Link>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            aria-label="Search invoices"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoice #, customer name, phone..."
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3.5 py-2.5 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
          />
        </div>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
        >
          <option value="">All Statuses</option>
          {INVOICE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wide border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 font-semibold">Invoice #</th>
                <th className="px-5 py-3 font-semibold">Customer</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Total</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin inline" />
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-500">
                    No invoices yet.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-semibold text-sky-950">{invoice.invoiceNumber}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{invoice.customerName}</p>
                      <p className="text-xs text-slate-500">{invoice.customerPhone}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {new Date(invoice.invoiceDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-slate-900">₹{format(invoice.total)}</td>
                    <td className="px-5 py-3.5">
                      <select
                        aria-label={`Update status for ${invoice.invoiceNumber}`}
                        value={invoice.status}
                        disabled={updatingId === invoice.id}
                        onChange={(e) => updateStatus(invoice.id, e.target.value as InvoiceStatus)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-sun-500/30 ${INVOICE_STATUS_COLORS[invoice.status as InvoiceStatus] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {INVOICE_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/admin/invoices/${invoice.id}`}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                          aria-label="View invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setPendingDelete(invoice)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                          aria-label="Delete invoice"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this invoice?"
        description={
          pendingDelete
            ? `Invoice ${pendingDelete.invoiceNumber} for ${pendingDelete.customerName} will be permanently removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeleteInvoice}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
