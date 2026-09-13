export type ListingCondition =
  | "new"
  | "like_new"
  | "good"
  | "fair"
  | "poor"
  | (string & {});
export type ListingStatus =
  | "active"
  | "hidden"
  | "sold"
  | "removed"
  | (string & {});

/** GET /admin/listings -> data[] */
export interface ListingSummary {
  listingId: string;
  sellerId: string;
  sellerEmail: string;
  title: string;
  price: string; // decimal string, e.g. "400.00"
  condition: ListingCondition;
  status: ListingStatus;
  categoryName: string;
  images: string[];
  createdAt: string; // ISO
}

/** GET /admin/listings/:id -> data (snake_case from backend) */
export interface ListingDetail {
  listing_id: string;
  seller_id: string;
  seller_email: string;
  seller_full_name: string;
  seller_phone: string;
  category_id: string;
  category_name: string;
  title: string;
  description: string;
  price: string;
  condition: ListingCondition;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  images: string[];
  favourite_count: number;
}

export interface Pagination {
  page: string;
  limit: string;
  totalCount: number;
  totalPages: number;
}

export interface AdminListingsResponse {
  success: boolean;
  data: ListingSummary[];
  pagination: Pagination;
}

export interface ListingDetailResponse {
  success: boolean;
  data: ListingDetail;
}

/** GET /admin/listings/analytics/by-category */
export interface CategoryCount {
  categoryName: string;
  listingCount: number;
  activeCount: number;
}

/** GET /admin/listings/analytics/by-condition */
export interface ConditionCount {
  condition: string;
  listingCount: number;
}

/** GET /admin/listings/analytics/price-distribution */
export interface PriceBucket {
  priceBucket: string;
  listingCount: number;
}

/** GET /admin/listings/analytics/top-favourited */
export interface TopFavourited {
  listingId: string;
  title: string;
  price: string;
  status: ListingStatus;
  favouriteCount: number;
}

/** GET /admin/listings/analytics/top-sellers */
export interface TopSeller {
  userId: string;
  email: string;
  fullName: string;
  listingCount: number;
  soldCount: number;
}

/**
 * GET /admin/listings/analytics/timeline
 * NOTE: response shape not confirmed yet — adapt `TimelinePoint` to the
 * actual field names if the backend returns something different.
 */
export interface TimelinePoint {
  date: string;
  listingCount: number;
}

export interface AnalyticsResponse<T> {
  success: boolean;
  data: T;
}
