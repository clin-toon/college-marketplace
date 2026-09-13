import { FaChevronRight } from "react-icons/fa";
import type { ListingSummary } from "../../features/admin-listings/types/adminListing.types";

import {
  formatPrice,
  formatCondition,
  formatDate,
} from "../../features/admin-listings/utils/listingFormat";
import StatusBadge from "./StatutsBadge";

export default function ListingMobileCards({
  listings,
  onSelect,
}: {
  listings: ListingSummary[];
  onSelect: (listing: ListingSummary) => void;
}) {
  return (
    <div className="space-y-3 md:hidden">
      {listings.map((listing) => (
        <button
          key={listing.listingId}
          onClick={() => onSelect(listing)}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50"
        >
          {listing.images[0] ? (
            <img
              src={listing.images[0]}
              alt=""
              className="h-14 w-14 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-100" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {listing.title}
            </p>
            <p className="text-xs text-slate-400">
              {listing.categoryName} · {formatCondition(listing.condition)}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                {formatPrice(listing.price)}
              </span>
              <StatusBadge status={listing.status} />
            </div>
            <p className="mt-0.5 text-xs text-slate-400">
              {listing.sellerEmail} · {formatDate(listing.createdAt)}
            </p>
          </div>
          <FaChevronRight className="shrink-0 text-slate-300" />
        </button>
      ))}
    </div>
  );
}
