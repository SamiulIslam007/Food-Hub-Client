"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { cartService } from "@/services/cart.service";

interface CartItem {
  id: string;
  quantity: number;
  meal: {
    id: string;
    title: string;
    price: number;
    image?: string;
    availabilityStatus: string;
    providerProfile?: { businessName: string };
  };
}

interface CartData {
  items: CartItem[];
  summary: {
    totalItems: number;
    totalQuantity: number;
    totalPrice: number;
  };
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const res = await cartService.getCart();
      setCart(res.data);
    } catch {
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(itemId);
    try {
      await cartService.updateCartItem(itemId, newQty);
      await fetchCart();
    } catch (err: unknown) {
      toast.error(
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not update quantity"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (itemId: string) => {
    setUpdatingId(itemId);
    try {
      await cartService.removeCartItem(itemId);
      toast.success("Item removed");
      await fetchCart();
    } catch {
      toast.error("Could not remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      toast.success("Cart cleared");
      await fetchCart();
    } catch {
      toast.error("Could not clear cart");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-2xl">
          <div className="h-8 bg-gray-100 rounded w-1/3 mb-6 animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl mb-3 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingCart className="w-20 h-20 text-gray-200 mb-4" />
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Add some delicious meals to get started!
        </p>
        <Link
          href="/meals"
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all flex items-center gap-2"
        >
          <UtensilsCrossed className="w-4 h-4" />
          Browse Meals
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          My Cart ({items.length} items)
        </h1>
        <button
          onClick={handleClearCart}
          className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1.5"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4"
            >
              <div className="w-16 h-16 bg-orange-100 rounded-xl overflow-hidden shrink-0">
                {item.meal.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.meal.image}
                    alt={item.meal.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UtensilsCrossed className="w-6 h-6 text-orange-300" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                  {item.meal.title}
                </h3>
                {item.meal.providerProfile && (
                  <p className="text-xs text-gray-500 mb-2">
                    {item.meal.providerProfile.businessName}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={updatingId === item.id || item.quantity <= 1}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-orange-400 disabled:opacity-40 transition-all"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-gray-900 w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={updatingId === item.id}
                      className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-orange-400 disabled:opacity-40 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-orange-500">
                      ৳{(Number(item.meal.price) * item.quantity).toFixed(0)}
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      disabled={updatingId === item.id}
                      className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-24">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart?.summary.totalQuantity} items)</span>
                <span>৳{cart?.summary.totalPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span className="text-orange-500 text-lg">
                  ৳{cart?.summary.totalPrice.toFixed(0)}
                </span>
              </div>
            </div>
            <Link
              href="/customer/checkout"
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
