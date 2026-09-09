import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineExclamationTriangle,
  HiOutlinePencilSquare,
  HiOutlineTrash,
} from "react-icons/hi2";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { StatusSelect } from "@/components/listings/StatusSelect";
import { ListingFormModal } from "@/components/listings/ListingFormModal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import { StatePanel } from "@/components/ui/StatePanel";
import { useListingDetail } from "@/features/listings/hooks/useListingDetail";
import { useUpdateListingStatus } from "@/features/my-listings/hooks/useUpdateListingStatus";
import { useDeleteListing } from "@/features/my-listings/hooks/useDeleteListing";
import { useState } from "react";
import { formatCondition, formatDate, formatPrice } from "@/lib/format";

export default function MyListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listing, isLoading, error, retry } = useListingDetail(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // These hooks need a real listing to exist, so they're initialized lazily below.
  return (
    <div className="mx-auto max-w-5xl px-8 py-10 lg:px-12">
      <button
        onClick={() => navigate("/my-listings")}
        className="mb-6 flex items-center gap-1.5 text-[13.5px] font-medium text-app-text-muted transition-colors hover:text-app-text"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to my listings
      </button>

      {isLoading && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
          <ListingCardSkeleton />
          <ListingCardSkeleton />
        </div>
      )}

      {!isLoading && error && (
        <StatePanel
          icon={<HiOutlineExclamationTriangle className="h-5 w-5" />}
          title="Couldn't load this listing"
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

      {!isLoading && !error && listing && (
        <ListingManagementView
          listing={listing}
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
          isEditOpen={isEditOpen}
          onCloseEdit={() => setIsEditOpen(false)}
          isDeleteOpen={isDeleteOpen}
          onCloseDelete={() => setIsDeleteOpen(false)}
          onEdited={retry}
        />
      )}
    </div>
  );
}

// Split out so useUpdateListingStatus/useDeleteListing only initialize once `listing` exists.
function ListingManagementView({
  listing,
  onEdit,
  onDelete,
  isEditOpen,
  onCloseEdit,
  isDeleteOpen,
  onCloseDelete,
  onEdited,
}: {
  listing: NonNullable<ReturnType<typeof useListingDetail>["listing"]>;
  onEdit: () => void;
  onDelete: () => void;
  isEditOpen: boolean;
  onCloseEdit: () => void;
  isDeleteOpen: boolean;
  onCloseDelete: () => void;
  onEdited: () => void;
}) {
  const navigate = useNavigate();
  const { status, isUpdating, changeStatus } = useUpdateListingStatus(
    listing.listingId,
    listing.status,
  );
  const { isDeleting, remove } = useDeleteListing(() => {
    navigate("/my-listings");
  });

  return (
    <>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
        {/* Left: images */}
        <ImageGallery images={listing.images} title={listing.title} />

        {/* Right: full details */}
        <div className="flex flex-col gap-6">
          <div>
            <span className="mb-2 inline-block rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-app-text-muted ring-1 ring-white/[0.06]">
              {listing.categoryName}
            </span>
            <h1 className="font-display text-2xl font-semibold tracking-tight text-app-text">
              {listing.title}
            </h1>
          </div>

          <span className="font-mono text-[26px] font-semibold tracking-tight text-cyan">
            {formatPrice(listing.price)}
          </span>

          {/* Status control */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-app-text-muted">
              Status
            </span>
            <StatusSelect
              value={status}
              onChange={changeStatus}
              disabled={isUpdating}
            />
          </div>

          <div className="glass-surface rounded-2xl p-5">
            <h2 className="mb-2 text-[13px] font-semibold tracking-tight text-app-text">
              Description
            </h2>
            <p className="whitespace-pre-wrap text-[13.5px] leading-relaxed text-app-text-muted">
              {listing.description}
            </p>
          </div>

          {/* Full detail fields */}
          <div className="glass-surface grid grid-cols-2 gap-x-4 gap-y-3 rounded-2xl p-5 text-[13px]">
            <DetailRow
              label="Condition"
              value={formatCondition(listing.condition)}
            />
            <DetailRow label="Category" value={listing.categoryName} />
            <DetailRow
              label="Listed on"
              value={formatDate(listing.createdAt)}
            />
            <DetailRow
              label="Last updated"
              value={formatDate(listing.updatedAt)}
            />
            <DetailRow label="Listing ID" value={listing.listingId} mono />
          </div>

          {/* Edit / Delete */}
          <div className="flex gap-3 border-t border-white/[0.06] pt-5">
            <button
              onClick={onEdit}
              className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-4 py-2.5 font-display text-[13.5px] font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-all duration-150 hover:-translate-y-0.5"
            >
              <HiOutlinePencilSquare className="h-4 w-4" />
              Edit listing
            </button>
            <button
              onClick={onDelete}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-danger/30 bg-danger/[0.06] px-4 py-2.5 font-display text-[13.5px] font-semibold text-danger transition-colors hover:bg-danger/10"
            >
              <HiOutlineTrash className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <ListingFormModal
        isOpen={isEditOpen}
        onClose={onCloseEdit}
        mode="edit"
        listing={{ ...listing, listing_id: listing.listingId }}
        onSuccess={onEdited}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={onCloseDelete}
        onConfirm={() => remove(listing.listingId)}
        title="Delete this listing?"
        description={`"${listing.title}" will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        isConfirming={isDeleting}
        danger
      />
    </>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-app-text-muted/70">{label}</span>
      <span
        className={`text-app-text ${mono ? "truncate font-mono text-[12px]" : "text-[13px] font-medium"}`}
      >
        {value}
      </span>
    </div>
  );
}
