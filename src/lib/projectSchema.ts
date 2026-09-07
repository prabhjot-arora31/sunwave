import { z } from "zod";
import { PROJECT_STAGES } from "@/lib/projectStage";

const optionalDate = z
  .string()
  .trim()
  .optional()
  .transform((v) => (v === "" || v === undefined ? undefined : v));

export const createProjectSchema = z.object({
  leadId: z.number().int().positive().optional(),
  customerName: z.string().trim().min(1, "Customer name is required"),
  customerPhone: z.string().trim().min(1, "Customer phone is required"),
  customerAddress: z.string().trim().min(1, "Customer address is required"),
  capacity: z.string().trim().min(1, "Capacity is required"),
  stage: z.enum(PROJECT_STAGES).default("Site Survey"),
  installDate: optionalDate,
  commissioningDate: optionalDate,
  subsidyCreditedDate: optionalDate,
  notes: z.string().trim().max(5000).optional(),
});

export const updateProjectSchema = z.object({
  stage: z.enum(PROJECT_STAGES).optional(),
  capacity: z.string().trim().min(1).optional(),
  installDate: optionalDate,
  commissioningDate: optionalDate,
  subsidyCreditedDate: optionalDate,
  notes: z.string().trim().max(5000).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
