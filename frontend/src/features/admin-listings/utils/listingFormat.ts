/** "400.00" -> "Rs. 400" */
export function formatPrice(price: string | number): string {
  const n = Number(price);
  if (Number.isNaN(n)) return String(price);
  return `Rs. ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

/** "like_new" -> "Like New" */
export function formatCondition(condition: string): string {
  return condition
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const CONDITION_COLORS: Record<string, string> = {
  new: "#22c55e",
  like_new: "#3b82f6",
  good: "#f59e0b",
  fair: "#f97316",
  poor: "#ef4444",
};
