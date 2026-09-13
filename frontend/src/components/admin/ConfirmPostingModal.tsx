import type { AdminUser } from "@/features/admin/types/user.types";

export default function ConfirmPostingModal({
  user,
  action,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  user: AdminUser;
  /** "restrict" = take away posting, "allow" = restore posting */
  action: "restrict" | "allow";
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const restrict = action === "restrict";

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
        <h3 className="text-base font-semibold text-slate-900">
          {restrict ? "Restrict posting?" : "Allow posting?"}
        </h3>
        <p className="mt-2 text-sm text-slate-600">
          {restrict
            ? `${user.fullName} will no longer be able to create new marketplace listings.`
            : `This will allow ${user.fullName} to create marketplace listings again.`}
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
              restrict
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting
              ? "Working..."
              : restrict
                ? "Restrict Posting"
                : "Allow Posting"}
          </button>
        </div>
      </div>
    </div>
  );
}
