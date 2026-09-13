import { useEffect, useState } from "react";
import { adminListingsApi } from "../api/adminListingsApt";
import type {
  CategoryCount,
  ConditionCount,
  PriceBucket,
  TimelinePoint,
  TopFavourited,
  TopSeller,
} from "../types/adminListing.types";

export interface ListingAnalytics {
  byCategory: CategoryCount[];
  byCondition: ConditionCount[];
  timeline: TimelinePoint[];
  priceDistribution: PriceBucket[];
  topFavourited: TopFavourited[];
  topSellers: TopSeller[];
}

interface UseListingAnalyticsResult {
  analytics: ListingAnalytics;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const EMPTY: ListingAnalytics = {
  byCategory: [],
  byCondition: [],
  timeline: [],
  priceDistribution: [],
  topFavourited: [],
  topSellers: [],
};

export function useListingAnalytics(): UseListingAnalyticsResult {
  const [analytics, setAnalytics] = useState<ListingAnalytics>(EMPTY);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [
          byCategory,
          byCondition,
          timeline,
          priceDistribution,
          topFavourited,
          topSellers,
        ] = await Promise.all([
          adminListingsApi.getAnalyticsByCategory(),
          adminListingsApi.getAnalyticsByCondition(),
          adminListingsApi.getAnalyticsTimeline(),
          adminListingsApi.getAnalyticsPriceDistribution(),
          adminListingsApi.getAnalyticsTopFavourited(),
          adminListingsApi.getAnalyticsTopSellers(),
        ]);
        if (cancelled) return;
        setAnalytics({
          byCategory: byCategory.data ?? [],
          byCondition: byCondition.data ?? [],
          timeline: timeline.data ?? [],
          priceDistribution: priceDistribution.data ?? [],
          topFavourited: topFavourited.data ?? [],
          topSellers: topSellers.data ?? [],
        });
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof Error ? err.message : "Failed to load analytics.",
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return {
    analytics,
    isLoading,
    error,
    refetch: () => setReloadKey((k) => k + 1),
  };
}
