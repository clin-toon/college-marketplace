import { apiClient } from "@/lib/apiClient"; // adjust path to your apiClient
import type {
  AdminListingsResponse,
  AnalyticsResponse,
  CategoryCount,
  ConditionCount,
  ListingDetail,
  ListingDetailResponse,
  PriceBucket,
  TimelinePoint,
  TopFavourited,
  TopSeller,
} from "../types/adminListing.types";

export const adminListingsApi = {
  /** GET /admin/listings?page=1&limit=10 */
  getListings: (page: number, limit: number) =>
    apiClient.get<AdminListingsResponse>(
      `/admin/listings?page=${page}&limit=${limit}`,
    ),

  /** GET /admin/listings/:id — full detail for the drawer */
  getListingById: (id: string) =>
    apiClient.get<ListingDetailResponse>(`/admin/listings/${id}`),

  // ---- analytics ----
  getAnalyticsOverview: () =>
    apiClient.get<AnalyticsResponse<unknown>>(
      "/admin/listings/analytics/overview",
    ),
  getAnalyticsByCategory: () =>
    apiClient.get<AnalyticsResponse<CategoryCount[]>>(
      "/admin/listings/analytics/by-category",
    ),
  getAnalyticsByCondition: () =>
    apiClient.get<AnalyticsResponse<ConditionCount[]>>(
      "/admin/listings/analytics/by-condition",
    ),
  getAnalyticsTimeline: () =>
    apiClient.get<AnalyticsResponse<TimelinePoint[]>>(
      "/admin/listings/analytics/timeline",
    ),
  getAnalyticsPriceDistribution: () =>
    apiClient.get<AnalyticsResponse<PriceBucket[]>>(
      "/admin/listings/analytics/price-distribution",
    ),
  getAnalyticsTopFavourited: () =>
    apiClient.get<AnalyticsResponse<TopFavourited[]>>(
      "/admin/listings/analytics/top-favourited",
    ),
  getAnalyticsTopSellers: () =>
    apiClient.get<AnalyticsResponse<TopSeller[]>>(
      "/admin/listings/analytics/top-sellers",
    ),

  // ---- management actions ----
  hideListing: (id: string) =>
    apiClient.patch<ListingDetail>(`/admin/listings/${id as string}/hide`),
  showListing: (id: string) =>
    apiClient.patch<ListingDetail>(`/admin/listings/${id as string}/show`),
  setListingStatus: (id: string, status: string) =>
    apiClient.patch<ListingDetail>(`/admin/listings/${id as string}/status`, {
      status,
    }),
};
