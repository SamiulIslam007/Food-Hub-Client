"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UtensilsCrossed } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRole: "CUSTOMER" | "PROVIDER" | "ADMIN";
}

export default function AuthGuard({ children, allowedRole }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (user?.role !== allowedRole) {
      const dashboardMap = {
        ADMIN: "/admin",
        PROVIDER: "/provider",
        CUSTOMER: "/customer",
      };
      router.replace(dashboardMap[user!.role]);
    }
  }, [isLoading, isAuthenticated, user, allowedRole, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <UtensilsCrossed className="w-10 h-10 text-orange-300 mx-auto animate-pulse mb-3" />
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
}
