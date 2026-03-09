import Link from "next/link";
import {
  Star,
  UtensilsCrossed,
  MapPin,
  ArrowRight,
  Leaf,
  Zap,
  Flame,
  type LucideIcon,
} from "lucide-react";

interface Provider {
  id: string;
  name: string;
  slug: string;
  cuisines: string[];
  city: string;
  rating: number;
  totalMeals: number;
  isOpen: boolean;
  icon: LucideIcon;
  bannerGradient: string;
  logoGradient: string;
  speciality: string;
}

const featuredProviders: Provider[] = [
  {
    id: "1",
    name: "Spice Garden",
    slug: "spice-garden",
    cuisines: ["Bangla", "Mughal"],
    city: "Dhanmondi, Dhaka",
    rating: 4.9,
    totalMeals: 45,
    isOpen: true,
    icon: Leaf,
    bannerGradient: "from-orange-400 to-amber-500",
    logoGradient: "from-orange-500 to-red-500",
    speciality: "Authentic Bangladeshi Cuisine",
  },
  {
    id: "2",
    name: "Quick Bites",
    slug: "quick-bites",
    cuisines: ["Fast Food", "Burgers"],
    city: "Gulshan, Dhaka",
    rating: 4.7,
    totalMeals: 32,
    isOpen: true,
    icon: Zap,
    bannerGradient: "from-yellow-400 to-orange-400",
    logoGradient: "from-yellow-500 to-orange-500",
    speciality: "Gourmet Burgers & Fries",
  },
  {
    id: "3",
    name: "Dragon Wok",
    slug: "dragon-wok",
    cuisines: ["Chinese", "Asian"],
    city: "Banani, Dhaka",
    rating: 4.8,
    totalMeals: 38,
    isOpen: false,
    icon: Flame,
    bannerGradient: "from-red-500 to-rose-500",
    logoGradient: "from-red-500 to-pink-500",
    speciality: "Authentic Chinese & Asian",
  },
];

function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Link
      href={`/providers/${provider.slug}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className={`relative h-32 bg-gradient-to-br ${provider.bannerGradient} flex items-end p-4`}
      >
        <div
          className={`absolute bottom-0 translate-y-1/2 left-5 w-16 h-16 bg-gradient-to-br ${provider.logoGradient} rounded-2xl flex items-center justify-center shadow-lg border-2 border-white`}
        >
          <provider.icon className="w-8 h-8 text-white" />
        </div>
        <div className="ml-auto">
          <span
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              provider.isOpen ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                provider.isOpen ? "bg-white" : "bg-white/60"
              }`}
            />
            {provider.isOpen ? "Open" : "Closed"}
          </span>
        </div>
      </div>

      <div className="p-5 pt-10">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-orange-500 transition-colors">
            {provider.name}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-sm text-gray-700">{provider.rating}</span>
          </div>
        </div>

        <p className="text-orange-500 text-xs font-semibold mb-2">
          {provider.speciality}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.cuisines.map((c) => (
            <span
              key={c}
              className="bg-orange-50 text-orange-600 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>{provider.city}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-xs">
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>{provider.totalMeals} meals</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProviders() {
  return (
    <section className="py-16 sm:py-20 bg-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">
              Top rated
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Featured Restaurants
            </h2>
            <p className="text-gray-500 mt-2 text-base">
              Discover our best food providers loved by thousands
            </p>
          </div>
          <Link
            href="/providers"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-sm whitespace-nowrap group"
          >
            View all restaurants
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProviders.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  );
}
