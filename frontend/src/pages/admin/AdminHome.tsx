import { useAdminStats } from "@/features/admin/hooks/useAdminStats";
import StatsDashboard from "@/components/admin/StatsDashboard";

export default function AdminDashboardPage() {
  const { stats, isLoading, error, refetch } = useAdminStats();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        {stats && (
          <button
            onClick={refetch}
            className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50"
          >
            Refresh
          </button>
        )}
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-[118px] animate-pulse rounded-xl border bg-white"
            />
          ))}
        </div>
      )}

      {!isLoading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>
          <button
            onClick={refetch}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      )}

      {!isLoading && !error && stats && <StatsDashboard data={stats} />}
    </div>
  );
}
