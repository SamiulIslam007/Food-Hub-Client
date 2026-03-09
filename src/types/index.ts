export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type ProviderApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type OrderStatus =
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";
export type MealAvailabilityStatus = "AVAILABLE" | "UNAVAILABLE";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  providerProfile?: IProviderProfile | null;
}

export interface IProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  slug: string;
  logo?: string;
  banner?: string;
  description?: string;
  address: string;
  city?: string;
  cuisineSpecialties: string[];
  approvalStatus: ProviderApprovalStatus;
  isOpen: boolean;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IMeal {
  id: string;
  providerProfileId: string;
  categoryId: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  price: number;
  image?: string;
  availabilityStatus: MealAvailabilityStatus;
  stockQuantity?: number;
  spiceLevel?: string;
  dietaryTags: string[];
  preparationTime?: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  providerProfile?: IProviderProfile;
  category?: ICategory;
}

export interface IOrder {
  id: string;
  customerId: string;
  providerProfileId: string;
  totalAmount: number;
  deliveryAddress: string;
  phone: string;
  note?: string;
  paymentMethod: "COD";
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}
