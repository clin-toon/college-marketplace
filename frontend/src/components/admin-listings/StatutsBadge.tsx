import type { ListingStatus } from "../../features/admin-listings/types/adminListing.types";
const STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  hidden: "bg-slate-200 text-slate-600",
  sold: "bg-blue-100 text-blue-700",
  removed: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        STYLES[status] ?? "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}
