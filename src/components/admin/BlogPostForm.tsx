"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import Image from "next/image";
import type { BlogPost } from "@prisma/client";
import { Loader2, UploadCloud, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { slugify } from "@/lib/blogSchema";

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sun-500 focus:outline-none focus:ring-2 focus:ring-sun-500/30 transition";
const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(isEditing);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [published, setPublished] = useState(post?.published ?? false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    setError("");
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/admin/blog/upload",
      });
      setCoverImage(blob.url);
    } catch {
      setError("Cover image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(publishNow?: boolean) {
    setError("");
    setSaved(false);
    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim()) {
      setError("Title, slug, excerpt and content are all required.");
      return;
    }

    const payload = {
      title,
      slug,
      excerpt,
      content,
      coverImage: coverImage || undefined,
      published: publishNow ?? published,
    };

    setSaving(true);
    try {
      const res = isEditing
        ? await fetch(`/api/admin/blog/${post!.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/admin/blog", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to save post");
      }

      if (isEditing) {
        setPublished(payload.published);
        setSaved(true);
      } else {
        const data = await res.json();
        router.push(`/admin/blog/${data.post.id}?created=1`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-5">
      <div>
        <label className={labelClass}>Title *</label>
        <input value={title} onChange={(e) => handleTitleChange(e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Slug (URL) *</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 shrink-0">/blog/</span>
          <input
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Excerpt * (shown on the blog listing, max 300 chars)</label>
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} maxLength={300} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Cover Image</label>
        {coverImage ? (
          <div className="relative w-full max-w-sm">
            <Image src={coverImage} alt="Cover" width={640} height={360} className="rounded-lg w-full h-auto" />
            <button
              onClick={() => setCoverImage("")}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-600 shadow"
              aria-label="Remove cover image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="inline-flex items-center justify-center gap-2 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:border-sun-400 hover:text-sun-700 cursor-pointer transition-colors">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload Cover Image"}
            <input type="file" accept="image/*" onChange={handleCoverUpload} disabled={uploading} className="hidden" />
          </label>
        )}
      </div>

      <div>
        <label className={labelClass}>Content * (Markdown)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className={`${inputClass} font-mono text-xs`}
          placeholder="## Heading&#10;&#10;Write your post in Markdown - **bold**, *italic*, [links](url), lists, etc."
        />
      </div>

      {error && (
        <p className="flex items-center gap-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
      {saved && (
        <p className="flex items-center gap-2 text-sm font-medium text-leaf-700 bg-leaf-500/10 border border-leaf-500/20 rounded-lg px-4 py-2.5">
          <CheckCircle2 className="h-4 w-4" /> Saved{published ? " and published" : " as draft"}.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => handleSave(false)}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-70"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save Draft
        </button>
        <button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-sun-700 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-sun-800 transition-colors disabled:opacity-70"
        >
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} {published ? "Update & Keep Published" : "Publish"}
        </button>
        {isEditing && published && <span className="text-xs text-slate-400">"Save Draft" unpublishes this post.</span>}
      </div>
    </div>
  );
}
