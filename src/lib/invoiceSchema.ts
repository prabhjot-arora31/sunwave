import { z } from "zod";

const optionalEmail = z
  .string()
  .trim()
  .email("Enter a valid email")
  .optional()
  .or(z.literal(""))
  .transform((v) => (v === "" ? undefined : v));

export const invoiceItemSchema = z.object({
  description: z.string().trim().min(1, "Description is required"),
  quantity: z.number().positive("Quantity must be greater than 0"),
  rate: z.number().nonnegative("Rate cannot be negative"),
});

export const invoiceSchema = z.object({
  leadId: z.number().int().positive().optional(),
  customerName: z.string().trim().min(1, "Customer name is required"),
  customerPhone: z.string().trim().min(1, "Customer phone is required"),
  customerAddress: z.string().trim().min(1, "Customer address is required"),
  customerEmail: optionalEmail,
  items: z.array(invoiceItemSchema).min(1, "Add at least one line item"),
  gstRate: z.number().nonnegative().default(5),
  invoiceDate: z.string().trim().optional(),
});

export type InvoiceInput = z.infer<typeof invoiceSchema>;
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
