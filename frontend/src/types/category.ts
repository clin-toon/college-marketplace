export interface AdminCategory {
  categoryId: string;
  name: string;
  description: string;
  listingCount: number;
  createdAt: string;
}

export interface AdminCategoriesResponse {
  success: boolean;
  data: AdminCategory[];
}

export interface AdminCategoryMutationResponse {
  success: boolean;
  message?: string;
  data: AdminCategory;
}
