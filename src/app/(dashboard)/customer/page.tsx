"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  ClipboardList,
  Heart,
  ArrowRight,
  Package,
  CheckCircle,
} from "lucide-react";
import { orderService } from "@/services/order.service";
import { useAuth } from "@/context/AuthContext";
import { IOrder } from "@/types";

const ORDER_STATUS_COLORS: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-green-100 text-green-700",
  DELIVERED: "bg-gray-100 text-gray-600",
  CANCELLED: "bg-red-100 text-red-600",
};

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([]);
  const [stats, setStats] = useState({ total: 0, delivered: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrders({ limit: 5 })
      .then((res) => {
        const orders = res.data?.orders || res.data || [];
        setRecentOrders(orders.slice(0, 3));
        setStats({
          total: res.data?.meta?.total || orders.length,
          delivered: orders.filter(
            (o: IOrder) => o.status === "DELIVERED"
          ).length,
        });
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">
          Hello, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">What would you like to eat today?</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Link
          href="/meals"
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl p-5 flex items-center gap-3 transition-all hover:shadow-lg hover:shadow-orange-200/50 group"
        >
          <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
          <div>
            <p className="font-bold">Order Food</p>
            <p className="text-xs text-orange-100">Browse meals</p>
          </div>
        </Link>
        <Link
          href="/customer/orders"
          className="bg-white border border-gray-100 hover:border-orange-200 rounded-2xl p-5 flex items-center gap-3 transition-all group"
        >
          <ClipboardList className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
          <div>
            <p className="font-bold text-gray-900">My Orders</p>
            <p className="text-xs text-gray-500">Track orders</p>
          </div>
        </Link>
        <Link
          href="/customer/cart"
          className="bg-white border border-gray-100 hover:border-orange-200 rounded-2xl p-5 flex items-center gap-3 transition-all group"
        >
          <ShoppingCart className="w-6 h-6 text-orange-400 group-hover:scale-110 transition-transform" />
          <div>
            <p className="font-bold text-gray-900">My Cart</p>
            <p className="text-xs text-gray-500">View cart</p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-sm text-gray-500">Total Orders</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {isLoading ? "..." : stats.total}
          </p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <span className="text-sm text-gray-500">Delivered</span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {isLoading ? "..." : stats.delivered}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link
            href="/customer/orders"
            className="text-orange-500 text-sm font-medium flex items-center gap-1 hover:text-orange-600"
          >
            View all
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-50 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <Heart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No orders yet</p>
            <Link
              href="/meals"
              className="mt-3 inline-block px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
            >
              Order Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/customer/orders/${order.id}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Order #{order.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-gray-900">
                    ৳{order.totalAmount}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
