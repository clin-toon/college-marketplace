export type ListingCondition = "new" | "like_new" | "good" | "used";
export type ListingStatus = "active" | "sold" | "inactive";

export interface Listing {
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

/** GET /listings/:id returns a different shape than the list endpoint. */
export interface ListingDetail {
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
