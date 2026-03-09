import Link from "next/link";
import { ArrowRight, Flame, Zap, Cake, Coffee, ChefHat, Leaf, type LucideIcon } from "lucide-react";

interface Category {
  name: string;
  slug: string;
  icon: LucideIcon;
  bg: string;
  hoverBg: string;
  iconBg: string;
  iconColor: string;
  description: string;
}

const categories: Category[] = [
  {
    name: "Bangla",
    slug: "bangla",
    icon: Flame,
    bg: "bg-orange-50",
    hoverBg: "hover:bg-orange-500",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    description: "Traditional dishes",
  },
  {
    name: "Fast Food",
    slug: "fast-food",
    icon: Zap,
    bg: "bg-yellow-50",
    hoverBg: "hover:bg-yellow-500",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-500",
    description: "Quick bites",
  },
  {
    name: "Desserts",
    slug: "desserts",
    icon: Cake,
    bg: "bg-pink-50",
    hoverBg: "hover:bg-pink-500",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-500",
    description: "Sweet treats",
  },
  {
    name: "Drinks",
    slug: "drinks",
    icon: Coffee,
    bg: "bg-blue-50",
    hoverBg: "hover:bg-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-500",
    description: "Fresh beverages",
  },
  {
    name: "Chinese",
    slug: "chinese",
    icon: ChefHat,
    bg: "bg-red-50",
    hoverBg: "hover:bg-red-500",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    description: "Asian flavors",
  },
  {
    name: "Healthy",
    slug: "healthy",
    icon: Leaf,
    bg: "bg-green-50",
    hoverBg: "hover:bg-green-500",
    iconBg: "bg-green-100",
    iconColor: "text-green-500",
    description: "Nutritious meals",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">
              What are you craving?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
              Browse by Category
            </h2>
            <p className="text-gray-500 mt-2 text-base">
              Find your favorite cuisine from our wide selection
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/meals?category=${cat.slug}`}
              className={`group flex flex-col items-center gap-3 p-6 rounded-2xl ${cat.bg} ${cat.hoverBg} hover:text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
            >
              <div
                className={`w-14 h-14 ${cat.iconBg} group-hover:bg-white/20 rounded-2xl flex items-center justify-center transition-colors`}
              >
                <cat.icon className={`w-7 h-7 ${cat.iconColor} group-hover:text-white transition-colors`} />
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-800 group-hover:text-white text-sm transition-colors">
                  {cat.name}
                </div>
                <div className="text-gray-500 group-hover:text-white/80 text-xs mt-0.5 transition-colors">
                  {cat.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
