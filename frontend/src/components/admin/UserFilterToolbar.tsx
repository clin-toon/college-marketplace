import { FaSearch, FaUndo } from "react-icons/fa";
import type {
  ListingsFilter,
  PostingFilter,
  RoleFilter,
  SortOption,
  UserFilters,
  VerificationFilter,
} from "@/features/admin/hooks/useUsersFilters";

interface Props {
  filters: UserFilters;
  onChange: (patch: Partial<UserFilters>) => void;
  onReset: () => void;
  isFiltered: boolean;
}

const selectClass =
  "h-10 rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 text-sm font-medium text-slate-700 shadow-sm shadow-slate-950/[0.02] outline-none transition-all duration-200 hover:border-slate-300 hover:bg-white focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-900/[0.05]";

export default function UserFilterToolbar({
  filters,
  onChange,
  onReset,
  isFiltered,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      {/* Header */}
      <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold tracking-[-0.01em] text-slate-900">
              Find users
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Search and refine the user directory
            </p>
          </div>

          {isFiltered && (
            <button
              onClick={onReset}
              className="group inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-500 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 active:scale-[0.98]"
            >
              <FaUndo className="text-[10px] transition-transform duration-300 group-hover:-rotate-45" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        {/* Search */}
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-slate-400" />

          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search by name, email, phone or user ID..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm font-medium text-slate-900 shadow-sm shadow-slate-950/[0.02] outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 hover:bg-white focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-900/[0.05]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <select
              className={selectClass}
              value={filters.role}
              onChange={(e) => onChange({ role: e.target.value as RoleFilter })}
            >
              <option value="all">Role: All</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>

            <select
              className={selectClass}
              value={filters.verification}
              onChange={(e) =>
                onChange({
                  verification: e.target.value as VerificationFilter,
                })
              }
            >
              <option value="all">Verification: All</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </select>

            <select
              className={selectClass}
              value={filters.posting}
              onChange={(e) =>
                onChange({ posting: e.target.value as PostingFilter })
              }
            >
              <option value="all">Posting: All</option>
              <option value="allowed">Allowed to post</option>
              <option value="restricted">Posting restricted</option>
            </select>

            <select
              className={selectClass}
              value={filters.listings}
              onChange={(e) =>
                onChange({ listings: e.target.value as ListingsFilter })
              }
            >
              <option value="all">Listings: All</option>
              <option value="has">Has listings</option>
              <option value="none">No listings</option>
            </select>
          </div>

          {/* Sort */}
          <div className="shrink-0 border-t border-slate-100 pt-3 lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0">
            <select
              className={`${selectClass} w-full lg:w-[180px]`}
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value as SortOption })}
            >
              <option value="newest">Newest users</option>
              <option value="oldest">Oldest users</option>
              <option value="mostListings">Most listings</option>
              <option value="leastListings">Least listings</option>
              <option value="nameAsc">Name A-Z</option>
              <option value="nameDesc">Name Z-A</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
