import { FaChevronRight } from "react-icons/fa";
import type { AdminUser } from "@/features/admin/types/user.types";
import { formatDate } from "../../utils/userFormat";
import UserAvatar from "./UserAvatar";
import RoleBadge from "./RoleBadge";
import { VerificationPill, PostingPill } from "./StatusPill";

export default function UserMobileCards({
  users,
  onSelectUser,
}: {
  users: AdminUser[];
  onSelectUser: (user: AdminUser) => void;
}) {
  return (
    <div className="space-y-3 md:hidden">
      {users.map((user) => (
        <button
          key={user.userId}
          onClick={() => onSelectUser(user)}
          className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition-colors hover:bg-slate-50"
        >
          <UserAvatar name={user.fullName} userId={user.userId} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-medium text-slate-900">
                {user.fullName}
              </p>
              <RoleBadge role={user.role} />
            </div>
            <p className="truncate text-xs text-slate-400">{user.email}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
              <VerificationPill isVerified={user.isVerified} />
              <PostingPill isAllowed={user.isAllowedToPost} />
              <span className="text-slate-400">
                {user.listingCount}{" "}
                {user.listingCount === 1 ? "listing" : "listings"}
              </span>
              <span className="text-slate-400">
                {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
          <FaChevronRight className="shrink-0 text-slate-300" />
        </button>
      ))}
    </div>
  );
}
