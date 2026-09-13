import { useState } from "react";
import toast from "react-hot-toast";
import { deleteAdminCategory } from "@/features/admin/categories/api/categoriesApi";

export function useDeleteCategory(onDeleted: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function remove(categoryId: string) {
    setIsDeleting(true);
    try {
      await deleteAdminCategory(categoryId);
      toast.success("Category deleted.");
      onDeleted();
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsDeleting(false);
    }
  }

  return { isDeleting, remove };
}
