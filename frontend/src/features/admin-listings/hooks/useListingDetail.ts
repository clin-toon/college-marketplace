import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminListingsApi } from "../api/adminListingsApt";
import type { ListingDetail } from "../types/adminListing.types";

/** Fetches one listing's detail when the drawer opens (id changes). */
export function useListingDetail(id: string | null) {
  const [detail, setDetail] = useState<ListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setDetail(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminListingsApi.getListingById(id);
        if (cancelled) return;
        if (res.success) setDetail(res.data);
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load listing details.";
        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  return { detail, isLoading, error };
}
