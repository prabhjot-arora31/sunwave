import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { createPaymentSchema } from "@/lib/paymentSchema";
import { deriveInvoiceStatus } from "@/lib/invoiceStatus";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const invoiceId = parseId((await params).id);
  if (invoiceId === null) return NextResponse.json({ error: "Invalid invoice id" }, { status: 400 });

  const payments = await prisma.payment.findMany({
    where: { invoiceId },
    orderBy: { paidOn: "desc" },
  });
  return NextResponse.json({ payments });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const invoiceId = parseId((await params).id);
  if (invoiceId === null) return NextResponse.json({ error: "Invalid invoice id" }, { status: 400 });

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = createPaymentSchema.parse(body);

    const payment = await prisma.payment.create({
      data: {
        invoiceId,
        amount: data.amount,
        method: data.method,
        paidOn: data.paidOn ? new Date(data.paidOn) : undefined,
        notes: data.notes,
      },
    });

    // Cancelled is a deliberate admin action, not payment-derived - leave it.
    if (invoice.status !== "Cancelled") {
      const agg = await prisma.payment.aggregate({ where: { invoiceId }, _sum: { amount: true } });
      const totalPaid = agg._sum.amount ?? 0;
      const newStatus = deriveInvoiceStatus(totalPaid, invoice.total);
      if (newStatus !== invoice.status) {
        await prisma.invoice.update({ where: { id: invoiceId }, data: { status: newStatus } });
      }
    }

    return NextResponse.json({ payment }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to record payment:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
