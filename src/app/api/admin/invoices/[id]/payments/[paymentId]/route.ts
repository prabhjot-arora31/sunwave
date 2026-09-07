import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deriveInvoiceStatus } from "@/lib/invoiceStatus";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; paymentId: string }> }
) {
  const { id: idParam, paymentId: paymentIdParam } = await params;
  const invoiceId = parseId(idParam);
  const paymentId = parseId(paymentIdParam);
  if (invoiceId === null || paymentId === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  await prisma.payment.delete({ where: { id: paymentId } });

  if (invoice.status !== "Cancelled") {
    const agg = await prisma.payment.aggregate({ where: { invoiceId }, _sum: { amount: true } });
    const totalPaid = agg._sum.amount ?? 0;
    const newStatus = deriveInvoiceStatus(totalPaid, invoice.total);
    if (newStatus !== invoice.status) {
      await prisma.invoice.update({ where: { id: invoiceId }, data: { status: newStatus } });
    }
  }

  return NextResponse.json({ ok: true });
}
