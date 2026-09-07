import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isLeadStatus } from "@/lib/leadStatus";

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const COLUMNS = [
  "id",
  "fullName",
  "mobile",
  "whatsapp",
  "email",
  "address",
  "city",
  "pincode",
  "propertyType",
  "monthlyBill",
  "monthlyUnits",
  "connectionType",
  "capacity",
  "roofType",
  "battery",
  "finance",
  "subsidy",
  "status",
  "source",
  "createdAt",
] as const;

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const status = params.get("status") ?? "";
  const propertyType = params.get("propertyType") ?? "";
  const from = params.get("from");
  const to = params.get("to");

  const where: Prisma.LeadWhereInput = {};
  if (status && isLeadStatus(status)) where.status = status;
  if (propertyType) where.propertyType = propertyType;
  if (from || to) {
    where.createdAt = {};
    if (from) where.createdAt.gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  const leads = await prisma.lead.findMany({ where, orderBy: { createdAt: "desc" } });

  const rows = [
    COLUMNS.join(","),
    ...leads.map((lead) =>
      COLUMNS.map((col) => csvCell((lead as Record<string, unknown>)[col])).join(",")
    ),
  ];
  const csv = "﻿" + rows.join("\r\n");

  const rangeLabel = from || to ? `_${from ?? "start"}_to_${to ?? "now"}` : "";
  const filename = `sunwave-leads${rangeLabel}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
