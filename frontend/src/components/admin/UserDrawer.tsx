import { FaTimes, FaCheck, FaStore } from "react-icons/fa";
import type { AdminUser } from "@/features/admin/types/user.types";
import { formatDateLong } from "../../utils/userFormat";
import UserAvatar from "./UserAvatar";
import RoleBadge from "./RoleBadge";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-slate-100 px-6 py-5">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-0.5 break-words text-sm font-medium text-slate-900">
        {value}
      </p>
    </div>
  );
}

export default function UserDrawer({
  user,
  onClose,
  onManagePosting,
}: {
  user: AdminUser;
  onClose: () => void;
  onManagePosting: (user: AdminUser) => void;
}) {
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px]"
        onClick={onClose}
      />

      {/* Panel — full screen on mobile, right drawer on larger screens */}
      <div className="absolute inset-0 flex w-full flex-col bg-white shadow-2xl transition-transform sm:inset-y-0 sm:left-auto sm:w-[460px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-semibold text-slate-900">
            User Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          {/* Identity */}
          <div className="flex flex-col items-center px-6 py-6 text-center">
            <UserAvatar name={user.fullName} userId={user.userId} size="lg" />
            <p className="mt-3 text-lg font-bold text-slate-900">
              {user.fullName}
            </p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <div className="mt-2">
              <RoleBadge role={user.role} />
            </div>
          </div>

          {/* Account */}
          <Section title="Account">
            <div className="space-y-4">
              <Field label="User ID" value={user.userId} />
              <Field label="Email" value={user.email} />
              <Field label="Phone" value={user.phone} />
              <Field label="Joined" value={formatDateLong(user.createdAt)} />
            </div>
          </Section>

          {/* Account Status */}
          <Section title="Account Status">
            <div className="space-y-2">
              <p
                className={`flex items-center gap-2 text-sm font-medium ${
                  user.isVerified ? "text-green-600" : "text-slate-400"
                }`}
              >
                <FaCheck className="text-xs" />
                {user.isVerified
                  ? "Email/Account Verified"
                  : "Account Unverified"}
              </p>
              <p
                className={`flex items-center gap-2 text-sm font-medium ${
                  user.isAllowedToPost ? "text-green-600" : "text-red-500"
                }`}
              >
                <FaCheck className="text-xs" />
                {user.isAllowedToPost
                  ? "Allowed to Post"
                  : "Posting Restricted"}
              </p>
            </div>
          </Section>

          {/* Marketplace */}
          <Section title="Marketplace">
            <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <FaStore className="text-xl text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {user.listingCount}
                </p>
                <p className="text-xs text-slate-500">
                  {user.listingCount === 1
                    ? "Active Listing"
                    : "Active Listings"}
                </p>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer action */}
        <div className="border-t border-slate-100 p-4">
          <button
            onClick={() => onManagePosting(user)}
            className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-colors ${
              user.isAllowedToPost
                ? "border border-red-200 text-red-600 hover:bg-red-50"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {user.isAllowedToPost ? "Restrict Posting" : "Allow Posting"}
          </button>
        </div>
      </div>
    </div>
  );
}
