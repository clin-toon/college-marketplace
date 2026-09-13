import { z } from "zod";

export const listingIdParamSchema = z.object({
  id: z.string().uuid("Invalid listing id"),
});

const statusEnum = z.enum(["active", "sold", "reserved", "removed"]);
const conditionEnum = z.enum(["new", "like_new", "good", "used"]);
const sortByEnum = z.enum(["created_at", "price", "title"]);
const sortOrderEnum = z.enum(["asc", "desc"]);

export const adminListingQuerySchema = z
  .object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: sortByEnum.default("created_at"),
    sortOrder: sortOrderEnum.default("desc"),
    status: statusEnum.optional(),
    category: z.string().trim().optional(),
    condition: conditionEnum.optional(),
    sellerId: z.string().uuid().optional(),
    search: z.string().trim().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
  })
  .refine(
    (d) =>
      d.minPrice === undefined ||
      d.maxPrice === undefined ||
      d.minPrice <= d.maxPrice,
    {
      message: "minPrice cannot exceed maxPrice",
      path: ["minPrice"],
    },
  );

export const hideListingSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export const showListingSchema = z.object({
  note: z.string().trim().max(500).optional(),
});

export const setStatusSchema = z.object({
  status: statusEnum,
});

export const analyticsTimelineQuerySchema = z.object({
  days: z.coerce.number().int().positive().max(365).default(30),
});

export type AdminListingQuery = z.infer<typeof adminListingQuerySchema>;
export type HideListingInput = z.infer<typeof hideListingSchema>;
export type SetStatusInput = z.infer<typeof setStatusSchema>;
export type AnalyticsTimelineQuery = z.infer<
  typeof analyticsTimelineQuerySchema
>;
