"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { mealService } from "@/services/meal.service";
import { categoryService } from "@/services/category.service";
import { ICategory } from "@/types";

const createMealSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers and hyphens"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive("Price must be positive"),
  image: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  preparationTime: z.coerce.number().int().positive().optional().or(z.literal("")),
  spiceLevel: z.string().optional(),
  featured: z.boolean().optional(),
});

type CreateMealForm = z.infer<typeof createMealSchema>;

const SPICE_LEVELS = ["Mild", "Medium", "Hot", "Extra Hot"];

export default function NewMealPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ICategory[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateMealForm>({
    resolver: zodResolver(createMealSchema),
    defaultValues: { featured: false },
  });

  const title = watch("title");

  useEffect(() => {
    categoryService.getAllCategories().then((r) => setCategories(r.data || []));
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      setValue("slug", slug);
    }
  }, [title, setValue]);

  const onSubmit = async (values: CreateMealForm) => {
    try {
      await mealService.createMeal({
        ...values,
        price: Number(values.price),
        preparationTime: values.preparationTime
          ? Number(values.preparationTime)
          : undefined,
        image: values.image || undefined,
      });
      toast.success("Meal created successfully!");
      router.push("/provider/meals");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Could not create meal";
      toast.error(msg);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/provider/meals"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Meals
      </Link>

      <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
        Add New Meal
      </h1>

      <div className="max-w-2xl bg-white border border-gray-100 rounded-2xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Meal Title *
              </label>
              <input
                {...register("title")}
                type="text"
                placeholder="e.g. Chicken Biryani Special"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Slug *
              </label>
              <input
                {...register("slug")}
                type="text"
                placeholder="chicken-biryani-special"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {errors.slug && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.slug.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Category *
              </label>
              <select
                {...register("categoryId")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-white"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Price (৳) *
              </label>
              <input
                {...register("price")}
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Short Description
              </label>
              <input
                {...register("shortDescription")}
                type="text"
                placeholder="One-line description..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description *
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Full description of the meal..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
              />
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Image URL
              </label>
              <input
                {...register("image")}
                type="url"
                placeholder="https://..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.image.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Prep Time (min)
              </label>
              <input
                {...register("preparationTime")}
                type="number"
                min="1"
                placeholder="30"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Spice Level
              </label>
              <select
                {...register("spiceLevel")}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 bg-white"
              >
                <option value="">Select level</option>
                {SPICE_LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                {...register("featured")}
                type="checkbox"
                id="featured"
                className="w-4 h-4 accent-orange-500"
              />
              <label
                htmlFor="featured"
                className="text-sm font-medium text-gray-700"
              >
                Mark as Featured meal
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Link
              href="/provider/meals"
              className="flex-1 text-center px-6 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:border-gray-300 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-all text-sm"
            >
              {isSubmitting ? "Creating..." : "Create Meal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
