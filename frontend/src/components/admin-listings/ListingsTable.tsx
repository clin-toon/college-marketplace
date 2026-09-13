import { useEffect, useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import type { ListingSummary } from "../../features/admin-listings/types/adminListing.types";

import {
  formatPrice,
  formatCondition,
} from "../../features/admin-listings/utils/listingFormat";
import StatusBadge from "./StatutsBadge";

export type ListingRowAction =
  | "view"
  | "hide"
  | "show"
  | "mark-sold"
  | "mark-removed";

const ACTION_LABELS: {
  action: ListingRowAction;
  label: string;
  show: (l: ListingSummary) => boolean;
}[] = [
  { action: "view", label: "View Details", show: () => true },
  { action: "hide", label: "Hide Listing", show: (l) => l.status !== "hidden" },
  { action: "show", label: "Show Listing", show: (l) => l.status === "hidden" },
  {
    action: "mark-sold",
    label: "Mark as Sold",
    show: (l) => l.status === "active",
  },
  {
    action: "mark-removed",
    label: "Mark as Removed",
    show: (l) => l.status !== "removed",
  },
];

interface Props {
  listings: ListingSummary[];
  onSelect: (listing: ListingSummary) => void;
  onAction: (action: ListingRowAction, listing: ListingSummary) => void;
}

export default function ListingsTable({ listings, onSelect, onAction }: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-5 py-3 font-medium">Listing</th>
            <th className="px-5 py-3 font-medium">Seller</th>
            <th className="px-5 py-3 font-medium">Price</th>
            <th className="px-5 py-3 font-medium">Condition</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {listings.map((listing) => (
            <tr
              key={listing.listingId}
              onClick={() => onSelect(listing)}
              className="cursor-pointer transition-colors hover:bg-slate-50"
            >
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  {listing.images[0] ? (
                    <img
                      src={listing.images[0]}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-100" />
                  )}
                  <div className="min-w-0">
                    <p className="max-w-[220px] truncate font-medium text-slate-900">
                      {listing.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {listing.categoryName}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3">
                <p className="max-w-[180px] truncate text-slate-600">
                  {listing.sellerEmail}
                </p>
              </td>
              <td className="px-5 py-3 font-medium text-slate-900">
                {formatPrice(listing.price)}
              </td>
              <td className="px-5 py-3 text-slate-600">
                {formatCondition(listing.condition)}
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={listing.status} />
              </td>
              <td className="px-5 py-3 text-right">
                <div
                  ref={openMenuId === listing.listingId ? menuRef : undefined}
                  className="relative inline-block"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(
                        openMenuId === listing.listingId
                          ? null
                          : listing.listingId,
                      );
                    }}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Listing actions"
                  >
                    <FaEllipsisV />
                  </button>
                  {openMenuId === listing.listingId && (
                    <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                      {ACTION_LABELS.filter((a) => a.show(listing)).map(
                        ({ action, label }) => (
                          <button
                            key={action}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuId(null);
                              onAction(action, listing);
                            }}
                            className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                              action === "mark-removed"
                                ? "text-red-600"
                                : "text-slate-700"
                            }`}
                          >
                            {label}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
