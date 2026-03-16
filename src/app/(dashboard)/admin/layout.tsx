"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  ClipboardList,
  Tag,
} from "lucide-react";
import AuthGuard from "@/components/shared/AuthGuard";

const sidebarLinks = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Providers", href: "/admin/providers", icon: Store },
  { label: "Orders", href: "/admin/orders", icon: ClipboardList },
  { label: "Categories", href: "/admin/categories", icon: Tag },
];

function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 bg-gray-950 text-gray-300 flex-col sticky top-16 h-[calc(100vh-4rem)] shrink-0">
        <div className="p-5 border-b border-gray-800">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Admin Panel
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 z-40 flex">
        {sidebarLinks.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                active ? "text-orange-400" : "text-gray-500"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      <main className="flex-1 pb-20 lg:pb-0">{children}</main>
    </div>
  );
}

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRole="ADMIN">
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  );
}
