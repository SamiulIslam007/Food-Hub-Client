"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  UtensilsCrossed,
  Clock,
  ShoppingCart,
} from "lucide-react";
import { toast } from "sonner";
import { providerService } from "@/services/provider.service";
import { cartService } from "@/services/cart.service";
import { useAuth } from "@/context/AuthContext";
import { IProviderProfile, IMeal } from "@/types";

interface ProviderWithMeals extends IProviderProfile {
  meals?: IMeal[];
}

export default function ProviderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [provider, setProvider] = useState<ProviderWithMeals | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    providerService
      .getProviderById(id)
      .then((res) => setProvider(res.data))
      .catch(() => {
        toast.error("Restaurant not found");
        router.push("/providers");
      })
      .finally(() => setIsLoading(false));
  }, [id, router]);

  const handleAddToCart = async (mealId: string, mealName: string) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    if (user?.role !== "CUSTOMER") {
      toast.error("Only customers can add to cart");
      return;
    }
    try {
      await cartService.addToCart(mealId, 1);
      toast.success(`${mealName} added to cart!`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not add to cart";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <UtensilsCrossed className="w-12 h-12 text-orange-200 animate-pulse" />
      </div>
    );
  }

  if (!provider) return null;

  const bannerGradients = [
    "from-orange-400 to-amber-500",
    "from-rose-400 to-orange-500",
    "from-green-400 to-emerald-500",
    "from-blue-400 to-indigo-500",
  ];
  const gradient =
    bannerGradients[
      provider.businessName.charCodeAt(0) % bannerGradients.length
    ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/providers"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Restaurants
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
          <div className={`h-48 bg-gradient-to-br ${gradient} relative`}>
            {provider.banner && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={provider.banner}
                alt={provider.businessName}
                className="w-full h-full object-cover"
              />
            )}
            <span
              className={`absolute top-4 right-4 text-sm font-bold px-3 py-1.5 rounded-full ${
                provider.isOpen
                  ? "bg-green-500 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {provider.isOpen ? "Open Now" : "Closed"}
            </span>
          </div>

          <div className="px-6 sm:px-8 pb-6 -mt-8">
            <div className="w-16 h-16 bg-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden mb-4">
              {provider.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={provider.logo}
                  alt={provider.businessName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <UtensilsCrossed className="w-7 h-7 text-white" />
                </div>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
              {provider.businessName}
            </h1>

            {provider.description && (
              <p className="text-gray-600 text-sm mb-4 max-w-2xl">
                {provider.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-gray-900">
                  {provider.averageRating > 0
                    ? provider.averageRating.toFixed(1)
                    : "New"}
                </span>
                <span>rating</span>
              </div>
              {provider.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-orange-400" />
                  <span>{provider.city}</span>
                </div>
              )}
            </div>

            {provider.cuisineSpecialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {provider.cuisineSpecialties.map((c) => (
                  <span
                    key={c}
                    className="bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-5">
            Menu ({provider.meals?.length || 0} items)
          </h2>

          {!provider.meals || provider.meals.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
              <UtensilsCrossed className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500">No meals available right now</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {provider.meals.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 hover:border-orange-200 transition-colors"
                >
                  <Link
                    href={`/meals/${meal.id}`}
                    className="shrink-0 w-20 h-20 bg-gray-100 rounded-xl overflow-hidden"
                  >
                    {meal.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={meal.image}
                        alt={meal.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                      >
                        <UtensilsCrossed className="w-8 h-8 text-white/40" />
                      </div>
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/meals/${meal.id}`}>
                      <h3 className="font-bold text-gray-900 text-sm hover:text-orange-500 transition-colors mb-1 line-clamp-1">
                        {meal.title}
                      </h3>
                    </Link>
                    {meal.shortDescription && (
                      <p className="text-xs text-gray-500 line-clamp-1 mb-2">
                        {meal.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span className="text-orange-500 font-bold text-sm">
                          ৳{meal.price}
                        </span>
                        {meal.preparationTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {meal.preparationTime}m
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(meal.id, meal.title)}
                        disabled={meal.availabilityStatus === "UNAVAILABLE"}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {meal.availabilityStatus === "UNAVAILABLE"
                          ? "N/A"
                          : "Add"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
