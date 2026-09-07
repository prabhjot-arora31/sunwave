import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { createProjectSchema } from "@/lib/projectSchema";
import { isProjectStage } from "@/lib/projectStage";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const page = Math.max(1, Number(params.get("page")) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(params.get("pageSize")) || 20));
  const stage = params.get("stage") ?? "";
  const search = params.get("search")?.trim() ?? "";

  const where: Prisma.ProjectWhereInput = {};
  if (stage && isProjectStage(stage)) where.stage = stage;
  if (search) {
    where.OR = [
      { customerName: { contains: search } },
      { customerPhone: { contains: search } },
    ];
  }

  const [total, projects] = await Promise.all([
    prisma.project.count({ where }),
    prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    projects,
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
    const data = createProjectSchema.parse(body);

    const project = await prisma.project.create({
      data: {
        leadId: data.leadId,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerAddress: data.customerAddress,
        capacity: data.capacity,
        stage: data.stage,
        installDate: data.installDate ? new Date(data.installDate) : undefined,
        commissioningDate: data.commissioningDate ? new Date(data.commissioningDate) : undefined,
        subsidyCreditedDate: data.subsidyCreditedDate ? new Date(data.subsidyCreditedDate) : undefined,
        notes: data.notes,
      },
    });

    return NextResponse.json({ ok: true, id: project.id }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to create project:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
