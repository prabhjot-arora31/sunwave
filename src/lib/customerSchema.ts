import { z } from "zod";

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

export const createCustomerSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  phone: z.string().trim().min(1, "Phone is required"),
  address: z.string().trim().min(1, "Address is required"),
  email: optionalEmail,
  notes: z.string().trim().max(5000).optional(),
});

export const updateCustomerSchema = z.object({
  fullName: z.string().trim().min(1).optional(),
  phone: z.string().trim().min(1).optional(),
  address: z.string().trim().min(1).optional(),
  email: optionalEmail,
  notes: z.string().trim().max(5000).optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
