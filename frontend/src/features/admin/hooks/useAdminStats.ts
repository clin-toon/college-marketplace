import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { adminApi } from "../api/adminApi";
import type { AdminStats } from "../types/admin.types";

interface UseAdminStatsResult {
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAdminStats(): UseAdminStatsResult {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await adminApi.getStats();
        if (cancelled) return;
        if (res.success) {
          setStats(res.data);
        } else {
          setError("Failed to load dashboard stats.");
        }
      } catch (err) {
        if (cancelled) return;
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load dashboard stats.";
        setError(message);
        toast.error(message); // one toast, controlled here — not in UI
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return { stats, isLoading, error, refetch: () => setReloadKey((k) => k + 1) };
}
