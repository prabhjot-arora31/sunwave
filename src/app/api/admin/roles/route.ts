import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizePermissions } from "@/lib/permissions";
import { ensureOwnerRole } from "@/lib/roles";

const createRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name must be at least 2 characters"),
  permissions: z.record(z.string(), z.boolean()),
});

export async function GET() {
  await ensureOwnerRole();
  const roles = await prisma.role.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { adminUsers: true } } },
  });
  return NextResponse.json({ roles });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = createRoleSchema.parse(body);

    const existing = await prisma.role.findUnique({ where: { name: data.name } });
    if (existing) {
      return NextResponse.json({ error: "A role with that name already exists" }, { status: 409 });
    }

    const permissions = normalizePermissions(data.permissions);

    const role = await prisma.role.create({
      data: { name: data.name, permissions, isSystem: false },
    });

    return NextResponse.json({ role }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to create role:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
