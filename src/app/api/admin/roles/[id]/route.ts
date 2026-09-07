import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizePermissions } from "@/lib/permissions";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

const updateRoleSchema = z.object({
  name: z.string().trim().min(2).optional(),
  permissions: z.record(z.string(), z.boolean()).optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid role id" }, { status: 400 });

  const role = await prisma.role.findUnique({ where: { id } });
  if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });
  if (role.isSystem) {
    return NextResponse.json({ error: "The built-in Owner role can't be edited" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = updateRoleSchema.parse(body);

    const updated = await prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        permissions: data.permissions ? normalizePermissions(data.permissions) : undefined,
      },
    });

    return NextResponse.json({ role: updated });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to update role:", err);
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid role id" }, { status: 400 });

  const role = await prisma.role.findUnique({ where: { id }, include: { _count: { select: { adminUsers: true } } } });
  if (!role) return NextResponse.json({ error: "Role not found" }, { status: 404 });

  if (role.isSystem) {
    return NextResponse.json({ error: "The built-in Owner role can't be deleted" }, { status: 400 });
  }
  if (role._count.adminUsers > 0) {
    return NextResponse.json(
      { error: `${role._count.adminUsers} user(s) still have this role - reassign them first` },
      { status: 400 }
    );
  }

  await prisma.role.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
