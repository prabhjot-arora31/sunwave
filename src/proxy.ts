import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth";
import type { PermissionKey } from "@/lib/permissions";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

// Maps a request to the single permission key that governs it, or null if
// any logged-in admin can access it regardless of role (the Dashboard, and
// the shared /api/admin/me and /api/admin/logout endpoints).
function requiredPermission(pathname: string, method: string): PermissionKey | null {
  const startsWithAny = (...prefixes: string[]) => prefixes.some((p) => pathname.startsWith(p));

  if (startsWithAny("/admin/users", "/api/admin/users", "/admin/roles", "/api/admin/roles")) {
    return "users.manage";
  }
  if (startsWithAny("/admin/settings", "/api/admin/settings")) {
    return "settings.manage";
  }
  if (startsWithAny("/admin/reviews", "/api/admin/reviews")) {
    return "reviews.manage";
  }
  if (startsWithAny("/admin/gallery", "/api/admin/gallery")) {
    return method === "DELETE" ? "gallery.delete" : "gallery.manage";
  }
  if (startsWithAny("/admin/blog", "/api/admin/blog")) {
    return method === "DELETE" ? "blog.delete" : "blog.manage";
  }
  if (startsWithAny("/admin/invoices", "/api/admin/invoices")) {
    if (method === "DELETE") return "invoices.delete";
    if (method === "GET") return "invoices.view";
    return "invoices.edit";
  }
  if (startsWithAny("/admin/projects", "/api/admin/projects")) {
    if (method === "DELETE") return "projects.delete";
    if (method === "GET") return "projects.view";
    return "projects.edit";
  }
  if (startsWithAny("/admin/customers", "/api/admin/customers")) {
    if (method === "DELETE") return "customers.delete";
    if (method === "GET") return "customers.view";
    return "customers.edit";
  }
  if (startsWithAny("/admin/leads", "/api/admin/leads")) {
    if (method === "DELETE" && /^\/api\/admin\/leads\/\d+$/.test(pathname)) return "leads.delete";
    if (method === "GET") return "leads.view";
    return "leads.edit";
  }

  return null;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  if (!session) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const permission = requiredPermission(pathname, req.method);
  if (permission && !session.permissions[permission]) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}
