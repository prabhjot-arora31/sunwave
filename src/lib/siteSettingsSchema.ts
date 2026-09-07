import { z } from "zod";

export const subsidySlabSchema = z.object({
  capacity: z.string().trim().min(1, "Capacity label is required"),
  subsidy: z.string().trim().min(1, "Subsidy amount is required"),
});

export const siteSettingsSchema = z.object({
  yearsExperience: z.string().trim().min(1),
  happyCustomers: z.string().trim().min(1),
  mwCapacity: z.string().trim().min(1),
  citiesServed: z.string().trim().min(1),
  loanAmount: z.string().trim().min(1),
  interestRate: z.string().trim().min(1),
  loanTenure: z.string().trim().min(1),
  loanProcessing: z.string().trim().min(1),
  financePartners: z.array(z.string().trim().min(1)).min(1, "Add at least one financing partner"),
  subsidySlabs: z.array(subsidySlabSchema).min(1, "Add at least one subsidy slab"),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
