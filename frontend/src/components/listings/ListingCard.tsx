import { useNavigate } from "react-router-dom";
import {
  HiOutlineArrowUpRight,
  HiOutlinePhoto,
  HiHeart,
  HiOutlineHeart,
} from "react-icons/hi2";
import { cn } from "@/lib/cn";
import { formatCondition, formatPrice } from "@/lib/format";
import { useFavourites } from "@/context/FavouritesContext";
import type { Listing } from "@/types/listing";

export function ListingCard({ listing }: { listing: Listing }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavourites();
  const image = listing.images[0];

  const favorited = isFavorite(listing.listingId);

  return (
    <div
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl transition-all duration-200",
        "hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]",
        favorited
          ? // colored state: marigold-tinted glass + soft glow ring
            "border border-marigold/30 bg-marigold/[0.04] shadow-[0_0_0_1px_rgba(242,169,59,0.12)] hover:border-marigold/45 hover:bg-marigold/[0.06]"
          : "glass-surface hover:border-white/[0.14] hover:bg-white/[0.04]",
      )}
    >
      {/* Image */}
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

        <button
          onClick={() => toggleFavorite(listing.listingId)}
          aria-label={
            favorited ? "Remove from favourites" : "Add to favourites"
          }
          aria-pressed={favorited}
          className="absolute right-3 top-3 cursor-pointer flex h-8 w-8 items-center justify-center rounded-full bg-void/50 text-white backdrop-blur-md ring-1 ring-white/[0.12] transition-transform duration-150 hover:scale-110"
        >
          {favorited ? (
            <HiHeart className="h-4 w-4 text-red-500" />
          ) : (
            <HiOutlineHeart className="h-4 w-4" />
          )}
        </button>

        <span className="absolute bottom-3 left-3 rounded-lg bg-void/60 px-2.5 py-1 font-mono text-[13px] font-semibold text-cyan backdrop-blur-md ring-1 ring-white/[0.1]">
          {formatPrice(listing.price)}
        </span>

        <span className="absolute bottom-3 right-3 rounded-lg bg-void/60 px-2 py-1 text-[11px] font-medium text-app-text-muted backdrop-blur-md ring-1 ring-white/[0.1]">
          {formatCondition(listing.condition)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="line-clamp-1 font-display text-[15px] font-semibold tracking-tight text-app-text">
          {listing.title}
        </h3>

        <p className="line-clamp-2 text-[13px] leading-relaxed text-app-text-muted">
          {listing.description}
        </p>

        <div className="mt-1 flex items-center gap-2 text-[12px] text-app-text-muted">
          <span className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono uppercase tracking-wide ring-1 ring-white/[0.06]">
            {listing.categoryName}
          </span>
          <span className="truncate">by {listing.seller_full_name}</span>
        </div>

        <button
          onClick={() => navigate(`/listings/${listing.listingId}`)}
          className={cn(
            "mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5",
            "bg-gradient-to-b from-brand-blue to-blue-700 font-display cursor-pointer text-[13.5px] font-semibold text-white",
            "shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-8px_rgba(59,130,246,0.5)]",
            "ring-1 ring-white/[0.08] transition-all duration-150",
            "hover:-translate-y-0.5 hover:shadow-[0_1px_0_0_rgba(255,255,255,0.2)_inset,0_12px_24px_-8px_rgba(59,130,246,0.6)]",
            "active:translate-y-0",
          )}
        >
          <span>View details</span>
          <HiOutlineArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
