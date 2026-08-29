import {
  HiOutlineMagnifyingGlass,
  HiChevronDown,
  HiXMark,
} from "react-icons/hi2";
import { LISTING_SORT_OPTIONS, type ListingSortValue } from "@/lib/constants";

interface ListingsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  sortValue: ListingSortValue;
  onSortChange: (value: ListingSortValue) => void;
}

export function ListingsToolbar({
  searchValue,
  onSearchChange,
  sortValue,
  onSortChange,
}: ListingsToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <div className="relative flex-1">
        <HiOutlineMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-app-text-muted/70" />
        <input
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          type="text"
          placeholder="Search listings by title…"
          className="w-full rounded-xl border border-white/[0.08] bg-white/[0.025] py-2.5 pl-10 pr-9 text-[14px] text-app-text placeholder:text-app-text-muted/60 outline-none backdrop-blur-xl transition-colors duration-150 focus:border-cyan/40 focus:ring-4 focus:ring-cyan/10"
        />
        {searchValue && (
          <button
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-app-text-muted/70 hover:text-app-text"
          >
            <HiXMark className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="relative w-full sm:w-56">
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value as ListingSortValue)}
          className="w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.025] py-2.5 pl-4 pr-9 text-[14px] text-app-text outline-none backdrop-blur-xl transition-colors duration-150 focus:border-cyan/40 focus:ring-4 focus:ring-cyan/10"
        >
          {LISTING_SORT_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-surface-2 text-app-text"
            >
              {option.label}
            </option>
          ))}
        </select>
        <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-app-text-muted/70" />
      </div>
    </div>
  );
}
