"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  UtensilsCrossed,
  ClipboardList,
  Store,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { adminService } from "@/services/admin.service";

interface Overview {
  totalUsers: number;
  customers: number;
  providers: number;
  totalOrders: number;
  deliveredOrders: number;
  totalMeals: number;
  activeProviders: number;
  totalRevenue: number;
}

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService
      .getOverview()
      .then((res) => setOverview(res.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const statCards = overview
    ? [
        {
          label: "Total Users",
          value: overview.totalUsers,
          sub: `${overview.customers} customers, ${overview.providers} providers`,
          icon: Users,
          color: "bg-blue-50 text-blue-500",
          href: "/admin/users",
        },
        {
          label: "Total Orders",
          value: overview.totalOrders,
          sub: `${overview.deliveredOrders} delivered`,
          icon: ClipboardList,
          color: "bg-green-50 text-green-500",
          href: "/admin/orders",
        },
        {
          label: "Total Meals",
          value: overview.totalMeals,
          sub: `From ${overview.activeProviders} restaurants`,
          icon: UtensilsCrossed,
          color: "bg-orange-50 text-orange-500",
          href: "/admin/providers",
        },
        {
          label: "Total Revenue",
          value: `৳${Number(overview.totalRevenue).toFixed(0)}`,
          sub: "From delivered orders",
          icon: TrendingUp,
          color: "bg-purple-50 text-purple-500",
          href: "/admin/orders",
        },
      ]
    : [];

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">Platform overview and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse h-32"
              />
            ))
          : statCards.map((card) => (
              <Link key={card.label} href={card.href}>
                <div className="bg-white border border-gray-100 hover:border-orange-200 rounded-2xl p-5 transition-all hover:shadow-md group">
                  <div
                    className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}
                  >
                    <card.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-extrabold text-gray-900 mb-0.5">
                    {card.value}
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {card.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                </div>
              </Link>
            ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            title: "Manage Users",
            desc: "View, activate, or suspend user accounts",
            href: "/admin/users",
            icon: Users,
          },
          {
            title: "Provider Approvals",
            desc: "Review and approve provider applications",
            href: "/admin/providers",
            icon: Store,
          },
          {
            title: "Monitor Orders",
            desc: "View all platform orders",
            href: "/admin/orders",
            icon: ClipboardList,
          },
          {
            title: "Manage Categories",
            desc: "Add, edit, or remove meal categories",
            href: "/admin/categories",
            icon: UtensilsCrossed,
          },
        ].map((item) => (
          <Link key={item.title} href={item.href}>
            <div className="bg-white border border-gray-100 hover:border-orange-200 rounded-2xl p-5 flex items-center gap-4 transition-all group hover:shadow-md">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-orange-500 transition-colors">
                <item.icon className="w-5 h-5 text-orange-500 group-hover:text-white transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
