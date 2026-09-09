import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  maxWidthClassName?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidthClassName = "max-w-xl",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-10 sm:items-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="modal-backdrop-in fixed inset-0 bg-void/70 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`modal-panel-in relative w-full ${maxWidthClassName} rounded-2xl border border-white/[0.08] bg-surface-1/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-2xl`}
      >
        {/* ambient glow */}
        <div className="pointer-events-none absolute -top-20 right-10 h-40 w-40 rounded-full bg-brand-blue/15 blur-3xl" />

        <div className="relative flex items-start justify-between gap-4 border-b border-white/[0.06] px-6 py-5">
          <div>
            <h2
              id="modal-title"
              className="font-display text-[17px] font-semibold tracking-tight text-app-text"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-[13px] text-app-text-muted">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-app-text-muted transition-colors hover:bg-white/[0.06] hover:text-app-text"
          >
            <HiXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="relative max-h-[75vh] overflow-y-auto px-6 py-6">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
