import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isInvoiceStatus } from "@/lib/invoiceStatus";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id: Number(id) } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json({ invoice });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const status = (body as { status?: string })?.status;
  if (!status || !isInvoiceStatus(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  try {
    await prisma.invoice.update({ where: { id: Number(id) }, data: { status } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to update invoice:", err);
    return NextResponse.json({ error: "Failed to update invoice" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.invoice.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete invoice:", err);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
