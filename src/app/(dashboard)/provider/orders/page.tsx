"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
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

const NEXT_STATUS: Record<string, "PREPARING" | "READY" | "DELIVERED"> = {
  PLACED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await orderService.getOrders({
        status: statusFilter || undefined,
        limit: 30,
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

  const handleUpdateStatus = async (
    orderId: string,
    newStatus: "PREPARING" | "READY" | "DELIVERED"
  ) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not update status";
      toast.error(msg);
    }
  };

  const STATUSES = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        Incoming Orders
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setStatusFilter("")}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            statusFilter === ""
              ? "bg-orange-500 text-white"
              : "bg-white border border-gray-200 text-gray-600"
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
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white border border-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-100 rounded-2xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-900">
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
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {order.deliveryAddress}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-bold text-orange-500">
                    ৳{order.totalAmount}
                  </span>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
                  >
                    {order.status}
                  </span>
                  {NEXT_STATUS[order.status] && (
                    <button
                      onClick={() =>
                        handleUpdateStatus(order.id, NEXT_STATUS[order.status])
                      }
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-all"
                    >
                      Mark as {NEXT_STATUS[order.status]}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
