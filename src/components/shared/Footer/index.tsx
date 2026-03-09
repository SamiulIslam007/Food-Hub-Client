import Link from "next/link";
import { UtensilsCrossed, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Browse Meals", href: "/meals" },
    { label: "Restaurants", href: "/providers" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  forProviders: [
    { label: "Join as Provider", href: "/register?role=PROVIDER" },
    { label: "Provider Dashboard", href: "/provider/dashboard" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Provider FAQ", href: "/faq#provider" },
  ],
  categories: [
    { label: "Bangla Cuisine", href: "/meals?category=bangla" },
    { label: "Fast Food", href: "/meals?category=fast-food" },
    { label: "Desserts", href: "/meals?category=desserts" },
    { label: "Drinks", href: "/meals?category=drinks" },
    { label: "Chinese", href: "/meals?category=chinese" },
    { label: "Healthy", href: "/meals?category=healthy" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5 group">
              <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Food<span className="text-orange-500">Hub</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Connecting food lovers with the best local restaurants. Fresh, hot meals delivered right to your door.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <span>support@foodhub.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="w-4 h-4 text-orange-500 shrink-0" />
                <span>+880 1800-FOODHUB</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              For Providers
            </h3>
            <ul className="space-y-3">
              {footerLinks.forProviders.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-5">
              Categories
            </h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-orange-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} FoodHub. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white transition-all"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white transition-all"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-800 hover:bg-orange-500 text-gray-400 hover:text-white transition-all"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
