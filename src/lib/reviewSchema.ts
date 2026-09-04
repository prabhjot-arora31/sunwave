import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

export const reviewSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  city: optionalText,
  rating: z.coerce.number().int().min(1, "Please select a rating").max(5),
  systemType: optionalText,
  comment: z.string().trim().min(10, "Please share a few more words about your experience").max(2000),
  source: z.string().trim().default("website"),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
