import { useCallback, useEffect, useState } from "react";
import { getMyListings } from "@/features/my-listings/api/myListingsApi";
import { ApiError } from "@/lib/apiClient";
import type { Listing, Pagination } from "@/types/listing";

const PAGE_SIZE = 10;

export function useMyListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getMyListings(page, PAGE_SIZE);
      setListings(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load your listings. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return {
    listings,
    pagination,
    page,
    setPage,
    isLoading,
    error,
    retry: fetchListings,
  };
}
