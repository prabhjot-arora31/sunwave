import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { createLeadDocumentSchema } from "@/lib/leadDocumentSchema";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const customerId = parseId((await params).id);
  if (customerId === null) return NextResponse.json({ error: "Invalid customer id" }, { status: 400 });

  const documents = await prisma.customerDocument.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const customerId = parseId((await params).id);
  if (customerId === null) return NextResponse.json({ error: "Invalid customer id" }, { status: 400 });

  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = createLeadDocumentSchema.parse(body);
    const document = await prisma.customerDocument.create({
      data: { customerId, label: data.label, url: data.url, fileName: data.fileName },
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
