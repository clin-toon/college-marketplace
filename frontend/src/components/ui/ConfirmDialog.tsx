import { Modal } from "@/components/ui/Modal";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  danger?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  isConfirming = false,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidthClassName="max-w-sm"
    >
      <p className="text-[13.5px] leading-relaxed text-app-text-muted">
        {description}
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-[13.5px] font-medium text-app-text-muted transition-colors hover:bg-white/[0.05] hover:text-app-text"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isConfirming}
          className={`cursor-pointer flex items-center gap-2 rounded-xl px-4 py-2 text-[13.5px] font-semibold text-white ring-1 ring-white/[0.08] transition-all disabled:cursor-not-allowed disabled:opacity-70 ${
            danger
              ? "bg-gradient-to-b from-danger to-red-700 shadow-[0_8px_20px_-8px_rgba(214,69,80,0.5)]"
              : "bg-gradient-to-b from-brand-blue to-blue-700 shadow-[0_8px_20px_-8px_rgba(59,130,246,0.5)]"
          }`}
        >
          {isConfirming && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {isConfirming ? "Please wait…" : confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
