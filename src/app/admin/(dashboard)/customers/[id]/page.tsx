"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Customer } from "@prisma/client";
import { ArrowLeft, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import DocumentsPanel from "@/components/admin/DocumentsPanel";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function CustomerViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/customers/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Customer not found");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const c: Customer = data.customer;
        setCustomer(c);
        setFullName(c.fullName);
        setPhone(c.phone);
        setAddress(c.address);
        setEmail(c.email ?? "");
        setNotes(c.notes ?? "");
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSave() {
    if (!customer) return;
    setError("");
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, address, email: email || undefined, notes: notes || undefined }),
      });
      if (!res.ok) throw new Error("Failed to save changes");
      const data = await res.json();
      setCustomer(data.customer);
      setSaved(true);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDeleteCustomer() {
    if (!customer) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete customer");
      router.push("/admin/customers");
    } catch {
      setError("Failed to delete customer");
      setDeleting(false);
    }
  }

  if (error && !customer) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center justify-between">
        <Link href="/admin/customers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-950">
          <ArrowLeft className="h-4 w-4" /> Back to Customers
        </Link>
        <button
          onClick={() => setConfirmDelete(true)}
          className="p-2 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600"
          aria-label="Delete customer"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6">
        {customer.leadId && (
          <p className="text-xs font-semibold text-sky-700 bg-sky-50 border border-sky-100 rounded-lg px-3.5 py-2 inline-block">
            Linked to lead #{customer.leadId}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Address</label>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className={inputClass} />
        </div>

        {error && (
          <p className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            <AlertCircle className="h-4 w-4" /> {error}
          </p>
        )}
        {saved && (
          <p className="flex items-center gap-2 text-sm font-medium text-leaf-700 bg-leaf-500/10 border border-leaf-500/20 rounded-lg px-4 py-2.5">
            <CheckCircle2 className="h-4 w-4" /> Saved.
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors disabled:opacity-70"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <div className="border-t border-slate-100 pt-6">
          <DocumentsPanel
            documentsPath={`/api/admin/customers/${customer.id}/documents`}
            uploadUrl="/api/admin/customers/documents/upload"
          />
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this customer?"
        description={`${customer.fullName} and all attached documents will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeleteCustomer}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
