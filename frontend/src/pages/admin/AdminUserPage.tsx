import { useState } from "react";
import toast from "react-hot-toast";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { useUserFilters } from "@/features/admin/hooks/useUsersFilters";
import {
  computeUserStats,
  computeAccountOverview,
} from "../../utils/userStats";
import { adminApi } from "@/features/admin/api/adminApi";
import type { AdminUser } from "@/features/admin/types/user.types";
import UserStatsSection, {
  AccountOverviewSection,
} from "@/components/admin/UserStatsSection";
import UserFilterToolbar from "@/components/admin/UserFilterToolbar";
import UsersTable, { type UserAction } from "@/components/admin/UsersTable";
import UserMobileCards from "@/components/admin/UserMobileCards";
import UserDrawer from "@/components/admin/UserDrawer";
import ConfirmPostingModal from "@/components/admin/ConfirmPostingModal";
import Pagination from "@/components/admin/Pagination";

export default function AdminUsersPage() {
  const {
    users,
    pagination,
    isLoading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refetch,
    updateUserLocal,
  } = useAdminUsers();

  const { filters, setFilters, filteredUsers, resetFilters, isFiltered } =
    useUserFilters(users);

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const [confirmState, setConfirmState] = useState<{
    user: AdminUser;
    action: "restrict" | "allow";
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const stats = computeUserStats(users, pagination?.totalCount ?? users.length);

  const overview = computeAccountOverview(users);

  const openManagePosting = (user: AdminUser) =>
    setConfirmState({
      user,
      action: user.isAllowedToPost ? "restrict" : "allow",
    });

  const handleTableAction = async (action: UserAction, user: AdminUser) => {
    if (action === "view-details") {
      setSelectedUser(user);
    }

    if (action === "manage-posting") {
      openManagePosting(user);
    }

    // action === "view-listings" requires a per-user listings route
  };

  const handleConfirmPosting = async () => {
    if (!confirmState) return;

    const { user, action } = confirmState;
    const allowed = action === "allow";

    setIsSubmitting(true);

    try {
      await adminApi.setPostingAccess(user.userId, allowed);

      updateUserLocal(user.userId, {
        isAllowedToPost: allowed,
      });

      if (selectedUser?.userId === user.userId) {
        setSelectedUser({
          ...selectedUser,
          isAllowedToPost: allowed,
        });
      }

      toast.success(
        allowed
          ? `${user.fullName} can now create listings.`
          : `Posting restricted for ${user.fullName}.`,
      );

      setConfirmState(null);
    } catch {
      // apiClient already toasted the failure
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-full bg-[#f8f8f6] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px] space-y-8">
        <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />

              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Administration
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              User management
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-[15px]">
              Manage student accounts, verification status, and marketplace
              posting permissions from one place.
            </p>
          </div>

          {pagination && (
            <div className="hidden shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3.5 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <span className="text-xs font-medium text-slate-500">
                {pagination.totalCount.toLocaleString()} total users
              </span>
            </div>
          )}
        </section>

        {/* =========================================================
            LOADING
        ========================================================= */}
        {isLoading && (
          <section className="space-y-7">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[118px] animate-pulse rounded-2xl border border-slate-200/80 bg-white"
                >
                  <div className="space-y-4 p-5">
                    <div className="h-8 w-8 rounded-lg bg-slate-100" />
                    <div className="h-3 w-20 rounded bg-slate-100" />
                    <div className="h-5 w-12 rounded bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>

            {/* Overview */}
            <div className="h-28 animate-pulse rounded-2xl border border-slate-200/80 bg-white" />

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
              <div className="h-14 border-b border-slate-100 bg-slate-50/50" />

              <div className="space-y-0">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[72px] animate-pulse border-b border-slate-100 px-6 py-5"
                  >
                    <div className="h-4 w-1/3 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {!isLoading && error && (
          <section className="flex min-h-[420px] items-center justify-center rounded-3xl border border-red-200/80 bg-white px-6">
            <div className="max-w-md text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                <span className="text-lg text-red-600">!</span>
              </div>

              <h2 className="mt-5 text-base font-semibold tracking-tight text-slate-900">
                Unable to load users
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Something went wrong while retrieving user information. Please
                try again.
              </p>

              <button
                onClick={refetch}
                className="
                  mt-6
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-950
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-slate-800
                  focus:outline-none
                  focus:ring-2
                  focus:ring-slate-950
                  focus:ring-offset-2
                "
              >
                Try again
              </button>
            </div>
          </section>
        )}

        {!isLoading && !error && (
          <div className="space-y-7">
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                    Account overview
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Current marketplace user activity
                  </p>
                </div>
              </div>

              <UserStatsSection stats={stats} />
            </section>

            <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.025)]">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold tracking-tight text-slate-900">
                      Students
                    </h2>

                    <p className="text-xs text-slate-500">
                      Search and filter marketplace accounts
                    </p>
                  </div>

                  {filteredUsers.length > 0 && (
                    <span className="text-xs font-medium text-slate-400">
                      Showing {filteredUsers.length} result
                      {filteredUsers.length === 1 ? "" : "s"}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <UserFilterToolbar
                  filters={filters}
                  onChange={(patch) =>
                    setFilters({
                      ...filters,
                      ...patch,
                    })
                  }
                  onReset={resetFilters}
                  isFiltered={isFiltered}
                />
              </div>
            </section>

            {users.length === 0 ? (
              <section className="flex min-h-[360px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <span className="text-lg text-slate-400">○</span>
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-slate-900">
                    No users yet
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    There are currently no student accounts available to
                    display.
                  </p>
                </div>
              </section>
            ) : filteredUsers.length === 0 ? (
              <section className="flex min-h-[360px] items-center justify-center rounded-2xl border border-slate-200/80 bg-white px-6">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <span className="text-lg text-slate-400">⌕</span>
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-slate-900">
                    No matching users
                  </h3>

                  <p className="mt-1.5 text-sm leading-6 text-slate-500">
                    We couldn't find anyone matching your current search or
                    filters.
                  </p>

                  <button
                    onClick={resetFilters}
                    className="
                      mt-5
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      px-4
                      py-2.5
                      text-sm
                      font-semibold
                      text-slate-700
                      transition
                      hover:border-slate-300
                      hover:bg-slate-50
                    "
                  >
                    Reset filters
                  </button>
                </div>
              </section>
            ) : (
              <>
                <section className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.025)] lg:block">
                  <div className="border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-sm font-semibold text-slate-900">
                          User directory
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Manage account access and marketplace permissions
                        </p>
                      </div>

                      <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-500">
                        {filteredUsers.length} users
                      </span>
                    </div>
                  </div>

                  <UsersTable
                    users={filteredUsers}
                    onSelectUser={setSelectedUser}
                    onAction={handleTableAction}
                  />
                </section>

                <section className="lg:hidden">
                  <UserMobileCards
                    users={filteredUsers}
                    onSelectUser={setSelectedUser}
                  />
                </section>
              </>
            )}

            {pagination && pagination.totalPages > 1 && (
              <section className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.025)]">
                <Pagination
                  pagination={pagination}
                  page={page}
                  limit={limit}
                  onPageChange={setPage}
                  onLimitChange={(newLimit) => {
                    setLimit(newLimit);
                    setPage(1);
                  }}
                />
              </section>
            )}
          </div>
        )}
      </div>

      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onManagePosting={(user) => {
            setSelectedUser(null);
            openManagePosting(user);
          }}
        />
      )}

      {/* ===========================================================
          CONFIRMATION MODAL
      =========================================================== */}
      {confirmState && (
        <ConfirmPostingModal
          user={confirmState.user}
          action={confirmState.action}
          isSubmitting={isSubmitting}
          onCancel={() => setConfirmState(null)}
          onConfirm={handleConfirmPosting}
        />
      )}
    </main>
  );
}
