import { useMemo, useState } from "react";
import type { ListingSummary } from "../types/adminListing.types";

export type StatusFilter = "all" | "active" | "hidden" | "sold" | "removed";

export interface ListingFilters {
  search: string;
  status: StatusFilter;
  category: string; // "all" or categoryName
  condition: string; // "all" or condition value
}

export const INITIAL_LISTING_FILTERS: ListingFilters = {
  search: "",
  status: "all",
  category: "all",
  condition: "all",
};

/**
 * Client-side filtering of the loaded page. If the backend adds
 * query params to GET /admin/listings later, move these there and
 * keep this hook's interface unchanged.
 */
export function useListingFilters(listings: ListingSummary[]) {
  const [filters, setFilters] = useState<ListingFilters>(
    INITIAL_LISTING_FILTERS,
  );

  const filtered = useMemo(() => {
    const q = filters.search.trim().toLowerCase();
    return listings.filter((l) => {
      if (
        q &&
        !l.title.toLowerCase().includes(q) &&
        !l.sellerEmail.toLowerCase().includes(q) &&
        !l.listingId.toLowerCase().includes(q)
      ) {
        return false;
      }
      if (filters.status !== "all" && l.status !== filters.status) return false;
      if (filters.category !== "all" && l.categoryName !== filters.category)
        return false;
      if (filters.condition !== "all" && l.condition !== filters.condition)
        return false;
      return true;
    });
  }, [listings, filters]);

  // Options derived from real loaded data (no invented values)
  const categoryOptions = useMemo(
    () => [...new Set(listings.map((l) => l.categoryName))].sort(),
    [listings],
  );
  const conditionOptions = useMemo(
    () => [...new Set(listings.map((l) => l.condition))].sort(),
    [listings],
  );

  const isFiltered =
    filters.search !== "" ||
    filters.status !== "all" ||
    filters.category !== "all" ||
    filters.condition !== "all";

  return {
    filters,
    setFilters,
    filtered,
    categoryOptions,
    conditionOptions,
    resetFilters: () => setFilters(INITIAL_LISTING_FILTERS),
    isFiltered,
  };
}
