import Link from "next/link";
import { ArrowRight, CheckCircle, UtensilsCrossed, ChefHat } from "lucide-react";

const perks = [
  "Zero commission for first 3 months",
  "Easy-to-use dashboard",
  "Real-time order management",
  "Dedicated support team",
];

export default function CtaBanner() {
  return (
    <section className="py-16 sm:py-24 bg-gray-950 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-orange-400 text-sm font-semibold uppercase tracking-widest">
              Grow with us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3 mb-5 leading-tight">
              Are You a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                Restaurant Owner?
              </span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              Join FoodHub and reach thousands of hungry customers in your
              area. Grow your food business with our powerful platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register?role=PROVIDER"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
              >
                Start Selling Today
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/#how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-base transition-all"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-5">
              <UtensilsCrossed className="w-6 h-6 text-orange-400" />
            </div>
            <h3 className="text-white font-extrabold text-xl mb-6">
              What you get as a provider
            </h3>
            <ul className="space-y-4">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-orange-400 shrink-0" />
                  <span className="text-gray-300 text-sm">{perk}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-4">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-orange-500/20 border-2 border-gray-900 flex items-center justify-center"
                  >
                    <ChefHat className="w-4 h-4 text-orange-400" />
                  </div>
                ))}
              </div>
              <p className="text-gray-400 text-sm">
                <span className="text-white font-bold">50+</span> restaurants already joined
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
