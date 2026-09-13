import { apiClient } from "@/lib/apiClient";
import type {
  AdminCategoriesResponse,
  AdminCategoryMutationResponse,
} from "@/types/category";
import type { CategoryFormValues } from "@/features/admin/categories/schemas/categorySchemas";

export function getAdminCategories() {
  return apiClient.get<AdminCategoriesResponse>("/admin/categories");
}

export function createAdminCategory(payload: CategoryFormValues) {
  return apiClient.post<AdminCategoryMutationResponse>(
    "/admin/categories",
    payload,
  );
}

export function updateAdminCategory(id: string, payload: CategoryFormValues) {
  return apiClient.patch<AdminCategoryMutationResponse>(
    `/admin/categories/${id}`,
    payload,
  );
}

export function deleteAdminCategory(id: string) {
  return apiClient.delete<{ success: boolean; message?: string }>(
    `/admin/categories/${id}`,
  );
}
