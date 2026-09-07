import { z } from "zod";

export const DOCUMENT_LABELS = [
  "PAN Card",
  "Aadhaar Card",
  "Address Proof",
  "Income Proof / ITR",
  "Electricity Bill",
  "House Tax Receipt",
  "Bank Passbook / Cheque",
  "Other",
] as const;

export const createLeadDocumentSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  url: z.string().trim().url("Invalid document URL"),
  fileName: z.string().trim().min(1, "File name is required"),
});

export type CreateLeadDocumentInput = z.infer<typeof createLeadDocumentSchema>;
