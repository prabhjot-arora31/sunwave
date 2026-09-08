"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { BlogPost } from "@prisma/client";
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import BlogPostForm from "@/components/admin/BlogPostForm";

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [error, setError] = useState("");
  const [justCreated, setJustCreated] = useState(false);

  useEffect(() => {
    if (searchParams.get("created") === "1") {
      setJustCreated(true);
      router.replace(`/admin/blog/${id}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/blog/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setPost(data.post);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
        <AlertCircle className="h-4 w-4" /> {error}
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-sky-950">
        <ArrowLeft className="h-4 w-4" /> Back to Blog
      </Link>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Edit Blog Post</h1>
      </div>
      {justCreated && (
        <p className="flex items-center gap-2 text-sm font-medium text-leaf-700 bg-leaf-500/10 border border-leaf-500/20 rounded-lg px-4 py-2.5">
          <CheckCircle2 className="h-4 w-4" /> Post created{post.published ? " and published" : " as a draft"}.
        </p>
      )}
      <BlogPostForm post={post} />
    </div>
  );
}
