"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Package } from "lucide-react";
import { orderService } from "@/services/order.service";

const STATUS_COLORS: Record<string, string> = {
  PLACED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-amber-100 text-amber-700",
  READY: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-600",
};

interface OrderDetail {
  id: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  phone: string;
  note?: string;
  paymentMethod: string;
  createdAt: string;
  providerProfile?: { businessName: string };
  orderItems?: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    meal?: { title: string; image?: string };
  }>;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch(() => router.push("/customer/orders"))
      .finally(() => setIsLoading(false));
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 animate-pulse">
        <div className="h-6 bg-gray-100 rounded w-1/3 mb-6" />
        <div className="h-48 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/customer/orders"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {new Date(order.createdAt).toLocaleDateString("en-BD", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`text-sm font-bold px-4 py-1.5 rounded-full ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-500" />
            Order Items
          </h2>
          {order.providerProfile && (
            <p className="text-sm text-gray-500 mb-4">
              From: <span className="font-semibold text-gray-700">{order.providerProfile.businessName}</span>
            </p>
          )}
          <div className="space-y-3">
            {(order.orderItems || []).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-400 text-xs font-bold">
                    ×{item.quantity}
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {item.meal?.title || "Unknown Meal"}
                  </span>
                </div>
                <span className="text-sm font-bold text-orange-500">
                  ৳{(item.unitPrice * item.quantity).toFixed(0)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between font-bold">
            <span className="text-gray-900">Total</span>
            <span className="text-orange-500 text-lg">৳{order.totalAmount}</span>
          </div>
        </div>

        {/* Delivery Info */}
          <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 mb-3">Delivery Info</h2>
            <div className="space-y-3 text-sm">
              <div className="flex gap-2">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-gray-600">{order.deliveryAddress}</span>
              </div>
              <div className="flex gap-2">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span className="text-gray-600">{order.phone}</span>
              </div>
              {order.note && (
                <p className="text-gray-500 text-xs bg-gray-50 p-3 rounded-xl">
                  📝 {order.note}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="font-bold text-gray-900 mb-3">Payment</h2>
            <p className="text-sm text-gray-600">Cash on Delivery (COD)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
