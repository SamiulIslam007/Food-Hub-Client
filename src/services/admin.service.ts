import axiosInstance from "@/lib/axios";

export interface AdminUserFilters {
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";
  status?: "ACTIVE" | "SUSPENDED";
  page?: number;
  limit?: number;
}

export interface AdminOrderFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export const adminService = {
  async getOverview() {
    const { data } = await axiosInstance.get("/admin/overview");
    return data;
  },

  async getAllUsers(filters: AdminUserFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        params.append(key, String(val));
      }
    });
    const { data } = await axiosInstance.get(
      `/admin/users?${params.toString()}`
    );
    return data;
  },

  async toggleUserStatus(id: string) {
    const { data } = await axiosInstance.patch(`/admin/users/${id}/status`);
    return data;
  },

  async getAllOrders(filters: AdminOrderFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        params.append(key, String(val));
      }
    });
    const { data } = await axiosInstance.get(
      `/admin/orders?${params.toString()}`
    );
    return data;
  },
};
