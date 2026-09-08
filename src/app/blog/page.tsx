import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Container from "@/components/ui/Container";
import { getPublishedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Guides, tips and news on rooftop solar, government subsidies, and going solar in India.",
  alternates: { canonical: "/blog" },
};

export const revalidate = 3600;

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Solar Guides & News"
        description="Everything you need to know about going solar - subsidies, financing, system types and more."
      />

      <section className="py-20 bg-white">
        <Container>
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 rounded-2xl bg-slate-50 border border-dashed border-slate-200">
              <Newspaper className="h-8 w-8 text-slate-400 mb-3" />
              <p className="text-sm text-slate-500">New posts coming soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl overflow-hidden border border-slate-100 bg-white hover:shadow-lg hover:border-sun-200 hover:-translate-y-1 transition-all"
                >
                  <div className="aspect-16/9 bg-slate-100 relative overflow-hidden">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="h-8 w-8 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    {post.publishedAt && (
                      <p className="text-xs text-slate-400 mb-1.5">
                        {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    )}
                    <h2 className="font-bold text-sky-950 mb-1.5 group-hover:text-sun-700 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
