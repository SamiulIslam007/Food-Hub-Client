import axiosInstance from "@/lib/axios";

export interface CreateOrderPayload {
  deliveryAddress: string;
  phone: string;
  note?: string;
}

export interface OrderFilters {
  status?: string;
  page?: number;
  limit?: number;
}

export const orderService = {
  async placeOrder(payload: CreateOrderPayload) {
    const { data } = await axiosInstance.post("/orders", payload);
    return data;
  },

  async getOrders(filters: OrderFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== "") {
        params.append(key, String(val));
      }
    });
    const { data } = await axiosInstance.get(`/orders?${params.toString()}`);
    return data;
  },

  async getOrderById(id: string) {
    const { data } = await axiosInstance.get(`/orders/${id}`);
    return data;
  },

  async updateOrderStatus(
    id: string,
    status: "PREPARING" | "READY" | "DELIVERED"
  ) {
    const { data } = await axiosInstance.patch(`/orders/${id}/status`, {
      status,
    });
    return data;
  },

  async cancelOrder(id: string) {
    const { data } = await axiosInstance.patch(`/orders/${id}/cancel`);
    return data;
  },
};
