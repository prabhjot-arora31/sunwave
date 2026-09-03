"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@prisma/client";
import { Search, Loader2, Eye, Trash2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import LeadDetailModal from "@/components/admin/LeadDetailModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { LEAD_STATUSES, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, type LeadStatus } from "@/lib/leadStatus";

const PROPERTY_TYPES = ["Residential", "Commercial", "Industrial", "Agriculture"];

type Pagination = { page: number; pageSize: number; total: number; totalPages: number };

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Lead | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever a filter changes, computed during render
  // (React's documented pattern for "adjusting state when a prop changes")
  // rather than via a setState-in-effect.
  const filtersKey = `${debouncedSearch}|${status}|${propertyType}`;
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

  // Loading is derived by comparing the params the UI currently wants against
  // the params the last successful/failed response resolved for - no
  // setState-in-effect, no ref reads during render.
  const currentParamsKey = `${effectivePage}|${debouncedSearch}|${status}|${propertyType}`;
  const [resolvedParamsKey, setResolvedParamsKey] = useState("");
  const loading = currentParamsKey !== resolvedParamsKey;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    params.set("page", String(effectivePage));
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (status) params.set("status", status);
    if (propertyType) params.set("propertyType", propertyType);

    fetch(`/api/admin/leads?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load leads");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setLeads(data.leads);
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
  }, [currentParamsKey, effectivePage, debouncedSearch, status, propertyType]);

  async function updateStatus(id: number, newStatus: LeadStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    } catch {
      setError("Failed to update lead status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmDeleteLead() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete lead");
      setLeads((prev) => prev.filter((l) => l.id !== id));
      setPagination((prev) => (prev ? { ...prev, total: prev.total - 1 } : prev));
      setPendingDelete(null);
    } catch {
      setError("Failed to delete lead");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
        <p className="text-sm text-slate-500 mt-1">
          {pagination ? `${pagination.total} total submissions` : "Loading..."}
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            aria-label="Search leads"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, mobile, email, city..."
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3.5 py-2.5 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
          />
        </div>
        <select
          aria-label="Filter by property type"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
        >
          <option value="">All Property Types</option>
          {PROPERTY_TYPES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
        >
          <option value="">All Statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
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
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Property</th>
                <th className="px-5 py-3 font-semibold">Capacity</th>
                <th className="px-5 py-3 font-semibold">City</th>
                <th className="px-5 py-3 font-semibold">Source</th>
                <th className="px-5 py-3 font-semibold">Submitted</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin inline" />
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                    No leads found.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-slate-900">{lead.fullName}</p>
                      <p className="text-xs text-slate-500">{lead.mobile}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{lead.propertyType}</td>
                    <td className="px-5 py-3.5 text-slate-600">{lead.capacity ?? "-"}</td>
                    <td className="px-5 py-3.5 text-slate-600">{lead.city ?? "-"}</td>
                    <td className="px-5 py-3.5 text-slate-600 capitalize">{lead.source}</td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        aria-label={`Update status for ${lead.fullName}`}
                        value={lead.status}
                        disabled={updatingId === lead.id}
                        onChange={(e) => updateStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-xs font-semibold rounded-full px-2.5 py-1.5 border-0 focus:outline-none focus:ring-2 focus:ring-sun-500/30 ${LEAD_STATUS_COLORS[lead.status as LeadStatus] ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {LEAD_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelected(lead)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                          aria-label="View details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setPendingDelete(lead)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                          aria-label="Delete lead"
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

      {selected && <LeadDetailModal lead={selected} onClose={() => setSelected(null)} />}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this lead?"
        description={
          pendingDelete
            ? `${pendingDelete.fullName}'s enquiry will be permanently removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeleteLead}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
