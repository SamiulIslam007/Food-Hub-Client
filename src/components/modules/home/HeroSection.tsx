"use client";

import Link from "next/link";
import {
  Search,
  ArrowRight,
  Clock,
  Shield,
  Star,
  ShoppingBag,
  UtensilsCrossed,
  Cake,
  Leaf,
} from "lucide-react";
import { useState } from "react";

const trustBadges = [
  { icon: Clock, text: "30 min delivery" },
  { icon: Shield, text: "Safe & hygienic" },
  { icon: Star, text: "4.8 rated service" },
];

export default function HeroSection() {
  const [query, setQuery] = useState("");

  return (
    <section className="relative bg-gray-950 min-h-[88vh] flex items-center overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-amber-500/8 rounded-full blur-[100px] pointer-events-none" />
      </div>

      <div className="absolute top-16 right-16 opacity-5 rotate-12 hidden xl:block">
        <UtensilsCrossed className="w-36 h-36 text-white" />
      </div>
      <div className="absolute bottom-24 right-32 opacity-5 -rotate-12 hidden xl:block">
        <ShoppingBag className="w-28 h-28 text-white" />
      </div>
      <div className="absolute top-1/3 right-8 opacity-5 hidden xl:block">
        <Cake className="w-24 h-24 text-white" />
      </div>
      <div className="absolute bottom-16 left-8 opacity-5 rotate-6 hidden lg:block">
        <Leaf className="w-28 h-28 text-white" />
      </div>

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(to right, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
            <span className="text-orange-300 text-sm font-medium">
              Now delivering across Dhaka City
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
            Taste the Best,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Right at Your
            </span>{" "}
            Doorstep
          </h1>

          <p className="text-gray-400 text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl">
            Discover authentic Bangladeshi cuisine and more from top local
            restaurants. Fresh, hot meals delivered to you in under 30 minutes.
          </p>

          <div className="flex items-center gap-2 bg-white/8 backdrop-blur-md border border-white/12 rounded-2xl p-2 mb-8 max-w-2xl">
            <div className="flex items-center gap-3 flex-1 px-4 py-2">
              <Search className="w-5 h-5 text-gray-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search biryani, burger, pasta..."
                className="bg-transparent text-white placeholder-gray-500 flex-1 outline-none text-sm sm:text-base"
              />
            </div>
            <Link
              href={`/meals${query ? `?search=${encodeURIComponent(query)}` : ""}`}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-500/30 flex items-center gap-2 shrink-0"
            >
              Search
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/meals"
              className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold text-base transition-all hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30"
            >
              <ShoppingBag className="w-5 h-5" />
              Order Now
            </Link>
            <Link
              href="/providers"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold text-base transition-all"
            >
              Browse Restaurants
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-6">
            {trustBadges.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-gray-400 text-sm">
                <Icon className="w-4 h-4 text-orange-400" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
