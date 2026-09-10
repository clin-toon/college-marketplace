import { pool } from "../../db/pool";
import { AppError } from "../../utils/AppError";
import { deleteFromCloudinary } from "../../utils/cloudinaryUpload";
import {
  AdminListUsersQuery,
  AdminListListingsQuery,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./admin.validation";

const FOREIGN_KEY_VIOLATION = "23503";
const UNIQUE_VIOLATION = "23505";

export async function getDashboardStats() {
  const result = await pool.query(`
    SELECT
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM users WHERE created_at >= now() - interval '7 days') AS new_users_this_week,
      (SELECT COUNT(*) FROM listings) AS total_listings,
      (SELECT COUNT(*) FROM listings WHERE status = 'active') AS active_listings,
      (SELECT COUNT(*) FROM listings WHERE status = 'sold') AS sold_listings,
      (SELECT COUNT(*) FROM listings WHERE status = 'removed') AS removed_listings,
      (SELECT COUNT(*) FROM listings WHERE created_at >= now() - interval '7 days') AS new_listings_this_week,
      (SELECT COUNT(*) FROM categories) AS total_categories,
      (SELECT COUNT(*) FROM messages) AS total_messages,
      (SELECT COUNT(*) FROM favourites) AS total_favourites
  `);

  const row = result.rows[0];

  return {
    totalUsers: Number(row.total_users),
    newUsersThisWeek: Number(row.new_users_this_week),
    totalListings: Number(row.total_listings),
    activeListings: Number(row.active_listings),
    soldListings: Number(row.sold_listings),
    removedListings: Number(row.removed_listings),
    newListingsThisWeek: Number(row.new_listings_this_week),
    totalCategories: Number(row.total_categories),
    totalMessages: Number(row.total_messages),
    totalFavourites: Number(row.total_favourites),
  };
}

// ============================================================
// User management
// ============================================================
interface AdminUserRow {
  user_id: string;
  email: string;
  role: string;
  is_verified: boolean;
  created_at: Date;
  full_name: string | null;
  phone: string | null;
  is_allowed_to_post: boolean | null;
  listing_count: string;
  total_count: string;
}

export async function getAllUsers(filters: AdminListUsersQuery) {
  const { search, role, page, limit } = filters;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(u.email ILIKE $${params.length} OR up.full_name ILIKE $${params.length})`,
    );
  }

  if (role) {
    params.push(role);
    conditions.push(`u.role = $${params.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const offset = (page - 1) * limit;
  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const result = await pool.query<AdminUserRow>(
    `SELECT
       u.user_id,
       u.email,
       u.role,
       u.is_verified,
       u.created_at,
       up.full_name,
       up.phone,
       up.is_allowed_to_post,
       (SELECT COUNT(*) FROM listings l WHERE l.seller_id = u.user_id) AS listing_count,
       COUNT(*) OVER() AS total_count
     FROM users u
     LEFT JOIN user_profile up ON up.user_id = u.user_id
     ${whereClause}
     ORDER BY u.created_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    params,
  );

  const users = result.rows.map((row) => ({
    userId: row.user_id,
    email: row.email,
    role: row.role,
    isVerified: row.is_verified,
    fullName: row.full_name,
    phone: row.phone,
    isAllowedToPost: row.is_allowed_to_post,
    listingCount: Number(row.listing_count),
    createdAt: row.created_at,
  }));

  const totalCount = result.rows[0] ? Number(result.rows[0].total_count) : 0;

  return {
    users,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

export async function getUserDetail(userId: string) {
  const result = await pool.query(
    `SELECT
       u.user_id, u.email, u.role, u.is_verified, u.created_at,
       up.full_name, up.phone, up.faculty, up.semester, up.is_allowed_to_post, up.profile_image_url,
       (SELECT COUNT(*) FROM listings l WHERE l.seller_id = u.user_id) AS listing_count,
       (SELECT COUNT(*) FROM listings l WHERE l.seller_id = u.user_id AND l.status = 'active') AS active_listing_count,
       (SELECT COUNT(*) FROM favourites f WHERE f.user_id = u.user_id) AS favourite_count
     FROM users u
     LEFT JOIN user_profile up ON up.user_id = u.user_id
     WHERE u.user_id = $1`,
    [userId],
  );

  const row = result.rows[0];
  if (!row) {
    throw new AppError("User not found", 404);
  }

  return {
    userId: row.user_id,
    email: row.email,
    role: row.role,
    isVerified: row.is_verified,
    fullName: row.full_name,
    phone: row.phone,
    faculty: row.faculty,
    semester: row.semester,
    isAllowedToPost: row.is_allowed_to_post,
    profileImageUrl: row.profile_image_url,
    listingCount: Number(row.listing_count),
    activeListingCount: Number(row.active_listing_count),
    favouriteCount: Number(row.favourite_count),
    createdAt: row.created_at,
  };
}

export async function updateUserRole(
  targetUserId: string,
  adminUserId: string,
  role: string,
) {
  if (targetUserId === adminUserId) {
    // Stops an admin from accidentally demoting themselves out of admin
    // access with no other admin around to reverse it.
    throw new AppError("You cannot change your own role", 400);
  }

  const result = await pool.query(
    `UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2
     RETURNING user_id, email, role`,
    [role, targetUserId],
  );

  if (result.rowCount === 0) {
    throw new AppError("User not found", 404);
  }

  return result.rows[0];
}

export async function updatePostingPermission(
  userId: string,
  isAllowedToPost: boolean,
) {
  const result = await pool.query(
    `UPDATE user_profile SET is_allowed_to_post = $1, updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $2
     RETURNING user_id, is_allowed_to_post`,
    [isAllowedToPost, userId],
  );

  if (result.rowCount === 0) {
    throw new AppError("User profile not found", 404);
  }

  return result.rows[0];
}

export async function deleteUser(targetUserId: string, adminUserId: string) {
  if (targetUserId === adminUserId) {
    throw new AppError("You cannot delete your own account", 400);
  }

  // Fetch listing images first so we can clean up Cloudinary after the
  // cascade delete removes the DB rows.
  const imagesResult = await pool.query<{ image_url: string }>(
    `SELECT li.image_url FROM listing_images li
     INNER JOIN listings l ON l.listing_id = li.listing_id
     WHERE l.seller_id = $1`,
    [targetUserId],
  );

  const result = await pool.query(`DELETE FROM users WHERE user_id = $1`, [
    targetUserId,
  ]);
  if (result.rowCount === 0) {
    throw new AppError("User not found", 404);
  }

  // listings, user_profile, favourites, messages all cascade-delete via
  // ON DELETE CASCADE — only Cloudinary assets need manual cleanup.
  await Promise.allSettled(
    imagesResult.rows.map((r) => deleteFromCloudinary(r.image_url)),
  );
}

// ============================================================
// Listing moderation
// ============================================================
interface AdminListingRow {
  listing_id: string;
  seller_id: string;
  seller_email: string;
  title: string;
  price: string;
  condition: string;
  status: string;
  category_name: string;
  created_at: Date;
  images: string[];
  total_count: string;
}

export async function getAllListingsAdmin(filters: AdminListListingsQuery) {
  const { status, category, q, sellerId, page, limit } = filters;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (status) {
    params.push(status);
    conditions.push(`l.status = $${params.length}`);
  }

  if (category) {
    params.push(category);
    conditions.push(`c.name ILIKE $${params.length}`);
  }

  if (sellerId) {
    params.push(sellerId);
    conditions.push(`l.seller_id = $${params.length}`);
  }

  if (q) {
    params.push(`%${q}%`);
    conditions.push(
      `(l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`,
    );
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const offset = (page - 1) * limit;
  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const result = await pool.query<AdminListingRow>(
    `SELECT
       l.listing_id, l.seller_id, u.email AS seller_email, l.title, l.price,
       l.condition, l.status, c.name AS category_name, l.created_at,
       COALESCE(json_agg(li.image_url ORDER BY li.created_at) FILTER (WHERE li.image_url IS NOT NULL), '[]') AS images,
       COUNT(*) OVER() AS total_count
     FROM listings l
     INNER JOIN users u ON u.user_id = l.seller_id
     INNER JOIN categories c ON c.category_id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.listing_id
     ${whereClause}
     GROUP BY l.listing_id, u.email, c.name
     ORDER BY l.created_at DESC
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    params,
  );

  const listings = result.rows.map((row) => ({
    listingId: row.listing_id,
    sellerId: row.seller_id,
    sellerEmail: row.seller_email,
    title: row.title,
    price: row.price,
    condition: row.condition,
    status: row.status,
    categoryName: row.category_name,
    images: row.images,
    createdAt: row.created_at,
  }));

  const totalCount = result.rows[0] ? Number(result.rows[0].total_count) : 0;

  return {
    listings,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
}

export async function updateListingStatusAdmin(
  listingId: string,
  status: string,
) {
  // No ownership check — admins can moderate any listing regardless of seller.
  const result = await pool.query(
    `UPDATE listings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE listing_id = $2
     RETURNING listing_id, title, status`,
    [status, listingId],
  );

  if (result.rowCount === 0) {
    throw new AppError("Listing not found", 404);
  }

  return result.rows[0];
}

export async function deleteListingAdmin(listingId: string) {
  const imagesResult = await pool.query<{ image_url: string }>(
    `SELECT image_url FROM listing_images WHERE listing_id = $1`,
    [listingId],
  );

  const result = await pool.query(
    `DELETE FROM listings WHERE listing_id = $1`,
    [listingId],
  );
  if (result.rowCount === 0) {
    throw new AppError("Listing not found", 404);
  }

  await Promise.allSettled(
    imagesResult.rows.map((r) => deleteFromCloudinary(r.image_url)),
  );
}

// ============================================================
// Category management
// ============================================================
export async function getAllCategories() {
  const result = await pool.query(
    `SELECT
       c.category_id, c.name, c.description, c.created_at,
       (SELECT COUNT(*) FROM listings l WHERE l.category_id = c.category_id) AS listing_count
     FROM categories c
     ORDER BY c.name ASC`,
  );

  return result.rows.map((row) => ({
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    listingCount: Number(row.listing_count),
    createdAt: row.created_at,
  }));
}

export async function createCategory(data: CreateCategoryInput) {
  try {
    const result = await pool.query(
      `INSERT INTO categories (name, description) VALUES ($1, $2)
       RETURNING category_id, name, description, created_at`,
      [data.name, data.description ?? null],
    );
    return result.rows[0];
  } catch (err: any) {
    if (err.code === UNIQUE_VIOLATION) {
      throw new AppError("A category with this name already exists", 409);
    }
    throw err;
  }
}

export async function updateCategory(
  categoryId: string,
  data: UpdateCategoryInput,
) {
  const fieldMap: Record<string, unknown> = {
    name: data.name,
    description: data.description,
  };

  const setClauses: string[] = [];
  const params: unknown[] = [];

  for (const [column, value] of Object.entries(fieldMap)) {
    if (value !== undefined) {
      params.push(value);
      setClauses.push(`${column} = $${params.length}`);
    }
  }

  if (setClauses.length === 0) {
    throw new AppError("No fields provided to update", 400);
  }

  params.push(categoryId);

  try {
    const result = await pool.query(
      `UPDATE categories SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP
       WHERE category_id = $${params.length}
       RETURNING category_id, name, description`,
      params,
    );

    if (result.rowCount === 0) {
      throw new AppError("Category not found", 404);
    }

    return result.rows[0];
  } catch (err: any) {
    if (err.code === UNIQUE_VIOLATION) {
      throw new AppError("A category with this name already exists", 409);
    }
    throw err;
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const result = await pool.query(
      `DELETE FROM categories WHERE category_id = $1`,
      [categoryId],
    );
    if (result.rowCount === 0) {
      throw new AppError("Category not found", 404);
    }
  } catch (err: any) {
    if (err.code === FOREIGN_KEY_VIOLATION) {
      // Your schema uses ON DELETE RESTRICT for category_id on listings —
      // Postgres blocks the delete rather than orphaning listings.
      throw new AppError(
        "This category is still in use by one or more listings and cannot be deleted",
        409,
      );
    }
    throw err;
  }
}
