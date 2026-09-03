import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isLeadStatus } from "@/lib/leadStatus";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize")) || 20));
  const status = params.get("status") ?? "";
  const propertyType = params.get("propertyType") ?? "";
  const source = params.get("source") ?? "";
  const search = params.get("search")?.trim() ?? "";

  const where: Prisma.LeadWhereInput = {};

  if (status && isLeadStatus(status)) where.status = status;
  if (propertyType) where.propertyType = propertyType;
  if (source) where.source = source;
  if (search) {
    where.OR = [
      { fullName: { contains: search } },
      { mobile: { contains: search } },
      { email: { contains: search } },
      { city: { contains: search } },
    ];
  }

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    leads,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}
