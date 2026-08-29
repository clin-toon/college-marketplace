import { useCallback, useEffect, useState } from "react";
import { getFavourites } from "@/features/favourites/api/favouritesApi";
import { ApiError } from "@/lib/apiClient";
import type { Listing, Pagination } from "@/types/listing";

const PAGE_SIZE = 12;

export function useFavouritesList() {
  const [favourites, setFavourites] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavourites = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getFavourites(page, PAGE_SIZE);
      setFavourites(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load your favourites. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchFavourites();
  }, [fetchFavourites]);

  return {
    favourites,
    pagination,
    page,
    setPage,
    isLoading,
    error,
    retry: fetchFavourites,
  };
}
