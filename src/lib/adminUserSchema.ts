import { z } from "zod";

export const createAdminUserSchema = z.object({
  username: z.string().trim().min(3, "Username must be at least 3 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  roleId: z.number().int().positive("Choose a role"),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;
