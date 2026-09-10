import { z } from "zod";

export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user id"),
});

export const listingIdParamSchema = z.object({
  id: z.string().uuid("Invalid listing id"),
});

export const categoryIdParamSchema = z.object({
  id: z.string().uuid("Invalid category id"),
});

const roleEnum = z.enum(["student", "admin", "moderator"]);
const listingStatusEnum = z.enum(["active", "sold", "reserved", "removed"]);

export const adminListUsersQuerySchema = z.object({
  search: z.string().trim().optional(), // matches against email or full name
  role: roleEnum.optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const updateUserRoleSchema = z.object({
  role: roleEnum,
});

export const updatePostingPermissionSchema = z.object({
  isAllowedToPost: z.boolean(),
});

export const adminListListingsQuerySchema = z.object({
  status: listingStatusEnum.optional(), // no default — admins see all statuses unless they filter
  category: z.string().trim().optional(),
  q: z.string().trim().optional(),
  sellerId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const updateListingStatusSchema = z.object({
  status: listingStatusEnum,
});

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  description: z.string().trim().max(500, "Description is too long").optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type AdminListUsersQuery = z.infer<typeof adminListUsersQuerySchema>;
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
export type UpdatePostingPermissionInput = z.infer<
  typeof updatePostingPermissionSchema
>;
export type AdminListListingsQuery = z.infer<
  typeof adminListListingsQuerySchema
>;
export type UpdateListingStatusInput = z.infer<
  typeof updateListingStatusSchema
>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
