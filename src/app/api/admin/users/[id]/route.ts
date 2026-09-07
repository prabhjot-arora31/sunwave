import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizePermissions } from "@/lib/permissions";

function parseId(idParam: string): number | null {
  const id = Number(idParam);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const id = parseId((await params).id);
  if (id === null) return NextResponse.json({ error: "Invalid user id" }, { status: 400 });

  const user = await prisma.adminUser.findUnique({ where: { id }, include: { role: true } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Soft safety net: don't let the DB run out of users who can manage
  // users/roles. (The env-var login always has full access regardless, so
  // this never risks a true lockout - it just avoids a confusing state.)
  if (normalizePermissions(user.role.permissions)["users.manage"]) {
    const others = await prisma.adminUser.findMany({
      where: { id: { not: id } },
      include: { role: true },
    });
    const othersWithAccess = others.filter((u) => normalizePermissions(u.role.permissions)["users.manage"]);
    if (othersWithAccess.length === 0) {
      return NextResponse.json(
        { error: "Can't delete the last user with user-management access. Create another one first." },
        { status: 400 }
      );
    }
  }

  await prisma.adminUser.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
