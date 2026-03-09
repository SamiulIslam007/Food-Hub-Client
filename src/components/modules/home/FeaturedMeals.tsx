import Link from "next/link";
import {
  Star,
  Clock,
  ArrowRight,
  Flame,
  Zap,
  Fish,
  Cake,
  Coffee,
  ChefHat,
  type LucideIcon,
} from "lucide-react";

interface Meal {
  id: string;
  title: string;
  provider: string;
  price: number;
  rating: number;
  preparationTime: number;
  category: string;
  icon: LucideIcon;
  bgGradient: string;
  badge?: string;
}

const featuredMeals: Meal[] = [
  {
    id: "1",
    title: "Chicken Biryani",
    provider: "Spice Garden",
    price: 280,
    rating: 4.9,
    preparationTime: 25,
    category: "Bangla",
    icon: Flame,
    bgGradient: "from-orange-400 to-amber-500",
    badge: "Best Seller",
  },
  {
    id: "2",
    title: "Classic Beef Burger",
    provider: "Quick Bites",
    price: 220,
    rating: 4.7,
    preparationTime: 15,
    category: "Fast Food",
    icon: Zap,
    bgGradient: "from-yellow-400 to-orange-400",
  },
  {
    id: "3",
    title: "Hilsa Fish Curry",
    provider: "Spice Garden",
    price: 350,
    rating: 4.8,
    preparationTime: 30,
    category: "Bangla",
    icon: Fish,
    bgGradient: "from-teal-400 to-cyan-500",
    badge: "Chef's Pick",
  },
  {
    id: "4",
    title: "Chocolate Lava Cake",
    provider: "Sweet Dreams",
    price: 180,
    rating: 4.9,
    preparationTime: 20,
    category: "Desserts",
    icon: Cake,
    bgGradient: "from-pink-400 to-rose-500",
    badge: "Popular",
  },
  {
    id: "5",
    title: "Mango Lassi",
    provider: "Fresh Corner",
    price: 90,
    rating: 4.6,
    preparationTime: 5,
    category: "Drinks",
    icon: Coffee,
    bgGradient: "from-yellow-400 to-amber-400",
  },
  {
    id: "6",
    title: "Hakka Noodles",
    provider: "Dragon Wok",
    price: 200,
    rating: 4.7,
    preparationTime: 18,
    category: "Chinese",
    icon: ChefHat,
    bgGradient: "from-red-400 to-rose-400",
  },
];

function MealCard({ meal }: { meal: Meal }) {
  return (
    <Link
      href={`/meals/${meal.id}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-orange-100 hover:shadow-xl hover:shadow-orange-50 transition-all duration-300 hover:-translate-y-1"
    >
      <div
        className={`relative h-48 bg-gradient-to-br ${meal.bgGradient} flex items-center justify-center`}
      >
        <meal.icon className="w-16 h-16 text-white/80 drop-shadow-lg" />
        {meal.badge && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Flame className="w-3 h-3" />
            {meal.badge}
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
          {meal.category}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-orange-500 transition-colors">
            {meal.title}
          </h3>
          <span className="text-orange-500 font-extrabold text-base shrink-0">
            ৳{meal.price}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-3">{meal.provider}</p>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-gray-700">{meal.rating}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Clock className="w-3.5 h-3.5" />
            <span>{meal.preparationTime} min</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedMeals() {
  return (
    <section className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">
              Handpicked for you
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Featured Meals
            </h2>
            <p className="text-gray-500 mt-2 text-base">
              Chef&apos;s picks freshly prepared today
            </p>
          </div>
          <Link
            href="/meals"
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold text-sm whitespace-nowrap group"
          >
            View all meals
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/meals"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-orange-200"
          >
            Explore All Meals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
