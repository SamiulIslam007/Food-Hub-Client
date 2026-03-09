import { UtensilsCrossed, Store, ShoppingBag, Star } from "lucide-react";

const stats = [
  {
    icon: UtensilsCrossed,
    value: "500+",
    label: "Fresh Meals",
  },
  {
    icon: Store,
    value: "50+",
    label: "Restaurants",
  },
  {
    icon: ShoppingBag,
    value: "10K+",
    label: "Orders Delivered",
  },
  {
    icon: Star,
    value: "4.8★",
    label: "Average Rating",
  },
];

export default function StatsBar() {
  return (
    <section className="bg-orange-500 py-5 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 text-white justify-center md:justify-start"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl font-extrabold leading-none">{value}</div>
                <div className="text-orange-100 text-xs font-medium mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
