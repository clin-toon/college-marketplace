import { forwardRef, type SelectHTMLAttributes } from "react";
import { HiChevronDown } from "react-icons/hi2";
import { cn } from "@/lib/cn";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  placeholder?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, error, placeholder, id, className, children, ...props }, ref) => {
    const selectId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-white font-body"
        >
          {label}
        </label>
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${selectId}-error` : undefined}
            defaultValue=""
            className={cn(
              "w-full appearance-none rounded-xl border bg-white px-4 py-2.5 text-[15px] text-ink",
              "transition-colors duration-150 outline-none",
              "focus:border-quad focus:ring-4 focus:ring-quad/10",
              "pr-10",
              error
                ? "border-danger focus:border-danger focus:ring-danger/10"
                : "border-paper-dim",
              className,
            )}
            {...props}
          >
            <option value="" disabled>
              {placeholder ?? "Select…"}
            </option>
            {children}
          </select>
          <HiChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft/70" />
        </div>
        {error && (
          <p
            id={`${selectId}-error`}
            className="text-xs font-medium text-danger"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

SelectField.displayName = "SelectField";
