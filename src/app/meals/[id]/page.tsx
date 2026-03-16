"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  Clock,
  ShoppingCart,
  Heart,
  Leaf,
  Flame,
  CheckCircle,
  UtensilsCrossed,
  MapPin,
  MessageSquare,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { mealService } from "@/services/meal.service";
import { cartService } from "@/services/cart.service";
import { reviewService } from "@/services/review.service";
import { favoriteService } from "@/services/favorite.service";
import { useAuth } from "@/context/AuthContext";
import { IMeal } from "@/types";

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  customer: { name: string; avatar?: string };
}

export default function MealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const [meal, setMeal] = useState<IMeal | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mealRes, reviewRes] = await Promise.all([
          mealService.getMealById(id),
          reviewService.getReviews(id),
        ]);
        setMeal(mealRes.data);
        setReviews(reviewRes.data?.reviews || reviewRes.data || []);
      } catch {
        toast.error("Meal not found");
        router.push("/meals");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, router]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }
    if (user?.role !== "CUSTOMER") {
      toast.error("Only customers can add to cart");
      return;
    }
    setAddingToCart(true);
    try {
      await cartService.addToCart(id, quantity);
      toast.success(`${meal?.title} added to cart!`);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not add to cart";
      toast.error(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      const res = await favoriteService.toggleFavorite(id);
      setIsFavorited(res.data?.action === "added");
      toast.success(
        res.data?.action === "added" ? "Added to favorites!" : "Removed from favorites"
      );
    } catch {
      toast.error("Could not update favorites");
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        mealId: id,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review submitted!");
      setReviewComment("");
      setReviewRating(5);
      const reviewRes = await reviewService.getReviews(id);
      setReviews(reviewRes.data?.reviews || reviewRes.data || []);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not submit review";
      toast.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UtensilsCrossed className="w-12 h-12 text-orange-200 mx-auto animate-pulse mb-3" />
          <p className="text-gray-500">Loading meal details...</p>
        </div>
      </div>
    );
  }

  if (!meal) return null;

  const gradients = [
    "from-orange-400 to-amber-500",
    "from-rose-400 to-orange-500",
    "from-amber-400 to-yellow-500",
    "from-green-400 to-emerald-500",
  ];
  const gradient = gradients[meal.title.charCodeAt(0) % gradients.length];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/meals"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Meals
        </Link>

        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-8">
          <div
            className={`h-64 sm:h-80 bg-gradient-to-br ${gradient} relative`}
          >
            {meal.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={meal.image}
                alt={meal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <UtensilsCrossed className="w-24 h-24 text-white/20" />
              </div>
            )}
            {meal.featured && (
              <span className="absolute top-4 left-4 bg-white/90 text-orange-500 text-xs font-bold px-3 py-1.5 rounded-full">
                ⭐ Featured
              </span>
            )}
            <button
              onClick={handleToggleFavorite}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                isFavorited
                  ? "bg-red-500 text-white"
                  : "bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`}
              />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                    {meal.title}
                  </h1>
                  <span className="text-2xl font-extrabold text-orange-500 shrink-0">
                    ৳{meal.price}
                  </span>
                </div>

                {meal.shortDescription && (
                  <p className="text-gray-600 mb-4">{meal.shortDescription}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-4">
                  {meal.category && (
                    <span className="bg-orange-50 text-orange-600 text-xs font-semibold px-3 py-1 rounded-full">
                      {meal.category.name}
                    </span>
                  )}
                  {meal.spiceLevel && (
                    <span className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {meal.spiceLevel}
                    </span>
                  )}
                  {meal.dietaryTags?.map((tag) => (
                    <span
                      key={tag}
                      className="bg-green-50 text-green-600 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <Leaf className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-semibold">
                      {meal.providerProfile?.averageRating?.toFixed(1) || "New"}
                    </span>
                  </div>
                  {meal.preparationTime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{meal.preparationTime} min prep</span>
                    </div>
                  )}
                  {meal.stockQuantity !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{meal.stockQuantity} in stock</span>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">
                    About this meal
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {meal.description}
                  </p>
                </div>

                {meal.providerProfile && (
                  <Link
                    href={`/providers/${meal.providerProfileId}`}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-orange-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm group-hover:text-orange-500 transition-colors">
                        {meal.providerProfile.businessName}
                      </p>
                      {meal.providerProfile.city && (
                        <p className="text-xs text-gray-500">
                          {meal.providerProfile.city}
                        </p>
                      )}
                    </div>
                  </Link>
                )}
              </div>

              <div className="sm:w-56 shrink-0">
                <div className="bg-gray-50 rounded-2xl p-5 sticky top-24">
                  <p className="text-sm font-semibold text-gray-700 mb-3">
                    Quantity
                  </p>
                  <div className="flex items-center gap-3 mb-4">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-all font-bold"
                    >
                      −
                    </button>
                    <span className="font-bold text-gray-900 text-lg w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-all font-bold"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm">
                    <span className="text-gray-500">Total</span>
                    <span className="font-bold text-orange-500 text-lg">
                      ৳{(Number(meal.price) * quantity).toFixed(0)}
                    </span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={
                      addingToCart ||
                      meal.availabilityStatus === "UNAVAILABLE"
                    }
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl text-sm transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {addingToCart
                      ? "Adding..."
                      : meal.availabilityStatus === "UNAVAILABLE"
                      ? "Unavailable"
                      : "Add to Cart"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-orange-500" />
            Customer Reviews ({reviews.length})
          </h2>

          {isAuthenticated && user?.role === "CUSTOMER" && (
            <form
              onSubmit={handleSubmitReview}
              className="mb-8 p-5 bg-orange-50 rounded-2xl border border-orange-100"
            >
              <h3 className="font-semibold text-gray-900 mb-3">
                Write a Review
              </h3>
              <div className="flex gap-1 mb-3">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReviewRating(r)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        r <= reviewRating
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience with this meal..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none mb-3"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold rounded-xl text-sm transition-all"
              >
                <Send className="w-4 h-4" />
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {reviews.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No reviews yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 pb-4 last:border-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-orange-500 text-xs font-bold">
                          {review.customer.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-semibold text-sm text-gray-900">
                        {review.customer.name}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <Star
                          key={r}
                          className={`w-3.5 h-3.5 ${
                            r <= review.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-600 ml-10">
                      {review.comment}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 ml-10 mt-1">
                    {new Date(review.createdAt).toLocaleDateString("en-BD", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
