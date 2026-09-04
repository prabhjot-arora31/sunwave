import { z } from "zod";

export const GALLERY_TYPES = ["photo", "video"] as const;
export type GalleryType = (typeof GALLERY_TYPES)[number];

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

export const createGalleryItemSchema = z.object({
  url: z.string().url(),
  type: z.enum(GALLERY_TYPES),
  caption: optionalText,
});

export const updateGalleryItemSchema = z.object({
  caption: optionalText,
  order: z.coerce.number().int().optional(),
});
