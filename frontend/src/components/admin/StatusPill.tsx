import { FaCheck, FaTimes, FaCircle } from "react-icons/fa";

export function VerificationPill({ isVerified }: { isVerified: boolean }) {
  return isVerified ? (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
      <FaCheck className="text-xs" /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400">
      <FaCircle className="text-[8px]" /> Unverified
    </span>
  );
}

export function PostingPill({ isAllowed }: { isAllowed: boolean }) {
  return isAllowed ? (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
      <FaCheck className="text-xs" /> Allowed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-500">
      <FaTimes className="text-xs" /> Restricted
    </span>
  );
}
