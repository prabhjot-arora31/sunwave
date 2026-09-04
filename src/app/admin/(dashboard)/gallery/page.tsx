"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { GalleryItem } from "@prisma/client";
import { Upload, Loader2, Trash2, AlertCircle, ImageIcon, Video as VideoIcon } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

type UploadingFile = {
  id: string;
  name: string;
  progress: number;
  error?: string;
};

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [pendingDelete, setPendingDelete] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadItems = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/gallery")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load gallery");
        return res.json();
      })
      .then((data) => {
        setItems(data.items);
        setError("");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const files = Array.from(fileList);

    for (const file of files) {
      const uploadId = `${file.name}-${Date.now()}`;
      setUploading((prev) => [...prev, { id: uploadId, name: file.name, progress: 0 }]);

      try {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/gallery/upload",
          onUploadProgress: ({ percentage }) => {
            setUploading((prev) =>
              prev.map((u) => (u.id === uploadId ? { ...u, progress: percentage } : u))
            );
          },
        });

        const type = file.type.startsWith("video/") ? "video" : "photo";
        const res = await fetch("/api/admin/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: blob.url, type }),
        });
        if (!res.ok) throw new Error("Failed to save gallery item");

        setUploading((prev) => prev.filter((u) => u.id !== uploadId));
        loadItems();
      } catch (err) {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? { ...u, error: err instanceof Error ? err.message : "Upload failed" }
              : u
          )
        );
      }
    }
  }

  async function confirmDeleteItem() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      setItems((prev) => prev.filter((i) => i.id !== id));
      setPendingDelete(null);
    } catch {
      setError("Failed to delete gallery item");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gallery</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage the photos and videos shown on the public gallery page.
        </p>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white py-12 px-4 text-center cursor-pointer hover:border-sun-400 hover:bg-sun-50/40 transition-colors"
      >
        <Upload className="h-8 w-8 text-slate-400" />
        <p className="text-sm font-semibold text-slate-700">
          Click to upload, or drag and drop photos/videos here
        </p>
        <p className="text-xs text-slate-400">JPEG, PNG, WEBP, MP4, WEBM - up to 200MB each</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,video/mp4,video/webm,video/quicktime"
          multiple
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((u) => (
            <div key={u.id} className="rounded-xl bg-white border border-slate-200 p-3">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="truncate text-slate-700">{u.name}</span>
                {u.error ? (
                  <span className="text-red-600 text-xs font-semibold">{u.error}</span>
                ) : (
                  <span className="text-slate-500 text-xs">{Math.round(u.progress)}%</span>
                )}
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${u.error ? "bg-red-400" : "bg-sun-500"}`}
                  style={{ width: `${u.error ? 100 : u.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4" /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white border border-slate-200 py-16 text-center text-slate-500">
          No photos or videos uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-4/3 overflow-hidden rounded-xl bg-slate-100 border border-slate-200"
            >
              {item.type === "video" ? (
                <video src={item.url} className="w-full h-full object-cover" muted />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.caption ?? ""} className="w-full h-full object-cover" />
              )}
              <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/60 text-white text-xs font-semibold px-2 py-1">
                {item.type === "video" ? <VideoIcon className="h-3 w-3" /> : <ImageIcon className="h-3 w-3" />}
                {item.type}
              </span>
              <button
                onClick={() => setPendingDelete(item)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                aria-label="Delete item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Delete this item?"
        description="This photo or video will be permanently removed from the public gallery and storage. This cannot be undone."
        confirmLabel="Delete"
        destructive
        loading={deleting}
        onConfirm={confirmDeleteItem}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
