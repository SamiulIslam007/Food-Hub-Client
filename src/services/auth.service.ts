import axiosInstance from "@/lib/axios";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "CUSTOMER" | "PROVIDER";
}

export const authService = {
  async login(payload: LoginPayload) {
    const { data } = await axiosInstance.post("/auth/login", payload);
    return data;
  },

  async register(payload: RegisterPayload) {
    const { data } = await axiosInstance.post("/auth/register", payload);
    return data;
  },

  async getMe() {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
  },

  async logout() {
    const { data } = await axiosInstance.post("/auth/logout");
    return data;
  },

  async refreshToken() {
    const { data } = await axiosInstance.post("/auth/refresh-token");
    return data;
  },
};
