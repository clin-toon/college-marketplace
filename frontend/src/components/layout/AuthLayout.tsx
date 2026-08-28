import type { ReactNode } from "react";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="relative h-dvh overflow-hidden bg-[#050b18] px-5 py-[5vh] sm:px-8 lg:px-[6vw]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[5%] h-[30rem] w-[30rem] rounded-full bg-blue-600/10 blur-[140px]" />

        <div className="absolute right-[5%] top-[15%] h-[26rem] w-[26rem] rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="absolute bottom-[-10%] left-[35%] h-[28rem] w-[28rem] rounded-full bg-indigo-600/10 blur-[150px]" />

        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
          linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
        `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Main shell */}
      <div
        className="
      relative mx-auto flex h-[90dvh] w-full max-w-[1500px]
      overflow-hidden rounded-[2rem]
      border border-white/[0.08]
      bg-[#081225]/80
      shadow-[0_30px_100px_rgba(0,0,0,0.45)]
      backdrop-blur-2xl
    "
      >
        {/* LEFT — fixed, never scrolls */}
        <aside
          className="
        relative hidden w-[45%]
        flex-col justify-between
        overflow-hidden
        border-r border-white/[0.07]
        bg-gradient-to-br from-[#0c1b35] via-[#09152a] to-[#07101f]
        px-12 py-10
        text-paper
        lg:flex
        xl:px-16
      "
        >
          {/* Glows */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-blue-500/15 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-32 -left-32 h-[26rem] w-[26rem] rounded-full bg-cyan-400/10 blur-[110px]" />

          {/* Brand */}
          <div className="relative flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-marigold/20 bg-marigold text-quad-dark shadow-[0_8px_30px_rgba(245,158,11,0.15)]">
              <HiOutlineBuildingLibrary className="h-5 w-5" />
            </span>

            <span className="font-display text-lg font-semibold tracking-tight">
              College Marketplace
            </span>
          </div>

          {/* Hero */}
          <div className="relative max-w-lg">
            <span className="mb-5 inline-flex w-fit items-center rounded-full border border-cyan-300/10 bg-cyan-300/[0.05] px-3.5 py-1.5 font-mono text-[10px] font-medium tracking-[0.18em] text-cyan-300/80">
              OIC · STUDENT MARKETPLACE
            </span>

            <h1 className="font-display text-4xl font-semibold leading-[1.12] tracking-[-0.025em] text-white xl:text-5xl">
              Buy, sell, and
              <span className="block text-cyan-300">pass it on.</span>
            </h1>

            <p className="mt-6 max-w-md text-[15px] leading-7 text-slate-300/65">
              Textbooks, gadgets, notes and more. Traded between verified OIC
              students only. One college ID, one trusted system.
            </p>

            <div className="mt-8 flex items-center gap-3 text-xs text-slate-400/70">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.7)]" />
              Verified student community
            </div>
          </div>

          {/* Footer */}
          <p className="relative font-mono text-[10px] tracking-wide text-slate-500">
            VERIFIED WITH YOUR @OIC.EDU.NP ADDRESS
          </p>
        </aside>

        {/* RIGHT — ONLY THIS AREA SCROLLS */}
        <main
          className="
        min-h-0 flex-1
        overflow-y-auto
        overscroll-contain
        scrollbar-thin
        scrollbar-track-transparent
        scrollbar-thumb-white/10
        hover:scrollbar-thumb-white/20
      "
        >
          <div
            className="
          flex min-h-full
          items-center justify-center
          bg-gradient-to-br
          from-[#0a172b]/95
          via-[#081326]/95
          to-[#07101f]/95
          px-6 py-10
          sm:px-10
          lg:px-16
          xl:px-24
        "
          >
            {/* Form ambient glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/[0.035] blur-[100px]" />

            <div className="relative w-full max-w-md">
              {/* Mobile brand */}
              <div className="mb-10 flex lg:hidden">
                <span className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-marigold text-quad-dark shadow-lg shadow-marigold/10">
                    <HiOutlineBuildingLibrary className="h-4 w-4" />
                  </span>

                  <span className="font-display text-base font-semibold text-white">
                    College Marketplace
                  </span>
                </span>
              </div>

              {/* Heading */}
              <div className="mb-8">
                <span className="mb-4 inline-block font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/70">
                  {eyebrow}
                </span>

                <h2 className="font-display text-3xl font-semibold tracking-[-0.02em] text-white">
                  {title}
                </h2>

                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  {subtitle}
                </p>
              </div>

              {/* Form */}
              <div className="space-y-5">{children}</div>

              {footer && (
                <div className="mt-8 border-t border-white/[0.06] pt-6">
                  {footer}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
