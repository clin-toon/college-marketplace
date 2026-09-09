import { useEffect, useState } from "react";

export function useDebouncedValue<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

export function formatPrice(price: string): string {
  const value = Number(price);
  if (Number.isNaN(value)) return price;
  return `Rs. ${value.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

const CONDITION_LABELS: Record<string, string> = {
  new: "New",
  like_new: "Like new",
  good: "Good",
  used: "Used",
};

export function formatCondition(condition: string): string {
  return CONDITION_LABELS[condition] ?? condition;
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  sold: "Sold",
  reserved: "Reserved",
  inactive: "Inactive",
};

const STATUS_CLASSES: Record<string, string> = {
  active: "bg-teal/15 text-teal ring-1 ring-teal/25",
  sold: "bg-danger/15 text-danger ring-1 ring-danger/25",
  reserved: "bg-marigold/15 text-marigold ring-1 ring-marigold/25",
  inactive: "bg-white/[0.06] text-app-text-muted ring-1 ring-white/[0.1]",
};

export function formatStatus(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function statusBadgeClasses(status: string): string {
  return STATUS_CLASSES[status] ?? STATUS_CLASSES.inactive;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
