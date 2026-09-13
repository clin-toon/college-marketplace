import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import type { Pagination as PaginationType } from "@/features/admin/types/user.types";

interface PaginationProps {
  pagination: PaginationType;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const LIMIT_OPTIONS = [5, 10, 20, 50];

export default function Pagination({
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const totalPages = pagination.totalPages || 1;

  // Page numbers around current, e.g. 1 … 4 5 6 … 10
  const pageNumbers: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pageNumbers.push(i);
    } else if (pageNumbers[pageNumbers.length - 1] !== "…") {
      pageNumbers.push("…");
    }
  }

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t bg-white px-5 py-3 text-sm text-slate-600 sm:flex-row">
      <p>
        Page <span className="font-medium text-slate-900">{page}</span> of{" "}
        <span className="font-medium text-slate-900">{totalPages}</span>
        <span className="text-slate-400"> ({pagination.totalCount} users)</span>
      </p>

      <div className="flex items-center gap-2">
        {/* Rows per page */}
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded-lg border px-2 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {LIMIT_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>

        {/* Prev / Next */}
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <FaChevronLeft className="text-xs" /> Prev
        </button>

        {pageNumbers.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`rounded-lg px-3 py-1.5 font-medium ${
                p === page
                  ? "bg-slate-900 text-white"
                  : "border hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ),
        )}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 rounded-lg border px-3 py-1.5 font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next <FaChevronRight className="text-xs" />
        </button>
      </div>
    </div>
  );
}
