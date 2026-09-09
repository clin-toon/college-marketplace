import { apiClient } from "@/lib/apiClient";
import type { CategoriesResponse } from "@/types/listing";

export function getCategories() {
  return apiClient.get<CategoriesResponse>("/categories");
}
