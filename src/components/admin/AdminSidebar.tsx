"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, Users, Contact, Star, Image as ImageIcon, Newspaper, Receipt, HardHat, Settings, ShieldCheck, LogOut, Loader2, Menu, X, ExternalLink } from "lucide-react";
import type { PermissionKey, PermissionMap } from "@/lib/permissions";

const navItems: { label: string; href: string; icon: typeof LayoutDashboard; requires: PermissionKey | null }[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, requires: null },
  { label: "Leads", href: "/admin/leads", icon: Users, requires: "leads.view" },
  { label: "Customers", href: "/admin/customers", icon: Contact, requires: "customers.view" },
  { label: "Projects", href: "/admin/projects", icon: HardHat, requires: "projects.view" },
  { label: "Invoices", href: "/admin/invoices", icon: Receipt, requires: "invoices.view" },
  { label: "Reviews", href: "/admin/reviews", icon: Star, requires: "reviews.manage" },
  { label: "Gallery", href: "/admin/gallery", icon: ImageIcon, requires: "gallery.manage" },
  { label: "Blog", href: "/admin/blog", icon: Newspaper, requires: "blog.manage" },
  { label: "Settings", href: "/admin/settings", icon: Settings, requires: "settings.manage" },
  { label: "Admin Users", href: "/admin/users", icon: ShieldCheck, requires: "users.manage" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [me, setMe] = useState<{ username: string; roleName: string; permissions: PermissionMap } | null>(null);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setMe(data))
      .catch(() => setMe(null));
  }, []);

  const visibleNavItems = navItems.filter((item) => !item.requires || me?.permissions[item.requires]);

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const content = (
    <>
      <div className="px-5 py-5">
        <div className="inline-flex items-center bg-white rounded-lg px-2.5 py-1.5 mb-1.5">
          <Image src="/logo.png" alt="Sun Wave" width={395} height={182} className="h-7 w-auto" />
        </div>
        <p className="text-xs text-slate-400 leading-tight">
          {me ? `${me.username} · ${me.roleName}` : "Admin Panel"}
        </p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {visibleNavItems.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-sun-700 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 space-y-1 border-t border-white/10 pt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View Website
        </Link>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white transition-colors disabled:opacity-60"
        >
          {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col w-60 shrink-0 bg-sky-950 min-h-screen sticky top-0 print:hidden">
        {content}
      </aside>

      <div className="lg:hidden w-full sticky top-0 z-40 flex items-center justify-between bg-sky-950 px-4 py-3 print:hidden">
        <div className="inline-flex items-center bg-white rounded-lg px-2.5 py-1.5">
          <Image src="/logo.png" alt="Sun Wave" width={395} height={182} className="h-6 w-auto" />
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 text-white" aria-label="Toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-sky-950 flex flex-col pt-14 print:hidden">{content}</div>
      )}
    </>
  );
}
