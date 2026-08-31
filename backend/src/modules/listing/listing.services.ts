import { pool } from "../../db/pool";
import { ListingRow, SORT_MAP, ListingResponse } from "./listing.types";
import {
  ListingQuery,
  CreateListingInput,
  UpdateListingInput,
} from "./listing.schema";
import { ListingDetailRow, OwnListingRow } from "./listing.types";
import { AppError } from "../../utils/AppError";
import {
  deleteFromCloudinary,
  uploadBufferToCloudinary,
} from "../../utils/cloudinaryUpload";

/**
 * This service handles search and query
 * parameters if provided
 * Returns all the data if nothing is provided
 */

export async function getAllListings(filters: ListingQuery) {
  const { category, min, max, q, sort, limit = 10, page = 1 } = filters;

  const conditions: string[] = ["l.status = 'active'"];
  const params: unknown[] = [];

  if (category) {
    params.push(category);
    conditions.push(`c.name ILIKE $${params.length}`);
  }

  if (min !== undefined) {
    params.push(min);
    conditions.push(`l.price >= $${params.length}`);
  }

  if (max !== undefined) {
    params.push(max);
    conditions.push(`l.price <= $${params.length}`);
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
  const orderClause = SORT_MAP[sort] ?? "l.created_at DESC";

  const offset = (page - 1) * limit;
  params.push(limit);
  const limitParamIndex = params.length;
  params.push(offset);
  const offsetParamIndex = params.length;

  const result = await pool.query<ListingRow>(
    `SELECT
       l.listing_id,
       l.seller_id,
       u.email AS seller_email,
       up.full_name AS seller_full_name,
       up.faculty AS seller_faculty,
       up.semester AS seller_semester,
       l.category_id,
       c.name AS category_name,
       l.title,
       l.description,
       l.price,
       l.condition,
       l.status,
       l.created_at,
       l.updated_at,
       COALESCE(
         json_agg(li.image_url ORDER BY li.created_at)
         FILTER (WHERE li.image_url IS NOT NULL),
         '[]'
       ) AS images,
       COUNT(*) OVER() AS total_count
     FROM listings l
     INNER JOIN users u ON u.user_id = l.seller_id
     LEFT JOIN user_profile up ON up.user_id = u.user_id
     INNER JOIN categories c ON c.category_id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.listing_id
     ${whereClause}
     GROUP BY l.listing_id, u.email, up.full_name, c.name, up.faculty, up.semester
     ORDER BY ${orderClause}
     LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`,
    params,
  );

  const listings: ListingResponse[] = result.rows.map(toListingResponse);
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

function toListingResponse(row: ListingRow): ListingResponse {
  return {
    listingId: row.listing_id,
    sellerId: row.seller_id,
    sellerEmail: row.seller_email,
    sellerSemester: row.seller_semester,
    sellerFaculty: row.seller_faculty,
    categoryId: row.category_id,
    categoryName: row.category_name,
    title: row.title,
    seller_full_name: row.seller_full_name ?? "",
    description: row.description,
    price: row.price,
    condition: row.condition,
    status: row.status,
    images: row.images,
    createdAt: row.created_at as unknown as string,
    updatedAt: row.updated_at as unknown as string,
  };
}

export async function getListingById(listingId: string | string[]) {
  const result = await pool.query<ListingDetailRow>(
    `SELECT
       l.listing_id,
       l.seller_id,
       u.email AS seller_email,
       up.full_name AS seller_full_name,
       up.profile_image_url AS seller_profile_image_url,
       up.phone AS seller_phone,
       l.category_id,
       c.name AS category_name,
       l.title,
       l.description,
       l.price,
       l.condition,
       l.status,
       l.created_at,
       l.updated_at,
       COALESCE(
         json_agg(li.image_url ORDER BY li.created_at)
         FILTER (WHERE li.image_url IS NOT NULL),
         '[]'
       ) AS images
     FROM listings l
     INNER JOIN users u ON u.user_id = l.seller_id
     LEFT JOIN user_profile up ON up.user_id = u.user_id
     INNER JOIN categories c ON c.category_id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.listing_id
     WHERE l.listing_id = $1
     GROUP BY l.listing_id, u.email, up.full_name, up.profile_image_url, up.phone, c.name`,
    [listingId],
  );

  const row = result.rows[0];

  if (!row) {
    throw new AppError("Listing not found", 404);
  }

  return toListingDetailResponse(row);
}

async function resolveCategoryId(categoryName: string): Promise<string> {
  const result = await pool.query<{ category_id: string }>(
    `SELECT category_id FROM categories WHERE name ILIKE $1`,
    [categoryName],
  );

  const category = result.rows[0];
  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return category.category_id;
}

/**
 * This service create a listing and creates new database records
 * File is uploaded to cloudinary
 */

export async function createListing(
  sellerId: string,
  data: CreateListingInput,
  files: Express.Multer.File[],
) {
  const profileCheck = await pool.query<{ is_allowed_to_post: boolean }>(
    `SELECT is_allowed_to_post FROM user_profile WHERE user_id = $1`,
    [sellerId],
  );
  if (
    profileCheck.rows[0] &&
    profileCheck.rows[0].is_allowed_to_post === false
  ) {
    throw new AppError("You are not permitted to post listings", 403);
  }

  // resolves the name to an id AND confirms the category exists — one call does both,
  // so the separate "category exists" check from before is no longer needed
  const categoryId = await resolveCategoryId(data.categoryName);

  let uploadedUrls: string[] = [];
  if (files.length > 0) {
    const uploads = await Promise.all(
      files.map((file) => uploadBufferToCloudinary(file.buffer, "listings")),
    );
    uploadedUrls = uploads.map((res) => res.secure_url);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const listingResult = await client.query(
      `INSERT INTO listings (seller_id, category_id, title, description, price, condition)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING listing_id, seller_id, category_id, title, description, price, condition, status, created_at, updated_at`,
      [
        sellerId,
        categoryId,
        data.title,
        data.description ?? null,
        data.price,
        data.condition,
      ],
    );
    const listing = listingResult.rows[0];

    if (uploadedUrls.length > 0) {
      const valuesClause = uploadedUrls
        .map((_, i) => `($1, $${i + 2})`)
        .join(", ");
      await client.query(
        `INSERT INTO listing_images (listing_id, image_url) VALUES ${valuesClause}`,
        [listing.listing_id, ...uploadedUrls],
      );
    }

    await client.query("COMMIT");
    return { ...listing, images: uploadedUrls };
  } catch (err) {
    await client.query("ROLLBACK");
    await Promise.allSettled(
      uploadedUrls.map((url) => deleteFromCloudinary(url)),
    );
    throw err;
  } finally {
    client.release();
  }
}

export async function getMyListings(sellerId: string) {
  const result = await pool.query<OwnListingRow>(
    `SELECT
       l.listing_id,
       l.category_id,
       c.name AS category_name,
       l.title,
       l.description,
       l.price,
       l.condition,
       l.status,
       l.created_at,
       l.updated_at,
       COALESCE(
         json_agg(li.image_url ORDER BY li.created_at)
         FILTER (WHERE li.image_url IS NOT NULL),
         '[]'
       ) AS images
     FROM listings l
     INNER JOIN categories c ON c.category_id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.listing_id
     WHERE l.seller_id = $1
     GROUP BY l.listing_id, c.name
     ORDER BY l.created_at DESC`,
    [sellerId],
  );

  return result.rows;
}

export async function updateListing(
  listingId: string,
  userId: string,
  data: UpdateListingInput,
  newFiles: Express.Multer.File[],
) {
  await assertOwnership(listingId, userId);

  let resolvedCategoryId: string | undefined;
  if (data.categoryName) {
    resolvedCategoryId = await resolveCategoryId(data.categoryName);
  }

  const fieldMap: Record<string, unknown> = {
    title: data.title,
    description: data.description,
    price: data.price,
    condition: data.condition,
    category_id: resolvedCategoryId, // resolved id goes into the DB column, not the raw name
    status: data.status,
  };

  const setClauses: string[] = [];
  const params: unknown[] = [];

  for (const [column, value] of Object.entries(fieldMap)) {
    if (value !== undefined) {
      params.push(value);
      setClauses.push(`${column} = $${params.length}`);
    }
  }

  // Uploaded images (if any) go outside the transaction, same reasoning as create
  let newUrls: string[] = [];
  if (newFiles.length > 0) {
    const uploads = await Promise.all(
      newFiles.map((file) => uploadBufferToCloudinary(file.buffer, "listings")),
    );
    newUrls = uploads.map((res) => res.secure_url);
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (setClauses.length > 0) {
      params.push(listingId);
      await client.query(
        `UPDATE listings SET ${setClauses.join(", ")}, updated_at = CURRENT_TIMESTAMP
         WHERE listing_id = $${params.length}`,
        params,
      );
    }

    let oldUrls: string[] = [];
    if (newUrls.length > 0) {
      const oldImagesResult = await client.query<{ image_url: string }>(
        `SELECT image_url FROM listing_images WHERE listing_id = $1`,
        [listingId],
      );
      oldUrls = oldImagesResult.rows.map((r) => r.image_url);

      await client.query(`DELETE FROM listing_images WHERE listing_id = $1`, [
        listingId,
      ]);

      const valuesClause = newUrls.map((_, i) => `($1, $${i + 2})`).join(", ");
      await client.query(
        `INSERT INTO listing_images (listing_id, image_url) VALUES ${valuesClause}`,
        [listingId, ...newUrls],
      );
    }

    await client.query("COMMIT");

    // Best-effort cleanup of replaced images, after commit succeeds
    if (oldUrls.length > 0) {
      await Promise.allSettled(oldUrls.map((url) => deleteFromCloudinary(url)));
    }

    return getListingSummary(listingId);
  } catch (err) {
    await client.query("ROLLBACK");
    if (newUrls.length > 0) {
      await Promise.allSettled(newUrls.map((url) => deleteFromCloudinary(url)));
    }
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Check whether the current logged in user
 * is authorized to perform the required action
 * on the provided listing id.
 *
 */
async function assertOwnership(listingId: string, userId: string) {
  const result = await pool.query<{ seller_id: string }>(
    `SELECT seller_id FROM listings WHERE listing_id = $1`,
    [listingId],
  );
  const listing = result.rows[0];

  if (!listing) {
    throw new AppError("Listing not found", 404);
  }
  if (listing.seller_id !== userId) {
    throw new AppError(
      "You do not have permission to perform this action",
      403,
    );
  }
}

async function getListingSummary(listingId: string) {
  const result = await pool.query(
    `SELECT
       l.listing_id, l.category_id, c.name AS category_name, l.title, l.description,
       l.price, l.condition, l.status, l.created_at, l.updated_at,
       COALESCE(json_agg(li.image_url ORDER BY li.created_at) FILTER (WHERE li.image_url IS NOT NULL), '[]') AS images
     FROM listings l
     INNER JOIN categories c ON c.category_id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.listing_id
     WHERE l.listing_id = $1
     GROUP BY l.listing_id, c.name`,
    [listingId],
  );
  return result.rows[0];
}

/**
 *
 * This service deletes the listing only if the
 * logged in user has authorization
 * to delete based on the listing id and logged in user
 * provided by the user and
 */
export async function deleteListing(listingId: string, userId: string) {
  await assertOwnership(listingId, userId);

  const imagesResult = await pool.query<{ image_url: string }>(
    `SELECT image_url FROM listing_images WHERE listing_id = $1`,
    [listingId],
  );
  const urls = imagesResult.rows.map((r) => r.image_url);

  // listing_images rows cascade-delete automatically via ON DELETE CASCADE
  await pool.query(`DELETE FROM listings WHERE listing_id = $1`, [listingId]);

  // Best-effort Cloudinary cleanup after DB delete succeeds
  await Promise.allSettled(urls.map((url) => deleteFromCloudinary(url)));
}

function toListingDetailResponse(row: ListingDetailRow) {
  return {
    listingId: row.listing_id,
    sellerId: row.seller_id,
    sellerEmail: row.seller_email,
    sellerFullName: row.seller_full_name,
    sellerProfileImageUrl: row.seller_profile_image_url,
    sellerPhone: row.seller_phone,
    categoryId: row.category_id,
    categoryName: row.category_name,
    title: row.title,
    description: row.description,
    price: row.price,
    condition: row.condition,
    status: row.status,
    images: row.images,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
