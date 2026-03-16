"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MapPin, Phone, FileText, Banknote, CheckCircle } from "lucide-react";
import { cartService } from "@/services/cart.service";
import { orderService } from "@/services/order.service";
import { useAuth } from "@/context/AuthContext";

const checkoutSchema = z.object({
  deliveryAddress: z
    .string()
    .min(10, "Please enter a full delivery address"),
  phone: z.string().min(10, "Enter a valid phone number"),
  note: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

interface CartSummary {
  totalItems: number;
  totalQuantity: number;
  totalPrice: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [cartSummary, setCartSummary] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { phone: user?.phone || "" },
  });

  useEffect(() => {
    cartService
      .getCart()
      .then((res) => {
        if (!res.data?.items?.length) {
          router.push("/customer/cart");
          return;
        }
        setCartSummary(res.data.summary);
      })
      .catch(() => router.push("/customer/cart"))
      .finally(() => setIsLoading(false));
  }, [router]);

  const onSubmit = async (values: CheckoutForm) => {
    try {
      await orderService.placeOrder(values);
      setOrderPlaced(true);
      toast.success("Order placed successfully!");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not place order";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-2xl animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-1/3" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
          <div className="h-48 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">
            Order Placed!
          </h2>
          <p className="text-gray-500 mb-6">
            Your order has been received. Track it in My Orders.
          </p>
          <button
            onClick={() => router.push("/customer/orders")}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all"
          >
            View My Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 mb-5">
                Delivery Details
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea
                      {...register("deliveryAddress")}
                      rows={3}
                      placeholder="House no, Road, Area, City..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                    />
                  </div>
                  {errors.deliveryAddress && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.deliveryAddress.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+880 1XXX-XXXXXX"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Special Note{" "}
                    <span className="text-gray-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <textarea
                      {...register("note")}
                      rows={2}
                      placeholder="Any special instructions..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <h2 className="font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-gray-500">
                    Pay when your order arrives
                  </p>
                </div>
                <div className="ml-auto w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-xl transition-all text-sm"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            {cartSummary && (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Items ({cartSummary.totalQuantity})</span>
                  <span>৳{cartSummary.totalPrice.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-500 text-lg">
                    ৳{cartSummary.totalPrice.toFixed(0)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
