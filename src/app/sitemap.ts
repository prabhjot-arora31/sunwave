import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sunwavesolar.in";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/solar-products", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/residential", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/commercial", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/subsidy", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/finance", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/gallery", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms-and-conditions", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/disclaimer", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
