import { NavLink } from "react-router-dom";
import {
  HiOutlineBuildingLibrary,
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineClipboardDocumentList,
  HiOutlineHeart,
  HiOutlineEnvelopeOpen,
  HiOutlineBell,
  HiOutlineArrowRightOnRectangle,
} from "react-icons/hi2";
import { cn } from "@/lib/cn";
import { useAuth } from "@/context/AuthContext";

const NAV_ITEMS = [
  { to: "/home", label: "Home", icon: HiOutlineHome },
  { to: "/listings", label: "Listings", icon: HiOutlineSquares2X2 },
  {
    to: "/my-listings",
    label: "My Listings",
    icon: HiOutlineClipboardDocumentList,
  },
  { to: "/favourites", label: "Favourites", icon: HiOutlineHeart },
  {
    to: "/contact-requests",
    label: "Contact Requests",
    icon: HiOutlineEnvelopeOpen,
  },
  { to: "/notifications", label: "Notifications", icon: HiOutlineBell },
];

export function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-white/[0.06] bg-surface-1/80 backdrop-blur-xl">
      {/* ambient top glow */}
      <div className="pointer-events-none absolute -top-24 left-0 h-56 w-56 rounded-full bg-brand-blue/15 blur-3xl" />

      {/* Brand */}
      <div className="relative flex items-center gap-2.5 px-6 py-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-marigold/90 text-void shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
          <HiOutlineBuildingLibrary className="h-4 w-4" />
        </span>
        <span className="font-display text-[15px] font-semibold tracking-tight text-app-text">
          Quad
        </span>
      </div>

      <div className="mx-6 h-px bg-white/[0.06]" />

      {/* Nav */}
      <nav className="relative flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  cn(
                    "group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium tracking-tight transition-all duration-150",
                    isActive
                      ? "bg-white/[0.05] text-app-text shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
                      : "text-app-text-muted hover:bg-white/[0.03] hover:text-app-text",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={cn(
                        "absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-cyan transition-opacity duration-150",
                        isActive ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <Icon className="h-[18px] w-[18px] shrink-0" />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User + signout — fixed at bottom */}
      <div className="relative border-t border-white/[0.06] px-3 py-4">
        {user && (
          <div className="mb-1.5 flex items-center gap-2.5 rounded-xl px-2.5 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-surface-3 to-surface-2 font-display text-xs font-semibold text-cyan ring-1 ring-white/[0.08]">
              {user.email.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-app-text">
                {user.email}
              </p>
              <p className="truncate font-mono text-[11px] text-app-text-muted">
                {user.role} {user.isVerified}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="cursor-pointer flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium text-app-text-muted transition-colors duration-150 hover:bg-danger/10 hover:text-danger"
        >
          <HiOutlineArrowRightOnRectangle className="h-[18px] w-[18px] shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
