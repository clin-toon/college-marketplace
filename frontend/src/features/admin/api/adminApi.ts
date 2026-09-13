import { apiClient } from "@/lib/apiClient"; // adjust path to your apiClient
import type { AdminStatsResponse } from "../types/admin.types";
import type {
  AdminUser,
  AdminUsersResponse,
  UserProfileResponseSingle,
} from "../types/user.types";

export const adminApi = {
  getStats: () => apiClient.get<AdminStatsResponse>("/admin/stats"),

  /** GET /admin/users?page=1&limit=10 — paginated user list */
  getUsers: (page: number, limit: number) =>
    apiClient.get<AdminUsersResponse>(
      `/admin/users?page=${page}&limit=${limit}`,
    ),

  getSingleUsers: (userId: string) =>
    apiClient.get<UserProfileResponseSingle>(`/admin/users/${userId}`),
  /**
   * PATCH posting permission for a user.
   * ⚠️ INTEGRATION POINT: replace the path/method below with your actual
   * backend endpoint once it exists, e.g. PATCH /admin/users/:id/posting-access
   * The UI (drawer + modal) is fully wired; only this path may need to change.
   */
  setPostingAccess: (userId: string, allowed: boolean) =>
    apiClient.patch<AdminUser>(`/admin/users/${userId}/posting-access`, {
      isAllowedToPost: allowed,
    }),
};
