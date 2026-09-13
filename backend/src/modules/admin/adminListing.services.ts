import { pool } from "../../db/pool";
import { AppError } from "../../utils/AppError";
import {
  AdminListingQuery,
  AnalyticsTimelineQuery,
} from "./adminListing.validation";

interface AdminListingRow {
  listing_id: string;
  seller_id: string;
  seller_email: string;
  seller_full_name: string | null;
  title: string;
  price: string;
  condition: string;
  status: string;
  category_name: string;
  created_at: Date;
  updated_at: Date;
  images: string[];
  favourite_count: string;
  total_count: string;
}

export async function getAllListingsAdmin(filters: AdminListingQuery) {
  const {
    page,
    limit,
    sortBy,
    sortOrder,
    status,
    category,
    condition,
    sellerId,
    search,
    minPrice,
    maxPrice,
    fromDate,
    toDate,
  } = filters;

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
  if (condition) {
    params.push(condition);
    conditions.push(`l.condition = $${params.length}`);
  }
  if (sellerId) {
    params.push(sellerId);
    conditions.push(`l.seller_id = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(l.title ILIKE $${params.length} OR l.description ILIKE $${params.length})`,
    );
  }
  if (minPrice !== undefined) {
    params.push(minPrice);
    conditions.push(`l.price >= $${params.length}`);
  }
  if (maxPrice !== undefined) {
    params.push(maxPrice);
    conditions.push(`l.price <= $${params.length}`);
  }
  if (fromDate) {
    params.push(fromDate);
    conditions.push(`l.created_at >= $${params.length}`);
  }
  if (toDate) {
    params.push(toDate);
    conditions.push(`l.created_at <= $${params.length}`);
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";
  const orderClause = `l.${sortBy} ${sortOrder.toUpperCase()}`;

  const offset = (page - 1) * limit;
  params.push(limit);
  const limitIdx = params.length;
  params.push(offset);
  const offsetIdx = params.length;

  const result = await pool.query<AdminListingRow>(
    `SELECT
       l.listing_id, l.seller_id, u.email AS seller_email, up.full_name AS seller_full_name,
       l.title, l.price, l.condition, l.status, c.name AS category_name,
       l.created_at, l.updated_at,
       COALESCE(json_agg(DISTINCT li.image_url) FILTER (WHERE li.image_url IS NOT NULL), '[]') AS images,
       (SELECT COUNT(*) FROM favourites f WHERE f.listing_id = l.listing_id) AS favourite_count,
       COUNT(*) OVER() AS total_count
     FROM listings l
     INNER JOIN users u ON u.user_id = l.seller_id
     LEFT JOIN user_profile up ON up.user_id = u.user_id
     INNER JOIN categories c ON c.category_id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.listing_id
     ${whereClause}
     GROUP BY l.listing_id, u.email, up.full_name, c.name
     ORDER BY ${orderClause}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`,
    params,
  );

  const listings = result.rows.map((row) => ({
    listingId: row.listing_id,
    sellerId: row.seller_id,
    sellerEmail: row.seller_email,
    sellerFullName: row.seller_full_name,
    title: row.title,
    price: row.price,
    condition: row.condition,
    status: row.status,
    categoryName: row.category_name,
    images: row.images,
    favouriteCount: Number(row.favourite_count),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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

export async function getListingDetailAdmin(listingId: string) {
  const result = await pool.query(
    `SELECT
       l.listing_id, l.seller_id, u.email AS seller_email, up.full_name AS seller_full_name,
       up.phone AS seller_phone, l.category_id, c.name AS category_name,
       l.title, l.description, l.price, l.condition, l.status,
       l.created_at, l.updated_at,
       COALESCE(json_agg(DISTINCT li.image_url) FILTER (WHERE li.image_url IS NOT NULL), '[]') AS images,
       (SELECT COUNT(*) FROM favourites f WHERE f.listing_id = l.listing_id) AS favourite_count
     FROM listings l
     INNER JOIN users u ON u.user_id = l.seller_id
     LEFT JOIN user_profile up ON up.user_id = u.user_id
     INNER JOIN categories c ON c.category_id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.listing_id
     WHERE l.listing_id = $1
     GROUP BY l.listing_id, u.email, up.full_name, up.phone, c.name`,
    [listingId],
  );

  const row = result.rows[0];
  if (!row) throw new AppError("Listing not found", 404);

  return { ...row, favourite_count: Number(row.favourite_count) };
}

async function assertExists(listingId: string) {
  const result = await pool.query<{
    status: string;
    title: string;
    seller_id: string;
  }>(`SELECT status, title, seller_id FROM listings WHERE listing_id = $1`, [
    listingId,
  ]);
  const listing = result.rows[0];
  if (!listing) throw new AppError("Listing not found", 404);
  return listing;
}

export async function hideListing(listingId: string) {
  const listing = await assertExists(listingId);

  if (listing.status === "removed") {
    throw new AppError("Listing is already hidden", 409); // duplicate-action protection
  }

  const result = await pool.query(
    `UPDATE listings SET status = 'removed', updated_at = CURRENT_TIMESTAMP
     WHERE listing_id = $1
     RETURNING listing_id, title, status`,
    [listingId],
  );

  return result.rows[0];
}

export async function showListing(listingId: string) {
  const listing = await assertExists(listingId);

  if (listing.status === "active") {
    throw new AppError("Listing is already visible", 409);
  }

  const result = await pool.query(
    `UPDATE listings SET status = 'active', updated_at = CURRENT_TIMESTAMP
     WHERE listing_id = $1
     RETURNING listing_id, title, status`,
    [listingId],
  );

  return result.rows[0];
}

export async function setListingStatus(listingId: string, status: string) {
  const listing = await assertExists(listingId);

  if (listing.status === status) {
    throw new AppError(`Listing is already "${status}"`, 409);
  }

  const result = await pool.query(
    `UPDATE listings SET status = $1, updated_at = CURRENT_TIMESTAMP
     WHERE listing_id = $2
     RETURNING listing_id, title, status`,
    [status, listingId],
  );

  return result.rows[0];
}

export async function getListingOverviewStats() {
  const result = await pool.query(`
    SELECT
      COUNT(*) AS total_listings,
      COUNT(*) FILTER (WHERE status = 'active') AS active_count,
      COUNT(*) FILTER (WHERE status = 'sold') AS sold_count,
      COUNT(*) FILTER (WHERE status = 'reserved') AS reserved_count,
      COUNT(*) FILTER (WHERE status = 'removed') AS removed_count,
      COUNT(*) FILTER (WHERE created_at >= now() - interval '7 days') AS new_this_week,
      COUNT(*) FILTER (WHERE created_at >= now() - interval '30 days') AS new_this_month,
      ROUND(AVG(price)::numeric, 2) AS average_price,
      MIN(price) AS min_price,
      MAX(price) AS max_price
    FROM listings
  `);

  const row = result.rows[0];

  return {
    totalListings: Number(row.total_listings),
    byStatus: {
      active: Number(row.active_count),
      sold: Number(row.sold_count),
      reserved: Number(row.reserved_count),
      removed: Number(row.removed_count),
    },
    newThisWeek: Number(row.new_this_week),
    newThisMonth: Number(row.new_this_month),
    averagePrice: row.average_price,
    minPrice: row.min_price,
    maxPrice: row.max_price,
  };
}

// Pie/bar chart: listing count per category
export async function getListingsByCategory() {
  const result = await pool.query(`
    SELECT c.name AS category_name, COUNT(l.listing_id) AS listing_count,
           COUNT(l.listing_id) FILTER (WHERE l.status = 'active') AS active_count
    FROM categories c
    LEFT JOIN listings l ON l.category_id = c.category_id
    GROUP BY c.name
    ORDER BY listing_count DESC
  `);

  return result.rows.map((row) => ({
    categoryName: row.category_name,
    listingCount: Number(row.listing_count),
    activeCount: Number(row.active_count),
  }));
}

// Bar chart: listing count per condition
export async function getListingsByCondition() {
  const result = await pool.query(`
    SELECT condition, COUNT(*) AS listing_count
    FROM listings
    GROUP BY condition
    ORDER BY listing_count DESC
  `);

  return result.rows.map((row) => ({
    condition: row.condition,
    listingCount: Number(row.listing_count),
  }));
}

// Line chart: listings created per day, last N days
export async function getListingsTimeline({ days }: AnalyticsTimelineQuery) {
  const result = await pool.query(
    `SELECT
       date_trunc('day', d)::date AS date,
       COUNT(l.listing_id) AS listing_count
     FROM generate_series(
       CURRENT_DATE - ($1::int - 1) * interval '1 day',
       CURRENT_DATE,
       interval '1 day'
     ) AS d
     LEFT JOIN listings l ON date_trunc('day', l.created_at) = date_trunc('day', d)
     GROUP BY date
     ORDER BY date ASC`,
    [days],
  );

  return result.rows.map((row) => ({
    date: row.date,
    listingCount: Number(row.listing_count),
  }));
}

// Histogram: price distribution in fixed buckets
export async function getPriceDistribution() {
  const result = await pool.query(`
    SELECT
      CASE
        WHEN price < 10 THEN '0-10'
        WHEN price < 25 THEN '10-25'
        WHEN price < 50 THEN '25-50'
        WHEN price < 100 THEN '50-100'
        WHEN price < 250 THEN '100-250'
        ELSE '250+'
      END AS price_bucket,
      COUNT(*) AS listing_count
    FROM listings
    GROUP BY price_bucket
  `);

  // Fixed order regardless of what the query returned, so a chart's
  // x-axis is always in ascending price order, not query-result order.
  const BUCKET_ORDER = ["0-10", "10-25", "25-50", "50-100", "100-250", "250+"];
  const byBucket = new Map(
    result.rows.map((r) => [r.price_bucket, Number(r.listing_count)]),
  );

  return BUCKET_ORDER.map((bucket) => ({
    priceBucket: bucket,
    listingCount: byBucket.get(bucket) ?? 0,
  }));
}

// Table/leaderboard: most-favourited active listings
export async function getTopFavouritedListings(limit = 10) {
  const result = await pool.query(
    `SELECT l.listing_id, l.title, l.price, l.status,
            COUNT(f.favourite_id) AS favourite_count
     FROM listings l
     INNER JOIN favourites f ON f.listing_id = l.listing_id
     GROUP BY l.listing_id
     ORDER BY favourite_count DESC
     LIMIT $1`,
    [limit],
  );

  return result.rows.map((row) => ({
    listingId: row.listing_id,
    title: row.title,
    price: row.price,
    status: row.status,
    favouriteCount: Number(row.favourite_count),
  }));
}

// Table/leaderboard: sellers with the most listings
export async function getTopSellers(limit = 10) {
  const result = await pool.query(
    `SELECT u.user_id, u.email, up.full_name,
            COUNT(l.listing_id) AS listing_count,
            COUNT(l.listing_id) FILTER (WHERE l.status = 'sold') AS sold_count
     FROM users u
     INNER JOIN listings l ON l.seller_id = u.user_id
     LEFT JOIN user_profile up ON up.user_id = u.user_id
     GROUP BY u.user_id, u.email, up.full_name
     ORDER BY listing_count DESC
     LIMIT $1`,
    [limit],
  );

  return result.rows.map((row) => ({
    userId: row.user_id,
    email: row.email,
    fullName: row.full_name,
    listingCount: Number(row.listing_count),
    soldCount: Number(row.sold_count),
  }));
}
