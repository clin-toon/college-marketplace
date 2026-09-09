export type ListingCondition = "new" | "like_new" | "good" | "used";
export type ListingStatus = "active" | "sold" | "inactive" | "reserved";

export interface Listing {
  listing_id: string;
  listingId: string;
  sellerId: string;
  sellerEmail: string;
  sellerSemester: string;
  sellerFaculty: string;
  categoryId: string;
  categoryName: string;
  title: string;
  seller_full_name: string;
  description: string;
  price: string;
  condition: ListingCondition;
  status: ListingStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface ListingsResponse {
  success: boolean;
  data: Listing[];
  pagination: Pagination;
}

export interface ListingDetail {
  listing_id: string;
  listingId: string;
  sellerId: string;
  sellerEmail: string;
  sellerFullName: string;
  sellerProfileImageUrl: string;
  sellerPhone: string;
  categoryId: string;
  categoryName: string;
  title: string;
  description: string;
  price: string;
  condition: ListingCondition;
  status: ListingStatus;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ListingDetailResponse {
  success: boolean;
  data: ListingDetail;
}

export interface Category {
  categoryId: string;
  name: string;
}

export interface CategoriesResponse {
  success: boolean;
  data: Category[];
}

export interface ListingMutationResponse {
  success: boolean;
  message?: string;
  data: ListingDetail;
}

/** Fields the create/edit form needs — satisfied by both Listing and ListingDetail. */
export interface EditableListingSource {
  listing_id: string;
  listingId: string;
  title: string;
  description: string;
  price: string;
  condition: ListingCondition;
  categoryName: string;
  images: string[];
}

export interface EditableListingSources {
  listing_id?: string;
  title: string;
  description: string;
  price: string;
  condition: ListingCondition;
  categoryName: string;
  images: string[];
}
