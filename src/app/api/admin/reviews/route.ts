import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isReviewStatus } from "@/lib/reviewStatus";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize")) || 20));
  const status = params.get("status") ?? "";

  const where: Prisma.ReviewWhereInput = {};
  if (status && isReviewStatus(status)) where.status = status;

  const [total, pendingCount, reviews] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.count({ where: { status: "pending" } }),
    prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    reviews,
    pendingCount,
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}
