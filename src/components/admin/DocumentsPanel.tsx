"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { CustomerDocument } from "@prisma/client";
import { FileText, Loader2, Trash2, Eye, UploadCloud } from "lucide-react";
import { DOCUMENT_LABELS } from "@/lib/leadDocumentSchema";

// Reusable across any entity that stores documents on a Customer record:
// the Lead detail modal (documentsPath points at /api/admin/leads/:id/documents,
// which transparently ensures/uses that lead's linked Customer) and the
// standalone Customer detail page (documentsPath points directly at
// /api/admin/customers/:id/documents).
export default function DocumentsPanel({
  documentsPath,
  uploadUrl,
}: {
  documentsPath: string;
  uploadUrl: string;
}) {
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState<string>(DOCUMENT_LABELS[0]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(documentsPath)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setDocuments(data.documents ?? []);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [documentsPath]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: "private",
        handleUploadUrl: uploadUrl,
      });

      const res = await fetch(documentsPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, url: blob.url, fileName: file.name }),
      });
      if (!res.ok) throw new Error("Failed to save document");
      const data = await res.json();
      setDocuments((prev) => [data.document, ...prev]);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(docId: number) {
    setDeletingId(docId);
    try {
      const res = await fetch(`${documentsPath}/${docId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setDocuments((prev) => prev.filter((d) => d.id !== docId));
    } catch {
      setError("Failed to delete document");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5" /> Documents
      </h3>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
        >
          {DOCUMENT_LABELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-sun-400 hover:text-sun-700 cursor-pointer transition-colors">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          {uploading ? "Uploading..." : "Upload File"}
          <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} disabled={uploading} className="hidden" />
        </label>
      </div>

      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}

      {loading ? (
        <p className="text-xs text-slate-400">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-xs text-slate-400">No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 border border-slate-100 px-3.5 py-2.5"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{doc.label}</p>
                <p className="text-xs text-slate-500 truncate">{doc.fileName}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={`${documentsPath}/${doc.id}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                  aria-label={`View ${doc.label}`}
                >
                  <Eye className="h-4 w-4" />
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                  className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-50"
                  aria-label={`Delete ${doc.label}`}
                >
                  {deletingId === doc.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
