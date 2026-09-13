export type UserRole = "student" | "admin";

export interface AdminUser {
  userId: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  fullName: string;
  phone: string;
  isAllowedToPost: boolean;
  listingCount: number;
  createdAt: string; // ISO timestamp
}

export interface Pagination {
  page: string;
  limit: string;
  totalCount: number;
  totalPages: number;
}

export interface AdminUsersResponse {
  success: boolean;
  data: AdminUser[];
  pagination: Pagination;
}

export interface UserProfile {
  userId: string;
  email: string;
  role: "student";
  isVerified: boolean;
  fullName: string;
  phone: string;
  faculty: string;
  semester: string;
  isAllowedToPost: boolean;
  profileImageUrl: string;
  listingCount: number;
  activeListingCount: number;
  favouriteCount: number;
  createdAt: string;
}

export interface UserProfileResponseSingle {
  success: boolean;
  data: UserProfile;
}
