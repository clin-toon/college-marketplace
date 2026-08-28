type ClassValue = string | number | bigint | null | boolean | undefined;

/** Joins truthy class names together. Lightweight stand-in for clsx. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
