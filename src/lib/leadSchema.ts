import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : v))
  .optional();

const optionalNumber = z
  .string()
  .trim()
  .transform((v) => (v === "" ? undefined : Number(v)))
  .pipe(z.number().nonnegative().optional())
  .optional();

export const leadSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  mobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, "").slice(-10))
    .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")),
  whatsapp: optionalText,
  email: z
    .string()
    .trim()
    .email("Enter a valid email")
    .optional()
    .or(z.literal(""))
    .transform((v) => (v === "" ? undefined : v)),
  address: z.string().trim().min(1, "Address is required"),
  city: optionalText,
  pincode: optionalText,

  propertyType: z.enum(["Residential", "Commercial", "Industrial", "Agriculture"]),
  monthlyBill: optionalNumber,
  monthlyUnits: optionalNumber,
  connectionType: optionalText,
  capacity: optionalText,
  roofType: optionalText,
  installDate: optionalText,
  battery: optionalText,
  finance: optionalText,
  subsidy: optionalText,
  message: optionalText,
  source: z.string().trim().default("website"),
});

export type LeadInput = z.infer<typeof leadSchema>;
