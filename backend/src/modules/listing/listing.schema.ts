import { z } from "zod";

const sortOptions = [
  "newest",
  "oldest",
  "price_asc",
  "price_desc",
  "az",
  "za",
] as const;

export const listingQuerySchema = z
  .object({
    category: z.string().trim().min(1, "Category cannot be empty").optional(),
    min: z.coerce
      .number({
        error: "min must be a number",
      })
      .nonnegative("min cannot be negative")
      .optional(),

    max: z.coerce
      .number({
        error: "max must be a number",
      })
      .nonnegative("max cannot be negative")
      .optional(),

    q: z
      .string()
      .trim()
      .min(1, "Search query cannot be empty")
      .max(150, "Search query is too long")
      .optional(),

    sort: z.enum(sortOptions).default("newest"),

    limit: z.coerce
      .number()
      .int()
      .positive("limit must be positive")
      .max(100, "limit cannot exceed 100")
      .default(20),

    page: z.coerce.number().int().positive("page must be positive").default(1),
  })
  // cross-field check: min can't exceed max if both are given
  .refine(
    (data) =>
      data.min === undefined || data.max === undefined || data.min <= data.max,
    {
      message: "min cannot be greater than max",
      path: ["min"],
    },
  );

export const listingIdParamSchema = z.object({
  id: z.string().uuid("Invalid listing id"),
});

export type ListingIdParam = z.infer<typeof listingIdParamSchema>;

export type ListingQuery = z.infer<typeof listingQuerySchema>;
