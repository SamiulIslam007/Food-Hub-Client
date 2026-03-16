"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClipboardList, ChevronRight, X } from "lucide-react";
import { toast } from "sonner";
import { orderService } from "@/services/order.service";
import { IOrder } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

const STATUSES = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getOrders({
        status: statusFilter || undefined,
        limit: 20,
      });
      setOrders(res.data?.orders || res.data || []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleCancel = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not cancel order";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            statusFilter === ""
              ? "bg-orange-500 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
          }`}
        >
          All
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === s
                ? "bg-orange-500 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-500 text-sm mb-4">
            Your orders will appear here
          </p>
          <Link
            href="/meals"
            className="inline-block px-5 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition-colors"
          >
            Order Now
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-100 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                  <span className="font-bold text-orange-500">
                    ৳{order.totalAmount}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="text-xs text-gray-500 truncate max-w-xs">
                  📍 {order.deliveryAddress}
                </div>
                <div className="flex items-center gap-3">
                  {order.status === "PLACED" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  )}
                  <Link
                    href={`/customer/orders/${order.id}`}
                    className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Details
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
