import { apiClient } from "@/lib/apiClient";
import type { ListingsResponse } from "@/types/listing";
import type { ListingDetailResponse } from "@/types/listings";

export interface ListingsQueryParams {
  page?: number;
  limit?: number;
  q?: string;
  sort?: "createdAt" | "price_asc" | "price_desc" | "latest";
  order?: "asc" | "desc";
}

export function getListingById(id: string) {
  return apiClient.get<ListingDetailResponse>(`/listings/${id}`);
}

export function getListings(params: ListingsQueryParams = {}) {
  const { page = 1, limit = 10, q, sort, order } = params;

  const query = new URLSearchParams();
  query.set("page", String(page));
  query.set("limit", String(limit));
  if (q) query.set("q", q);
  if (sort) query.set("sort", sort);
  if (order) query.set("order", order);
  console.log(query.toString());

  return apiClient.get<ListingsResponse>(`/listings?${query.toString()}`);
}
