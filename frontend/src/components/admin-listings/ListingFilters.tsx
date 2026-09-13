import { FaSearch, FaUndo } from "react-icons/fa";
import type {
  ListingFilters,
  StatusFilter,
} from "../../features/admin-listings/hooks/useListingFilters";

const selectClass =
  "rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300";

interface Props {
  filters: ListingFilters;
  categoryOptions: string[];
  conditionOptions: string[];
  onChange: (patch: Partial<ListingFilters>) => void;
  onReset: () => void;
  isFiltered: boolean;
}

export default function ListingFiltersBar({
  filters,
  categoryOptions,
  conditionOptions,
  onChange,
  onReset,
  isFiltered,
}: Props) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="relative">
        <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          placeholder="Search by title, seller email or listing ID..."
          className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          className={selectClass}
          value={filters.status}
          onChange={(e) => onChange({ status: e.target.value as StatusFilter })}
        >
          <option value="all">Status: All</option>
          <option value="active">Active</option>
          <option value="hidden">Hidden</option>
          <option value="sold">Sold</option>
          <option value="removed">Removed</option>
        </select>
        <select
          className={selectClass}
          value={filters.category}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          <option value="all">Category: All</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className={selectClass}
          value={filters.condition}
          onChange={(e) => onChange({ condition: e.target.value })}
        >
          <option value="all">Condition: All</option>
          {conditionOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {isFiltered && (
          <button
            onClick={onReset}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
          >
            <FaUndo className="text-xs" /> Reset
          </button>
        )}
      </div>
    </div>
  );
}
