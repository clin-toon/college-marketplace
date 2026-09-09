import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface AppTextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
}

export const AppTextField = forwardRef<HTMLInputElement, AppTextFieldProps>(
  ({ label, error, icon, id, className, ...props }, ref) => {
    const fieldId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-app-text-muted"
        >
          {label}
        </label>
        <div className="relative flex items-center">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 text-app-text-muted/60">
              {icon}
            </span>
          )}
          <input
            id={fieldId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${fieldId}-error` : undefined}
            className={cn(
              "w-full rounded-xl border bg-white/[0.025] px-4 py-2.5 text-[14px] text-app-text placeholder:text-app-text-muted/50",
              "outline-none backdrop-blur-xl transition-colors duration-150",
              "focus:border-cyan/40 focus:ring-4 focus:ring-cyan/10",
              icon && "pl-10",
              error
                ? "border-danger focus:border-danger focus:ring-danger/10"
                : "border-white/[0.08]",
              className,
            )}
            {...props}
          />
        </div>
        {error && (
          <p
            id={`${fieldId}-error`}
            className="text-xs font-medium text-danger"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

AppTextField.displayName = "AppTextField";
