"use client";

import { useEffect, useState } from "react";
import { Store, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { providerService } from "@/services/provider.service";
import { adminService } from "@/services/admin.service";
import { IProviderProfile } from "@/types";

const APPROVAL_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-600",
};

interface ProviderWithUser extends IProviderProfile {
  user?: { name: string; email: string };
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<ProviderWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const fetchProviders = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAllUsers({ role: "PROVIDER", limit: 50 });
      const users = res.data?.users || res.data || [];
      const providerData = users
        .filter(
          (u: { providerProfile?: IProviderProfile }) => u.providerProfile
        )
        .map(
          (u: {
            name: string;
            email: string;
            providerProfile: IProviderProfile;
          }) => ({
            ...u.providerProfile,
            user: { name: u.name, email: u.email },
          })
        );
      setProviders(providerData);
    } catch {
      setProviders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleApproval = async (
    id: string,
    status: "APPROVED" | "REJECTED",
    name: string
  ) => {
    try {
      await providerService.approveOrReject(id, status);
      toast.success(
        `${name} ${status === "APPROVED" ? "approved" : "rejected"}`
      );
      fetchProviders();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not update provider";
      toast.error(msg);
    }
  };

  const filtered = filter
    ? providers.filter((p) => p.approvalStatus === filter)
    : providers;

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        Provider Management
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {["", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === s
                ? "bg-orange-500 text-white"
                : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-white border border-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Store className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">No providers found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((provider) => (
            <div
              key={provider.id}
              className="bg-white border border-gray-100 rounded-2xl p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-gray-900">
                    {provider.businessName}
                  </p>
                  {provider.user && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {provider.user.name} · {provider.user.email}
                    </p>
                  )}
                  {provider.city && (
                    <p className="text-xs text-gray-400 mt-1">
                      📍 {provider.city}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${APPROVAL_COLORS[provider.approvalStatus]}`}
                  >
                    {provider.approvalStatus}
                  </span>
                  {provider.approvalStatus === "PENDING" && (
                    <>
                      <button
                        onClick={() =>
                          handleApproval(
                            provider.id,
                            "APPROVED",
                            provider.businessName
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleApproval(
                            provider.id,
                            "REJECTED",
                            provider.businessName
                          )
                        }
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject
                      </button>
                    </>
                  )}
                  {provider.approvalStatus === "APPROVED" && (
                    <button
                      onClick={() =>
                        handleApproval(
                          provider.id,
                          "REJECTED",
                          provider.businessName
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold rounded-lg transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  )}
                  {provider.approvalStatus === "REJECTED" && (
                    <button
                      onClick={() =>
                        handleApproval(
                          provider.id,
                          "APPROVED",
                          provider.businessName
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-green-200 text-green-500 hover:bg-green-50 text-xs font-semibold rounded-lg transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
