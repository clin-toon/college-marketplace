import { pool } from "../../db/pool";
import { ListingRow, SORT_MAP, ListingResponse } from "./listing.types";
import { ListingQuery } from "./listing.schema";

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
  console.log(params);

  const result = await pool.query<ListingRow>(
    `SELECT
       l.listing_id,
       l.seller_id,
       u.email AS seller_email,
       up.full_name AS seller_full_name,
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
     GROUP BY l.listing_id, u.email, up.full_name, c.name
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
