"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@prisma/client";
import { Search, Loader2, Eye, Trash2, Plus, ChevronLeft, ChevronRight, AlertCircle, ExternalLink } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type Pagination = { page: number; pageSize: number; total: number; totalPages: number };

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [error, setError] = useState("");
  const [pendingDelete, setPendingDelete] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtersKey = debouncedSearch;
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

  const currentParamsKey = `${effectivePage}|${debouncedSearch}`;
  const [resolvedParamsKey, setResolvedParamsKey] = useState("");
  const loading = currentParamsKey !== resolvedParamsKey;

  useEffect(() => {
    let cancelled = false;
    const params = new URLSearchParams();
    params.set("page", String(effectivePage));
    if (debouncedSearch) params.set("search", debouncedSearch);

    fetch(`/api/admin/blog?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load posts");
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setPosts(data.posts);
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
  }, [currentParamsKey, effectivePage, debouncedSearch]);

  async function confirmDeletePost() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
      setPosts((prev) => prev.filter((p) => p.id !== id));
      setPagination((prev) => (prev ? { ...prev, total: prev.total - 1 } : prev));
      setPendingDelete(null);
    } catch {
      setError("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog</h1>
          <p className="text-sm text-slate-500 mt-1">
            {pagination ? `${pagination.total} posts` : "Loading..."}
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      <div className="rounded-2xl bg-white border border-slate-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            aria-label="Search posts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or slug..."
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3.5 py-2.5 text-sm focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30"
          />
        </div>
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
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Slug</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Updated</th>
                <th className="px-5 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin inline" />
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    No posts yet.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                    <td className="px-5 py-3.5 font-semibold text-slate-900">{post.title}</td>
                    <td className="px-5 py-3.5 text-slate-500">/{post.slug}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-semibold rounded-full px-2.5 py-1 ${
                          post.published ? "bg-leaf-500/15 text-leaf-600" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                      {new Date(post.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        {post.published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                            aria-label="View live post"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500"
                          aria-label="Edit post"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setPendingDelete(post)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600"
                          aria-label="Delete post"
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
        title="Delete this post?"
        description={pendingDelete ? `"${pendingDelete.title}" will be permanently removed.` : ""}
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeletePost}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
