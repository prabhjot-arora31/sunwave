import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { createLeadDocumentSchema } from "@/lib/leadDocumentSchema";
import { ensureCustomerForLead } from "@/lib/customerDocuments";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const leadId = parseId((await params).id);
  if (leadId === null) return NextResponse.json({ error: "Invalid lead id" }, { status: 400 });

  const customer = await prisma.customer.findUnique({ where: { leadId } });
  if (!customer) return NextResponse.json({ documents: [] });

  const documents = await prisma.customerDocument.findMany({
    where: { customerId: customer.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const leadId = parseId((await params).id);
  if (leadId === null) return NextResponse.json({ error: "Invalid lead id" }, { status: 400 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = createLeadDocumentSchema.parse(body);

    const customer = await ensureCustomerForLead(leadId);
    if (!customer) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const document = await prisma.customerDocument.create({
      data: { customerId: customer.id, label: data.label, url: data.url, fileName: data.fileName },
    });

    return NextResponse.json({ document }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to save document record:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
