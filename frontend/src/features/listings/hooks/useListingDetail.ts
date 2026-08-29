import { useCallback, useEffect, useState } from "react";
import { getListingById } from "@/features/listings/api/listingsApi";
import { ApiError } from "@/lib/apiClient";
import type { ListingDetail } from "@/types/listings";

export function useListingDetail(id: string | undefined) {
  const [listing, setListing] = useState<ListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListing = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await getListingById(id);
      setListing(response.data);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load this listing. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  return { listing, isLoading, error, retry: fetchListing };
}
