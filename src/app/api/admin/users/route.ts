import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/adminAuth";
import { createAdminUserSchema } from "@/lib/adminUserSchema";

export async function GET() {
  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, username: true, createdAt: true, role: { select: { id: true, name: true } } },
  });
  return NextResponse.json({ users });
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const data = createAdminUserSchema.parse(body);

    const existing = await prisma.adminUser.findUnique({ where: { username: data.username } });
    if (existing) {
      return NextResponse.json({ error: "That username is already taken" }, { status: 409 });
    }

    const role = await prisma.role.findUnique({ where: { id: data.roleId } });
    if (!role) {
      return NextResponse.json({ error: "That role doesn't exist" }, { status: 400 });
    }

    const passwordHash = await hashPassword(data.password);
    const user = await prisma.adminUser.create({
      data: { username: data.username, passwordHash, roleId: data.roleId },
      select: { id: true, username: true, createdAt: true, role: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: err.flatten().fieldErrors },
        { status: 422 }
      );
    }
    console.error("Failed to create admin user:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
