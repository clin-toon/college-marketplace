export interface AdminStats {
  totalUsers: number;
  newUsersThisWeek: number;
  totalListings: number;
  activeListings: number;
  soldListings: number;
  removedListings: number;
  newListingsThisWeek: number;
  totalCategories: number;
  totalMessages: number;
  totalFavourites: number;
}

export interface AdminStatsResponse {
  success: boolean;
  data: AdminStats;
}
