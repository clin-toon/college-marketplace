import { useNavigate, useParams } from "react-router-dom";
import {
  HiOutlineArrowLeft,
  HiOutlineExclamationTriangle,
  HiHeart,
  HiOutlineHeart,
} from "react-icons/hi2";
import { useFavourites } from "@/context/FavouritesContext";
import { ImageGallery } from "@/components/listings/ImageGallery";
import { SellerCard } from "@/components/listings/SellerCard";
import { ListingCardSkeleton } from "@/components/listings/ListingCardSkeleton";
import { StatePanel } from "@/components/ui/StatePanel";
import { useListingDetail } from "@/features/listings/hooks/useListingDetail";
import { useFavoriteToggle } from "@/features/listings/hooks/useFavoriteToggle";
import {
  formatCondition,
  formatPrice,
  formatStatus,
  statusBadgeClasses,
} from "@/lib/format";

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listing, isLoading, error, retry } = useListingDetail(id);
  const { isFavorite, toggleFavorite } = useFavourites();
  const favorited = listing ? isFavorite(listing.listingId) : false;

  return (
    <div className="mx-auto max-w-5xl px-8 py-10 lg:px-12">
      <button
        onClick={() => navigate("/listings")}
        className="mb-6 flex items-center cursor-pointer gap-1.5 text-[13.5px] font-medium text-app-text-muted transition-colors hover:text-app-text"
      >
        <HiOutlineArrowLeft className="h-4 w-4" />
        Back to listings
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
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* Left: images */}
          <ImageGallery images={listing.images} title={listing.title} />

          {/* Right: details */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="mb-2 inline-block rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] uppercase tracking-wide text-app-text-muted ring-1 ring-white/[0.06]">
                  {listing.categoryName}
                </span>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-app-text">
                  {listing.title}
                </h1>
              </div>

              <button
                onClick={() => toggleFavorite(listing.listingId)}
                aria-label={
                  favorited ? "Remove from favourites" : "Add to favourites"
                }
                aria-pressed={favorited}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.04] text-app-text-muted ring-1 ring-white/[0.08] transition-transform hover:scale-110"
              >
                {favorited ? (
                  <HiHeart className="h-5 w-5 text-red-500" />
                ) : (
                  <HiOutlineHeart className="h-5 w-5" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-mono text-[26px] font-semibold tracking-tight text-cyan">
                {formatPrice(listing.price)}
              </span>
              <span
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusBadgeClasses(listing.status)}`}
              >
                {formatStatus(listing.status)}
              </span>
              <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-app-text-muted ring-1 ring-white/[0.06]">
                {formatCondition(listing.condition)}
              </span>
            </div>

            <div className="glass-surface rounded-2xl p-5">
              <h2 className="mb-2 text-[13px] font-semibold tracking-tight text-app-text">
                Description
              </h2>
              <p className="text-[13.5px] leading-relaxed text-app-text-muted">
                {listing.description}
              </p>
            </div>

            <SellerCard listing={listing} />
          </div>
        </div>
      )}
    </div>
  );
}
