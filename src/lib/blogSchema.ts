import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const createBlogPostSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().toLowerCase().regex(slugPattern, "Use lowercase letters, numbers and hyphens only"),
  excerpt: z.string().trim().min(1, "Excerpt is required").max(300, "Keep the excerpt under 300 characters"),
  content: z.string().trim().min(1, "Content is required"),
  coverImage: z.string().trim().url().optional().or(z.literal("")).transform((v) => (v === "" ? undefined : v)),
  published: z.boolean().default(false),
});

export const updateBlogPostSchema = createBlogPostSchema.partial();

export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export type CreateBlogPostInput = z.infer<typeof createBlogPostSchema>;
