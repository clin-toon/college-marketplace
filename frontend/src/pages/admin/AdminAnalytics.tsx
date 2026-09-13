import AnalyticsCard from "@/components/admin-listings/AnalyticsCard";
import ListingCategoryChart from "@/components/admin-listings/ListingCategoryChart";
import ListingConditionChart from "@/components/admin-listings/ListingConditionChart";
import ListingTimelineChart from "@/components/admin-listings/ListingTimelineChart";
import PriceDistributionChart from "@/components/admin-listings/PriceDistributionChart";
import {
  TopFavouritedList,
  TopSellersList,
} from "@/components/admin-listings/TopLists";
import { useListingAnalytics } from "@/features/admin-listings/hooks/useListingAnalytics";

const AdminAnalytics = () => {
  const {
    analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
    refetch: refetchAnalytics,
  } = useListingAnalytics();

  return (
    <div>
      <div className="pt-4">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Analytics</h2>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <AnalyticsCard
            title="Listings Timeline"
            isLoading={analyticsLoading}
            error={analyticsError}
            isEmpty={analytics.timeline.length === 0}
            onRetry={refetchAnalytics}
          >
            <ListingTimelineChart data={analytics.timeline} />
          </AnalyticsCard>

          <AnalyticsCard
            title="By Category"
            isLoading={analyticsLoading}
            error={analyticsError}
            isEmpty={analytics.byCategory.length === 0}
            onRetry={refetchAnalytics}
          >
            <ListingCategoryChart data={analytics.byCategory} />
          </AnalyticsCard>

          <AnalyticsCard
            title="By Condition"
            isLoading={analyticsLoading}
            error={analyticsError}
            isEmpty={analytics.byCondition.length === 0}
            onRetry={refetchAnalytics}
          >
            <ListingConditionChart data={analytics.byCondition} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Price Distribution"
            isLoading={analyticsLoading}
            error={analyticsError}
            isEmpty={analytics.priceDistribution.length === 0}
            onRetry={refetchAnalytics}
          >
            <PriceDistributionChart data={analytics.priceDistribution} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Top Favourited"
            isLoading={analyticsLoading}
            error={analyticsError}
            isEmpty={analytics.topFavourited.length === 0}
            onRetry={refetchAnalytics}
          >
            <TopFavouritedList data={analytics.topFavourited} />
          </AnalyticsCard>

          <AnalyticsCard
            title="Top Sellers"
            isLoading={analyticsLoading}
            error={analyticsError}
            isEmpty={analytics.topSellers.length === 0}
            onRetry={refetchAnalytics}
          >
            <TopSellersList data={analytics.topSellers} />
          </AnalyticsCard>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
