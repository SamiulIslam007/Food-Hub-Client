"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  User,
  Plus,
} from "lucide-react";
import AuthGuard from "@/components/shared/AuthGuard";

const sidebarLinks = [
  { label: "Overview", href: "/provider", icon: LayoutDashboard },
  { label: "My Meals", href: "/provider/meals", icon: UtensilsCrossed },
  { label: "Orders", href: "/provider/orders", icon: ClipboardList },
  { label: "Profile", href: "/provider/profile", icon: User },
];

function ProviderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-60 bg-white border-r border-gray-100 flex-col sticky top-16 h-[calc(100vh-4rem)] shrink-0">
        <div className="p-5 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Provider Portal
          </p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/provider"
                ? pathname === "/provider"
                : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-orange-50 text-orange-500"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <Link
            href="/provider/meals/new"
            className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Meal
          </Link>
        </div>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-40 flex">
        {sidebarLinks.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/provider"
              ? pathname === "/provider"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors ${
                active ? "text-orange-500" : "text-gray-500"
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

export default function ProviderLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRole="PROVIDER">
      <ProviderLayout>{children}</ProviderLayout>
    </AuthGuard>
  );
}
