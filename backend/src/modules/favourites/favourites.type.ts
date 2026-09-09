import { ListingResponse } from "../../modules/listing/listing.types";

export interface FavouriteListingRow {
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
