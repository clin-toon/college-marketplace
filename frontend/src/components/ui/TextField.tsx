import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, icon, rightSlot, id, className, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-white font-body"
        >
          {label}
        </label>
        <div className="relative flex items-center">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 text-ink-soft/70">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              "w-full rounded-xl border bg-white px-4 py-2.5 text-[15px] text-ink placeholder:text-ink-soft/50",
              "transition-colors duration-150 outline-none",
              "focus:border-quad focus:ring-4 focus:ring-quad/10",
              icon && "pl-10",
              rightSlot && "pr-10",
              error
                ? "border-danger focus:border-danger focus:ring-danger/10"
                : "border-paper-dim",
              className,
            )}
            {...props}
          />
          {rightSlot && (
            <span className="absolute right-3.5 flex items-center">
              {rightSlot}
            </span>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-xs font-medium text-danger"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";
