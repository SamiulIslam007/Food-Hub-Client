import { Search, ShoppingCart, Truck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Browse & Discover",
    description:
      "Explore hundreds of fresh meals from top local restaurants. Filter by cuisine, price, or dietary preferences.",
    color: "bg-orange-500",
    shadow: "shadow-orange-200",
  },
  {
    step: "02",
    icon: ShoppingCart,
    title: "Place Your Order",
    description:
      "Add your favorite items to cart and checkout in seconds. Secure payment with Cash on Delivery.",
    color: "bg-amber-500",
    shadow: "shadow-amber-200",
  },
  {
    step: "03",
    icon: Truck,
    title: "Get It Delivered",
    description:
      "Your hot, fresh meal is prepared and delivered to your doorstep within 30 minutes. Enjoy!",
    color: "bg-green-500",
    shadow: "shadow-green-200",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-orange-500 text-sm font-semibold uppercase tracking-widest">
            Simple process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Order your favorite meals in just 3 simple steps. Fresh food at
            your fingertips.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting dashed line - desktop only */}
          <div className="hidden md:block absolute top-14 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px">
            <div className="w-full border-t-2 border-dashed border-orange-200" />
          </div>

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center group"
            >
              {/* Step Number */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black text-orange-400/40 tracking-widest">
                {step.step}
              </div>

              {/* Icon Circle */}
              <div
                className={`relative w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl ${step.shadow} group-hover:scale-110 transition-transform duration-300 z-10`}
              >
                <step.icon className="w-9 h-9 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-extrabold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
