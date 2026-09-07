import { prisma } from "@/lib/prisma";
import { ALL_PERMISSIONS } from "@/lib/permissions";

// Guarantees a full-access "Owner" role always exists, so the Users page
// always has a role to assign to a first real admin account. Safe to call
// repeatedly - only creates it if genuinely missing.
export async function ensureOwnerRole() {
  const existing = await prisma.role.findFirst({ where: { isSystem: true } });
  if (existing) return existing;

  return prisma.role.create({
    data: { name: "Owner", permissions: ALL_PERMISSIONS, isSystem: true },
  });
}
