import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/leadStatus";

function startOfDay(d: Date) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function toDateKey(d: Date) {
  // Local calendar date, not toISOString() - which would shift the date
  // backwards for any timezone ahead of UTC (e.g. IST) once close to
  // midnight, silently dropping "today" from the bucket map.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function GET() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const sevenDaysAgo = new Date(todayStart);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  const thirtyDaysAgo = new Date(todayStart);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  const trendStart = new Date(todayStart);
  trendStart.setDate(trendStart.getDate() - 13);

  const [
    allTime,
    todayCount,
    last7Days,
    last30Days,
    byPropertyTypeRaw,
    byStatusRaw,
    bySourceRaw,
    byCapacityRaw,
    trendRows,
    pendingReviews,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
    prisma.lead.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.lead.groupBy({ by: ["propertyType"], _count: { _all: true } }),
    prisma.lead.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.lead.groupBy({ by: ["source"], _count: { _all: true } }),
    prisma.lead.groupBy({ by: ["capacity"], _count: { _all: true } }),
    prisma.lead.findMany({
      where: { createdAt: { gte: trendStart } },
      select: { createdAt: true },
    }),
    prisma.review.count({ where: { status: "pending" } }),
  ]);

  const trendMap = new Map<string, number>();
  for (let i = 0; i < 14; i++) {
    const d = new Date(trendStart);
    d.setDate(d.getDate() + i);
    trendMap.set(toDateKey(d), 0);
  }
  for (const row of trendRows) {
    const key = toDateKey(row.createdAt);
    if (trendMap.has(key)) trendMap.set(key, (trendMap.get(key) ?? 0) + 1);
  }

  const statusCounts = new Map(byStatusRaw.map((r) => [r.status, r._count._all]));

  return NextResponse.json({
    totals: {
      allTime,
      today: todayCount,
      last7Days,
      last30Days,
    },
    byPropertyType: byPropertyTypeRaw
      .map((r) => ({ label: r.propertyType, value: r._count._all }))
      .sort((a, b) => b.value - a.value),
    byStatus: LEAD_STATUSES.map((s) => ({
      label: LEAD_STATUS_LABELS[s],
      value: statusCounts.get(s) ?? 0,
      key: s,
    })),
    bySource: bySourceRaw
      .map((r) => ({ label: r.source, value: r._count._all }))
      .sort((a, b) => b.value - a.value),
    byCapacity: byCapacityRaw
      .filter((r) => r.capacity)
      .map((r) => ({ label: r.capacity as string, value: r._count._all }))
      .sort((a, b) => b.value - a.value),
    trend: Array.from(trendMap.entries()).map(([date, count]) => ({ date, count })),
    pendingReviews,
  });
}
