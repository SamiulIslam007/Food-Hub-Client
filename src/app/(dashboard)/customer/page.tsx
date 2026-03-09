import { ShoppingCart } from "lucide-react";

export default function CustomerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <ShoppingCart className="w-10 h-10 text-orange-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">My Dashboard</h1>
        <p className="text-gray-500 text-lg max-w-md mx-auto">
          Customer dashboard with orders, cart, and profile management is coming soon.
        </p>
      </div>
    </div>
  );
}
