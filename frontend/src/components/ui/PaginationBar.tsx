import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { cn } from "@/lib/cn";
import type { Pagination } from "@/types/listing";

interface PaginationBarProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function PaginationBar({ pagination, onPageChange }: PaginationBarProps) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-app-text-muted transition-colors hover:bg-white/[0.05] hover:text-app-text disabled:cursor-not-allowed disabled:opacity-40"
      >
        <HiChevronLeft className="h-4 w-4" />
      </button>

      <span className="px-3 font-mono text-[13px] text-app-text-muted">
        <span className="text-app-text">{page}</span> / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.02] text-app-text-muted transition-colors hover:bg-white/[0.05] hover:text-app-text",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
      >
        <HiChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
