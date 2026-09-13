import { useCallback, useEffect, useState } from "react";
import { getAdminCategories } from "@/features/admin/categories/api/categoriesApi";
import { ApiError } from "@/lib/apiClient";
import type { AdminCategory } from "@/types/category";

export function useAdminCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAdminCategories();
      setCategories(response.data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load categories. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, error, retry: fetchCategories };
}
