import { useEffect, useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

import type { AdminUser } from "@/features/admin/types/user.types";
import { formatDate } from "../../utils/userFormat";

import UserAvatar from "./UserAvatar";
import RoleBadge from "./RoleBadge";
import { VerificationPill, PostingPill } from "./StatusPill";

export type UserAction = "view-details" | "manage-posting" | "view-listings";

interface Props {
  users: AdminUser[];
  onSelectUser: (user: AdminUser) => void;
  onAction: (action: UserAction, user: AdminUser) => void;
  hasListingsRoute?: boolean;
}

export default function UsersTable({
  users,
  onSelectUser,
  onAction,
  hasListingsRoute = false,
}: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", close);

    return () => {
      document.removeEventListener("mousedown", close);
    };
  }, []);

  return (
    <div className="hidden md:block">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-slate-950">
              User directory
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Student accounts and marketplace access
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50 px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />

            <span className="text-[11px] font-semibold text-slate-500">
              {users.length.toLocaleString()} users
            </span>
          </div>
        </div>

        {/* =========================================================
            TABLE HEADER
        ========================================================= */}
        <div
          className="
            grid
            grid-cols-[2.2fr_0.8fr_1fr_1.15fr_0.8fr_0.9fr_48px]
            items-center
            gap-4
            border-b border-slate-100
            bg-slate-50/50
            px-6
            py-3
          "
        >
          {[
            "User",
            "Role",
            "Verification",
            "Posting",
            "Listings",
            "Joined",
          ].map((heading) => (
            <span
              key={heading}
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-slate-400
              "
            >
              {heading}
            </span>
          ))}

          <span />
        </div>

        {/* =========================================================
            USERS
        ========================================================= */}
        <div>
          {users.map((user) => (
            <div
              key={user.userId}
              onClick={() => onSelectUser(user)}
              className="
                group
                relative
                grid
                cursor-pointer
                grid-cols-[2.2fr_0.8fr_1fr_1.15fr_0.8fr_0.9fr_48px]
                items-center
                gap-4
                border-b
                border-slate-100
                px-6
                py-[18px]
                transition-colors
                duration-200
                last:border-b-0
                hover:bg-slate-50/60
              "
            >
              {/* ===================================================
                  ACTIVE HOVER INDICATOR
              =================================================== */}
              <div
                className="
                  absolute
                  inset-y-0
                  left-0
                  w-[2px]
                  origin-center
                  scale-y-0
                  bg-slate-950
                  transition-transform
                  duration-200
                  group-hover:scale-y-100
                "
              />

              {/* ===================================================
                  USER
              =================================================== */}
              <div className="min-w-0">
                <div className="flex items-center gap-3.5">
                  <UserAvatar name={user.fullName} userId={user.userId} />

                  <div className="min-w-0">
                    <p
                      className="
                        truncate
                        text-sm
                        font-semibold
                        tracking-[-0.01em]
                        text-slate-800
                        transition-colors
                        group-hover:text-slate-950
                      "
                    >
                      {user.fullName}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* ===================================================
                  ROLE
              =================================================== */}
              <div className="min-w-0">
                <RoleBadge role={user.role} />
              </div>

              {/* ===================================================
                  VERIFICATION
              =================================================== */}
              <div className="min-w-0">
                <VerificationPill isVerified={user.isVerified} />
              </div>

              {/* ===================================================
                  POSTING
              =================================================== */}
              <div className="min-w-0">
                <PostingPill isAllowed={user.isAllowedToPost} />
              </div>

              {/* ===================================================
                  LISTINGS
              =================================================== */}
              <div>
                <span
                  className={`
                    inline-flex
                    min-w-8
                    items-center
                    justify-center
                    rounded-lg
                    px-2.5
                    py-1.5
                    text-xs
                    font-semibold
                    tabular-nums

                    ${
                      user.listingCount > 0
                        ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100"
                        : "bg-slate-50 text-slate-400 ring-1 ring-inset ring-slate-100"
                    }
                  `}
                >
                  {user.listingCount}
                </span>
              </div>

              {/* ===================================================
                  JOINED
              =================================================== */}
              <div>
                <p className="text-xs font-medium text-slate-500">
                  {formatDate(user.createdAt)}
                </p>
              </div>

              {/* ===================================================
                  ACTIONS
              =================================================== */}
              <div
                ref={openMenuId === user.userId ? menuRef : undefined}
                className="relative flex justify-end"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();

                    setOpenMenuId(
                      openMenuId === user.userId ? null : user.userId,
                    );
                  }}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    opacity-50
                    transition-all
                    duration-200
                    hover:bg-white
                    hover:text-slate-700
                    hover:opacity-100
                    hover:shadow-[0_2px_8px_rgba(15,23,42,0.08)]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-slate-300
                    focus:ring-offset-1
                    group-hover:opacity-100
                  "
                  aria-label={`Actions for ${user.fullName}`}
                  aria-expanded={openMenuId === user.userId}
                >
                  <FaEllipsisV className="text-[11px]" />
                </button>

                {/* =================================================
                    ACTION MENU
                ================================================= */}
                {openMenuId === user.userId && (
                  <div
                    className="
                      absolute
                      right-0
                      top-10
                      z-30
                      w-56
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      p-1.5
                      shadow-[0_18px_45px_rgba(15,23,42,0.12)]
                    "
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        console.log("Clicked ");
                        setOpenMenuId(null);
                        onAction("view-details", user);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-slate-600
                        transition-colors
                        hover:bg-slate-50
                        hover:text-slate-950
                      "
                    >
                      View details
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuId(null);
                        onAction("manage-posting", user);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-sm
                        font-medium
                        text-slate-600
                        transition-colors
                        hover:bg-slate-50
                        hover:text-slate-950
                      "
                    >
                      Manage posting access
                    </button>

                    {hasListingsRoute && (
                      <>
                        <div className="my-1 border-t border-slate-100" />

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            onAction("view-listings", user);
                          }}
                          className="
                            flex
                            w-full
                            items-center
                            rounded-lg
                            px-3
                            py-2.5
                            text-left
                            text-sm
                            font-medium
                            text-slate-600
                            transition-colors
                            hover:bg-slate-50
                            hover:text-slate-950
                          "
                        >
                          View listings
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
