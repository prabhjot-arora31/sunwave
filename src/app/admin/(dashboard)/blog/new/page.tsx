import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Blog Post</h1>
        <p className="text-sm text-slate-500 mt-1">Write in Markdown - save as a draft or publish immediately.</p>
      </div>
      <BlogPostForm />
    </div>
  );
}
