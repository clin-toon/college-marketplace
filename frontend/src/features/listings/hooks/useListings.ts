import { useCallback, useEffect, useState } from "react";
import { getListings } from "@/features/listings/api/listingsApi";
import { ApiError } from "@/lib/apiClient";
import { useDebouncedValue } from "@/lib/useDebouncedValue";
import { LISTING_SORT_OPTIONS, type ListingSortValue } from "@/lib/constants";
import type { Listing, Pagination } from "@/types/listing";

const PAGE_SIZE = 10;

export function useListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState<ListingSortValue>("latest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const fetchListings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const option =
        LISTING_SORT_OPTIONS.find((o) => o.value === sort) ??
        LISTING_SORT_OPTIONS[0];

      const response = await getListings({
        page,
        limit: PAGE_SIZE,
        q: debouncedSearch.trim() || undefined,
        sort: option.sortBy,
        order: option.order,
      });
      setListings(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Couldn't load listings. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, sort]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  /** Search and sort changes should always jump back to page 1. */
  function updateSearch(value: string) {
    setSearchInput(value);
    setPage(1);
  }

  function updateSort(value: ListingSortValue) {
    setSort(value);
    setPage(1);
  }

  return {
    listings,
    pagination,
    page,
    setPage,
    isLoading,
    error,
    retry: fetchListings,
    searchInput,
    updateSearch,
    sort,
    updateSort,
  };
}
