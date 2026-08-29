import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import type { ListingsResponse } from "@/types/listings";

interface FavouritesContextValue {
  isFavorite: (listingId: string) => boolean;
  toggleFavorite: (listingId: string) => Promise<void>;
  isLoading: boolean;
}

const FavouritesContext = createContext<FavouritesContextValue | null>(null);

/**
 * Adjust the /favourites endpoint below to match your backend — this
 * assumes GET /favourites returns { success, data: string[] } of the
 * current user's favorited listing ids.
 */
export function FavouritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!user) {
      setFavoriteIds(new Set());
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    apiClient
      .get<ListingsResponse>("/favourites?page=1&limit=100", { silent: true })
      .then((res) => {
        if (!cancelled) {
          setFavoriteIds(new Set(res.data.map((listing) => listing.listingId)));
        }
      })
      .catch(() => {
        if (!cancelled) setFavoriteIds(new Set());
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const isFavorite = useCallback(
    (listingId: string) => favoriteIds.has(listingId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback(
    async (listingId: string) => {
      const wasFavorite = favoriteIds.has(listingId);

      // optimistic update
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) next.delete(listingId);
        else next.add(listingId);
        return next;
      });

      try {
        if (wasFavorite) {
          await apiClient.delete(`/favourites/${listingId}`, { silent: true });
          toast.success("Removed from favourites.");
        } else {
          await apiClient.post(`/favourites/${listingId}`, undefined, {
            silent: true,
          });
          toast.success("Added to favourites.");
        }
      } catch {
        // roll back on failure
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          if (wasFavorite) next.add(listingId);
          else next.delete(listingId);
          return next;
        });
        toast.error("Couldn't update favourites. Try again.");
      }
    },
    [favoriteIds],
  );

  return (
    <FavouritesContext.Provider
      value={{ isFavorite, toggleFavorite, isLoading }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx)
    throw new Error("useFavourites must be used within FavouritesProvider");
  return ctx;
}
