import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  description: z.string().trim().max(500, "Description is too long").optional(),
});

export type CategoryFormValues = z.infer<typeof createCategorySchema>;
