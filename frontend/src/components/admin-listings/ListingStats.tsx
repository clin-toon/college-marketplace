import {
  FaStore,
  FaCheckCircle,
  FaEyeSlash,
  FaCalendarPlus,
} from "react-icons/fa";
import type { ListingSummary } from "../../features/admin-listings/types/adminListing.types";

export interface ListingStatCounts {
  total: number;
  active: number;
  hidden: number;
  newThisPage: number;
}

/**
 * `total` comes from pagination.totalCount (true global total).
 * Active/hidden counts reflect the currently loaded page — the API does
 * not expose global counts per status.
 */
export function deriveListingStats(
  listings: ListingSummary[],
  totalCount: number,
): ListingStatCounts {
  return {
    total: totalCount,
    active: listings.filter((l) => l.status === "active").length,
    hidden: listings.filter((l) => l.status === "hidden").length,
    newThisPage: listings.length,
  };
}

export default function ListingStats({ stats }: { stats: ListingStatCounts }) {
  const cards = [
    {
      label: "Total",
      value: stats.total,
      icon: FaStore,
      color: "text-blue-500",
    },
    {
      label: "Active",
      value: stats.active,
      icon: FaCheckCircle,
      color: "text-green-500",
    },
    {
      label: "Hidden",
      value: stats.hidden,
      icon: FaEyeSlash,
      color: "text-slate-500",
    },
    {
      label: "Loaded",
      value: stats.newThisPage,
      icon: FaCalendarPlus,
      color: "text-amber-500",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">{c.label}</p>
            <c.icon className={`text-lg ${c.color}`} />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
