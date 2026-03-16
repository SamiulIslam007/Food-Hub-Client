import axiosInstance from "@/lib/axios";

export interface MealFilters {
  search?: string;
  categoryId?: string;
  providerProfileId?: string;
  minPrice?: number;
  maxPrice?: number;
  dietaryTags?: string;
  featured?: boolean;
  availabilityStatus?: "AVAILABLE" | "UNAVAILABLE";
  page?: number;
  limit?: number;
  sortBy?: "price" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
}

export interface CreateMealPayload {
  categoryId: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: number;
  image?: string;
  availabilityStatus?: "AVAILABLE" | "UNAVAILABLE";
  stockQuantity?: number;
  spiceLevel?: string;
  dietaryTags?: string[];
  preparationTime?: number;
  featured?: boolean;
}

export const mealService = {
  async getAllMeals(filters: MealFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        params.append(key, String(val));
      }
    });
    const { data } = await axiosInstance.get(`/meals?${params.toString()}`);
    return data;
  },

  async getMealById(id: string) {
    const { data } = await axiosInstance.get(`/meals/${id}`);
    return data;
  },

  async createMeal(payload: CreateMealPayload) {
    const { data } = await axiosInstance.post("/meals", payload);
    return data;
  },

  async updateMeal(id: string, payload: Partial<CreateMealPayload>) {
    const { data } = await axiosInstance.patch(`/meals/${id}`, payload);
    return data;
  },

  async deleteMeal(id: string) {
    const { data } = await axiosInstance.delete(`/meals/${id}`);
    return data;
  },

  async toggleAvailability(id: string) {
    const { data } = await axiosInstance.patch(
      `/meals/${id}/toggle-availability`
    );
    return data;
  },
};
