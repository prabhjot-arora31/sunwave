import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { updateBlogPostSchema } from "@/lib/blogSchema";
import { BLOG_CACHE_TAG } from "@/lib/blog";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid post id" }, { status: 400 });

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid post id" }, { status: 400 });

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = updateBlogPostSchema.parse(body);

    if (data.slug && data.slug !== existing.slug) {
      const clash = await prisma.blogPost.findUnique({ where: { slug: data.slug } });
      if (clash) return NextResponse.json({ error: "That slug is already in use" }, { status: 409 });
    }

    const willPublish = data.published === true && !existing.published;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt: willPublish ? new Date() : undefined,
      },
    });

    // Cover both the old and new slug (in case it changed) and the old
    // published state (in case it just got unpublished) so no stale cached
    // page is left behind either way.
    revalidateTag(BLOG_CACHE_TAG, "max");
    revalidatePath("/blog");
    revalidatePath(`/blog/${existing.slug}`);
    if (post.slug !== existing.slug) revalidatePath(`/blog/${post.slug}`);

    return NextResponse.json({ post });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to update blog post:", err);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid post id" }, { status: 400 });

  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "Post not found" }, { status: 404 });

  await prisma.blogPost.delete({ where: { id } });

  revalidateTag(BLOG_CACHE_TAG, "max");
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);

  return NextResponse.json({ ok: true });
}
