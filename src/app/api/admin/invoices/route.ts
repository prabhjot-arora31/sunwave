import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { invoiceSchema } from "@/lib/invoiceSchema";
import { isInvoiceStatus } from "@/lib/invoiceStatus";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize")) || 20));
  const status = params.get("status") ?? "";
  const search = params.get("search")?.trim() ?? "";
  const from = params.get("from");
  const to = params.get("to");

  const where: Prisma.InvoiceWhereInput = {};
  if (status && isInvoiceStatus(status)) where.status = status;
  if (search) {
    where.OR = [
      { invoiceNumber: { contains: search } },
      { customerName: { contains: search } },
      { customerPhone: { contains: search } },
    ];
  }
  if (from || to) {
    where.invoiceDate = {};
    if (from) where.invoiceDate.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.invoiceDate.lte = end;
    }
  }

  const [total, invoices] = await Promise.all([
    prisma.invoice.count({ where }),
    prisma.invoice.findMany({
      where,
      orderBy: { invoiceDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    invoices,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = invoiceSchema.parse(body);

    const items = data.items.map((item) => ({
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: Math.round(item.quantity * item.rate * 100) / 100,
    }));
    const subtotal = Math.round(items.reduce((sum, i) => sum + i.amount, 0) * 100) / 100;
    const gstAmount = Math.round(((subtotal * data.gstRate) / 100) * 100) / 100;
    const total = Math.round((subtotal + gstAmount) * 100) / 100;

    // Sequential per-year numbering: SW<index><2-digit year>, e.g. SW0126 = 1st
    // invoice of 2026. Not fully race-safe under concurrent creates, but this
    // is a single-admin tool with low write volume, so a unique constraint on
    // invoiceNumber (which would surface as a 500 to retry) is an acceptable
    // safety net rather than adding a dedicated counter/lock.
    const yearShort = String(new Date().getFullYear()).slice(-2);
    const countThisYear = await prisma.invoice.count({
      where: { invoiceNumber: { endsWith: yearShort } },
    });
    const invoiceNumber = `SW${String(countThisYear + 1).padStart(2, "0")}${yearShort}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        leadId: data.leadId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        customerEmail: data.customerEmail,
        items,
        subtotal,
        gstRate: data.gstRate,
        gstAmount,
        total,
        invoiceDate: data.invoiceDate ? new Date(data.invoiceDate) : undefined,
      },
    });

    return NextResponse.json({ ok: true, id: invoice.id }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to create invoice:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
