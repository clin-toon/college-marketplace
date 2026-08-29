import { apiClient } from "@/lib/apiClient";
import type { ListingsResponse } from "@/types/listing";

export function getFavourites(page = 1, limit = 10) {
  return apiClient.get<ListingsResponse>(
    `/favourites?page=${page}&limit=${limit}`,
  );
}
