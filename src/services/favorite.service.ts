import axiosInstance from "@/lib/axios";

export const favoriteService = {
  async getMyFavorites() {
    const { data } = await axiosInstance.get("/favorites");
    return data;
  },

  async toggleFavorite(mealId: string) {
    const { data } = await axiosInstance.post("/favorites", { mealId });
    return data;
  },
};
