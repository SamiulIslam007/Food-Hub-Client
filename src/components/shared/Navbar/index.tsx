"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  User,
  ChevronDown,
  UtensilsCrossed,
  ChefHat,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Meals", href: "/meals" },
  { label: "Restaurants", href: "/providers" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/");
    setUserMenuOpen(false);
  };

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/admin"
      : user?.role === "PROVIDER"
      ? "/provider"
      : "/customer";

  const DashboardIcon =
    user?.role === "ADMIN"
      ? ShieldCheck
      : user?.role === "PROVIDER"
      ? ChefHat
      : User;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors shadow-md shadow-orange-200">
              <UtensilsCrossed className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-gray-900">
              Food<span className="text-orange-500">Hub</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  pathname === link.href
                    ? "text-orange-500 bg-orange-50"
                    : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {user?.role === "CUSTOMER" && (
                  <Link
                    href="/customer/cart"
                    className="relative p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-sm font-medium text-gray-700"
                  >
                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <DashboardIcon className="w-3.5 h-3.5 text-orange-500" />
                    </div>
                    <span>{user?.name?.split(" ")[0]}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 mb-1">
                        <p className="text-xs font-semibold text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <Link
                        href={dashboardHref}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <DashboardIcon className="w-4 h-4" />
                        Dashboard
                      </Link>
                      {user?.role === "CUSTOMER" && (
                        <Link
                          href="/customer/orders"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <ShoppingCart className="w-4 h-4" />
                          My Orders
                        </Link>
                      )}
                      <div className="mx-3 my-1 border-t border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-500 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-md hover:shadow-orange-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl font-medium transition-all ${
                pathname === link.href
                  ? "text-orange-500 bg-orange-50"
                  : "text-gray-600 hover:text-orange-500 hover:bg-orange-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  href={dashboardHref}
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-3 text-gray-700 border border-gray-200 rounded-xl font-semibold hover:border-orange-300 hover:text-orange-500 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-center px-4 py-3 bg-red-50 text-red-500 rounded-xl font-semibold hover:bg-red-100 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-3 text-gray-700 border border-gray-200 rounded-xl font-semibold hover:border-orange-300 hover:text-orange-500 transition-all"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
