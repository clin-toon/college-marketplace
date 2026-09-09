import { useNavigate } from "react-router-dom";
import {
  HiOutlinePhoto,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineArrowUpRight,
} from "react-icons/hi2";
import {
  formatCondition,
  formatPrice,
  formatStatus,
  statusBadgeClasses,
} from "@/lib/format";
import type { Listing } from "@/types/listing";

interface MyListingCardProps {
  listing: Listing;
  onEdit: () => void;
  onDelete: () => void;
}

export function MyListingCard({
  listing,
  onEdit,
  onDelete,
}: MyListingCardProps) {
  const navigate = useNavigate();
  const image = listing.images[0];

  return (
    <div className="glass-surface group flex flex-col overflow-hidden rounded-2xl transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.04] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-2">
        {image ? (
          <img
            src={image}
            alt={listing.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-app-text-muted/40">
            <HiOutlinePhoto className="h-10 w-10" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/70 via-transparent to-transparent" />

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-medium backdrop-blur-md ${statusBadgeClasses(listing.status)}`}
        >
          {formatStatus(listing.status)}
        </span>

        <div className="absolute right-3 top-3 flex gap-1.5">
          <button
            onClick={onEdit}
            aria-label="Edit listing"
            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-void/50 text-white backdrop-blur-md ring-1 ring-white/[0.12] transition-transform hover:scale-110"
          >
            <HiOutlinePencilSquare className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete listing"
            className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-void/50 text-white backdrop-blur-md ring-1 ring-white/[0.12] transition-transform hover:scale-110 hover:text-danger"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>

        <span className="absolute bottom-3 left-3 rounded-lg bg-void/60 px-2.5 py-1 font-mono text-[13px] font-semibold text-cyan backdrop-blur-md ring-1 ring-white/[0.1]">
          {formatPrice(listing.price)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-1 font-display text-[15px] font-semibold tracking-tight text-app-text">
          {listing.title}
        </h3>

        <div className="flex items-center gap-2 text-[12px] text-app-text-muted">
          <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono uppercase tracking-wide ring-1 ring-white/[0.06]">
            {listing.categoryName}
          </span>
          <span>{formatCondition(listing.condition)}</span>
        </div>

        <button
          onClick={() => navigate(`/my-listings/${listing.listing_id}`)}
          className="mt-1 cursor-pointer flex w-full items-center justify-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 font-display text-[13.5px] font-semibold text-app-text transition-all duration-150 hover:bg-white/[0.05]"
        >
          <span>Manage</span>
          <HiOutlineArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
