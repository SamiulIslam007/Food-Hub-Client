import axiosInstance from "@/lib/axios";

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export const categoryService = {
  async getAllCategories() {
    const { data } = await axiosInstance.get("/categories");
    return data;
  },

  async getCategoryById(id: string) {
    const { data } = await axiosInstance.get(`/categories/${id}`);
    return data;
  },

  async createCategory(payload: CreateCategoryPayload) {
    const { data } = await axiosInstance.post("/categories", payload);
    return data;
  },

  async updateCategory(id: string, payload: Partial<CreateCategoryPayload>) {
    const { data } = await axiosInstance.patch(`/categories/${id}`, payload);
    return data;
  },

  async deleteCategory(id: string) {
    const { data } = await axiosInstance.delete(`/categories/${id}`);
    return data;
  },
};
