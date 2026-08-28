import { ListingQuery } from "./listing.schema";

export interface ListingResponse {
  listingId: string;
  sellerId: string;
  sellerEmail: string;
  sellerFaculty?: string;
  sellerSemester?: string;
  categoryId: string;
  categoryName: string;
  title: string;
  seller_full_name: string;
  description: string | null;
  price: string;
  condition: "new" | "like_new" | "good" | "used";
  status: "active" | "sold" | "reserved" | "removed";
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListingRow {
  listing_id: string;
  seller_id: string;
  seller_email: string;
  category_id: string;
  seller_faculty?: string;
  seller_semester?: string;
  category_name: string;
  seller_full_name: string;
  title: string;
  description: string | null;
  price: string;
  condition: "new" | "like_new" | "good" | "used";
  status: "active" | "sold" | "reserved" | "removed";
  created_at: Date;
  updated_at: Date;
  images: string[];
  total_count?: string;
}

export const SORT_MAP: Record<ListingQuery["sort"], string> = {
  newest: "l.created_at DESC",
  oldest: "l.created_at ASC",
  price_asc: "l.price ASC",
  price_desc: "l.price DESC",
  az: "l.title ASC",
  za: "l.title DESC",
};
export interface ListingDetailRow {
  listing_id: string;
  seller_id: string;
  seller_email: string;
  seller_full_name: string | null;
  seller_profile_image_url: string | null;
  seller_phone: string | null;
  category_id: string;
  category_name: string;
  title: string;
  description: string | null;
  price: string;
  condition: ListingResponse["condition"];
  status: ListingResponse["status"];
  created_at: Date;
  updated_at: Date;
  seller_faculty: string;
  seller_semester: string;
  images: string[];
}
