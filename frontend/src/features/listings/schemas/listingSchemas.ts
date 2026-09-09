import { z } from "zod";

export const CONDITION_VALUES = ["new", "like_new", "good", "used"] as const;
export const conditionEnum = z.enum(CONDITION_VALUES);

export const MAX_IMAGES = 6;
export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const createListingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "Title must be at least 5 characters long.")
    .max(150, "Title is too long"),
  description: z
    .string()
    .trim()
    .max(2000, "Description is too long")
    .min(20, "Description must be at least 20 characters"),
  price: z.coerce
    .number({ error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  condition: conditionEnum,
  categoryName: z.string().trim().min(1, "Category is required"),
});

export type CreateListingFormValues = z.infer<typeof createListingSchema>;

/**
 * Looser rules for editing, per request — only checks that a field isn't
 * empty or malformed, not the create-time length minimums.
 */
export const updateListingSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(150, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description is too long"),
  price: z.coerce
    .number({ error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  condition: conditionEnum,
  categoryName: z.string().trim().min(1, "Category is required"),
});

export type UpdateListingFormValues = z.infer<typeof updateListingSchema>;
