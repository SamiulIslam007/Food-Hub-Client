"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  Plus,
  AlertCircle,
} from "lucide-react";
import { mealService } from "@/services/meal.service";
import { orderService } from "@/services/order.service";
import { providerService } from "@/services/provider.service";
import { useAuth } from "@/context/AuthContext";

const STATUS_COLORS: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ meals: 0, orders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState<
    Array<{
      id: string;
      status: string;
      totalAmount: number;
      createdAt: string;
    }>
  >([]);
  const [profileStatus, setProfileStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealsRes, ordersRes, profileRes] = await Promise.allSettled([
          mealService.getAllMeals({ limit: 1 }),
          orderService.getOrders({ limit: 5 }),
          providerService.getMyProfile(),
        ]);

        if (mealsRes.status === "fulfilled") {
          setStats((s) => ({
            ...s,
            meals: mealsRes.value.data?.meta?.total || 0,
          }));
        }
        if (ordersRes.status === "fulfilled") {
          const orders = ordersRes.value.data?.orders || [];
          setRecentOrders(orders.slice(0, 4));
          const revenue = orders
            .filter(
              (o: { status: string; totalAmount: number }) =>
                o.status === "DELIVERED"
            )
            .reduce(
              (sum: number, o: { totalAmount: number }) =>
                sum + o.totalAmount,
              0
            );
          setStats((s) => ({
            ...s,
            orders: ordersRes.value.data?.meta?.total || orders.length,
            revenue,
          }));
        }
        if (profileRes.status === "fulfilled") {
          setProfileStatus(
            profileRes.value.data?.approvalStatus || "PENDING"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Provider Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {user?.name?.split(" ")[0]}
        </p>
      </div>

      {profileStatus && profileStatus !== "APPROVED" && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              {profileStatus === "PENDING"
                ? "Profile Pending Approval"
                : "Profile Rejected"}
            </p>
            <p className="text-xs text-amber-600 mt-0.5">
              {profileStatus === "PENDING"
                ? "Your provider profile is under review. You can add meals but they won't be visible until approved."
                : "Your profile was rejected. Please update it and contact support."}
            </p>
            <Link
              href="/provider/profile"
              className="text-xs text-amber-700 font-semibold underline mt-1 inline-block"
            >
              View Profile →
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
            <UtensilsCrossed className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {isLoading ? "..." : stats.meals}
          </p>
          <p className="text-sm text-gray-500">Total Meals</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <ClipboardList className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {isLoading ? "..." : stats.orders}
          </p>
          <p className="text-sm text-gray-500">Total Orders</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 col-span-2 sm:col-span-1">
          <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {isLoading ? "..." : `৳${stats.revenue.toFixed(0)}`}
          </p>
          <p className="text-sm text-gray-500">Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link
          href="/provider/meals/new"
          className="flex items-center gap-3 p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl transition-all group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm">Add New Meal</span>
        </Link>
        <Link
          href="/provider/orders"
          className="flex items-center gap-3 p-4 bg-white border border-gray-100 hover:border-orange-200 rounded-2xl transition-all group"
        >
          <ClipboardList className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="font-semibold text-sm text-gray-900">
            View Orders
          </span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/provider/orders"
            className="text-orange-500 text-sm font-medium flex items-center gap-1"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-6">
            No orders yet
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-orange-500 text-sm">
                    ৳{order.totalAmount}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
