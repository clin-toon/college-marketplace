import { forwardRef, type SelectHTMLAttributes } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { cn } from "@/lib/cn";

interface AppSelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  placeholder?: string;
}

export const AppSelectField = forwardRef<
  HTMLSelectElement,
  AppSelectFieldProps
>(({ label, error, placeholder, id, className, children, ...props }, ref) => {
  const fieldId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={fieldId}
        className="text-sm font-medium text-app-text-muted"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={fieldId}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
          className={cn(
            "w-full appearance-none rounded-xl border bg-white/[0.025] px-4 py-2.5 pr-10 text-[14px] text-app-text",
            "outline-none backdrop-blur-xl transition-colors duration-150",
            "focus:border-cyan/40 focus:ring-4 focus:ring-cyan/10",
            error
              ? "border-danger focus:border-danger focus:ring-danger/10"
              : "border-white/[0.08]",
            className,
          )}
          {...props}
        >
          <option
            value=""
            disabled
            className="bg-surface-2 text-app-text-muted"
          >
            {placeholder ?? "Select…"}
          </option>
          {children}
        </select>
        <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-app-text-muted/70" />
      </div>
      {error && (
        <p id={`${fieldId}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
});

AppSelectField.displayName = "AppSelectField";
