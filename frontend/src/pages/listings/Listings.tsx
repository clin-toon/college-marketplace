import {
  HiOutlineExclamationTriangle,
  HiOutlineMagnifyingGlassMinus,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import { ListingCard } from "@/components/listings/ListingCard";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import { ListingsToolbar } from "@/components/listings/ListingsToolbar";
import { StatePanel } from "@/components/ui/StatePanel";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { useListings } from "@/features/listings/hooks/useListings";

export default function Listings() {
  const {
    listings,
    pagination,
    setPage,
    isLoading,
    error,
    retry,
    searchInput,
    updateSearch,
    sort,
    updateSort,
  } = useListings();

  const isFiltered = searchInput.trim().length > 0;

  return (
    <div className="mx-auto max-w-6xl px-8 py-10 lg:px-12">
      <div className="mb-8 flex flex-col gap-1.5">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan">
          Marketplace
        </span>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-app-text">
          Listings
        </h1>
        <p className="text-[14px] text-app-text-muted">
          {pagination
            ? `${pagination.totalCount} items available from students at OIC.`
            : "Browse items listed by students at OIC."}
        </p>
      </div>

      <ListingsToolbar
        searchValue={searchInput}
        onSearchChange={updateSearch}
        sortValue={sort}
        onSortChange={updateSort}
      />

      {isLoading && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ListingCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <StatePanel
          icon={<HiOutlineExclamationTriangle className="h-5 w-5" />}
          title="Couldn't load listings"
          description={error}
          action={
            <button
              onClick={retry}
              className="mt-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-5 py-2 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-transform hover:-translate-y-0.5"
            >
              Try again
            </button>
          }
        />
      )}

      {!isLoading && !error && listings.length === 0 && isFiltered && (
        <StatePanel
          icon={<HiOutlineMagnifyingGlassMinus className="h-5 w-5" />}
          title="No matches found"
          description={`Nothing matches "${searchInput}". Try a different search term.`}
        />
      )}

      {!isLoading && !error && listings.length === 0 && !isFiltered && (
        <StatePanel
          icon={<HiOutlineSquares2X2 className="h-5 w-5" />}
          title="No listings yet"
          description="Once students start posting items, they'll show up here."
        />
      )}

      {!isLoading && !error && listings.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <ListingCard key={listing.listingId} listing={listing} />
            ))}
          </div>

          {pagination && (
            <div className="mt-10">
              <PaginationBar pagination={pagination} onPageChange={setPage} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
