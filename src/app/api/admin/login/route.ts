import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_TTL_SECONDS,
  createSessionToken,
  timingSafeEqual,
  verifyPassword,
} from "@/lib/adminAuth";
import { prisma } from "@/lib/prisma";
import { ALL_PERMISSIONS, normalizePermissions } from "@/lib/permissions";

export async function POST(req: NextRequest) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const username = body.username ?? "";
  const password = body.password ?? "";

  let token: string | null = null;

  // Check DB-backed users first (created via /admin/users). A DB error here
  // (or the table simply being empty on a fresh install) falls through to
  // the env-var check below rather than locking everyone out.
  try {
    const user = username
      ? await prisma.adminUser.findUnique({ where: { username }, include: { role: true } })
      : null;
    if (user && (await verifyPassword(password, user.passwordHash))) {
      // isSystem (the seeded Owner role) always means every permission,
      // computed fresh rather than trusted from the stored JSON - so a role
      // created before a new permission key existed doesn't quietly end up
      // missing it forever.
      const permissions = user.role.isSystem ? ALL_PERMISSIONS : normalizePermissions(user.role.permissions);
      token = await createSessionToken({
        uid: user.id,
        username: user.username,
        roleName: user.role.name,
        permissions,
      });
    }
  } catch (err) {
    console.error("Admin user lookup failed, falling back to env credentials:", err);
  }

  // Env-var fallback - always available regardless of DB state, so the
  // original owner can never be locked out even if the DB is unreachable.
  if (!token) {
    const expectedUsername = process.env.ADMIN_USERNAME ?? "";
    const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
    const usernameOk =
      !!expectedUsername && username.length === expectedUsername.length && timingSafeEqual(username, expectedUsername);
    const passwordOk =
      !!expectedPassword && password.length === expectedPassword.length && timingSafeEqual(password, expectedPassword);

    if (usernameOk && passwordOk) {
      token = await createSessionToken({
        uid: 0,
        username: expectedUsername,
        roleName: "Owner",
        permissions: ALL_PERMISSIONS,
      });
    }
  }

  if (!token) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });
  return res;
}
