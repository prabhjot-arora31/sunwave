import { z } from "zod";

export const PAYMENT_METHODS = ["Cash", "UPI", "Bank Transfer", "Cheque", "Other"] as const;

export const createPaymentSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  method: z.enum(PAYMENT_METHODS),
  paidOn: z.string().trim().optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
