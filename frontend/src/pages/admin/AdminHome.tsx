// @/pages/admin/AdminHome.tsx
import { FiUsers, FiGrid, FiTrendingUp, FiArrowUpRight } from "react-icons/fi";

const stats = [
  {
    label: "Total Users",
    value: "1,248",
    change: "+12%",
    icon: FiUsers,
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    label: "Active Listings",
    value: "342",
    change: "+8%",
    icon: FiGrid,
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    label: "Monthly Growth",
    value: "23%",
    change: "+4%",
    icon: FiTrendingUp,
    gradient: "from-amber-500 to-orange-600",
  },
];

export default function AdminHome() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Welcome back — here's what's happening today.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ label, value, change, icon: Icon, gradient }) => (
          <div
            key={label}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600">
                <FiArrowUpRight className="h-3 w-3" />
                {change}
              </span>
            </div>
            <p className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
              {value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Placeholder content area */}
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 p-10 text-center">
        <p className="text-sm font-medium text-slate-500">
          Recent activity / charts go here
        </p>
      </div>
    </div>
  );
}
