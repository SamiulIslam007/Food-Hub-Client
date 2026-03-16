"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  UtensilsCrossed,
} from "lucide-react";
import { toast } from "sonner";
import { mealService } from "@/services/meal.service";
import { IMeal } from "@/types";

export default function ProviderMealsPage() {
  const [meals, setMeals] = useState<IMeal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMeals = async () => {
    setIsLoading(true);
    try {
      const res = await mealService.getAllMeals({ limit: 50 });
      setMeals(res.data?.meals || res.data || []);
    } catch {
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await mealService.toggleAvailability(id);
      toast.success("Availability updated");
      fetchMeals();
    } catch {
      toast.error("Could not update availability");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try {
      await mealService.deleteMeal(id);
      toast.success("Meal deleted");
      fetchMeals();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not delete meal";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">My Meals</h1>
        <Link
          href="/provider/meals/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Meal
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : meals.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <UtensilsCrossed className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">No meals yet</h3>
          <p className="text-gray-500 text-sm mb-4">Add your first meal</p>
          <Link
            href="/provider/meals/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl font-semibold text-sm hover:bg-orange-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Meal
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Meal
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Category
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Price
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {meals.map((meal) => (
                  <tr key={meal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                          {meal.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={meal.image}
                              alt={meal.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UtensilsCrossed className="w-5 h-5 text-orange-300" />
                          )}
                        </div>
                        <span className="font-semibold text-gray-900 text-sm">
                          {meal.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">
                        {meal.category?.name || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-orange-500 text-sm">
                        ৳{meal.price}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          meal.availabilityStatus === "AVAILABLE"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {meal.availabilityStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(meal.id)}
                          title="Toggle availability"
                          className="p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
                        >
                          {meal.availabilityStatus === "AVAILABLE" ? (
                            <ToggleRight className="w-5 h-5 text-green-500" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(meal.id, meal.title)}
                          title="Delete meal"
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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
