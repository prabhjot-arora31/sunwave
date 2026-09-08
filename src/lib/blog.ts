import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export const BLOG_CACHE_TAG = "blog-posts";

export const getPublishedPosts = unstable_cache(
  async () => {
    try {
      return await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          publishedAt: true,
        },
      });
    } catch {
      // A DB hiccup here must never fail the build - fall back to an empty
      // list, which the page renders as a graceful "no posts yet" state.
      return [];
    }
  },
  ["public-blog-posts"],
  { revalidate: 3600, tags: [BLOG_CACHE_TAG] }
);

export const getPublishedPostBySlug = unstable_cache(
  async (slug: string) => {
    try {
      return await prisma.blogPost.findFirst({ where: { slug, published: true } });
    } catch {
      return null;
    }
  },
  ["public-blog-post-by-slug"],
  { revalidate: 3600, tags: [BLOG_CACHE_TAG] }
);
