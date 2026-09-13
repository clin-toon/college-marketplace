import type { ListingSummary } from "../../features/admin-listings/types/adminListing.types";

export interface ListingModalState {
  listing: ListingSummary;
  action: "hide" | "show" | "mark-sold" | "mark-removed";
}

const COPY: Record<
  ListingModalState["action"],
  { title: string; body: (l: ListingSummary) => string; confirm: string }
> = {
  hide: {
    title: "Hide listing?",
    body: (l) => `"${l.title}" will no longer be visible to buyers.`,
    confirm: "Hide Listing",
  },
  show: {
    title: "Show listing?",
    body: (l) => `"${l.title}" will become visible to buyers again.`,
    confirm: "Show Listing",
  },
  "mark-sold": {
    title: "Mark as sold?",
    body: (l) => `"${l.title}" will be marked as sold.`,
    confirm: "Mark as Sold",
  },
  "mark-removed": {
    title: "Mark as removed?",
    body: (l) => `"${l.title}" will be marked as removed.`,
    confirm: "Mark as Removed",
  },
};

export default function ConfirmListingModal({
  state,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  state: ListingModalState;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const copy = COPY[state.action];
  console.log(state);
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-base font-semibold text-slate-900">{copy.title}</h3>
        <p className="mt-2 text-sm text-slate-600">
          {copy.body(state.listing)}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${
              state.action === "hide" || state.action === "mark-removed"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Working..." : copy.confirm}
          </button>
        </div>
      </div>
    </div>
  );
}
