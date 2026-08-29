import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlinePaperAirplane,
} from "react-icons/hi2";
import { useContactSeller } from "@/features/listings/hooks/useContactSeller";
import type { ListingDetail } from "@/types/listings";

export function SellerCard({ listing }: { listing: ListingDetail }) {
  const { isSending, sent, sendRequest } = useContactSeller(listing.listingId);

  return (
    <div className="glass-surface flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        {listing.sellerProfileImageUrl ? (
          <img
            src={listing.sellerProfileImageUrl}
            alt={listing.sellerFullName}
            className="h-11 w-11 rounded-full object-cover ring-1 ring-white/[0.1]"
          />
        ) : (
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-surface-3 to-surface-2 font-display text-sm font-semibold text-cyan ring-1 ring-white/[0.08]">
            {listing.sellerFullName.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold tracking-tight text-app-text">
            {listing.sellerFullName}
          </p>
          <p className="text-[12px] text-app-text-muted">Seller</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-2.5 text-[13px] text-app-text-muted">
          <HiOutlineEnvelope className="h-4 w-4 shrink-0 text-app-text-muted/70" />
          <span className="truncate">{listing.sellerEmail}</span>
        </div>
        {listing.sellerPhone && (
          <div className="flex items-center gap-2.5 text-[13px] text-app-text-muted">
            <HiOutlinePhone className="h-4 w-4 shrink-0 text-app-text-muted/70" />
            <span>{listing.sellerPhone}</span>
          </div>
        )}
      </div>

      <button
        onClick={sendRequest}
        disabled={isSending || sent}
        className="mt-1 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-brand-blue to-blue-700 px-4 py-2.5 font-display text-[13.5px] font-semibold text-white shadow-[0_1px_0_0_rgba(255,255,255,0.15)_inset,0_8px_20px_-8px_rgba(59,130,246,0.5)] ring-1 ring-white/[0.08] transition-all duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {isSending && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        )}
        {!isSending && <HiOutlinePaperAirplane className="h-3.5 w-3.5" />}
        <span>
          {sent ? "Request sent" : isSending ? "Sending…" : "Contact seller"}
        </span>
      </button>
    </div>
  );
}
