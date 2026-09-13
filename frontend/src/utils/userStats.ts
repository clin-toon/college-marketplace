import type { AdminUser } from "@/features/admin/types/user.types";

export interface UserStats {
  totalUsers: number;
  students: number;
  admins: number;
  verified: number;
  canPost: number;
  activePosters: number;
}

export interface AccountOverview {
  verified: number;
  unverified: number;
  allowedToPost: number;
  postingRestricted: number;
  withListings: number;
  withoutListings: number;
}

/**
 * NOTE: totals like `students`/`verified` are computed from the currently
 * loaded page. The API does not expose these counts globally — only
 * `pagination.totalCount` is a true global total.
 */
export function computeUserStats(
  users: AdminUser[],
  totalCount: number,
): UserStats {
  return {
    totalUsers: totalCount,
    students: users.filter((u) => u.role === "student").length,
    admins: users.filter((u) => u.role === "admin").length,
    verified: users.filter((u) => u.isVerified).length,
    canPost: users.filter((u) => u.isAllowedToPost).length,
    activePosters: users.filter((u) => u.listingCount > 0).length,
  };
}

export function computeAccountOverview(users: AdminUser[]): AccountOverview {
  const verified = users.filter((u) => u.isVerified).length;
  const allowed = users.filter((u) => u.isAllowedToPost).length;
  const withListings = users.filter((u) => u.listingCount > 0).length;
  return {
    verified,
    unverified: users.length - verified,
    allowedToPost: allowed,
    postingRestricted: users.length - allowed,
    withListings,
    withoutListings: users.length - withListings,
  };
}
