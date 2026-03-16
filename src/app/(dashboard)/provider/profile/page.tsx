"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { providerService } from "@/services/provider.service";
import { IProviderProfile } from "@/types";

const profileSchema = z.object({
  businessName: z.string().min(2, "Business name required"),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Lowercase, numbers and hyphens only"),
  address: z.string().min(5, "Address required"),
  description: z.string().optional(),
  city: z.string().optional(),
  logo: z.string().url().optional().or(z.literal("")),
  banner: z.string().url().optional().or(z.literal("")),
  cuisineSpecialties: z.string().optional(),
  isOpen: z.boolean().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

const APPROVAL_STYLES: Record<
  string,
  { color: string; icon: React.ElementType; label: string }
> = {
  PENDING: { color: "text-amber-600 bg-amber-50", icon: Clock, label: "Pending Approval" },
  APPROVED: { color: "text-green-600 bg-green-50", icon: CheckCircle, label: "Approved" },
  REJECTED: { color: "text-red-600 bg-red-50", icon: AlertCircle, label: "Rejected" },
};

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState<IProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    providerService
      .getMyProfile()
      .then((res) => {
        const p = res.data;
        setProfile(p);
        setHasProfile(true);
        reset({
          businessName: p.businessName,
          slug: p.slug,
          address: p.address,
          description: p.description || "",
          city: p.city || "",
          logo: p.logo || "",
          banner: p.banner || "",
          cuisineSpecialties: p.cuisineSpecialties?.join(", ") || "",
          isOpen: p.isOpen,
        });
      })
      .catch(() => setHasProfile(false))
      .finally(() => setIsLoading(false));
  }, [reset]);

  const onSubmit = async (values: ProfileForm) => {
    const payload = {
      ...values,
      cuisineSpecialties: values.cuisineSpecialties
        ? values.cuisineSpecialties.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      logo: values.logo || undefined,
      banner: values.banner || undefined,
    };

    try {
      if (hasProfile) {
        await providerService.updateMyProfile(payload);
        toast.success("Profile updated!");
      } else {
        await providerService.createProfile(payload);
        toast.success("Profile created! Awaiting admin approval.");
        setHasProfile(true);
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not save profile";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-1/3 mb-6" />
        <div className="h-64 bg-gray-100 rounded-2xl" />
      </div>
    );
  }

  const approvalInfo = profile
    ? APPROVAL_STYLES[profile.approvalStatus]
    : null;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">
          {hasProfile ? "Provider Profile" : "Create Provider Profile"}
        </h1>
        {approvalInfo && profile && (
          <span
            className={`flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full ${approvalInfo.color}`}
          >
            <approvalInfo.icon className="w-4 h-4" />
            {approvalInfo.label}
          </span>
        )}
      </div>

      {!hasProfile && (
        <div className="mb-5 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-700">
          Set up your provider profile to start listing meals. After creation,
          an admin will review and approve your account.
        </div>
      )}

      <div className="max-w-2xl bg-white border border-gray-100 rounded-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Business Name *
              </label>
              <input
                {...register("businessName")}
                type="text"
                placeholder="e.g. Spice Garden"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {errors.businessName && (
                <p className="text-red-500 text-xs mt-1">{errors.businessName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Slug *
              </label>
              <input
                {...register("slug")}
                type="text"
                placeholder="spice-garden"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {errors.slug && (
                <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City
              </label>
              <input
                {...register("city")}
                type="text"
                placeholder="Dhaka"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Address *
              </label>
              <input
                {...register("address")}
                type="text"
                placeholder="Full address"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={3}
                placeholder="Tell customers about your restaurant..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Cuisine Specialties
              </label>
              <input
                {...register("cuisineSpecialties")}
                type="text"
                placeholder="Bangla, Chinese, Fast Food (comma separated)"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Logo URL
              </label>
              <input
                {...register("logo")}
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Banner URL
              </label>
              <input
                {...register("banner")}
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            {hasProfile && (
              <div className="sm:col-span-2 flex items-center gap-3">
                <input
                  {...register("isOpen")}
                  type="checkbox"
                  id="isOpen"
                  className="w-4 h-4 accent-orange-500"
                />
                <label
                  htmlFor="isOpen"
                  className="text-sm font-medium text-gray-700"
                >
                  Restaurant is currently Open
                </label>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-all text-sm"
          >
            <Save className="w-4 h-4" />
            {isSubmitting
              ? "Saving..."
              : hasProfile
              ? "Update Profile"
              : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
