import { apiClient } from "@/lib/apiClient";
import type {
  ListingDetailResponse,
  ListingMutationResponse,
  ListingsResponse,
  ListingStatus,
} from "@/types/listing";

export function getMyListings(page = 1, limit = 10) {
  return apiClient.get<ListingsResponse>(`/listings/details/mine`);
}

export function getMyListingById(id: string) {
  return apiClient.get<ListingDetailResponse>(`/listings/${id}`);
}

export interface ListingFormPayload {
  title: string;
  description: string;
  price: number;
  condition: string;
  categoryName: string;
  images: File[];
}

function buildListingFormData(payload: ListingFormPayload) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("description", payload.description);
  formData.append("price", String(payload.price));
  formData.append("condition", payload.condition);
  formData.append("categoryName", payload.categoryName);
  payload.images.forEach((file) => formData.append("images", file));
  return formData;
}

export function createListing(payload: ListingFormPayload) {
  return apiClient.post<ListingMutationResponse>(
    "/listings",
    buildListingFormData(payload),
  );
}

/**
 * `keepImageUrls` are existing images the user chose to keep — adjust the
 * field name below if your backend expects something else for merging
 * kept images with newly uploaded ones.
 */
export function updateListing(
  id: string,
  payload: ListingFormPayload,
  keepImageUrls: string[],
) {
  console.log(id);
  const formData = buildListingFormData(payload);
  formData.append("existingImages", JSON.stringify(keepImageUrls));
  return apiClient.patch<ListingMutationResponse>(`/listings/${id}`, formData);
}

export function updateListingStatus(id: string, status: ListingStatus) {
  return apiClient.patch<ListingMutationResponse>(`/listings/${id}/status`, {
    status,
  });
}

export function deleteListing(id: string) {
  return apiClient.delete<{ success: boolean; message?: string }>(
    `/listings/${id}`,
  );
}
