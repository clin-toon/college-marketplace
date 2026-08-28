import { pool } from "../../db/pool";
import { AppError } from "../../utils/AppError";
import { ListingResponse } from "../../modules/listing/listing.types";

const UNIQUE_VIOLATION = "23505"; //

export async function addFavourite(
  userId: string,
  listingId: string | string[],
) {
  const listingCheck = await pool.query(
    `SELECT 1 FROM listings WHERE listing_id = $1`,
    [listingId],
  );
  if (listingCheck.rowCount === 0) {
    throw new AppError("Listing not found", 404);
  }

  try {
    const result = await pool.query(
      `INSERT INTO favourites (user_id, listing_id)
       VALUES ($1, $2)
       RETURNING favourite_id, user_id, listing_id, created_at`,
      [userId, listingId],
    );

    return result.rows[0];
  } catch (err: any) {
    if (err.code === UNIQUE_VIOLATION) {
      throw new AppError("Listing is already in your favourites", 409);
    }
    throw err; // anything else bubbles up to the centralized error handler
  }
}

export async function removeFavourite(
  userId: string,
  listingId: string | string[],
) {
  const result = await pool.query(
    `DELETE FROM favourites
     WHERE user_id = $1 AND listing_id = $2
     RETURNING favourite_id`,
    [userId, listingId],
  );

  if (result.rowCount === 0) {
    throw new AppError("Favourite not found", 404);
  }
}

interface FavouriteListingRow {
  listing_id: string;
  seller_id: string;
  seller_email: string;
  seller_full_name: string | null;
  category_id: string;
  category_name: string;
  title: string;
  description: string | null;
  price: string;
  condition: ListingResponse["condition"];
  status: ListingResponse["status"];
  created_at: Date;
  updated_at: Date;
  images: string[];
  favourited_at: Date;
}

export async function getUserFavourites(userId: string) {
  const result = await pool.query<FavouriteListingRow>(
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
       f.created_at AS favourited_at
     FROM favourites f
     INNER JOIN listings l ON l.listing_id = f.listing_id
     INNER JOIN users u ON u.user_id = l.seller_id
     LEFT JOIN user_profile up ON up.user_id = u.user_id
     INNER JOIN categories c ON c.category_id = l.category_id
     LEFT JOIN listing_images li ON li.listing_id = l.listing_id
     WHERE f.user_id = $1
     GROUP BY l.listing_id, u.email, up.full_name, c.name, f.created_at
     ORDER BY f.created_at DESC`,
    [userId],
  );

  return result.rows.map((row) => ({
    listingId: row.listing_id,
    sellerId: row.seller_id,
    sellerEmail: row.seller_email,
    sellerFullName: row.seller_full_name,
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
    favouritedAt: row.favourited_at,
  }));
}
