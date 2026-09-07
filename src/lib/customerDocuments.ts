import { prisma } from "@/lib/prisma";

// Finds the Customer already linked to this Lead, or creates one from the
// Lead's own details on first use. Lets "add a document" on a Lead's page
// keep working exactly as before, while the document itself is actually
// stored against a Customer - the same entity a walk-in (no Lead at all)
// gets when created directly from /admin/customers.
export async function ensureCustomerForLead(leadId: number) {
  const existing = await prisma.customer.findUnique({ where: { leadId } });
  if (existing) return existing;

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return null;

  return prisma.customer.create({
    data: {
      fullName: lead.fullName,
      phone: lead.mobile,
      address: lead.address,
      email: lead.email,
      leadId: lead.id,
    },
  });
}
