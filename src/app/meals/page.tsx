import type { Metadata } from "next";
import { UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: "Browse Meals",
  description: "Explore hundreds of fresh meals from top local restaurants.",
};

export default function MealsPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <UtensilsCrossed className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Browse Meals</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Meals listing with search, filter, and pagination is coming soon.
        </p>
      </div>
    </div>
  );
}
