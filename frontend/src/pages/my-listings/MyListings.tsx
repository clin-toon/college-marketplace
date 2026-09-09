import { useState } from "react";
import {
  HiOutlineExclamationTriangle,
  HiOutlinePlus,
  HiOutlineClipboardDocumentList,
} from "react-icons/hi2";
import { MyListingCard } from "@/components/listings/MyListingCard";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import { StatePanel } from "@/components/ui/StatePanel";
import { PaginationBar } from "@/components/ui/PaginationBar";
import { ListingFormModal } from "@/components/listings/ListingFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useMyListings } from "@/features/my-listings/hooks/useMyListings";
import { useDeleteListing } from "@/features/my-listings/hooks/useDeleteListing";
import type { Listing } from "@/types/listing";

export default function MyListings() {
  const { listings, pagination, setPage, isLoading, error, retry } =
    useMyListings();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<Listing | null>(null);
  const [deletingListing, setDeletingListing] = useState<Listing | null>(null);

  const { isDeleting, remove } = useDeleteListing(() => {
    setDeletingListing(null);
    retry();
  });

  return (
    <div className="mx-auto max-w-6xl px-8 py-10 lg:px-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan">
            Manage
          </span>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-app-text">
            My Listings
          </h1>
          <p className="text-[14px] text-app-text-muted">
            {pagination
              ? `${pagination.totalCount} listings you've posted.`
              : "Create, edit, and manage the items you're selling."}
          </p>
        </div>

        {/* Trigger button for the create modal */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center cursor-pointer gap-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-4 py-2.5 font-display text-[13.5px] font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-all duration-150 hover:-translate-y-0.5"
        >
          <HiOutlinePlus className="h-4 w-4" />
          <span>New listing</span>
        </button>
      </div>

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
          title="Couldn't load your listings"
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

      {!isLoading && !error && listings.length === 0 && (
        <StatePanel
          icon={<HiOutlineClipboardDocumentList className="h-5 w-5" />}
          title="No listings yet"
          description="Create your first listing to start selling to other students."
          action={
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-5 py-2 text-[13.5px] font-semibold text-white shadow-[0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-transform hover:-translate-y-0.5"
            >
              Create a listing
            </button>
          }
        />
      )}

      {!isLoading && !error && listings.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((listing) => (
              <MyListingCard
                key={listing.listing_id}
                listing={listing}
                onEdit={() => setEditingListing(listing)}
                onDelete={() => setDeletingListing(listing)}
              />
            ))}
          </div>

          {pagination && (
            <div className="mt-10">
              <PaginationBar pagination={pagination} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      {/* Create modal */}
      <ListingFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        mode="create"
        onSuccess={retry}
      />

      {/* Edit modal — prefilled from the card's data */}
      <ListingFormModal
        isOpen={editingListing !== null}
        onClose={() => setEditingListing(null)}
        mode="edit"
        listing={editingListing ?? undefined}
        onSuccess={retry}
      />

      {/* Delete confirmation */}
      <ConfirmDialog
        isOpen={deletingListing !== null}
        onClose={() => setDeletingListing(null)}
        onConfirm={() => deletingListing && remove(deletingListing.listing_id)}
        title="Delete this listing?"
        description={`"${deletingListing?.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        danger
      />
    </div>
  );
}
