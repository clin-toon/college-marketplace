import { FaHeart, FaStore } from "react-icons/fa";
import type {
  TopFavourited,
  TopSeller,
} from "../../features/admin-listings/types/adminListing.types";

import { formatPrice } from "../../features/admin-listings/utils/listingFormat";
import StatusBadge from "./StatutsBadge";

export function TopFavouritedList({ data }: { data: TopFavourited[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {data.map((item, i) => (
        <li key={item.listingId} className="flex items-center gap-3 py-2.5">
          <span className="w-5 text-center text-xs font-bold text-slate-300">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {item.title}
            </p>
            <p className="text-xs text-slate-400">{formatPrice(item.price)}</p>
          </div>
          <StatusBadge status={item.status} />
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500">
            <FaHeart className="text-[10px]" /> {item.favouriteCount}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TopSellersList({ data }: { data: TopSeller[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {data.map((seller, i) => (
        <li key={seller.userId} className="flex items-center gap-3 py-2.5">
          <span className="w-5 text-center text-xs font-bold text-slate-300">
            {i + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-900">
              {seller.fullName}
            </p>
            <p className="truncate text-xs text-slate-400">{seller.email}</p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600">
            <FaStore className="text-[10px]" /> {seller.listingCount}
          </span>
          <span className="text-xs text-slate-400">
            {seller.soldCount} sold
          </span>
        </li>
      ))}
    </ul>
  );
}
