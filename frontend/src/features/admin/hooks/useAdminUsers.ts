import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../api/adminApi";
import type { AdminUser, Pagination } from "../types/user.types";

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;

interface UseAdminUsersResult {
  users: AdminUser[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  refetch: () => void;
  /** Update one user in local state (e.g. after a successful moderation action) */
  updateUserLocal: (userId: string, patch: Partial<AdminUser>) => void;
}

export function useAdminUsers(): UseAdminUsersResult {
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminApi.getUsers(page, limit);
        if (cancelled) return;
        if (res.success) {
          setUsers(res.data);
          setPagination(res.pagination);
        } else {
          setError("Failed to load users.");
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error ? err.message : "Failed to load users.";
        setError(message);
        toast.error(message);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page, limit, reloadKey]);

  const updateUserLocal = (userId: string, patch: Partial<AdminUser>) =>
    setUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, ...patch } : u)),
    );

  return {
    users,
    pagination,
    isLoading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refetch: () => setReloadKey((k) => k + 1),
    updateUserLocal,
  };
}
