import { useMemo, useState } from "react";
import type { AdminUser } from "../types/user.types";

export type RoleFilter = "all" | "student" | "admin";
export type VerificationFilter = "all" | "verified" | "unverified";
export type PostingFilter = "all" | "allowed" | "restricted";
export type ListingsFilter = "all" | "has" | "none";
export type SortOption =
  | "newest"
  | "oldest"
  | "mostListings"
  | "leastListings"
  | "nameAsc"
  | "nameDesc";

export interface UserFilters {
  search: string;
  role: RoleFilter;
  verification: VerificationFilter;
  posting: PostingFilter;
  listings: ListingsFilter;
  sort: SortOption;
}

export const INITIAL_FILTERS: UserFilters = {
  search: "",
  role: "all",
  verification: "all",
  posting: "all",
  listings: "all",
  sort: "newest",
};

export function useUserFilters(users: AdminUser[]) {
  const [filters, setFilters] = useState<UserFilters>(INITIAL_FILTERS);

  const filteredUsers = useMemo(() => {
    const q = filters.search.trim().toLowerCase();

    const result = users.filter((u) => {
      if (
        q &&
        !u.fullName.toLowerCase().includes(q) &&
        !u.email.toLowerCase().includes(q) &&
        !u.userId.toLowerCase().includes(q) &&
        !u.phone.includes(q)
      ) {
        return false;
      }
      if (filters.role !== "all" && u.role !== filters.role) return false;
      if (filters.verification === "verified" && !u.isVerified) return false;
      if (filters.verification === "unverified" && u.isVerified) return false;
      if (filters.posting === "allowed" && !u.isAllowedToPost) return false;
      if (filters.posting === "restricted" && u.isAllowedToPost) return false;
      if (filters.listings === "has" && u.listingCount <= 0) return false;
      if (filters.listings === "none" && u.listingCount > 0) return false;
      return true;
    });

    return [...result].sort((a, b) => {
      switch (filters.sort) {
        case "newest":
          return +new Date(b.createdAt) - +new Date(a.createdAt);
        case "oldest":
          return +new Date(a.createdAt) - +new Date(b.createdAt);
        case "mostListings":
          return b.listingCount - a.listingCount;
        case "leastListings":
          return a.listingCount - b.listingCount;
        case "nameAsc":
          return a.fullName.localeCompare(b.fullName);
        case "nameDesc":
          return b.fullName.localeCompare(a.fullName);
        default:
          return 0;
      }
    });
  }, [users, filters]);

  const isFiltered =
    filters.search !== "" ||
    filters.role !== "all" ||
    filters.verification !== "all" ||
    filters.posting !== "all" ||
    filters.listings !== "all";

  return {
    filters,
    setFilters,
    filteredUsers,
    resetFilters: () => setFilters(INITIAL_FILTERS),
    isFiltered,
  };
}
