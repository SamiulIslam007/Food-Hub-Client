import axiosInstance from "@/lib/axios";

export interface ProviderFilters {
  search?: string;
  city?: string;
  cuisineSpecialty?: string;
  isOpen?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "businessName" | "createdAt" | "averageRating";
  sortOrder?: "asc" | "desc";
}

export interface CreateProviderPayload {
  businessName: string;
  slug: string;
  address: string;
  logo?: string;
  banner?: string;
  description?: string;
  city?: string;
  cuisineSpecialties?: string[];
}

export const providerService = {
  async getAllProviders(filters: ProviderFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        params.append(key, String(val));
      }
    });
    const { data } = await axiosInstance.get(
      `/providers?${params.toString()}`
    );
    return data;
  },

  async getProviderById(id: string) {
    const { data } = await axiosInstance.get(`/providers/${id}`);
    return data;
  },

  async getMyProfile() {
    const { data } = await axiosInstance.get("/providers/me");
    return data;
  },

  async createProfile(payload: CreateProviderPayload) {
    const { data } = await axiosInstance.post("/providers/me", payload);
    return data;
  },

  async updateMyProfile(payload: Partial<CreateProviderPayload> & { isOpen?: boolean }) {
    const { data } = await axiosInstance.patch("/providers/me", payload);
    return data;
  },

  async approveOrReject(id: string, approvalStatus: "APPROVED" | "REJECTED") {
    const { data } = await axiosInstance.patch(`/providers/${id}/approval`, {
      approvalStatus,
    });
    return data;
  },
};
