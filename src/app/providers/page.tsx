"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Star,
  MapPin,
  UtensilsCrossed,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { providerService } from "@/services/provider.service";
import { IProviderProfile } from "@/types";

const CITIES = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"];

export default function ProvidersPage() {
  const [providers, setProviders] = useState<IProviderProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProviders = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await providerService.getAllProviders({
        search: search || undefined,
        city: city || undefined,
        page,
        limit: 12,
        sortBy: "averageRating",
        sortOrder: "desc",
      });
      setProviders(res.data?.providers || res.data || []);
      setTotalPages(res.data?.meta?.totalPages || 1);
      setTotal(res.data?.meta?.total || 0);
    } catch {
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  }, [search, city, page]);

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

  const clearFilters = () => {
    setSearch("");
    setCity("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Restaurants
          </h1>
          <p className="text-gray-500">
            {total > 0
              ? `${total} restaurants available`
              : "Discover top local restaurants"}
          </p>

          <div className="mt-5 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search restaurants..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {search && (
                <button
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
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setPage(1);
              }}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 bg-white min-w-[140px]"
            >
              <option value="">All Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {(search || city) && (
              <button
                onClick={clearFilters}
                className="px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-500 hover:text-orange-500 hover:border-orange-300 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="h-32 bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-20">
            <UtensilsCrossed className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Try different search terms
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
              {providers.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
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
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
  );
}

function ProviderCard({ provider }: { provider: IProviderProfile }) {
  const bannerGradients = [
    "from-orange-400 to-amber-500",
    "from-rose-400 to-orange-500",
    "from-green-400 to-emerald-500",
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-pink-500",
  ];
  const gradient =
    bannerGradients[
      provider.businessName.charCodeAt(0) % bannerGradients.length
    ];

  return (
    <Link href={`/providers/${provider.id}`}>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/80 hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
        {/* Banner */}
        <div className={`h-28 bg-gradient-to-br ${gradient} relative`}>
          {provider.banner && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={provider.banner}
              alt={provider.businessName}
              className="w-full h-full object-cover"
            />
          )}
          <span
            className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full ${
              provider.isOpen
                ? "bg-green-500 text-white"
                : "bg-gray-500 text-white"
            }`}
          >
            {provider.isOpen ? "Open" : "Closed"}
          </span>
        </div>

        {/* Logo */}
        <div className="px-5 pb-5 pt-3 -mt-5">
          <div className="w-14 h-14 bg-white rounded-2xl border-2 border-white shadow-md flex items-center justify-center mb-3 overflow-hidden">
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
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors mb-1">
            {provider.businessName}
          </h3>

          <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-gray-700">
                {provider.averageRating > 0
                  ? provider.averageRating.toFixed(1)
                  : "New"}
              </span>
            </div>
            {provider.city && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{provider.city}</span>
              </div>
            )}
          </div>

          {provider.cuisineSpecialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {provider.cuisineSpecialties.slice(0, 3).map((c) => (
                <span
                  key={c}
                  className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
