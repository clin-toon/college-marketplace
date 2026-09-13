import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  createCategorySchema,
  type CategoryFormValues,
} from "@/features/admin/categories/schemas/categorySchemas";
import {
  createAdminCategory,
  updateAdminCategory,
} from "@/features/admin/categories/api/categoriesApi";
import type { AdminCategory } from "@/types/category";

interface UseCategoryFormOptions {
  mode: "create" | "edit";
  category?: AdminCategory;
  onSuccess: () => void;
}

export function useCategoryForm({
  mode,
  category,
  onSuccess,
}: UseCategoryFormOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    mode: "onBlur",
    defaultValues: {
      name: category?.name ?? "",
      description: category?.description ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        await createAdminCategory(values);
        toast.success("Category created.");
      } else if (category) {
        await updateAdminCategory(category.categoryId, values);
        toast.success("Category updated.");
      }
      onSuccess();
    } catch {
      // apiClient already shows an error toast
    } finally {
      setIsSubmitting(false);
    }
  });

  return { form, onSubmit, isSubmitting };
}
