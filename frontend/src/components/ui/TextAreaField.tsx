import { forwardRef, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextAreaField = forwardRef<
  HTMLTextAreaElement,
  TextAreaFieldProps
>(({ label, error, hint, id, className, ...props }, ref) => {
  const fieldId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-app-text-muted"
        >
          {label}
        </label>
        {hint && <span className="text-xs text-app-text-muted/60">{hint}</span>}
      </div>
      <textarea
        id={fieldId}
        ref={ref}
        aria-invalid={!!error}
        aria-describedby={error ? `${fieldId}-error` : undefined}
        className={cn(
          "w-full resize-none rounded-xl border bg-white/[0.025] px-4 py-2.5 text-[14px] text-app-text placeholder:text-app-text-muted/50",
          "outline-none backdrop-blur-xl transition-colors duration-150",
          "focus:border-cyan/40 focus:ring-4 focus:ring-cyan/10",
          error
            ? "border-danger focus:border-danger focus:ring-danger/10"
            : "border-white/[0.08]",
          className,
        )}
        {...props}
      />
      {error && (
        <p id={`${fieldId}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

TextAreaField.displayName = "TextAreaField";
