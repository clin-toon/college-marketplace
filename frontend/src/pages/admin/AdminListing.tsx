import { useState } from "react";

import { useListings } from "@/features/admin-listings/hooks/useListings";
import { useListingFilters } from "@/features/admin-listings/hooks/useListingFilters";
import { useListingAnalytics } from "@/features/admin-listings/hooks/useListingAnalytics";
import { useListingActions } from "@/features/admin-listings/hooks/useListingActions";
import { useListingDetail } from "@/features/admin-listings/hooks/useListingDetail";
import ListingStats, {
  deriveListingStats,
} from "@/components/admin-listings/ListingStats";
import ListingFiltersBar from "@/components/admin-listings/ListingFilters";
import ListingsTable from "@/components/admin-listings/ListingsTable";
import type { ListingRowAction } from "@/components/admin-listings/ListingsTable";
import ListingMobileCards from "@/components/admin-listings/ListingMobileCards";
import ListingDetailsDrawer from "@/components/admin-listings/ListingDetailsDrawer";
import ConfirmListingModal from "@/components/admin-listings/ConfirmListingModal";
import type { ListingModalState } from "@/components/admin-listings/ConfirmListingModal";
import AnalyticsCard from "@/components/admin-listings/AnalyticsCard";
import ListingTimelineChart from "@/components/admin-listings/ListingTimelineChart";
import ListingCategoryChart from "@/components/admin-listings/ListingCategoryChart";
import ListingConditionChart from "@/components/admin-listings/ListingConditionChart";
import PriceDistributionChart from "@/components/admin-listings/PriceDistributionChart";
import {
  TopFavouritedList,
  TopSellersList,
} from "@/components/admin-listings/TopLists";
import Pagination from "@/components/admin/Pagination";

export default function AdminListing() {
  const {
    listings,
    pagination,
    isLoading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refetch,
    updateListingLocal,
  } = useListings();

  const {
    filters,
    setFilters,
    filtered,
    categoryOptions,
    conditionOptions,
    resetFilters,
    isFiltered,
  } = useListingFilters(listings);

  const {
    pendingAction,
    isSubmitting,
    requestAction,
    cancelAction,
    confirmAction,
  } = useListingActions(updateListingLocal);

  // Drawer state — page-level, so filters/search/page survive drawer open/close
  const [drawerListingId, setDrawerListingId] = useState<string | null>(null);
  const drawerListing =
    listings.find((l) => l.listingId === drawerListingId) ?? null;
  const {
    detail,
    isLoading: detailLoading,
    error: detailError,
  } = useListingDetail(drawerListingId);

  const stats = deriveListingStats(
    listings,
    pagination?.totalCount ?? listings.length,
  );

  const handleRowAction = (
    action: ListingRowAction,
    listing: (typeof listings)[number],
  ) => {
    if (action === "view") {
      setDrawerListingId(listing.listingId);
    } else if (action === "mark-sold") {
      requestAction(listing, action, "sold");
    } else if (action === "mark-removed") {
      requestAction(listing, action, "removed");
    } else {
      requestAction(listing, action);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Listings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage and monitor marketplace listings
        </p>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[104px] animate-pulse rounded-xl border border-slate-200 bg-white"
              />
            ))}
          </div>
          <div className="h-24 animate-pulse rounded-xl border border-slate-200 bg-white" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-xl border border-slate-200 bg-white"
              />
            ))}
          </div>
        </>
      )}

      {/* Error state */}
      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
          <p className="text-base font-semibold text-red-700">
            Unable to load listings
          </p>
          <p className="mt-1 text-sm text-red-500">
            Something went wrong while retrieving listing information.
          </p>
          <button
            onClick={refetch}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!isLoading && !error && (
        <>
          <ListingStats stats={stats} />
          <ListingFiltersBar
            filters={filters}
            categoryOptions={categoryOptions}
            conditionOptions={conditionOptions}
            onChange={(patch) => setFilters({ ...filters, ...patch })}
            onReset={resetFilters}
            isFiltered={isFiltered}
          />

          {/* Empty states */}
          {listings.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No listings found
              </p>
              <p className="mt-1 text-sm text-slate-400">
                There are currently no listings to display.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-slate-700">
                No matching listings
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Try changing your search or filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-lg border px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <ListingsTable
                listings={filtered}
                onSelect={(l) => setDrawerListingId(l.listingId)}
                onAction={handleRowAction}
              />
              <ListingMobileCards
                listings={filtered}
                onSelect={(l) => setDrawerListingId(l.listingId)}
              />
            </>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <Pagination
                pagination={pagination}
                page={page}
                limit={limit}
                onPageChange={setPage}
                onLimitChange={(newLimit) => {
                  setLimit(newLimit);
                  setPage(1);
                }}
              />
            </div>
          )}
        </>
      )}

      {/* ---------- Analytics ---------- */}

      {/* Drawer — filters/search/page state lives here, untouched by open/close */}
      {drawerListing && (
        <ListingDetailsDrawer
          detail={detail}
          isLoading={detailLoading}
          error={detailError}
          onClose={() => setDrawerListingId(null)}
          onHide={() => {
            const l = drawerListing;
            setDrawerListingId(null);
            requestAction(l, "hide");
          }}
          onShow={() => {
            const l = drawerListing;
            setDrawerListingId(null);
            requestAction(l, "show");
          }}
        />
      )}

      {/* Confirmation modal */}
      {pendingAction && (
        <ConfirmListingModal
          state={pendingAction as ListingModalState}
          isSubmitting={isSubmitting}
          onCancel={cancelAction}
          onConfirm={confirmAction}
        />
      )}
    </div>
  );
}
