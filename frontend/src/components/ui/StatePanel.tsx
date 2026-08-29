import type { ReactNode } from "react";

interface StatePanelProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function StatePanel({ icon, title, description, action }: StatePanelProps) {
  return (
    <div className="glass-surface flex flex-col items-center gap-3 rounded-2xl px-8 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-app-text-muted ring-1 ring-white/[0.08]">
        {icon}
      </span>
      <h3 className="font-display text-[15px] font-semibold tracking-tight text-app-text">
        {title}
      </h3>
      <p className="max-w-sm text-[13.5px] leading-relaxed text-app-text-muted">
        {description}
      </p>
      {action}
    </div>
  );
}
