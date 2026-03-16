"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  UtensilsCrossed,
  Star,
  Clock,
  X,
} from "lucide-react";
import { mealService } from "@/services/meal.service";
import { categoryService } from "@/services/category.service";
import { IMeal, ICategory } from "@/types";

const SPICE_LEVELS = ["Mild", "Medium", "Hot", "Extra Hot"];
const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
  { value: "title:asc", label: "Name A–Z" },
];

export default function MealsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [meals, setMeals] = useState<IMeal[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("category") || ""
  );
  const [sortVal, setSortVal] = useState("createdAt:desc");
  const [page, setPage] = useState(1);

  const fetchMeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sortBy, sortOrder] = sortVal.split(":");
      const res = await mealService.getAllMeals({
        search: search || undefined,
        categoryId: categoryId || undefined,
        sortBy: sortBy as "price" | "createdAt" | "title",
        sortOrder: sortOrder as "asc" | "desc",
        page,
        limit: 12,
        availabilityStatus: "AVAILABLE",
      });
      setMeals(res.data.meals || res.data || []);
      setTotalPages(res.data.meta?.totalPages || 1);
      setTotal(res.data.meta?.total || 0);
    } catch {
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, categoryId, sortVal, page]);

  useEffect(() => {
    categoryService.getAllCategories().then((r) => setCategories(r.data || []));
  }, []);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMeals();
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setSortVal("createdAt:desc");
    setPage(1);
    router.push("/meals");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Browse Meals
          </h1>
          <p className="text-gray-500">
            {total > 0 ? `${total} fresh meals available` : "Explore our menu"}
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-5 flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search meals, cuisines..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm transition-all"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 border rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                showFilters
                  ? "border-orange-400 text-orange-500 bg-orange-50"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {showFilters && (
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900">Filters</h2>
                  <button
                    onClick={clearFilters}
                    className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                  >
                    Clear all
                  </button>
                </div>

                {/* Category Filter */}
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Category
                  </h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value=""
                        checked={categoryId === ""}
                        onChange={() => {
                          setCategoryId("");
                          setPage(1);
                        }}
                        className="accent-orange-500"
                      />
                      <span className="text-sm text-gray-600">All</span>
                    </label>
                    {categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="category"
                          value={cat.id}
                          checked={categoryId === cat.id}
                          onChange={() => {
                            setCategoryId(cat.id);
                            setPage(1);
                          }}
                          className="accent-orange-500"
                        />
                        <span className="text-sm text-gray-600">
                          {cat.icon} {cat.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Sort By
                  </h3>
                  <select
                    value={sortVal}
                    onChange={(e) => {
                      setSortVal(e.target.value);
                      setPage(1);
                    }}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </aside>
          )}

          <div className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                  >
                    <div className="h-44 bg-gray-100" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-8 bg-gray-100 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : meals.length === 0 ? (
              <div className="text-center py-20">
                <UtensilsCrossed className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No meals found
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  Try different search terms or clear filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {meals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-xl border border-gray-200 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                            page === p
                              ? "bg-orange-500 text-white"
                              : "border border-gray-200 text-gray-600 hover:border-orange-300"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="p-2 rounded-xl border border-gray-200 hover:border-orange-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MealCard({ meal }: { meal: IMeal }) {
  const gradients = [
    "from-orange-400 to-amber-500",
    "from-rose-400 to-orange-500",
    "from-amber-400 to-yellow-500",
    "from-green-400 to-emerald-500",
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-pink-500",
  ];
  const gradient = gradients[meal.title.charCodeAt(0) % gradients.length];

  return (
    <Link href={`/meals/${meal.id}`}>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/80 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
        <div className={`h-44 bg-gradient-to-br ${gradient} relative`}>
          {meal.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={meal.image}
              alt={meal.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/30">
              <UtensilsCrossed className="w-16 h-16" />
            </div>
          )}
          {meal.featured && (
            <span className="absolute top-3 left-3 bg-white/90 text-orange-500 text-[10px] font-bold px-2 py-1 rounded-full">
              Featured
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-orange-500 transition-colors line-clamp-1">
              {meal.title}
            </h3>
            <span className="text-orange-500 font-bold text-sm shrink-0">
              ৳{meal.price}
            </span>
          </div>

          {meal.shortDescription && (
            <p className="text-gray-500 text-xs line-clamp-2 mb-3">
              {meal.shortDescription}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>
                {meal.providerProfile?.averageRating?.toFixed(1) || "New"}
              </span>
            </div>
            {meal.preparationTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{meal.preparationTime} min</span>
              </div>
            )}
            {meal.category && (
              <span className="bg-gray-100 px-2 py-0.5 rounded-full">
                {meal.category.name}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

SPICE_LEVELS;
