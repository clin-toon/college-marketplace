import { cn } from "@/lib/cn";
import type { ListingStatus } from "@/types/listing";

const OPTIONS: { value: ListingStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
];

interface StatusSelectProps {
  value: ListingStatus;
  onChange: (status: ListingStatus) => void;
  disabled?: boolean;
}

export function StatusSelect({ value, onChange, disabled }: StatusSelectProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] p-1">
      {OPTIONS.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-lg px-3.5 py-1.5 text-[12.5px] font-medium transition-all duration-150",
              active
                ? "bg-white/[0.08] text-app-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                : "text-app-text-muted hover:text-app-text",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
