import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sunwaveenergies.in";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/solar-products", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/residential", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/commercial", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/subsidy", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/finance", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/gallery", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms-and-conditions", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/disclaimer", priority: 0.2, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  let postRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    postRoutes = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // A DB hiccup must never fail the sitemap build - just omit post URLs.
  }

  return [...staticRoutes, ...postRoutes];
}
