import axiosInstance from "@/lib/axios";

export interface CreateReviewPayload {
  mealId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  async getReviews(mealId?: string, page = 1, limit = 10) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (mealId) params.append("mealId", mealId);
    const { data } = await axiosInstance.get(`/reviews?${params.toString()}`);
    return data;
  },

  async createReview(payload: CreateReviewPayload) {
    const { data } = await axiosInstance.post("/reviews", payload);
    return data;
  },

  async updateReview(id: string, payload: { rating?: number; comment?: string }) {
    const { data } = await axiosInstance.patch(`/reviews/${id}`, payload);
    return data;
  },

  async deleteReview(id: string) {
    const { data } = await axiosInstance.delete(`/reviews/${id}`);
    return data;
  },
};
