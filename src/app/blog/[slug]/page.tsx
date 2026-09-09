import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container";
import CtaBanner from "@/components/ui/CtaBanner";
import Reveal from "@/components/ui/Reveal";
import { getPublishedPostBySlug } from "@/lib/blog";
import { company } from "@/data/site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sunwaveenergies.in";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) notFound();

  const html = await marked.parse(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [post.coverImage] : undefined,
    // unstable_cache round-trips its result through JSON, which silently
    // turns Date objects into plain strings in a real production build (Next
    // dev mode doesn't do this, which is why this only broke once deployed).
    // new Date(x) normalizes either shape back to a real Date safely.
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: new Date(post.updatedAt).toISOString(),
    author: { "@type": "Organization", name: company.fullName },
    publisher: { "@type": "Organization", name: company.fullName },
    mainEntityOfPage: `${siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="py-16 sm:py-20 bg-white">
        <Container className="max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sun-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          {post.publishedAt && (
            <p className="text-sm text-slate-400 mb-2">
              {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-sky-950 tracking-tight mb-6">{post.title}</h1>

          {post.coverImage && (
            <div className="relative aspect-16/9 rounded-2xl overflow-hidden mb-8">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div
            className="prose prose-slate max-w-none prose-headings:text-sky-950 prose-a:text-sun-700 prose-img:rounded-2xl"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Container>
      </article>

      <Reveal>
        <CtaBanner
          title="Ready to Switch to Solar?"
          description="Get a free consultation and quote tailored to your home or business."
        />
      </Reveal>
    </>
  );
}
