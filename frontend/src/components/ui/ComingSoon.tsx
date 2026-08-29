import type { ReactNode } from "react";

interface ComingSoonProps {
  icon: ReactNode;
  title: string;
  eyebrow: string;
  description: string;
}

export function ComingSoon({ icon, title, eyebrow, description }: ComingSoonProps) {
  return (
    <div className="mx-auto max-w-6xl px-8 py-10 lg:px-12">
      <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-cyan">
        {eyebrow}
      </span>
      <h1 className="mt-1.5 font-display text-2xl font-semibold tracking-tight text-app-text">
        {title}
      </h1>

      <div className="glass-surface mt-8 flex flex-col items-center gap-3 rounded-2xl px-8 py-20 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.05] text-app-text-muted ring-1 ring-white/[0.08]">
          {icon}
        </span>
        <p className="max-w-sm text-[13.5px] leading-relaxed text-app-text-muted">
          {description}
        </p>
      </div>
    </div>
  );
}
