import {
  FaTimes,
  FaHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState } from "react";
import type { ListingDetail } from "../../features/admin-listings/types/adminListing.types";

import {
  formatPrice,
  formatCondition,
  formatDateLong,
} from "../../features/admin-listings/utils/listingFormat";
import StatusBadge from "./StatutsBadge";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-slate-100 px-6 py-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-sm font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function ListingDetailsDrawer({
  detail,
  isLoading,
  error,
  onClose,
  onHide,
  onShow,
}: {
  detail: ListingDetail | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onHide: () => void;
  onShow: () => void;
}) {
  const [imageIndex, setImageIndex] = useState(0);

  const image = detail?.images[imageIndex];

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div className="absolute inset-0 flex w-full flex-col bg-white shadow-2xl transition-transform sm:inset-y-0 sm:left-auto sm:w-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            Listing Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="space-y-4 p-6">
              <div className="h-56 animate-pulse rounded-xl bg-slate-100" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
            </div>
          )}

          {!isLoading && error && (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-600">
                Unable to load listing details
              </p>
              <p className="mt-1 text-xs text-slate-400">{error}</p>
            </div>
          )}

          {!isLoading && !error && detail && (
            <>
              {/* Image gallery */}
              <div className="relative bg-slate-50">
                {image ? (
                  <img
                    src={image}
                    alt={detail.title}
                    className="h-56 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-56 items-center justify-center text-sm text-slate-400">
                    No image
                  </div>
                )}
                {detail.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setImageIndex(
                          (i) =>
                            (i - 1 + detail.images.length) %
                            detail.images.length,
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"
                      aria-label="Previous image"
                    >
                      <FaChevronLeft className="text-xs" />
                    </button>
                    <button
                      onClick={() =>
                        setImageIndex((i) => (i + 1) % detail.images.length)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow"
                      aria-label="Next image"
                    >
                      <FaChevronRight className="text-xs" />
                    </button>
                  </>
                )}
              </div>

              {/* Title block */}
              <div className="px-6 py-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-bold text-slate-900">
                      {detail.title}
                    </p>
                    <p className="mt-0.5 text-xl font-semibold text-blue-600">
                      {formatPrice(detail.price)}
                    </p>
                  </div>
                  <StatusBadge status={detail.status} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                  <span className="inline-flex items-center gap-1.5">
                    <FaHeart className="text-xs text-rose-500" />{" "}
                    {detail.favourite_count} favourites
                  </span>
                  <span>{formatCondition(detail.condition)}</span>
                  <span>{detail.category_name}</span>
                </div>
                {detail.description && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {detail.description}
                  </p>
                )}
              </div>

              {/* Seller */}
              <Section title="Seller">
                <div className="space-y-4">
                  <Field label="Name" value={detail.seller_full_name} />
                  <Field label="Email" value={detail.seller_email} />
                  <Field label="Phone" value={detail.seller_phone} />
                </div>
              </Section>

              {/* Listing info */}
              <Section title="Listing">
                <div className="space-y-4">
                  <Field label="Listing ID" value={detail.listing_id} />
                  <Field label="Category" value={detail.category_name} />
                  <Field
                    label="Condition"
                    value={formatCondition(detail.condition)}
                  />
                  <Field
                    label="Created"
                    value={formatDateLong(detail.created_at)}
                  />
                  <Field
                    label="Last updated"
                    value={formatDateLong(detail.updated_at)}
                  />
                </div>
              </Section>
            </>
          )}
        </div>

        {/* Footer actions */}
        {!isLoading && !error && detail && (
          <div className="border-t border-slate-100 p-4">
            {detail.status === "hidden" ? (
              <button
                onClick={onShow}
                className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
              >
                Show Listing
              </button>
            ) : (
              <button
                onClick={onHide}
                className="w-full rounded-lg border border-red-200 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Hide Listing
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
