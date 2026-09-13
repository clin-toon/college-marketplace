/** Wrapper: title + loading skeleton + error/empty states for every chart. */
export default function AnalyticsCard({
  title,
  isLoading,
  error,
  isEmpty,
  onRetry,
  children,
  className = "",
}: {
  title: string;
  isLoading: boolean;
  error: string | null;
  isEmpty: boolean;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-5 ${className}`}
    >
      <h3 className="mb-4 text-sm font-semibold text-slate-800">{title}</h3>
      {isLoading ? (
        <div className="h-[260px] animate-pulse rounded-lg bg-slate-100" />
      ) : error ? (
        <div className="flex h-[260px] flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-medium text-slate-600">
            Couldn't load chart
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              Retry
            </button>
          )}
        </div>
      ) : isEmpty ? (
        <div className="flex h-[260px] items-center justify-center">
          <p className="text-sm text-slate-400">No data available yet</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
