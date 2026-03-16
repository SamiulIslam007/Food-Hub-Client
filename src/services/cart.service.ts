import axiosInstance from "@/lib/axios";

export const cartService = {
  async getCart() {
    const { data } = await axiosInstance.get("/cart");
    return data;
  },

  async addToCart(mealId: string, quantity: number) {
    const { data } = await axiosInstance.post("/cart", { mealId, quantity });
    return data;
  },

  async updateCartItem(itemId: string, quantity: number) {
    const { data } = await axiosInstance.patch(`/cart/${itemId}`, { quantity });
    return data;
  },

  async removeCartItem(itemId: string) {
    const { data } = await axiosInstance.delete(`/cart/${itemId}`);
    return data;
  },

  async clearCart() {
    const { data } = await axiosInstance.delete("/cart");
    return data;
  },
};
