"use client";

import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { IOrder } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

interface AdminOrder extends IOrder {
  customer?: { name: string };
  providerProfile?: { businessName: string };
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setIsLoading(true);
    adminService
      .getAllOrders({
        status: statusFilter || undefined,
        limit: 30,
      })
      .then((res) => setOrders(res.data?.orders || res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, [statusFilter]);

  const STATUSES = [
    "PLACED",
    "PREPARING",
    "READY",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        All Orders
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
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-white border border-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Order ID", "Customer", "Restaurant", "Amount", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs font-semibold text-gray-400 uppercase px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 text-sm font-mono font-semibold text-gray-700">
                      #{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {order.customer?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-600">
                      {order.providerProfile?.businessName || "—"}
                    </td>
                    <td className="px-5 py-3 font-semibold text-orange-500 text-sm">
                      ৳{order.totalAmount}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[order.status]}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
