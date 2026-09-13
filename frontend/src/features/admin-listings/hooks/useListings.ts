import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminListingsApi } from "../api/adminListingsApt";
import type { ListingSummary, Pagination } from "../types/adminListing.types";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

interface UseListingsResult {
  listings: ListingSummary[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
  setPage: (p: number) => void;
  setLimit: (l: number) => void;
  refetch: () => void;
  updateListingLocal: (id: string, patch: Partial<ListingSummary>) => void;
}

export function useListings(): UseListingsResult {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [listings, setListings] = useState<ListingSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminListingsApi.getListings(page, limit);
        if (cancelled) return;
        if (res.success) {
          setListings(res.data);
          setPagination(res.pagination);
        } else {
          setError("Failed to load listings.");
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load listings.";
        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, limit, reloadKey]);

  const updateListingLocal = (id: string, patch: Partial<ListingSummary>) =>
    setListings((prev) =>
      prev.map((l) => (l.listingId === id ? { ...l, ...patch } : l)),
    );

  return {
    listings,
    pagination,
    isLoading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refetch: () => setReloadKey((k) => k + 1),
    updateListingLocal,
  };
}
