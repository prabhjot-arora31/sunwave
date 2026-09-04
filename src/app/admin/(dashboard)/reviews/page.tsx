"use client";

import { useEffect, useState } from "react";
import type { Review } from "@prisma/client";
import { Star, Loader2, Trash2, AlertCircle, Check, X as XIcon, ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ShareReviewsCard from "@/components/admin/ShareReviewsCard";
import { REVIEW_STATUS_LABELS, REVIEW_STATUS_COLORS, type ReviewStatus } from "@/lib/reviewStatus";

type Pagination = { page: number; pageSize: number; total: number; totalPages: number };

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Reset to page 1 whenever the status filter changes, computed during
  // render rather than via a setState-in-effect.
  const [prevStatus, setPrevStatus] = useState(status);
  let effectivePage = page;
  if (status !== prevStatus) {
    setPrevStatus(status);
    setPage(1);
    effectivePage = 1;
  }

  const currentParamsKey = `${status}|${effectivePage}`;
  const [resolvedParamsKey, setResolvedParamsKey] = useState("");
  const loading = currentParamsKey !== resolvedParamsKey;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    params.set("page", String(effectivePage));

    fetch(`/api/admin/reviews?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load reviews");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setReviews(data.reviews);
        setPagination(data.pagination);
        setPendingCount(data.pendingCount);
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
  }, [currentParamsKey, status, effectivePage]);

  async function updateStatus(id: number, newStatus: ReviewStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update review");
      setReviews((prev) =>
        status && status !== newStatus
          ? prev.filter((r) => r.id !== id)
          : prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
      );
      if (newStatus !== "pending") {
        setPendingCount((c) => Math.max(0, c - 1));
      }
    } catch {
      setError("Failed to update review status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function confirmDeleteReview() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      setReviews((prev) => prev.filter((r) => r.id !== id));
      setPagination((prev) => (prev ? { ...prev, total: prev.total - 1 } : prev));
      setPendingDelete(null);
    } catch {
      setError("Failed to delete review");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reviews</h1>
        <p className="text-sm text-slate-500 mt-1">
          {pendingCount > 0
            ? `${pendingCount} awaiting moderation`
            : "No reviews awaiting moderation"}
        </p>
      </div>

      <ShareReviewsCard />

      <div className="flex gap-2">
        <button
          onClick={() => setStatus("pending")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            status === "pending" ? "bg-sun-700 text-white" : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setStatus("approved")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            status === "approved" ? "bg-sun-700 text-white" : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Approved
        </button>
        <button
          onClick={() => setStatus("rejected")}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            status === "rejected" ? "bg-sun-700 text-white" : "bg-white border border-slate-200 text-slate-600"
          }`}
        >
          Rejected
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 py-16 text-center text-slate-500">
          No {status} reviews.
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl bg-white border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-slate-900">{r.name}</p>
                    {r.city && <span className="text-xs text-slate-500">{r.city}</span>}
                    <span
                      className={`text-xs font-semibold rounded-full px-2.5 py-1 ${REVIEW_STATUS_COLORS[r.status as ReviewStatus] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {REVIEW_STATUS_LABELS[r.status as ReviewStatus] ?? r.status}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mt-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < r.rating ? "fill-sun-400 text-sun-400" : "fill-slate-200 text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  {r.systemType && <p className="text-xs font-medium text-sun-700 mt-1.5">{r.systemType}</p>}
                  <p className="text-sm text-slate-700 leading-relaxed mt-3">{r.comment}</p>
                  <p className="text-xs text-slate-400 mt-3">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  {r.status !== "approved" && (
                    <button
                      onClick={() => updateStatus(r.id, "approved")}
                      disabled={updatingId === r.id}
                      className="p-2 rounded-lg bg-leaf-500/10 text-leaf-600 hover:bg-leaf-500/20 disabled:opacity-60"
                      aria-label="Approve review"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {r.status !== "rejected" && (
                    <button
                      onClick={() => updateStatus(r.id, "rejected")}
                      disabled={updatingId === r.id}
                      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60"
                      aria-label="Reject review"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setPendingDelete(r)}
                    className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                    aria-label="Delete review"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-slate-500">
            Page {pagination.page} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={page >= pagination.totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-40 hover:bg-slate-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this review?"
        description={
          pendingDelete
            ? `${pendingDelete.name}'s review will be permanently removed. This cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeleteReview}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
