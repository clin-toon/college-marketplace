import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "ghost";
  children: ReactNode;
}

export function Button({
  isLoading = false,
  variant = "primary",
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "group cursor-pointer relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3",
        "font-display text-[15px] font-semibold tracking-[-0.01em] text-white",
        "border border-white/[0.10]",
        "bg-gradient-to-b from-[#183b78] via-[#123267] to-[#0d2853]",
        "shadow-[0_8px_24px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.12)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-[1px]",
        "hover:border-cyan-300/20",
        "hover:shadow-[0_12px_35px_rgba(37,99,235,0.25),inset_0_1px_0_rgba(255,255,255,0.16)]",
        "active:translate-y-0 active:scale-[0.985]",
        "disabled:cursor-not-allowed disabled:opacity-50",

        // Premium light sweep
        "before:absolute before:inset-y-0 before:-left-full before:w-1/2",
        "before:skew-x-[-20deg] before:bg-gradient-to-r before:from-transparent before:via-white/[0.10] before:to-transparent",
        "before:transition-all before:duration-700",
        "hover:before:left-[130%]",

        variant === "primary" && "text-white",

        variant === "ghost" &&
          [
            "border-white/[0.08]",
            "bg-white/[0.025]",
            "text-slate-300",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
            "backdrop-blur-xl",
            "hover:border-white/[0.14]",
            "hover:bg-white/[0.055]",
            "hover:text-white",
            "hover:shadow-[0_8px_25px_rgba(0,0,0,0.18)]",
          ].join(" "),

        className,
      )}
      {...props}
    >
      {isLoading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </button>
  );
}
