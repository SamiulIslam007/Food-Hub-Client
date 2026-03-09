import type { Metadata } from "next";
import { Store } from "lucide-react";

export const metadata: Metadata = {
  title: "Restaurants",
  description: "Discover top local restaurants on FoodHub.",
};

export default function ProvidersPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <Store className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Restaurants</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Restaurant listing with filters and ratings is coming soon.
        </p>
      </div>
    </div>
  );
}
