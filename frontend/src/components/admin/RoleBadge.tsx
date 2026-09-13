import { FaShieldAlt, FaUserGraduate } from "react-icons/fa";
import type { UserRole } from "@/features/admin/types/user.types";

export default function RoleBadge({ role }: { role: UserRole }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${
        isAdmin
          ? "bg-violet-100 text-violet-700"
          : "bg-slate-100 text-slate-600"
      }`}
    >
      {isAdmin ? (
        <FaShieldAlt className="text-[10px]" />
      ) : (
        <FaUserGraduate className="text-[10px]" />
      )}
      {role}
    </span>
  );
}
