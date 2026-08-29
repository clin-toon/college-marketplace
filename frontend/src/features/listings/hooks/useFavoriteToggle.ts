import { useState } from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";

/**
 * Optimistically toggles a listing's favorite state and syncs with the
 * backend in the background, rolling back on failure. Adjust the
 * /favourites/:id endpoint below to match your backend route.
 */
export function useFavoriteToggle(listingId: string, initial = false) {
  const [isFavorite, setIsFavorite] = useState(initial);
  const [isSyncing, setIsSyncing] = useState(false);

  async function toggle() {
    const next = !isFavorite;
    setIsFavorite(next);
    setIsSyncing(true);
    try {
      if (next) {
        await apiClient.post(`/favourites/${listingId}`, undefined, {
          silent: true,
        });
      } else {
        await apiClient.delete(`/favourites/${listingId}`, { silent: true });
      }
    } catch (error: any) {
      setIsFavorite(!next);
      toast.error(error.message || "Couldn't update favourites. Try again.");
    } finally {
      setIsSyncing(false);
    }
  }

  return { isFavorite, isSyncing, toggle };
}
